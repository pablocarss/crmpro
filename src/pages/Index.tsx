import { Header } from "@/components/Header";
import { DashboardMetrics } from "@/components/DashboardMetrics";
import { FunnelBoard } from "@/components/FunnelBoard";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto py-6 space-y-6">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <DashboardMetrics />
        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-4">Funis de Venda</h2>
          <FunnelBoard />
        </div>
      </main>
    </div>
  );
};

export default Index;