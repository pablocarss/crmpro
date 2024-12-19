import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { activityService } from '@/services/activityService';
import { format, isToday, isTomorrow, isThisWeek } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Calendar, Clock, Phone, User, Video, Mail, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { cn } from '@/lib/utils';

interface Contact {
  id: string;
  name: string;
  type: 'call' | 'meeting' | 'email';
  date: string;
  status: string;
}

export function UpcomingContacts() {
  const navigate = useNavigate();
  const [showNewContact, setShowNewContact] = useState(false);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [newContact, setNewContact] = useState({
    type: 'call',
    title: '',
    description: '',
    dueDate: '',
  });

  useEffect(() => {
    // Filtrar atividades que são contatos (calls, meetings, emails) e estão pendentes
    const activities = activityService.getActivities({
      status: 'pending',
    });

    const contactActivities = activities
      .filter(a => ['call', 'meeting', 'email'].includes(a.type))
      .map(a => ({
        id: a.id,
        name: a.title,
        type: a.type as 'call' | 'meeting' | 'email',
        date: a.dueDate || a.createdAt,
        status: a.status
      }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .slice(0, 5);

    setContacts(contactActivities);
  }, []);

  const getContactIcon = (type: string) => {
    switch (type) {
      case 'call':
        return <Phone className="w-4 h-4" />;
      case 'meeting':
        return <Video className="w-4 h-4" />;
      case 'email':
        return <Mail className="w-4 h-4" />;
      default:
        return null;
    }
  };

  const getDateLabel = (dateStr: string) => {
    const date = new Date(dateStr);
    if (isToday(date)) return 'Hoje';
    if (isTomorrow(date)) return 'Amanhã';
    if (isThisWeek(date)) return format(date, 'EEEE', { locale: ptBR });
    return format(date, 'dd/MM/yyyy', { locale: ptBR });
  };

  const handleCreateContact = () => {
    if (!newContact.title || !newContact.dueDate) return;

    const activity = activityService.createActivity({
      type: newContact.type as any,
      title: newContact.title,
      description: newContact.description,
      status: 'pending',
      dueDate: newContact.dueDate,
      createdBy: 'Usuário Atual',
    });

    setContacts(prev => [
      {
        id: activity.id,
        name: activity.title,
        type: activity.type as any,
        date: activity.dueDate || activity.createdAt,
        status: activity.status
      },
      ...prev
    ].slice(0, 5));

    setShowNewContact(false);
    setNewContact({
      type: 'call',
      title: '',
      description: '',
      dueDate: '',
    });
  };

  return (
    <Card className="p-4 bg-[#1a1a2e] border-[#2a2a4a]">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Próximos Contatos</h3>
        <div className="flex gap-2">
          <Dialog open={showNewContact} onOpenChange={setShowNewContact}>
            <DialogTrigger asChild>
              <Button size="sm" className="bg-purple-600 hover:bg-purple-700">
                <Plus className="w-4 h-4 mr-2" />
                Novo Contato
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Novo Contato</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 pt-4">
                <Select
                  value={newContact.type}
                  onValueChange={(value) => setNewContact({ ...newContact, type: value as any })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Tipo de Contato" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="call">Ligação</SelectItem>
                    <SelectItem value="meeting">Reunião</SelectItem>
                    <SelectItem value="email">E-mail</SelectItem>
                  </SelectContent>
                </Select>

                <Input
                  placeholder="Título"
                  value={newContact.title}
                  onChange={(e) => setNewContact({ ...newContact, title: e.target.value })}
                />

                <Textarea
                  placeholder="Descrição"
                  value={newContact.description}
                  onChange={(e) => setNewContact({ ...newContact, description: e.target.value })}
                />

                <div className="grid gap-2">
                  <label className="text-sm text-gray-400">Data do Contato</label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "justify-start text-left font-normal",
                          !newContact.dueDate && "text-muted-foreground"
                        )}
                      >
                        <Calendar className="mr-2 h-4 w-4" />
                        {newContact.dueDate ? (
                          format(new Date(newContact.dueDate), "dd/MM/yyyy", { locale: ptBR })
                        ) : (
                          <span>Selecione uma data</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <CalendarComponent
                        mode="single"
                        selected={newContact.dueDate ? new Date(newContact.dueDate) : undefined}
                        onSelect={(date) => 
                          setNewContact({ 
                            ...newContact, 
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
                  <Button variant="outline" onClick={() => setShowNewContact(false)}>
                    Cancelar
                  </Button>
                  <Button onClick={handleCreateContact}>
                    Criar Contato
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
          
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => navigate('/atividades')}
          >
            Ver todos
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        {contacts.map((contact) => (
          <div
            key={contact.id}
            className="flex items-center justify-between p-3 rounded-lg bg-[#2a2a4a]/50 hover:bg-[#2a2a4a] transition-colors cursor-pointer"
            onClick={() => navigate('/atividades')}
          >
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-purple-500/20 text-purple-500">
                {getContactIcon(contact.type)}
              </div>
              <div>
                <h4 className="font-medium">{contact.name}</h4>
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <Clock className="w-4 h-4" />
                  <span>{getDateLabel(contact.date)}</span>
                </div>
              </div>
            </div>
          </div>
        ))}

        {contacts.length === 0 && (
          <div className="text-center py-4 text-gray-400">
            Nenhum contato agendado
          </div>
        )}
      </div>
    </Card>
  );
}
