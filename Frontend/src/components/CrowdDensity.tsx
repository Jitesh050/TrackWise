
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Users, Train, TrendingUp, TrendingDown, Minus } from "lucide-react";

const CrowdDensity = () => {
  // Mock data - in real app, this would come from booking system analytics
  const stationData = [
    {
      name: "Central Station",
      currentOccupancy: 850,
      capacity: 1200,
      trend: "up",
      peakTime: "8:00-9:00 AM",
      trains: [
        { number: "EXP101", passengers: 180, capacity: 200 },
        { number: "REG205", passengers: 95, capacity: 150 },
        { number: "SPD330", passengers: 160, capacity: 180 }
      ]
    },
    {
      name: "North Junction",
      currentOccupancy: 420,
      capacity: 800,
      trend: "down",
      peakTime: "7:30-8:30 AM",
      trains: [
        { number: "LOC445", passengers: 120, capacity: 200 },
        { number: "EXP202", passengers: 140, capacity: 180 }
      ]
    },
    {
      name: "Metro Central",
      currentOccupancy: 690,
      capacity: 900,
      trend: "stable",
      peakTime: "8:15-9:15 AM",
      trains: [
        { number: "SPD330", passengers: 165, capacity: 180 },
        { number: "REG308", passengers: 78, capacity: 120 },
        { number: "EXP404", passengers: 145, capacity: 200 }
      ]
    },
    {
      name: "South Terminal",
      currentOccupancy: 320,
      capacity: 600,
      trend: "up",
      peakTime: "9:00-10:00 AM",
      trains: [
        { number: "LOC556", passengers: 85, capacity: 150 },
        { number: "REG667", passengers: 110, capacity: 180 }
      ]
    }
  ];

  const getOccupancyLevel = (current: number, capacity: number) => {
    const percentage = (current / capacity) * 100;
    if (percentage >= 90) return { level: "Critical", color: "bg-red-500", textColor: "text-red-600" };
    if (percentage >= 75) return { level: "High", color: "bg-orange-500", textColor: "text-orange-600" };
    if (percentage >= 50) return { level: "Moderate", color: "bg-yellow-500", textColor: "text-yellow-600" };
    return { level: "Low", color: "bg-green-500", textColor: "text-green-600" };
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "up": return <TrendingUp className="h-4 w-4 text-red-500" />;
      case "down": return <TrendingDown className="h-4 w-4 text-green-500" />;
      default: return <Minus className="h-4 w-4 text-gray-500" />;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Real-time Crowd Density</h2>
        <p className="text-gray-600">Monitor passenger density across stations and trains</p>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Total Passengers</p>
                <p className="text-2xl font-bold">2,280</p>
              </div>
              <Users className="h-8 w-8 text-blue-600 opacity-80" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Active Trains</p>
                <p className="text-2xl font-bold">12</p>
              </div>
              <Train className="h-8 w-8 text-blue-600 opacity-80" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Peak Station</p>
                <p className="text-lg font-bold">Central Station</p>
              </div>
              <div className="text-red-500">
                <TrendingUp className="h-8 w-8" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">System Capacity</p>
                <p className="text-2xl font-bold">67%</p>
              </div>
              <div className="text-yellow-500">
                <Users className="h-8 w-8" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Station Details */}
      <div className="grid gap-6">
        {stationData.map((station, index) => {
          const occupancyPercentage = (station.currentOccupancy / station.capacity) * 100;
          const occupancyLevel = getOccupancyLevel(station.currentOccupancy, station.capacity);
          
          return (
            <Card key={index}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Users className="h-5 w-5 text-blue-600" />
                      {station.name}
                    </CardTitle>
                    <CardDescription>Peak time: {station.peakTime}</CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={occupancyLevel.textColor + " bg-transparent border-current"}>
                      {occupancyLevel.level}
                    </Badge>
                    {getTrendIcon(station.trend)}
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                {/* Station Occupancy */}
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Station Occupancy</span>
                    <span className="font-medium">
                      {station.currentOccupancy}/{station.capacity} passengers
                    </span>
                  </div>
                  <Progress 
                    value={occupancyPercentage} 
                    className="h-3"
                  />
                </div>
                
                {/* Train Details */}
                <div>
                  <h4 className="font-medium mb-3">Trains at Station</h4>
                  <div className="space-y-2">
                    {station.trains.map((train, trainIndex) => {
                      const trainOccupancy = (train.passengers / train.capacity) * 100;
                      const trainLevel = getOccupancyLevel(train.passengers, train.capacity);
                      
                      return (
                        <div key={trainIndex} className="flex items-center justify-between p-3 bg-gray-50 rounded-md border border-gray-200">
                          <div className="flex items-center gap-3">
                            <Train className="h-4 w-4 text-blue-600" />
                            <span className="font-medium">{train.number}</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="text-sm text-gray-500">
                              {train.passengers}/{train.capacity}
                            </span>
                            <div className="w-20">
                              <Progress value={trainOccupancy} className="h-2" />
                            </div>
                            <Badge 
                              variant="outline" 
                              className={`text-xs ${trainLevel.textColor} border-current`}
                            >
                              {Math.round(trainOccupancy)}%
                            </Badge>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default CrowdDensity;
