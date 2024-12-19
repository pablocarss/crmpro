import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { activityService } from '@/services/activityService';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Calendar, Clock, Phone, Video, Mail, Plus, FileText, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';

export function RecentActivities() {
  const navigate = useNavigate();
  const [activities, setActivities] = useState(() => 
    activityService.getActivities().slice(0, 5)
  );

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'call':
        return <Phone className="w-4 h-4" />;
      case 'meeting':
        return <Video className="w-4 h-4" />;
      case 'email':
        return <Mail className="w-4 h-4" />;
      case 'task':
        return <FileText className="w-4 h-4" />;
      case 'note':
        return <FileText className="w-4 h-4" />;
      default:
        return <FileText className="w-4 h-4" />;
    }
  };

  const getActivityTypeText = (type: string) => {
    const types = {
      call: 'Ligação',
      meeting: 'Reunião',
      email: 'E-mail',
      task: 'Tarefa',
      note: 'Anotação'
    };
    return types[type as keyof typeof types] || type;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-500/20 text-yellow-500';
      case 'completed':
        return 'bg-green-500/20 text-green-500';
      case 'cancelled':
        return 'bg-red-500/20 text-red-500';
      default:
        return 'bg-gray-500/20 text-gray-500';
    }
  };

  const getStatusText = (status: string) => {
    const statuses = {
      pending: 'Pendente',
      completed: 'Concluída',
      cancelled: 'Cancelada'
    };
    return statuses[status as keyof typeof statuses] || status;
  };

  return (
    <Card className="p-4 bg-[#1a1a2e] border-[#2a2a4a]">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Atividades</h3>
        <div className="flex gap-2">
          <Button 
            size="sm" 
            className="bg-purple-600 hover:bg-purple-700"
            onClick={() => navigate('/atividades')}
          >
            <Plus className="w-4 h-4 mr-2" />
            Nova Atividade
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => navigate('/atividades')}
          >
            Ver todas
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        {activities.map((activity) => (
          <div
            key={activity.id}
            className="flex items-start justify-between p-3 rounded-lg bg-[#2a2a4a]/50 hover:bg-[#2a2a4a] transition-colors cursor-pointer"
            onClick={() => navigate('/atividades')}
          >
            <div className="space-y-2 w-full">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-full bg-purple-500/20 text-purple-500">
                    {getActivityIcon(activity.type)}
                  </div>
                  <div>
                    <span className="font-medium">{activity.title}</span>
                    <div className="flex items-center gap-2 text-sm">
                      <span className="text-gray-400">{getActivityTypeText(activity.type)}</span>
                      <Badge className={getStatusColor(activity.status)}>
                        {getStatusText(activity.status)}
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm text-gray-400">
                <div className="flex items-center gap-1">
                  <User className="w-4 h-4" />
                  <span>{activity.createdBy}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  <span>{format(new Date(activity.createdAt), "dd/MM/yyyy", { locale: ptBR })}</span>
                </div>
                {activity.dueDate && (
                  <div className="flex items-center gap-1 col-span-2">
                    <Clock className="w-4 h-4" />
                    <span>Vence em: {format(new Date(activity.dueDate), "dd/MM/yyyy", { locale: ptBR })}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}

        {activities.length === 0 && (
          <div className="text-center py-4 text-gray-400">
            Nenhuma atividade registrada
          </div>
        )}
      </div>
    </Card>
  );
}
