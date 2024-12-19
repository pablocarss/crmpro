import { type StageChange } from '@/services/leadService';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { ScrollArea } from './ui/scroll-area';

interface LeadHistoryProps {
  isOpen: boolean;
  onClose: () => void;
  history: StageChange[];
  leadName: string;
}

export function LeadHistory({ 
  isOpen, 
  onClose, 
  history,
  leadName
}: LeadHistoryProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-[#1a1a2e] border-[#2a2a4a] text-white">
        <DialogHeader>
          <DialogTitle>Histórico do Lead: {leadName}</DialogTitle>
        </DialogHeader>

        <ScrollArea className="h-[300px] pr-4">
          <div className="space-y-4">
            {history.length === 0 ? (
              <p className="text-gray-400 text-center py-4">
                Nenhuma mudança de estágio registrada.
              </p>
            ) : (
              history.map((change, index) => (
                <div
                  key={index}
                  className="border-l-2 border-purple-500 pl-4 py-2"
                >
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-400">
                      {new Date(change.date).toLocaleString('pt-BR')}
                    </span>
                  </div>
                  <div className="mt-2 space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-purple-400">{change.fromStage}</span>
                      <span className="text-gray-400">→</span>
                      <span className="text-green-400">{change.toStage}</span>
                    </div>
                    <p className="text-sm text-gray-300">{change.reason}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
