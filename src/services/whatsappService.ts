import { integrationService } from './integrationService';

export interface WhatsAppMessage {
  id: string;
  from: string;
  to: string;
  content: string;
  timestamp: string;
  status: 'sent' | 'delivered' | 'read' | 'received';
  type: 'text' | 'template';
}

class WhatsAppService {
  private MESSAGES_KEY = 'whatsapp_messages';
  private API_VERSION = 'v21.0';
  private BASE_URL = 'https://graph.facebook.com';
  private DEFAULT_TEST_NUMBER = '5511981842947';

  private formatPhoneNumber(number: string): string {
    // Remove todos os caracteres não numéricos
    const digitsOnly = number.replace(/[^\d]/g, '');
    
    // Adiciona o código do país (Brasil - 55) se não tiver
    if (!digitsOnly.startsWith('55')) {
      return `55${digitsOnly}`;
    }
    
    return digitsOnly;
  }

  async sendMessage(to: string, text: string, useTemplate: boolean = false): Promise<WhatsAppMessage> {
    const config = integrationService.getWhatsAppConfig();
    if (!config?.phoneNumberId || !config?.token) {
      throw new Error('WhatsApp não configurado corretamente');
    }

    const formattedNumber = this.formatPhoneNumber(to);
    
    const messageData = useTemplate ? {
      messaging_product: 'whatsapp',
      to: formattedNumber,
      type: 'template',
      template: {
        name: 'testepablo',
        language: {
          code: 'pt_BR'
        }
      }
    } : {
      messaging_product: 'whatsapp',
      recipient_type: "individual",
      to: formattedNumber,
      type: 'text',
      text: {
        preview_url: false,
        body: text
      }
    };

    try {
      console.log('Enviando mensagem:', {
        url: `${this.BASE_URL}/${this.API_VERSION}/${config.phoneNumberId}/messages`,
        data: messageData
      });

      const response = await fetch(
        `${this.BASE_URL}/${this.API_VERSION}/${config.phoneNumberId}/messages`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${config.token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(messageData),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Erro na resposta:', errorData);
        throw new Error(errorData.error?.message || 'Erro ao enviar mensagem');
      }

      const responseData = await response.json();
      console.log('Resposta do WhatsApp:', responseData);

      const message: WhatsAppMessage = {
        id: Date.now().toString(),
        content: useTemplate ? 'Template testepablo' : text,
        timestamp: new Date().toISOString(),
        status: 'sent',
        to: formattedNumber,
        from: config.phoneNumberId,
        type: useTemplate ? 'template' : 'text'
      };

      this.saveMessage(message);
      return message;
    } catch (error) {
      console.error('Erro ao enviar mensagem:', error);
      throw error;
    }
  }

  private saveMessage(message: WhatsAppMessage) {
    const messages = this.getMessages();
    messages.push(message);
    localStorage.setItem(this.MESSAGES_KEY, JSON.stringify(messages));
  }

  getMessages(): WhatsAppMessage[] {
    const messages = localStorage.getItem(this.MESSAGES_KEY);
    return messages ? JSON.parse(messages) : [];
  }

  clearMessages() {
    localStorage.removeItem(this.MESSAGES_KEY);
  }
}

export const whatsappService = new WhatsAppService();
