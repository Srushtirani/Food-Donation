
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";

// Layouts
import MainLayout from "@/components/layout/MainLayout";

// Pages
import Index from "./pages/Index";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import DashboardPage from "./pages/DashboardPage";
import DonationsPage from "./pages/DonationsPage";
import DonationFormPage from "./pages/DonationFormPage";
import DonationDetailsPage from "./pages/DonationDetailsPage";
import DonationTrackingPage from "./pages/DonationTrackingPage";
import VolunteerPage from "./pages/VolunteerPage";
import AdminPanelPage from "./pages/AdminPanelPage";
import ProfilePage from "./pages/ProfilePage";
import SchedulePage from "./pages/SchedulePage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/volunteers" element={<VolunteerPage />} />
            
            {/* Protected routes - using MainLayout */}
            <Route element={<MainLayout />}>
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/donations" element={<DonationsPage />} />
              <Route path="/donations/new" element={<DonationFormPage />} />
              <Route path="/donations/:id" element={<DonationDetailsPage />} />
              <Route path="/donations/:id/track" element={<DonationTrackingPage />} />
              <Route path="/admin" element={<AdminPanelPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/schedule" element={<SchedulePage />} />
            </Route>
            
            {/* Catch-all route for 404 */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
