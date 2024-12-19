import { useEffect, useState } from 'react';
import { productService } from '@/services/productService';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Edit, Trash2 } from 'lucide-react';
import { useToast } from './ui/use-toast';

interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  features: string[];
  createdAt: string;
}

export function ProductList() {
  const [products, setProducts] = useState<Product[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = () => {
    const loadedProducts = productService.getAll();
    setProducts(loadedProducts);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir este produto?')) {
      const deleted = productService.delete(id);
      if (deleted) {
        toast({
          title: "Produto excluído",
          description: "O produto foi excluído com sucesso!",
        });
        loadProducts();
      }
    }
  };

  if (products.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">Nenhum produto cadastrado.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {products.map((product) => (
        <Card key={product.id} className="p-6">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-lg font-semibold">{product.name}</h3>
            <div className="flex space-x-2">
              <Button variant="ghost" size="icon">
                <Edit className="h-4 w-4" />
              </Button>
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => handleDelete(product.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          <p className="text-2xl font-bold mb-4">
            {new Intl.NumberFormat('pt-BR', {
              style: 'currency',
              currency: 'BRL'
            }).format(product.price)}
          </p>
          
          <p className="text-gray-600 mb-4">{product.description}</p>
          
          {product.features.length > 0 && (
            <div>
              <h4 className="font-medium mb-2">Características:</h4>
              <ul className="list-disc list-inside space-y-1">
                {product.features.filter(Boolean).map((feature, index) => (
                  <li key={index} className="text-gray-600">{feature}</li>
                ))}
              </ul>
            </div>
          )}
          
          <div className="mt-4 text-sm text-gray-500">
            Cadastrado em: {new Date(product.createdAt).toLocaleDateString('pt-BR')}
          </div>
        </Card>
      ))}
    </div>
  );
}
