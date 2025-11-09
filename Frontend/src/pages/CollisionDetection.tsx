import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle, MapPin, Train, Clock, Shield, CheckCircle, Zap } from "lucide-react";

const CollisionDetection = () => {
  const [selectedRoute, setSelectedRoute] = useState<string | null>(null);

  // Mock data - in real app, this would come from train tracking systems
  const routes = [
    {
      id: "route_1",
      name: "Central-North Line",
      trains: [
        {
          id: "EXP101",
          name: "Ocean Express", 
          position: 45.2,
          speed: 85,
          direction: "north",
          nextStation: "Junction Point",
          eta: "14:25"
        },
        {
          id: "REG205",
          name: "Valley Commuter",
          position: 52.8,
          speed: 92,
          direction: "south", 
          nextStation: "Central Hub",
          eta: "14:18"
        }
      ],
      riskLevel: "high",
      warningZone: { start: 48, end: 55 },
      lastUpdate: "2 seconds ago"
    },
    {
      id: "route_2", 
      name: "East-West Corridor",
      trains: [
        {
          id: "SPD330",
          name: "Capital Bullet",
          position: 23.5,
          speed: 110,
          direction: "east",
          nextStation: "Metro East",
          eta: "14:30"
        },
        {
          id: "LOC445", 
          name: "Suburban Local",
          position: 78.2,
          speed: 65,
          direction: "west",
          nextStation: "Business District",
          eta: "14:35"
        }
      ],
      riskLevel: "low",
      warningZone: null,
      lastUpdate: "1 second ago"
    },
    {
      id: "route_3",
      name: "Metro Circle Line", 
      trains: [
        {
          id: "CIR112",
          name: "Circle Express",
          position: 15.8,
          speed: 75,
          direction: "clockwise",
          nextStation: "North Plaza",
          eta: "14:22"
        }
      ],
      riskLevel: "safe",
      warningZone: null,
      lastUpdate: "3 seconds ago"
    }
  ];

  const getRiskColor = (level: string) => {
    switch (level) {
      case "high": return "text-red-600 bg-red-100 border-red-300";
      case "medium": return "text-yellow-600 bg-yellow-100 border-yellow-300";
      case "low": return "text-blue-600 bg-blue-100 border-blue-300";
      default: return "text-green-600 bg-green-100 border-green-300";
    }
  };

  const getRiskIcon = (level: string) => {
    switch (level) {
      case "high": return <AlertTriangle className="h-4 w-4" />;
      case "medium": return <Zap className="h-4 w-4" />;
      case "low": return <Shield className="h-4 w-4" />;
      default: return <CheckCircle className="h-4 w-4" />;
    }
  };

  // Calculate statistics
  const totalTrains = routes.reduce((sum, route) => sum + route.trains.length, 0);
  const activeStations = new Set(
    routes.flatMap(route => route.trains.map(train => train.nextStation))
  ).size;
  const averageSpeed = Math.round(
    routes.flatMap(route => route.trains).reduce((sum, train) => sum + train.speed, 0) / 
    routes.flatMap(route => route.trains).length
  );
  const highRiskRoutes = routes.filter(route => route.riskLevel === 'high').length;

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
        {routes.map((route) => (
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
                <Badge className={getRiskColor(route.riskLevel)}>
                  {getRiskIcon(route.riskLevel)}
                  <span className="ml-1 capitalize">{route.riskLevel} risk</span>
                </Badge>
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
              <div className="mt-2 text-2xl font-semibold text-green-900">98.2%</div>
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
