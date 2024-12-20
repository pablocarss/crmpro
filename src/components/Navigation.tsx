import { Link, useLocation, useNavigate } from 'react-router-dom';
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
  ChevronLeft,
  Plug,
  Zap,
  Video,
  Copyright,
  Activity,
  History,
  LogOut,
  LayoutGrid
} from 'lucide-react';
import { Button } from './ui/button';
import { useState, useEffect } from 'react';
import { useToast } from './ui/use-toast';

export function Navigation() {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCadastrosOpen, setIsCadastrosOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [userName, setUserName] = useState('');

  useEffect(() => {
    const storedName = localStorage.getItem('userName');
    if (storedName) {
      // Pega apenas o primeiro nome
      const firstName = storedName.split(' ')[0];
      setUserName(firstName);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('userName');
    toast({
      title: "Logout realizado",
      description: "Até logo!",
    });
    navigate('/');
  };

  const navigation = [
    {
      name: 'Dashboard',
      href: '/dashboard',
      icon: LayoutGrid,
      current: location.pathname === '/dashboard',
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
      {/* Mobile menu button */}
      <button
        type="button"
        className="fixed top-4 left-4 z-50 lg:hidden"
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      >
        {isMobileMenuOpen ? (
          <X className="h-6 w-6" />
        ) : (
          <Menu className="h-6 w-6" />
        )}
      </button>

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed top-0 bottom-0 left-0 bg-[#0f0f1e] transition-all duration-300 flex flex-col',
          isExpanded ? 'w-72' : 'w-20'
        )}
        onMouseEnter={() => setIsExpanded(true)}
        onMouseLeave={() => setIsExpanded(false)}
      >
        {/* Logo */}
        <div className="flex items-center h-16 px-4 shrink-0">
          <div className="flex items-center gap-3">
            <img
              src="/favicon.svg"
              alt="Logo"
              className="h-10 w-10 flex-shrink-0"
            />
            <span 
              className={cn(
                "text-2xl font-bold bg-gradient-to-r from-purple-500 to-purple-300 bg-clip-text text-transparent transition-all duration-300",
                !isExpanded && "opacity-0 w-0 overflow-hidden"
              )}
            >
              CRM PRO+
            </span>
          </div>
        </div>

        {/* Welcome Message */}
        {isExpanded && userName && (
          <div className="px-4 py-2 text-sm text-gray-300">
            Olá, {userName}! 👋
          </div>
        )}

        {/* Navigation Links */}
        <nav className="flex-1 px-2 overflow-y-auto">
          <div className="space-y-1">
            {navigation.map((item) =>
              !item.submenu ? (
                <Link
                  key={item.name}
                  to={item.href}
                  className={cn(
                    'flex items-center h-11 px-3 rounded-md transition-colors',
                    item.current
                      ? 'bg-purple-800 text-white'
                      : 'text-gray-300 hover:bg-purple-800 hover:text-white'
                  )}
                >
                  <item.icon className={cn("h-5 w-5", isExpanded ? "mr-3" : "mx-auto")} />
                  {isExpanded && (
                    <span className="text-sm font-medium">{item.name}</span>
                  )}
                </Link>
              ) : (
                <div key={item.name}>
                  <button
                    onClick={() => isExpanded && setIsCadastrosOpen(!isCadastrosOpen)}
                    className={cn(
                      'flex items-center h-11 px-3 rounded-md transition-colors w-full',
                      item.current
                        ? 'bg-purple-800 text-white'
                        : 'text-gray-300 hover:bg-purple-800 hover:text-white'
                    )}
                  >
                    <item.icon className={cn("h-5 w-5", isExpanded ? "mr-3" : "mx-auto")} />
                    {isExpanded && (
                      <div className="flex items-center justify-between flex-1">
                        <span className="text-sm font-medium">{item.name}</span>
                        {isCadastrosOpen ? (
                          <ChevronDown className="h-4 w-4" />
                        ) : (
                          <ChevronRight className="h-4 w-4" />
                        )}
                      </div>
                    )}
                  </button>
                  {isExpanded && isCadastrosOpen && (
                    <div className="mt-1 ml-4 space-y-1">
                      {item.submenu.map((subitem) => (
                        <Link
                          key={subitem.name}
                          to={subitem.href}
                          className={cn(
                            'flex items-center h-10 px-3 rounded-md transition-colors',
                            subitem.current
                              ? 'bg-purple-800 text-white'
                              : 'text-gray-300 hover:bg-purple-800 hover:text-white'
                          )}
                        >
                          <subitem.icon className="h-4 w-4 mr-3" />
                          <span className="text-sm">{subitem.name}</span>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              )
            )}
          </div>
        </nav>

        {/* Logout Button */}
        <div className="px-2 py-2 shrink-0">
          <Button
            variant="ghost"
            className={cn(
              "w-full flex items-center h-11 px-3 text-gray-300 hover:text-white hover:bg-gray-800 rounded-md",
              !isExpanded && "justify-center"
            )}
            onClick={handleLogout}
          >
            <LogOut className="h-5 w-5" />
            {isExpanded && (
              <span className="ml-3 text-sm font-medium">Sair</span>
            )}
          </Button>
        </div>
      </aside>
    </>
  );
}
