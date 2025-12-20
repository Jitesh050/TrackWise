
import { useState, useEffect, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Filter, ArrowRight } from "lucide-react";
import TrainStatusCard from "@/components/TrainStatusCard";
import { useTrainStatus } from "@/hooks/useTrainStatus";

const mapStatusToCard = (status: string): "ontime" | "delayed" | "cancelled" | "boarding" => {
  const s = (status || "").toLowerCase();
  if (s.includes("cancel")) return "cancelled";
  if (s.includes("board")) return "boarding";
  if (s.includes("delay")) return "delayed";
  return "ontime";
};

const TrainStatus = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const { trains, loading } = useTrainStatus();
  const [params] = useSearchParams();

  // Prefill query from URL (?q=...) so redirects from the homepage are filtered immediately
  useEffect(() => {
    const q = params.get("q") || "";
    if (q) setSearchQuery(q);
  }, [params]);

  // Performance Optimization: Use useMemo for mapping and filtering to avoid extra renders and calculations
  const mappedTrains = useMemo(() => {
    return (trains || []).map((t: any) => ({
      id: String(t.id),
      trainNumber: String(t.id),
      trainName: String(t.name || ""),
      origin: String(t.from || ""),
      destination: String(t.to || ""),
      departureTime: String(t.departure || "-"),
      arrivalTime: String(t.arrival || "-"),
      status: mapStatusToCard(t.status),
      delay: typeof t.delay === 'number' ? t.delay : undefined,
      platform: t.platform ? String(t.platform) : undefined,
      progress: typeof t.progress === 'number' ? t.progress : (t.status === 'Arrived' ? 100 : t.status === 'Boarding' ? 0 : 50),
      nextStation: t.nextStation,
    }));
  }, [trains]);

  const filteredTrains = useMemo(() => {
    const query = searchQuery.toLowerCase();
    let results = mappedTrains.filter((train) =>
      !query ||
      train.trainNumber.toLowerCase().includes(query) ||
      train.trainName.toLowerCase().includes(query) ||
      train.origin.toLowerCase().includes(query) ||
      train.destination.toLowerCase().includes(query)
    );

    if (activeTab !== "all") {
      results = results.filter((train) => train.status === activeTab);
    }

    return results;
  }, [mappedTrains, searchQuery, activeTab]);
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Search is already handled by useEffect
  };
  
  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };
  
  return (
    <div className="container mx-auto space-y-8 pb-10 animate-enter">
      <header>
        <h1 className="text-3xl font-bold">Train Status</h1>
        <p className="text-gray-600">Check real-time updates on train arrivals and departures</p>
      </header>
      
      <section className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
        <form onSubmit={handleSearch}>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <Label htmlFor="search" className="mb-2 block">Search by train number, name or station</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={18} />
                <Input 
                  id="search"
                  className="pl-10"
                  placeholder="e.g. 12000 or Rajdhani NDLS-HWH"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
            <div className="flex items-end gap-2">
              <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                <Search size={18} className="mr-2" />
                Search
              </Button>
              <Button variant="outline" className="bg-gray-100 text-gray-900 hover:bg-gray-200">
                <Filter size={18} />
              </Button>
            </div>
          </div>
        </form>
      </section>
      
      <section>
        <Tabs defaultValue="all" onValueChange={handleTabChange}>
          <TabsList className="mb-6">
            <TabsTrigger value="all">All Trains</TabsTrigger>
            <TabsTrigger value="ontime">On Time</TabsTrigger>
            <TabsTrigger value="delayed">Delayed</TabsTrigger>
            <TabsTrigger value="boarding">Boarding</TabsTrigger>
            <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
          </TabsList>
          
          <TabsContent value={activeTab}>
            {filteredTrains.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredTrains.map((train) => (
                  <TrainStatusCard
                    key={train.id}
                    trainNumber={train.trainNumber}
                    trainName={train.trainName}
                    origin={train.origin}
                    destination={train.destination}
                    departureTime={train.departureTime}
                    arrivalTime={train.arrivalTime}
                    status={train.status}
                    delay={train.delay}
                    platform={train.platform}
                    progress={train.progress}
                    nextStation={train.nextStation}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-lg text-gray-600">No trains found matching your search criteria.</p>
                <Button variant="link" onClick={() => setSearchQuery("")}>
                  Clear search and view all trains
                </Button>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </section>
    </div>
  );
};

export default TrainStatus;
