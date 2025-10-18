
import { Clock, MapPin, AlertTriangle } from "lucide-react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

interface TrainStatusCardProps {
  trainNumber: string;
  trainName: string;
  origin: string;
  destination: string;
  departureTime: string;
  arrivalTime: string;
  status: "ontime" | "delayed" | "cancelled" | "boarding";
  delay?: number; // in minutes
  platform?: string;
  progress: number; // 0 to 100
  nextStation?: string;
}

const TrainStatusCard = ({
  trainNumber,
  trainName,
  origin,
  destination,
  departureTime,
  arrivalTime,
  status,
  delay = 0,
  platform,
  progress,
  nextStation
}: TrainStatusCardProps) => {
  const getStatusLabel = () => {
    switch (status) {
      case "ontime":
        return "On Time";
      case "delayed":
        return `Delayed by ${delay} min`;
      case "cancelled":
        return "Cancelled";
      case "boarding":
        return "Boarding";
      default:
        return "Unknown";
    }
  };
  
  const getStatusBadge = () => {
    switch (status) {
      case "ontime":
        return <Badge className="bg-green-500">On Time</Badge>;
      case "delayed":
        return <Badge variant="outline" className="border-amber-500 text-amber-500">{delay} min delay</Badge>;
      case "cancelled":
        return <Badge className="bg-red-500">Cancelled</Badge>;
      case "boarding":
        return <Badge className="bg-blue-500">Boarding</Badge>;
      default:
        return null;
    }
  };

  return (
    <Card className={`line-indicator status-${status} overflow-hidden`}>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg flex items-center gap-1">
              {trainNumber} <span className="text-sm text-gray-500 mx-1">|</span> {trainName}
            </CardTitle>
            <CardDescription className="flex items-center gap-2 mt-1">
              <MapPin size={14} />
              <span>{origin} → {destination}</span>
            </CardDescription>
          </div>
          {getStatusBadge()}
        </div>
      </CardHeader>
      
      <CardContent className="pb-2">
        <div className="flex justify-between mb-2">
          <div className="text-sm">
            <div className="font-medium">{departureTime}</div>
            <div className="text-gray-500">{origin}</div>
          </div>
          <div className="text-sm text-right">
            <div className="font-medium">{arrivalTime}</div>
            <div className="text-gray-500">{destination}</div>
          </div>
        </div>
        
        <Progress value={progress} className="h-1.5" />
        
        {nextStation && (
          <div className="flex items-center mt-3 text-xs text-gray-500">
            <Clock size={12} className="mr-1" />
            <span>Next station: {nextStation}</span>
          </div>
        )}
      </CardContent>
      
      <CardFooter className="pt-2 flex items-center justify-between text-xs">
        {platform && (
          <div className="bg-blue-50 text-blue-700 px-2 py-1 rounded-md font-medium border border-blue-200">
            Platform {platform}
          </div>
        )}
        
        {status === "delayed" && (
          <div className="flex items-center text-amber-600">
            <AlertTriangle size={12} className="mr-1" />
            <span>Expected delay: {delay} minutes</span>
          </div>
        )}
      </CardFooter>
    </Card>
  );
};

export default TrainStatusCard;
