
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { DashboardCard } from "@/components/ui/dashboard-card";
import { FeatureSection } from "@/components/ui/feature-section";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Train, 
  QrCode, 
  MessageCircle, 
  MapPin, 
  Star, 
  CreditCard,
  Clock,
  User,
  Bell,
  TrendingUp,
  CheckCircle,
  Calendar
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

const PassengerDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [notifications] = useState(3);

  const handleFeatureClick = (route: string) => {
    navigate(route);
  };

  const getUserDisplayName = () => {
    if (user?.firstName && user?.lastName) {
      return `${user.firstName} ${user.lastName}`;
    } else if (user?.firstName) {
      return user.firstName;
    } else if (user?.email) {
      return user.email.split('@')[0];
    }
    return 'User';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="space-y-8">
        {/* Welcome Header */}
        <div className="relative overflow-hidden bg-white rounded-2xl p-8 border border-gray-200 shadow-sm">
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-4xl font-bold tracking-tight mb-2 text-gray-900">Welcome Back, {getUserDisplayName()}!</h1>
                <p className="text-lg text-gray-600">
                  Your personalized travel hub is ready to assist you
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Button variant="outline" size="sm" className="relative bg-gray-50 backdrop-blur-sm border-gray-300">
                  <Bell className="h-4 w-4 mr-2" />
                  Alerts
                  {notifications > 0 && (
                    <Badge className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center text-xs bg-red-500">
                      {notifications}
                    </Badge>
                  )}
                </Button>
                <Button variant="outline" size="sm" className="bg-gray-50 backdrop-blur-sm border-gray-300" onClick={() => navigate('/profile')}>
                  <User className="h-4 w-4 mr-2" />
                  Profile
                </Button>
              </div>
            </div>
            
            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-gray-50 rounded-xl p-4 border border-gray-200 text-gray-900">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Active Bookings</p>
                    <p className="text-xl font-bold">2</p>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 rounded-xl p-4 border border-gray-200 text-gray-900">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Calendar className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Next Journey</p>
                    <p className="text-xl font-bold">Today</p>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 rounded-xl p-4 border border-gray-200 text-gray-900">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <TrendingUp className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Miles Traveled</p>
                    <p className="text-xl font-bold">1,247</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-100/50 rounded-full blur-3xl"></div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <DashboardCard
            icon={Train}
            title="Book Tickets"
            description="Reserve seats for your journey"
            onClick={() => handleFeatureClick("/book-ticket")}
            className="bg-blue-50 border-blue-200 hover:bg-blue-100"
            iconClassName="text-blue-600"
          />
          
          <DashboardCard
            icon={QrCode}
            title="My Tickets"
            description="View and manage your bookings"
            onClick={() => handleFeatureClick("/passenger")}
            className="bg-green-50 border-green-200 hover:bg-green-100"
            iconClassName="text-green-600"
          />
          
          <DashboardCard
            icon={MapPin}
            title="Trip Planner"
            description="Discover hotels and attractions"
            onClick={() => handleFeatureClick("/trip-planner")}
            className="bg-orange-50 border-orange-200 hover:bg-orange-100"
            iconClassName="text-orange-600"
          />
        </div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="border-gray-200 shadow-sm">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-4 text-gray-900">Recent Bookings</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <div>
                      <p className="font-medium text-gray-900">Central → Harbor</p>
                      <p className="text-sm text-gray-600">Today, 14:30</p>
                    </div>
                  </div>
                  <Badge className="bg-green-100 text-green-800">Confirmed</Badge>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                    <div>
                      <p className="font-medium text-gray-900">North → South</p>
                      <p className="text-sm text-gray-600">Tomorrow, 09:15</p>
                    </div>
                  </div>
                  <Badge className="bg-yellow-100 text-yellow-800">Waiting</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-gray-200 shadow-sm">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-4 text-gray-900">Quick Actions</h3>
              <div className="space-y-3">
                <Button variant="outline" className="w-full justify-start border-gray-300 text-gray-700 hover:bg-gray-50" onClick={() => navigate('/train-status')}>
                  <Clock className="h-4 w-4 mr-2" />
                  Check Train Status
                </Button>
                
                <Button variant="outline" className="w-full justify-start border-gray-300 text-gray-700 hover:bg-gray-50">
                  <Star className="h-4 w-4 mr-2" />
                  Rate Your Journey
                </Button>
                
                <Button variant="outline" className="w-full justify-start border-gray-300 text-gray-700 hover:bg-gray-50">
                  <CreditCard className="h-4 w-4 mr-2" />
                  Payment History
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Premium Features removed per request */}
      </div>
    </div>
  );
};

export default PassengerDashboard;
