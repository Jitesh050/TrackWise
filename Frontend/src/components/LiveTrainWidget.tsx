import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Search, Train as TrainIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";

const LiveTrainWidget = () => {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  const onTrack = () => {
    const q = query.trim();
    if (!q) return;
    navigate(`/train-status?q=${encodeURIComponent(q)}`);
  };

  return (
    <div className="space-y-6">
      <Card className="border-gray-200 shadow-sm">
        <CardHeader>
          <CardTitle>Track Your Train</CardTitle>
          <CardDescription>Enter train number or name to get live status</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-3">
            <div className="flex-1">
              <Label htmlFor="home-train-search">Train Number / Name</Label>
              <Input
                id="home-train-search"
                placeholder="e.g. 12000 or Rajdhani NDLS-HWH"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && onTrack()}
              />
            </div>
            <div className="flex items-end">
              <Button onClick={onTrack} className="bg-blue-600 hover:bg-blue-700">
                <Search size={16} className="mr-2" />
                Track
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-gray-200 shadow-sm">
        <CardContent className="py-12 text-center text-gray-600">
          <TrainIcon className="h-10 w-10 mx-auto mb-3 opacity-60" />
          Enter a train number to view live status
        </CardContent>
      </Card>
    </div>
  );
};

export default LiveTrainWidget;
