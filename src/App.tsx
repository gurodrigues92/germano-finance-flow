import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import Login from "@/pages/Login";
import NotFound from "./pages/NotFound";
import { FinanceLayout } from "./components/finance/FinanceLayout";
import { Dashboard } from "./pages/finance/Dashboard";
import { Transactions } from "./pages/finance/Transactions";
import { Analysis } from "./pages/finance/Analysis";
import { Archive } from "./pages/finance/Archive";
import { CustosFixos } from "./pages/CustosFixos";
import { Estoque } from "./pages/Estoque";
import { Investimentos } from "./pages/Investimentos";
import { Metas } from "./pages/Metas";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AuthProvider>
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
              <Route path="analise" element={<Analysis />} />
              <Route path="arquivo" element={<Archive />} />
              <Route path="custos-fixos" element={<CustosFixos />} />
              <Route path="estoque" element={<Estoque />} />
              <Route path="investimentos" element={<Investimentos />} />
              <Route path="metas" element={<Metas />} />
            </Route>
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
