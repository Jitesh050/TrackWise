import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MapPin, Star, Clock, ExternalLink, RefreshCw, Phone } from 'lucide-react';
import { stations } from '@/lib/stationData';
import { useStationDetails } from '@/hooks/useStationDetails';
import ChatBot from '@/components/ChatBot';

const TripPlannerPage = () => {
  const [selectedStationId, setSelectedStationId] = useState<string>('');
  const selectedStation = stations.find(station => station.id === selectedStationId);
  
  const { stationDetails, loading, error, refetch } = useStationDetails(selectedStation || stations[0]);

  const handleStationChange = (stationId: string) => {
    setSelectedStationId(stationId);
  };

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Trip Planner</h1>
        <p className="text-lg text-gray-600 mb-8">
          Discover tourist attractions and hotels near railway stations across India
        </p>
        
        {/* Station Selection */}
        <div className="max-w-md mx-auto mb-8">
          <Select value={selectedStationId} onValueChange={handleStationChange}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select a railway station..." />
            </SelectTrigger>
            <SelectContent className="max-h-60">
              {stations.map((station) => (
                <SelectItem key={station.id} value={station.id}>
                  {station.name} ({station.state})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        {error && (
          <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg max-w-md mx-auto">
            <span className="text-red-600 text-sm">{error}</span>
            <Button size="sm" variant="outline" onClick={refetch}>
              <RefreshCw className="h-4 w-4 mr-1" />
              Retry
            </Button>
          </div>
        )}
      </div>

      {/* Station Details */}
      {stationDetails && (
        <div className="space-y-8">
          {/* Station Info Header */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-blue-600" />
                {stationDetails.name}
              </CardTitle>
              <CardDescription>
                {stationDetails.state} • Coordinates: {stationDetails.lat.toFixed(4)}, {stationDetails.lon.toFixed(4)}
              </CardDescription>
            </CardHeader>
          </Card>

          {/* Two-column layout: listings + chatbot */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-8">
              {/* Hotels Section */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-blue-600" />
                    Recommended Hotels near {stationDetails.name}
                  </CardTitle>
                  <CardDescription>Hotels and accommodations close to the railway station</CardDescription>
                </CardHeader>
                <CardContent>
                  {stationDetails.hotels.length > 0 ? (
                    <div className="max-h-96 overflow-y-auto pr-2 space-y-4 trip-planner-scroll" style={{
                      scrollbarWidth: 'thin',
                      scrollbarColor: '#cbd5e1 #f1f5f9'
                    }}>
                      {stationDetails.hotels.map((hotel, index) => (
                        <div key={index} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <h3 className="font-semibold text-lg">{hotel.name}</h3>
                              <div className="flex items-center gap-2 mt-1">
                                <div className="flex items-center gap-1 text-yellow-500">
                                  <Star className="h-4 w-4 fill-current" />
                                  <span className="text-sm font-medium">{hotel.rating}</span>
                                </div>
                                <span className="text-green-600 font-semibold">{hotel.price}</span>
                              </div>
                            </div>
                          </div>
                          <p className="text-gray-600 text-sm mb-3">{hotel.address}</p>
                          <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                            <div className="flex items-center gap-1">
                              <MapPin className="h-4 w-4" />
                              <span className="font-medium">{hotel.distance}</span>
                            </div>
                            {hotel.phone !== '+91-XXXX-XXXXXX' && (
                              <div className="flex items-center gap-1">
                                <Phone className="h-4 w-4" />
                                <span>{hotel.phone}</span>
                              </div>
                            )}
                          </div>
                          <div className="flex flex-wrap gap-1 mb-3">
                            {hotel.amenities.slice(0, 4).map((amenity, idx) => (
                              <span key={idx} className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                                {amenity}
                              </span>
                            ))}
                          </div>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => window.open(hotel.website, '_blank')}
                            className="w-full"
                          >
                            <ExternalLink className="h-4 w-4 mr-1" />
                            Visit Website
                          </Button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      No hotels found near this station. Try refreshing or check back later.
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Tourist Attractions Section */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-green-600" />
                    Tourist Attractions near {stationDetails.name}
                  </CardTitle>
                  <CardDescription>Popular places to visit near the railway station</CardDescription>
                </CardHeader>
                <CardContent>
                  {stationDetails.touristSpots.length > 0 ? (
                    <div className="max-h-96 overflow-y-auto pr-2 space-y-4 trip-planner-scroll" style={{
                      scrollbarWidth: 'thin',
                      scrollbarColor: '#cbd5e1 #f1f5f9'
                    }}>
                      {stationDetails.touristSpots.map((attraction, index) => (
                        <div key={index} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <h3 className="font-semibold text-lg">{attraction.name}</h3>
                              <div className="flex items-center gap-2 mt-1">
                                <div className="flex items-center gap-1 text-yellow-500">
                                  <Star className="h-4 w-4 fill-current" />
                                  <span className="text-sm font-medium">{attraction.rating}</span>
                                </div>
                                <span className="text-sm text-gray-600">{attraction.type}</span>
                              </div>
                            </div>
                          </div>
                          <p className="text-gray-600 text-sm mb-3 line-clamp-2">{attraction.description}</p>
                          <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                            <div className="flex items-center gap-1">
                              <MapPin className="h-4 w-4" />
                              <span className="font-medium">{attraction.distance}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="h-4 w-4" />
                              <span>{attraction.openHours}</span>
                            </div>
                          </div>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => window.open(attraction.googleMapsLink, '_blank')}
                            className="w-full"
                          >
                            <ExternalLink className="h-4 w-4 mr-1" />
                            Get Directions on Google Maps
                          </Button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      No tourist attractions found near this station. Try refreshing or check back later.
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Embedded Chat Assistant */}
            <div className="lg:col-span-1">
              <ChatBot />
            </div>
          </div>
        </div>
      )}

      {/* Loading State */}
      {loading && !stationDetails && (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <RefreshCw className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-4" />
            <p className="text-gray-600">Loading station details...</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default TripPlannerPage;