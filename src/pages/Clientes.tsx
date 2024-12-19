import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Plus, Search } from 'lucide-react';
import { useState } from 'react';
import { leadService, type Lead } from '@/services/leadService';
import { formatCurrency } from '@/utils/formatters';

export default function Clientes() {
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);

  // Obter todos os leads
  const allLeads = leadService.getAll();

  // Filtrar leads com base no termo de pesquisa
  const filteredLeads = allLeads.filter(lead => 
    lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lead.phone?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lead.productName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Clientes</h1>
        <Button
          onClick={() => setShowForm(true)}
          className="bg-purple-600 hover:bg-purple-700"
        >
          <Plus className="h-4 w-4 mr-2" />
          Novo Cliente
        </Button>
      </div>

      <div className="flex items-center space-x-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            type="text"
            placeholder="Pesquisar por nome, telefone ou produto..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-[#1a1a2e] border-[#2a2a4a] text-white"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredLeads.map((lead) => (
          <Card
            key={lead.id}
            className="bg-[#1a1a2e] border-[#2a2a4a] text-white p-4 hover:border-purple-500 transition-colors cursor-pointer"
          >
            <div className="space-y-2">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium">{lead.name}</h3>
                  {lead.phone && (
                    <p className="text-sm text-gray-400">{lead.phone}</p>
                  )}
                </div>
                <span className="text-sm font-medium text-purple-400">
                  {formatCurrency(lead.productPrice)}
                </span>
              </div>
              <div>
                <p className="text-sm text-gray-400">Produto:</p>
                <p className="text-sm text-purple-400">{lead.productName}</p>
              </div>
              {lead.observation && (
                <div>
                  <p className="text-sm text-gray-400">Observações:</p>
                  <p className="text-sm text-gray-300">{lead.observation}</p>
                </div>
              )}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
