import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { integrationService } from '@/services/integrationService';
import { Plus, Trash2, Video, Calendar, Users, Clock } from 'lucide-react';
import { Label } from '@/components/ui/label';

interface Meeting {
  id: string;
  topic: string;
  startTime: string;
  duration: number;
  participants: string[];
  status: 'scheduled' | 'ongoing' | 'completed' | 'cancelled';
  joinUrl?: string;
}

export default function Zoom() {
  const { toast } = useToast();
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [showSchedule, setShowSchedule] = useState(false);
  const [newMeeting, setNewMeeting] = useState({
    topic: '',
    startTime: '',
    duration: 30,
    participants: ''
  });

  useEffect(() => {
    if (!integrationService.isZoomConfigured()) {
      toast({
        title: "Zoom não configurado",
        description: "Configure o Zoom nas Integrações primeiro",
        variant: "destructive",
      });
      return;
    }

    // Aqui você carregaria as reuniões da API do Zoom
    // Por enquanto, vamos usar dados de exemplo
    setMeetings([
      {
        id: '1',
        topic: 'Apresentação do Projeto',
        startTime: '2024-01-19T14:00:00',
        duration: 60,
        participants: ['joao@email.com', 'maria@email.com'],
        status: 'scheduled',
        joinUrl: 'https://zoom.us/j/123456789'
      },
      {
        id: '2',
        topic: 'Reunião de Feedback',
        startTime: '2024-01-20T15:30:00',
        duration: 45,
        participants: ['pedro@email.com'],
        status: 'scheduled',
        joinUrl: 'https://zoom.us/j/987654321'
      }
    ] as Meeting[]);
  }, []);

  const handleScheduleMeeting = () => {
    if (!newMeeting.topic || !newMeeting.startTime) {
      toast({
        title: "Erro",
        description: "Tópico e horário são obrigatórios",
        variant: "destructive",
      });
      return;
    }

    const meeting: Meeting = {
      id: Date.now().toString(),
      ...newMeeting,
      participants: newMeeting.participants.split(',').map(p => p.trim()),
      status: 'scheduled',
      joinUrl: 'https://zoom.us/j/' + Math.random().toString().slice(2, 11)
    };

    setMeetings(prev => [...prev, meeting]);
    setNewMeeting({
      topic: '',
      startTime: '',
      duration: 30,
      participants: ''
    });
    setShowSchedule(false);

    toast({
      title: "Reunião agendada",
      description: "A reunião foi agendada com sucesso",
    });
  };

  const handleCancelMeeting = (id: string) => {
    setMeetings(prev => prev.map(meeting => {
      if (meeting.id === id) {
        return { ...meeting, status: 'cancelled' as const };
      }
      return meeting;
    }));

    toast({
      title: "Reunião cancelada",
      description: "A reunião foi cancelada com sucesso",
    });
  };

  const handleJoinMeeting = (url: string) => {
    window.open(url, '_blank');
  };

  if (!integrationService.isZoomConfigured()) {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-4rem)]">
        <Card className="p-6 bg-[#1a1a2e] border-[#2a2a4a] text-center">
          <h2 className="text-xl font-semibold mb-4">Zoom não configurado</h2>
          <p className="text-gray-400 mb-4">
            Configure sua integração com o Zoom para começar a agendar reuniões.
          </p>
          <Button
            onClick={() => window.location.href = '/integracoes'}
            className="bg-[#2D8CFF] hover:bg-[#2D8CFF]/80"
          >
            Ir para Configurações
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Reuniões do Zoom</h2>
          <p className="text-gray-400">Agende e gerencie suas reuniões</p>
        </div>
        <Button
          onClick={() => setShowSchedule(!showSchedule)}
          className="bg-[#2D8CFF] hover:bg-[#2D8CFF]/80"
        >
          <Plus className="w-4 h-4 mr-2" />
          Agendar Reunião
        </Button>
      </div>

      {showSchedule && (
        <Card className="p-6 bg-[#1a1a2e] border-[#2a2a4a]">
          <h3 className="text-lg font-semibold mb-4">Agendar Nova Reunião</h3>
          <div className="space-y-4">
            <div>
              <Label>Tópico da Reunião</Label>
              <Input
                value={newMeeting.topic}
                onChange={(e) => setNewMeeting({...newMeeting, topic: e.target.value})}
                placeholder="Ex: Apresentação do Projeto"
                className="bg-[#1a1a2e] border-[#2a2a4a]"
              />
            </div>
            <div>
              <Label>Data e Hora</Label>
              <Input
                type="datetime-local"
                value={newMeeting.startTime}
                onChange={(e) => setNewMeeting({...newMeeting, startTime: e.target.value})}
                className="bg-[#1a1a2e] border-[#2a2a4a]"
              />
            </div>
            <div>
              <Label>Duração (minutos)</Label>
              <Input
                type="number"
                value={newMeeting.duration}
                onChange={(e) => setNewMeeting({...newMeeting, duration: parseInt(e.target.value)})}
                className="bg-[#1a1a2e] border-[#2a2a4a]"
              />
            </div>
            <div>
              <Label>Participantes (emails separados por vírgula)</Label>
              <Input
                value={newMeeting.participants}
                onChange={(e) => setNewMeeting({...newMeeting, participants: e.target.value})}
                placeholder="Ex: joao@email.com, maria@email.com"
                className="bg-[#1a1a2e] border-[#2a2a4a]"
              />
            </div>
            <div className="flex gap-2">
              <Button
                onClick={handleScheduleMeeting}
                className="bg-[#2D8CFF] hover:bg-[#2D8CFF]/80"
              >
                Agendar
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowSchedule(false)}
              >
                Cancelar
              </Button>
            </div>
          </div>
        </Card>
      )}

      <div className="grid gap-4">
        {meetings.map(meeting => (
          <Card key={meeting.id} className="p-4 bg-[#1a1a2e] border-[#2a2a4a]">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  meeting.status === 'scheduled' ? 'bg-blue-500' :
                  meeting.status === 'ongoing' ? 'bg-green-500' :
                  meeting.status === 'completed' ? 'bg-gray-500' :
                  'bg-red-500'
                }`}>
                  <Video className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-semibold">{meeting.topic}</h3>
                  <div className="flex items-center gap-4 text-sm text-gray-400">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      <span>{new Date(meeting.startTime).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span>{new Date(meeting.startTime).toLocaleTimeString()}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      <span>{meeting.participants.length} participantes</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {meeting.status === 'scheduled' && (
                  <>
                    <Button
                      onClick={() => handleJoinMeeting(meeting.joinUrl!)}
                      className="bg-[#2D8CFF] hover:bg-[#2D8CFF]/80"
                    >
                      Entrar
                    </Button>
                    <Button
                      variant="ghost"
                      onClick={() => handleCancelMeeting(meeting.id)}
                      className="text-red-500 hover:text-red-600"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </>
                )}
              </div>
            </div>
            <div className="mt-2">
              <p className="text-xs text-gray-400">
                Participantes: {meeting.participants.join(', ')}
              </p>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
