import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { activityService } from '@/services/activityService';
import { Activity, Clock, Search, User } from 'lucide-react';

export default function Logs() {
  const [logs, setLogs] = useState(() => activityService.getLogs());
  const [filterModule, setFilterModule] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [dateRange, setDateRange] = useState({
    start: '',
    end: '',
  });

  const filteredLogs = logs.filter(log => {
    if (filterModule !== 'all' && log.module !== filterModule) return false;
    if (searchQuery && !log.details.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    if (dateRange.start && log.timestamp < dateRange.start) return false;
    if (dateRange.end && log.timestamp > dateRange.end) return false;
    return true;
  });

  const modules = Array.from(new Set(logs.map(log => log.module)));

  return (
    <div className="space-y-6 p-6">
      <div>
        <h2 className="text-2xl font-bold">Logs do Sistema</h2>
        <p className="text-gray-400">Visualize todas as atividades realizadas no sistema</p>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <div>
          <Select value={filterModule} onValueChange={setFilterModule}>
            <SelectTrigger>
              <SelectValue placeholder="Filtrar por módulo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os módulos</SelectItem>
              {modules.map(module => (
                <SelectItem key={module} value={module}>
                  {module.charAt(0).toUpperCase() + module.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            className="pl-10"
            placeholder="Pesquisar nos logs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div>
          <Input
            type="datetime-local"
            value={dateRange.start}
            onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
          />
        </div>

        <div>
          <Input
            type="datetime-local"
            value={dateRange.end}
            onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
          />
        </div>
      </div>

      <div className="space-y-4">
        {filteredLogs.map((log) => (
          <Card key={log.id} className="p-4 bg-[#1a1a2e] border-[#2a2a4a]">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Activity className="h-4 w-4 text-purple-400" />
                  <span className="font-semibold">{log.action}</span>
                  <span className="text-sm text-gray-400">|</span>
                  <span className="text-sm text-purple-400">{log.module}</span>
                </div>
                <div className="flex items-center gap-4 text-sm text-gray-400">
                  <div className="flex items-center gap-1">
                    <User className="h-4 w-4" />
                    <span>{log.user}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    <span>{new Date(log.timestamp).toLocaleString()}</span>
                  </div>
                </div>
              </div>
              <p className="text-gray-400">{log.details}</p>
              {log.ipAddress && (
                <p className="text-xs text-gray-500">IP: {log.ipAddress}</p>
              )}
            </div>
          </Card>
        ))}

        {filteredLogs.length === 0 && (
          <div className="text-center py-8 text-gray-400">
            Nenhum log encontrado com os filtros selecionados.
          </div>
        )}
      </div>
    </div>
  );
}
