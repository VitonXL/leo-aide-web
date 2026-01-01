"use client";

import { useState } from "react";
import { MessageSquare, Send, HelpCircle, Search, CheckCircle, FileText, Users, CreditCard, Zap, ChevronDown, ChevronUp, ExternalLink } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// --- FAQ DATA ---
const FAQ_CATEGORIES = [
  { id: "account", label: "Аккаунт", icon: Users, color: "text-blue-600" },
  { id: "finance", label: "Финансы", icon: CreditCard, color: "text-green-600" },
  { id: "premium", label: "Премиум", icon: Zap, color: "text-yellow-600" },
];

const FAQ_ITEMS = [
  {
    id: 1,
    category: "account",
    question: "Как сменить пароль?",
    answer: "В данный момент вход осуществляется через Telegram. Мы не храним пароли. Если вы хотите сменить аккаунт, просто выйдите и войдите под другим номером."
  },
  {
    id: 2,
    category: "account",
    question: "Как удалить свой аккаунт?",
    answer: "Перейдите в раздел 'Профиль' -> 'Опасная зона' -> 'Удалить аккаунт'. Это действие необратимо."
  },
  {
    id: 3,
    category: "finance",
    question: "Как добавить операцию в бюджет?",
    answer: "На странице 'Финансы' выберите вкладку 'Обзор', укажите сумму (доход или расход), категорию и нажмите '+'."
  },
  {
    id: 4,
    category: "finance",
    question: "Можно ли экспортировать историю?",
    answer: "Да. В личном кабинете ('Информация об аккаунте') или на странице 'Финансы' есть кнопка 'Экспорт' для скачивания данных в CSV."
  },
  {
    id: 5,
    category: "premium",
    question: "Как оплатить Premium?",
    answer: "Перейдите на страницу 'Премиум'. Мы принимаем банковские карты (FreeKassa), а также криптовалюту. Доступ открывается мгновенно после оплаты."
  },
  {
    id: 6,
    category: "premium",
    question: "В чем преимущества Premium?",
    answer: "Premium дает доступ к GigaChat, Фильмам, Антивирусу, расширенному отслеживанию погоды (5 городов) и безлимитным курсам валют."
  },
];

// --- GUIDES DATA ---
const GUIDES = [
  { 
    id: 1, 
    title: "Как настроить семейный бюджет?", 
    desc: "Подробная инструкция по совместному управлению финансами.", 
    category: "Финансы",
    icon: Users,
    color: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
  },
  { 
    id: 2, 
    title: "Активация Премиум", 
    desc: "Пошаговый гайд по выбору тарифа и оплате.", 
    category: "Аккаунт",
    icon: Zap,
    color: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"
  },
  { 
    id: 3, 
    title: "Использование реферальной системы", 
    desc: "Как получить бесплатный Premium за друзей.", 
    category: "Бонусы",
    icon: Gift,
    color: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400"
  },
];

