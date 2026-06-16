
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
import { useQuery } from "@tanstack/react-query";
import { ticketsApi, TicketRecord } from "@/lib/tickets";
import { stations, calculateDistance } from "@/lib/stationData";

const PassengerDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [notifications] = useState(0);

  const { data: tickets = [], isLoading } = useQuery<TicketRecord[]>({
    queryKey: ["tickets", "dashboard"],
    queryFn: () => ticketsApi.list(),
    staleTime: 15_000,
  });

  const activeBookings = tickets.filter(t => t.status === "Confirmed").length;
  const hasBookings = (tickets || []).length > 0;
  const latestPnr = hasBookings ? (tickets[0]?.pnr || "") : "";
  const nextJourney = (() => {
    const withDate = tickets
      .map(t => ({ t, time: Date.parse(t.date + (t.departureTime ? " " + t.departureTime : "")) || Date.parse(t.date) }))
      .filter(x => !isNaN(x.time) && x.time >= Date.now())
      .sort((a,b) => a.time - b.time);
    if (withDate.length === 0) return "No upcoming";
    const d = new Date(withDate[0].time);
    return d.toLocaleString();
  })();
  const milesTraveled = (() => {
    // Build quick lookup of station by code
    const byCode = new Map(stations.map(s => [s.id.toUpperCase(), s]));
    const kmTotal = (tickets || [])
      .filter(t => t.status === "Confirmed")
      .reduce((sum, t) => {
        const from = byCode.get(String(t.from || '').toUpperCase());
        const to = byCode.get(String(t.to || '').toUpperCase());
        if (!from || !to) return sum;
        const km = calculateDistance(from.lat, from.lon, to.lat, to.lon);
        return sum + km;
      }, 0);
    return Math.round(kmTotal * 0.621371); // convert to miles
  })();

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
                    <p className="text-xl font-bold">{isLoading ? "…" : activeBookings}</p>
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
                    <p className="text-xl font-bold">{isLoading ? "…" : nextJourney}</p>
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
                    <p className="text-xl font-bold">{isLoading ? "…" : milesTraveled}</p>
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
          />
          
          <DashboardCard
            icon={QrCode}
            title="My Tickets"
            description="View and manage your bookings"
            onClick={() => handleFeatureClick("/tickets")}
            className="bg-green-50 border-green-200 hover:bg-green-100"
          />
          
          <DashboardCard
            icon={MapPin}
            title="Trip Planner"
            description="Discover hotels and attractions"
            onClick={() => handleFeatureClick("/trip-planner")}
            className="bg-orange-50 border-orange-200 hover:bg-orange-100"
          />
        </div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="border-gray-200 shadow-sm">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-4 text-gray-900">Recent Bookings</h3>
              <div className="space-y-3">
                {(tickets || []).slice(0,4).map((t, idx) => (
                  <div key={t.id || idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className={`w-2 h-2 rounded-full ${t.status === 'Confirmed' ? 'bg-green-500' : t.status === 'Waiting' ? 'bg-yellow-500' : 'bg-red-500'}`}></div>
                      <div>
                        <p className="font-medium text-gray-900">{t.from} → {t.to}</p>
                        <p className="text-sm text-gray-600">{t.date}{t.departureTime ? `, ${t.departureTime}` : ''}</p>
                      </div>
                    </div>
                    <Badge>{t.status}</Badge>
                  </div>
                ))}
                {(!tickets || tickets.length === 0) && (
                  <div className="text-gray-600 text-sm">No recent bookings</div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="border-gray-200 shadow-sm">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-4 text-gray-900">Quick Actions</h3>
              <div className="space-y-3" role="list" aria-label="Quick actions">
                <Button
                  variant="outline"
                  type="button"
                  className="w-full justify-start border-gray-300 text-gray-700 hover:bg-gray-50 focus-visible:ring-2 focus-visible:ring-blue-600"
                  onClick={() => navigate('/train-status')}
                  aria-label="Check live train status"
                  title="Check live train status"
                  role="listitem"
                >
                  <Clock className="h-4 w-4 mr-2" aria-hidden="true" />
                  <span>Check Train Status</span>
                </Button>

                {hasBookings && (
                  <Button
                    variant="outline"
                    type="button"
                    className="w-full justify-start border-gray-300 text-gray-700 hover:bg-gray-50 focus-visible:ring-2 focus-visible:ring-blue-600"
                    aria-label="Rate your recent journey"
                    title="Rate your recent journey"
                    onClick={() => latestPnr ? navigate(`/rate-journey?pnr=${latestPnr}`) : undefined}
                    role="listitem"
                  >
                    <Star className="h-4 w-4 mr-2" aria-hidden="true" />
                    <span>Rate Your Journey</span>
                  </Button>
                )}

                {hasBookings && (
                  <Button
                    variant="outline"
                    type="button"
                    className="w-full justify-start border-gray-300 text-gray-700 hover:bg-gray-50 focus-visible:ring-2 focus-visible:ring-blue-600"
                    aria-label="View payment history"
                    title="View payment history"
                    onClick={() => navigate('/payments')}
                    role="listitem"
                  >
                    <CreditCard className="h-4 w-4 mr-2" aria-hidden="true" />
                    <span>Payment History</span>
                  </Button>
                )}
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
