import { useState } from "react";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Settings } from "lucide-react";
import { WhatsAppConfig, WhatsAppSettings } from "./WhatsAppConfig";
import { useToast } from "./ui/use-toast";

export function WhatsAppManager() {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);

  // Carregar configurações salvas (você pode implementar a persistência em um banco de dados)
  const loadSavedConfig = (): WhatsAppSettings | undefined => {
    const saved = localStorage.getItem("whatsapp_config");
    return saved ? JSON.parse(saved) : undefined;
  };

  const handleSaveConfig = async (config: WhatsAppSettings) => {
    try {
      // Validar as configurações tentando obter o perfil business
      const whatsapp = new WhatsAppService(config);
      await whatsapp.getBusinessProfile();

      // Se chegou aqui, as configurações são válidas
      localStorage.setItem("whatsapp_config", JSON.stringify(config));
      setOpen(false);
      
      toast({
        title: "Configurações salvas",
        description: "As configurações do WhatsApp foram validadas e salvas com sucesso!",
      });
    } catch (error) {
      console.error("Error validating WhatsApp config:", error);
      toast({
        title: "Erro de configuração",
        description: "Não foi possível validar as configurações. Verifique as credenciais.",
        variant: "destructive",
      });
      throw error;
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon">
          <Settings className="h-5 w-5" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Configurações do WhatsApp</DialogTitle>
          <DialogDescription>
            Configure sua integração com o WhatsApp Business API
          </DialogDescription>
        </DialogHeader>
        <WhatsAppConfig onSave={handleSaveConfig} initialConfig={loadSavedConfig()} />
      </DialogContent>
    </Dialog>
  );
}
