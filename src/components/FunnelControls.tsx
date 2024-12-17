import { Bell, Plus, Settings } from "lucide-react";
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { CreateFunnelForm } from "./CreateFunnelForm";
import { CreateClientForm } from "./CreateClientForm";
import { CreateProductForm } from "./CreateProductForm";
import { useToast } from "./ui/use-toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

interface FunnelControlsProps {
  funnels: any[];
  activeFunnel: string;
  setActiveFunnel: (id: string) => void;
  onCreateFunnel: (newFunnel: any) => void;
  onCreateClient: (newClient: any) => void;
  onCreateProduct: (newProduct: any) => void;
  products: any[];
  stages: any[];
}

export function FunnelControls({
  funnels,
  activeFunnel,
  setActiveFunnel,
  onCreateFunnel,
  onCreateClient,
  onCreateProduct,
  products,
  stages,
}: FunnelControlsProps) {
  const { toast } = useToast();

  return (
    <div className="flex justify-between items-center">
      <div className="space-x-4">
        {funnels.map((funnel) => (
          <Button
            key={funnel.id}
            variant={activeFunnel === funnel.id ? "default" : "outline"}
            onClick={() => setActiveFunnel(funnel.id)}
            className="bg-gradient-to-r from-purple-600 to-black"
          >
            {funnel.name}
          </Button>
        ))}
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline">
              <Plus className="h-4 w-4 mr-2" />
              Novo Funil
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Criar Novo Funil</DialogTitle>
            </DialogHeader>
            <CreateFunnelForm
              onSubmit={(newFunnel) => {
                onCreateFunnel(newFunnel);
                toast({
                  title: "Funil criado",
                  description: `${newFunnel.name} foi criado com sucesso!`,
                });
              }}
            />
          </DialogContent>
        </Dialog>
      </div>
      <div className="flex items-center space-x-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <Bell className="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>Sem notificações no momento</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <Settings className="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <Dialog>
              <DialogTrigger asChild>
                <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                  Gerenciar Produtos
                </DropdownMenuItem>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Criar Novo Produto</DialogTitle>
                </DialogHeader>
                <CreateProductForm onSubmit={onCreateProduct} />
              </DialogContent>
            </Dialog>
            <DropdownMenuItem>Configurações do Funil</DropdownMenuItem>
            <DropdownMenuItem>Preferências</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-purple-600 to-black">
              <Plus className="h-4 w-4 mr-2" />
              Novo Cliente
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Adicionar Novo Cliente</DialogTitle>
            </DialogHeader>
            <CreateClientForm
              products={products}
              stages={stages}
              onSubmit={(newClient) => {
                onCreateClient(newClient);
                toast({
                  title: "Cliente adicionado",
                  description: `${newClient.name} foi adicionado ao funil!`,
                });
              }}
            />
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}