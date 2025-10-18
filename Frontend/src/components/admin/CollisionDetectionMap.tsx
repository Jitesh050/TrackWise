
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle, MapPin, Train, Zap, Bell, StopCircle } from "lucide-react";

interface TrainPosition {
  id: string;
  name: string;
  lat: number;
  lng: number;
  speed: number;
  direction: number;
  status: 'normal' | 'warning' | 'emergency';
  route: string;
}

const CollisionDetectionMap = () => {
  const [trains, setTrains] = useState<TrainPosition[]>([
    {
      id: "T001",
      name: "Express 101",
      lat: 40.7128,
      lng: -74.0060,
      speed: 85,
      direction: 45,
      status: 'warning',
      route: "Central-North"
    },
    {
      id: "T002", 
      name: "Local 205",
      lat: 40.7580,
      lng: -73.9855,
      speed: 65,
      direction: 225,
      status: 'normal',
      route: "East-West"
    },
    {
      id: "T003",
      name: "Bullet 330",
      lat: 40.7489,
      lng: -73.9857,
      speed: 120,
      direction: 180,
      status: 'emergency',
      route: "Metro Circle"
    }
  ]);

  const [collisionWarnings, setCollisionWarnings] = useState([
    {
      id: "W001",
      trainIds: ["T001", "T003"],
      severity: "high",
      distance: 2.5,
      timeToCollision: 45,
      message: "Potential collision detected between Express 101 and Bullet 330"
    }
  ]);

  const sendEmergencyStop = (trainId: string) => {
    setTrains(prev => prev.map(train => 
      train.id === trainId 
        ? { ...train, status: 'emergency', speed: 0 }
        : train
    ));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'emergency': return 'bg-red-500';
      case 'warning': return 'bg-yellow-500';
      default: return 'bg-green-500';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Collision Detection System</h2>
        <div className="flex gap-2">
          <Badge variant="outline" className="text-green-600">System Active</Badge>
          <Badge variant="outline" className="text-red-600">1 Warning</Badge>
        </div>
      </div>

      {/* Map Container */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Live Train Tracking Map
          </CardTitle>
          <CardDescription>Real-time positions and collision predictions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative bg-gray-100 rounded-lg h-96 overflow-hidden">
            {/* Simulated Map Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-green-50">
              {/* Railway Lines */}
              <svg className="absolute inset-0 w-full h-full">
                <line x1="10%" y1="50%" x2="90%" y2="20%" stroke="#4B5563" strokeWidth="3" strokeDasharray="5,5" />
                <line x1="20%" y1="80%" x2="80%" y2="30%" stroke="#4B5563" strokeWidth="3" strokeDasharray="5,5" />
                <line x1="30%" y1="10%" x2="70%" y2="90%" stroke="#4B5563" strokeWidth="3" strokeDasharray="5,5" />
              </svg>
              
              {/* Train Positions */}
              {trains.map((train, index) => (
                <div
                  key={train.id}
                  className={`absolute w-6 h-6 rounded-full ${getStatusColor(train.status)} flex items-center justify-center transform -translate-x-1/2 -translate-y-1/2 shadow-lg border-2 border-white`}
                  style={{
                    left: `${30 + index * 20}%`,
                    top: `${40 + index * 15}%`
                  }}
                >
                  <Train className="h-3 w-3 text-white" />
                </div>
              ))}
              
              {/* Collision Warning Zone */}
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-24 h-24 border-4 border-red-500 border-dashed rounded-full bg-red-100 bg-opacity-50 animate-pulse flex items-center justify-center">
                <AlertTriangle className="h-6 w-6 text-red-600" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Train Status */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {trains.map((train) => (
          <Card key={train.id} className={`border-l-4 ${train.status === 'emergency' ? 'border-red-500' : train.status === 'warning' ? 'border-yellow-500' : 'border-green-500'}`}>
            <CardContent className="p-4">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="font-semibold">{train.name}</h3>
                  <p className="text-sm text-gray-600">{train.route}</p>
                </div>
                <Badge className={getStatusColor(train.status) + " text-white"}>
                  {train.status.toUpperCase()}
                </Badge>
              </div>
              <div className="space-y-1 text-sm">
                <p>Speed: {train.speed} km/h</p>
                <p>Direction: {train.direction}°</p>
              </div>
              {train.status !== 'normal' && (
                <Button 
                  size="sm" 
                  variant="destructive" 
                  className="mt-2 w-full"
                  onClick={() => sendEmergencyStop(train.id)}
                >
                  <StopCircle className="h-4 w-4 mr-1" />
                  Emergency Stop
                </Button>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Collision Warnings */}
      {collisionWarnings.length > 0 && (
        <Card className="border-red-300 bg-red-50">
          <CardHeader>
            <CardTitle className="text-red-600 flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Active Collision Warnings
            </CardTitle>
          </CardHeader>
          <CardContent>
            {collisionWarnings.map((warning) => (
              <Alert key={warning.id} className="border-red-300 bg-red-100 mb-3">
                <AlertTriangle className="h-4 w-4 text-red-600" />
                <AlertDescription>
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium text-red-800">{warning.message}</p>
                      <p className="text-sm text-red-700">
                        Distance: {warning.distance}km | Time to collision: {warning.timeToCollision}s
                      </p>
                    </div>
                    <Button size="sm" variant="destructive">
                      Send Alert
                    </Button>
                  </div>
                </AlertDescription>
              </Alert>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default CollisionDetectionMap;
