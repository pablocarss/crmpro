import { Card } from "@/components/ui/card";
import { ChartBar, Users, Database, MessageSquare } from "lucide-react";

export function DashboardMetrics() {
  const metrics = [
    {
      title: "Total Clientes",
      value: "1,234",
      change: "+12%",
      icon: Users,
    },
    {
      title: "Vendas Mensais",
      value: "R$ 52.000",
      change: "+8%",
      icon: ChartBar,
    },
    {
      title: "Leads Ativos",
      value: "89",
      change: "+5%",
      icon: Database,
    },
    {
      title: "Tickets Abertos",
      value: "23",
      change: "-2%",
      icon: MessageSquare,
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {metrics.map((metric) => (
        <Card key={metric.title} className="card-gradient p-6 border-border/50">
          <div className="flex items-center justify-between">
            <metric.icon className="h-8 w-8 text-primary" />
            <span className={`text-sm ${metric.change.startsWith('+') ? 'text-green-500' : 'text-red-500'}`}>
              {metric.change}
            </span>
          </div>
          <h3 className="mt-4 text-2xl font-bold">{metric.value}</h3>
          <p className="text-sm text-muted-foreground">{metric.title}</p>
        </Card>
      ))}
    </div>
  );
}