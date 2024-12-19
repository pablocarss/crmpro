import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { ScrollArea } from './ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { type Lead, type StageChange, leadService } from '@/services/leadService';
import { formatCurrency } from '@/utils/formatters';

interface LeadDetailsProps {
  isOpen: boolean;
  onClose: () => void;
  lead: Lead;
  onLeadUpdate: () => void;
}

export function LeadDetails({ 
  isOpen, 
  onClose, 
  lead,
  onLeadUpdate
}: LeadDetailsProps) {
  const [observation, setObservation] = useState(lead.observation || '');
  const [activeTab, setActiveTab] = useState('details');

  const handleSaveObservation = () => {
    leadService.updateObservation(lead.id, observation);
    onLeadUpdate();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-[#1a1a2e] border-[#2a2a4a] text-white max-w-2xl">
        <DialogHeader>
          <DialogTitle>Detalhes do Lead</DialogTitle>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="details">Informações</TabsTrigger>
            <TabsTrigger value="history">Histórico</TabsTrigger>
          </TabsList>

          <TabsContent value="details" className="space-y-4 mt-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-gray-400">Nome</label>
                <p className="font-medium">{lead.name}</p>
              </div>
              {lead.phone && (
                <div>
                  <label className="text-sm text-gray-400">Telefone</label>
                  <p className="font-medium">{lead.phone}</p>
                </div>
              )}
              <div>
                <label className="text-sm text-gray-400">Produto</label>
                <p className="font-medium text-purple-400">{lead.productName}</p>
              </div>
              <div>
                <label className="text-sm text-gray-400">Valor</label>
                <p className="font-medium text-green-400">
                  {formatCurrency(lead.productPrice)}
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm text-gray-400">Observações</label>
              <Textarea
                value={observation}
                onChange={(e) => setObservation(e.target.value)}
                className="bg-[#1a1a2e] border-[#2a2a4a] text-white min-h-[100px]"
                placeholder="Adicione observações sobre este lead..."
              />
              <Button
                onClick={handleSaveObservation}
                className="w-full bg-purple-600 hover:bg-purple-700"
              >
                Salvar Observações
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="history" className="mt-4">
            <ScrollArea className="h-[300px] pr-4">
              <div className="space-y-4">
                {lead.stageHistory?.length === 0 ? (
                  <p className="text-gray-400 text-center py-4">
                    Nenhuma mudança de estágio registrada.
                  </p>
                ) : (
                  lead.stageHistory?.map((change: StageChange, index: number) => (
                    <div
                      key={index}
                      className="border-l-2 border-purple-500 pl-4 py-2"
                    >
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-400">
                          {new Date(change.date).toLocaleString('pt-BR')}
                        </span>
                      </div>
                      <div className="mt-2 space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-purple-400">{change.fromStage}</span>
                          <span className="text-gray-400">→</span>
                          <span className="text-green-400">{change.toStage}</span>
                        </div>
                        <p className="text-sm text-gray-300">{change.reason}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
