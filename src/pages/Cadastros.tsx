import { useState } from 'react';
import { ProductForm } from '@/components/ProductForm';
import { ProductList } from '@/components/ProductList';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Plus, List } from 'lucide-react';

export default function Cadastros() {
  const [showForm, setShowForm] = useState(false);

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Produtos</h1>
        <Button 
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2"
        >
          {showForm ? (
            <>
              <List className="h-4 w-4" />
              Ver Lista
            </>
          ) : (
            <>
              <Plus className="h-4 w-4" />
              Novo Produto
            </>
          )}
        </Button>
      </div>

      <Card>
        {showForm ? (
          <ProductForm />
        ) : (
          <div className="p-6">
            <ProductList />
          </div>
        )}
      </Card>
    </div>
  );
}
