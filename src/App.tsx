import React from "react";
import { Toaster } from "./components/ui/toaster";
import { Toaster as Sonner } from "./components/ui/sonner";
import { TooltipProvider } from "./components/ui/tooltip";
import { useAuth } from "@/hooks/useAuth";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "@/components/ThemeContext";
import { useEffect } from 'react';
import './App.css';

// Simple auth wrapper component
const AuthWrapper: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const { isLoading } = useAuth();
  
  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen bg-gray-50 text-gray-900">Loading...</div>;
  }
  
  return <>{children}</>;
};

import { BrowserRouter, Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";
import HomePage from "./pages/HomePage";
import WelcomePage from "./pages/WelcomePage";
import AdminDashboard from "./pages/AdminDashboard";
import AdminHomePage from "./pages/AdminHomePage";
import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";
import NotFound from "./pages/NotFound";

const PassengerDashboard = lazy(() => import("./pages/PassengerDashboard"));
const TrainStatus = lazy(() => import("./pages/TrainStatus"));
const StationInfo = lazy(() => import("./pages/StationInfo"));
const BookTicket = lazy(() => import("./pages/BookTicket"));
const Login = lazy(() => import("./pages/Login"));
const Register = lazy(() => import("./pages/Register"));
const TicketDetailsPage = lazy(() => import("./pages/TicketDetailsPage"));
const HelpCenter = lazy(() => import("./pages/HelpCenter"));
const TripPlannerPage = lazy(() => import("./pages/TripPlannerPage"));
const PaymentHistory = lazy(() => import("./pages/PaymentHistory"));
const RateJourney = lazy(() => import("./pages/RateJourney"));
const PriorityTicketManagement = lazy(() => import("./components/admin/PriorityTicketManagement"));
const TicketManagement = lazy(() => import("./pages/TicketManagement"));
const TrainManagement = lazy(() => import("./pages/TrainManagement"));
const RouteManagement = lazy(() => import("./pages/RouteManagement"));
const StationManagement = lazy(() => import("./pages/StationManagement"));
const ScheduleManagement = lazy(() => import("./pages/ScheduleManagement"));
const UserManagement = lazy(() => import("./pages/UserManagement"));
const StaffManagement = lazy(() => import("./pages/StaffManagement"));
const ReportsAnalytics = lazy(() => import("./pages/ReportsAnalytics"));
const FinancialManagement = lazy(() => import("./pages/FinancialManagement"));
const CustomerSupport = lazy(() => import("./pages/CustomerSupport"));
const SystemMonitoring = lazy(() => import("./pages/SystemMonitoring"));
const CollisionDetection = lazy(() => import("./pages/CollisionDetection"));
const CrowdMonitoring = lazy(() => import("./pages/CrowdMonitoring"));
const EnergyManagement = lazy(() => import("./pages/EnergyManagement"));
const AIStationManagement = lazy(() => import("./pages/AIStationManagement"));
const DatabaseManagement = lazy(() => import("./pages/DatabaseManagement"));
const SystemSettings = lazy(() => import("./pages/SystemSettings"));
const UserProfile = lazy(() => import("./pages/UserProfile"));
const TicketsPage = lazy(() => import("./pages/TicketsPage"));
const FoodOrdering = lazy(() => import("./pages/FoodOrdering"));

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <AuthWrapper>
        <div className="min-h-screen bg-gray-50">
          <TooltipProvider>
            <Sonner />
            <BrowserRouter>
              <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Loading...</div>}>
              <Routes>
                <Route path="/welcome" element={<WelcomePage />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/" element={<Layout />}>
                  <Route 
                    index 
                    element={
                      <ProtectedRoute requireRole="user">
                        <HomePage />
                      </ProtectedRoute>
                    } 
                  />
                  <Route
                    path="admin"
                    element={
                      <ProtectedRoute requireRole="admin">
                        <AdminHomePage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="admin/dashboard"
                    element={
                      <ProtectedRoute requireRole="admin">
                        <AdminDashboard />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="admin/priority-tickets"
                    element={
                      <ProtectedRoute requireRole="admin">
                        <PriorityTicketManagement />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="admin/tickets"
                    element={
                      <ProtectedRoute requireRole="admin">
                        <TicketManagement />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="admin/trains"
                    element={
                      <ProtectedRoute requireRole="admin">
                        <TrainManagement />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="admin/routes"
                    element={
                      <ProtectedRoute requireRole="admin">
                        <RouteManagement />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="admin/stations"
                    element={
                      <ProtectedRoute requireRole="admin">
                        <StationManagement />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="admin/schedules"
                    element={
                      <ProtectedRoute requireRole="admin">
                        <ScheduleManagement />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="admin/users"
                    element={
                      <ProtectedRoute requireRole="admin">
                        <UserManagement />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="admin/staff"
                    element={
                      <ProtectedRoute requireRole="admin">
                        <StaffManagement />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="admin/reports"
                    element={
                      <ProtectedRoute requireRole="admin">
                        <ReportsAnalytics />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="admin/finance"
                    element={
                      <ProtectedRoute requireRole="admin">
                        <FinancialManagement />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="admin/support"
                    element={
                      <ProtectedRoute requireRole="admin">
                        <CustomerSupport />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="admin/monitoring"
                    element={
                      <ProtectedRoute requireRole="admin">
                        <SystemMonitoring />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="admin/collision"
                    element={
                      <ProtectedRoute requireRole="admin">
                        <CollisionDetection />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="admin/crowd"
                    element={
                      <ProtectedRoute requireRole="admin">
                        <CrowdMonitoring />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="admin/energy"
                    element={
                      <ProtectedRoute requireRole="admin">
                        <EnergyManagement />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="admin/ai-station"
                    element={
                      <ProtectedRoute requireRole="admin">
                        <AIStationManagement />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="admin/database"
                    element={
                      <ProtectedRoute requireRole="admin">
                        <DatabaseManagement />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="admin/settings"
                    element={
                      <ProtectedRoute requireRole="admin">
                        <SystemSettings />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="passenger"
                    element={
                      <ProtectedRoute requireRole="user">
                        <PassengerDashboard />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="profile"
                    element={
                      <ProtectedRoute requireRole="user">
                        <UserProfile />
                      </ProtectedRoute>
                    }
                  />
                  {/* User portal route removed per request */}
                  {/* Public user routes */}
                  <Route
                    path="train-status"
                    element={
                      <ProtectedRoute>
                        <TrainStatus />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="stations"
                    element={
                      <ProtectedRoute>
                        <StationInfo />
                      </ProtectedRoute>
                    }
                  />
                  {/* Chatbot is integrated into Trip Planner now */}
                  <Route
                    path="book-ticket"
                    element={
                      <ProtectedRoute>
                        <BookTicket /> 
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="trip-planner"
                    element={
                      <ProtectedRoute>
                        <TripPlannerPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route path="help" element={<HelpCenter />} />
                  <Route path="ticket/:pnr" element={<TicketDetailsPage />} />
                  <Route
                    path="food-ordering"
                    element={
                      <ProtectedRoute>
                        <FoodOrdering />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="tickets"
                    element={
                      <ProtectedRoute>
                        <TicketsPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="payments"
                    element={
                      <ProtectedRoute>
                        <PaymentHistory />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="rate-journey"
                    element={
                      <ProtectedRoute>
                        <RateJourney />
                      </ProtectedRoute>
                    }
                  />
                </Route>
                <Route path="*" element={<NotFound />} />
              </Routes>
              </Suspense>
            </BrowserRouter>
          </TooltipProvider>
        </div>
        <Toaster />
      </AuthWrapper>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;