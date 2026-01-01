
```typescript
"use client";

import { useState } from "react";
import { User, Calendar as CalendarIcon, Award, Settings, Copy, Check, Mic, FileText, BarChart3, Download, Bell, ShoppingCart, Crown, Sparkles, Zap, TrendingUp, Wallet, RefreshCw } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useUser } from "@/contexts/UserContext"; // Используем user для проверки баланса

// Mock User Data
const user = {
  name: "Алексей",
  email: "alex@example.com"
};

const notes = [
  { id: 1, text: "Купить продукты к обеду", date: "Сегодня" },
  { id: 2, text: "Оплатить хостинг", date: "Завтра" },
];

// --- ПАКЕТЫ КОИНОВ ---
const COIN_PACKAGES = [
  { id: 1, name: "Стартовый пакет", coins: 100, price: 99, rub: "99 ₽", icon: "💎" },
  { id: 2, name: "Средний пакет", coins: 550, price: 490, rub: "490 ₽", icon: "💎💎", best: true },
  { id: 3, name: "Большой пакет", coins: 1200, price: 990, rub: "990 ₽", icon: "💎💎💎" },
];

export default function CabinetPage() {
  const { user: contextUser } = useUser(); // Получаем баланс из контекста
  const [date, setDate] = useState<Date | undefined>(new Date());

  const usageStats = [
    { name: "GigaChat", value: 85, max: 100, color: "bg-blue-500" },
    { name: "Фильмы", value: 2, max: 10, color: "bg-purple-500" },
    { name: "Антивирус", value: 1, max: 50, color: "bg-green-500" },
  ];

  // Логика покупки монет
  const handleBuyCoins = async (pack: typeof COIN_PACKAGES[0]) => {
    try {
      // 1. Формируем заказ для оплаты монет
      const orderId = `coins_${pack.id}_${contextUser.referralCode}_${Date.now()}`;
      
      // 2. Запрос к существующему API оплаты
      const response = await fetch('/api/payment/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: pack.price,
          orderId: orderId,
          email: user.email,
          description: `Покупка ${pack.coins} Coins`
        }),
      });

      const data = await response.json();

      // 3. Перенаправляем на платежный шлюз
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert("Ошибка создания платежа");
      }
    } catch (error) {
      console.error("Payment error", error);
      alert("Ошибка соединения");
    }
  };

  return (
    <div className="container py-8 max-w-6xl main-content">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* Sidebar - Profile Card */}
        <div className="space-y-6">
          <Card className="bg-gradient-to-br from-green-50 to-white dark:from-green-900/20 dark:to-gray-900">
            <CardHeader>
              <div className="flex items-center gap-4">
                <div className="h-16 w-16 rounded-full bg-green-100 flex items-center justify-center text-2xl relative">
                  {contextUser.balance.toString().charAt(0)}
                  {contextUser.isPremium && <div className="absolute -top-2 -right-2 bg-yellow-400 text-white rounded-full p-1"><Crown size={10} fill="white"/></div>}
                </div>
                <div>
                  <CardTitle className="text-xl">Leo User</CardTitle>
                  <Badge variant={contextUser.isPremium ? "default" : "outline"} className="mt-1">
                    {contextUser.isPremium ? 'Premium' : 'Free'}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Баланс</span>
                  <span className="font-bold flex items-center gap-1">
                    <Zap size={14} className="text-yellow-500"/> {contextUser.balance}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Рефералов</span>
                  <span className="font-bold">{contextUser.referralCount}</span>
                </div>
              </div>
              <Button className="w-full mt-4" variant="outline" size="sm">
                <Copy className="mr-2 h-3 w-3"/> Реферальная ссылка
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle className="text-sm">Быстрые действия</CardTitle></CardHeader>
            <CardContent className="space-y-2">
              <Button variant="ghost" className="w-full justify-start text-sm"><Award className="mr-2 h-4 w-4"/> Получить Coins</Button>
              <Button variant="ghost" className="w-full justify-start text-sm"><Settings className="mr-2 h-4 w-4"/> Настройки</Button>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Area */}
        <div className="lg:col-span-3 space-y-6">
          
          {/* WebApp 2.0 Features */}
          <Tabs defaultValue="coins" className="w-full">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="coins" className="gap-2"><Wallet className="text-yellow-500" /> Покупка Coins</TabsTrigger>
              <TabsTrigger value="calendar">Календарь</TabsTrigger>
              <TabsTrigger value="notes">Заметки</TabsTrigger>
              <TabsTrigger value="stats">Статистика</TabsTrigger>
              <TabsTrigger value="tools">Инструменты</TabsTrigger>
            </TabsList>

            {/* COINS TAB (НОВОЕ) */}
            <TabsContent value="coins">
              <div className="grid md:grid-cols-3 gap-6">
                <div className="md:col-span-2">
                   <Card>
                     <CardHeader>
                       <CardTitle className="flex items-center gap-2 text-xl"><Wallet className="text-primary" /> Пополнение баланса</CardTitle>
                       <CardDescription>Купите Coins и используйте их для Премиума и улучшений</CardDescription>
                     </CardHeader>
                     <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                           {COIN_PACKAGES.map((pack) => {
                             const isAffordable = contextUser.balance >= pack.price;
                             return (
                               <Card key={pack.id} className={`flex flex-col h-full justify-between hover:shadow-md transition-all border-2 ${pack.best ? 'border-yellow-500 ring-1 ring-yellow-500/20' : ''}`}>
                                 <CardContent className="pt-6 text-center">
                                   <div className="text-4xl font-extrabold text-yellow-600 dark:text-yellow-400 mb-2 flex items-center justify-center gap-2">
                                     <span>{pack.coins}</span>
                                     <div className="text-sm bg-yellow-100 dark:bg-yellow-900/30 px-2 py-1 rounded-md text-yellow-800 dark:text-yellow-300 font-bold">
                                       Coins
                                     </div>
                                   </div>
                                   <h3 className="font-bold text-lg mb-1">{pack.name}</h3>
                                   <div className="text-xl font-bold text-gray-700 dark:text-gray-300">{pack.rub}</div>
                                 </CardContent>
                                 <div className="p-4 border-t bg-muted/30">
                                   <Button 
                                     onClick={() => handleBuyCoins(pack)}
                                     className="w-full btn-primary"
                                     size="sm"
                                   >
                                     Купити
                                   </Button>
                                 </div>
                               </Card>
                             );
                           })}
                        </div>
                     </CardContent>
                   </Card>
                </div>

                <div className="space-y-6">
                   {/* Карта текущего баланса */}
                   <Card className="bg-gradient-to-br from-primary/10 to-blue-500/10 border-primary/20">
                      <CardContent className="pt-6">
                         <div className="text-center">
                            <div className="text-4xl font-extrabold text-primary mb-2">{contextUser.balance}</div>
                            <div className="text-sm text-muted-foreground font-medium">Ваш текущий баланс</div>
                         </div>
                      </CardContent>
                   </Card>

                   {/* Реклама обмена */}
                   <Card>
                      <CardContent className="pt-6">
                         <h3 className="font-bold text-lg mb-4 text-center">Курс обмена</h3>
                         <div className="space-y-3">
                            <div className="flex justify-between items-center p-3 bg-muted/30 rounded-lg">
                               <span className="text-sm font-medium">1 Премиум (30 дн)</span>
                               <span className="font-bold text-primary">2000 Coins</span>
                            </div>
                            <div className="flex justify-between items-center p-3 bg-muted/30 rounded-lg">
                               <span className="text-sm font-medium">1 Премиум (365 дн)</span>
                               <span className="font-bold text-primary">6000 Coins</span>
                            </div>
                         </div>
                         <Button asChild className="w-full mt-4">
                            <a href="/premium" className="flex justify-center items-center w-full">
                               <TrendingUp className="mr-2 h-4 w-4" /> В магазин премиум
                            </a>
                         </Button>
                      </CardContent>
                   </Card>
                </div>
              </div>
            </TabsContent>

            {/* Calendar Tab */}
            <TabsContent value="calendar">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2"><CalendarIcon className="h-5 w-5"/> Мой Календарь</CardTitle>
                  <CardDescription>Планирование задач и напоминаний</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col md:flex-row gap-6">
                    <div className="md:w-1/2">
                      <Calendar mode="single" selected={date} onSelect={setDate} className="rounded-md border" />
                    </div>
                    <div className="md:w-1/2 space-y-4">
                      <h3 className="font-semibold">Задачи на {date?.toLocaleDateString()}</h3>
                      <div className="space-y-2">
                        <div className="p-3 border rounded-lg bg-green-50 dark:bg-green-900/10 border-green-200">
                          <div className="flex items-center gap-2 text-green-700 dark:text-green-400 text-sm font-bold mb-1"><Bell className="h-3 w-3"/> 14:00 - Звонок</div>
                          <p className="text-sm text-muted-foreground">Созвон с командой разработки</p>
                        </div>
                        <div className="p-3 border rounded-lg">
                          <div className="flex items-center gap-2 text-blue-700 dark:text-blue-400 text-sm font-bold mb-1">16:30 - Спорт</div>
                          <p className="text-sm text-muted-foreground">Тренировка в зале</p>
                        </div>
                      </div>
                      <Button className="w-full" size="sm">+ Добавить событие</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Notes Tab */}
            <TabsContent value="notes">
              <Card>
                <CardHeader><CardTitle className="flex items-center gap-2"><FileText className="h-5 w-5"/> Расширенные заметки</CardTitle></CardHeader>
                <CardContent>
                  <div className="flex gap-2 mb-4">
                    <Input placeholder="Новая заметка..." />
                    <Button>Добавить</Button>
                  </div>
                  <div className="grid gap-3">
                    {notes.map(note => (
                      <div key={note.id} className="p-4 border rounded-lg hover:shadow-md transition-shadow">
                        <div className="flex justify-between items-start mb-2">
                          <p className="font-medium">{note.text}</p>
                          <Badge variant="secondary" className="text-xs">{note.date}</Badge>
                        </div>
                        <div className="flex gap-2 mt-2">
                          <Button size="sm" variant="ghost" className="h-8 px-2"><Download className="h-3 w-3"/> Экспорт</Button>
                          <Button size="sm" variant="ghost" className="h-8 px-2 text-red-500">Удалить</Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Stats Tab */}
            <TabsContent value="stats">
              <Card>
                <CardHeader><CardTitle className="flex items-center gap-2"><BarChart3 className="h-5 w-5"/> Использование Premium</CardTitle></CardHeader>
                <CardContent className="space-y-6">
                  {usageStats.map((stat) => (
                    <div key={stat.name}>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="font-medium">{stat.name}</span>
                        <span className="text-muted-foreground">{stat.value} / {stat.max}</span>
                      </div>
                      <div className="h-3 w-full bg-secondary rounded-full overflow-hidden">
                        <div 
                          className={`h-full ${stat.color}`} 
                          style={{ width: `${(stat.value / stat.max) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                  <div className="pt-4 border-t">
                    <Button className="w-full" variant="outline">
                      <Download className="mr-2 h-4 w-4"/> Скачать отчет (PDF/CSV)
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Tools Tab */}
            <TabsContent value="tools">
              <div className="grid md:grid-cols-2 gap-4">
                <Card className="flex flex-col items-center justify-center p-8 text-center hover:border-green-500 transition-colors cursor-pointer">
                  <div className="h-12 w-12 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mb-4">
                    <Mic className="h-6 w-6 text-green-600 dark:text-green-400" />
                  </div>
                  <CardTitle className="text-lg mb-2">Голосовой ввод</CardTitle>
                  <CardDescription className="text-sm">Диктуйте текст для GigaChat</CardDescription>
                  <Badge className="mt-4">Premium</Badge>
                </Card>
                <Card className="flex flex-col items-center justify-center p-8 text-center hover:border-blue-500 transition-colors cursor-pointer">
                  <div className="h-12 w-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mb-4">
                    <FileText className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <CardTitle className="text-lg mb-2">Умные напоминания</CardTitle>
                  <CardDescription className="text-sm">Авто-уведомления о задачах</CardDescription>
                  <Badge className="mt-4">Premium</Badge>
                </Card>
              </div>
             </TabsContent>

          </Tabs>
        </div>
      </div>
    </div>
  );
}
```

### 2. Обновляем страницу Premium (Цены в монетах)
Теперь цены тарифов указаны в монетах, а основной способ оплаты — через Кабинет (Монеты).

<Edit filename="src/app/premium/page.tsx">
```typescript
"use client";

