import { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { leadService, type Lead } from '@/services/leadService';
import { funnelService, type Funnel, type Stage } from '@/services/funnelService';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { History, Trash2 } from 'lucide-react';
import { useToast } from './ui/use-toast';
import { StageChangeModal } from './StageChangeModal';
import { LeadHistory } from './LeadHistory';
import { LeadDetails } from './LeadDetails';
import { formatCurrency } from '@/utils/formatters';

interface StageLeads {
  [key: string]: Lead[];
}

interface DragState {
  leadId: string;
  fromStage: Stage;
  toStage: Stage;
}

export function FunnelBoard() {
  const { toast } = useToast();
  const [funnel, setFunnel] = useState<Funnel | null>(null);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [stageLeads, setStageLeads] = useState<StageLeads>({});
  const [dragState, setDragState] = useState<DragState | null>(null);
  const [showStageChangeModal, setShowStageChangeModal] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [showLeadDetails, setShowLeadDetails] = useState(false);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);

  useEffect(() => {
    const funnels = funnelService.getAll();
    if (funnels.length > 0) {
      setFunnel(funnels[0]);
    }
  }, []);

  useEffect(() => {
    if (funnel) {
      const funnelLeads = leadService.getByFunnelId(funnel.id);
      setLeads(funnelLeads);

      // Organiza os leads por estágio
      const newStageLeads: StageLeads = {};
      funnel.stages.forEach(stage => {
        newStageLeads[stage.id] = funnelLeads.filter(lead => lead.stageId === stage.id);
      });
      setStageLeads(newStageLeads);
    }
  }, [funnel]);

  const handleDragEnd = (result: any) => {
    if (!result.destination || !funnel) return;

    const fromStage = funnel.stages.find(s => s.id === result.source.droppableId);
    const toStage = funnel.stages.find(s => s.id === result.destination.droppableId);
    const leadId = result.draggableId;

    if (!fromStage || !toStage || fromStage.id === toStage.id) return;

    setDragState({ leadId, fromStage, toStage });
    setShowStageChangeModal(true);
  };

  const handleStageChange = (reason: string) => {
    if (!dragState) return;

    const { leadId, fromStage, toStage } = dragState;
    
    // Atualiza o lead com o novo estágio e razão
    leadService.updateStage(leadId, toStage.id, fromStage.name, toStage.name, reason);
    
    // Atualiza o estado local
    const updatedLeads = leads.map(lead => {
      if (lead.id === leadId) {
        return { 
          ...lead, 
          stageId: toStage.id,
          stageHistory: [
            ...(lead.stageHistory || []),
            {
              fromStage: fromStage.name,
              toStage: toStage.name,
              reason,
              date: new Date().toISOString(),
            }
          ]
        };
      }
      return lead;
    });
    
    setLeads(updatedLeads);
    
    // Atualiza os leads por estágio
    const newStageLeads = { ...stageLeads };
    newStageLeads[fromStage.id] = newStageLeads[fromStage.id].filter(l => l.id !== leadId);
    const movedLead = updatedLeads.find(l => l.id === leadId);
    if (movedLead) {
      newStageLeads[toStage.id] = [...(newStageLeads[toStage.id] || []), movedLead];
    }
    setStageLeads(newStageLeads);
    
    setShowStageChangeModal(false);
    setDragState(null);

    toast({
      title: "Lead movido",
      description: `Lead movido para ${toStage.name} com sucesso!`,
    });
  };

  const handleDeleteLead = (leadId: string) => {
    leadService.delete(leadId);
    
    const updatedLeads = leads.filter(lead => lead.id !== leadId);
    setLeads(updatedLeads);
    
    // Atualiza os leads por estágio
    const newStageLeads = { ...stageLeads };
    Object.keys(newStageLeads).forEach(stageId => {
      newStageLeads[stageId] = newStageLeads[stageId].filter(l => l.id !== leadId);
    });
    setStageLeads(newStageLeads);

    toast({
      title: "Lead removido",
      description: "Lead removido com sucesso!",
    });
  };

  const handleLeadClick = (lead: Lead) => {
    setSelectedLead(lead);
    setShowLeadDetails(true);
  };

  const handleLeadUpdate = () => {
    if (funnel) {
      const updatedLeads = leadService.getByFunnelId(funnel.id);
      setLeads(updatedLeads);

      // Atualiza os leads por estágio
      const newStageLeads: StageLeads = {};
      funnel.stages.forEach(stage => {
        newStageLeads[stage.id] = updatedLeads.filter(lead => lead.stageId === stage.id);
      });
      setStageLeads(newStageLeads);
    }
  };

  const calculateStageTotal = (stageId: string): number => {
    return stageLeads[stageId]?.reduce((total, lead) => total + lead.productPrice, 0) || 0;
  };

  if (!funnel) {
    return (
      <div className="text-center py-8 text-gray-400">
        <p>Nenhum funil cadastrado. Cadastre um funil para começar.</p>
      </div>
    );
  }

  return (
    <>
      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-4">
          {funnel.stages.map((stage) => (
            <Droppable key={stage.id} droppableId={stage.id}>
              {(provided) => (
                <Card className="bg-[#1a1a2e] border-[#2a2a4a] text-white">
                  <CardHeader>
                    <CardTitle className="flex justify-between items-center">
                      <span>{stage.name}</span>
                      <span className="text-sm font-normal">
                        {stageLeads[stage.id]?.length || 0} leads
                      </span>
                    </CardTitle>
                    <div className="text-sm text-gray-400">
                      Total: {formatCurrency(calculateStageTotal(stage.id))}
                    </div>
                  </CardHeader>
                  <CardContent
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className="space-y-2 min-h-[200px]"
                  >
                    {stageLeads[stage.id]?.map((lead, index) => (
                      <Draggable
                        key={lead.id}
                        draggableId={lead.id}
                        index={index}
                      >
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className="bg-[#2a2a4a] p-3 rounded-lg space-y-2 cursor-pointer"
                            onClick={() => handleLeadClick(lead)}
                          >
                            <div className="flex justify-between items-start">
                              <div>
                                <h4 className="font-medium">{lead.name}</h4>
                                {lead.phone && (
                                  <p className="text-sm text-gray-400">{lead.phone}</p>
                                )}
                                <p className="text-sm text-purple-400">{lead.productName}</p>
                                <p className="text-sm text-green-400">
                                  {formatCurrency(lead.productPrice)}
                                </p>
                              </div>
                              <div className="flex gap-2">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setSelectedLead(lead);
                                    setShowHistoryModal(true);
                                  }}
                                >
                                  <History className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8 text-red-400 hover:text-red-600"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleDeleteLead(lead.id);
                                  }}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </CardContent>
                </Card>
              )}
            </Droppable>
          ))}
        </div>
      </DragDropContext>

      {dragState && (
        <StageChangeModal
          isOpen={showStageChangeModal}
          onClose={() => {
            setShowStageChangeModal(false);
            setDragState(null);
          }}
          onConfirm={handleStageChange}
          fromStage={dragState.fromStage.name}
          toStage={dragState.toStage.name}
        />
      )}

      {selectedLead && showLeadDetails && (
        <LeadDetails
          isOpen={showLeadDetails}
          onClose={() => {
            setShowLeadDetails(false);
            setSelectedLead(null);
          }}
          lead={selectedLead}
          onLeadUpdate={handleLeadUpdate}
        />
      )}

      {selectedLead && showHistoryModal && (
        <LeadHistory
          isOpen={showHistoryModal}
          onClose={() => {
            setShowHistoryModal(false);
            setSelectedLead(null);
          }}
          history={selectedLead.stageHistory}
          leadName={selectedLead.name}
        />
      )}
    </>
  );
}