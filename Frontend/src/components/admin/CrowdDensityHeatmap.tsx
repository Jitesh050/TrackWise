
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Users, TrendingUp, AlertCircle, MapPin } from "lucide-react";

const CrowdDensityHeatmap = () => {
  const stationData = [
    {
      id: "S001",
      name: "Central Station",
      zones: [
        { name: "Platform 1", density: 90, x: 20, y: 30, width: 15, height: 10 },
        { name: "Platform 2", density: 45, x: 40, y: 30, width: 15, height: 10 },
        { name: "Platform 3", density: 75, x: 60, y: 30, width: 15, height: 10 },
        { name: "Waiting Area", density: 85, x: 35, y: 50, width: 20, height: 15 },
        { name: "Food Court", density: 30, x: 60, y: 60, width: 25, height: 20 },
        { name: "Ticket Counter", density: 95, x: 15, y: 65, width: 15, height: 12 },
        { name: "Entrance", density: 70, x: 45, y: 80, width: 20, height: 8 }
      ],
      totalCapacity: 2500,
      currentOccupancy: 1680
    }
  ];

  const getDensityColor = (density: number) => {
    if (density >= 90) return "bg-red-500";
    if (density >= 70) return "bg-orange-500"; 
    if (density >= 50) return "bg-yellow-500";
    if (density >= 30) return "bg-green-400";
    return "bg-blue-400";
  };

  const getDensityOpacity = (density: number) => {
    return Math.max(0.3, density / 100);
  };

  const getDensityLevel = (density: number) => {
    if (density >= 90) return { level: "Critical", color: "text-red-600" };
    if (density >= 70) return { level: "High", color: "text-orange-600" };
    if (density >= 50) return { level: "Moderate", color: "text-yellow-600" };
    if (density >= 30) return { level: "Low", color: "text-green-600" };
    return { level: "Very Low", color: "text-blue-600" };
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Real-time Crowd Density</h2>
          <p className="text-gray-600">Heat map visualization of passenger distribution</p>
        </div>
        <div className="flex gap-2">
          <Badge variant="outline" className="text-green-600">Live Data</Badge>
          <Badge variant="destructive">2 Critical Zones</Badge>
        </div>
      </div>

      {/* Heat Map Legend */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Density Legend</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-red-500 rounded"></div>
              <span className="text-sm">Critical (90-100%)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-orange-500 rounded"></div>
              <span className="text-sm">High (70-89%)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-yellow-500 rounded"></div>
              <span className="text-sm">Moderate (50-69%)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-green-400 rounded"></div>
              <span className="text-sm">Low (30-49%)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-blue-400 rounded"></div>
              <span className="text-sm">Very Low (0-29%)</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Station Heat Maps */}
      {stationData.map((station) => (
        <Card key={station.id}>
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-blue-600" />
                  {station.name}
                </CardTitle>
                <CardDescription>
                  Current: {station.currentOccupancy}/{station.totalCapacity} passengers 
                  ({Math.round((station.currentOccupancy/station.totalCapacity) * 100)}% capacity)
                </CardDescription>
              </div>
              <Button size="sm" variant="outline">
                <TrendingUp className="h-4 w-4 mr-1" />
                View Trends
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {/* Heat Map Visualization */}
            <div className="relative bg-gray-100 rounded-lg h-80 mb-6 overflow-hidden">
              <svg className="absolute inset-0 w-full h-full">
                {/* Station Layout */}
                <rect x="10%" y="20%" width="80%" height="60%" fill="none" stroke="#94A3B8" strokeWidth="2" strokeDasharray="5,5" />
                <text x="50%" y="15%" textAnchor="middle" className="text-sm font-medium fill-slate-600">Station Layout</text>
              </svg>
              
              {/* Heat Map Zones */}
              {station.zones.map((zone, index) => (
                <div
                  key={index}
                  className={`absolute rounded-lg border-2 border-white shadow-lg ${getDensityColor(zone.density)} transition-all duration-300 hover:scale-105 cursor-pointer group`}
                  style={{
                    left: `${zone.x}%`,
                    top: `${zone.y}%`,
                    width: `${zone.width}%`,
                    height: `${zone.height}%`,
                    opacity: getDensityOpacity(zone.density)
                  }}
                  title={`${zone.name}: ${zone.density}% capacity`}
                >
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-white text-xs font-bold text-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <div>{zone.name}</div>
                      <div>{zone.density}%</div>
                    </div>
                  </div>
                </div>
              ))}

              {/* Critical Zone Alerts */}
              {station.zones.filter(zone => zone.density >= 90).map((zone, index) => (
                <div
                  key={`alert-${index}`}
                  className="absolute animate-ping"
                  style={{
                    left: `${zone.x + zone.width/2}%`,
                    top: `${zone.y + zone.height/2}%`,
                    transform: 'translate(-50%, -50%)'
                  }}
                >
                  <AlertCircle className="h-6 w-6 text-red-600" />
                </div>
              ))}
            </div>

            {/* Zone Details */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {station.zones.map((zone, index) => {
                const densityInfo = getDensityLevel(zone.density);
                return (
                  <div key={index} className="bg-gray-50 p-3 rounded-lg">
                    <div className="flex justify-between items-center mb-1">
                      <h4 className="font-medium text-sm">{zone.name}</h4>
                      <div className={`w-3 h-3 rounded ${getDensityColor(zone.density)}`}></div>
                    </div>
                    <div className="text-xs text-gray-500">
                      <div>{zone.density}% capacity</div>
                      <div className={densityInfo.color}>{densityInfo.level}</div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Quick Actions */}
            <div className="mt-4 p-3 bg-blue-50 rounded-lg">
              <h4 className="font-medium text-blue-800 mb-2 flex items-center gap-2">
                <Users className="h-4 w-4" />
                Crowd Management Actions
              </h4>
              <div className="flex flex-wrap gap-2">
                <Button size="sm" variant="outline" className="text-blue-600 border-blue-300">
                  Deploy Staff to Critical Zones
                </Button>
                <Button size="sm" variant="outline" className="text-blue-600 border-blue-300">
                  Open Additional Platforms
                </Button>
                <Button size="sm" variant="outline" className="text-blue-600 border-blue-300">
                  Send Crowd Alerts
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default CrowdDensityHeatmap;
