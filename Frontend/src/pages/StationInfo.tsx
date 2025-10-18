
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, MapPin, Train, Coffee, Accessibility, Info, Wifi } from "lucide-react";

const StationInfo = () => {
  const [searchQuery, setSearchQuery] = useState("");
  
  // Sample stations data
  const stations = [
    {
      id: "1",
      name: "Central Station",
      location: "Downtown District",
      platforms: 12,
      amenities: ["Restaurants", "Shops", "Restrooms", "WiFi", "Waiting Area", "Accessibility"],
      connections: ["Bus", "Subway", "Taxi"]
    },
    {
      id: "2",
      name: "Harbor Terminal",
      location: "Waterfront Area",
      platforms: 8,
      amenities: ["Cafes", "Shops", "Restrooms", "WiFi", "Luggage Storage"],
      connections: ["Ferry", "Bus", "Taxi"]
    },
    {
      id: "3",
      name: "Riverside Junction",
      location: "River District",
      platforms: 6,
      amenities: ["Cafes", "Restrooms", "WiFi", "Waiting Area"],
      connections: ["Bus", "Taxi"]
    }
  ];
  
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
    location: string;
    platforms: number;
    amenities: string[];
    connections: string[];
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
        <p className="text-sm text-gray-600">{station.location}</p>
      </CardHeader>
      <CardContent className="pb-2">
        <Tabs defaultValue="info">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="info">Info</TabsTrigger>
            <TabsTrigger value="amenities">Amenities</TabsTrigger>
            <TabsTrigger value="connections">Connections</TabsTrigger>
          </TabsList>
          
          <TabsContent value="info" className="space-y-3">
            <div className="flex items-center gap-2 text-sm">
              <Train size={16} className="text-blue-600" />
              <span className="text-gray-700">{station.platforms} Platforms</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Info size={16} className="text-blue-600" />
              <span className="text-gray-700">Station ID: {station.id}</span>
            </div>
          </TabsContent>
          
          <TabsContent value="amenities" className="space-y-2">
            <div className="flex flex-wrap gap-2">
              {station.amenities.map((amenity) => (
                <span key={amenity} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                  {amenity}
                </span>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="connections" className="space-y-2">
            <div className="flex flex-wrap gap-2">
              {station.connections.map((connection) => (
                <span key={connection} className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                  {connection}
                </span>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default StationInfo;
