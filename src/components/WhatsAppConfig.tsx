import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { useToast } from "./ui/use-toast";
import { Loader2 } from "lucide-react";
import { integrationService } from "@/services/integrationService";
import { useNavigate } from "react-router-dom";

export function WhatsAppConfig() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [config, setConfig] = useState(() => {
    const savedConfig = integrationService.getWhatsAppConfig();
    return savedConfig || {
      token: "EAANiKRqhzOsBO0XFqY6jf7ZBQ7QjgwhBcr4FpwDYMiH5WBRV6sHdg1jXZAxbayZCvo4mvTs5W8OsF1Emqaj5DZBXORqpjNRQ0IvAMlZB2sD0covdm6FoRKoZBxX80vHsQu6EsMcQXt743w1LxiVvtJp8aMmSQp1spn4lIOyJZBFeGscmjrkk3jUtOdlTVycRGMyQLNev5WZB3wZB",
      phoneNumberId: "521357897723282",
      verifyToken: "crmpro_verify_123456",
      webhookUrl: `${window.location.protocol}//${window.location.host}/api/whatsapp/webhook`
    };
  });

  const handleSave = async () => {
    try {
      setLoading(true);

      // Limpa o token antes de salvar
      const cleanConfig = {
        ...config,
        token: config.token.trim(),
        phoneNumberId: config.phoneNumberId.trim(),
        verifyToken: config.verifyToken.trim(),
        webhookUrl: config.webhookUrl.trim()
      };
      
      // Salva no localStorage
      integrationService.saveWhatsAppConfig(cleanConfig);
      
      toast({
        title: "Configurações salvas",
        description: "As configurações do WhatsApp foram salvas com sucesso!",
      });

      // Redireciona para a página do WhatsApp
      navigate('/whatsapp');
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao salvar as configurações do WhatsApp",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Configuração do WhatsApp Business</CardTitle>
        <CardDescription>
          Configure a integração com WhatsApp Business API
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="token">Token do WhatsApp Business</Label>
          <Input
            id="token"
            type="password"
            value={config.token}
            onChange={(e) =>
              setConfig({ ...config, token: e.target.value })
            }
          />
          <p className="text-sm text-muted-foreground">
            Token de acesso do WhatsApp Business API. Certifique-se de copiar o token completo.
          </p>
        </div>
        <div className="space-y-2">
          <Label htmlFor="phoneNumberId">Phone Number ID</Label>
          <Input
            id="phoneNumberId"
            value={config.phoneNumberId}
            onChange={(e) =>
              setConfig({ ...config, phoneNumberId: e.target.value })
            }
          />
          <p className="text-sm text-muted-foreground">
            ID do número do WhatsApp Business. Encontrado no painel do Meta Business.
          </p>
        </div>
        <div className="space-y-2">
          <Label htmlFor="verifyToken">Token de Verificação</Label>
          <Input
            id="verifyToken"
            value={config.verifyToken}
            onChange={(e) =>
              setConfig({ ...config, verifyToken: e.target.value })
            }
          />
          <p className="text-sm text-muted-foreground">
            Token para verificar chamadas do webhook.
          </p>
        </div>
        <div className="space-y-2">
          <Label htmlFor="webhookUrl">URL do Webhook</Label>
          <Input
            id="webhookUrl"
            value={config.webhookUrl}
            onChange={(e) =>
              setConfig({ ...config, webhookUrl: e.target.value })
            }
          />
          <p className="text-sm text-muted-foreground">
            URL para receber notificações do WhatsApp.
          </p>
        </div>
        <Button
          className="w-full"
          onClick={handleSave}
          disabled={loading}
        >
          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Salvar Configuração
        </Button>
      </CardContent>
    </Card>
  );
}
