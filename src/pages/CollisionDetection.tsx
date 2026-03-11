import { useMemo, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { MapPin, Train, Clock, Zap, AlertTriangle } from "lucide-react";
import { useTrainStatus } from "@/hooks/useTrainStatus";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import schedules from "../../simulation/schedules_100.json";

// Pre-compute and sort schedules outside component to prevent render-blocking
let SCHEDULES_BY_TRAIN: Record<string, any[]> = {};
try {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  SCHEDULES_BY_TRAIN = (schedules as any[]).reduce((acc, s) => {
    if (!acc[s.train_no]) acc[s.train_no] = [];
    acc[s.train_no].push(s);
    return acc;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  }, {} as Record<string, any[]>);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  Object.values(SCHEDULES_BY_TRAIN).forEach((arr: any) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    arr.sort((a: any, b: any) => (a.day_offset - b.day_offset) || (a.seq - b.seq));
  });
} catch {
  SCHEDULES_BY_TRAIN = {};
}

const CollisionDetection = () => {
  const [selectedRoute, setSelectedRoute] = useState<string | null>(null);
  const { trains } = useTrainStatus();

  const groups = useMemo(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const byStation = new Map<string, any[]>();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (trains || []).forEach((t: any) => {
      const key = t.nextStation || "En Route";
      const arr = byStation.get(key) || [];
      arr.push(t);
      byStation.set(key, arr);
    });
    const list = Array.from(byStation.entries()).map(([station, arr], idx) => {
      const riskLevel = arr.length >= 3 ? "high" : arr.length === 2 ? "low" : "safe";
      return {
        id: String(idx + 1),
        name: station,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        trains: arr.map((t: any) => ({
          id: String(t.id),
          name: String(t.name || "Unknown"),
          nextStation: station,
          eta: t.arrival || t.departure || "--:--",
        })),
        riskLevel,
        lastUpdate: "just now",
      };
    });
    return list;
  }, [trains]);

  // Risk badges removed per request

  // ⚡ Bolt Performance Optimization:
  // - Moved O(N) schedules grouping/sorting out of component to module scope (SCHEDULES_BY_TRAIN) to prevent redundant render-blocking computation.
  // - Consolidated O(N) array traversals (totalTrains, activeStations, onTimePct, averageSpeed) into a single pass wrapped in useMemo.
  // - Replaced expensive array methods (.map().filter().length) with Set size and primitive accumulator tracking.
  // - Hoisted static string comparison ("on time") outside of the train iteration loop.
  const { totalTrains, activeStations, onTimePct, averageSpeed } = useMemo(() => {
    const list = trains || [];
    const total = list.length;
    if (!total) return { totalTrains: 0, activeStations: 0, onTimePct: 0, averageSpeed: 0 };

    let onTimeCount = 0;
    const stations = new Set<string>();

    const onTimeTarget = "on time";

    // Calculate onTime and active stations in a single pass
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    list.forEach((t: any) => {
      if (t.nextStation) stations.add(t.nextStation);
      if (String(t.status).toLowerCase().includes(onTimeTarget)) {
        onTimeCount += 1;
      }
    });

    const active = stations.size;
    const pct = Math.round((onTimeCount / total) * 1000) / 10;

    let avgSpeed = 0;
    try {
      const speeds: number[] = [];
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      list.forEach((t: any) => {
        const arr = SCHEDULES_BY_TRAIN[String(t.id)];
        if (!arr || arr.length < 2) return;
        const first = arr[0];
        const last = arr[arr.length - 1];
        const km = Math.max(0, (last.cum_distance_km || 0) - (first.cum_distance_km || 0));
        const dep = (first.departure || first.arrival || "00:00").split(":");
        const arrv = (last.arrival || last.departure || "00:00").split(":");
        const depMin = (first.day_offset || 0) * 1440 + (+dep[0]||0)*60 + (+dep[1]||0);
        const arrMin = (last.day_offset || 0) * 1440 + (+arrv[0]||0)*60 + (+arrv[1]||0);
        const hours = Math.max(0.1, (arrMin - depMin) / 60);
        speeds.push(km / hours);
      });
      if (speeds.length) {
        avgSpeed = Math.round(speeds.reduce((a, b) => a + b, 0) / speeds.length);
      }
    } catch {
      // Keep 0
    }

    return { totalTrains: total, activeStations: active, onTimePct: pct, averageSpeed: avgSpeed };
  }, [trains]);
  const highRiskRoutes = groups.filter(g => g.riskLevel === 'high').length;

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Railway Network Dashboard</h1>
      
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card className="bg-blue-50 border-blue-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Trains</CardTitle>
            <Train className="h-5 w-5 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{totalTrains}</div>
            <p className="text-xs text-muted-foreground">Active in network</p>
          </CardContent>
        </Card>

        <Card className="bg-green-50 border-green-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Stations</CardTitle>
            <MapPin className="h-5 w-5 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{activeStations}</div>
            <p className="text-xs text-muted-foreground">Currently serving trains</p>
          </CardContent>
        </Card>

        <Card className="bg-amber-50 border-amber-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Speed</CardTitle>
            <Zap className="h-5 w-5 text-amber-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{averageSpeed} <span className="text-sm">km/h</span></div>
            <p className="text-xs text-muted-foreground">Across all routes</p>
          </CardContent>
        </Card>

        <Card className="bg-red-50 border-red-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">High Risk Routes</CardTitle>
            <AlertTriangle className="h-5 w-5 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{highRiskRoutes}</div>
            <p className="text-xs text-muted-foreground">Require attention</p>
          </CardContent>
        </Card>
      </div>

      <h2 className="text-2xl font-semibold mb-4">Collision Detection System</h2>
      <p className="text-gray-600 mb-6">Real-time monitoring and prediction of potential train conflicts</p>

      {/* Routes List */}
      <div className="space-y-4">
        {groups.map((route) => (
          <Card key={route.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">{route.name}</CardTitle>
                  <CardDescription>
                    {route.trains.length} active train{route.trains.length !== 1 ? 's' : ''} • 
                    Last updated {route.lastUpdate}
                  </CardDescription>
                </div>
                {/* risk badge removed */}
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {route.trains.map((train) => (
                  <div key={train.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-blue-100 rounded-full">
                        <Train className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium">{train.name}</p>
                        <p className="text-sm text-gray-500">ID: {train.id}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">
                        <MapPin className="inline h-4 w-4 mr-1 text-gray-500" />
                        {train.nextStation}
                      </div>
                      <div className="text-sm text-gray-500">
                        <Clock className="inline h-3 w-3 mr-1" />
                        ETA: {train.eta}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Key Metrics (replacing Active Warnings UI) */}
      <Card className="mt-6">
        <CardHeader className="pb-3">
          <CardTitle>Key Metrics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="rounded-xl border border-blue-200 bg-blue-50 p-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-blue-700">Trains Online</span>
                <Train className="h-4 w-4 text-blue-600" />
              </div>
              <div className="mt-2 text-2xl font-semibold text-blue-900">{totalTrains}</div>
            </div>

            <div className="rounded-xl border border-green-200 bg-green-50 p-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-green-700">On-Time %</span>
                <Clock className="h-4 w-4 text-green-600" />
              </div>
              <div className="mt-2 text-2xl font-semibold text-green-900">{onTimePct}%</div>
            </div>

            <div className="rounded-xl border border-indigo-200 bg-indigo-50 p-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-indigo-700">Stations Active</span>
                <MapPin className="h-4 w-4 text-indigo-600" />
              </div>
              <div className="mt-2 text-2xl font-semibold text-indigo-900">{activeStations}</div>
            </div>

            <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-amber-700">Passenger Load</span>
                <Zap className="h-4 w-4 text-amber-600" />
              </div>
              <div className="mt-2 text-2xl font-semibold text-amber-900">67%</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CollisionDetection;
