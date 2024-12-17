import { Droppable, Draggable } from "@hello-pangea/dnd";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { GripVertical } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { StageUpdateForm } from "./StageUpdateForm";

interface Client {
  id: string;
  name: string;
  email: string;
  value: number;
  product: string;
}

interface StageProps {
  id: string;
  index: number;
  name: string;
  clients: Client[];
  onClientUpdate: (clientId: string, updatedData: Partial<Client>) => void;
}

export function FunnelStage({ id, index, name, clients, onClientUpdate }: StageProps) {
  const calculateStageTotal = (clients: Client[]) => {
    return clients.reduce((sum, client) => sum + client.value, 0);
  };

  return (
    <Droppable droppableId={index.toString()}>
      {(provided) => (
        <div
          ref={provided.innerRef}
          {...provided.droppableProps}
          className="bg-muted rounded-lg p-4 min-h-[500px]"
        >
          <div className="mb-4">
            <h3 className="font-semibold text-lg">{name}</h3>
            <div className="text-sm text-muted-foreground">
              Total: R$ {calculateStageTotal(clients).toLocaleString()}
            </div>
          </div>
          {clients.map((client, clientIndex) => (
            <Draggable key={client.id} draggableId={client.id} index={clientIndex}>
              {(provided) => (
                <Dialog>
                  <DialogTrigger asChild>
                    <Card
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      className="mb-2 cursor-pointer hover:bg-accent/50 transition-colors"
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
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Atualizar Cliente</DialogTitle>
                    </DialogHeader>
                    <StageUpdateForm
                      client={client}
                      onSubmit={(data) => onClientUpdate(client.id, data)}
                    />
                  </DialogContent>
                </Dialog>
              )}
            </Draggable>
          ))}
          {provided.placeholder}
        </div>
      )}
    </Droppable>
  );
}