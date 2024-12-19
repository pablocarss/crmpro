import { useEffect, useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { useToast } from './ui/use-toast';
import { productService } from '@/services/productService';
import { funnelService, type Funnel } from '@/services/funnelService';
import { leadService } from '@/services/leadService';
import { formatPhone } from '@/utils/formatters';

interface QuickClientFormData {
  name: string;
  phone?: string;
  productId: string;
  funnelId: string;
  stageId: string;
}

interface Product {
  id: string;
  name: string;
  price: number;
}

export function QuickClientForm({ onSuccess }: { onSuccess?: () => void }) {
  const { toast } = useToast();
  const [products, setProducts] = useState<Product[]>([]);
  const [funnels, setFunnels] = useState<Funnel[]>([]);
  const [selectedFunnel, setSelectedFunnel] = useState<Funnel | null>(null);
  
  const [formData, setFormData] = useState<QuickClientFormData>({
    name: '',
    phone: '',
    productId: '',
    funnelId: '',
    stageId: '',
  });

  useEffect(() => {
    const loadedProducts = productService.getAll();
    const loadedFunnels = funnelService.getAll();
    setProducts(loadedProducts);
    setFunnels(loadedFunnels);

    // Se só tiver um funil, seleciona ele automaticamente
    if (loadedFunnels.length === 1) {
      setSelectedFunnel(loadedFunnels[0]);
      setFormData(prev => ({
        ...prev,
        funnelId: loadedFunnels[0].id,
        stageId: loadedFunnels[0].stages[0].id,
      }));
    }
  }, []);

  const handleFunnelChange = (funnelId: string) => {
    const funnel = funnels.find(f => f.id === funnelId);
    setSelectedFunnel(funnel || null);
    setFormData(prev => ({
      ...prev,
      funnelId,
      stageId: funnel?.stages[0].id || '',
    }));
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedPhone = formatPhone(e.target.value);
    setFormData(prev => ({ ...prev, phone: formattedPhone }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.productId || !formData.funnelId || !formData.stageId) {
      toast({
        title: "Campos obrigatórios",
        description: "Por favor, preencha todos os campos obrigatórios.",
        variant: "destructive",
      });
      return;
    }

    try {
      const selectedProduct = products.find(p => p.id === formData.productId);
      if (!selectedProduct) {
        throw new Error('Produto não encontrado');
      }

      // Criar o lead usando o serviço
      leadService.create({
        name: formData.name,
        phone: formData.phone,
        productId: formData.productId,
        productName: selectedProduct.name,
        productPrice: selectedProduct.price,
        funnelId: formData.funnelId,
        stageId: formData.stageId,
      });
      
      toast({
        title: "Lead adicionado",
        description: "O lead foi adicionado ao funil com sucesso!",
      });
      
      // Limpar formulário mantendo o funil selecionado
      setFormData(prev => ({
        name: '',
        phone: '',
        productId: '',
        funnelId: prev.funnelId,
        stageId: prev.stageId,
      }));

      onSuccess?.();
    } catch (error) {
      toast({
        title: "Erro ao adicionar",
        description: "Ocorreu um erro ao adicionar o lead ao funil.",
        variant: "destructive",
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-2 text-white">Nome do Lead*</label>
        <Input
          type="text"
          value={formData.name}
          onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
          required
          className="bg-[#1a1a2e] border-[#2a2a4a] text-white"
          placeholder="Ex: João Silva"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2 text-white">Telefone/WhatsApp</label>
        <Input
          type="tel"
          value={formData.phone}
          onChange={handlePhoneChange}
          className="bg-[#1a1a2e] border-[#2a2a4a] text-white"
          placeholder="Ex: (11) 98765-4321"
          maxLength={15}
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2 text-white">Produto de Interesse*</label>
        <Select
          value={formData.productId}
          onValueChange={value => setFormData(prev => ({ ...prev, productId: value }))}
        >
          <SelectTrigger className="bg-[#1a1a2e] border-[#2a2a4a] text-white">
            <SelectValue placeholder="Selecione o produto" />
          </SelectTrigger>
          <SelectContent className="bg-[#1a1a2e] border-[#2a2a4a]">
            {products.map(product => (
              <SelectItem 
                key={product.id} 
                value={product.id}
                className="text-white hover:bg-[#2a2a4a] focus:bg-[#2a2a4a]"
              >
                {product.name} - {new Intl.NumberFormat('pt-BR', {
                  style: 'currency',
                  currency: 'BRL'
                }).format(product.price)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2 text-white">Funil de Vendas*</label>
        <Select
          value={formData.funnelId}
          onValueChange={handleFunnelChange}
        >
          <SelectTrigger className="bg-[#1a1a2e] border-[#2a2a4a] text-white">
            <SelectValue placeholder="Selecione o funil" />
          </SelectTrigger>
          <SelectContent className="bg-[#1a1a2e] border-[#2a2a4a]">
            {funnels.map(funnel => (
              <SelectItem 
                key={funnel.id} 
                value={funnel.id}
                className="text-white hover:bg-[#2a2a4a] focus:bg-[#2a2a4a]"
              >
                {funnel.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {selectedFunnel && (
        <div>
          <label className="block text-sm font-medium mb-2 text-white">Estágio Inicial*</label>
          <Select
            value={formData.stageId}
            onValueChange={value => setFormData(prev => ({ ...prev, stageId: value }))}
          >
            <SelectTrigger className="bg-[#1a1a2e] border-[#2a2a4a] text-white">
              <SelectValue placeholder="Selecione o estágio" />
            </SelectTrigger>
            <SelectContent className="bg-[#1a1a2e] border-[#2a2a4a]">
              {selectedFunnel.stages.map(stage => (
                <SelectItem 
                  key={stage.id} 
                  value={stage.id}
                  className="text-white hover:bg-[#2a2a4a] focus:bg-[#2a2a4a]"
                >
                  {stage.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      <Button type="submit" className="w-full bg-purple-600 hover:bg-purple-700">
        Adicionar Lead ao Funil
      </Button>
    </form>
  );
}
