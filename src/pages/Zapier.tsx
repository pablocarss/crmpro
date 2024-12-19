import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { integrationService } from '@/services/integrationService';
import { Plus, Trash2, Plug, ArrowRight } from 'lucide-react';
import { Label } from '@/components/ui/label';

interface Zap {
  id: string;
  name: string;
  trigger: string;
  action: string;
  lastRun?: string;
  status: 'active' | 'inactive' | 'error';
}

export default function Zapier() {
  const { toast } = useToast();
  const [zaps, setZaps] = useState<Zap[]>([]);
  const [showAddZap, setShowAddZap] = useState(false);
  const [newZap, setNewZap] = useState({
    name: '',
    trigger: '',
    action: ''
  });

  useEffect(() => {
    if (!integrationService.isZapierConfigured()) {
      toast({
        title: "Zapier não configurado",
        description: "Configure o Zapier nas Integrações primeiro",
        variant: "destructive",
      });
      return;
    }

    // Aqui você carregaria os Zaps da API do Zapier
    // Por enquanto, vamos usar dados de exemplo
    setZaps([
      {
        id: '1',
        name: 'Novo Lead para Trello',
        trigger: 'Novo Lead Criado',
        action: 'Criar Card no Trello',
        lastRun: '2024-01-18T14:30:00',
        status: 'active'
      },
      {
        id: '2',
        name: 'Email para Leads',
        trigger: 'Lead Qualificado',
        action: 'Enviar Email',
        lastRun: '2024-01-18T15:45:00',
        status: 'active'
      }
    ] as Zap[]);
  }, []);

  const handleAddZap = () => {
    if (!newZap.name || !newZap.trigger || !newZap.action) {
      toast({
        title: "Erro",
        description: "Todos os campos são obrigatórios",
        variant: "destructive",
      });
      return;
    }

    const zap: Zap = {
      id: Date.now().toString(),
      ...newZap,
      status: 'active'
    };

    setZaps(prev => [...prev, zap]);
    setNewZap({ name: '', trigger: '', action: '' });
    setShowAddZap(false);
  };

  const handleDeleteZap = (id: string) => {
    setZaps(prev => prev.filter(zap => zap.id !== id));
    toast({
      title: "Zap removido",
      description: "A automação foi removida com sucesso",
    });
  };

  const handleToggleZap = (id: string) => {
    setZaps(prev => prev.map(zap => {
      if (zap.id === id) {
        return {
          ...zap,
          status: zap.status === 'active' ? 'inactive' : 'active'
        };
      }
      return zap;
    }));
  };

  if (!integrationService.isZapierConfigured()) {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-4rem)]">
        <Card className="p-6 bg-[#1a1a2e] border-[#2a2a4a] text-center">
          <h2 className="text-xl font-semibold mb-4">Zapier não configurado</h2>
          <p className="text-gray-400 mb-4">
            Configure sua integração com o Zapier para começar a criar automações.
          </p>
          <Button
            onClick={() => window.location.href = '/integracoes'}
            className="bg-[#FF4A00] hover:bg-[#FF4A00]/80"
          >
            Ir para Configurações
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Automações do Zapier</h2>
          <p className="text-gray-400">Gerencie suas automações e fluxos de trabalho</p>
        </div>
        <Button
          onClick={() => setShowAddZap(!showAddZap)}
          className="bg-[#FF4A00] hover:bg-[#FF4A00]/80"
        >
          <Plus className="w-4 h-4 mr-2" />
          Nova Automação
        </Button>
      </div>

      {showAddZap && (
        <Card className="p-6 bg-[#1a1a2e] border-[#2a2a4a]">
          <h3 className="text-lg font-semibold mb-4">Nova Automação</h3>
          <div className="space-y-4">
            <div>
              <Label>Nome da Automação</Label>
              <Input
                value={newZap.name}
                onChange={(e) => setNewZap({...newZap, name: e.target.value})}
                placeholder="Ex: Novo Lead para Trello"
                className="bg-[#1a1a2e] border-[#2a2a4a]"
              />
            </div>
            <div>
              <Label>Gatilho</Label>
              <Input
                value={newZap.trigger}
                onChange={(e) => setNewZap({...newZap, trigger: e.target.value})}
                placeholder="Ex: Novo Lead Criado"
                className="bg-[#1a1a2e] border-[#2a2a4a]"
              />
            </div>
            <div>
              <Label>Ação</Label>
              <Input
                value={newZap.action}
                onChange={(e) => setNewZap({...newZap, action: e.target.value})}
                placeholder="Ex: Criar Card no Trello"
                className="bg-[#1a1a2e] border-[#2a2a4a]"
              />
            </div>
            <div className="flex gap-2">
              <Button
                onClick={handleAddZap}
                className="bg-[#FF4A00] hover:bg-[#FF4A00]/80"
              >
                Criar Automação
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowAddZap(false)}
              >
                Cancelar
              </Button>
            </div>
          </div>
        </Card>
      )}

      <div className="grid gap-4">
        {zaps.map(zap => (
          <Card key={zap.id} className="p-4 bg-[#1a1a2e] border-[#2a2a4a]">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className={`w-3 h-3 rounded-full ${
                  zap.status === 'active' ? 'bg-green-500' : 'bg-gray-500'
                }`} />
                <div>
                  <h3 className="font-semibold">{zap.name}</h3>
                  <div className="flex items-center text-sm text-gray-400">
                    <span>{zap.trigger}</span>
                    <ArrowRight className="w-4 h-4 mx-2" />
                    <span>{zap.action}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleToggleZap(zap.id)}
                >
                  {zap.status === 'active' ? 'Desativar' : 'Ativar'}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDeleteZap(zap.id)}
                  className="text-red-500 hover:text-red-600"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
            {zap.lastRun && (
              <p className="text-xs text-gray-400 mt-2">
                Última execução: {new Date(zap.lastRun).toLocaleString()}
              </p>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
}
