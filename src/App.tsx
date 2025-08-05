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
import { SalonLayout } from "./components/salon/SalonLayout";
import { Dashboard } from "./pages/finance/Dashboard";
import { Transactions } from "./pages/finance/Transactions";
import { Analysis } from "./pages/finance/Analysis";
import { Archive } from "./pages/finance/Archive";
import { ProtectedPage } from "./components/ProtectedPage";
import { CustosFixos } from "./pages/CustosFixos";
import { Estoque } from "./pages/Estoque";
// Salon pages
import Agenda from "./pages/Agenda";
import Caixa from "./pages/Caixa";
import Clientes from "./pages/Clientes";
import Profissionais from "./pages/Profissionais";
import Servicos from "./pages/Servicos";

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
                <SalonLayout />
              </ProtectedRoute>
            }>
              <Route index element={<Dashboard />} />
              {/* Salon Routes */}
              <Route path="agenda" element={
                <ProtectedPage permission="view_appointments">
                  <Agenda />
                </ProtectedPage>
              } />
              <Route path="caixa" element={
                <ProtectedPage permission="manage_payments">
                  <Caixa />
                </ProtectedPage>
              } />
              <Route path="clientes" element={
                <ProtectedPage permission="view_clients">
                  <Clientes />
                </ProtectedPage>
              } />
              <Route path="profissionais" element={
                <ProtectedPage permission="manage_professionals">
                  <Profissionais />
                </ProtectedPage>
              } />
              <Route path="servicos" element={
                <ProtectedPage permission="manage_services">
                  <Servicos />
                </ProtectedPage>
              } />
              {/* Financial Routes (Preserved) */}
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
