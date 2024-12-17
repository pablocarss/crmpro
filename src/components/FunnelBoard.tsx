import { useState } from "react";
import { DragDropContext } from "@hello-pangea/dnd";
import { useToast } from "./ui/use-toast";
import { FunnelStage } from "./FunnelStage";
import { StageUpdateForm } from "./StageUpdateForm";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { FunnelControls } from "./FunnelControls";

interface Client {
  id: string;
  name: string;
  email: string;
  value: number;
  product: string;
  stageId?: string;
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
  const [showUpdateForm, setShowUpdateForm] = useState(false);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [pendingMove, setPendingMove] = useState<any>(null);

  const [products] = useState<Product[]>([
    { id: "p1", name: "Produto Basic", value: 99.90 },
    { id: "p2", name: "Produto Pro", value: 199.90 },
    { id: "p3", name: "Produto Enterprise", value: 299.90 },
  ]);

  const handleDragEnd = (result: any) => {
    if (!result.destination) return;

    const { source, destination } = result;
    
    if (source.droppableId !== destination.droppableId) {
      const currentFunnel = funnels.find((f) => f.id === activeFunnel);
      if (!currentFunnel) return;
      
      const sourceStage = currentFunnel.stages[parseInt(source.droppableId)];
      const client = sourceStage.clients[source.index];
      
      setSelectedClient(client);
      setShowUpdateForm(true);
      setPendingMove(result);
      return;
    }

    moveClient(result);
  };

  const moveClient = (moveDetails: any) => {
    const { source, destination } = moveDetails;
    const currentFunnel = funnels.find((f) => f.id === activeFunnel);
    if (!currentFunnel) return;

    const newFunnels = [...funnels];
    const funnelIndex = newFunnels.findIndex((f) => f.id === activeFunnel);
    const sourceStage = currentFunnel.stages[parseInt(source.droppableId)];
    const destStage = currentFunnel.stages[parseInt(destination.droppableId)];

    const [movedClient] = sourceStage.clients.splice(source.index, 1);
    destStage.clients.splice(destination.index, 0, movedClient);

    newFunnels[funnelIndex] = currentFunnel;
    setFunnels(newFunnels);
    
    toast({
      title: "Cliente movido",
      description: `${movedClient.name} movido para ${destStage.name}`,
    });
  };

  const handleClientUpdate = (clientId: string, updatedData: Partial<Client>) => {
    if (pendingMove) {
      moveClient(pendingMove);
      setPendingMove(null);
    }

    const newFunnels = [...funnels];
    const currentFunnel = newFunnels.find((f) => f.id === activeFunnel);
    if (!currentFunnel) return;

    currentFunnel.stages.forEach((stage) => {
      const clientIndex = stage.clients.findIndex((c) => c.id === clientId);
      if (clientIndex !== -1) {
        stage.clients[clientIndex] = { ...stage.clients[clientIndex], ...updatedData };
      }
    });

    setFunnels(newFunnels);
    setShowUpdateForm(false);
    setSelectedClient(null);
    
    toast({
      title: "Cliente atualizado",
      description: "As informações do cliente foram atualizadas com sucesso!",
    });
  };

  const handleCreateClient = (newClient: Client) => {
    const newFunnels = [...funnels];
    const funnelIndex = newFunnels.findIndex((f) => f.id === activeFunnel);
    const stageIndex = newClient.stageId 
      ? newFunnels[funnelIndex].stages.findIndex(s => s.id === newClient.stageId)
      : 0;
    
    newFunnels[funnelIndex].stages[stageIndex].clients.push(newClient);
    setFunnels(newFunnels);
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
        products={products}
        stages={currentFunnel?.stages || []}
      />

      <Dialog open={showUpdateForm} onOpenChange={setShowUpdateForm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Atualizar Cliente</DialogTitle>
          </DialogHeader>
          {selectedClient && (
            <StageUpdateForm
              client={selectedClient}
              onSubmit={(data) => handleClientUpdate(selectedClient.id, data)}
            />
          )}
        </DialogContent>
      </Dialog>

      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="grid grid-cols-4 gap-4">
          {currentFunnel?.stages.map((stage, index) => (
            <FunnelStage
              key={stage.id}
              id={stage.id}
              index={index}
              name={stage.name}
              clients={stage.clients}
              onClientUpdate={handleClientUpdate}
            />
          ))}
        </div>
      </DragDropContext>
    </div>
  );
}