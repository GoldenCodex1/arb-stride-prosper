import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import AppLayout from "@/components/AppLayout";
import AdminLayout from "@/components/AdminLayout";
import Dashboard from "@/pages/Dashboard";
import Portfolio from "@/pages/Portfolio";
import Deposit from "@/pages/Deposit";
import Withdraw from "@/pages/Withdraw";
import TradeHistory from "@/pages/TradeHistory";
import Referral from "@/pages/Referral";
import Profile from "@/pages/Profile";
import Auth from "@/pages/Auth";
import AdminDashboard from "@/pages/admin/AdminDashboard";
import AdminTrades from "@/pages/admin/AdminTrades";
import AdminUsers from "@/pages/admin/AdminUsers";
import AdminPlaceholder from "@/pages/admin/AdminPlaceholder";
import NotFound from "@/pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/auth" element={<Auth />} />

            {/* Protected User Routes */}
            <Route path="/" element={<ProtectedRoute><AppLayout><Dashboard /></AppLayout></ProtectedRoute>} />
            <Route path="/portfolio" element={<ProtectedRoute><AppLayout><Portfolio /></AppLayout></ProtectedRoute>} />
            <Route path="/deposit" element={<ProtectedRoute><AppLayout><Deposit /></AppLayout></ProtectedRoute>} />
            <Route path="/withdraw" element={<ProtectedRoute><AppLayout><Withdraw /></AppLayout></ProtectedRoute>} />
            <Route path="/trades" element={<ProtectedRoute><AppLayout><TradeHistory /></AppLayout></ProtectedRoute>} />
            <Route path="/referral" element={<ProtectedRoute><AppLayout><Referral /></AppLayout></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><AppLayout><Profile /></AppLayout></ProtectedRoute>} />

            {/* Protected Admin Routes */}
            <Route path="/admin" element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}>
              <Route index element={<AdminDashboard />} />
              <Route path="trades" element={<AdminTrades />} />
              <Route path="users" element={<AdminUsers />} />
              <Route path="bot" element={<AdminPlaceholder title="Auto Bot Settings" />} />
              <Route path="deposits" element={<AdminPlaceholder title="Manual Deposits" />} />
              <Route path="withdrawals" element={<AdminPlaceholder title="Withdrawals" />} />
              <Route path="transactions" element={<AdminPlaceholder title="Transactions" />} />
              <Route path="referrals" element={<AdminPlaceholder title="Referrals" />} />
              <Route path="kyc" element={<AdminPlaceholder title="KYC Management" />} />
              <Route path="wallets" element={<AdminPlaceholder title="Wallet Settings" />} />
              <Route path="api" element={<AdminPlaceholder title="API Settings" />} />
              <Route path="system" element={<AdminPlaceholder title="System Settings" />} />
              <Route path="security" element={<AdminPlaceholder title="Security Logs" />} />
            </Route>

            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
