import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Register from "./pages/Register";
import { Header } from "./components/Header";
import { Navigation } from "./components/Navigation";
import { ChatView } from "./components/ChatView";

const queryClient = new QueryClient();

const AppLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen">
      <Header />
      <Navigation />
      <main className="pl-14 pt-14">
        {children}
      </main>
    </div>
  );
};

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
            <Route path="/register" element={<Register />} />
            <Route
              path="/"
              element={
                isAuthenticated ? (
                  <AppLayout>
                    <Index />
                  </AppLayout>
                ) : (
                  <Navigate to="/landing" replace />
                )
              }
            />
            <Route
              path="/chat"
              element={
                isAuthenticated ? (
                  <AppLayout>
                    <ChatView />
                  </AppLayout>
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