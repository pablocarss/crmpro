import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { RecentActivities } from "@/components/RecentActivities";
import { RecentLeads } from "@/components/RecentLeads";
import { activityService } from "@/services/activityService";
import { useNavigate } from "react-router-dom";

interface Lead {
  id: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  status: 'novo' | 'contatado' | 'qualificado' | 'negociacao' | 'fechado' | 'perdido';
  createdAt: string;
}

export default function Index() {
  const navigate = useNavigate();
  const [metrics, setMetrics] = useState({
    totalLeads: 0,
    totalActivities: 0,
    conversionRate: 0,
    monthGrowth: {
      leads: 0,
      activities: 0,
      conversion: 0
    }
  });

  useEffect(() => {
    // Atualizar métricas
    const activities = activityService.getActivities();
    const leads: Lead[] = JSON.parse(localStorage.getItem('leads') || '[]');
    
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
    const closedLeads = leads.filter(l => l.status === 'fechado').length;
    const conversionRate = leads.length > 0 ? (closedLeads / leads.length) * 100 : 0;
    
    // Calcular crescimento da taxa de conversão
    const lastMonthClosed = leads.filter(l => {
      const date = new Date(l.createdAt);
      return l.status === 'fechado' &&
             date >= new Date(now.getFullYear(), now.getMonth() - 1, 1) &&
             date < startOfMonth;
    }).length;
    const lastMonthConversion = lastMonthLeads > 0 ? (lastMonthClosed / lastMonthLeads) * 100 : 0;
    const conversionGrowth = lastMonthConversion === 0 ? 0 : ((conversionRate - lastMonthConversion) / lastMonthConversion) * 100;

    setMetrics({
      totalLeads: leads.length,
      totalActivities: activities.length,
      conversionRate,
      monthGrowth: {
        leads: leadGrowth,
        activities: 12.5, // Exemplo fixo por enquanto
        conversion: conversionGrowth
      }
    });
  }, []);

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-gray-400">Bem-vindo ao CRM PRO+</p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="p-6 bg-[#1a1a2e] border-[#2a2a4a] hover:bg-[#2a2a4a] transition-colors cursor-pointer"
              onClick={() => navigate('/funil')}>
          <div className="flex flex-col">
            <span className="text-gray-400">Total de Leads</span>
            <span className="text-3xl font-bold mt-2">{metrics.totalLeads}</span>
            <span className={`text-sm mt-2 ${metrics.monthGrowth.leads >= 0 ? 'text-green-500' : 'text-red-500'}`}>
              {metrics.monthGrowth.leads >= 0 ? '↑' : '↓'} {Math.abs(Math.round(metrics.monthGrowth.leads))}% esse mês
            </span>
          </div>
        </Card>

        <Card className="p-6 bg-[#1a1a2e] border-[#2a2a4a] hover:bg-[#2a2a4a] transition-colors cursor-pointer"
              onClick={() => navigate('/atividades')}>
          <div className="flex flex-col">
            <span className="text-gray-400">Atividades</span>
            <span className="text-3xl font-bold mt-2">{metrics.totalActivities}</span>
            <span className={`text-sm mt-2 ${metrics.monthGrowth.activities >= 0 ? 'text-green-500' : 'text-red-500'}`}>
              {metrics.monthGrowth.activities >= 0 ? '↑' : '↓'} {Math.abs(Math.round(metrics.monthGrowth.activities))}% esse mês
            </span>
          </div>
        </Card>

        <Card className="p-6 bg-[#1a1a2e] border-[#2a2a4a] hover:bg-[#2a2a4a] transition-colors cursor-pointer"
              onClick={() => navigate('/funil')}>
          <div className="flex flex-col">
            <span className="text-gray-400">Taxa de Conversão</span>
            <span className="text-3xl font-bold mt-2">{Math.round(metrics.conversionRate)}%</span>
            <span className={`text-sm mt-2 ${metrics.monthGrowth.conversion >= 0 ? 'text-green-500' : 'text-red-500'}`}>
              {metrics.monthGrowth.conversion >= 0 ? '↑' : '↓'} {Math.abs(Math.round(metrics.monthGrowth.conversion))}% esse mês
            </span>
          </div>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <RecentLeads />
        <RecentActivities />
      </div>
    </div>
  );
}