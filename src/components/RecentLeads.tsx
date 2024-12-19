import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Calendar, Phone, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { leadService, type Lead } from '@/services/leadService';

interface Lead {
  id: string;
  name: string;
  phone?: string;
  productId: string;
  productName: string;
  productPrice: number;
  funnelId: string;
  stageId: string;
  createdAt: string;
  stageHistory: {
    fromStage: string;
    toStage: string;
    reason: string;
    date: string;
  }[];
  observation?: string;
}

export function RecentLeads() {
  const navigate = useNavigate();
  const [leads, setLeads] = useState<Lead[]>([]);

  useEffect(() => {
    // Carregar leads usando o leadService
    const allLeads = leadService.getAll();
    // Ordenar por data de criação (mais recentes primeiro) e pegar os 5 primeiros
    const sortedLeads = allLeads
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 5);
    setLeads(sortedLeads);
  }, []);

  const getStatusFromStage = (lead: Lead) => {
    const currentStage = lead.stageId;
    // Mapear o stageId para um status
    switch (currentStage) {
      case 'novo':
        return { status: 'novo', text: 'Novo Lead' };
      case 'contatado':
        return { status: 'contatado', text: 'Contatado' };
      case 'qualificado':
        return { status: 'qualificado', text: 'Qualificado' };
      case 'negociacao':
        return { status: 'negociacao', text: 'Em Negociação' };
      case 'fechado':
        return { status: 'fechado', text: 'Fechado' };
      default:
        return { status: 'novo', text: 'Novo Lead' };
    }
  };

  const getStatusColor = (lead: Lead) => {
    const { status } = getStatusFromStage(lead);
    const colors = {
      novo: 'bg-blue-500/20 text-blue-500',
      contatado: 'bg-yellow-500/20 text-yellow-500',
      qualificado: 'bg-green-500/20 text-green-500',
      negociacao: 'bg-purple-500/20 text-purple-500',
      fechado: 'bg-emerald-500/20 text-emerald-500',
      perdido: 'bg-red-500/20 text-red-500'
    };
    return colors[status as keyof typeof colors];
  };

  return (
    <Card className="p-4 bg-[#1a1a2e] border-[#2a2a4a]">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Leads Cadastrados</h3>
        <div className="flex gap-2">
          <Button 
            size="sm" 
            className="bg-purple-600 hover:bg-purple-700"
            onClick={() => navigate('/funil')}
          >
            <Plus className="w-4 h-4 mr-2" />
            Novo Lead
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => navigate('/funil')}
          >
            Ver todos
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        {leads.map((lead) => (
          <div
            key={lead.id}
            className="flex items-center justify-between p-4 bg-white rounded-lg shadow hover:bg-gray-50 cursor-pointer"
            onClick={() => navigate(`/funil?lead=${lead.id}`)}
          >
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-3">
                <span className="text-lg font-semibold text-gray-900 truncate">
                  {lead.name}
                </span>
                <Badge className={getStatusColor(lead)}>
                  {getStatusFromStage(lead).text}
                </Badge>
              </div>
              <div className="mt-1 flex items-center space-x-4 text-sm text-gray-500">
                {lead.phone && (
                  <div className="flex items-center">
                    <Phone className="h-4 w-4 mr-1" />
                    {lead.phone}
                  </div>
                )}
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-1" />
                  {format(new Date(lead.createdAt), "d 'de' MMMM", { locale: ptBR })}
                </div>
                <div className="flex items-center">
                  <span className="font-medium">R$ {lead.productPrice.toLocaleString('pt-BR')}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
