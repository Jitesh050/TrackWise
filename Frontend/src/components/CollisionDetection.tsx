
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

  const alerts = [
    {
      id: "alert_1",
      type: "warning",
      message: "Potential conflict detected on Central-North Line between EXP101 and REG205",
      timestamp: "14:15:32",
      severity: "high",
      action: "Automatic speed reduction initiated"
    },
    {
      id: "alert_2", 
      type: "info",
      message: "All trains on East-West Corridor operating within safe parameters",
      timestamp: "14:14:18",
      severity: "low",
      action: "Continue monitoring"
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

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Collision Detection System</h2>
        <p className="text-gray-600">Real-time monitoring and prediction of potential train conflicts</p>
      </div>

      {/* System Status */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">System Status</p>
                <p className="text-lg font-bold text-green-600">Active</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Monitored Routes</p>
                <p className="text-2xl font-bold">3</p>
              </div>
              <MapPin className="h-8 w-8 text-blue-600 opacity-80" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Active Alerts</p>
                <p className="text-2xl font-bold text-red-600">1</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Response Time</p>
                <p className="text-2xl font-bold">1.2s</p>
              </div>
              <Clock className="h-8 w-8 text-blue-600 opacity-80" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Alerts */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-red-500" />
            Recent Alerts
          </CardTitle>
          <CardDescription>Latest system notifications and warnings</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {alerts.map((alert) => (
              <Alert key={alert.id} className={alert.severity === "high" ? "border-red-300 bg-red-50" : "border-blue-300 bg-blue-50"}>
                <AlertTriangle className={`h-4 w-4 ${alert.severity === "high" ? "text-red-600" : "text-blue-600"}`} />
                <AlertDescription>
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium">{alert.message}</p>
                      <p className="text-sm text-gray-500 mt-1">Action: {alert.action}</p>
                    </div>
                    <span className="text-xs text-gray-500">{alert.timestamp}</span>
                  </div>
                </AlertDescription>
              </Alert>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Route Monitoring */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Train className="h-5 w-5 text-blue-600" />
            Route Monitoring
          </CardTitle>
          <CardDescription>Real-time train positions and conflict analysis</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {routes.map((route) => (
              <div key={route.id} className="border rounded-lg p-4">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-semibold text-lg">{route.name}</h3>
                    <p className="text-sm text-gray-500">Last update: {route.lastUpdate}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={getRiskColor(route.riskLevel)}>
                      {getRiskIcon(route.riskLevel)}
                      <span className="ml-1 capitalize">{route.riskLevel} Risk</span>
                    </Badge>
                    <Button 
                      size="sm" 
                      variant={selectedRoute === route.id ? "default" : "outline"}
                      onClick={() => setSelectedRoute(selectedRoute === route.id ? null : route.id)}
                    >
                      {selectedRoute === route.id ? "Hide Details" : "View Details"}
                    </Button>
                  </div>
                </div>

                {/* Route Visualization */}
                <div className="relative">
                  <div className="h-16 bg-gray-100 rounded-lg relative overflow-hidden">
                    {/* Track */}
                    <div className="absolute top-1/2 left-0 right-0 h-2 bg-gray-400 transform -translate-y-1/2"></div>
                    
                    {/* Warning Zone */}
                    {route.warningZone && (
                      <div 
                        className="absolute top-1/2 h-8 bg-red-200 bg-opacity-50 border-2 border-red-300 border-dashed transform -translate-y-1/2"
                        style={{
                          left: `${route.warningZone.start}%`,
                          width: `${route.warningZone.end - route.warningZone.start}%`
                        }}
                      ></div>
                    )}
                    
                    {/* Trains */}
                    {route.trains.map((train, trainIndex) => (
                      <div
                        key={train.id}
                        className={`absolute top-1/2 w-6 h-6 rounded transform -translate-y-1/2 -translate-x-1/2 flex items-center justify-center text-white text-xs font-bold ${
                          trainIndex === 0 ? 'bg-blue-500' : 'bg-green-500'
                        }`}
                        style={{ left: `${train.position}%` }}
                        title={`${train.id} - ${train.speed} km/h`}
                      >
                        <Train className="h-3 w-3" />
                      </div>
                    ))}
                  </div>
                  
                  {/* Scale */}
                  <div className="flex justify-between text-xs text-gray-500 mt-2">
                    <span>0 km</span>
                    <span>50 km</span>
                    <span>100 km</span>
                  </div>
                </div>

                {/* Train Details */}
                {selectedRoute === route.id && (
                  <div className="mt-4 grid gap-3">
                    {route.trains.map((train, trainIndex) => (
                      <div key={train.id} className="bg-gray-50 p-3 rounded-md border border-gray-200">
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-3">
                            <div className={`w-4 h-4 rounded ${trainIndex === 0 ? 'bg-blue-500' : 'bg-green-500'}`}></div>
                            <span className="font-medium">{train.id} - {train.name}</span>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-gray-500">
                            <span>Speed: {train.speed} km/h</span>
                            <span>Position: {train.position} km</span>
                            <span>Next: {train.nextStation} ({train.eta})</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CollisionDetection;
