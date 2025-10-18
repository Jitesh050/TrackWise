import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Lightbulb, Zap } from "lucide-react";
import { Switch } from "@/components/ui/switch";

const EnergyManagement = () => {
  const [lights, setLights] = React.useState({
    platform1: true,
    platform2: false,
    platform3: true,
    waitingArea: true,
    entrance: false
  });

  const toggle = (key: string) => setLights(prev => ({ ...prev, [key]: !prev[key as keyof typeof prev] }));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">Energy Management</h1>
          <p className="text-gray-600 mt-1">Platform Lighting Control</p>
        </div>
      </div>

      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="h-5 w-5 text-yellow-500" />
            Platform Lighting Control
          </CardTitle>
          <CardDescription>Toggle lighting zones. This section now fills the page.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
            {Object.entries(lights).map(([zone, on]) => (
              <div key={zone} className="flex flex-col items-center space-y-2 p-4 rounded-lg border">
                <Switch checked={on} onCheckedChange={() => toggle(zone)} />
                <span className="text-sm capitalize">{zone.replace(/([A-Z])/g, ' $1')}</span>
                <div className={`w-3 h-3 rounded-full ${on ? 'bg-yellow-400' : 'bg-gray-300'}`} />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EnergyManagement;
