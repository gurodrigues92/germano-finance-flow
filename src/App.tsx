import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { UserProfileProvider } from "@/contexts/UserProfileContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import PWAInstallPrompt from "@/components/PWAInstallPrompt";
import NetworkStatus from "@/components/NetworkStatus";
import { usePWA } from "@/hooks/usePWA";
import Login from "@/pages/Login";
import NotFound from "./pages/NotFound";
import { FinanceLayout } from "./components/finance/FinanceLayout";
import { Dashboard } from "./pages/finance/Dashboard";
import { Transactions } from "./pages/finance/Transactions";
import { Analysis } from "./pages/finance/Analysis";
import { Archive } from "./pages/finance/Archive";
import { ProtectedPage } from "./components/ProtectedPage";
import { CustosFixos } from "./pages/CustosFixos";
import { Estoque } from "./pages/Estoque";
import { Investimentos } from "./pages/Investimentos";
import { Metas } from "./pages/Metas";

const queryClient = new QueryClient();

const App = () => {
  const { isOnline } = usePWA();

  return (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AuthProvider>
        <UserProfileProvider>
          <PWAInstallPrompt />
          <NetworkStatus />
          <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={
              <ProtectedRoute>
                <FinanceLayout />
              </ProtectedRoute>
            }>
              <Route index element={<Dashboard />} />
              <Route path="transacoes" element={<Transactions />} />
              <Route path="analise" element={
                <ProtectedPage permission="view_analysis">
                  <Analysis />
                </ProtectedPage>
              } />
              <Route path="arquivo" element={
                <ProtectedPage permission="view_archive">
                  <Archive />
                </ProtectedPage>
              } />
              <Route path="custos-fixos" element={
                <ProtectedPage permission="view_fixed_costs">
                  <CustosFixos />
                </ProtectedPage>
              } />
              <Route path="estoque" element={
                <ProtectedPage permission="view_stock">
                  <Estoque />
                </ProtectedPage>
              } />
              <Route path="investimentos" element={
                <ProtectedPage permission="view_investments">
                  <Investimentos />
                </ProtectedPage>
              } />
              <Route path="metas" element={
                <ProtectedPage permission="view_goals">
                  <Metas />
                </ProtectedPage>
              } />
            </Route>
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
          </BrowserRouter>
        </UserProfileProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
  );
};

export default App;
