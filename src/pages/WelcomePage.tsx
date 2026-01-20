import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { 
  Train, 
  Users, 
  Shield, 
  Zap, 
  QrCode, 
  MapPin,
  Star,
  CreditCard,
  Clock,
  AlertTriangle,
  LogIn,
  ArrowRight,
  Sparkles
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";

const WelcomePage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { signIn } = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await signIn(email, password);
      // Decide route by role stored in Firestore
      const uid = (await import("firebase/auth")).getAuth().currentUser?.uid;
      if (uid) {
        const adminSnap = await getDoc(doc(db, "admins", uid));
        if (adminSnap.exists()) {
          navigate("/admin");
          return;
        }
      }
      navigate("/passenger");
    } catch (error) {

      console.error("Login error:", error);
    }
  };

  const fillDemoAdmin = () => {
    setEmail("wizking864@gmail.com");
    setPassword("Wizking@123");
  };

  const quickLoginDemoAdmin = async () => {
    setEmail("wizking864@gmail.com");
    setPassword("Wizking@123");
    setTimeout(async () => {
      try {
        await signIn("wizking864@gmail.com", "Wizking@123");
        navigate("/admin");
      } catch {
        // ignore
      }
    }, 0);
  };

  const passengerFeatures = [
    { icon: Clock, title: "Live Train Status", description: "Real-time tracking & updates", color: "text-blue-600" },
    { icon: QrCode, title: "QR Ticket Booking", description: "Contactless digital tickets", color: "text-green-600" },
    { icon: MapPin, title: "Trip Planner", description: "Hotels & local attractions", color: "text-orange-600" },
    { icon: Star, title: "Priority Access", description: "Skip queues & fast-track", color: "text-yellow-600" },
    { icon: CreditCard, title: "Secure Payments", description: "Multiple payment options", color: "text-indigo-600" }
  ];

  const adminFeatures = [
    { icon: AlertTriangle, title: "Collision Detection", description: "AI-powered safety monitoring", color: "text-red-600" },
    { icon: Users, title: "Crowd Analytics", description: "Real-time density tracking", color: "text-teal-600" },
    { icon: Zap, title: "Energy Control", description: "Smart grid optimization", color: "text-amber-600" }
  ];

  return (
    <div className="min-h-screen gradient-bg">
      <div className="container mx-auto px-4 py-12 lg:py-20">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center mb-6">
            <div className="relative">
              <div className="absolute inset-0 bg-primary/20 rounded-3xl blur-xl"></div>
              <div className="relative p-4 bg-primary/10 rounded-2xl backdrop-blur-sm">
                <Train className="h-16 w-16 text-primary" />
              </div>
            </div>
          </div>
          <h1 className="text-5xl lg:text-7xl font-bold tracking-tight mb-6 bg-gradient-to-r from-primary to-primary/70 bg-clip-text">
            TrackWise Railway
          </h1>
          <p className="text-xl lg:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Next-generation railway management platform combining intelligent automation with seamless passenger experience
          </p>
          <div className="flex items-center justify-center gap-2 mt-4">
            <Sparkles className="h-5 w-5 text-primary" />
            <span className="text-primary font-medium">Powered by Advanced AI</span>
          </div>
        </div>

        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-5 gap-8 lg:gap-12">
            {/* Login Section */}
            <div className="lg:col-span-2">
              <Card className="glass-morphism border-0 shadow-2xl card-hover">
                <CardHeader className="text-center pb-6">
                  <div className="flex items-center justify-center mb-4">
                    <div className="p-3 bg-primary/10 rounded-xl">
                      <LogIn className="h-7 w-7 text-primary" />
                    </div>
                  </div>
                  <CardTitle className="text-2xl">Welcome Back</CardTitle>
                  <CardDescription className="text-base">
                    Access your personalized dashboard
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <form onSubmit={handleLogin} className="space-y-5">
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-sm font-medium">Email Address</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="your.email@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="h-12"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="password" className="text-sm font-medium">Password</Label>
                      <Input
                        id="password"
                        type="password"
                        placeholder="Enter your secure password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="h-12"
                        required
                      />
                    </div>
                    <Button type="submit" className="w-full h-12 text-base font-medium">
                      Sign In
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </form>
                  
                  <div className="pt-4">
                    <div className="text-center">
                      <span className="text-sm text-gray-500">Don't have an account? </span>
                      <Button 
                        variant="link" 
                        onClick={() => navigate('/register')}
                        className="p-0 h-auto text-primary hover:text-primary/80 font-medium"
                      >
                        Sign up here
                      </Button>
                    </div>
                  </div>
                  
                  <div className="pt-6 border-t border-border/50">
                    <p className="text-sm text-gray-500 text-center mb-4">Demo Admin Account</p>
                    <div className="grid gap-3">
                      <div className="flex justify-between items-center p-3 bg-muted/30 rounded-xl cursor-pointer" onClick={fillDemoAdmin}>
                        <div>
                          <span className="text-sm font-medium">wizking864@gmail.com</span>
                          <p className="text-xs text-gray-500">Click to autofill • Admin Dashboard</p>
                        </div>
                        <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">Admin</Badge>
                      </div>
                      <Button variant="outline" className="w-full" onClick={quickLoginDemoAdmin}>
                        Login as Demo Admin
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Features Section */}
            <div className="lg:col-span-3 space-y-10">
              {/* Passenger Features */}
              <div>
                <div className="flex items-center gap-4 mb-8">
                  <div className="p-3 bg-blue-50 rounded-xl">
                    <Users className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold">For Passengers</h2>
                    <p className="text-gray-600">Smart travel solutions at your fingertips</p>
                  </div>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  {passengerFeatures.map((feature, index) => (
                    <div key={index} className="group p-4 bg-card/50 rounded-xl border border-border/50 hover:bg-card hover:shadow-lg transition-all duration-300">
                      <div className="flex items-start gap-4">
                        <div className="p-2 bg-muted/50 rounded-lg group-hover:scale-110 transition-transform">
                          <feature.icon className={`h-5 w-5 ${feature.color}`} />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-sm mb-1">{feature.title}</h3>
                          <p className="text-xs text-gray-500 leading-relaxed">{feature.description}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Admin Features */}
              <div>
                <div className="flex items-center gap-4 mb-8">
                  <div className="p-3 bg-red-50 rounded-xl">
                    <Shield className="h-6 w-6 text-red-600" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold">For Administrators</h2>
                    <p className="text-gray-600">Advanced control & monitoring systems</p>
                  </div>
                </div>
                <div className="grid md:grid-cols-3 gap-4">
                  {adminFeatures.map((feature, index) => (
                    <div key={index} className="group p-4 bg-card/50 rounded-xl border border-border/50 hover:bg-card hover:shadow-lg transition-all duration-300">
                      <div className="text-center">
                        <div className="inline-flex p-3 bg-muted/50 rounded-lg mb-3 group-hover:scale-110 transition-transform">
                          <feature.icon className={`h-6 w-6 ${feature.color}`} />
                        </div>
                        <h3 className="font-semibold text-sm mb-2">{feature.title}</h3>
                        <p className="text-xs text-gray-500 leading-relaxed">{feature.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Live Stats */}
              {/* Real-Time System Overview removed per requirements */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WelcomePage;
