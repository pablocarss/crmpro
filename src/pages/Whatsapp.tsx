import { useEffect, useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { integrationService } from '@/services/integrationService';
import { WhatsAppMessage, whatsappService } from '@/services/whatsappService';
import { Send, Settings, Trash } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Loader2 } from 'lucide-react';

export default function WhatsApp() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [messages, setMessages] = useState<WhatsAppMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [useTemplate, setUseTemplate] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const TEST_NUMBER = '+5511981842947';
  const [phoneNumber, setPhoneNumber] = useState(TEST_NUMBER);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    const config = integrationService.getWhatsAppConfig();
    if (!config) {
      toast({
        title: "WhatsApp não configurado",
        description: "Configure sua integração com o WhatsApp para começar a enviar mensagens.",
        variant: "destructive",
      });
    } else {
      setMessages(whatsappService.getMessages());
    }
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    try {
      setError(null);
      setLoading(true);
      
      if (!useTemplate) {
        toast({
          title: "Mensagens personalizadas indisponíveis",
          description: "Durante a fase de desenvolvimento, apenas templates aprovados podem ser enviados. Use a opção 'Template' para enviar mensagens.",
          variant: "destructive",
        });
        return;
      }

      const config = integrationService.getWhatsAppConfig();
      if (!config) {
        toast({
          title: "WhatsApp não configurado",
          description: "Configure o WhatsApp na página de integrações primeiro",
          variant: "destructive",
        });
        return;
      }

      // Formata o número para o padrão internacional
      const formattedNumber = phoneNumber.replace(/\D/g, '');
      
      const message = await whatsappService.sendMessage(formattedNumber, newMessage, useTemplate);
      setMessages(prev => [...prev, message]);
      setNewMessage('');
      
      toast({
        title: "Mensagem enviada",
        description: "Template testepablo enviado com sucesso",
      });
    } catch (error) {
      console.error('Erro ao enviar mensagem:', error);
      setError(error.message);
      
      toast({
        title: "Erro ao enviar mensagem",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const clearChat = () => {
    whatsappService.clearMessages();
    setMessages([]);
  };

  const goToConfig = () => {
    navigate('/integracoes');
  };

  const formatPhoneNumber = (number: string) => {
    const digitsOnly = number.replace(/[^\d]/g, '');
    if (digitsOnly === '11999999999') {
      return '+55 11 99999-9999';
    }
    return number;
  };

  const handlePhoneNumberChange = (value: string) => {
    // Se o usuário está apagando o +, não deixa
    if (value === '') {
      setPhoneNumber('+');
      return;
    }
    
    // Formata o número se for o número de teste
    const formatted = formatPhoneNumber(value);
    setPhoneNumber(formatted);
  };

  if (!integrationService.getWhatsAppConfig()) {
    return (
      <Card className="w-full max-w-2xl mx-auto mt-8">
        <CardHeader>
          <CardTitle>WhatsApp não configurado</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>Configure sua integração com o WhatsApp para começar a enviar mensagens.</p>
          <Button onClick={goToConfig}>
            <Settings className="w-4 h-4 mr-2" />
            Ir para Configurações
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4 p-4">
      <Card className="w-full max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>WhatsApp Business</span>
            <div className="flex items-center space-x-2">
              <span className="text-sm font-normal text-muted-foreground">
                ID: {integrationService.getWhatsAppConfig()?.phoneNumberId}
              </span>
              <Button variant="outline" size="icon" onClick={clearChat}>
                <Trash className="w-4 h-4" />
              </Button>
              <Button variant="outline" size="icon" onClick={goToConfig}>
                <Settings className="w-4 h-4" />
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Número do WhatsApp</Label>
              <div className="flex items-center space-x-2">
                <Input
                  id="phoneNumber"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="Ex: +5511999999999"
                  className="flex-1"
                />
              </div>
              <p className="text-sm text-muted-foreground">
                Digite o número com DDD. Ex: 11999999999
              </p>
            </div>
            
            <div className="space-y-4 h-[400px] overflow-y-auto p-4 bg-muted/50 rounded-lg">
              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={`p-3 rounded-lg ${
                    msg.from === integrationService.getWhatsAppConfig()?.phoneNumberId
                      ? 'bg-primary text-primary-foreground ml-auto'
                      : 'bg-card'
                  } max-w-[80%] shadow-sm`}
                >
                  <p>{msg.content}</p>
                  <div className="flex justify-between items-center mt-1">
                    <span className="text-xs opacity-70">
                      {new Date(msg.timestamp).toLocaleTimeString()}
                    </span>
                    <span className="text-xs opacity-70">
                      {msg.status}
                    </span>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Mensagem</Label>
                <div className="flex items-center space-x-2">
                  <Input
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Digite sua mensagem..."
                    className="flex-1"
                    disabled={loading}
                  />
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="template"
                      checked={useTemplate}
                      onCheckedChange={(checked) => setUseTemplate(checked as boolean)}
                      disabled={loading}
                    />
                    <Label htmlFor="template" className="cursor-pointer">
                      Template
                    </Label>
                  </div>
                  <Button 
                    onClick={handleSendMessage}
                    disabled={loading || (!useTemplate && !newMessage.trim())}
                  >
                    {loading ? (
                      <span className="flex items-center">
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Enviando...
                      </span>
                    ) : (
                      'Enviar'
                    )}
                  </Button>
                </div>
                {error && (
                  <p className="text-sm text-red-500">
                    {error}
                  </p>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
