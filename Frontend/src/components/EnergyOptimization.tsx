
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Switch } from "@/components/ui/switch";
import { Zap, Lightbulb, Wind, Thermometer, Leaf, TrendingDown, Settings } from "lucide-react";

const EnergyOptimization = () => {
  // Mock data - in real app, this would come from IoT sensors and energy management systems
  const stations = [
    {
      name: "Central Station",
      zones: [
        { name: "Platform 1", occupancy: 45, lights: true, hvac: true, energyUsage: 2.3 },
        { name: "Platform 2", occupancy: 12, lights: false, hvac: false, energyUsage: 0.5 },
        { name: "Platform 3", occupancy: 78, lights: true, hvac: true, energyUsage: 3.1 },
        { name: "Waiting Area", occupancy: 92, lights: true, hvac: true, energyUsage: 4.2 },
        { name: "Concourse", occupancy: 156, lights: true, hvac: true, energyUsage: 5.8 }
      ],
      totalSavings: 23.5,
      efficiency: 87
    },
    {
      name: "North Junction", 
      zones: [
        { name: "Platform 1", occupancy: 23, lights: true, hvac: false, energyUsage: 1.2 },
        { name: "Platform 2", occupancy: 0, lights: false, hvac: false, energyUsage: 0.1 },
        { name: "Waiting Area", occupancy: 34, lights: true, hvac: true, energyUsage: 2.1 }
      ],
      totalSavings: 31.2,
      efficiency: 91
    },
    {
      name: "Metro Central",
      zones: [
        { name: "Platform 1", occupancy: 67, lights: true, hvac: true, energyUsage: 2.8 },
        { name: "Platform 2", occupancy: 89, lights: true, hvac: true, energyUsage: 3.4 },
        { name: "Platform 3", occupancy: 8, lights: false, hvac: false, energyUsage: 0.3 },
        { name: "Food Court", occupancy: 45, lights: true, hvac: true, energyUsage: 3.9 },
        { name: "Shopping Area", occupancy: 123, lights: true, hvac: true, energyUsage: 6.2 }
      ],
      totalSavings: 18.7,
      efficiency: 83
    }
  ];

  const systemStats = {
    totalEnergyUsage: 42.1, // kWh
    totalSavings: 73.4, // kWh saved today
    co2Reduction: 35.2, // kg CO2
    costSavings: 89.45 // currency
  };

  const getEfficiencyColor = (efficiency: number) => {
    if (efficiency >= 90) return "text-green-600 bg-green-100";
    if (efficiency >= 80) return "text-yellow-600 bg-yellow-100";
    return "text-red-600 bg-red-100";
  };

  const getOccupancyStatus = (occupancy: number) => {
    if (occupancy === 0) return { status: "Empty", color: "text-gray-500" };
    if (occupancy < 30) return { status: "Low", color: "text-green-600" };
    if (occupancy < 70) return { status: "Medium", color: "text-yellow-600" };
    return { status: "High", color: "text-red-600" };
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Energy Optimization System</h2>
        <p className="text-gray-600">Automated energy management based on real-time occupancy data</p>
      </div>

      {/* System Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Energy Usage</p>
                <p className="text-2xl font-bold">{systemStats.totalEnergyUsage}</p>
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
                <p className="text-sm font-medium text-gray-500">Energy Saved</p>
                <p className="text-2xl font-bold text-green-600">{systemStats.totalSavings}</p>
                <p className="text-xs text-gray-500">kWh today</p>
              </div>
              <TrendingDown className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">CO₂ Reduced</p>
                <p className="text-2xl font-bold text-green-600">{systemStats.co2Reduction}</p>
                <p className="text-xs text-gray-500">kg today</p>
              </div>
              <Leaf className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Cost Savings</p>
                <p className="text-2xl font-bold text-green-600">${systemStats.costSavings}</p>
                <p className="text-xs text-gray-500">today</p>
              </div>
              <div className="text-green-500">$</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Station Details */}
      <div className="space-y-6">
        {stations.map((station, stationIndex) => (
          <Card key={stationIndex}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="h-5 w-5 text-yellow-500" />
                    {station.name}
                  </CardTitle>
                  <CardDescription>
                    Energy savings: {station.totalSavings} kWh today
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
            </CardHeader>
            
            <CardContent>
              <div className="space-y-4">
                <div className="text-sm text-gray-500 mb-3">
                  Efficiency Score: 
                  <Progress value={station.efficiency} className="h-2 mt-1" />
                </div>
                
                <div className="grid gap-3">
                  {station.zones.map((zone, zoneIndex) => {
                    const occupancyStatus = getOccupancyStatus(zone.occupancy);
                    
                    return (
                      <div key={zoneIndex} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
                        <div className="flex items-center gap-4">
                          <div>
                            <h4 className="font-medium">{zone.name}</h4>
                            <div className="flex items-center gap-2 text-sm text-gray-500">
                              <span className={occupancyStatus.color}>
                                {zone.occupancy} people ({occupancyStatus.status})
                              </span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-6">
                          {/* Energy Usage */}
                          <div className="text-sm">
                            <span className="font-medium">{zone.energyUsage} kWh</span>
                          </div>
                          
                          {/* Controls */}
                          <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2">
                              <Lightbulb className={`h-4 w-4 ${zone.lights ? 'text-yellow-500' : 'text-gray-400'}`} />
                              <Switch 
                                checked={zone.lights} 
                                disabled={zone.occupancy > 0}
                              />
                            </div>
                            <div className="flex items-center gap-2">
                              <Wind className={`h-4 w-4 ${zone.hvac ? 'text-blue-500' : 'text-gray-400'}`} />
                              <Switch 
                                checked={zone.hvac}
                                disabled={zone.occupancy > 30}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
                
                {/* Auto-optimization Notice */}
                <div className="bg-green-50 border border-green-200 rounded-lg p-3 mt-4">
                  <div className="flex items-center gap-2 text-green-800">
                    <Leaf className="h-4 w-4" />
                    <span className="text-sm font-medium">Auto-optimization Active</span>
                  </div>
                  <p className="text-xs text-green-700 mt-1">
                    Lights and HVAC are automatically controlled based on occupancy levels. 
                    Manual overrides available for special requirements.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Energy Tips */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Leaf className="h-5 w-5 text-green-500" />
            Optimization Recommendations
          </CardTitle>
          <CardDescription>AI-powered suggestions for further energy savings</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-start gap-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <Thermometer className="h-5 w-5 text-blue-600 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-blue-900">HVAC Schedule Optimization</p>
                <p className="text-xs text-blue-700">
                  Pre-cool Central Station waiting area 30 minutes before peak hours to reduce energy load during high occupancy.
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-3 p-3 bg-green-50 border border-green-200 rounded-lg">
              <Lightbulb className="h-5 w-5 text-green-600 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-green-900">Smart Lighting Zones</p>
                <p className="text-xs text-green-700">
                  Consider motion-sensor controlled lighting in low-traffic areas to achieve additional 15% energy savings.
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <Zap className="h-5 w-5 text-yellow-600 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-yellow-900">Peak Load Management</p>
                <p className="text-xs text-yellow-700">
                  Schedule non-essential equipment during off-peak hours to reduce overall energy costs by an estimated 12%.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EnergyOptimization;
