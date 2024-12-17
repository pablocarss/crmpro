import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link, useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { useState } from "react";

const Login = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simulação de login bem-sucedido
    localStorage.setItem("isAuthenticated", "true");
    toast({
      title: "Login realizado com sucesso!",
      description: "Redirecionando para o dashboard...",
    });
    
    // Aguarda um breve momento para mostrar o toast antes de redirecionar
    setTimeout(() => {
      navigate("/");
    }, 1000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center gradient-bg p-4">
      <Card className="w-full max-w-md card-gradient">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl text-center">Login CRM PRO+</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div className="space-y-4">
              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-purple-600 to-black"
              >
                Entrar
              </Button>
              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={() => navigate(-1)}
              >
                Voltar
              </Button>
            </div>
          </form>
          <div className="mt-4 text-center space-y-2">
            <Link to="/forgot-password" className="text-sm text-primary hover:underline block">
              Esqueceu sua senha?
            </Link>
            <div className="text-sm">
              Não tem uma conta?{" "}
              <Link to="/register" className="text-primary hover:underline">
                Registre-se
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;