import { MessageSquare, PieChart } from "lucide-react";
import { Button } from "./ui/button";
import { useNavigate, useLocation } from "react-router-dom";

export function Navigation() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <nav className="fixed left-0 top-14 h-[calc(100vh-3.5rem)] w-14 border-r bg-background">
      <div className="flex h-full flex-col items-center gap-4 py-4">
        <Button
          variant={location.pathname === "/" ? "secondary" : "ghost"}
          size="icon"
          onClick={() => navigate("/")}
        >
          <PieChart className="h-5 w-5" />
        </Button>
        <Button
          variant={location.pathname === "/chat" ? "secondary" : "ghost"}
          size="icon"
          onClick={() => navigate("/chat")}
        >
          <MessageSquare className="h-5 w-5" />
        </Button>
      </div>
    </nav>
  );
}
