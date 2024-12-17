import { useState } from "react";
import { DragDropContext } from "@hello-pangea/dnd";
import { Plus } from "lucide-react";
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { CreateFunnelForm } from "./CreateFunnelForm";
import { CreateClientForm } from "./CreateClientForm";
import { useToast } from "./ui/use-toast";
import { FunnelStage } from "./FunnelStage";

interface Client {
  id: string;
  name: string;
  email: string;
  value: number;
  product: string;
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

  const handleDragEnd = (result: any) => {
    if (!result.destination) return;

    const { source, destination } = result;
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
    toast({
      title: "Cliente atualizado",
      description: "As informações do cliente foram atualizadas com sucesso!",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="space-x-4">
          {funnels.map((funnel) => (
            <Button
              key={funnel.id}
              variant={activeFunnel === funnel.id ? "default" : "outline"}
              onClick={() => setActiveFunnel(funnel.id)}
              className="bg-gradient-to-r from-purple-600 to-black"
            >
              {funnel.name}
            </Button>
          ))}
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Plus className="h-4 w-4 mr-2" />
                Novo Funil
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Criar Novo Funil</DialogTitle>
              </DialogHeader>
              <CreateFunnelForm onSubmit={(newFunnel) => {
                setFunnels([...funnels, newFunnel]);
                toast({
                  title: "Funil criado",
                  description: `${newFunnel.name} foi criado com sucesso!`,
                });
              }} />
            </DialogContent>
          </Dialog>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-purple-600 to-black">
              <Plus className="h-4 w-4 mr-2" />
              Novo Cliente
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Adicionar Novo Cliente</DialogTitle>
            </DialogHeader>
            <CreateClientForm onSubmit={(newClient) => {
              const newFunnels = [...funnels];
              const funnelIndex = newFunnels.findIndex((f) => f.id === activeFunnel);
              newFunnels[funnelIndex].stages[0].clients.push(newClient);
              setFunnels(newFunnels);
              toast({
                title: "Cliente adicionado",
                description: `${newClient.name} foi adicionado ao funil!`,
              });
            }} />
          </DialogContent>
        </Dialog>
      </div>

      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="grid grid-cols-4 gap-4">
          {funnels
            .find((f) => f.id === activeFunnel)
            ?.stages.map((stage, index) => (
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