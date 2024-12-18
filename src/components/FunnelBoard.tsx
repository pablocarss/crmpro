import { useState } from "react";
import { DragDropContext, DropResult } from "react-beautiful-dnd";
import { useToast } from "./ui/use-toast";
import { FunnelStage } from "./FunnelStage";
import { FunnelControls } from "./FunnelControls";
import { StageChangeReasonModal } from "./StageChangeReasonModal";

interface Client {
  id: string;
  name: string;
  email: string;
  value: number;
  product: string;
  observation?: string;
  stageHistory?: Array<{
    fromStage: string;
    toStage: string;
    reason: string;
    date: string;
  }>;
}

interface Stage {
  id: string;
  name: string;
  clients: Client[];
}

interface Funnel {
  id: string;
  name: string;
  stages: Stage[];
}

interface Product {
  id: string;
  name: string;
  value: number;
}

export function FunnelBoard() {
  const { toast } = useToast();
  const [funnels, setFunnels] = useState<Funnel[]>([
    {
      id: "1",
      name: "Vendas Principal",
      stages: [
        { id: "s1", name: "Prospecção", clients: [] },
        { id: "s2", name: "Qualificação", clients: [] },
        { id: "s3", name: "Proposta", clients: [] },
        { id: "s4", name: "Fechamento", clients: [] },
      ],
    },
  ]);
  const [activeFunnel, setActiveFunnel] = useState<string>("1");
  const [products, setProducts] = useState<Product[]>([]);
  const [pendingMove, setPendingMove] = useState<{
    sourceStage: Stage;
    destStage: Stage;
    client: Client;
    sourceIndex: number;
    destIndex: number;
  } | null>(null);
  const [showReasonModal, setShowReasonModal] = useState(false);

  const onDragEnd = (result: DropResult) => {
    const { source, destination } = result;

    // Se não houver destino válido, não fazer nada
    if (!destination) return;

    const currentFunnel = funnels.find(f => f.id === activeFunnel);
    if (!currentFunnel) return;

    const sourceStage = currentFunnel.stages.find(s => s.id === source.droppableId);
    const destStage = currentFunnel.stages.find(s => s.id === destination.droppableId);

    if (!sourceStage || !destStage) return;

    if (source.droppableId === destination.droppableId) {
      // Movimento dentro do mesmo estágio
      const newClients = Array.from(sourceStage.clients);
      const [movedClient] = newClients.splice(source.index, 1);
      newClients.splice(destination.index, 0, movedClient);

      const newFunnels = funnels.map(funnel => {
        if (funnel.id === activeFunnel) {
          return {
            ...funnel,
            stages: funnel.stages.map(stage => {
              if (stage.id === sourceStage.id) {
                return { ...stage, clients: newClients };
              }
              return stage;
            }),
          };
        }
        return funnel;
      });

      setFunnels(newFunnels);
    } else {
      // Movimento entre estágios diferentes
      const client = sourceStage.clients[source.index];
      setPendingMove({
        sourceStage,
        destStage,
        client,
        sourceIndex: source.index,
        destIndex: destination.index,
      });
      setShowReasonModal(true);
    }
  };

  const handleStageChangeConfirm = (reason: string) => {
    if (!pendingMove) return;

    const { sourceStage, destStage, client, sourceIndex, destIndex } = pendingMove;
    const newFunnels = funnels.map(funnel => {
      if (funnel.id === activeFunnel) {
        return {
          ...funnel,
          stages: funnel.stages.map(stage => {
            if (stage.id === sourceStage.id) {
              // Remover do estágio de origem
              const newClients = [...stage.clients];
              newClients.splice(sourceIndex, 1);
              return { ...stage, clients: newClients };
            }
            if (stage.id === destStage.id) {
              // Adicionar ao estágio de destino
              const newClients = [...stage.clients];
              const movedClient = {
                ...client,
                stageHistory: [
                  ...(client.stageHistory || []),
                  {
                    fromStage: sourceStage.name,
                    toStage: destStage.name,
                    reason,
                    date: new Date().toISOString(),
                  },
                ],
              };
              newClients.splice(destIndex, 0, movedClient);
              return { ...stage, clients: newClients };
            }
            return stage;
          }),
        };
      }
      return funnel;
    });

    setFunnels(newFunnels);
    setShowReasonModal(false);
    setPendingMove(null);

    toast({
      title: "Cliente movido",
      description: `${client.name} foi movido para ${destStage.name}`,
    });
  };

  const handleClientUpdate = (clientId: string, updatedData: Partial<Client>, newStageId?: string) => {
    const newFunnels = funnels.map(funnel => {
      if (funnel.id === activeFunnel) {
        return {
          ...funnel,
          stages: funnel.stages.map(stage => {
            const clientIndex = stage.clients.findIndex(c => c.id === clientId);
            if (clientIndex === -1) return stage;

            if (newStageId && newStageId !== stage.id) {
              // Se houver mudança de estágio
              const newClients = [...stage.clients];
              newClients.splice(clientIndex, 1);
              return { ...stage, clients: newClients };
            }

            // Atualizar o cliente no estágio atual
            const newClients = [...stage.clients];
            newClients[clientIndex] = { ...newClients[clientIndex], ...updatedData };
            return { ...stage, clients: newClients };
          }),
        };
      }
      return funnel;
    });

    // Se houver mudança de estágio, adicionar o cliente ao novo estágio
    if (newStageId) {
      const currentFunnel = newFunnels.find(f => f.id === activeFunnel);
      if (currentFunnel) {
        const targetStage = currentFunnel.stages.find(s => s.id === newStageId);
        const sourceStage = currentFunnel.stages.find(s => 
          s.clients.some(c => c.id === clientId)
        );
        
        if (targetStage && sourceStage) {
          const client = sourceStage.clients.find(c => c.id === clientId);
          if (client) {
            const updatedClient = {
              ...client,
              ...updatedData,
              stageHistory: [
                ...(client.stageHistory || []),
                {
                  fromStage: sourceStage.name,
                  toStage: targetStage.name,
                  reason: "Movido através do modal de edição",
                  date: new Date().toISOString(),
                },
              ],
            };
            targetStage.clients.push(updatedClient);
          }
        }
      }
    }

    setFunnels(newFunnels);
    toast({
      title: "Cliente atualizado",
      description: "As informações do cliente foram atualizadas com sucesso!",
    });
  };

  const handleCreateClient = (newClient: Client) => {
    const newFunnels = funnels.map(funnel => {
      if (funnel.id === activeFunnel) {
        return {
          ...funnel,
          stages: funnel.stages.map((stage, index) => {
            if (index === 0) {
              return {
                ...stage,
                clients: [...stage.clients, newClient],
              };
            }
            return stage;
          }),
        };
      }
      return funnel;
    });

    setFunnels(newFunnels);
    toast({
      title: "Cliente criado",
      description: "O novo cliente foi adicionado com sucesso!",
    });
  };

  const handleCreateProduct = (product: Product) => {
    setProducts([...products, { ...product, id: crypto.randomUUID() }]);
    toast({
      title: "Produto criado",
      description: "O produto foi criado com sucesso!",
    });
  };

  const currentFunnel = funnels.find((f) => f.id === activeFunnel);

  return (
    <div className="space-y-6">
      <FunnelControls
        funnels={funnels}
        activeFunnel={activeFunnel}
        setActiveFunnel={setActiveFunnel}
        onCreateFunnel={(newFunnel) => setFunnels([...funnels, newFunnel])}
        onCreateClient={handleCreateClient}
        onCreateProduct={handleCreateProduct}
        products={products}
        stages={currentFunnel?.stages || []}
      />

      {pendingMove && (
        <StageChangeReasonModal
          isOpen={showReasonModal}
          onClose={() => {
            setShowReasonModal(false);
            setPendingMove(null);
          }}
          onConfirm={handleStageChangeConfirm}
          fromStage={pendingMove.sourceStage.name}
          toStage={pendingMove.destStage.name}
        />
      )}

      <DragDropContext onDragEnd={onDragEnd}>
        <div className="grid grid-cols-4 gap-4">
          {currentFunnel?.stages.map((stage) => (
            <FunnelStage
              key={stage.id}
              stage={stage}
              stages={currentFunnel.stages}
              products={products}
              onClientUpdate={handleClientUpdate}
            />
          ))}
        </div>
      </DragDropContext>
    </div>
  );
}