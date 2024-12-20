import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { integrationService } from '@/services/integrationService';
import { WhatsAppMessage, WhatsAppContact, whatsappService } from '@/services/whatsappService';
import { Send, Settings, Loader2, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { useRef, useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

export default function WhatsApp() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [messages, setMessages] = useState<WhatsAppMessage[]>([]);
  const [contacts, setContacts] = useState<WhatsAppContact[]>([]);
  const [selectedContact, setSelectedContact] = useState<WhatsAppContact | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [useTemplate, setUseTemplate] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [newPhoneNumber, setNewPhoneNumber] = useState('');
  const [isNewContactModalOpen, setIsNewContactModalOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const config = integrationService.getWhatsAppConfig();
    if (!config) {
      toast({
        title: "WhatsApp não configurado",
        description: "Configure sua integração com o WhatsApp para começar a enviar mensagens.",
        variant: "destructive",
      });
    } else {
      const contacts = whatsappService.getContacts();
      setContacts(contacts);
      
      if (selectedContact) {
        const messages = whatsappService.getMessages(selectedContact.phoneNumber);
        setMessages(messages);
      }
    }
  }, [selectedContact]);

  const handleNewContact = () => {
    if (!newPhoneNumber.trim()) {
      toast({
        title: "Número inválido",
        description: "Digite um número de telefone válido",
        variant: "destructive",
      });
      return;
    }

    // Formata o número para o padrão internacional
    const formattedNumber = newPhoneNumber.replace(/\D/g, '');
    
    // Cria novo contato
    const newContact: WhatsAppContact = {
      phoneNumber: formattedNumber,
      unreadCount: 0
    };

    // Adiciona à lista de contatos
    const updatedContacts = [...contacts, newContact];
    setContacts(updatedContacts);
    setSelectedContact(newContact);
    setNewPhoneNumber('');
    setIsNewContactModalOpen(false);

    toast({
      title: "Contato adicionado",
      description: "Agora você pode enviar mensagens para este número",
    });
  };

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

      const phoneNumber = selectedContact?.phoneNumber || '';
      const message = await whatsappService.sendMessage(phoneNumber, newMessage, useTemplate);
      
      setMessages(prev => [...prev, message]);
      setNewMessage('');
      
      // Atualiza a lista de contatos
      const updatedContacts = whatsappService.getContacts();
      setContacts(updatedContacts);
      
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

  return (
    <div className="container mx-auto p-4">
      <div className="flex h-[80vh] gap-4">
        {/* Lista de Contatos */}
        <div className="w-1/4 bg-card rounded-lg p-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Contatos</h2>
            <Dialog open={isNewContactModalOpen} onOpenChange={setIsNewContactModalOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" size="icon">
                  <Plus className="h-4 w-4" />
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Nova Conversa</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label>Número do WhatsApp</Label>
                    <Input
                      placeholder="Ex: 5511999999999"
                      value={newPhoneNumber}
                      onChange={(e) => setNewPhoneNumber(e.target.value)}
                    />
                    <p className="text-sm text-muted-foreground">
                      Digite o número com DDD, sem espaços ou caracteres especiais
                    </p>
                  </div>
                  <Button onClick={handleNewContact} className="w-full">
                    Iniciar Conversa
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
          <div className="space-y-2">
            {contacts.map(contact => (
              <div
                key={contact.phoneNumber}
                className={`p-3 rounded-lg cursor-pointer ${
                  selectedContact?.phoneNumber === contact.phoneNumber
                    ? 'bg-primary text-primary-foreground'
                    : 'hover:bg-accent'
                }`}
                onClick={() => setSelectedContact(contact)}
              >
                <div className="font-medium">{contact.phoneNumber}</div>
                {contact.lastMessage && (
                  <div className="text-sm opacity-70 truncate">
                    {contact.lastMessage.text}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Área de Chat */}
        <div className="flex-1 bg-card rounded-lg p-4 flex flex-col">
          {selectedContact ? (
            <>
              {/* Cabeçalho do Chat */}
              <div className="border-b pb-4 mb-4">
                <h2 className="text-lg font-semibold">{selectedContact.phoneNumber}</h2>
              </div>

              {/* Mensagens */}
              <div className="flex-1 overflow-y-auto mb-4 space-y-4">
                {messages.map(message => (
                  <div
                    key={message.id}
                    className={`flex ${
                      message.from ? 'justify-start' : 'justify-end'
                    }`}
                  >
                    <div
                      className={`max-w-[70%] p-3 rounded-lg ${
                        message.from
                          ? 'bg-accent'
                          : 'bg-primary text-primary-foreground'
                      }`}
                    >
                      <div>{message.text}</div>
                      <div className="text-xs opacity-70">
                        {new Date(message.timestamp).toLocaleTimeString()}
                      </div>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              {/* Input de Mensagem */}
              <div className="flex gap-2">
                <div className="flex-1">
                  <Input
                    placeholder="Digite sua mensagem..."
                    value={newMessage}
                    onChange={e => setNewMessage(e.target.value)}
                    onKeyPress={e => e.key === 'Enter' && handleSendMessage()}
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="template"
                    checked={useTemplate}
                    onCheckedChange={checked => setUseTemplate(checked as boolean)}
                  />
                  <Label htmlFor="template">Template</Label>
                </div>
                <Button onClick={handleSendMessage} disabled={loading}>
                  {loading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Send className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-muted-foreground">
              Selecione um contato para começar a conversa
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
