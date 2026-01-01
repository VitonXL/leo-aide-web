"use client";

import { useState } from "react";
import { Headphones, MessageSquare, Search, CheckCircle, AlertTriangle, MenuBook, SmartToy, Reply, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const MOCK_TICKETS = [
  { id: 101, user: "@ivan_g", subject: "Не работает GigaChat", status: "open", date: "2 ч. назад", message: "При попытке отправить сообщение выдает ошибку 500." },
  { id: 102, user: "@maria_k", subject: "Вопрос по оплате", status: "in_progress", date: "5 ч. назад", message: "Деньги списались, премиум не появился." },
  { id: 103, user: "@dmitry_v", subject: "Жалоба на бан", status: "resolved", date: "1 д. назад", message: "Заблокировали без причины." },
  { id: 104, user: "@elena_s", subject: "Пропали заметки", status: "open", date: "10 мин. назад", message: "Внезапно очистился список заметок в премиум." },
];

const KB_ITEMS = [
  { title: "Как сменить аккаунт?", icon: "👤" },
  { title: "Как продлить премиум?", icon: "⭐" },
  { title: "Способы оплаты", icon: "💳" },
  { title: "2FA и безопасность", icon: "🛡️" },
];

export default function TicketsPage() {
  const [tickets, setTickets] = useState(MOCK_TICKETS);
  const [selectedTicket, setSelectedTicket] = useState<number | null>(null);
  const [replyText, setReplyText] = useState("");
  
  // Chatbot State
  const [chatMessages, setChatMessages] = useState([
    { role: "bot" as const, text: "Привет! Я — бот поддержки. Чем могу помочь?" }
  ]);
  const [chatInput, setChatInput] = useState("");

  const handleTicketStatus = (id: number, newStatus: string) => {
    setTickets(tickets.map(t => t.id === id ? { ...t, status: newStatus as any } : t));
  };

  const handleReply = () => {
    if (!replyText.trim()) return alert("Введите ответ");
    setTickets(tickets.map(t => t.id === selectedTicket ? { ...t, status: 'resolved' as const } : t));
    setSelectedTicket(null);
    setReplyText("");
    if (window && (window as any).Toast) (window as any).Toast.success("Ответ отправлен");
  };

  const handleChatSend = () => {
    if (!chatInput.trim()) return;
    const userMsg = { role: "user" as const, text: chatInput };
    setChatMessages(prev => [...prev, userMsg]);
    setChatInput("");
    setTimeout(() => {
      let reply = "Извините, не понял. Попробуйте уточнить.";
      const lower = chatInput.toLowerCase();
      if (lower.includes("привет")) reply = "Привет! Чем помочь?";
      if (lower.includes("премиум")) reply = "Для продления зайдите в Личный кабинет.";
      setChatMessages(prev => [...prev, { role: "bot" as const, text: reply }]);
    }, 500);
  };

  return (
    <div className="fade-in main-content">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Headphones className="text-primary" /> Тикеты и Поддержка
        </h1>
        <Badge className="bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">Admin + Mods</Badge>
      </div>

      <Tabs defaultValue="tickets" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3 max-w-lg">
          <TabsTrigger value="tickets">Тикеты</TabsTrigger>
          <TabsTrigger value="kb">База знаний</TabsTrigger>
          <TabsTrigger value="chatbot">Чат-помощник</TabsTrigger>
        </TabsList>

        <TabsContent value="tickets" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="card p-4 flex flex-col justify-center items-center">
               <div className="text-2xl font-bold text-primary">{tickets.filter(t => t.status === 'open').length}</div>
               <div className="text-sm text-muted-foreground">Открыто</div>
            </div>
            <div className="card p-4 flex flex-col justify-center items-center">
               <div className="text-2xl font-bold text-blue-600">{tickets.filter(t => t.status === 'in_progress').length}</div>
               <div className="text-sm text-muted-foreground">В работе</div>
            </div>
            <div className="card p-4 flex flex-col justify-center items-center">
               <div className="text-2xl font-bold text-green-600">{tickets.filter(t => t.status === 'resolved').length}</div>
               <div className="text-sm text-muted-foreground">Решено</div>
            </div>
            <div className="card p-4 flex flex-col justify-center items-center">
               <div className="text-2xl font-bold text-muted-foreground">{tickets.length}</div>
               <div className="text-sm text-muted-foreground">Всего</div>
            </div>
          </div>

          <div className="card overflow-hidden">
            <div className="p-4 border-b flex justify-between items-center">
               <h3 className="font-bold">Список обращений</h3>
               <Input placeholder="Поиск..." className="max-w-xs h-8" />
            </div>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Пользователь</TableHead>
                    <TableHead>Тема</TableHead>
                    <TableHead>Статус</TableHead>
                    <TableHead>Дата</TableHead>
                    <TableHead className="text-right">Действия</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {tickets.map(ticket => (
                    <TableRow key={ticket.id} className={ticket.status === 'open' ? "bg-red-50/50 dark:bg-red-900/10" : ""}>
                      <TableCell className="font-mono text-xs">#{ticket.id}</TableCell>
                      <TableCell className="text-sm font-medium">{ticket.user}</TableCell>
                      <TableCell>
                        <div className="text-sm font-medium">{ticket.subject}</div>
                        <div className="text-xs text-muted-foreground truncate max-w-[200px]">{ticket.message}</div>
                      </TableCell>
                      <TableCell>
                        <Badge className={ticket.status === 'open' ? 'bg-red-100 text-red-700' : ticket.status === 'in_progress' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'}>
                          {ticket.status === 'open' ? 'Открыт' : ticket.status === 'in_progress' ? 'В работе' : 'Решен'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground">{ticket.date}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          {ticket.status !== 'resolved' && (
                            <button onClick={() => setSelectedTicket(ticket.id)} className="btn btn-sm btn-outline h-7 px-2">
                              <MessageSquare className="h-3 w-3"/> Ответ
                            </button>
                          )}
                          {ticket.status === 'open' && (
                             <button onClick={() => handleTicketStatus(ticket.id, 'in_progress')} className="btn btn-sm btn-primary h-7 px-2">
                              В работу
                            </button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="kb">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             {KB_ITEMS.map((item, idx) => (
               <button key={idx} className="card p-6 text-left hover:shadow-md hover:border-primary transition-all group">
                 <div className="text-3xl mb-3">{item.icon}</div>
                 <div className="font-semibold text-lg group-hover:text-primary transition-colors">{item.title}</div>
                 <div className="text-sm text-muted-foreground mt-1">Нажмите, чтобы прочитать</div>
               </button>
             ))}
          </div>
        </TabsContent>

        <TabsContent value="chatbot">
          <div className="card h-[500px] flex flex-col">
             <div className="p-4 border-b flex items-center gap-2">
               <SmartToy className="text-primary" />
               <h3 className="font-bold">AI Ассистент</h3>
             </div>
             <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-muted/20">
               {chatMessages.map((msg, idx) => (
                 <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                   <div className={`max-w-[80%] p-3 rounded-2xl text-sm ${
                     msg.role === 'user' 
                       ? 'bg-primary text-primary-foreground rounded-br-none' 
                       : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100 rounded-bl-none shadow-sm'
                   }`}>
                     {msg.text}
                   </div>
                 </div>
               ))}
             </div>
             <div className="p-4 border-t bg-card">
               <div className="flex gap-2">
                 <Input 
                   placeholder="Напишите вопрос..." 
                   value={chatInput} 
                   onChange={e => setChatInput(e.target.value)} 
                   onKeyDown={e => e.key === 'Enter' && handleChatSend()}
                   className="flex-1"
                 />
                 <button onClick={handleChatSend} className="btn btn-primary">Send</button>
               </div>
             </div>
          </div>
        </TabsContent>
      </Tabs>

      {/* REPLY MODAL */}
      {selectedTicket && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
           <div className="bg-card rounded-lg w-full max-w-lg shadow-xl border overflow-hidden">
             <div className="p-4 border-b flex justify-between items-center bg-muted/30">
               <h3 className="font-bold">Ответ на тикет #{selectedTicket}</h3>
               <button onClick={() => setSelectedTicket(null)} className="text-muted-foreground hover:text-foreground"><X size={18} /></button>
             </div>
             <div className="p-6">
               <div className="mb-4 p-3 bg-muted/50 rounded text-sm border-l-4 border-primary">
                 <div className="font-bold mb-1">{tickets.find(t => t.id === selectedTicket)?.subject}</div>
                 <div className="text-muted-foreground">{tickets.find(t => t.id === selectedTicket)?.message}</div>
               </div>

               <div className="mb-4">
                 <label className="text-sm font-medium mb-2 block">Ваш ответ</label>
                 <Textarea 
                   placeholder="Введите ответ..." 
                   rows={4} 
                   value={replyText}
                   onChange={(e) => setReplyText(e.target.value)}
                   className="resize-none"
                 />
               </div>

               <div className="flex justify-end gap-2">
                 <button onClick={() => setSelectedTicket(null)} className="btn btn-outline">Отмена</button>
                 <button onClick={handleReply} className="btn btn-primary">Отправить</button>
               </div>
             </div>
           </div>
        </div>
      )}
    </div>
  );
}