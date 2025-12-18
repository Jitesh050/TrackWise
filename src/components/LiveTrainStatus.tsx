import { useEffect, useState, useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Search } from "lucide-react";
import { useSearchParams } from "react-router-dom";

import { useTrainStatus } from "@/hooks/useTrainStatus";
import TrainStatusCard from "@/components/TrainStatusCard";

const LiveTrainStatus = () => {
  const [searchTrain, setSearchTrain] = useState("");
  // Debounced search term to avoid filtering on every keystroke
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const { trains, loading, updateTrainStatus } = useTrainStatus();
  const [filter, setFilter] = useState<"all" | "ontime" | "delayed" | "boarding" | "cancelled">("all");
  const [params] = useSearchParams();

  // Prefill from URL query (?q=...) so navigation from the homepage filters immediately
  useEffect(() => {
    const q = params.get("q") || "";
    if (q) {
      setSearchTrain(q);
      setDebouncedSearch(q);
    }
  }, [params]);

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTrain);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchTrain]);

  const filteredTrains = useMemo(() => {
    const mapStatusToCard = (status: string): "ontime" | "delayed" | "cancelled" | "boarding" => {
      const s = (status || "").toLowerCase();
      if (s.includes("cancel")) return "cancelled";
      if (s.includes("board")) return "boarding";
      if (s.includes("delay")) return "delayed";
      return "ontime";
    };

    const query = debouncedSearch.trim().toLowerCase();

    return (trains || []).filter((t: any) => {
      const matchesQuery = !query ||
        String(t.id).toLowerCase().includes(query) ||
        String(t.name || "").toLowerCase().includes(query) ||
        String(t.from || "").toLowerCase().includes(query) ||
        String(t.to || "").toLowerCase().includes(query);
      const cardStatus = mapStatusToCard(t.status);
      const matchesFilter = filter === "all" || cardStatus === filter;
      return matchesQuery && matchesFilter;
    });
  }, [trains, debouncedSearch, filter]);

  const handleSearch = async () => {
    // keep a tiny debounce to avoid spamming state
    setIsSearching(true);
    await new Promise(resolve => setTimeout(resolve, 200));
    setIsSearching(false);
  };

  const setOnTime = (t: any) => updateTrainStatus(String(t.id), 'On Time', 0, t.nextStation);
  const setBoarding = (t: any) => updateTrainStatus(String(t.id), 'Boarding', 0, t.nextStation);
  const setCancelled = (t: any) => updateTrainStatus(String(t.id), 'Cancelled', 0, t.nextStation);
  const addDelay5 = (t: any) => {
    const current = typeof t.delay === 'number' ? t.delay : 0;
    updateTrainStatus(String(t.id), 'Delayed', current + 5, t.nextStation);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "On Time":
        return "bg-green-100 text-green-800";
      case "Delayed":
        return "bg-red-100 text-red-800";
      case "Cancelled":
        return "bg-gray-100 text-gray-800";
      case "Departed":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getDelayColor = (delay: number) => {
    if (delay === 0) return "text-green-600";
    if (delay <= 10) return "text-yellow-600";
    return "text-red-600";
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Live Train Status</h2>
        <p className="text-gray-600">Get real-time updates on train schedules and delays</p>
      </div>

      {/* Search Section */}
      <Card>
        <CardHeader>
          <CardTitle>Track Your Train</CardTitle>
          <CardDescription>Enter train number, name or station to filter live status</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <div className="flex-1">
              <Label htmlFor="trainSearch">Train Number / Name</Label>
              <Input
                id="trainSearch"
                placeholder="e.g. 12000 or Rajdhani NDLS-HWH"
                value={searchTrain}
                onChange={(e) => setSearchTrain(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              />
            </div>
            <div className="flex items-end">
              <Button onClick={handleSearch} disabled={isSearching || loading} className="bg-blue-600 hover:bg-blue-700">
                <Search size={16} className="mr-2" />
                {loading ? "Loading..." : isSearching ? "Searching..." : "Search"}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        {(["all","ontime","delayed","boarding","cancelled"] as const).map((f) => (
          <Button key={f} variant={filter === f ? "default" : "outline"} size="sm" onClick={() => setFilter(f)}>
            {f === "all" ? "All Trains" : f.charAt(0).toUpperCase() + f.slice(1)}
          </Button>
        ))}
      </div>

      {/* Grid of train status cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredTrains.map((t: any) => (
          <div key={t.id} className="space-y-2">
            <TrainStatusCard
              trainNumber={String(t.id)}
              trainName={String(t.name || "")}
              origin={String(t.from || "")}
              destination={String(t.to || "")}
              departureTime={String(t.departure || "-")}
              arrivalTime={String(t.arrival || "-")}
              status={mapStatusToCard(t.status)}
              delay={typeof t.delay === 'number' ? t.delay : 0}
              platform={t.platform ? String(t.platform) : undefined}
              nextStation={t.nextStation}
              progress={typeof t.progress === 'number' ? t.progress : (t.status === 'Arrived' ? 100 : t.status === 'Boarding' ? 0 : 50)}
            />
            <div className="flex flex-wrap gap-2">
              <Button size="sm" variant="outline" onClick={() => addDelay5(t)}>+5 min delay</Button>
              <Button size="sm" variant="outline" onClick={() => setOnTime(t)}>Set On Time</Button>
              <Button size="sm" variant="outline" onClick={() => setBoarding(t)}>Set Boarding</Button>
              <Button size="sm" variant="destructive" onClick={() => setCancelled(t)}>Cancel</Button>
            </div>
          </div>
        ))}
      </div>
      {filteredTrains.length === 0 && (
        <Card>
          <CardContent className="py-8 text-center text-gray-600">
            No trains match your search/filter. Try another query.
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default LiveTrainStatus;