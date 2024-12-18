import { WhatsAppSettings } from "@/components/WhatsAppConfig";

export class WhatsAppService {
  private config: WhatsAppSettings;
  private baseUrl = "https://graph.facebook.com/v17.0";

  constructor(config: WhatsAppSettings) {
    this.config = config;
  }

  // Enviar mensagem de texto
  async sendTextMessage(to: string, message: string) {
    return this.makeRequest(`/${this.config.phoneNumberId}/messages`, {
      messaging_product: "whatsapp",
      recipient_type: "individual",
      to: to,
      type: "text",
      text: { body: message },
    });
  }

  // Enviar template de mensagem
  async sendTemplate(to: string, templateName: string, languageCode: string, components: any[] = []) {
    return this.makeRequest(`/${this.config.phoneNumberId}/messages`, {
      messaging_product: "whatsapp",
      recipient_type: "individual",
      to: to,
      type: "template",
      template: {
        name: templateName,
        language: {
          code: languageCode,
        },
        components: components,
      },
    });
  }

  // Marcar mensagem como lida
  async markMessageAsRead(messageId: string) {
    return this.makeRequest(`/${this.config.phoneNumberId}/messages`, {
      messaging_product: "whatsapp",
      status: "read",
      message_id: messageId,
    });
  }

  // Enviar mensagem com mídia
  async sendMedia(to: string, mediaType: "image" | "video" | "document", mediaUrl: string, caption?: string) {
    return this.makeRequest(`/${this.config.phoneNumberId}/messages`, {
      messaging_product: "whatsapp",
      recipient_type: "individual",
      to: to,
      type: mediaType,
      [mediaType]: {
        link: mediaUrl,
        caption: caption,
      },
    });
  }

  // Verificar status do número
  async checkNumberStatus(phoneNumber: string) {
    return this.makeRequest(`/${this.config.phoneNumberId}/phone_numbers`, {
      messaging_product: "whatsapp",
      phone_numbers: [phoneNumber],
    }, "GET");
  }

  // Obter informações da conta business
  async getBusinessProfile() {
    return this.makeRequest(
      `/${this.config.phoneNumberId}/whatsapp_business_profile`,
      null,
      "GET"
    );
  }

  // Webhook para receber mensagens
  async handleWebhook(body: any) {
    try {
      const entries = body.entry;
      for (const entry of entries) {
        const changes = entry.changes;
        for (const change of changes) {
          if (change.value.messages) {
            for (const message of change.value.messages) {
              // Processar a mensagem recebida
              await this.processIncomingMessage(message);
            }
          }
        }
      }
      return true;
    } catch (error) {
      console.error("Error processing webhook:", error);
      return false;
    }
  }

  // Processar mensagem recebida
  private async processIncomingMessage(message: any) {
    const messageData = {
      messageId: message.id,
      from: message.from,
      timestamp: message.timestamp,
      type: message.type,
      text: message.text?.body,
    };

    // Aqui você pode implementar a lógica para salvar a mensagem no banco de dados
    // e notificar a interface do usuário

    return messageData;
  }

  // Método auxiliar para fazer requisições
  private async makeRequest(endpoint: string, data: any = null, method: string = "POST") {
    try {
      const url = `${this.baseUrl}${endpoint}`;
      const options: RequestInit = {
        method,
        headers: {
          Authorization: `Bearer ${this.config.accessToken}`,
          "Content-Type": "application/json",
        },
      };

      if (data && method !== "GET") {
        options.body = JSON.stringify(data);
      }

      const response = await fetch(url, options);
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "WhatsApp API request failed");
      }

      return await response.json();
    } catch (error) {
      console.error("WhatsApp API error:", error);
      throw error;
    }
  }
}
