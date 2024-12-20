import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/components/ui/use-toast';
import { useState, useEffect } from 'react';
import whatsappLogo from '@/assets/whatsapp-logo.svg';
import zapierLogo from '@/assets/zapier-logo.svg';
import zoomLogo from '@/assets/zoom-logo.svg';
import { integrationService, WhatsAppConfig, ZapierConfig, ZoomConfig } from '@/services/integrationService';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { CheckCircle2, XCircle } from 'lucide-react';

export default function Integracoes() {
  const { toast } = useToast();
  const [whatsappConfig, setWhatsappConfig] = useState<WhatsAppConfig>({
    token: '',
    phoneNumberId: '',
    verifyToken: '',
    webhookUrl: ''
  });
  const [zapierConfig, setZapierConfig] = useState<ZapierConfig>({
    apiKey: '',
    webhooks: []
  });
  const [zoomConfig, setZoomConfig] = useState<ZoomConfig>({
    clientId: '',
    clientSecret: '',
    redirectUri: window.location.origin + '/zoom/callback',
    scope: ['meeting:write', 'user:read']
  });

  useEffect(() => {
    const savedWhatsApp = integrationService.getWhatsAppConfig();
    if (savedWhatsApp) setWhatsappConfig(savedWhatsApp);

    const savedZapier = integrationService.getZapierConfig();
    if (savedZapier) setZapierConfig(savedZapier);

    const savedZoom = integrationService.getZoomConfig();
    if (savedZoom) setZoomConfig(savedZoom);
  }, []);

  const handleWhatsAppSave = () => {
    if (!whatsappConfig.token || !whatsappConfig.phoneNumberId) {
      toast({
        title: "Erro",
        description: "Token e Phone Number ID são obrigatórios",
        variant: "destructive",
      });
      return;
    }

    integrationService.saveWhatsAppConfig(whatsappConfig);
    toast({
      title: "Sucesso",
      description: "Integração com WhatsApp configurada",
    });
  };

  const handleZapierSave = () => {
    if (!zapierConfig.apiKey) {
      toast({
        title: "Erro",
        description: "Chave de API do Zapier é obrigatória",
        variant: "destructive",
      });
      return;
    }

    integrationService.saveZapierConfig(zapierConfig);
    toast({
      title: "Sucesso",
      description: "Integração com Zapier configurada",
    });
  };

  const handleZoomSave = () => {
    if (!zoomConfig.clientId || !zoomConfig.clientSecret) {
      toast({
        title: "Erro",
        description: "Client ID e Client Secret do Zoom são obrigatórios",
        variant: "destructive",
      });
      return;
    }

    integrationService.saveZoomConfig(zoomConfig);
    toast({
      title: "Sucesso",
      description: "Integração com Zoom configurada",
    });
  };

  const IntegrationStatus = ({ configured }: { configured: boolean }) => (
    <Alert className={configured ? "bg-green-500/20" : "bg-red-500/20"}>
      <div className="flex items-center gap-2">
        {configured ? <CheckCircle2 className="h-5 w-5 text-green-500" /> : <XCircle className="h-5 w-5 text-red-500" />}
        <AlertTitle>{configured ? "Integrado" : "Não Integrado"}</AlertTitle>
      </div>
      <AlertDescription>
        {configured 
          ? "Esta integração está configurada e funcionando."
          : "Configure esta integração para começar a usar."}
      </AlertDescription>
    </Alert>
  );

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Integrações</h2>
        <p className="text-gray-400">Configure suas integrações com outros serviços</p>
      </div>

      <Tabs defaultValue="whatsapp" className="space-y-4">
        <TabsList className="bg-[#1a1a2e]">
          <TabsTrigger value="whatsapp" className="data-[state=active]:bg-purple-600">
            <img src={whatsappLogo} alt="WhatsApp" className="h-6 w-6 mr-2" />
            WhatsApp
          </TabsTrigger>
          <TabsTrigger value="zapier" className="data-[state=active]:bg-purple-600">
            <img src={zapierLogo} alt="Zapier" className="h-6 w-6 mr-2" />
            Zapier
          </TabsTrigger>
          <TabsTrigger value="zoom" className="data-[state=active]:bg-purple-600">
            <img src={zoomLogo} alt="Zoom" className="h-6 w-6 mr-2" />
            Zoom
          </TabsTrigger>
        </TabsList>

        <TabsContent value="whatsapp" className="space-y-4">
          <div className="flex items-center gap-4">
            <img src={whatsappLogo} alt="WhatsApp Logo" className="w-12 h-12" />
            <div>
              <h2 className="text-2xl font-bold">WhatsApp Business</h2>
              <p className="text-gray-500">Configure a integração com WhatsApp Business API</p>
            </div>
          </div>
          <Card className="p-6 bg-[#1a1a2e] border-[#2a2a4a]">
            <IntegrationStatus configured={integrationService.isWhatsAppConfigured()} />

            <div className="space-y-4 mt-6">
              <div className="space-y-2">
                <Label htmlFor="phoneNumberId">Phone Number ID</Label>
                <Input
                  id="phoneNumberId"
                  value={whatsappConfig.phoneNumberId}
                  onChange={(e) => setWhatsappConfig({ ...whatsappConfig, phoneNumberId: e.target.value })}
                  placeholder="Ex: 521357897723282"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="token">Token de Acesso</Label>
                <Input
                  id="token"
                  value={whatsappConfig.token}
                  onChange={(e) => setWhatsappConfig({ ...whatsappConfig, token: e.target.value })}
                  type="password"
                  placeholder="Seu token de acesso do WhatsApp"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="webhookUrl">URL do Webhook</Label>
                <Input
                  id="webhookUrl"
                  value={whatsappConfig.webhookUrl}
                  onChange={(e) => setWhatsappConfig({ ...whatsappConfig, webhookUrl: e.target.value })}
                  placeholder="https://seu-dominio.com/api/whatsapp/webhook"
                />
                <p className="text-sm text-muted-foreground">
                  URL para receber notificações do WhatsApp
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="verifyToken">Token de Verificação do Webhook</Label>
                <Input
                  id="verifyToken"
                  value={whatsappConfig.verifyToken}
                  onChange={(e) => setWhatsappConfig({ ...whatsappConfig, verifyToken: e.target.value })}
                  placeholder="Token para verificar webhooks"
                />
                <p className="text-sm text-muted-foreground">
                  Token usado para verificar as requisições do webhook
                </p>
              </div>

              <Button 
                onClick={() => {
                  integrationService.setWhatsAppConfig(whatsappConfig);
                  toast({
                    title: "Configuração salva",
                    description: "Configuração do WhatsApp foi salva com sucesso!",
                  });
                }}
                className="w-full"
              >
                Salvar Configuração
              </Button>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="zapier" className="space-y-4">
          <div className="flex items-center gap-4">
            <img src={zapierLogo} alt="Zapier Logo" className="w-12 h-12" />
            <div>
              <h2 className="text-2xl font-bold">Zapier</h2>
              <p className="text-gray-500">Configure a integração com Zapier</p>
            </div>
          </div>
          <Card className="p-6 bg-[#1a1a2e] border-[#2a2a4a]">
            <IntegrationStatus configured={integrationService.isZapierConfigured()} />

            <div className="space-y-4 mt-6">
              <div>
                <Label htmlFor="zapier-key">Chave de API do Zapier</Label>
                <Input
                  id="zapier-key"
                  type="password"
                  value={zapierConfig.apiKey}
                  onChange={(e) => setZapierConfig({...zapierConfig, apiKey: e.target.value})}
                  placeholder="Digite sua chave de API do Zapier..."
                  className="bg-[#1a1a2e] border-[#2a2a4a]"
                />
              </div>
              <Button onClick={handleZapierSave} className="bg-[#FF4A00] hover:bg-[#FF4A00]/80">
                Salvar Configuração
              </Button>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="zoom" className="space-y-4">
          <div className="flex items-center gap-4">
            <img src={zoomLogo} alt="Zoom Logo" className="w-12 h-12" />
            <div>
              <h2 className="text-2xl font-bold">Zoom</h2>
              <p className="text-gray-500">Configure a integração com Zoom</p>
            </div>
          </div>
          <Card className="p-6 bg-[#1a1a2e] border-[#2a2a4a]">
            <IntegrationStatus configured={integrationService.isZoomConfigured()} />

            <div className="space-y-4 mt-6">
              <div>
                <Label htmlFor="zoom-client-id">Client ID do Zoom</Label>
                <Input
                  id="zoom-client-id"
                  type="password"
                  value={zoomConfig.clientId}
                  onChange={(e) => setZoomConfig({...zoomConfig, clientId: e.target.value})}
                  placeholder="Digite o Client ID do Zoom..."
                  className="bg-[#1a1a2e] border-[#2a2a4a]"
                />
              </div>
              <div>
                <Label htmlFor="zoom-client-secret">Client Secret do Zoom</Label>
                <Input
                  id="zoom-client-secret"
                  type="password"
                  value={zoomConfig.clientSecret}
                  onChange={(e) => setZoomConfig({...zoomConfig, clientSecret: e.target.value})}
                  placeholder="Digite o Client Secret do Zoom..."
                  className="bg-[#1a1a2e] border-[#2a2a4a]"
                />
              </div>
              <div>
                <Label>URI de Redirecionamento</Label>
                <Input
                  value={zoomConfig.redirectUri}
                  disabled
                  className="bg-[#1a1a2e] border-[#2a2a4a] opacity-50"
                />
                <p className="text-sm text-gray-400 mt-1">
                  Use esta URL nas configurações do seu app Zoom
                </p>
              </div>
              <Button onClick={handleZoomSave} className="bg-[#2D8CFF] hover:bg-[#2D8CFF]/80">
                Salvar Configuração
              </Button>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
