import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { PhoneCall, Plus, Send } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Label } from "./ui/label";
import { WhatsAppManager } from "./WhatsAppManager"; // Import the WhatsAppManager component

interface Chat {
  id: string;
  name: string;
  phone: string;
  lastMessage: string;
  timestamp: string;
  unreadCount: number;
}

interface Message {
  id: string;
  content: string;
  timestamp: string;
  sender: "user" | "client";
}

export function ChatView() {
  const [chats, setChats] = useState<Chat[]>([]);
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [newPhone, setNewPhone] = useState("");

  const handleAddWhatsApp = (phone: string) => {
    // Aqui você implementará a integração com a API do WhatsApp
    const newChat: Chat = {
      id: crypto.randomUUID(),
      name: `Cliente ${phone}`,
      phone,
      lastMessage: "Conversa iniciada",
      timestamp: new Date().toISOString(),
      unreadCount: 0,
    };
    setChats([newChat, ...chats]);
    setNewPhone("");
  };

  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedChat) return;

    const message: Message = {
      id: crypto.randomUUID(),
      content: newMessage,
      timestamp: new Date().toISOString(),
      sender: "user",
    };

    setMessages([...messages, message]);
    setNewMessage("");

    // Aqui você implementará o envio da mensagem via API do WhatsApp
  };

  return (
    <div className="flex h-[calc(100vh-3.5rem)] w-full">
      {/* Lista de Chats */}
      <div className="w-80 border-r">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="font-semibold">Conversas</h2>
          <div className="flex gap-2">
            <WhatsAppManager />
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Plus className="h-5 w-5" />
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Adicionar WhatsApp</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="phone">Número do WhatsApp</Label>
                    <Input
                      id="phone"
                      placeholder="+55 (11) 99999-9999"
                      value={newPhone}
                      onChange={(e) => setNewPhone(e.target.value)}
                    />
                  </div>
                  <Button
                    className="w-full"
                    onClick={() => handleAddWhatsApp(newPhone)}
                  >
                    Adicionar
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
        <div className="overflow-auto h-[calc(100vh-8.5rem)]">
          {chats.map((chat) => (
            <div
              key={chat.id}
              className={`p-4 border-b cursor-pointer hover:bg-accent/50 ${
                selectedChat?.id === chat.id ? "bg-accent" : ""
              }`}
              onClick={() => setSelectedChat(chat)}
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium">{chat.name}</h3>
                  <p className="text-sm text-muted-foreground truncate">
                    {chat.lastMessage}
                  </p>
                </div>
                <div className="text-xs text-muted-foreground">
                  {new Date(chat.timestamp).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Área de Chat */}
      {selectedChat ? (
        <div className="flex-1 flex flex-col">
          <div className="p-4 border-b flex justify-between items-center">
            <div>
              <h2 className="font-semibold">{selectedChat.name}</h2>
              <p className="text-sm text-muted-foreground">
                {selectedChat.phone}
              </p>
            </div>
            <Button variant="ghost" size="icon">
              <PhoneCall className="h-5 w-5" />
            </Button>
          </div>

          <div className="flex-1 overflow-auto p-4 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.sender === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[70%] rounded-lg p-3 ${
                    message.sender === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted"
                  }`}
                >
                  <p>{message.content}</p>
                  <p className="text-xs mt-1 opacity-70">
                    {new Date(message.timestamp).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="p-4 border-t">
            <div className="flex gap-2">
              <Input
                placeholder="Digite sua mensagem..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
              />
              <Button onClick={handleSendMessage}>
                <Send className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center text-muted-foreground">
          Selecione uma conversa para começar
        </div>
      )}
    </div>
  );
}
