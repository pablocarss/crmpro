export interface StageChange {
  fromStage: string;
  toStage: string;
  reason: string;
  date: string;
}

export interface Lead {
  id: string;
  name: string;
  phone?: string;
  productId: string;
  productName: string;
  productPrice: number;
  funnelId: string;
  stageId: string;
  createdAt: string;
  stageHistory: StageChange[];
  observation?: string;
}

const LEADS_KEY = 'crm_leads';

class LeadService {
  private getLeads(): Lead[] {
    const leadsJson = localStorage.getItem(LEADS_KEY);
    if (!leadsJson) {
      this.saveLeads([]);
      return [];
    }
    return JSON.parse(leadsJson);
  }

  private saveLeads(leads: Lead[]): void {
    localStorage.setItem(LEADS_KEY, JSON.stringify(leads));
  }

  getAll(): Lead[] {
    return this.getLeads();
  }

  getByFunnelId(funnelId: string): Lead[] {
    return this.getLeads().filter(lead => lead.funnelId === funnelId);
  }

  create(lead: Omit<Lead, 'id' | 'createdAt' | 'stageHistory' | 'observation'>): Lead {
    const leads = this.getLeads();
    const newLead: Lead = {
      ...lead,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      stageHistory: [],
      observation: '',
    };
    
    this.saveLeads([...leads, newLead]);
    return newLead;
  }

  updateStage(leadId: string, stageId: string, fromStageName: string, toStageName: string, reason: string): void {
    const leads = this.getLeads();
    const index = leads.findIndex(lead => lead.id === leadId);
    if (index !== -1) {
      const lead = leads[index];
      leads[index] = {
        ...lead,
        stageId,
        stageHistory: [
          ...(lead.stageHistory || []),
          {
            fromStage: fromStageName,
            toStage: toStageName,
            reason,
            date: new Date().toISOString(),
          }
        ],
      };
      this.saveLeads(leads);
    }
  }

  updateObservation(leadId: string, observation: string): void {
    const leads = this.getLeads();
    const index = leads.findIndex(lead => lead.id === leadId);
    if (index !== -1) {
      leads[index] = {
        ...leads[index],
        observation,
      };
      this.saveLeads(leads);
    }
  }

  delete(id: string): void {
    const leads = this.getLeads();
    this.saveLeads(leads.filter(lead => lead.id !== id));
  }
}

export const leadService = new LeadService();
