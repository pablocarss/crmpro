import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { UserPlus } from "lucide-react";

export function ClientsList() {
  const clients = [
    { name: "João Silva", email: "joao@email.com", status: "Ativo", value: "R$ 15.000" },
    { name: "Maria Santos", email: "maria@email.com", status: "Inativo", value: "R$ 8.000" },
    { name: "Pedro Costa", email: "pedro@email.com", status: "Ativo", value: "R$ 12.000" },
    { name: "Ana Oliveira", email: "ana@email.com", status: "Pendente", value: "R$ 5.000" },
  ];

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="flex-1 max-w-sm">
          <Input placeholder="Buscar clientes..." className="bg-background" />
        </div>
        <Button className="gradient-bg hover:opacity-90">
          <UserPlus className="mr-2 h-4 w-4" />
          Novo Cliente
        </Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Valor</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {clients.map((client) => (
              <TableRow key={client.email}>
                <TableCell className="font-medium">{client.name}</TableCell>
                <TableCell>{client.email}</TableCell>
                <TableCell>
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    client.status === 'Ativo' ? 'bg-green-500/20 text-green-500' :
                    client.status === 'Inativo' ? 'bg-red-500/20 text-red-500' :
                    'bg-yellow-500/20 text-yellow-500'
                  }`}>
                    {client.status}
                  </span>
                </TableCell>
                <TableCell className="text-right">{client.value}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}