"use client";

import { useState } from "react";
import { Headphones, MessageSquare, Search, CheckCircle, AlertTriangle, MenuBook, SmartToy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const MOCK_TICKETS = [
  { id: 101, user: "@ivan_g", subject: "Не работает GigaChat", status: "open", date: "2 ч. назад", message: "При попытке отправить сообщение выдает ошибку 500." },
  { id: 102, user: "@maria_k", subject: "Вопрос по оплате", status: "in_progress", date: "5 ч. назад", message: "Деньги списались, премиум не появился." },
  { id: 103, user: "@dmitry_v", subject: "Жалоба на бан", status: "resolved", date: "1 д. назад", message: "Заблокировали без причины." },
  { id: 104, user: "@elena_s", subject: "Пропали заметки", status: "open", date: "10 мин. назад", message: "Внезапно очистился список заметок в премиум." },
];

export default function AdminTicketsPage() {
  const [mode, setMode] = useState<"tickets" | "kb" | "chatbot">("tickets");
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
    alert("Ответ отправлен");
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
        <Badge className="bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">Admin + All Mods</Badge>
      </div>

      {/* Internal Tabs for Admin Page */}
      <div className="flex gap-2 mb-6 border-b border-gray-200 dark:border-gray-700 pb-1">
        <button 
          className={`px-4 py-2 text-sm font-medium transition-colors ${mode === 'tickets' ? 'text-green-600 border-b-2 border-green-600' : 'text-gray-500 hover:text-gray-700 dark:text-gray-400'}`}
          onClick={() => setMode('tickets')}
        >
          <MessageSquare className="h-4 w-4 inline mr-1"/> Тикеты
        </button>
        <button 
          className={`px-4 py-2 text-sm font-medium transition-colors ${mode === 'kb' ? 'text-green-600 border-b-2 border-green-600' : 'text-gray-500 hover:text-gray-700 dark:text-gray-400'}`}
          onClick={() => setMode('kb')}
        >
          <MenuBook className="h-4 w-4 inline mr-1"/> База знаний
        </button>
        <button 
          className={`px-4 py-2 text-sm font-medium transition-colors ${mode === 'chatbot' ? 'text-green-600 border-b-2 border-green-600' : 'text-gray-500 hover:text-gray-700 dark:text-gray-400'}`}
          onClick={() => setMode('chatbot')}
        >
          <SmartToy className="h-4 w-4 inline mr-1"/> Чат-помощник
        </button>
      </div>

      {/* TICKETS MODE */}
      {mode === "tickets" && (
        <div className="card mb-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold">Список обращений</h3>
            <div className="flex gap-2">
              <Badge variant="outline" className="cursor-pointer hover:bg-gray-100">Открытые ({tickets.filter(t => t.status === 'open').length})</Badge>
              <Badge variant="secondary" className="cursor-pointer hover:bg-gray-100">В работе ({tickets.filter(t => t.status === 'in_progress').length})</Badge>
            </div>
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
                             <Button size="sm" variant="outline" className="h-7 px-2" onClick={() => setSelectedTicket(ticket.id)}>
                               <MessageSquare className="h-3 w-3"/> Ответ
                             </Button>
                           )}
                           {ticket.status === 'open' && (
                              <Button size="sm" variant="outline" className="h-7 px-2" onClick={() => handleTicketStatus(ticket.id, 'in_progress')}>
                                В работу
                              </Button>
                           )}
                        </div>
                     </TableCell>
                   </TableRow>
                 ))}
               </TableBody>
             </Table>
          </div>
        </div>
      )}

      {/* KB MODE */}
      {mode === "kb" && (
        <div className="card">
          <h3 className="section-title"><MenuBook className="h-4 w-4 mr-1"/> База знаний</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             <div className="action-btn" onClick={() => alert("Статья: Смена аккаунта")}>
               <div className="action-icon">👤</div>
               <span className="action-label">Как сменить аккаунт?</span>
             </div>
             <div className="action-btn" onClick={() => alert("Статья: Премиум")}>
               <div className="action-icon">⭐</div>
               <span className="action-label">Как продлить премиум?</span>
             </div>
             <div className="action-btn" onClick={() => alert("Статья: Оплата")}>
               <div className="action-icon">💳</div>
               <span className="action-label">Способы оплаты</span>
             </div>
             <div className="action-btn" onClick={() => alert("Статья: Безопасность")}>
               <div className="action-icon">🛡️</div>
               <span className="action-label">2FA и безопасность</span>
             </div>
          </div>
        </div>
      )}

      {/* CHATBOT MODE */}
      {mode === "chatbot" && (
        <div className="card">
          <h3 className="section-title"><SmartToy className="h-4 w-4 mr-1"/> Чат-помощник</h3>
          <div className="h-[300px] overflow-y-auto border border-gray-200 dark:border-gray-700 rounded-lg p-4 mb-4 bg-gray-50 dark:bg-gray-800/50">
            {chatMessages.map((msg, idx) => (
              <div key={idx} className={`mb-3 p-3 rounded-lg max-w-[80%] ${
                msg.role === 'bot' 
                  ? 'bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-gray-700 self-start' 
                  : 'bg-green-600 text-white ml-auto self-end'
              }`}>
                {msg.text}
              </div>
            ))}
          </div>
          <div className="flex gap-2">
            <Input 
              placeholder="Напишите вопрос..." 
              value={chatInput} 
              onChange={e => setChatInput(e.target.value)} 
              onKeyDown={e => e.key === 'Enter' && handleChatSend()}
            />
            <Button onClick={handleChatSend}>Отправить</Button>
          </div>
        </div>
      )}

      {/* REPLY MODAL */}
      {selectedTicket && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
           <div className="bg-card rounded-lg p-6 w-full max-w-lg shadow-xl border">
             <div className="flex justify-between items-center mb-4">
               <h3 className="text-lg font-bold">Ответ на тикет #{selectedTicket}</h3>
               <button onClick={() => setSelectedTicket(null)} className="text-muted-foreground hover:text-foreground">✕</button>
             </div>
             
             <div className="mb-4 p-3 bg-muted/50 rounded text-sm">
               <div className="font-bold mb-1">{tickets.find(t => t.id === selectedTicket)?.subject}</div>
               <div className="text-muted-foreground">{tickets.find(t => t.id === selectedTicket)?.message}</div>
             </div>

             <Textarea 
               placeholder="Введите ответ..." 
               rows={4} 
               value={replyText}
               onChange={(e) => setReplyText(e.target.value)}
               className="mb-4"
             />
             <div className="flex gap-2 justify-end">
               <Button variant="outline" onClick={() => setSelectedTicket(null)}>Отмена</Button>
               <Button onClick={handleReply}>Отправить</Button>
             </div>
           </div>
        </div>
      )}
    </div>
  );
}