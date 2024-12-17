import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import Landing from "./pages/Landing";
import Login from "./pages/Login";

const queryClient = new QueryClient();

const App = () => {
  // Simular verificação de autenticação
  const isAuthenticated = localStorage.getItem("isAuthenticated") === "true";

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/landing" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route
              path="/"
              element={
                isAuthenticated ? (
                  <Index />
                ) : (
                  <Navigate to="/landing" replace />
                )
              }
            />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;