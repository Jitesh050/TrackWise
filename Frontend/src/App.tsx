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
import HomePage from "./pages/HomePage";
import WelcomePage from "./pages/WelcomePage";
import AdminDashboard from "./pages/AdminDashboard";
import AdminHomePage from "./pages/AdminHomePage";
import PassengerDashboard from "./pages/PassengerDashboard";
import TrainStatus from "./pages/TrainStatus";
import StationInfo from "./pages/StationInfo";
import BookTicket from "./pages/BookTicket";
// ChatBotPage removed; chatbot is embedded in Trip Planner
import Login from "./pages/Login";
import Register from "./pages/Register";
import NotFound from "./pages/NotFound";
import TicketDetailsPage from "./pages/TicketDetailsPage";
import HelpCenter from "./pages/HelpCenter";
import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";
import TripPlannerPage from "./pages/TripPlannerPage";
import PriorityTicketManagement from "./components/admin/PriorityTicketManagement";
import TicketManagement from "./pages/TicketManagement";
import TrainManagement from "./pages/TrainManagement";
import RouteManagement from "./pages/RouteManagement";
import StationManagement from "./pages/StationManagement";
import ScheduleManagement from "./pages/ScheduleManagement";
import UserManagement from "./pages/UserManagement";
import StaffManagement from "./pages/StaffManagement";
import ReportsAnalytics from "./pages/ReportsAnalytics";
import FinancialManagement from "./pages/FinancialManagement";
import CustomerSupport from "./pages/CustomerSupport";
import SystemMonitoring from "./pages/SystemMonitoring";
import CollisionDetection from "./pages/CollisionDetection";
import CrowdMonitoring from "./pages/CrowdMonitoring";
import EnergyManagement from "./pages/EnergyManagement";
import AIStationManagement from "./pages/AIStationManagement";
import DatabaseManagement from "./pages/DatabaseManagement";
import SystemSettings from "./pages/SystemSettings";
import UserProfile from "./pages/UserProfile";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <AuthWrapper>
        <div className="min-h-screen bg-gray-50">
          <TooltipProvider>
            <Sonner />
            <BrowserRouter>
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
                </Route>
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </TooltipProvider>
        </div>
        <Toaster />
      </AuthWrapper>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;