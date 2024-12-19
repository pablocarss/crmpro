interface Activity {
  id: string;
  type: 'call' | 'meeting' | 'email' | 'task' | 'note';
  title: string;
  description: string;
  status: 'pending' | 'completed' | 'cancelled';
  dueDate?: string;
  createdAt: string;
  createdBy: string;
  relatedTo?: {
    type: 'lead' | 'client' | 'deal';
    id: string;
    name: string;
  };
}

interface LogEntry {
  id: string;
  action: string;
  details: string;
  timestamp: string;
  user: string;
  module: string;
  ipAddress?: string;
}

class ActivityService {
  private activities: Activity[] = [];
  private logs: LogEntry[] = [];

  constructor() {
    // Carregar do localStorage
    const savedActivities = localStorage.getItem('activities');
    const savedLogs = localStorage.getItem('systemLogs');
    
    if (savedActivities) {
      this.activities = JSON.parse(savedActivities);
    }
    
    if (savedLogs) {
      this.logs = JSON.parse(savedLogs);
    }
  }

  // Atividades
  createActivity(activity: Omit<Activity, 'id' | 'createdAt'>): Activity {
    const newActivity: Activity = {
      ...activity,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };

    this.activities.push(newActivity);
    this.saveActivities();
    this.logAction('Atividade criada', `Nova atividade: ${activity.title}`);
    
    return newActivity;
  }

  updateActivity(id: string, updates: Partial<Activity>): Activity {
    const index = this.activities.findIndex(a => a.id === id);
    if (index === -1) throw new Error('Atividade não encontrada');

    const updatedActivity = {
      ...this.activities[index],
      ...updates,
    };

    this.activities[index] = updatedActivity;
    this.saveActivities();
    this.logAction('Atividade atualizada', `Atividade ${id} foi atualizada`);

    return updatedActivity;
  }

  deleteActivity(id: string): void {
    const index = this.activities.findIndex(a => a.id === id);
    if (index === -1) throw new Error('Atividade não encontrada');

    this.activities.splice(index, 1);
    this.saveActivities();
    this.logAction('Atividade excluída', `Atividade ${id} foi removida`);
  }

  getActivities(filters?: {
    type?: Activity['type'];
    status?: Activity['status'];
    startDate?: string;
    endDate?: string;
  }): Activity[] {
    let filtered = [...this.activities];

    if (filters) {
      if (filters.type) {
        filtered = filtered.filter(a => a.type === filters.type);
      }
      if (filters.status) {
        filtered = filtered.filter(a => a.status === filters.status);
      }
      if (filters.startDate) {
        filtered = filtered.filter(a => a.createdAt >= filters.startDate!);
      }
      if (filters.endDate) {
        filtered = filtered.filter(a => a.createdAt <= filters.endDate!);
      }
    }

    return filtered.sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  private saveActivities(): void {
    localStorage.setItem('activities', JSON.stringify(this.activities));
  }

  // Logs
  logAction(action: string, details: string, module: string = 'sistema'): LogEntry {
    const logEntry: LogEntry = {
      id: Date.now().toString(),
      action,
      details,
      timestamp: new Date().toISOString(),
      user: 'Usuário Atual', // Idealmente, pegar do serviço de autenticação
      module,
      ipAddress: 'local', // Idealmente, pegar do cliente
    };

    this.logs.push(logEntry);
    this.saveLogs();

    return logEntry;
  }

  getLogs(filters?: {
    module?: string;
    startDate?: string;
    endDate?: string;
    user?: string;
  }): LogEntry[] {
    let filtered = [...this.logs];

    if (filters) {
      if (filters.module) {
        filtered = filtered.filter(l => l.module === filters.module);
      }
      if (filters.user) {
        filtered = filtered.filter(l => l.user === filters.user);
      }
      if (filters.startDate) {
        filtered = filtered.filter(l => l.timestamp >= filters.startDate!);
      }
      if (filters.endDate) {
        filtered = filtered.filter(l => l.timestamp <= filters.endDate!);
      }
    }

    return filtered.sort((a, b) => 
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
  }

  private saveLogs(): void {
    localStorage.setItem('systemLogs', JSON.stringify(this.logs));
  }
}

export const activityService = new ActivityService();