import { Check, Crown, Zap, Shield, Star, HelpCircle, Loader2, RefreshCw, Wallet, ArrowRight, AlertTriangle } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

// Mock User Data (берем из ProfilePage для примера)
const MOCK_USER_EMAIL = "alex@example.com"; 
const MOCK_USER_ID = "12459384";

// ТАРИФЫ С ЦЕНАМИ В МОНЕТАХ
const plans = [
  {
    name: "Старт",
    duration: "30 дней",
    coinPrice: 200, // В монетах!
    rubPrice: 99,
    oldPrice: null,
    features: ["Доступ к GigaChat", "Погода в 5 городах", "Без рекламы"],
    popular: false,
  },
  {
    name: "Стандарт",
    duration: "90 дней",
    coinPrice: 550,
    rubPrice: 249,
    oldPrice: 299,
    features: ["Всё из Старт", "Приоритетная поддержка", "Расширенные заметки"],
    popular: false,
  },
  {
    name: "Максимум",
    duration: "365 дней",
    coinPrice: 1200,
    rubPrice: 699,
    oldPrice: 999,
    features: ["Всё из Стандарт", "Антивирус VirusTotal", "Подбор фильмов", "Кастомные игры"],
    popular: true,
  },
];

export default function PremiumPage() {
  const { user, spendCoins, setPremium } = useUser(); // Импортируем хуки из UserContext
  const [loadingPlanId, setLoadingPlanId] = useState<string | null>(null);

  const handleBuyWithCoins = (coinPrice: number, planName: string) => {
    if (user.balance < coinPrice) {
      alert(`Недостаточно Coins! У вас ${user.balance}, а нужно ${coinPrice}.`);
      return;
    }
    
    if (!confirm(`Купить "${planName}" за ${coinPrice} Coins?`)) return;

    setLoadingPlanId(planName);
    
    // Симуляция задержки для UX
    setTimeout(() => {
      spendCoins(coinPrice, `Покупка: ${planName}`);
      setPremium(true, planName === 'Старт' ? 30 : planName === 'Стандарт' ? 90 : 365);
      setLoadingPlanId(null);
      alert("Поздравляем с покупкой Premium!");
    }, 500);
  };

  const handleBuyWithRubles = (price: number, planName: string) => {
    // Если пользователь всё же хочет купить за рубли (опционально)
    window.location.href = "/cabinet?tab=coins"; // Отправляем в магазин монет
  };

  return (
    <div className="container py-8 max-w-5xl main-content">
      <div className="text-center mb-10 fade-in">
        <div className="inline-flex items-center justify-center p-3 bg-green-500/10 rounded-full mb-4">
          <Crown className="h-8 w-8 text-green-600 dark:text-green-400" />
        </div>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Разблокируйте весь потенциал бота. GigaChat, Фильмы, Антивирус и многое другое без ограничений.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {plans.map((plan, index) => (
          <div key={index} className={`card relative flex flex-col ${plan.popular ? 'border-green-500 border-2 shadow-lg' : ''}`}>
            {plan.popular && (
              <div className="absolute -top-[1.5rem] left-1/2 -translate-x-1/2 bg-green-600 text-white px-4 py-1 rounded-full text-xs font-bold shadow-md z-10">
                Популярный
              </div>
            )}
            <div className="text-center mb-6 pt-4">
              <h3 className="text-2xl font-bold mb-2">{plan.coinPrice}</h3>
              <p className="text-sm text-muted-foreground">Coins</p>
              {plan.oldPrice && (
                <div className="text-sm text-muted-foreground line-through mt-1">{plan.coinPrice + 100} Coins</div>
              )}
            </div>

            <div className="flex-1 flex-col items-center justify-center px-6 pb-6 border-t">
              <ul className="space-y-3 text-left w-full">
                {plan.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-sm">
                    <Check className="h-4 w-4 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700 dark:text-gray-300">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-4 border-t bg-muted/30 mt-auto">
              {/* Кнопка покупки за монеты (Основная) */}
              <Button 
                onClick={() => handleBuyWithCoins(plan.coinPrice, plan.name)}
                disabled={loadingPlanId === plan.name}
                className="w-full btn-primary"
                size="lg"
              >
                {loadingPlanId === plan.name ? (
                  <Loader2 className="h-5 w-5 mr-2 animate-spin" /> 
                ) : (
                  <>
                    <Wallet className="h-5 w-5 mr-2" /> 
                    {user.balance >= plan.coinPrice ? "Купить" : "Не хватает"}
                  </>
                )}
              </Button>

              {/* Кнопка покупки за рубли (Второстепенная/Ссылка) */}
              <Button 
                onClick={() => handleBuyWithRubles(plan.rubPrice, plan.name)}
                className="w-full mt-2"
                variant="outline"
                size="sm"
              >
                Или купить {plan.coinPrice} Coins за {plan.rubPrice}₽
              </Button>
              
              {user.balance < plan.coinPrice && (
                 <div className="text-center mt-2">
                    <Link href="/cabinet?tab=coins" className="text-xs text-blue-600 dark:text-blue-400 hover:underline font-medium">
                      <RefreshCw className="inline w-3 h-3 mr-1" /> Пополнить баланс
                    </Link>
                 </div>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-6 mt-10 fade-in">
        <div className="card">
          <h3 className="section-title flex items-center gap-2"><Zap className="text-yellow-500" /> Возможности</h3>
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-green-600 dark:text-green-400">
                <Shield className="h-5 w-5" />
              </div>
              <div>
                <div className="font-semibold">Антивирус</div>
                <div className="text-sm text-muted-foreground">Проверка файлов и ссылок</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center text-purple-600 dark:text-purple-400">
                <Star className="h-5 w-5" />
              </div>
              <div>
                <div className="font-semibold">Подбор фильмов</div>
                <div className="text-sm text-muted-foreground">Kinopoisk API (до 10 запросов)</div>
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <h3 className="section-title"><Crown className="h-5 w-5" /> Оплата</h3>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Мы используем внутреннюю валюту (Coins) для покупок. Вы можете купить Coins за рубли в личном кабинете.
            </p>
            <div className="flex gap-2">
               <span className="btn-sm" style={{background: "#e8f5e9", color: "#2e7d32", border: "1px solid #c8e6c9"}}>FreeKassa</span>
            </div>
            <div className="p-4 bg-muted/30 rounded-lg text-sm text-muted-foreground">
              <p className="mb-2 font-medium">Нужна помощь?</p>
              <p>Если возникли проблемы с оплатой Coins, создайте тикет.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
```

Готово! Теперь мы внедрили полноценную экономику **Coins**.

**Что изменилось:**
1.  **Поток пользователя:** Пользователь заходит в `cabinet` -> вкладка "Покупка Coins" -> Покупает пакеты монет (через API).
2.  **Покупка Premium:** На странице `premium` цены теперь указаны в Coins. При нажатии "Купить" списываются монеты и активируется подписка.
3.  **Воронка:** Если монет не хватает, на странице Premium появляется ссылка "Пополнить баланс", ведущая в магазин.

Теперь система полностью завязана на внутреннюю валюту.