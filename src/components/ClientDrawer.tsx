import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Textarea } from "./ui/textarea";
import { ScrollArea } from "./ui/scroll-area";
import { useState } from "react";
import { X } from "lucide-react";

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

interface ClientDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  client: Client;
  currentStage: Stage;
  stages: Stage[];
  products: Product[];
  onSave: (clientId: string, updatedData: Partial<Client>, newStageId?: string) => void;
}

export function ClientDrawer({
  isOpen,
  onClose,
  client,
  currentStage,
  stages,
  products,
  onSave,
}: ClientDrawerProps) {
  const [formData, setFormData] = useState({
    name: client.name,
    email: client.email,
    value: client.value,
    product: client.product,
    stageId: currentStage.id,
    observation: client.observation || "",
  });

  const handleSave = () => {
    const updatedData = {
      name: formData.name,
      email: formData.email,
      value: formData.value,
      product: formData.product,
      observation: formData.observation,
    };
    
    onSave(
      client.id,
      updatedData,
      formData.stageId !== currentStage.id ? formData.stageId : undefined
    );
  };

  if (!isOpen) return null;

  return (
    <div 
      className={`fixed inset-y-0 left-0 z-50 w-[400px] sm:w-[480px] bg-background border-r shadow-lg transform transition-transform duration-300 ease-in-out ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      }`}
    >
      <div className="flex justify-between items-center px-6 py-4 border-b">
        <h2 className="text-lg font-semibold">Detalhes do Cliente</h2>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>
      
      <ScrollArea className="h-[calc(100vh-140px)] px-6">
        <div className="space-y-6 py-6">
          <div className="grid gap-6">
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="product">Produto</Label>
                <Select
                  value={formData.product}
                  onValueChange={(value) => setFormData({ ...formData, product: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um produto" />
                  </SelectTrigger>
                  <SelectContent>
                    {products.map((product) => (
                      <SelectItem key={product.id} value={product.name}>
                        {product.name} - R$ {product.value.toLocaleString()}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="value">Valor</Label>
                <Input
                  id="value"
                  type="number"
                  value={formData.value}
                  onChange={(e) =>
                    setFormData({ ...formData, value: parseFloat(e.target.value) || 0 })
                  }
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="stage">Estágio</Label>
              <Select
                value={formData.stageId}
                onValueChange={(value) => setFormData({ ...formData, stageId: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um estágio" />
                </SelectTrigger>
                <SelectContent>
                  {stages.map((stage) => (
                    <SelectItem key={stage.id} value={stage.id}>
                      {stage.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="observation">Observações</Label>
              <Textarea
                id="observation"
                value={formData.observation}
                onChange={(e) => setFormData({ ...formData, observation: e.target.value })}
                rows={3}
                className="resize-none"
              />
            </div>
          </div>

          {client.stageHistory && client.stageHistory.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Histórico de Mudanças</h3>
              <div className="space-y-3">
                {client.stageHistory.map((history, index) => (
                  <div
                    key={index}
                    className="rounded-lg border p-3 space-y-1.5 text-sm"
                  >
                    <div>
                      <span className="font-medium">De:</span> {history.fromStage}
                    </div>
                    <div>
                      <span className="font-medium">Para:</span> {history.toStage}
                    </div>
                    <div>
                      <span className="font-medium">Motivo:</span> {history.reason}
                    </div>
                    <div className="text-muted-foreground text-xs">
                      {new Date(history.date).toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </ScrollArea>
      
      <div className="absolute bottom-0 left-0 right-0 p-6 border-t bg-background">
        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button onClick={handleSave}>Salvar</Button>
        </div>
      </div>
    </div>
  );
}
