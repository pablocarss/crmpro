export interface WhatsAppConfig {
  token: string;
  phoneNumberId: string;
  verifyToken: string;
  webhookUrl: string;
}

export interface ZapierConfig {
  apiKey: string;
  webhooks: {
    name: string;
    url: string;
    event: string;
  }[];
}

export interface ZoomConfig {
  clientId: string;
  clientSecret: string;
  redirectUri: string;
  scope: string[];
}

class IntegrationService {
  private WHATSAPP_CONFIG_KEY = 'whatsapp_config';
  private ZAPIER_CONFIG_KEY = 'zapier_config';
  private ZOOM_CONFIG_KEY = 'zoom_config';

  // WhatsApp
  saveWhatsAppConfig(config: WhatsAppConfig): void {
    localStorage.setItem(this.WHATSAPP_CONFIG_KEY, JSON.stringify(config));
  }

  getWhatsAppConfig(): WhatsAppConfig | null {
    const config = localStorage.getItem(this.WHATSAPP_CONFIG_KEY);
    return config ? JSON.parse(config) : null;
  }

  // Zapier
  saveZapierConfig(config: ZapierConfig): void {
    localStorage.setItem(this.ZAPIER_CONFIG_KEY, JSON.stringify(config));
  }

  getZapierConfig(): ZapierConfig | null {
    const config = localStorage.getItem(this.ZAPIER_CONFIG_KEY);
    return config ? JSON.parse(config) : null;
  }

  // Zoom
  saveZoomConfig(config: ZoomConfig): void {
    localStorage.setItem(this.ZOOM_CONFIG_KEY, JSON.stringify(config));
  }

  getZoomConfig(): ZoomConfig | null {
    const config = localStorage.getItem(this.ZOOM_CONFIG_KEY);
    return config ? JSON.parse(config) : null;
  }

  isWhatsAppConfigured(): boolean {
    const config = this.getWhatsAppConfig();
    return config !== null && !!config.token && !!config.phoneNumberId;
  }

  isZapierConfigured(): boolean {
    const config = this.getZapierConfig();
    return config !== null && !!config.apiKey;
  }

  isZoomConfigured(): boolean {
    const config = this.getZoomConfig();
    return config !== null && !!config.clientId && !!config.clientSecret;
  }
}

export const integrationService = new IntegrationService();
