import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  PlusCircle,
  Package,
  Users,
  MessageSquare,
  Menu,
  X,
  FolderKanban,
  ChevronDown,
  ChevronRight,
  Plug,
  Zap,
  Video,
  Copyright,
  Activity,
  History
} from 'lucide-react';
import { Button } from './ui/button';
import { useState } from 'react';

export function Navigation() {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCadastrosOpen, setIsCadastrosOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const navigation = [
    {
      name: 'Dashboard',
      href: '/',
      icon: LayoutDashboard,
      current: location.pathname === '/',
    },
    {
      name: 'Cadastros',
      icon: PlusCircle,
      current: location.pathname.startsWith('/cadastros'),
      submenu: [
        {
          name: 'Produtos',
          href: '/cadastros/produtos',
          icon: Package,
          current: location.pathname === '/cadastros/produtos',
        },
        {
          name: 'Leads',
          href: '/cadastros/leads',
          icon: Users,
          current: location.pathname === '/cadastros/leads',
        },
        {
          name: 'Funis',
          href: '/cadastros/funis',
          icon: FolderKanban,
          current: location.pathname === '/cadastros/funis',
        },
      ],
    },
    {
      name: 'Funil de Vendas',
      href: '/funil',
      icon: FolderKanban,
      current: location.pathname === '/funil',
    },
    {
      name: 'WhatsApp',
      href: '/whatsapp',
      icon: MessageSquare,
      current: location.pathname === '/whatsapp',
    },
    {
      name: 'Zapier',
      href: '/zapier',
      icon: Zap,
      current: location.pathname === '/zapier',
    },
    {
      name: 'Zoom',
      href: '/zoom',
      icon: Video,
      current: location.pathname === '/zoom',
    },
    {
      name: 'Clientes',
      href: '/clientes',
      icon: Users,
      current: location.pathname === '/clientes',
    },
    {
      name: 'Atividades',
      href: '/atividades',
      icon: Activity,
      current: location.pathname === '/atividades',
    },
    {
      name: 'Logs',
      href: '/logs',
      icon: History,
      current: location.pathname === '/logs',
    },
    {
      name: 'Integrações',
      href: '/integracoes',
      icon: Plug,
      current: location.pathname === '/integracoes',
    },
  ];

  return (
    <>
      <button
        type="button"
        className="lg:hidden fixed top-4 left-4 z-50"
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      >
        {isMobileMenuOpen ? (
          <X className="h-6 w-6" />
        ) : (
          <Menu className="h-6 w-6" />
        )}
      </button>

      <div
        className={cn(
          'fixed inset-y-0 z-40 flex flex-col bg-[#1a1a2e] transition-all duration-300',
          isExpanded ? 'w-64' : 'w-20',
          isMobileMenuOpen ? 'left-0' : '-left-72 lg:left-0',
          'lg:border-r lg:border-[#2a2a4a]'
        )}
        onMouseEnter={() => setIsExpanded(true)}
        onMouseLeave={() => {
          setIsExpanded(false);
          setIsCadastrosOpen(false);
        }}
      >
        <div className="flex h-16 shrink-0 items-center justify-center px-4">
          {isExpanded ? (
            <img
              className="h-8 w-auto"
              src="/logo.svg"
              alt="CRM PRO+"
            />
          ) : (
            <img
              className="h-10 w-10"
              src="/favicon.svg"
              alt="CRM PRO+"
            />
          )}
        </div>
        <nav className="flex-1 space-y-1 px-2 py-4">
          {navigation.map((item) =>
            !item.submenu ? (
              <Link
                key={item.name}
                to={item.href}
                className={cn(
                  item.current
                    ? 'bg-[#2a2a4a] text-white'
                    : 'text-gray-400 hover:bg-[#2a2a4a] hover:text-white',
                  'group flex items-center rounded-md px-3 py-2 text-sm font-medium whitespace-nowrap overflow-hidden',
                  !isExpanded && 'justify-center'
                )}
                title={!isExpanded ? item.name : undefined}
              >
                <item.icon
                  className={cn(
                    item.current
                      ? 'text-white'
                      : 'text-gray-400 group-hover:text-white',
                    'h-5 w-5 shrink-0',
                    isExpanded && 'mr-3'
                  )}
                />
                {isExpanded && <span className="text-sm">{item.name}</span>}
              </Link>
            ) : (
              <div key={item.name} className="relative">
                <button
                  onClick={() => isExpanded && setIsCadastrosOpen(!isCadastrosOpen)}
                  className={cn(
                    item.current
                      ? 'bg-[#2a2a4a] text-white'
                      : 'text-gray-400 hover:bg-[#2a2a4a] hover:text-white',
                    'group flex w-full items-center rounded-md px-3 py-2 text-sm font-medium whitespace-nowrap overflow-hidden',
                    !isExpanded && 'justify-center'
                  )}
                  title={!isExpanded ? item.name : undefined}
                >
                  <item.icon
                    className={cn(
                      item.current
                        ? 'text-white'
                        : 'text-gray-400 group-hover:text-white',
                      'h-5 w-5 shrink-0',
                      isExpanded && 'mr-3'
                    )}
                  />
                  {isExpanded && (
                    <div className="flex items-center justify-between flex-1">
                      <span className="text-sm truncate">{item.name}</span>
                      {isCadastrosOpen ? (
                        <ChevronDown className="ml-2 h-4 w-4" />
                      ) : (
                        <ChevronRight className="ml-2 h-4 w-4" />
                      )}
                    </div>
                  )}
                </button>
                {isExpanded && isCadastrosOpen && (
                  <div className="space-y-1 pl-11">
                    {item.submenu.map((subitem) => (
                      <Link
                        key={subitem.name}
                        to={subitem.href}
                        className={cn(
                          subitem.current
                            ? 'bg-[#2a2a4a] text-white'
                            : 'text-gray-400 hover:bg-[#2a2a4a] hover:text-white',
                          'group flex items-center rounded-md px-3 py-2 text-sm font-medium'
                        )}
                      >
                        <subitem.icon
                          className={cn(
                            subitem.current
                              ? 'text-white'
                              : 'text-gray-400 group-hover:text-white',
                            'mr-3 h-4 w-4 shrink-0'
                          )}
                        />
                        <span className="text-sm">{subitem.name}</span>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            )
          )}
        </nav>
        <div className="shrink-0 px-4 py-4 border-t border-[#2a2a4a]">
          {isExpanded ? (
            <div className="text-center space-y-2">
              <div className="text-xs text-gray-400">v1.0.0</div>
              <div className="flex items-center justify-center text-xs text-gray-400 gap-1">
                Desenvolvido por
                <span className="font-semibold text-purple-400 flex items-center gap-0.5">
                  Plazer
                  <Copyright className="h-3 w-3" />
                </span>
              </div>
            </div>
          ) : (
            <div className="flex justify-center">
              <Copyright className="h-4 w-4 text-gray-400" />
            </div>
          )}
        </div>
      </div>
    </>
  );
}
