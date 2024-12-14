import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

interface Stage {
  id: string;
  name: string;
  clients: any[];
}

interface Funnel {
  id: string;
  name: string;
  stages: Stage[];
}

interface CreateFunnelFormProps {
  onSubmit: (funnel: Funnel) => void;
}

export function CreateFunnelForm({ onSubmit }: CreateFunnelFormProps) {
  const [name, setName] = useState("");
  const [stages, setStages] = useState<string[]>([""]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newFunnel: Funnel = {
      id: crypto.randomUUID(),
      name,
      stages: stages.map((stageName) => ({
        id: crypto.randomUUID(),
        name: stageName,
        clients: [],
      })),
    };
    onSubmit(newFunnel);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Nome do Funil</Label>
        <Input
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>
      <div className="space-y-2">
        <Label>Estágios</Label>
        {stages.map((stage, index) => (
          <div key={index} className="flex gap-2">
            <Input
              value={stage}
              onChange={(e) => {
                const newStages = [...stages];
                newStages[index] = e.target.value;
                setStages(newStages);
              }}
              placeholder={`Estágio ${index + 1}`}
              required
            />
            {stages.length > 1 && (
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  const newStages = stages.filter((_, i) => i !== index);
                  setStages(newStages);
                }}
              >
                Remover
              </Button>
            )}
          </div>
        ))}
        <Button
          type="button"
          variant="outline"
          onClick={() => setStages([...stages, ""])}
        >
          Adicionar Estágio
        </Button>
      </div>
      <Button type="submit" className="w-full bg-gradient-to-r from-purple-600 to-black">
        Criar Funil
      </Button>
    </form>
  );
}