interface Stage {
  id: string;
  name: string;
  order: number;
}

export interface Funnel {
  id: string;
  name: string;
  stages: Stage[];
}

const FUNNELS_KEY = 'crm_funnels';

const defaultFunnel: Funnel = {
  id: '1',
  name: 'Funil Padrão',
  stages: [
    { id: 'lead', name: 'Leads', order: 1 },
    { id: 'contact', name: 'Primeiro Contato', order: 2 },
    { id: 'proposal', name: 'Proposta', order: 3 },
    { id: 'negotiation', name: 'Negociação', order: 4 },
    { id: 'closed', name: 'Fechado', order: 5 },
  ],
};

class FunnelService {
  private getFunnels(): Funnel[] {
    const funnelsJson = localStorage.getItem(FUNNELS_KEY);
    if (!funnelsJson) {
      this.saveFunnels([defaultFunnel]);
      return [defaultFunnel];
    }
    return JSON.parse(funnelsJson);
  }

  private saveFunnels(funnels: Funnel[]): void {
    localStorage.setItem(FUNNELS_KEY, JSON.stringify(funnels));
  }

  getAll(): Funnel[] {
    return this.getFunnels();
  }

  getById(id: string): Funnel | undefined {
    return this.getFunnels().find(funnel => funnel.id === id);
  }

  create(funnel: Funnel): void {
    const funnels = this.getFunnels();
    funnels.push(funnel);
    this.saveFunnels(funnels);
  }

  update(updatedFunnel: Funnel): void {
    const funnels = this.getFunnels();
    const index = funnels.findIndex(f => f.id === updatedFunnel.id);
    if (index !== -1) {
      funnels[index] = updatedFunnel;
      this.saveFunnels(funnels);
    }
  }

  delete(id: string): void {
    const funnels = this.getFunnels();
    const filteredFunnels = funnels.filter(funnel => funnel.id !== id);
    this.saveFunnels(filteredFunnels);
  }
}

export const funnelService = new FunnelService();
