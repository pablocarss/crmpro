import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
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

const queryClient = new QueryClient();

function AppLayout({ children }: { children: React.ReactNode }) {
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

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <AppLayout>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/cadastros/produtos" element={<ProductForm />} />
            <Route path="/cadastros/leads" element={<ClientForm />} />
            <Route path="/cadastros/funis" element={<FunnelForm />} />
            <Route path="/funil" element={<FunnelBoard />} />
            <Route path="/whatsapp" element={<Whatsapp />} />
            <Route path="/zapier" element={<Zapier />} />
            <Route path="/zoom" element={<Zoom />} />
            <Route path="/clientes" element={<Clientes />} />
            <Route path="/atividades" element={<Atividades />} />
            <Route path="/logs" element={<Logs />} />
            <Route path="/integracoes" element={<Integracoes />} />
          </Routes>
        </AppLayout>
        <Toaster />
      </Router>
    </QueryClientProvider>
  );
}