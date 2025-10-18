
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Zap, Lightbulb, Wind, Thermometer, Leaf, Settings, Users, Power } from "lucide-react";

const EnergyOptimizationControl = () => {
  const [autoMode, setAutoMode] = useState(true);
  
  const [stationControls, setStationControls] = useState([
    {
      id: "central",
      name: "Central Station",
      zones: [
        { id: "p1", name: "Platform 1", occupancy: 45, lights: true, hvac: true, autoControl: true, energyUsage: 2.3 },
        { id: "p2", name: "Platform 2", occupancy: 0, lights: false, hvac: false, autoControl: true, energyUsage: 0.1 },
        { id: "p3", name: "Platform 3", occupancy: 78, lights: true, hvac: true, autoControl: true, energyUsage: 3.1 },
        { id: "wa", name: "Waiting Area", occupancy: 92, lights: true, hvac: true, autoControl: true, energyUsage: 4.2 },
        { id: "fc", name: "Food Court", occupancy: 23, lights: true, hvac: false, autoControl: true, energyUsage: 1.8 }
      ],
      totalSavings: 23.5,
      efficiency: 87
    },
    {
      id: "north",
      name: "North Junction",
      zones: [
        { id: "p1", name: "Platform 1", occupancy: 12, lights: false, hvac: false, autoControl: true, energyUsage: 0.3 },
        { id: "p2", name: "Platform 2", occupancy: 34, lights: true, hvac: true, autoControl: true, energyUsage: 1.9 },
        { id: "wa", name: "Waiting Area", occupancy: 0, lights: false, hvac: false, autoControl: true, energyUsage: 0.1 }
      ],
      totalSavings: 31.2,
      efficiency: 91
    }
  ]);

  const toggleZoneControl = (stationId: string, zoneId: string, control: 'lights' | 'hvac') => {
    setStationControls(prev => prev.map(station => 
      station.id === stationId 
        ? {
            ...station,
            zones: station.zones.map(zone =>
              zone.id === zoneId
                ? { 
                    ...zone, 
                    [control]: !zone[control],
                    autoControl: false,
                    energyUsage: control === 'lights' 
                      ? (zone[control] ? zone.energyUsage - 0.5 : zone.energyUsage + 0.5)
                      : (zone[control] ? zone.energyUsage - 1.0 : zone.energyUsage + 1.0)
                  }
                : zone
            )
          }
        : station
    ));
  };

  const enableAutoControl = (stationId: string, zoneId: string) => {
    setStationControls(prev => prev.map(station => 
      station.id === stationId 
        ? {
            ...station,
            zones: station.zones.map(zone =>
              zone.id === zoneId
                ? { 
                    ...zone, 
                    autoControl: true,
                    lights: zone.occupancy > 0,
                    hvac: zone.occupancy > 20
                  }
                : zone
            )
          }
        : station
    ));
  };

  const getEfficiencyColor = (efficiency: number) => {
    if (efficiency >= 90) return "text-green-600 bg-green-100";
    if (efficiency >= 80) return "text-yellow-600 bg-yellow-100";
    return "text-red-600 bg-red-100";
  };

  const getOccupancyStatus = (occupancy: number) => {
    if (occupancy === 0) return { status: "Empty", color: "text-gray-500 bg-gray-100" };
    if (occupancy < 30) return { status: "Low", color: "text-green-600 bg-green-100" };
    if (occupancy < 70) return { status: "Medium", color: "text-yellow-600 bg-yellow-100" };
    return { status: "High", color: "text-red-600 bg-red-100" };
  };

  const totalEnergyUsage = stationControls.reduce((total, station) => 
    total + station.zones.reduce((stationTotal, zone) => stationTotal + zone.energyUsage, 0), 0
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Energy Optimization Control Center</h2>
          <p className="text-gray-600">Automated and manual control of station energy systems</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">Auto Mode</span>
            <Switch 
              checked={autoMode} 
              onCheckedChange={setAutoMode}
            />
          </div>
          <Badge className={autoMode ? "bg-green-100 text-green-600" : "bg-gray-100 text-gray-600"}>
            {autoMode ? "Automatic" : "Manual"}
          </Badge>
        </div>
      </div>

      {/* System Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Energy Usage</p>
                <p className="text-2xl font-bold">{totalEnergyUsage.toFixed(1)}</p>
                <p className="text-xs text-gray-500">kWh/hour</p>
              </div>
              <Zap className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Daily Savings</p>
                <p className="text-2xl font-bold text-green-600">54.7</p>
                <p className="text-xs text-gray-500">kWh saved</p>
              </div>
              <Leaf className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Zones</p>
                <p className="text-2xl font-bold">6/8</p>
                <p className="text-xs text-gray-500">zones powered</p>
              </div>
              <Power className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Cost Savings</p>
                <p className="text-2xl font-bold text-green-600">$127</p>
                <p className="text-xs text-gray-500">today</p>
              </div>
              <div className="text-green-500 text-2xl font-bold">$</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Station Controls */}
      {stationControls.map((station) => (
        <Card key={station.id}>
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5 text-yellow-500" />
                  {station.name}
                </CardTitle>
                <CardDescription>
                  Energy saved today: {station.totalSavings} kWh | Efficiency: {station.efficiency}%
                </CardDescription>
              </div>
              <div className="flex items-center gap-3">
                <Badge className={getEfficiencyColor(station.efficiency)}>
                  {station.efficiency}% Efficient
                </Badge>
                <Button size="sm" variant="outline">
                  <Settings className="h-4 w-4 mr-1" />
                  Configure
                </Button>
              </div>
            </div>
            <Progress value={station.efficiency} className="h-2" />
          </CardHeader>
          
          <CardContent>
            <div className="space-y-4">
              {/* Zone Controls */}
              <div className="grid gap-4">
                {station.zones.map((zone) => {
                  const occupancyStatus = getOccupancyStatus(zone.occupancy);
                  
                  return (
                    <div key={zone.id} className="border rounded-lg p-4 bg-gray-50">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h4 className="font-medium">{zone.name}</h4>
                          <div className="flex items-center gap-4 text-sm text-gray-500">
                            <div className="flex items-center gap-1">
                              <Users className="h-3 w-3" />
                              <span>{zone.occupancy} people</span>
                            </div>
                            <Badge className={occupancyStatus.color} variant="outline">
                              {occupancyStatus.status}
                            </Badge>
                            <span className="font-medium">{zone.energyUsage} kWh</span>
                          </div>
                        </div>
                        
                        {!zone.autoControl && (
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => enableAutoControl(station.id, zone.id)}
                          >
                            Enable Auto
                          </Button>
                        )}
                      </div>
                      
                      {/* Manual Controls */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-6">
                          {/* Lighting Control */}
                          <div className="flex items-center gap-3">
                            <div className="flex items-center gap-2">
                              <Lightbulb className={`h-4 w-4 ${zone.lights ? 'text-yellow-500' : 'text-gray-400'}`} />
                              <span className="text-sm font-medium">Lights</span>
                            </div>
                            <Switch 
                              checked={zone.lights}
                              onCheckedChange={() => toggleZoneControl(station.id, zone.id, 'lights')}
                              disabled={autoMode && zone.autoControl}
                            />
                          </div>
                          
                          {/* HVAC Control */}
                          <div className="flex items-center gap-3">
                            <div className="flex items-center gap-2">
                              <Wind className={`h-4 w-4 ${zone.hvac ? 'text-blue-500' : 'text-gray-400'}`} />
                              <span className="text-sm font-medium">HVAC</span>
                            </div>
                            <Switch 
                              checked={zone.hvac}
                              onCheckedChange={() => toggleZoneControl(station.id, zone.id, 'hvac')}
                              disabled={autoMode && zone.autoControl}
                            />
                          </div>
                        </div>
                        
                        {/* Auto Control Indicator */}
                        {zone.autoControl && autoMode && (
                          <Badge variant="outline" className="text-green-600 border-green-300">
                            Auto Control Active
                          </Badge>
                        )}
                      </div>
                      
                      {/* Energy Usage Bar */}
                      <div className="mt-3">
                        <div className="flex justify-between text-xs text-gray-500 mb-1">
                          <span>Energy Usage</span>
                          <span>{zone.energyUsage} kWh</span>
                        </div>
                        <Progress value={(zone.energyUsage / 5) * 100} className="h-2" />
                      </div>
                    </div>
                  );
                })}
              </div>
              
              {/* Recommendations */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <div className="flex items-center gap-2 text-blue-800 mb-2">
                  <Thermometer className="h-4 w-4" />
                  <span className="text-sm font-medium">Optimization Recommendations</span>
                </div>
                <div className="text-xs text-blue-700 space-y-1">
                  <p>• Consider motion sensors for empty platforms to reduce energy waste</p>
                  <p>• Schedule HVAC pre-cooling during off-peak hours for better efficiency</p>
                  <p>• {station.zones.filter(z => z.occupancy === 0).length} zones currently empty - auto-optimization active</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default EnergyOptimizationControl;