export default function SupportPage() {
  const [faqSearch, setFaqSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [openFaqId, setOpenFaqId] = useState<number | null>(null);
  const [ticketData, setTicketData] = useState({ subject: "", message: "" });
  const [isSent, setIsSent] = useState(false);

  // FAQ Logic
  const filteredFaq = FAQ_ITEMS.filter(item => {
    const matchesSearch = item.question.toLowerCase().includes(faqSearch.toLowerCase()) || 
                          item.answer.toLowerCase().includes(faqSearch.toLowerCase());
    const matchesCategory = selectedCategory ? item.category === selectedCategory : true;
    return matchesSearch && matchesCategory;
  });

  const toggleFaq = (id: number) => {
    setOpenFaqId(openFaqId === id ? null : id);
  };

  // Ticket Logic
  const handleTicketSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSent(true);
    setTimeout(() => setIsSent(false), 3000);
    setTicketData({ subject: "", message: "" });
  };

  return (
    <div className="fade-in main-content">
      <div className="mb-8 text-center">
        <div className="inline-flex items-center justify-center p-3 bg-blue-100 dark:bg-blue-900/30 rounded-full mb-4">
          <HelpCircle className="h-8 w-8 text-blue-600 dark:text-blue-400" />
        </div>
        <h1 className="text-3xl font-bold mb-2">Центр поддержки</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Найдите ответ на свой вопрос, изучите инструкции или свяжитесь с нами напрямую.
        </p>
      </div>

      <Tabs defaultValue="faq" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3 h-12">
          <TabsTrigger value="faq" className="gap-2"><FileText size={18}/> FAQ</TabsTrigger>
          <TabsTrigger value="guides" className="gap-2"><ExternalLink size={18}/> Гайды</TabsTrigger>
          <TabsTrigger value="contact" className="gap-2"><MessageSquare size={18}/> Связь</TabsTrigger>
        </TabsList>

        {/* --- FAQ TAB --- */}
        <TabsContent value="faq" className="space-y-6">
          
          {/* Search & Filters */}
          <div className="card bg-muted/30 border-dashed">
            <div className="relative mb-4">
               <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
               <Input 
                 placeholder="Поиск по вопросам..." 
                 className="pl-9 h-10"
                 value={faqSearch}
                 onChange={(e) => setFaqSearch(e.target.value)}
               />
            </div>
            <div className="flex flex-wrap gap-2">
               <button 
                 onClick={() => setSelectedCategory(null)}
                 className={`px-3 py-1.5 rounded-full text-xs font-bold transition-colors ${!selectedCategory ? 'bg-primary text-white' : 'bg-secondary hover:bg-secondary/80'}`}
               >
                 Все
               </button>
               {FAQ_CATEGORIES.map(cat => (
                 <button
                   key={cat.id}
                   onClick={() => setSelectedCategory(cat.id)}
                   className={`px-3 py-1.5 rounded-full text-xs font-bold transition-colors ${selectedCategory === cat.id ? 'bg-primary text-white' : 'bg-secondary hover:bg-secondary/80'}`}
                 >
                   {cat.label}
                 </button>
               ))}
            </div>
          </div>

          {/* FAQ List */}
          <div className="space-y-3">
            {filteredFaq.length > 0 ? (
              filteredFaq.map(item => {
                const catDef = FAQ_CATEGORIES.find(c => c.id === item.category);
                return (
                  <div key={item.id} className="card overflow-hidden">
                    <button 
                      onClick={() => toggleFaq(item.id)}
                      className="w-full flex items-center justify-between p-4 text-left hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${catDef?.color} bg-opacity-10`}>
                          {catDef && <catDef.icon size={20} className={catDef.color} />}
                        </div>
                        <span className="font-medium">{item.question}</span>
                      </div>
                      {openFaqId === item.id ? <ChevronUp className="text-muted-foreground"/> : <ChevronDown className="text-muted-foreground"/>}
                    </button>
                    {openFaqId === item.id && (
                      <div className="p-4 pt-0 text-sm text-muted-foreground leading-relaxed border-t">
                        {item.answer}
                      </div>
                    )}
                  </div>
                )
              })
            ) : (
              <div className="text-center py-12 text-muted-foreground border-2 border-dashed rounded-lg">
                Ничего не найдено. Попробуйте изменить запрос.
              </div>
            )}
          </div>
        </TabsContent>

        {/* --- GUIDES TAB --- */}
        <TabsContent value="guides">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {GUIDES.map(guide => (
              <Card key={guide.id} className="hover:shadow-lg transition-shadow cursor-pointer group">
                <CardHeader>
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-4 ${guide.color}`}>
                    <guide.icon size={24} />
                  </div>
                  <Badge variant="outline" className="w-fit mb-2 text-xs">{guide.category}</Badge>
                  <CardTitle className="text-base">{guide.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4 h-10">{guide.desc}</p>
                  <Button variant="outline" className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                    Читать
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* --- CONTACT TAB --- */}
        <TabsContent value="contact">
          <div className="max-w-2xl mx-auto">
            <Card>
              <CardHeader>
                <CardTitle>Новое обращение</CardTitle>
                <div className="text-sm text-muted-foreground">
                  Обычно мы отвечаем в течение 24 часов. Для Premium — приоритетная поддержка.
                </div>
              </CardHeader>
              <CardContent>
                {isSent ? (
                  <div className="flex flex-col items-center justify-center py-10 text-center animate-in fade-in">
                    <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-full flex items-center justify-center mb-4">
                      <CheckCircle size={32} />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">Отправлено!</h3>
                    <p className="text-muted-foreground">Мы скоро свяжемся с вами по результатам проверки тикета.</p>
                    <Button onClick={() => setIsSent(false)} variant="outline" className="mt-6">Создать еще</Button>
                  </div>
                ) : (
                  <form onSubmit={handleTicketSubmit} className="space-y-4">
                    <div>
                      <label className="text-sm font-medium mb-1 block">Тема обращения</label>
                      <Input 
                        placeholder="Например: Ошибка при оплате" 
                        value={ticketData.subject}
                        onChange={(e) => setTicketData({...ticketData, subject: e.target.value})}
                        required
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-1 block">Описание проблемы</label>
                      <Textarea 
                        placeholder="Опишите подробно, что произошло..." 
                        rows={6}
                        value={ticketData.message}
                        onChange={(e) => setTicketData({...ticketData, message: e.target.value})}
                        required
                      />
                    </div>
                    <div className="p-4 bg-blue-50 dark:bg-blue-900/10 rounded-lg border border-blue-100 dark:border-blue-800">
                      <div className="text-sm text-blue-800 dark:text-blue-200">
                        <strong>💡 Совет:</strong> Если проблема связана с финансами, приложите скриншот из раздела 'Финансы'.
                      </div>
                    </div>
                    <Button type="submit" className="w-full" size="lg">
                      <Send className="mr-2 h-4 w-4" /> Отправить в техподдержку
                    </Button>
                  </form>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}