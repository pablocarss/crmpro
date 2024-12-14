import { useState } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { Plus, GripVertical } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { useToast } from "./ui/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { CreateFunnelForm } from "./CreateFunnelForm";
import { CreateClientForm } from "./CreateClientForm";

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

  const calculateStageTotal = (clients: Client[]) => {
    return clients.reduce((sum, client) => sum + client.value, 0);
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
            ?.stages.map((stage, stageIndex) => (
              <Droppable key={stage.id} droppableId={stageIndex.toString()}>
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className="bg-muted rounded-lg p-4 min-h-[500px]"
                  >
                    <div className="mb-4">
                      <h3 className="font-semibold text-lg">{stage.name}</h3>
                      <div className="text-sm text-muted-foreground">
                        Total: R$ {calculateStageTotal(stage.clients).toLocaleString()}
                      </div>
                    </div>
                    {stage.clients.map((client, index) => (
                      <Draggable
                        key={client.id}
                        draggableId={client.id}
                        index={index}
                      >
                        {(provided) => (
                          <Card
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            className="mb-2"
                          >
                            <CardHeader className="p-3">
                              <div
                                {...provided.dragHandleProps}
                                className="absolute right-2 top-2 text-gray-400"
                              >
                                <GripVertical className="h-4 w-4" />
                              </div>
                              <CardTitle className="text-sm font-medium">
                                {client.name}
                              </CardTitle>
                            </CardHeader>
                            <CardContent className="p-3 pt-0">
                              <div className="text-sm text-muted-foreground">
                                {client.email}
                              </div>
                              <div className="text-sm font-semibold mt-1">
                                R$ {client.value.toLocaleString()}
                              </div>
                              <div className="text-xs text-muted-foreground mt-1">
                                {client.product}
                              </div>
                            </CardContent>
                          </Card>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            ))}
        </div>
      </DragDropContext>
    </div>
  );
}