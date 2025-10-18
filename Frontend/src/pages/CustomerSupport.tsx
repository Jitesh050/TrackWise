import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, MessageSquare } from "lucide-react";

const CustomerSupport = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">Customer Support</h1>
          <p className="text-gray-600 mt-1">Handle customer support and inquiries</p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700">
          <MessageSquare className="h-4 w-4 mr-2" />
          View Tickets
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Customer Support Dashboard</CardTitle>
          <CardDescription>Manage customer inquiries and support tickets</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-gray-500">
            Customer support interface coming soon...
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CustomerSupport;
