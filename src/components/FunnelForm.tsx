import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Plus, Trash2 } from 'lucide-react';
import { Card } from './ui/card';
import { useToast } from './ui/use-toast';
import { funnelService } from '@/services/funnelService';

interface Stage {
  id: string;
  name: string;
  order: number;
}

export function FunnelForm() {
  const { toast } = useToast();
  const [funnelName, setFunnelName] = useState('');
  const [stages, setStages] = useState<Stage[]>([
    { id: crypto.randomUUID(), name: '', order: 0 }
  ]);

  const handleAddStage = () => {
    setStages(prev => [
      ...prev,
      {
        id: crypto.randomUUID(),
        name: '',
        order: prev.length
      }
    ]);
  };

  const handleRemoveStage = (id: string) => {
    if (stages.length > 1) {
      setStages(prev => {
        const filtered = prev.filter(stage => stage.id !== id);
        return filtered.map((stage, index) => ({
          ...stage,
          order: index
        }));
      });
    }
  };

  const handleStageNameChange = (id: string, value: string) => {
    setStages(prev => prev.map(stage => 
      stage.id === id ? { ...stage, name: value } : stage
    ));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!funnelName.trim()) {
      toast({
        title: "Erro",
        description: "O nome do funil é obrigatório",
        variant: "destructive",
      });
      return;
    }

    if (stages.some(stage => !stage.name.trim())) {
      toast({
        title: "Erro",
        description: "Todos os estágios precisam ter um nome",
        variant: "destructive",
      });
      return;
    }

    const newFunnel = {
      id: crypto.randomUUID(),
      name: funnelName,
      stages: stages
    };

    try {
      funnelService.create(newFunnel);
      toast({
        title: "Sucesso",
        description: "Funil criado com sucesso",
      });

      // Reset form
      setFunnelName('');
      setStages([{ id: crypto.randomUUID(), name: '', order: 0 }]);
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao criar o funil",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div>
        <h2 className="text-2xl font-bold mb-6">Cadastro de Funil</h2>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <Card className="p-6 bg-[#1a1a2e] border-[#2a2a4a]">
            <div className="space-y-4">
              <div>
                <Label htmlFor="funnelName">Nome do Funil</Label>
                <Input
                  id="funnelName"
                  value={funnelName}
                  onChange={(e) => setFunnelName(e.target.value)}
                  placeholder="Ex: Funil de Vendas"
                  className="bg-[#1a1a2e] border-[#2a2a4a]"
                />
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label>Estágios do Funil</Label>
                  <Button
                    type="button"
                    onClick={handleAddStage}
                    variant="outline"
                    size="sm"
                    className="bg-purple-600 hover:bg-purple-700"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Adicionar Estágio
                  </Button>
                </div>

                <div className="space-y-3">
                  {stages.map((stage, index) => (
                    <div key={stage.id} className="flex items-center gap-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-sm font-medium text-purple-400">
                            {index + 1}.
                          </span>
                          <Label htmlFor={`stage-${stage.id}`}>
                            Nome do Estágio
                          </Label>
                        </div>
                        <Input
                          id={`stage-${stage.id}`}
                          value={stage.name}
                          onChange={(e) => handleStageNameChange(stage.id, e.target.value)}
                          placeholder="Ex: Primeiro Contato"
                          className="bg-[#1a1a2e] border-[#2a2a4a]"
                        />
                      </div>
                      {stages.length > 1 && (
                        <Button
                          type="button"
                          onClick={() => handleRemoveStage(stage.id)}
                          variant="ghost"
                          size="icon"
                          className="mt-6 text-red-500 hover:text-red-600"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full mt-6 bg-purple-600 hover:bg-purple-700"
            >
              Criar Funil
            </Button>
          </Card>
        </form>
      </div>

      <div className="mt-8">
        <h3 className="text-xl font-semibold mb-4">Funis Cadastrados</h3>
        <div className="space-y-4">
          {funnelService.getAll().map((funnel) => (
            <Card key={funnel.id} className="p-4 bg-[#1a1a2e] border-[#2a2a4a]">
              <h4 className="text-lg font-medium mb-2">{funnel.name}</h4>
              <div className="space-y-1">
                {funnel.stages.map((stage, index) => (
                  <div
                    key={stage.id}
                    className="flex items-center gap-2 text-sm text-gray-400"
                  >
                    <span className="text-purple-400">{index + 1}.</span>
                    {stage.name}
                  </div>
                ))}
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
