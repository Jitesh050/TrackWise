import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Users } from "lucide-react";

const CrowdMonitoring = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">Crowd Monitoring</h1>
          <p className="text-gray-600 mt-1">Monitor crowd density and flow</p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700">
          <Users className="h-4 w-4 mr-2" />
          View Density
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Crowd Monitoring Dashboard</CardTitle>
          <CardDescription>Monitor crowd density, flow, and safety metrics</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-gray-500">
            Crowd monitoring interface coming soon...
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CrowdMonitoring;
