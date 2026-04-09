import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, MapPin, Train, Info } from "lucide-react";
import { stations as stationList } from "@/lib/stationData";

const StationInfo = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const stations = stationList
    .filter(s =>
      s.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.state.toLowerCase().includes(searchQuery.toLowerCase())
    );

  return (
    <div className="container mx-auto space-y-8 pb-10 animate-enter">
      <header>
        <h1 className="text-3xl font-bold text-gray-900">Station Information</h1>
        <p className="text-gray-600">Find details about our stations, amenities, and facilities</p>
      </header>

      <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
        <div className="relative max-w-lg mx-auto">
          <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={18} />
          <Input
            type="text"
            placeholder="Search for a station"
            className="pl-10 bg-gray-50 text-gray-900 border-gray-300 placeholder:text-gray-500 focus:border-blue-500 focus:ring-blue-500/20"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Button className="absolute right-0 top-0 rounded-l-none bg-blue-600 hover:bg-blue-700">
            <Search size={18} />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stations.map((station) => (
          <StationCard key={station.id} station={station} />
        ))}
      </div>
    </div>
  );
};

interface StationCardProps {
  station: {
    id: string;
    name: string;
    lat: number;
    lon: number;
    state: string;
  };
}

const StationCard = ({ station }: StationCardProps) => {
  return (
    <Card className="border-gray-200 shadow-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-gray-900">
          <MapPin size={18} className="text-blue-600" />
          {station.name}
        </CardTitle>
        <p className="text-sm text-gray-600">{station.id} • {station.state}</p>
      </CardHeader>
      <CardContent className="pb-2">
        <Tabs defaultValue="info">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="info">Info</TabsTrigger>
            <TabsTrigger value="amenities">Location</TabsTrigger>
            <TabsTrigger value="connections">Links</TabsTrigger>
          </TabsList>

          <TabsContent value="info" className="space-y-3">
            <div className="flex items-center gap-2 text-sm">
              <Train size={16} className="text-blue-600" />
              <span className="text-gray-700">Station Code: {station.id}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Info size={16} className="text-blue-600" />
              <span className="text-gray-700">State: {station.state}</span>
            </div>
          </TabsContent>

          <TabsContent value="amenities" className="space-y-2 text-sm text-gray-700">
            <div>Coordinates: {station.lat.toFixed(4)}, {station.lon.toFixed(4)}</div>
          </TabsContent>

          <TabsContent value="connections" className="space-y-2 text-sm text-blue-700">
            <a href={`https://www.google.com/maps/search/?api=1&query=${station.lat},${station.lon}`} target="_blank" rel="noreferrer">Open in Google Maps</a>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default StationInfo;
