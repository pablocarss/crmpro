import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, Star } from "lucide-react";
import { Link } from "react-router-dom";

const plans = [
  {
    name: "Starter",
    price: "R$ 97/mês",
    priceYearly: "R$ 970/ano",
    popular: false,
    features: [
      "1 Usuário",
      "100 Leads",
      "1 Funil de Vendas",
      "WhatsApp Business",
      "Email Marketing Básico",
      "Suporte por Email",
      "Automações Básicas",
    ],
  },
  {
    name: "Professional",
    price: "R$ 197/mês",
    priceYearly: "R$ 1.970/ano",
    popular: true,
    features: [
      "5 Usuários",
      "1.000 Leads",
      "Funis Ilimitados",
      "WhatsApp Business Pro",
      "Email Marketing Avançado",
      "Suporte Prioritário",
      "Automações Avançadas",
      "Integração Zoom",
      "API Access",
    ],
  },
  {
    name: "Enterprise",
    price: "R$ 497/mês",
    priceYearly: "R$ 4.970/ano",
    popular: false,
    features: [
      "Usuários Ilimitados",
      "Leads Ilimitados",
      "Funis Ilimitados",
      "WhatsApp Enterprise",
      "Email Marketing Enterprise",
      "Suporte 24/7 VIP",
      "Automações Ilimitadas",
      "Integrações Premium",
      "API Dedicada",
      "Servidor Dedicado",
    ],
  },
];

const Landing = () => {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b fixed w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-primary">CRM PRO+</h1>
          <div className="space-x-4">
            <Button variant="ghost" asChild>
              <Link to="/login">Login</Link>
            </Button>
            <Button asChild className="bg-gradient-to-r from-purple-600 to-black">
              <Link to="/register">Começar Agora</Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="pt-20">
        <section className="py-20 bg-gradient-to-b from-purple-600/10 to-transparent">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-5xl font-bold mb-6 bg-gradient-to-r from-purple-600 to-black bg-clip-text text-transparent">
              Transforme seu Negócio com CRM PRO+
            </h2>
            <p className="text-xl mb-8 text-muted-foreground max-w-2xl mx-auto">
              A plataforma completa de CRM que integra WhatsApp, Email, Zoom e muito mais.
              Aumente suas vendas com automação e inteligência.
            </p>
            <div className="flex justify-center gap-4">
              <Button asChild size="lg" className="bg-gradient-to-r from-purple-600 to-black">
                <Link to="/register">Teste Grátis por 14 dias</Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <a href="#planos">Ver Planos</a>
              </Button>
            </div>
          </div>
        </section>

        <section id="planos" className="py-20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Escolha o Plano Ideal</h2>
              <p className="text-muted-foreground">
                Preços transparentes, sem surpresas. Cancele quando quiser.
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {plans.map((plan) => (
                <Card 
                  key={plan.name} 
                  className={`relative ${
                    plan.popular ? 'border-purple-600 shadow-lg shadow-purple-600/20' : ''
                  }`}
                >
                  {plan.popular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <span className="bg-gradient-to-r from-purple-600 to-black text-white px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1">
                        <Star className="h-4 w-4" /> Mais Popular
                      </span>
                    </div>
                  )}
                  <CardHeader>
                    <CardTitle className="text-2xl">{plan.name}</CardTitle>
                    <div className="mt-2">
                      <p className="text-3xl font-bold">{plan.price}</p>
                      <p className="text-sm text-muted-foreground">ou {plan.priceYearly}</p>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-4 mb-6">
                      {plan.features.map((feature) => (
                        <li key={feature} className="flex items-start gap-2">
                          <Check className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <Button 
                      className={`w-full ${
                        plan.popular 
                          ? 'bg-gradient-to-r from-purple-600 to-black' 
                          : ''
                      }`} 
                      variant={plan.popular ? 'default' : 'outline'}
                      asChild
                    >
                      <Link to="/register">Começar Agora</Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20 bg-gradient-to-b from-transparent to-purple-600/10">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-6">
              Comece a Transformar seu Negócio Hoje
            </h2>
            <p className="text-xl mb-8 text-muted-foreground max-w-2xl mx-auto">
              14 dias grátis. Sem cartão de crédito. Cancele quando quiser.
            </p>
            <Button asChild size="lg" className="bg-gradient-to-r from-purple-600 to-black">
              <Link to="/register">Criar Conta Grátis</Link>
            </Button>
          </div>
        </section>
      </main>

      <footer className="border-t py-8">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center">
            <p className="text-sm text-muted-foreground">
              2024 CRM PRO+. Todos os direitos reservados.
            </p>
            <div className="space-x-4">
              <Button variant="ghost" size="sm">
                Termos de Uso
              </Button>
              <Button variant="ghost" size="sm">
                Privacidade
              </Button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;