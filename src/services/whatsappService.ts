import { integrationService } from './integrationService';

export interface WhatsAppMessage {
  id: string;
  from: string;
  to: string;
  content: string;
  timestamp: string;
  status: 'sent' | 'delivered' | 'read' | 'failed';
  type: 'text' | 'image' | 'document' | 'audio';
}

export interface Contact {
  id: string;
  name: string;
  phoneNumber: string;
  profilePicture?: string;
  lastMessage?: WhatsAppMessage;
}

class WhatsAppService {
  private MESSAGES_KEY = 'whatsapp_messages';
  private CONTACTS_KEY = 'whatsapp_contacts';

  async sendMessage(to: string, content: string): Promise<WhatsAppMessage> {
    const config = integrationService.getWhatsAppConfig();
    if (!config) throw new Error('WhatsApp não configurado');

    // Aqui você implementaria a chamada real para a API do WhatsApp Business
    // Por enquanto, vamos simular
    const message: WhatsAppMessage = {
      id: Date.now().toString(),
      from: config.phoneNumberId,
      to,
      content,
      timestamp: new Date().toISOString(),
      status: 'sent',
      type: 'text'
    };

    this.saveMessage(message);
    return message;
  }

  private saveMessage(message: WhatsAppMessage): void {
    const messages = this.getMessages();
    messages.push(message);
    localStorage.setItem(this.MESSAGES_KEY, JSON.stringify(messages));
  }

  getMessages(): WhatsAppMessage[] {
    const messages = localStorage.getItem(this.MESSAGES_KEY);
    return messages ? JSON.parse(messages) : [];
  }

  getMessagesByContact(phoneNumber: string): WhatsAppMessage[] {
    return this.getMessages().filter(
      msg => msg.from === phoneNumber || msg.to === phoneNumber
    );
  }

  saveContact(contact: Contact): void {
    const contacts = this.getContacts();
    const index = contacts.findIndex(c => c.phoneNumber === contact.phoneNumber);
    if (index >= 0) {
      contacts[index] = contact;
    } else {
      contacts.push(contact);
    }
    localStorage.setItem(this.CONTACTS_KEY, JSON.stringify(contacts));
  }

  getContacts(): Contact[] {
    const contacts = localStorage.getItem(this.CONTACTS_KEY);
    return contacts ? JSON.parse(contacts) : [];
  }

  getContact(phoneNumber: string): Contact | undefined {
    return this.getContacts().find(c => c.phoneNumber === phoneNumber);
  }
}

export const whatsappService = new WhatsAppService();
