
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Progress } from "@/components/ui/progress";
import { 
  MapPin, 
  AlertTriangle, 
  Train, 
  Users, 
  BarChart3, 
  Lightbulb, 
  Zap,
  CheckCircle,
  Clock,
  TrendingUp,
  Power
} from "lucide-react";

const AdminHomePage = () => {
  const [lightControls, setLightControls] = useState({
    platform1: true,
    platform2: false,
    platform3: true,
    waitingArea: true,
    entrance: false
  });

  // Mock data for analytics
  const analytics = {
    ticketsBooked: 1247,
    trainsPassed: 23,
    trainsUpcoming: 8,
    onTimeTrains: 18,
    delayedTrains: 5
  };

  // Key metrics displayed on the right of the Collision Detection section
  const totalTrains = 100;
  const onTimePercent = 78.2;
  const activeStations = 25;
  const totalStations = 25;
  const passengerLoad = 67;

  // Mock collision detection data
  const collisionWarnings = [
    {
      id: 1,
      trains: ["Express 101", "Local 245"],
      distance: "2.5 km",
      estimatedCollision: "45 seconds",
      severity: "HIGH"
    },
    {
      id: 2,
      trains: ["Bullet 330", "Metro 67"],
      distance: "5.8 km",
      estimatedCollision: "2 minutes",
      severity: "MEDIUM"
    }
  ];

  const toggleLight = (zone: string) => {
    setLightControls(prev => ({
      ...prev,
      [zone]: !prev[zone]
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="container mx-auto space-y-6">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Admin Control Center</h1>
          <p className="text-gray-600 text-lg">Comprehensive railway management and monitoring system</p>
        </header>

        {/* Collision Detection Section */}
        <Card className="bg-white border-gray-200 shadow-sm">
          <CardHeader>
            <CardTitle className="text-gray-900 flex items-center gap-2">
              <AlertTriangle className="h-6 w-6 text-red-500" />
              Collision Detection System
            </CardTitle>
            <CardDescription className="text-gray-600">
              Live train tracking and collision prevention monitoring
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Live Map Area */}
              <div className="bg-gray-100 rounded-lg h-80 relative overflow-hidden cursor-pointer">
                {/* Click Overlay Anchor to open simulation in new tab */}
                <a
                  href="https://trackwisesimulation.vercel.app/"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClickCapture={(e) => { e.stopPropagation(); }}
                  onClick={(e) => { e.stopPropagation(); }}
                  onMouseDown={(e) => { e.stopPropagation(); }}
                  className="absolute inset-0 z-50 block focus:outline-none focus:ring-2 focus:ring-blue-500"
                  aria-label="Open TrackWise Simulation"
                  title="Open TrackWise Simulation"
                >
                  <span className="sr-only">Open TrackWise Simulation</span>
                </a>
                <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-green-50 pointer-events-none">
                  {/* Simulated Railway Lines */}
                  <svg className="absolute inset-0 w-full h-full pointer-events-none">
                    <line x1="10%" y1="50%" x2="90%" y2="20%" stroke="#4B5563" strokeWidth="3" strokeDasharray="5,5" />
                    <line x1="20%" y1="80%" x2="80%" y2="30%" stroke="#4B5563" strokeWidth="3" strokeDasharray="5,5" />
                    <line x1="30%" y1="10%" x2="70%" y2="90%" stroke="#4B5563" strokeWidth="3" strokeDasharray="5,5" />
                  </svg>
                  
                  {/* Train Positions */}
                  <div className="absolute top-1/3 left-1/4 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center animate-pulse pointer-events-none">
                    <Train className="h-2 w-2 text-white" />
                  </div>
                  <div className="absolute top-1/2 left-1/2 w-4 h-4 bg-green-500 rounded-full flex items-center justify-center pointer-events-none">
                    <Train className="h-2 w-2 text-white" />
                  </div>
                  <div className="absolute top-2/3 left-3/4 w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center pointer-events-none">
                    <Train className="h-2 w-2 text-white" />
                  </div>
                </div>
              </div>

              {/* Key Metrics */}
              <Card className="self-start">
                <CardHeader className="pb-3">
                  <CardTitle>Key Metrics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-3">
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
                      <div className="mt-2 text-2xl font-semibold text-green-900">{onTimePercent}%</div>
                    </div>

                    <div className="rounded-xl border border-indigo-200 bg-indigo-50 p-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-indigo-700">Stations Active</span>
                        <MapPin className="h-4 w-4 text-indigo-600" />
                      </div>
                      <div className="mt-2 text-2xl font-semibold text-indigo-900">{activeStations} / {totalStations}</div>
                    </div>

                    <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-amber-700">Passenger Load</span>
                        <Zap className="h-4 w-4 text-amber-600" />
                      </div>
                      <div className="mt-2 text-2xl font-semibold text-amber-900">{passengerLoad}%</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>

        {/* Analytics Dashboard removed per requirements */}

        {/* Lighting Control */}
        <Card className="bg-white border-gray-200 shadow-sm">
          <CardHeader>
            <CardTitle className="text-gray-900 flex items-center gap-2">
              <Lightbulb className="h-6 w-6 text-yellow-500" />
              Platform Lighting Control
            </CardTitle>
            <CardDescription className="text-gray-600">
              Manage platform and area lighting for passenger safety
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {Object.entries(lightControls).map(([zone, isOn]) => (
                <div key={zone} className="flex flex-col items-center space-y-2">
                  <Switch
                    checked={isOn}
                    onCheckedChange={() => toggleLight(zone)}
                  />
                  <span className="text-sm text-gray-700 capitalize">{zone.replace(/([A-Z])/g, ' $1')}</span>
                  <div className={`w-3 h-3 rounded-full ${isOn ? 'bg-yellow-400' : 'bg-gray-300'}`} />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions removed per requirements */}
      </div>
    </div>
  );
};

export default AdminHomePage;
