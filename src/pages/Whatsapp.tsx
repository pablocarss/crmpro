import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { integrationService } from '@/services/integrationService';
import { WhatsAppMessage, Contact, whatsappService } from '@/services/whatsappService';
import { Send, Phone, User } from 'lucide-react';

export default function WhatsApp() {
  const { toast } = useToast();
  const [messages, setMessages] = useState<WhatsAppMessage[]>([]);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [newContact, setNewContact] = useState({ name: '', phoneNumber: '' });
  const [showAddContact, setShowAddContact] = useState(false);

  useEffect(() => {
    if (!integrationService.isWhatsAppConfigured()) {
      toast({
        title: "WhatsApp não configurado",
        description: "Configure o WhatsApp nas Integrações primeiro",
        variant: "destructive",
      });
      return;
    }

    setContacts(whatsappService.getContacts());
  }, []);

  useEffect(() => {
    if (selectedContact) {
      const contactMessages = whatsappService.getMessagesByContact(selectedContact.phoneNumber);
      setMessages(contactMessages);
    }
  }, [selectedContact]);

  const handleSendMessage = async () => {
    if (!selectedContact || !newMessage.trim()) return;

    try {
      const message = await whatsappService.sendMessage(selectedContact.phoneNumber, newMessage);
      setMessages(prev => [...prev, message]);
      setNewMessage('');
    } catch (error) {
      toast({
        title: "Erro ao enviar mensagem",
        description: (error as Error).message,
        variant: "destructive",
      });
    }
  };

  const handleAddContact = () => {
    if (!newContact.name || !newContact.phoneNumber) {
      toast({
        title: "Erro",
        description: "Nome e número são obrigatórios",
        variant: "destructive",
      });
      return;
    }

    const contact: Contact = {
      id: Date.now().toString(),
      ...newContact
    };

    whatsappService.saveContact(contact);
    setContacts(whatsappService.getContacts());
    setNewContact({ name: '', phoneNumber: '' });
    setShowAddContact(false);
  };

  if (!integrationService.isWhatsAppConfigured()) {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-4rem)]">
        <Card className="p-6 bg-[#1a1a2e] border-[#2a2a4a] text-center">
          <h2 className="text-xl font-semibold mb-4">WhatsApp não configurado</h2>
          <p className="text-gray-400 mb-4">
            Configure sua integração com o WhatsApp para começar a enviar mensagens.
          </p>
          <Button
            onClick={() => window.location.href = '/integracoes'}
            className="bg-[#25D366] hover:bg-[#128C7E]"
          >
            Ir para Configurações
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex h-[calc(100vh-4rem)]">
      {/* Lista de Contatos */}
      <div className="w-80 border-r border-[#2a2a4a] p-4 bg-[#1a1a2e]">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Contatos</h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowAddContact(!showAddContact)}
          >
            +
          </Button>
        </div>

        {showAddContact && (
          <Card className="p-4 mb-4 bg-[#1a1a2e] border-[#2a2a4a]">
            <div className="space-y-3">
              <Input
                placeholder="Nome"
                value={newContact.name}
                onChange={(e) => setNewContact({...newContact, name: e.target.value})}
                className="bg-[#1a1a2e] border-[#2a2a4a]"
              />
              <Input
                placeholder="Número do WhatsApp"
                value={newContact.phoneNumber}
                onChange={(e) => setNewContact({...newContact, phoneNumber: e.target.value})}
                className="bg-[#1a1a2e] border-[#2a2a4a]"
              />
              <Button
                onClick={handleAddContact}
                className="w-full bg-[#25D366] hover:bg-[#128C7E]"
              >
                Adicionar Contato
              </Button>
            </div>
          </Card>
        )}

        <div className="space-y-2">
          {contacts.map(contact => (
            <div
              key={contact.id}
              onClick={() => setSelectedContact(contact)}
              className={`p-3 rounded-lg cursor-pointer flex items-center gap-3 ${
                selectedContact?.id === contact.id
                  ? 'bg-purple-600'
                  : 'hover:bg-[#2a2a4a]'
              }`}
            >
              <div className="w-10 h-10 rounded-full bg-purple-500 flex items-center justify-center">
                <User className="w-6 h-6" />
              </div>
              <div>
                <p className="font-medium">{contact.name}</p>
                <p className="text-sm text-gray-400">{contact.phoneNumber}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Área de Mensagens */}
      <div className="flex-1 flex flex-col">
        {selectedContact ? (
          <>
            {/* Cabeçalho do Chat */}
            <div className="p-4 border-b border-[#2a2a4a] bg-[#1a1a2e]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-purple-500 flex items-center justify-center">
                  <User className="w-6 h-6" />
                </div>
                <div>
                  <p className="font-medium">{selectedContact.name}</p>
                  <p className="text-sm text-gray-400">{selectedContact.phoneNumber}</p>
                </div>
              </div>
            </div>

            {/* Mensagens */}
            <div className="flex-1 overflow-auto p-4 space-y-4">
              {messages.map(message => (
                <div
                  key={message.id}
                  className={`flex ${
                    message.from === selectedContact.phoneNumber ? 'justify-start' : 'justify-end'
                  }`}
                >
                  <div
                    className={`max-w-[70%] p-3 rounded-lg ${
                      message.from === selectedContact.phoneNumber
                        ? 'bg-[#2a2a4a]'
                        : 'bg-purple-600'
                    }`}
                  >
                    <p>{message.content}</p>
                    <p className="text-xs text-gray-400 mt-1">
                      {new Date(message.timestamp).toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Input de Mensagem */}
            <div className="p-4 border-t border-[#2a2a4a] bg-[#1a1a2e]">
              <div className="flex gap-2">
                <Input
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Digite sua mensagem..."
                  className="bg-[#1a1a2e] border-[#2a2a4a]"
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                />
                <Button
                  onClick={handleSendMessage}
                  className="bg-[#25D366] hover:bg-[#128C7E]"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <Phone className="w-12 h-12 mx-auto mb-4 text-gray-400" />
              <p className="text-gray-400">
                Selecione um contato para iniciar uma conversa
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
