import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { RecentActivities } from "@/components/RecentActivities";
import { RecentLeads } from "@/components/RecentLeads";
import { activityService } from "@/services/activityService";
import { leadService } from "@/services/leadService";
import { useNavigate } from "react-router-dom";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Users, Activity, TrendingUp, DollarSign, Coffee } from 'lucide-react';

export default function Index() {
  const navigate = useNavigate();
  const [userName, setUserName] = useState('');
  const [metrics, setMetrics] = useState({
    totalLeads: 0,
    totalActivities: 0,
    conversionRate: 0,
    revenue: 0,
    monthGrowth: {
      leads: 0,
      activities: 0,
      conversion: 0
    }
  });

  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    // Carregar nome do usuário
    const storedName = localStorage.getItem('userName');
    setUserName(storedName || 'Visitante');

    // Atualizar métricas
    const activities = activityService.getActivities();
    const leads = leadService.getAll();
    
    // Calcular crescimento do mês
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const leadsThisMonth = leads.filter(lead => new Date(lead.createdAt) >= startOfMonth).length;
    const lastMonthLeads = leads.filter(lead => {
      const date = new Date(lead.createdAt);
      return date >= new Date(now.getFullYear(), now.getMonth() - 1, 1) &&
             date < startOfMonth;
    }).length;

    // Calcular taxa de crescimento
    const leadGrowth = lastMonthLeads === 0 ? 100 : ((leadsThisMonth - lastMonthLeads) / lastMonthLeads) * 100;
    
    // Calcular taxa de conversão
    const closedLeads = leads.filter(l => l.stageId === 'fechado').length;
    const conversionRate = leads.length > 0 ? (closedLeads / leads.length) * 100 : 0;

    // Calcular receita total
    const revenue = leads
      .filter(l => l.stageId === 'fechado')
      .reduce((total, lead) => total + (lead.productPrice || 0), 0);

    setMetrics({
      totalLeads: leads.length,
      totalActivities: activities.length,
      conversionRate,
      revenue,
      monthGrowth: {
        leads: leadGrowth,
        activities: 0,
        conversion: 0
      }
    });

    // Preparar dados do gráfico
    const last7Days = Array.from({length: 7}, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - i);
      return date;
    }).reverse();

    const chartData = last7Days.map(date => {
      const dayLeads = leads.filter(lead => {
        const leadDate = new Date(lead.createdAt);
        return leadDate.getDate() === date.getDate() &&
               leadDate.getMonth() === date.getMonth() &&
               leadDate.getFullYear() === date.getFullYear();
      }).length;

      return {
        date: date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }),
        leads: dayLeads
      };
    });

    setChartData(chartData);
  }, []);

  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-col gap-2 mb-8">
        <div className="flex items-center gap-2">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-500 to-purple-300 bg-clip-text text-transparent">
            Bem-vindo, {userName}! <Coffee className="inline-block h-8 w-8 ml-2 text-purple-400" />
          </h1>
        </div>
        <p className="text-gray-400">
          Aqui está um resumo das suas atividades e métricas importantes.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="p-6 bg-[#1a1a2e] border-[#2a2a4a] hover:bg-[#2a2a4a] transition-colors">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">Total de Leads</p>
              <h3 className="text-2xl font-bold mt-1">{metrics.totalLeads}</h3>
              <p className={`text-sm mt-1 ${metrics.monthGrowth.leads >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                {metrics.monthGrowth.leads >= 0 ? '↑' : '↓'} {Math.abs(metrics.monthGrowth.leads).toFixed(1)}%
              </p>
            </div>
            <div className="p-4 bg-purple-500/20 rounded-full">
              <Users className="w-6 h-6 text-purple-500" />
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-[#1a1a2e] border-[#2a2a4a] hover:bg-[#2a2a4a] transition-colors">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">Atividades</p>
              <h3 className="text-2xl font-bold mt-1">{metrics.totalActivities}</h3>
              <p className="text-sm mt-1 text-green-500">
                ↑ 12.5%
              </p>
            </div>
            <div className="p-4 bg-blue-500/20 rounded-full">
              <Activity className="w-6 h-6 text-blue-500" />
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-[#1a1a2e] border-[#2a2a4a] hover:bg-[#2a2a4a] transition-colors">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">Taxa de Conversão</p>
              <h3 className="text-2xl font-bold mt-1">{metrics.conversionRate.toFixed(1)}%</h3>
              <p className="text-sm mt-1 text-green-500">
                ↑ 5.2%
              </p>
            </div>
            <div className="p-4 bg-green-500/20 rounded-full">
              <TrendingUp className="w-6 h-6 text-green-500" />
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-[#1a1a2e] border-[#2a2a4a] hover:bg-[#2a2a4a] transition-colors">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">Receita Total</p>
              <h3 className="text-2xl font-bold mt-1">
                {new Intl.NumberFormat('pt-BR', {
                  style: 'currency',
                  currency: 'BRL'
                }).format(metrics.revenue)}
              </h3>
              <p className="text-sm mt-1 text-green-500">
                ↑ 8.3%
              </p>
            </div>
            <div className="p-4 bg-yellow-500/20 rounded-full">
              <DollarSign className="w-6 h-6 text-yellow-500" />
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6 bg-[#1a1a2e] border-[#2a2a4a]">
          <h3 className="text-lg font-medium mb-4">Leads nos Últimos 7 Dias</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#2a2a4a" />
                <XAxis 
                  dataKey="date" 
                  stroke="#666"
                  tick={{ fill: '#666' }}
                />
                <YAxis 
                  stroke="#666"
                  tick={{ fill: '#666' }}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1a1a2e',
                    border: '1px solid #2a2a4a',
                    borderRadius: '8px'
                  }}
                  labelStyle={{ color: '#fff' }}
                />
                <Line 
                  type="monotone" 
                  dataKey="leads" 
                  stroke="#8b5cf6" 
                  strokeWidth={2}
                  dot={{ fill: '#8b5cf6', strokeWidth: 2 }}
                  activeDot={{ r: 8 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-6 bg-[#1a1a2e] border-[#2a2a4a]">
          <RecentLeads />
        </Card>
      </div>

      <Card className="p-6 bg-[#1a1a2e] border-[#2a2a4a]">
        <RecentActivities />
      </Card>
    </div>
  );
}