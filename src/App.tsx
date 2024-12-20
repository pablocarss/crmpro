import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Navigation } from './components/Navigation';
import { Toaster } from './components/ui/toaster';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Index from './pages/Index';
import Whatsapp from './pages/Whatsapp';
import Zapier from './pages/Zapier';
import Zoom from './pages/Zoom';
import Clientes from './pages/Clientes';
import { ProductForm } from './components/ProductForm';
import { ClientForm } from './components/ClientForm';
import { FunnelForm } from './components/FunnelForm';
import { FunnelBoard } from './components/FunnelBoard';
import Integracoes from './pages/Integracoes';
import Atividades from './pages/Atividades';
import Logs from './pages/Logs';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import { useEffect } from 'react';

const queryClient = new QueryClient();

// Componente para verificar autenticação
const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

// Layout do sistema após login
function AppLayout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';

  // Se não estiver autenticado ou estiver em uma rota pública, não mostra o layout do app
  if (!isAuthenticated || ['/login', '/register', '/'].includes(location.pathname)) {
    return <>{children}</>;
  }

  return (
    <div className="flex h-screen bg-[#0f0f1e] text-white">
      <Navigation />
      <main className="flex-1 overflow-auto pl-20 lg:pl-20">
        <div className="container mx-auto p-4 md:p-6">
          {children}
        </div>
      </main>
    </div>
  );
}

// Layout para páginas públicas
function PublicLayout({ children }: { children: React.ReactNode }) {
  return children;
}

function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#0f0f1e]">
      <Navigation />
      <main className="pl-20 transition-all duration-300">
        <div className="p-6">
          {children}
        </div>
      </main>
    </div>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <AppLayout>
          <Routes>
            {/* Rotas Públicas */}
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Rotas Protegidas */}
            <Route
              path="/dashboard"
              element={
                <PrivateRoute>
                  <Layout>
                    <Index />
                  </Layout>
                </PrivateRoute>
              }
            />
            <Route path="/cadastros/produtos" element={
              <PrivateRoute>
                <ProductForm />
              </PrivateRoute>
            } />
            <Route path="/cadastros/leads" element={
              <PrivateRoute>
                <ClientForm />
              </PrivateRoute>
            } />
            <Route path="/cadastros/funis" element={
              <PrivateRoute>
                <FunnelForm />
              </PrivateRoute>
            } />
            <Route path="/funil" element={
              <PrivateRoute>
                <FunnelBoard />
              </PrivateRoute>
            } />
            <Route path="/whatsapp" element={
              <PrivateRoute>
                <Whatsapp />
              </PrivateRoute>
            } />
            <Route path="/zapier" element={
              <PrivateRoute>
                <Zapier />
              </PrivateRoute>
            } />
            <Route path="/zoom" element={
              <PrivateRoute>
                <Zoom />
              </PrivateRoute>
            } />
            <Route path="/clientes" element={
              <PrivateRoute>
                <Clientes />
              </PrivateRoute>
            } />
            <Route path="/atividades" element={
              <PrivateRoute>
                <Atividades />
              </PrivateRoute>
            } />
            <Route path="/logs" element={
              <PrivateRoute>
                <Logs />
              </PrivateRoute>
            } />
            <Route path="/integracoes" element={
              <PrivateRoute>
                <Integracoes />
              </PrivateRoute>
            } />

            {/* Redireciona qualquer rota não encontrada para o dashboard se autenticado, ou para landing se não */}
            <Route path="*" element={
              localStorage.getItem('isAuthenticated') === 'true' 
                ? <Navigate to="/dashboard" replace />
                : <Navigate to="/" replace />
            } />
          </Routes>
        </AppLayout>
        <Toaster />
      </Router>
    </QueryClientProvider>
  );
}