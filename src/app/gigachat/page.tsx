"use client";

import { useState } from "react";
import { Send, Bot, User, Loader2, Mic } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";

type Message = {
  role: 'user' | 'bot';
  text: string;
};

export default function GigaChatPage() {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'bot', text: 'Привет! Я ИИ-помощник. Чем могу помочь сегодня?' }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);

  const handleVoiceInput = () => {
    if (isListening) {
      setIsListening(false);
      return;
    }
    setIsListening(true);
    setTimeout(() => {
      setInput("Расскажи интересный факт о космосе");
      setIsListening(false);
    }, 2000);
  };

  const handleSend = async () => {
    if (!input.trim()) return;
    const userMsg: Message = { role: 'user', text: input };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);

    setTimeout(() => {
      let botResponse = "Извините, я пока учусь.";
      const lower = input.toLowerCase();
      if (lower.includes("привет")) botResponse = "Приветствую! Как ваши дела?";
      if (lower.includes("курс")) botResponse = "Актуальные курсы валют можно посмотреть на странице Курсы.";
      
      setMessages(prev => [...prev, { role: 'bot', text: botResponse }]);
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="fade-in main-content h-[calc(100vh-80px)] flex flex-col">
      <div className="card flex-1 flex flex-col">
        <div className="border-b pb-4 mb-4 flex items-center gap-2">
          <Bot className="text-primary" /> <h2 className="text-xl font-bold">GigaChat AI</h2>
        </div>
        <ScrollArea className="flex-1">
          <div className="space-y-4 pr-4">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`flex gap-3 max-w-[80%] ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                    msg.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-secondary'
                  }`}>
                    {msg.role === 'user' ? <User size={16} /> : <Bot size={16} />}
                  </div>
                  <div className={`p-3 rounded-lg text-sm ${
                    msg.role === 'user' 
                      ? 'bg-primary text-primary-foreground rounded-tr-none' 
                      : 'bg-muted rounded-tl-none'
                  }`}>
                    {msg.text}
                  </div>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center">
                    <Loader2 size={16} className="animate-spin" />
                  </div>
                  <div className="p-3 rounded-lg bg-muted rounded-tl-none">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-75" />
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-150" />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
        <div className="p-4 border-t mt-4">
          <div className="flex gap-2">
            <button 
              variant={isListening ? "default" : "outline"} 
              className={`btn ${isListening ? "animate-pulse bg-red-500 hover:bg-red-600 text-white" : "btn-outline"}`}
              onClick={handleVoiceInput}
            >
              <Mic className="h-4 w-4" />
            </button>
            <Input 
              placeholder="Введите сообщение..." 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              disabled={isLoading}
            />
            <button onClick={handleSend} disabled={isLoading} className="btn btn-primary">
              <Send className="h-4 w-4" />
            </button>
          </div>
          <div className="text-xs text-center mt-2 text-muted-foreground">
            Голосовой ввод доступен Premium пользователям
          </div>
        </div>
      </div>
    </div>
  );
}