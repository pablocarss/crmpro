import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { useToast } from './ui/use-toast';

interface ClientFormData {
  name: string;
  email: string;
  phone: string;
  company?: string;
  position?: string;
  address?: {
    street: string;
    number: string;
    complement?: string;
    city: string;
    state: string;
    zipCode: string;
  };
  notes?: string;
}

export function ClientForm() {
  const { toast } = useToast();
  const [formData, setFormData] = useState<ClientFormData>({
    name: '',
    email: '',
    phone: '',
    company: '',
    position: '',
    address: {
      street: '',
      number: '',
      complement: '',
      city: '',
      state: '',
      zipCode: '',
    },
    notes: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Aqui você implementará a lógica para salvar o cliente
      console.log('Cliente a ser salvo:', formData);
      
      toast({
        title: "Cliente cadastrado",
        description: "O cliente foi cadastrado com sucesso!",
      });
      
      // Limpar formulário
      setFormData({
        name: '',
        email: '',
        phone: '',
        company: '',
        position: '',
        address: {
          street: '',
          number: '',
          complement: '',
          city: '',
          state: '',
          zipCode: '',
        },
        notes: '',
      });
    } catch (error) {
      toast({
        title: "Erro ao cadastrar",
        description: "Ocorreu um erro ao cadastrar o cliente.",
        variant: "destructive",
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl mx-auto">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div>
          <label className="block text-sm font-medium text-gray-700">Nome*</label>
          <Input
            type="text"
            value={formData.name}
            onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Email*</label>
          <Input
            type="email"
            value={formData.email}
            onChange={e => setFormData(prev => ({ ...prev, email: e.target.value }))}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Telefone*</label>
          <Input
            type="tel"
            value={formData.phone}
            onChange={e => setFormData(prev => ({ ...prev, phone: e.target.value }))}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Empresa</label>
          <Input
            type="text"
            value={formData.company}
            onChange={e => setFormData(prev => ({ ...prev, company: e.target.value }))}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Cargo</label>
          <Input
            type="text"
            value={formData.position}
            onChange={e => setFormData(prev => ({ ...prev, position: e.target.value }))}
          />
        </div>
      </div>

      <div className="border-t pt-6">
        <h3 className="text-lg font-medium mb-4">Endereço</h3>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-gray-700">Rua</label>
            <Input
              type="text"
              value={formData.address?.street}
              onChange={e => setFormData(prev => ({
                ...prev,
                address: { ...prev.address!, street: e.target.value }
              }))}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Número</label>
            <Input
              type="text"
              value={formData.address?.number}
              onChange={e => setFormData(prev => ({
                ...prev,
                address: { ...prev.address!, number: e.target.value }
              }))}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Complemento</label>
            <Input
              type="text"
              value={formData.address?.complement}
              onChange={e => setFormData(prev => ({
                ...prev,
                address: { ...prev.address!, complement: e.target.value }
              }))}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Cidade</label>
            <Input
              type="text"
              value={formData.address?.city}
              onChange={e => setFormData(prev => ({
                ...prev,
                address: { ...prev.address!, city: e.target.value }
              }))}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Estado</label>
            <Input
              type="text"
              value={formData.address?.state}
              onChange={e => setFormData(prev => ({
                ...prev,
                address: { ...prev.address!, state: e.target.value }
              }))}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">CEP</label>
            <Input
              type="text"
              value={formData.address?.zipCode}
              onChange={e => setFormData(prev => ({
                ...prev,
                address: { ...prev.address!, zipCode: e.target.value }
              }))}
            />
          </div>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Observações</label>
        <Textarea
          value={formData.notes}
          onChange={e => setFormData(prev => ({ ...prev, notes: e.target.value }))}
          rows={4}
        />
      </div>

      <Button type="submit" className="w-full">
        Cadastrar Cliente
      </Button>
    </form>
  );
}
