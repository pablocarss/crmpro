import { useState } from 'react';
import { Card } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { ProductForm } from './ProductForm';
import { ProductList } from './ProductList';
import { FunnelForm } from './FunnelForm';
import { funnelService, type Funnel } from '@/services/funnelService';
import { Button } from './ui/button';
import { Pencil, Trash2 } from 'lucide-react';
import { useToast } from './ui/use-toast';

export function CadastrosMenu() {
  const [showProductForm, setShowProductForm] = useState(false);
  const [showFunnelForm, setShowFunnelForm] = useState(false);
  const [funnels, setFunnels] = useState<Funnel[]>(funnelService.getAll());
  const { toast } = useToast();

  const handleDeleteFunnel = (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir este funil?')) {
      funnelService.delete(id);
      setFunnels(funnelService.getAll());
      toast({
        title: "Sucesso",
        description: "Funil excluído com sucesso!",
      });
    }
  };

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-3xl font-bold text-white mb-8">Cadastros</h1>

      <Tabs defaultValue="products" className="w-full">
        <TabsList className="grid w-[400px] grid-cols-2 mb-8">
          <TabsTrigger value="products">Produtos</TabsTrigger>
          <TabsTrigger value="funnels">Funis</TabsTrigger>
        </TabsList>

        <TabsContent value="products">
          <Card className="p-6 bg-[#1a1a2e] border-[#2a2a4a]">
            <div className="flex justify-end mb-6">
              <Button
                onClick={() => setShowProductForm(!showProductForm)}
                className="bg-purple-600 hover:bg-purple-700"
              >
                {showProductForm ? 'Ver Lista' : 'Novo Produto'}
              </Button>
            </div>

            {showProductForm ? <ProductForm /> : <ProductList />}
          </Card>
        </TabsContent>

        <TabsContent value="funnels">
          <Card className="p-6 bg-[#1a1a2e] border-[#2a2a4a]">
            <div className="flex justify-end mb-6">
              <Button
                onClick={() => setShowFunnelForm(!showFunnelForm)}
                className="bg-purple-600 hover:bg-purple-700"
              >
                {showFunnelForm ? 'Ver Lista' : 'Novo Funil'}
              </Button>
            </div>

            {showFunnelForm ? (
              <FunnelForm 
                onSuccess={() => {
                  setShowFunnelForm(false);
                  setFunnels(funnelService.getAll());
                }}
              />
            ) : (
              <div className="space-y-4">
                {funnels.map(funnel => (
                  <Card key={funnel.id} className="p-4 bg-[#1a1a2e] border-[#2a2a4a]">
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="text-lg font-medium text-white">{funnel.name}</h3>
                        <p className="text-sm text-gray-400">
                          {funnel.stages.length} estágios
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          onClick={() => handleDeleteFunnel(funnel.id)}
                          variant="outline"
                          size="icon"
                          className="bg-red-600 hover:bg-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <div className="mt-4">
                      <div className="flex gap-2 flex-wrap">
                        {funnel.stages.map((stage, index) => (
                          <span
                            key={stage.id}
                            className="px-2 py-1 rounded text-sm bg-[#2a2a4a] text-white"
                          >
                            {index + 1}. {stage.name}
                          </span>
                        ))}
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
