import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Check } from "lucide-react";
import { Link } from "react-router-dom";

const plans = [
  {
    name: "Starter",
    price: "R$ 49/mês",
    features: ["1 Funil de Vendas", "Até 100 Leads", "Suporte por Email"],
  },
  {
    name: "Professional",
    price: "R$ 99/mês",
    features: ["3 Funis de Vendas", "Até 500 Leads", "Suporte Prioritário", "Relatórios Avançados"],
  },
  {
    name: "Enterprise",
    price: "R$ 199/mês",
    features: [
      "Funis Ilimitados",
      "Leads Ilimitados",
      "Suporte 24/7",
      "Relatórios Personalizados",
      "API Access",
    ],
  },
];

const Landing = () => {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
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

      <main>
        <section className="py-20 gradient-bg">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-5xl font-bold mb-6">
              Transforme seus leads em clientes
            </h2>
            <p className="text-xl mb-8 text-muted-foreground max-w-2xl mx-auto">
              CRM PRO+ é a plataforma completa para gerenciar seu funil de vendas
              e aumentar suas conversões de forma eficiente.
            </p>
            <Button asChild size="lg" className="bg-gradient-to-r from-purple-600 to-black">
              <Link to="/register">Comece Gratuitamente</Link>
            </Button>
          </div>
        </section>

        <section className="py-20">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">Planos e Preços</h2>
            <div className="grid md:grid-cols-3 gap-8">
              {plans.map((plan) => (
                <Card key={plan.name} className="card-gradient">
                  <CardHeader>
                    <CardTitle className="text-2xl">{plan.name}</CardTitle>
                    <p className="text-3xl font-bold">{plan.price}</p>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-4">
                      {plan.features.map((feature) => (
                        <li key={feature} className="flex items-center">
                          <Check className="h-5 w-5 text-primary mr-2" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                    <Button className="w-full mt-6 bg-gradient-to-r from-purple-600 to-black" asChild>
                      <Link to="/register">Selecionar Plano</Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Landing;