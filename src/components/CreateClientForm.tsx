import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";

interface Client {
  id: string;
  name: string;
  email: string;
  value: number;
  product: string;
}

interface CreateClientFormProps {
  onSubmit: (client: Client) => void;
}

export function CreateClientForm({ onSubmit }: CreateClientFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    value: "",
    product: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      id: crypto.randomUUID(),
      name: formData.name,
      email: formData.email,
      value: parseFloat(formData.value),
      product: formData.product,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Nome</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="value">Valor</Label>
        <Input
          id="value"
          type="number"
          value={formData.value}
          onChange={(e) => setFormData({ ...formData, value: e.target.value })}
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="product">Produto</Label>
        <Input
          id="product"
          value={formData.product}
          onChange={(e) => setFormData({ ...formData, product: e.target.value })}
          required
        />
      </div>
      <Button type="submit" className="w-full bg-gradient-to-r from-purple-600 to-black">
        Adicionar Cliente
      </Button>
    </form>
  );
}