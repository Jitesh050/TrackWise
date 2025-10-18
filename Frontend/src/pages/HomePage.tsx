import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Train, Ticket, Clock, MapPin, Star, MessageCircle, TrendingUp, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";
import BookedTickets from "@/components/BookedTickets";
import LiveTrainWidget from "../components/LiveTrainWidget";
const HomePage = () => {
  const navigate = useNavigate();
  return (
    <div className="container mx-auto space-y-8 pb-10 animate-enter">
      {/* Welcome Header */}
      <header className="text-center py-8 bg-gradient-to-r from-blue-600 to-blue-800 text-white rounded-2xl shadow-lg">
        <h1 className="text-3xl md:text-4xl font-bold mb-2">Welcome to TrackWise Rail</h1>
        <p className="text-lg opacity-90">Your journey starts here</p>
      </header>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="hover:shadow-lg transition-all duration-300 cursor-pointer border-gray-200 hover:border-blue-300" onClick={() => navigate("/book-ticket")}> 
          <CardHeader className="text-center">
            <div className="mx-auto w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-2">
              <Ticket className="h-6 w-6 text-blue-600" />
            </div>
            <CardTitle className="text-lg text-gray-900">Book Tickets</CardTitle>
            <CardDescription className="text-gray-600">Reserve your seats for upcoming journeys</CardDescription>
          </CardHeader>
        </Card>

        <Card className="hover:shadow-lg transition-all duration-300 cursor-pointer border-gray-200 hover:border-blue-300" onClick={() => navigate("/train-status")}> 
          <CardHeader className="text-center">
            <div className="mx-auto w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-2">
              <Clock className="h-6 w-6 text-green-600" />
            </div>
            <CardTitle className="text-lg text-gray-900">Train Status</CardTitle>
            <CardDescription className="text-gray-600">Check real-time train locations and delays</CardDescription>
          </CardHeader>
        </Card>

        <Card className="hover:shadow-lg transition-all duration-300 cursor-pointer border-gray-200 hover:border-blue-300" onClick={() => navigate("/trip-planner")}>
          <CardHeader className="text-center">
            <div className="mx-auto w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-2">
              <MapPin className="h-6 w-6 text-purple-600" />
            </div>
            <CardTitle className="text-lg text-gray-900">Trip Planner</CardTitle>
            <CardDescription className="text-gray-600">Discover places and hotels at your destination</CardDescription>
          </CardHeader>
        </Card>

        <Card className="hover:shadow-lg transition-all duration-300 cursor-pointer border-gray-200 hover:border-blue-300" onClick={() => navigate("/user")}>
          <CardHeader className="text-center">
            <div className="mx-auto w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mb-2">
              <Users className="h-6 w-6 text-orange-600" />
            </div>
            <CardTitle className="text-lg text-gray-900">My Profile</CardTitle>
            <CardDescription className="text-gray-600">Manage your account and preferences</CardDescription>
          </CardHeader>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Bookings */}
        <div>
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2 text-gray-900">
            <Ticket className="h-6 w-6 text-blue-600" />
            Your Recent Bookings
          </h2>
          <BookedTickets />
        </div>

        {/* Live Train Status */}
        <div>
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2 text-gray-900">
            <Train className="h-6 w-6 text-green-600" />
            Live Train Updates
          </h2>
          <div className="mb-3">
            <p className="text-base font-medium text-gray-800">Live Train Status</p>
            <p className="text-sm text-gray-600 -mt-1">Get real-time updates on train schedules and delays</p>
          </div>
          <LiveTrainWidget />
        </div>
      </div>

      {/* Premium Features */}
      <Card className="border-gray-200 shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-gray-900">
            <Star className="h-5 w-5 text-yellow-500" />
            Premium Features
          </CardTitle>
          <CardDescription className="text-gray-600">Enhance your travel experience</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 border border-gray-200 rounded-lg hover:border-blue-300 transition-colors">
              <MessageCircle className="h-8 w-8 mx-auto mb-2 text-blue-600" />
              <h3 className="font-semibold mb-1 text-gray-900">AI ChatBot</h3>
              <p className="text-sm text-gray-600">Book tickets with voice commands</p>
              <Badge variant="secondary" className="mt-2 bg-blue-100 text-blue-800">Available</Badge>
            </div>
            
            <div className="text-center p-4 border border-gray-200 rounded-lg hover:border-blue-300 transition-colors">
              <Star className="h-8 w-8 mx-auto mb-2 text-yellow-500" />
              <h3 className="font-semibold mb-1 text-gray-900">Priority Booking</h3>
              <p className="text-sm text-gray-600">Skip queues with priority tickets</p>
              <Badge variant="secondary" className="mt-2 bg-yellow-100 text-yellow-800">Premium</Badge>
            </div>
            
            <div className="text-center p-4 border border-gray-200 rounded-lg hover:border-blue-300 transition-colors">
              <MapPin className="h-8 w-8 mx-auto mb-2 text-green-500" />
              <h3 className="font-semibold mb-1 text-gray-900">Trip Planning</h3>
              <p className="text-sm text-gray-600">Discover hotels and attractions</p>
              <Badge variant="secondary" className="mt-2 bg-green-100 text-green-800">Free</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Travel Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-gray-200 shadow-sm">
          <CardContent className="flex items-center p-6">
            <div className="flex items-center space-x-4">
              <div className="p-2 bg-green-100 rounded-full">
                <TrendingUp className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">98.5%</p>
                <p className="text-sm text-gray-600">On-time Performance</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-gray-200 shadow-sm">
          <CardContent className="flex items-center p-6">
            <div className="flex items-center space-x-4">
              <div className="p-2 bg-blue-100 rounded-full">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">2.4M</p>
                <p className="text-sm text-gray-600">Daily Passengers</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-gray-200 shadow-sm">
          <CardContent className="flex items-center p-6">
            <div className="flex items-center space-x-4">
              <div className="p-2 bg-purple-100 rounded-full">
                <Train className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">450+</p>
                <p className="text-sm text-gray-600">Active Trains</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default HomePage;
