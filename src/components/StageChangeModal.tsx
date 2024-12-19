import { useState } from 'react';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';

interface StageChangeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (reason: string) => void;
  fromStage: string;
  toStage: string;
}

export function StageChangeModal({ 
  isOpen, 
  onClose, 
  onConfirm, 
  fromStage, 
  toStage 
}: StageChangeModalProps) {
  const [reason, setReason] = useState('');

  const handleConfirm = () => {
    if (!reason.trim()) return;
    onConfirm(reason);
    setReason('');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-[#1a1a2e] border-[#2a2a4a] text-white">
        <DialogHeader>
          <DialogTitle>Motivo da Mudança de Estágio</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-400">De:</span>
            <span className="font-medium text-purple-400">{fromStage}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-400">Para:</span>
            <span className="font-medium text-green-400">{toStage}</span>
          </div>
          <Textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Digite o motivo da mudança de estágio..."
            className="bg-[#1a1a2e] border-[#2a2a4a] text-white min-h-[100px]"
          />
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={onClose}
            className="border-[#2a2a4a] hover:bg-[#2a2a4a]"
          >
            Cancelar
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={!reason.trim()}
            className="bg-purple-600 hover:bg-purple-700"
          >
            Confirmar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
