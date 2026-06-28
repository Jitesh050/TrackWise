import { useMemo, useState, useEffect, useRef } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Mic, Volume2, Clock, Train, AlertTriangle, Megaphone } from "lucide-react";
import { useTrainStatus } from "@/hooks/useTrainStatus";

type StationAnnouncement = {
  id: string;
  timestamp: string;
  station: string;
  message: string;
  type: "arrival" | "delay";
};

const AIStationManagement = () => {
  const { trains } = useTrainStatus();
  const [announcements, setAnnouncements] = useState<StationAnnouncement[]>([]);
  const [filter, setFilter] = useState<string>("");
  const firedKeysRef = useRef<Set<string>>(new Set());

  const groups = useMemo(() => {
    const map = new Map<string, any[]>();
    (trains || []).forEach((t: any) => {
      const st = t.nextStation || "En Route";
      const arr = map.get(st) || [];
      arr.push(t);
      map.set(st, arr);
    });
    return Array.from(map.entries())
      .map(([station, list]) => ({ station, list }))
      .sort((a,b) => a.station.localeCompare(b.station));
  }, [trains]);

  const speak = (text: string) => {
    try {
      if (typeof window !== 'undefined' && (window as any).speechSynthesis) {
        const u = new SpeechSynthesisUtterance(text);
        (window as any).speechSynthesis.speak(u);
      }
    } catch {
      // ignore
    }
  };

  const addAnnouncement = (station: string, message: string, type: "arrival" | "delay") => {
    const entry: StationAnnouncement = {
      id: Math.random().toString(36).slice(2),
      station,
      message,
      type,
      timestamp: new Date().toISOString(),
    };
    setAnnouncements((prev) => [entry, ...prev].slice(0, 100));
    speak(message);
  };

  const handleAnnounceArrivals = (station: string, list: any[]) => {
    // Announce trains whose ETA time string is within the next 30 minutes if available, else all next 3
    const nowMin = (() => { const d=new Date(); return d.getHours()*60 + d.getMinutes(); })();
    const pick = list
      .map((t) => ({
        id: t.id,
        name: t.name,
        etaStr: String(t.arrival || t.departure || "--:--"),
      }))
      .map((r) => {
        const [h,m] = r.etaStr.split(":").map((x: string)=>parseInt(x||"0",10));
        const eta = (isNaN(h)||isNaN(m)) ? Infinity : h*60+m;
        return { ...r, eta };
      })
      .filter((r) => r.eta >= nowMin && r.eta <= nowMin + 30)
      .sort((a,b)=>a.eta-b.eta)
      .slice(0, 3);

    const announceList = pick.length ? pick : list.slice(0,3).map((t:any)=>({ id:t.id, name:t.name, etaStr:String(t.arrival||t.departure||"--:--"), from: t.from, to: t.to }));
    announceList.forEach((r:any) => {
      const origin = r.from || 'origin';
      const dest = r.to || 'destination';
      const msg = `Attention please. Train ${r.id} ${r.name} from ${origin} to ${dest} will arrive at ${station} at ${r.etaStr}.`;
      addAnnouncement(station, msg, "arrival");
    });
  };

  const handleAnnounceDelays = (station: string, list: any[]) => {
    const delayed = list.filter((t:any)=> String(t.status).toLowerCase().includes('delay'));
    if (!delayed.length) {
      addAnnouncement(station, `No delays reported for ${station}.`, "delay");
      return;
    }
    delayed.slice(0,3).forEach((t:any)=>{
      const mins = typeof t.delay === 'number' ? t.delay : 0;
      const at = String(t.arrival || t.departure || "--:--");
      const origin = t.from || 'origin';
      const dest = t.to || 'destination';
      const msg = `Announcement for ${station}: Train ${t.id} ${t.name} from ${origin} to ${dest} is delayed by ${mins} minutes. Expected time ${at}.`;
      addAnnouncement(station, msg, "delay");
    });
  };

  // Auto announcements at T-10, T-5, and T-0 minutes before ETA
  useEffect(() => {
    const tick = () => {
      const now = new Date();
      const nowMin = now.getHours() * 60 + now.getMinutes();
      const thresholds = [10, 5, 0];
      (trains || []).forEach((t: any) => {
        const station = t.nextStation || "En Route";
        const etaStr = String(t.arrival || t.departure || "--:--");
        const parts = etaStr.split(":");
        if (parts.length < 2) return;
        const h = parseInt(parts[0] || "0", 10);
        const m = parseInt(parts[1] || "0", 10);
        if (Number.isNaN(h) || Number.isNaN(m)) return;
        const eta = h * 60 + m;
        const diff = eta - nowMin;

        thresholds.forEach((th) => {
          if (diff === th) {
            const key = `${t.id}|${station}|${etaStr}|${th}`;
            if (!firedKeysRef.current.has(key)) {
              firedKeysRef.current.add(key);
              const origin = t.from || "origin";
              const dest = t.to || "destination";
              let msg = "";
              if (th === 0) {
                msg = `Attention please. Train ${t.id} ${t.name} is arriving at ${station} now. Platform ${t.platform}.`;
              } else {
                msg = `Attention please. Train ${t.id} ${t.name} from ${origin} to ${dest} will arrive at ${station} in ${th} minutes at ${etaStr}. Platform ${t.platform}.`;
              }
              addAnnouncement(station, msg, "arrival");
            }
          }
        });
      });
    };

    // initial run and 30s interval
    tick();
    const interval = setInterval(tick, 30000);
    return () => clearInterval(interval);
  }, [trains]);

  const visibleGroups = groups.filter(g => !filter || g.station.toLowerCase().includes(filter.toLowerCase()));

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">AI Station Management</h1>
          <p className="text-gray-600">Station-scoped AI agent for operational announcements</p>
        </div>
        <div className="flex items-end gap-3">
          <div className="space-y-1">
            <Label htmlFor="stationFilter">Filter stations</Label>
            <Input id="stationFilter" placeholder="Type station name" value={filter} onChange={(e)=>setFilter(e.target.value)} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Stations */}
        <Card className="border-gray-200">
          <CardHeader className="pb-3">
            <CardTitle>Stations</CardTitle>
            <CardDescription>Grouped live trains by next station</CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[65vh] pr-2">
              <div className="space-y-4">
                {visibleGroups.map(({ station, list }) => (
                  <div key={station} className="rounded-xl border p-4 bg-white">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <Megaphone className="h-4 w-4 text-blue-600" />
                        <h3 className="font-semibold text-gray-900">{station}</h3>
                        <Badge variant="outline" className="ml-2">{list.length} trains</Badge>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" onClick={()=>handleAnnounceArrivals(station, list)}>
                          <Volume2 className="h-4 w-4 mr-1" /> Announce Arrivals
                        </Button>
                        <Button size="sm" variant="outline" onClick={()=>handleAnnounceDelays(station, list)}>
                          <AlertTriangle className="h-4 w-4 mr-1" /> Announce Delays
                        </Button>
                      </div>
                    </div>
                    <div className="space-y-2">
                      {list.map((t:any)=>(
                        <div key={t.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-blue-100 rounded-md">
                              <Train className="h-4 w-4 text-blue-700" />
                            </div>
                            <div>
                              <div className="font-medium text-gray-900">{t.name}</div>
                              <div className="text-xs text-gray-600">ID: {t.id}</div>
                            </div>
                          </div>
                          <div className="text-right text-sm">
                            <div className="text-gray-900">ETA {String(t.arrival || t.departure || '--:--')}</div>
                            <div className="text-xs text-gray-600">
                              {String(t.from || '')} → {String(t.to || '')}
                            </div>
                            <div className={`text-xs ${String(t.status).includes('Delayed') ? 'text-amber-700' : 'text-green-700'}`}>
                              {t.status}{typeof t.delay==='number' && t.delay>0 ? ` • ${t.delay}m` : ''}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
                {visibleGroups.length === 0 && (
                  <div className="text-sm text-gray-500">No stations match the filter.</div>
                )}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Agent output */}
        <Card className="border-gray-200">
          <CardHeader className="pb-3">
            <CardTitle>AI Announcements</CardTitle>
            <CardDescription>Generated station announcements</CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[65vh] pr-2">
              <div className="space-y-3">
                {announcements.map((a) => (
                  <div key={a.id} className="rounded-lg border p-3 bg-gray-50">
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        {a.type === 'delay' ? <AlertTriangle className="h-4 w-4 text-amber-600"/> : <Clock className="h-4 w-4 text-blue-600"/>}
                        <span className="font-medium text-gray-900">{a.station}</span>
                        <Badge variant="outline" className="text-xs">{a.type}</Badge>
                      </div>
                      <span className="text-xs text-gray-500">{new Date(a.timestamp).toLocaleTimeString()}</span>
                    </div>
                    <div className="text-sm text-gray-800">{a.message}</div>
                  </div>
                ))}
                {announcements.length === 0 && (
                  <div className="text-sm text-gray-500">No announcements yet. Select a station and use Announce buttons.</div>
                )}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AIStationManagement;


