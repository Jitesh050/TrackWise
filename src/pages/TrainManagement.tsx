import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  Train, 
  Search, 
  Filter, 
  Plus, 
  Edit, 
  Trash2, 
  Activity,
  Clock,
  MapPin,
  Users,
  Zap
} from "lucide-react";

const TrainManagement = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  // Mock data - in real app, this would come from API
  const trains = [
    {
      id: "1",
      trainNumber: "12345",
      trainName: "Rajdhani Express",
      status: "Active",
      route: "Delhi → Mumbai",
      capacity: 1200,
      currentLocation: "Delhi",
      nextStation: "Agra",
      estimatedArrival: "14:30",
      occupancy: 85
    },
    {
      id: "2",
      trainNumber: "12346",
      trainName: "Shatabdi Express",
      status: "Active",
      route: "Mumbai → Pune",
      capacity: 800,
      currentLocation: "Mumbai",
      nextStation: "Thane",
      estimatedArrival: "09:15",
      occupancy: 92
    },
    {
      id: "3",
      trainNumber: "12347",
      trainName: "Duronto Express",
      status: "Maintenance",
      route: "Kolkata → Delhi",
      capacity: 1000,
      currentLocation: "Kolkata",
      nextStation: "Asansol",
      estimatedArrival: "16:45",
      occupancy: 0
    }
  ];

  const filteredTrains = trains.filter(train => {
    const matchesSearch = train.trainName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         train.trainNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         train.route.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === "all" || train.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Active":
        return <Badge variant="default" className="bg-green-100 text-green-800">Active</Badge>;
      case "Maintenance":
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">Maintenance</Badge>;
      case "Delayed":
        return <Badge variant="destructive">Delayed</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">Train Management</h1>
          <p className="text-gray-600 mt-1">
            Manage train schedules, routes, and operations
          </p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700">
          <Plus className="h-4 w-4 mr-2" />
          Add Train
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Activity className="h-4 w-4 text-green-600" />
              <div>
                <p className="text-sm font-medium text-gray-600">Active Trains</p>
                <p className="text-2xl font-bold text-green-600">
                  {trains.filter(t => t.status === "Active").length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4 text-yellow-600" />
              <div>
                <p className="text-sm font-medium text-gray-600">Maintenance</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {trains.filter(t => t.status === "Maintenance").length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Users className="h-4 w-4 text-blue-600" />
              <div>
                <p className="text-sm font-medium text-gray-600">Total Capacity</p>
                <p className="text-2xl font-bold text-blue-600">
                  {trains.reduce((sum, train) => sum + train.capacity, 0).toLocaleString()}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Zap className="h-4 w-4 text-purple-600" />
              <div>
                <p className="text-sm font-medium text-gray-600">Avg Occupancy</p>
                <p className="text-2xl font-bold text-purple-600">
                  {Math.round(trains.reduce((sum, train) => sum + train.occupancy, 0) / trains.length)}%
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search by train name, number, or route..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Filter className="h-4 w-4 text-gray-500" />
              <select
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="all">All Status</option>
                <option value="Active">Active</option>
                <option value="Maintenance">Maintenance</option>
                <option value="Delayed">Delayed</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Trains List */}
      <Card>
        <CardHeader>
          <CardTitle>All Trains</CardTitle>
          <CardDescription>
            View and manage train operations and schedules
          </CardDescription>
        </CardHeader>
        <CardContent>
          {filteredTrains.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No trains found.
            </div>
          ) : (
            <div className="space-y-4">
              {filteredTrains.map((train) => (
                <div
                  key={train.id}
                  className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h3 className="font-semibold text-gray-900">{train.trainName}</h3>
                        {getStatusBadge(train.status)}
                        <Badge variant="outline">{train.trainNumber}</Badge>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm text-gray-600">
                        <div>
                          <span className="font-medium">Route:</span> {train.route}
                        </div>
                        <div>
                          <span className="font-medium">Capacity:</span> {train.capacity}
                        </div>
                        <div>
                          <span className="font-medium">Current:</span> {train.currentLocation}
                        </div>
                        <div>
                          <span className="font-medium">Next:</span> {train.nextStation} ({train.estimatedArrival})
                        </div>
                      </div>
                      <div className="mt-2">
                        <div className="flex items-center space-x-2">
                          <span className="text-sm text-gray-600">Occupancy:</span>
                          <div className="flex-1 bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-blue-600 h-2 rounded-full" 
                              style={{ width: `${train.occupancy}%` }}
                            ></div>
                          </div>
                          <span className="text-sm text-gray-600">{train.occupancy}%</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                      <Button variant="outline" size="sm">
                        <MapPin className="h-4 w-4 mr-1" />
                        Track
                      </Button>
                      <Button variant="outline" size="sm">
                        <Trash2 className="h-4 w-4 mr-1" />
                        Delete
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default TrainManagement;
