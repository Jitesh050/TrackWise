
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DashboardCard } from "@/components/ui/dashboard-card";

import { 
  Shield,
  AlertTriangle, 
  Users, 
  Zap,
  Activity,
  TrendingUp,
  Settings,
  Bell,
  BarChart3,
  MapPin,
  Power
} from "lucide-react";
import CollisionDetectionMap from "@/components/admin/CollisionDetectionMap";
import CrowdDensityHeatmap from "@/components/admin/CrowdDensityHeatmap";
import EnergyOptimizationControl from "@/components/admin/EnergyOptimizationControl";
import PriorityTicketManagement from "@/components/admin/PriorityTicketManagement";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [notifications] = useState(3);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto p-6 space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">Admin Control Center</h1>
            <p className="text-gray-600 mt-1">
              Advanced monitoring and management for railway operations
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <Button variant="outline" size="sm" className="relative border-gray-300">
              <Bell className="h-4 w-4 mr-2" />
              Alerts
              {notifications > 0 && (
                <Badge className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center text-xs bg-red-500">
                  {notifications}
                </Badge>
              )}
            </Button>
            <Button variant="outline" size="sm" className="border-gray-300">
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </Button>
          </div>
        </div>

        <Tabs defaultValue="overview" className="space-y-6" onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-2 md:grid-cols-4 lg:flex bg-white border border-gray-200 rounded-xl shadow-sm">
            <TabsTrigger value="overview" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
              <BarChart3 className="h-4 w-4 mr-2" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="priority" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
              <Users className="h-4 w-4 mr-2" />
              Priority Tickets
            </TabsTrigger>
            <TabsTrigger value="collision" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
              <Shield className="h-4 w-4 mr-2" />
              Collision Detection
            </TabsTrigger>
            <TabsTrigger value="crowd" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
              <Users className="h-4 w-4 mr-2" />
              Crowd Monitoring
            </TabsTrigger>
            <TabsTrigger value="energy" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
              <Zap className="h-4 w-4 mr-2" />
              Energy Control
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Overview cards and quick actions removed per requirements */}
          </TabsContent>

          <TabsContent value="priority" className="space-y-6">
            <PriorityTicketManagement />
          </TabsContent>

          <TabsContent value="collision" className="space-y-6">
            <Card className="border-gray-200 shadow-sm">
              <CardHeader>
                <CardTitle className="text-gray-900">Collision Detection System</CardTitle>
                <CardDescription className="text-gray-600">
                  Real-time monitoring of train positions and collision prevention
                </CardDescription>
              </CardHeader>
              <CardContent>
                <CollisionDetectionMap />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="crowd" className="space-y-6">
            <Card className="border-gray-200 shadow-sm">
              <CardHeader>
                <CardTitle className="text-gray-900">Crowd Density Monitoring</CardTitle>
                <CardDescription className="text-gray-600">
                  Heat map visualization of station occupancy and crowd flow
                </CardDescription>
              </CardHeader>
              <CardContent>
                <CrowdDensityHeatmap />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="energy" className="space-y-6">
            <Card className="border-gray-200 shadow-sm">
              <CardHeader>
                <CardTitle className="text-gray-900">Energy Optimization Control</CardTitle>
                <CardDescription className="text-gray-600">
                  Smart lighting and power management based on real-time data
                </CardDescription>
              </CardHeader>
              <CardContent>
                <EnergyOptimizationControl />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboard;
