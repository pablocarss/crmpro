import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Building2, Mail, Phone, Plus, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { LeadForm } from '@/components/LeadForm';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface Lead {
  id: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  status: 'novo' | 'contatado' | 'qualificado' | 'negociacao' | 'fechado' | 'perdido';
  createdAt: string;
}

export default function Funil() {
  const [showForm, setShowForm] = useState(false);
  const [leads, setLeads] = useState<Lead[]>([]);

  useEffect(() => {
    const storedLeads = JSON.parse(localStorage.getItem('leads') || '[]');
    setLeads(storedLeads);
  }, []);

  const funnelStages = [
    { id: 'novo', label: 'Novos Leads', color: 'bg-blue-500/20 text-blue-500' },
    { id: 'contatado', label: 'Contatados', color: 'bg-yellow-500/20 text-yellow-500' },
    { id: 'qualificado', label: 'Qualificados', color: 'bg-green-500/20 text-green-500' },
    { id: 'negociacao', label: 'Em Negociação', color: 'bg-purple-500/20 text-purple-500' },
    { id: 'fechado', label: 'Fechados', color: 'bg-emerald-500/20 text-emerald-500' },
    { id: 'perdido', label: 'Perdidos', color: 'bg-red-500/20 text-red-500' }
  ];

  const getLeadsByStatus = (status: string) => {
    return leads.filter(lead => lead.status === status);
  };

  const updateLeadStatus = (leadId: string, newStatus: Lead['status']) => {
    const updatedLeads = leads.map(lead => 
      lead.id === leadId ? { ...lead, status: newStatus } : lead
    );
    setLeads(updatedLeads);
    localStorage.setItem('leads', JSON.stringify(updatedLeads));
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Funil de Vendas</h1>
          <p className="text-gray-400">Gerencie seus leads em cada etapa do funil</p>
        </div>
        <Button
          className="bg-purple-600 hover:bg-purple-700"
          onClick={() => setShowForm(!showForm)}
        >
          <Plus className="w-4 h-4 mr-2" />
          Novo Lead
        </Button>
      </div>

      {showForm && (
        <div className="mb-6">
          <LeadForm />
        </div>
      )}

      <div className="grid grid-cols-6 gap-4">
        {funnelStages.map((stage) => (
          <div key={stage.id} className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">{stage.label}</h3>
              <Badge className={stage.color}>
                {getLeadsByStatus(stage.id).length}
              </Badge>
            </div>

            <div className="space-y-3">
              {getLeadsByStatus(stage.id).map((lead) => (
                <Card
                  key={lead.id}
                  className="p-4 bg-[#1a1a2e] border-[#2a2a4a] hover:bg-[#2a2a4a] transition-colors cursor-move"
                  draggable
                  onDragStart={(e) => {
                    e.dataTransfer.setData('leadId', lead.id);
                  }}
                >
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-gray-400" />
                      <span className="font-medium">{lead.name}</span>
                    </div>
                    
                    <div className="space-y-1 text-sm text-gray-400">
                      <div className="flex items-center gap-2">
                        <Building2 className="w-4 h-4" />
                        <span>{lead.company}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4" />
                        <span>{lead.email}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4" />
                        <span>{lead.phone}</span>
                      </div>
                    </div>

                    <div className="text-xs text-gray-500">
                      Criado em: {format(new Date(lead.createdAt), "dd/MM/yyyy", { locale: ptBR })}
                    </div>
                  </div>
                </Card>
              ))}

              <div
                className="h-[100px] border-2 border-dashed border-[#2a2a4a] rounded-lg"
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault();
                  const leadId = e.dataTransfer.getData('leadId');
                  updateLeadStatus(leadId, stage.id as Lead['status']);
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
