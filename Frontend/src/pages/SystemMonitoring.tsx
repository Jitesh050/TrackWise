import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Activity } from "lucide-react";

const SystemMonitoring = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">System Monitoring</h1>
          <p className="text-gray-600 mt-1">Monitor system performance and health</p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700">
          <Activity className="h-4 w-4 mr-2" />
          View Metrics
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>System Monitoring Dashboard</CardTitle>
          <CardDescription>Monitor system performance, health, and metrics</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-gray-500">
            System monitoring interface coming soon...
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SystemMonitoring;
