import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

interface Product {
  name: string;
  value: number;
}

interface CreateProductFormProps {
  onSubmit: (product: Product) => void;
}

export function CreateProductForm({ onSubmit }: CreateProductFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    value: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      name: formData.name,
      value: parseFloat(formData.value),
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Nome do Produto</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
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
      <Button type="submit" className="w-full bg-gradient-to-r from-purple-600 to-black">
        Criar Produto
      </Button>
    </form>
  );
}