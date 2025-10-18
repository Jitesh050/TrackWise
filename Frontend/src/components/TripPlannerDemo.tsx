import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Star, Globe, ExternalLink, Loader2 } from "lucide-react";
import { stations } from "@/lib/stationData";
import { useStationDetails } from "@/hooks/useStationDetails";

const TripPlannerDemo = () => {
  const [selectedStationId, setSelectedStationId] = useState<string>("SBC");
  const selectedStation = stations.find(station => station.id === selectedStationId) || stations[0];
  const { stationDetails, loading, error } = useStationDetails(selectedStation);

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-2">Trip Planner Demo</h1>
        <p className="text-gray-600">Select a station to see nearby hotels and attractions</p>
      </div>

      {/* Station Selector */}
      <Card>
        <CardHeader>
          <CardTitle>Select Railway Station</CardTitle>
          <CardDescription>Choose from 25 major stations across India</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2">
            {stations.slice(0, 10).map((station) => (
              <Button
                key={station.id}
                variant={selectedStationId === station.id ? "default" : "outline"}
                onClick={() => setSelectedStationId(station.id)}
                className="justify-start text-left h-auto p-2"
              >
                <div>
                  <div className="font-medium text-xs">{station.name.split(' ')[0]}</div>
                  <div className="text-xs text-gray-500">{station.state}</div>
                </div>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Station Details */}
      {loading && (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin mr-2" />
          <span>Loading station details...</span>
        </div>
      )}

      {error && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <p className="text-red-600">Error: {error}</p>
          </CardContent>
        </Card>
      )}

      {stationDetails && (
        <div className="space-y-6">
          {/* Station Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-blue-600" />
                {stationDetails.name}
              </CardTitle>
              <CardDescription>
                {stationDetails.state} • {stationDetails.lat.toFixed(4)}, {stationDetails.lon.toFixed(4)}
              </CardDescription>
            </CardHeader>
          </Card>

          {/* Hotels Preview */}
          <Card>
            <CardHeader>
              <CardTitle>Nearby Hotels ({stationDetails.hotels.length})</CardTitle>
              <CardDescription>Hotels and accommodations near the station</CardDescription>
            </CardHeader>
            <CardContent>
              {stationDetails.hotels.length > 0 ? (
                <div className="space-y-3">
                  {stationDetails.hotels.slice(0, 2).map((hotel, index) => (
                    <div key={index} className="border rounded-lg p-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-semibold">{hotel.name}</h3>
                          <div className="flex items-center gap-2 mt-1">
                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                            <span className="text-sm">{hotel.rating}</span>
                            <span className="text-sm text-gray-500">•</span>
                            <span className="text-sm text-gray-500">{hotel.distance}</span>
                          </div>
                          <p className="text-sm text-gray-600 mt-1">{hotel.price}</p>
                        </div>
                        <Button size="sm" variant="outline">
                          <Globe className="h-4 w-4 mr-1" />
                          Website
                        </Button>
                      </div>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {hotel.amenities.slice(0, 3).map((amenity) => (
                          <Badge key={amenity} variant="outline" className="text-xs">
                            {amenity}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-4">No hotels found</p>
              )}
            </CardContent>
          </Card>

          {/* Attractions Preview */}
          <Card>
            <CardHeader>
              <CardTitle>Tourist Attractions ({stationDetails.touristSpots.length})</CardTitle>
              <CardDescription>Popular places to visit near the station</CardDescription>
            </CardHeader>
            <CardContent>
              {stationDetails.touristSpots.length > 0 ? (
                <div className="space-y-3">
                  {stationDetails.touristSpots.slice(0, 2).map((attraction, index) => (
                    <div key={index} className="border rounded-lg p-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-semibold">{attraction.name}</h3>
                          <Badge variant="secondary" className="mt-1 text-xs">
                            {attraction.type}
                          </Badge>
                          <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                            {attraction.description}
                          </p>
                          <div className="flex items-center gap-2 mt-1 text-sm text-gray-500">
                            <MapPin className="h-3 w-3" />
                            {attraction.distance}
                          </div>
                        </div>
                        <Button size="sm" variant="outline">
                          <ExternalLink className="h-4 w-4 mr-1" />
                          Directions
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-4">No attractions found</p>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default TripPlannerDemo;
