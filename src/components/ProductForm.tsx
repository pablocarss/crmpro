import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { useToast } from './ui/use-toast';
import { productService } from '@/services/productService';

interface ProductFormData {
  name: string;
  price: number;
  description: string;
  features: string[];
}

export function ProductForm() {
  const { toast } = useToast();
  const [formData, setFormData] = useState<ProductFormData>({
    name: '',
    price: 0,
    description: '',
    features: [''],
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      productService.save({
        name: formData.name,
        price: formData.price,
        description: formData.description,
        features: formData.features.filter(Boolean),
      });
      
      toast({
        title: "Produto cadastrado",
        description: "O produto foi cadastrado com sucesso!",
      });
      
      // Limpar formulário
      setFormData({
        name: '',
        price: 0,
        description: '',
        features: [''],
      });
    } catch (error) {
      toast({
        title: "Erro ao cadastrar",
        description: "Ocorreu um erro ao cadastrar o produto.",
        variant: "destructive",
      });
    }
  };

  const addFeature = () => {
    setFormData(prev => ({
      ...prev,
      features: [...prev.features, ''],
    }));
  };

  const updateFeature = (index: number, value: string) => {
    const newFeatures = [...formData.features];
    newFeatures[index] = value;
    setFormData(prev => ({
      ...prev,
      features: newFeatures,
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl mx-auto p-6">
      <div>
        <label className="block text-sm font-medium mb-2">Nome do Produto</label>
        <Input
          type="text"
          value={formData.name}
          onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
          required
          className="w-full"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Preço</label>
        <Input
          type="number"
          value={formData.price}
          onChange={e => setFormData(prev => ({ ...prev, price: Number(e.target.value) }))}
          required
          min="0"
          step="0.01"
          className="w-full"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Descrição</label>
        <Textarea
          value={formData.description}
          onChange={e => setFormData(prev => ({ ...prev, description: e.target.value }))}
          rows={4}
          className="w-full"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Características</label>
        {formData.features.map((feature, index) => (
          <div key={index} className="mb-2">
            <Input
              value={feature}
              onChange={e => updateFeature(index, e.target.value)}
              placeholder={`Característica ${index + 1}`}
              className="w-full"
            />
          </div>
        ))}
        <Button
          type="button"
          variant="outline"
          onClick={addFeature}
          className="mt-2"
        >
          Adicionar Característica
        </Button>
      </div>

      <Button type="submit" className="w-full">
        Cadastrar Produto
      </Button>
    </form>
  );
}
