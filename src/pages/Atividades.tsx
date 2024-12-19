import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Calendar as CalendarIcon } from 'lucide-react';
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { activityService } from '@/services/activityService';
import { Clock, Edit, Plus, Trash2, User } from 'lucide-react';

export default function Atividades() {
  const { toast } = useToast();
  const [activities, setActivities] = useState(() => activityService.getActivities());
  const [filterType, setFilterType] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [showActivityDialog, setShowActivityDialog] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState<any>(null);
  const [activityForm, setActivityForm] = useState({
    type: 'task',
    title: '',
    description: '',
    status: 'pending',
    dueDate: '',
  });

  const resetForm = () => {
    setActivityForm({
      type: 'task',
      title: '',
      description: '',
      status: 'pending',
      dueDate: '',
    });
    setSelectedActivity(null);
  };

  const handleOpenDialog = (activity?: any) => {
    if (activity) {
      setSelectedActivity(activity);
      setActivityForm({
        type: activity.type,
        title: activity.title,
        description: activity.description,
        status: activity.status,
        dueDate: activity.dueDate || '',
      });
    } else {
      resetForm();
    }
    setShowActivityDialog(true);
  };

  const handleSaveActivity = () => {
    if (!activityForm.title || !activityForm.description) {
      toast({
        title: "Erro",
        description: "Preencha todos os campos obrigatórios",
        variant: "destructive",
      });
      return;
    }

    try {
      if (selectedActivity) {
        activityService.updateActivity(selectedActivity.id, activityForm);
      } else {
        activityService.createActivity({
          ...activityForm,
          createdBy: 'Usuário Atual',
        });
      }
      
      setActivities(activityService.getActivities());
      setShowActivityDialog(false);
      resetForm();

      toast({
        title: "Sucesso",
        description: selectedActivity 
          ? "Atividade atualizada com sucesso"
          : "Atividade criada com sucesso",
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao salvar atividade",
        variant: "destructive",
      });
    }
  };

  const handleDeleteActivity = (id: string) => {
    try {
      activityService.deleteActivity(id);
      setActivities(activityService.getActivities());
      toast({
        title: "Sucesso",
        description: "Atividade excluída com sucesso",
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao excluir atividade",
        variant: "destructive",
      });
    }
  };

  const handleUpdateStatus = (id: string, status: 'pending' | 'completed' | 'cancelled') => {
    try {
      activityService.updateActivity(id, { status });
      setActivities(activityService.getActivities());
      toast({
        title: "Sucesso",
        description: "Status atualizado com sucesso",
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao atualizar status",
        variant: "destructive",
      });
    }
  };

  const filteredActivities = activities.filter(activity => {
    if (filterType !== 'all' && activity.type !== filterType) return false;
    if (filterStatus !== 'all' && activity.status !== filterStatus) return false;
    return true;
  });

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Atividades</h2>
          <p className="text-gray-400">Gerencie suas atividades e tarefas</p>
        </div>
        <Dialog open={showActivityDialog} onOpenChange={(open) => {
          if (!open) resetForm();
          setShowActivityDialog(open);
        }}>
          <DialogTrigger asChild>
            <Button className="bg-purple-600 hover:bg-purple-700">
              <Plus className="w-4 h-4 mr-2" />
              Nova Atividade
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {selectedActivity ? 'Editar Atividade' : 'Nova Atividade'}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <div>
                <Select
                  value={activityForm.type}
                  onValueChange={(value) => setActivityForm({ ...activityForm, type: value as any })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Tipo de Atividade" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="call">Ligação</SelectItem>
                    <SelectItem value="meeting">Reunião</SelectItem>
                    <SelectItem value="email">E-mail</SelectItem>
                    <SelectItem value="task">Tarefa</SelectItem>
                    <SelectItem value="note">Anotação</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Input
                placeholder="Título"
                value={activityForm.title}
                onChange={(e) => setActivityForm({ ...activityForm, title: e.target.value })}
              />
              <Textarea
                placeholder="Descrição"
                value={activityForm.description}
                onChange={(e) => setActivityForm({ ...activityForm, description: e.target.value })}
              />
              <div className="grid gap-2">
                <label className="text-sm text-gray-400">Data de Vencimento</label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "justify-start text-left font-normal",
                        !activityForm.dueDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {activityForm.dueDate ? (
                        format(new Date(activityForm.dueDate), "dd/MM/yyyy", { locale: ptBR })
                      ) : (
                        <span>Selecione uma data</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={activityForm.dueDate ? new Date(activityForm.dueDate) : undefined}
                      onSelect={(date) => 
                        setActivityForm({ 
                          ...activityForm, 
                          dueDate: date ? date.toISOString() : '' 
                        })
                      }
                      initialFocus
                      locale={ptBR}
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => {
                  setShowActivityDialog(false);
                  resetForm();
                }}>
                  Cancelar
                </Button>
                <Button onClick={handleSaveActivity}>
                  {selectedActivity ? 'Salvar' : 'Criar'} Atividade
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex gap-4 mb-6">
        <Select value={filterType} onValueChange={setFilterType}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Filtrar por tipo" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os tipos</SelectItem>
            <SelectItem value="call">Ligações</SelectItem>
            <SelectItem value="meeting">Reuniões</SelectItem>
            <SelectItem value="email">E-mails</SelectItem>
            <SelectItem value="task">Tarefas</SelectItem>
            <SelectItem value="note">Anotações</SelectItem>
          </SelectContent>
        </Select>

        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Filtrar por status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os status</SelectItem>
            <SelectItem value="pending">Pendentes</SelectItem>
            <SelectItem value="completed">Concluídas</SelectItem>
            <SelectItem value="cancelled">Canceladas</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-4">
        {filteredActivities.map((activity) => (
          <Card 
            key={activity.id} 
            className="p-4 bg-[#1a1a2e] border-[#2a2a4a] cursor-pointer hover:bg-[#2a2a4a] transition-colors"
            onClick={() => handleOpenDialog(activity)}
          >
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <h3 className="font-semibold">{activity.title}</h3>
                <p className="text-gray-400">{activity.description}</p>
                <div className="flex items-center gap-4 text-sm text-gray-400">
                  <div className="flex items-center gap-1">
                    <User className="w-4 h-4" />
                    <span>{activity.createdBy}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <CalendarIcon className="w-4 h-4" />
                    <span>{format(new Date(activity.createdAt), "dd/MM/yyyy", { locale: ptBR })}</span>
                  </div>
                  {activity.dueDate && (
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span>Vence: {format(new Date(activity.dueDate), "dd/MM/yyyy", { locale: ptBR })}</span>
                    </div>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Select
                  value={activity.status}
                  onValueChange={(value) => {
                    handleUpdateStatus(activity.id, value as any);
                    event?.stopPropagation();
                  }}
                >
                  <SelectTrigger className="w-[130px]" onClick={(e) => e.stopPropagation()}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pendente</SelectItem>
                    <SelectItem value="completed">Concluída</SelectItem>
                    <SelectItem value="cancelled">Cancelada</SelectItem>
                  </SelectContent>
                </Select>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteActivity(activity.id);
                  }}
                >
                  <Trash2 className="w-4 h-4 text-red-500" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleOpenDialog(activity);
                  }}
                >
                  <Edit className="w-4 h-4 text-purple-400" />
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
