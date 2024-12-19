import { Card } from "./ui/card";
import { ArrowUpRight, ArrowDownRight, DollarSign, Users, Target, Percent } from "lucide-react";

export function DashboardMetrics() {
  const metrics = {
    vendas: {
      valor: "R$ 45.850",
      percentual: 12.5,
      crescimento: true
    },
    leads: {
      valor: "126",
      percentual: 8.2,
      crescimento: true
    },
    conversao: {
      valor: "32%",
      percentual: -2.4,
      crescimento: false
    },
    ticket: {
      valor: "R$ 1.250",
      percentual: 5.8,
      crescimento: true
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card className="p-6 bg-[#1a1a2e] border-[#2a2a4a]">
        <div className="flex items-center justify-between">
          <div className="h-12 w-12 rounded-full bg-purple-500/10 flex items-center justify-center">
            <DollarSign className="h-6 w-6 text-purple-500" />
          </div>
          {metrics.vendas.crescimento ? (
            <div className="flex items-center text-green-500">
              <ArrowUpRight className="h-4 w-4" />
              <span className="text-sm">↑{metrics.vendas.percentual}%</span>
            </div>
          ) : (
            <div className="flex items-center text-red-500">
              <ArrowDownRight className="h-4 w-4" />
              <span className="text-sm">↓{Math.abs(metrics.vendas.percentual)}%</span>
            </div>
          )}
        </div>
        <div className="mt-4">
          <p className="text-sm font-medium text-gray-400">Vendas do Mês</p>
          <h3 className="text-2xl font-bold mt-1 text-white">{metrics.vendas.valor}</h3>
        </div>
      </Card>

      <Card className="p-6 bg-[#1a1a2e] border-[#2a2a4a]">
        <div className="flex items-center justify-between">
          <div className="h-12 w-12 rounded-full bg-purple-500/10 flex items-center justify-center">
            <Users className="h-6 w-6 text-purple-500" />
          </div>
          {metrics.leads.crescimento ? (
            <div className="flex items-center text-green-500">
              <ArrowUpRight className="h-4 w-4" />
              <span className="text-sm">↑{metrics.leads.percentual}%</span>
            </div>
          ) : (
            <div className="flex items-center text-red-500">
              <ArrowDownRight className="h-4 w-4" />
              <span className="text-sm">↓{Math.abs(metrics.leads.percentual)}%</span>
            </div>
          )}
        </div>
        <div className="mt-4">
          <p className="text-sm font-medium text-gray-400">Novos Leads</p>
          <h3 className="text-2xl font-bold mt-1 text-white">{metrics.leads.valor}</h3>
        </div>
      </Card>

      <Card className="p-6 bg-[#1a1a2e] border-[#2a2a4a]">
        <div className="flex items-center justify-between">
          <div className="h-12 w-12 rounded-full bg-purple-500/10 flex items-center justify-center">
            <Percent className="h-6 w-6 text-purple-500" />
          </div>
          {metrics.conversao.crescimento ? (
            <div className="flex items-center text-green-500">
              <ArrowUpRight className="h-4 w-4" />
              <span className="text-sm">↑{metrics.conversao.percentual}%</span>
            </div>
          ) : (
            <div className="flex items-center text-red-500">
              <ArrowDownRight className="h-4 w-4" />
              <span className="text-sm">↓{Math.abs(metrics.conversao.percentual)}%</span>
            </div>
          )}
        </div>
        <div className="mt-4">
          <p className="text-sm font-medium text-gray-400">Taxa de Conversão</p>
          <h3 className="text-2xl font-bold mt-1 text-white">{metrics.conversao.valor}</h3>
        </div>
      </Card>

      <Card className="p-6 bg-[#1a1a2e] border-[#2a2a4a]">
        <div className="flex items-center justify-between">
          <div className="h-12 w-12 rounded-full bg-purple-500/10 flex items-center justify-center">
            <Target className="h-6 w-6 text-purple-500" />
          </div>
          {metrics.ticket.crescimento ? (
            <div className="flex items-center text-green-500">
              <ArrowUpRight className="h-4 w-4" />
              <span className="text-sm">↑{metrics.ticket.percentual}%</span>
            </div>
          ) : (
            <div className="flex items-center text-red-500">
              <ArrowDownRight className="h-4 w-4" />
              <span className="text-sm">↓{Math.abs(metrics.ticket.percentual)}%</span>
            </div>
          )}
        </div>
        <div className="mt-4">
          <p className="text-sm font-medium text-gray-400">Ticket Médio</p>
          <h3 className="text-2xl font-bold mt-1 text-white">{metrics.ticket.valor}</h3>
        </div>
      </Card>
    </div>
  );
}