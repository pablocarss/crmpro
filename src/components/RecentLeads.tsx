import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Calendar, Phone, Mail, Plus, Building2, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';

interface Lead {
  id: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  status: 'novo' | 'contatado' | 'qualificado' | 'negociacao' | 'fechado' | 'perdido';
  createdAt: string;
}

export function RecentLeads() {
  const navigate = useNavigate();
  const [leads, setLeads] = useState<Lead[]>([]);

  useEffect(() => {
    // Carregar leads do localStorage
    const storedLeads = JSON.parse(localStorage.getItem('leads') || '[]');
    // Ordenar por data de criação (mais recentes primeiro) e pegar os 5 primeiros
    const sortedLeads = storedLeads
      .sort((a: Lead, b: Lead) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 5);
    setLeads(sortedLeads);
  }, []);

  const getStatusColor = (status: Lead['status']) => {
    const colors = {
      novo: 'bg-blue-500/20 text-blue-500',
      contatado: 'bg-yellow-500/20 text-yellow-500',
      qualificado: 'bg-green-500/20 text-green-500',
      negociacao: 'bg-purple-500/20 text-purple-500',
      fechado: 'bg-emerald-500/20 text-emerald-500',
      perdido: 'bg-red-500/20 text-red-500'
    };
    return colors[status];
  };

  const getStatusText = (status: Lead['status']) => {
    const statuses = {
      novo: 'Novo Lead',
      contatado: 'Contatado',
      qualificado: 'Qualificado',
      negociacao: 'Em Negociação',
      fechado: 'Fechado',
      perdido: 'Perdido'
    };
    return statuses[status];
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
            className="flex items-start justify-between p-3 rounded-lg bg-[#2a2a4a]/50 hover:bg-[#2a2a4a] transition-colors cursor-pointer"
            onClick={() => navigate('/funil')}
          >
            <div className="space-y-2 w-full">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-full bg-purple-500/20 text-purple-500">
                    <User className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-medium">{lead.name}</span>
                    <div className="flex items-center gap-2 text-sm">
                      <Badge className={getStatusColor(lead.status)}>
                        {getStatusText(lead.status)}
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm text-gray-400">
                <div className="flex items-center gap-1">
                  <Building2 className="w-4 h-4" />
                  <span>{lead.company}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  <span>{format(new Date(lead.createdAt), "dd/MM/yyyy", { locale: ptBR })}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Mail className="w-4 h-4" />
                  <span>{lead.email}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Phone className="w-4 h-4" />
                  <span>{lead.phone}</span>
                </div>
              </div>
            </div>
          </div>
        ))}

        {leads.length === 0 && (
          <div className="text-center py-4 text-gray-400">
            Nenhum lead cadastrado
          </div>
        )}
      </div>
    </Card>
  );
}
