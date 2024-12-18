import { Droppable, Draggable } from "react-beautiful-dnd";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { useState } from "react";
import { ClientDrawer } from "./ClientDrawer";

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

interface Product {
  id: string;
  name: string;
  value: number;
}

interface StageProps {
  stage: Stage;
  stages: Stage[];
  products: Product[];
  onClientUpdate: (clientId: string, updatedData: Partial<Client>, newStageId?: string) => void;
}

export function FunnelStage({ stage, stages, products, onClientUpdate }: StageProps) {
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  
  const calculateStageTotal = (clients: Client[]) => {
    return clients.reduce((sum, client) => sum + client.value, 0);
  };

  const handleClientClick = (client: Client) => {
    console.log('Card clicado:', client);
    setSelectedClient(client);
  };

  const handleCloseDrawer = () => {
    console.log('Fechando drawer');
    setSelectedClient(null);
  };

  const handleSaveClient = (clientId: string, updatedData: Partial<Client>, newStageId?: string) => {
    console.log('Salvando cliente:', clientId, updatedData, newStageId);
    onClientUpdate(clientId, updatedData, newStageId);
    setSelectedClient(null);
  };

  return (
    <>
      <Droppable droppableId={stage.id}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={`bg-muted rounded-lg p-4 min-h-[500px] ${
              snapshot.isDraggingOver ? 'bg-accent/20' : ''
            }`}
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
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    className={`mb-2 ${snapshot.isDragging ? 'opacity-50' : ''}`}
                  >
                    <Card 
                      className="cursor-pointer hover:bg-accent/50 transition-colors"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleClientClick(client);
                      }}
                    >
                      <CardHeader className="p-3">
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
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>

      {selectedClient && (
        <ClientDrawer
          isOpen={!!selectedClient}
          onClose={handleCloseDrawer}
          client={selectedClient}
          currentStage={stage}
          stages={stages}
          products={products}
          onSave={handleSaveClient}
        />
      )}
    </>
  );
}