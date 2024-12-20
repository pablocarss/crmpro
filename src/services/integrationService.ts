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
  private DEFAULT_WHATSAPP_CONFIG = {
    phoneNumberId: '521357897723282',
    token: 'EAAM3tc5i0N4BO7BITv10FMxEA7FpAZABdw0sQ3Cqvht0U5N1JucujqZBB0i3y184rOgTk0FQKs1X8fTFxNQjdZCL0zWPpLHLZAGhpcW1YhEZB96PscTYk0KWwxfuWXskqOCmC6uEZAEmhWl1ki9YoUCXy0PupyEzSZAm1f7aFNGxYHnJtJ9ZCh0UCEtHZB8rgtJDBuofNApqXENXvslZBqKZAcED7RVxPsvEhnDdoFptwvhcCsZD',
    verifyToken: 'your_verify_token',
    webhookUrl: 'your_webhook_url'
  };
  private ZAPIER_CONFIG_KEY = 'zapier_config';
  private ZOOM_CONFIG_KEY = 'zoom_config';

  // WhatsApp
  setWhatsAppConfig(config: {
    token: string;
    phoneNumberId: string;
    verifyToken?: string;
    webhookUrl?: string;
  }) {
    localStorage.setItem(this.WHATSAPP_CONFIG_KEY, JSON.stringify(config));
  }

  getWhatsAppConfig(): {
    token: string;
    phoneNumberId: string;
    verifyToken?: string;
    webhookUrl?: string;
  } | null {
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
