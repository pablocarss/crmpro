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

interface WhatsAppConfigProps {
  onSave: (config: WhatsAppSettings) => Promise<void>;
  initialConfig?: WhatsAppSettings;
}

export interface WhatsAppSettings {
  phoneNumberId: string;
  accessToken: string;
  verifyToken: string;
  webhookUrl: string;
  businessAccountId: string;
}

export function WhatsAppConfig({ onSave, initialConfig }: WhatsAppConfigProps) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [config, setConfig] = useState<WhatsAppSettings>(
    initialConfig || {
      phoneNumberId: "",
      accessToken: "",
      verifyToken: "",
      webhookUrl: "",
      businessAccountId: "",
    }
  );

  const handleSave = async () => {
    try {
      setLoading(true);
      await onSave(config);
      toast({
        title: "Configurações salvas",
        description: "As configurações do WhatsApp foram salvas com sucesso!",
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível salvar as configurações.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl">Configuração do WhatsApp Business</CardTitle>
        <CardDescription>
          Configure suas credenciais do WhatsApp Business API para começar a enviar
          e receber mensagens.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="businessAccountId">ID da Conta Business</Label>
              <Input
                id="businessAccountId"
                placeholder="Exemplo: 123456789"
                value={config.businessAccountId}
                onChange={(e) =>
                  setConfig({ ...config, businessAccountId: e.target.value })
                }
                className="h-9"
              />
              <p className="text-xs text-muted-foreground">
                Encontre este ID no Facebook Business Manager
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="phoneNumberId">ID do Número de Telefone</Label>
              <Input
                id="phoneNumberId"
                placeholder="Exemplo: 123456789"
                value={config.phoneNumberId}
                onChange={(e) =>
                  setConfig({ ...config, phoneNumberId: e.target.value })
                }
                className="h-9"
              />
              <p className="text-xs text-muted-foreground">
                ID do seu número do WhatsApp Business
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="accessToken">Token de Acesso Permanente</Label>
            <Input
              id="accessToken"
              type="password"
              placeholder="Seu token de acesso do WhatsApp Business API"
              value={config.accessToken}
              onChange={(e) =>
                setConfig({ ...config, accessToken: e.target.value })
              }
              className="h-9"
            />
            <p className="text-xs text-muted-foreground">
              Gere este token no Facebook Business Manager
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="verifyToken">Token de Verificação</Label>
              <Input
                id="verifyToken"
                placeholder="Token para webhook"
                value={config.verifyToken}
                onChange={(e) =>
                  setConfig({ ...config, verifyToken: e.target.value })
                }
                className="h-9"
              />
              <p className="text-xs text-muted-foreground">
                Token para validar chamadas do webhook
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="webhookUrl">URL do Webhook</Label>
              <Input
                id="webhookUrl"
                placeholder="https://seu-dominio.com/webhook"
                value={config.webhookUrl}
                onChange={(e) =>
                  setConfig({ ...config, webhookUrl: e.target.value })
                }
                className="h-9"
              />
              <p className="text-xs text-muted-foreground">
                URL para receber notificações
              </p>
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <Button onClick={handleSave} disabled={loading} className="w-[200px]">
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Salvar Configurações
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
