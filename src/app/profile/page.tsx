"use client";

import { useState } from "react";
import { User, Bell, Palette, Star, History, Shield, Trash2, Clock, BarChart3, Zap, Target, TrendingUp, Award, ChevronRight, PieChart as PieChartIcon, List, Crown, Sparkles, Settings, ShieldAlert, Check } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// --- RECHARTS ---
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend } from "recharts";

// --- MOCK USER DATA ---
const TG_USER = {
  id: "12459384",
  first_name: "Алексей",
  username: "@alexey_iv",
  language_code: "ru",
  balance: 150,
  joinDate: "10 Окт 2023"
};

// --- MOCK STATISTICS ---
const ACTIVITY_DATA = [
  { day: "Пн", hours: 2.5 },
  { day: "Вт", hours: 1.8 },
  { day: "Ср", hours: 3.2 },
  { day: "Чт", hours: 0.5 },
  { day: "Пт", hours: 4.0 },
  { day: "Сб", hours: 1.2 },
  { day: "Вс", hours: 0.8 },
];

const TOTAL_HOURS = ACTIVITY_DATA.reduce((acc, curr) => acc + curr.hours, 0).toFixed(1);

const MOST_USED_FUNCS = [
  { name: "Финансы", count: 145, color: "#4CAF50", icon: "💰" },
  { name: "Погода", count: 89, color: "#2196F3", icon: "🌦" },
  { name: "Курсы валют", count: 64, color: "#FF9800", icon: "💵" },
  { name: "GigaChat", count: 42, color: "#9C27B0", icon: "🤖" },
  { name: "Напоминания", count: 31, color: "#F44336", icon: "🔔" },
];

const RECOMMENDATIONS = [
  { 
    title: "Попробуйте Про-бюджет", 
    desc: "Вы часто пользуетесь финансами. Про-бюджет поможет планировать на месяц вперед.", 
    icon: <TrendingUp className="text-green-500" />, 
    action: "Открыть",
    href: "/finance"
  },
  { 
    title: "Добавьте 5 городов", 
    desc: "Вы проверяете погоду каждый день. Добавьте еще города в Premium.", 
    icon: <Zap className="text-yellow-500" />, 
    action: "Premium",
    href: "/premium"
  },
  { 
    title: "Настройте уведомления", 
    desc: "Вы пропустили 2 важных напоминания на этой неделе. Включите пуш.", 
    icon: <Bell className="text-blue-500" />, 
    action: "Включить",
    href: "/settings"
  },
];

export default function ProfilePage() {
  // --- VIEW MODE STATE ---
  const [viewMode, setViewMode] = useState<'chart' | 'list'>('chart');

  // --- MOCK ROLE STATE (Для демонстрации корон) ---
  // Поменяйте 'admin' на 'mod' или 'user' чтобы проверить разные короны
  const [userRole, setUserRole] = useState<'user' | 'mod' | 'admin'>('admin');
  const [isPremium, setIsPremium] = useState(true);

  const [settings, setSettings] = useState({
    theme: "system", 
    notifications: true,
    emailNotifications: false,
    language: "ru",
  });
  
  const [isEmailEditable, setIsEmailEditable] = useState(false);

  // --- КОМПОНЕНТ КОРОНЫ ---
  const renderCrown = () => {
    if (userRole === 'admin') {
      return (
        <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 flex flex-col items-center z-10 drop-shadow-xl animate-bounce-slow">
          {/* Золотая корона */}
          <div className="relative">
            <Crown className="h-10 w-10 text-yellow-500 fill-yellow-500 stroke-yellow-600" />
            {/* Драгоценные камни (алмазы/изумруды) */}
            <div className="absolute -top-1 -left-1">
               <Sparkles className="h-4 w-4 text-cyan-400 fill-white drop-shadow-sm" />
            </div>
            <div className="absolute -top-2 left-1/2 transform -translate-x-1/2">
               <Sparkles className="h-3 w-3 text-blue-400 fill-white drop-shadow-sm" />
            </div>
            <div className="absolute -top-1 -right-1">
               <Sparkles className="h-4 w-4 text-purple-400 fill-white drop-shadow-sm" />
            </div>
          </div>
        </div>
      );
    }
    
    if (userRole === 'mod') {
      return (
        <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 z-10 drop-shadow-lg">
          <Crown className="h-7 w-7 text-yellow-500 fill-yellow-500 stroke-yellow-600" />
        </div>
      );
    }
    
    if (isPremium) {
      return (
        <div className="absolute -top-5 left-1/2 transform -translate-x-1/2 z-10 drop-shadow-md">
          <Crown className="h-6 w-6 text-slate-400 fill-slate-300 stroke-slate-500" />
        </div>
      );
    }

    return null;
  };

  return (
    <div className="fade-in main-content">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div className="flex items-center gap-4">
          <div className="relative pt-4"> {/* pt-4 чтобы место под корону было пустым */}
            {renderCrown()}
            <div className="h-20 w-20 rounded-2xl bg-gradient-to-br from-blue-400 to-green-500 flex items-center justify-center text-white font-bold text-3xl shadow-lg border-2 border-white dark:border-gray-700">
              {TG_USER.first_name.charAt(0)}
            </div>
            {/* Индикатор онлайн/верификации */}
            <div className="absolute bottom-1 right-1 bg-white dark:bg-gray-800 rounded-full p-1 shadow-sm border dark:border-gray-700 z-10">
              <div className="bg-green-100 text-green-700 rounded-full p-1">
                 <Check size={12} />
              </div>
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{TG_USER.first_name}</h1>
              {/* Бейдж роли для удобства */}
              {userRole === 'admin' && <Badge className="bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800"><Crown size={12} className="mr-1"/> Admin</Badge>}
              {userRole === 'mod' && <Badge className="bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800"><Shield size={12} className="mr-1"/> Mod</Badge>}
            </div>
            <div className="flex items-center gap-2 text-muted-foreground mt-1">
              <span className="text-sm">{TG_USER.username}</span>
              <span className="w-1 h-1 rounded-full bg-gray-300 dark:bg-gray-600"></span>
              <span className="text-xs">ID: {TG_USER.id}</span>
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">С нами с: {TG_USER.joinDate}</div>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <Card className="bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 border-yellow-200 dark:border-yellow-800 p-4 text-center min-w-[120px]">
            <div className="text-xs text-yellow-700 dark:text-yellow-400 font-bold uppercase tracking-wider mb-1">Баланс</div>
            <div className="text-2xl font-bold text-yellow-800 dark:text-yellow-300">{TG_USER.balance}</div>
            <div className="text-[10px] text-yellow-600 dark:text-yellow-400">Coins</div>
          </Card>
          <Button variant="outline" className="h-10 px-6">
            <Award className="mr-2 h-4 w-4" /> Premium
          </Button>
        </div>
      </div>

      <Tabs defaultValue="stats" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 h-12 bg-muted/50 p-1 rounded-xl">
          <TabsTrigger value="stats" className="gap-2 rounded-lg data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800 shadow-sm transition-all">
            <BarChart3 size={18}/> Статистика
          </TabsTrigger>
          <TabsTrigger value="settings" className="gap-2 rounded-lg data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800 shadow-sm transition-all">
            <Palette size={18}/> Интерфейс
          </TabsTrigger>
          <TabsTrigger value="info" className="gap-2 rounded-lg data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800 shadow-sm transition-all">
            <Shield size={18}/> Инфо
          </TabsTrigger>
          <TabsTrigger value="danger" className="gap-2 rounded-lg data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800 shadow-sm transition-all text-red-500 hover:text-red-600">
            <Trash2 size={18}/> Опасная зона
          </TabsTrigger>
        </TabsList>

        {/* --- 1. СТАТИСТИКА --- */}
        <TabsContent value="stats" className="space-y-6">
          
          {/* CONTROL BAR */}
          <div className="flex justify-between items-center bg-card p-2 rounded-lg border max-w-md mx-auto">
            <div className="flex gap-2">
              <button 
                onClick={() => setViewMode('list')}
                className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${viewMode === 'list' ? 'bg-primary text-primary-foreground shadow-sm' : 'text-muted-foreground hover:bg-muted'}`}
              >
                <List size={16}/> Цифры
              </button>
              <button 
                onClick={() => setViewMode('chart')}
                className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${viewMode === 'chart' ? 'bg-primary text-primary-foreground shadow-sm' : 'text-muted-foreground hover:bg-muted'}`}
              >
                <PieChartIcon size={16}/> Графики
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* ВРЕМЯ В БОТЕ */}
            <Card className="border-l-4 border-l-blue-500">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-xl flex items-center gap-2">
                      <Clock className="text-blue-500 h-5 w-5"/> Время в боте
                    </CardTitle>
                    <CardDescription>Активность за последние 7 дней</CardDescription>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold text-blue-700 dark:text-blue-400">{TOTAL_HOURS} ч</div>
                    <div className="text-xs text-muted-foreground">Всего</div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {viewMode === 'chart' ? (
                  <div className="h-[250px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={ACTIVITY_DATA}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} className="stroke-muted" />
                        <XAxis dataKey="day" tick={{ fontSize: 10 }} />
                        <YAxis />
                        <Tooltip formatter={(value) => [`${value} ч`, 'Время']} />
                        <Bar dataKey="hours" fill="#2196F3" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {ACTIVITY_DATA.map((item, idx) => (
                      <div key={idx} className="flex items-center justify-between p-3 rounded-lg bg-muted/30 border hover:bg-muted/50 transition-colors">
                        <div className="flex items-center gap-3">
                          <div className="w-2 h-8 bg-blue-500 rounded-full" />
                          <span className="font-medium text-sm">{item.day}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-blue-700 dark:text-blue-400">{item.hours} ч</span>
                          <div className="w-24 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-blue-500" 
                              style={{ width: `${(item.hours / 5) * 100}%` }} 
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* САМЫЕ ИСПОЛЬЗУЕМЫЕ ФУНКЦИИ */}
            <Card className="border-l-4 border-l-purple-500">
              <CardHeader>
                <CardTitle className="text-xl flex items-center gap-2">
                  <Target className="text-purple-500 h-5 w-5"/> Популярные функции
                </CardTitle>
                <CardDescription>Что вы открываете чаще всего</CardDescription>
              </CardHeader>
              <CardContent>
                {viewMode === 'chart' ? (
                  <div className="h-[250px] w-full flex justify-center">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={MOST_USED_FUNCS}
                          cx="50%"
                          cy="50%"
                          innerRadius={40}
                          outerRadius={80}
                          paddingAngle={5}
                          dataKey="count"
                        >
                          {MOST_USED_FUNCS.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {MOST_USED_FUNCS.map((func, idx) => (
                      <div key={idx} className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <div className="flex items-center gap-2 font-medium">
                            <span>{func.icon}</span> {func.name}
                          </div>
                          <span className="font-bold">{func.count}</span>
                        </div>
                        <div className="h-2 w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                          <div 
                            className="h-full rounded-full" 
                            style={{ width: `${(func.count / 150) * 100}%`, backgroundColor: func.color }} 
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* ПЕРСОНАЛЬНЫЕ РЕКОМЕНДАЦИИ */}
          <div>
             <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                <Zap className="text-yellow-500 h-5 w-5"/> Что ещё для этого аккаунта?
             </h3>
             <div className="grid md:grid-cols-3 gap-4">
                {RECOMMENDATIONS.map((rec, idx) => (
                  <Card key={idx} className="hover:shadow-md transition-all hover:border-primary/50 group cursor-pointer">
                    <CardContent className="p-6 flex flex-col items-start h-full justify-between">
                       <div className="mb-4 p-3 bg-primary/5 rounded-xl text-primary group-hover:bg-primary/10 group-hover:scale-110 transition-all">
                          {rec.icon}
                       </div>
                       <div>
                          <h4 className="font-bold text-base mb-2 group-hover:text-primary transition-colors">{rec.title}</h4>
                          <p className="text-sm text-muted-foreground leading-relaxed mb-4">{rec.desc}</p>
                       </div>
                       <div className="w-full">
                          {/* ИСПРАВЛЕНО: Обернули иконку и текст внутрь <a>, чтобы у Button был только 1 ребенок */}
                          <Button variant="outline" className="w-full" asChild>
                             <a href={rec.href} className="flex justify-between items-center w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                                <span>{rec.action}</span>
                                <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
                             </a>
                          </Button>
                       </div>
                    </CardContent>
                  </Card>
                ))}
             </div>
          </div>

        </TabsContent>

        {/* --- 2. ИНТЕРФЕЙС --- */}
        <TabsContent value="settings">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader><CardTitle className="text-xl">Оформление</CardTitle></CardHeader>
              <CardContent className="space-y-6">
                 <div className="flex items-center justify-between">
                   <div className="space-y-0.5"><label className="text-sm font-medium">Размер шрифта</label></div>
                   <div className="flex gap-2">
                      <Button size="sm" variant={settings.theme === 'normal' ? 'default' : 'outline'}>Обычный</Button>
                      <Button size="sm" variant={settings.theme === 'large' ? 'default' : 'outline'}>Крупный</Button>
                   </div>
                 </div>
                 <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <div className="font-medium text-sm">Темная тема</div>
                      <div className="text-xs text-muted-foreground">Для работы в темноте</div>
                    </div>
                    <div className="w-10 h-5 bg-primary rounded-full relative"><div className="absolute right-1 top-1 w-3 h-3 bg-white rounded-full"></div></div>
                 </div>
              </CardContent>
            </Card>

            <Card>
               <CardHeader><CardTitle className="text-xl">Язык и Локаль</CardTitle></CardHeader>
               <CardContent className="space-y-4">
                 <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium text-sm">Язык интерфейса</div>
                      <div className="text-xs text-muted-foreground">Выберите язык</div>
                    </div>
                    <Select defaultValue="ru">
                      <SelectTrigger className="w-[140px]"><SelectValue /></SelectTrigger>
                      <SelectContent><SelectItem value="ru">Русский</SelectItem><SelectItem value="en">English</SelectItem></SelectContent>
                    </Select>
                 </div>
                 <div className="p-3 bg-muted/50 rounded-lg text-sm text-muted-foreground">
                   Язык автоматически обновится при следующей перезагрузке страницы.
                 </div>
               </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* --- 3. ИНФО --- */}
        <TabsContent value="info">
           <Card>
             <CardHeader>
                <CardTitle>Информация об аккаунте</CardTitle>
                <CardDescription>Данные профиля и подписки</CardDescription>
             </CardHeader>
             <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                   <div>
                      <label className="text-xs font-medium mb-1 block text-muted-foreground uppercase">Username</label>
                      <div className="font-mono text-sm bg-muted p-2 rounded">{TG_USER.username}</div>
                   </div>
                   <div>
                      <label className="text-xs font-medium mb-1 block text-muted-foreground uppercase">User ID</label>
                      <div className="font-mono text-sm bg-muted p-2 rounded">{TG_USER.id}</div>
                   </div>
                </div>
                
                <div className="pt-4 border-t">
                   <label className="text-xs font-medium mb-1 block text-muted-foreground uppercase">Email для уведомлений</label>
                   <div className="flex gap-2">
                      <Input disabled={!isEmailEditable} defaultValue="alex@example.com" className="flex-1" />
                      {isEmailEditable ? (
                        <Button size="sm" onClick={() => setIsEmailEditable(false)}>Сохранить</Button>
                      ) : (
                        <Button size="sm" variant="outline" onClick={() => setIsEmailEditable(true)}>Изменить</Button>
                      )}
                   </div>
                </div>

                <div className="pt-4 border-t">
                   <div className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-900/10 border border-blue-200 dark:border-blue-800 rounded-lg">
                      <div>
                         <div className="font-medium text-sm text-blue-700 dark:text-blue-400">Telegram Auth</div>
                         <div className="text-xs text-blue-600/80 dark:text-blue-400/80">Аккаунт привязан к Telegram</div>
                      </div>
                      <div className="h-8 w-8 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center text-blue-600 dark:text-blue-400">
                         <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2C6.477 2 2 6.477 2 12C2 17.523 6.477 22 12 22C17.523 22 22 17.523 22 12C22 6.477 17.523 2 12 2ZM12 20C7.582 20 4 16.418 4 12C4 7.582 7.582 4 12 4C16.418 4 20 7.582 20 12C20 16.418 16.418 20 12 20ZM12 18C9.79 18 8 16.21 8 14C8 11.79 9.79 10 12 10C14.21 10 16 11.79 16 14C16 16.21 14.21 18 12 18ZM12 16C13.1 16 14 15.1 14 14C14 12.9 13.1 12 12 12C10.9 12 10 12.9 10 14C10 15.1 10.9 16 12 16Z"/></svg>
                      </div>
                   </div>
                </div>
             </CardContent>
           </Card>
        </TabsContent>

        {/* --- 4. ОПАСНАЯ ЗОНА --- */}
        <TabsContent value="danger">
           <div className="grid md:grid-cols-2 gap-6">
              <Card className="border-red-100 dark:border-red-900/30">
                 <CardHeader>
                    <CardTitle className="text-red-600 dark:text-red-400 flex items-center gap-2">
                       <History className="h-5 w-5"/> Данные
                    </CardTitle>
                    <CardDescription>Удаление истории и статистики</CardDescription>
                 </CardHeader>
                 <CardContent className="space-y-3">
                    <Button variant="outline" className="w-full justify-start text-red-600 border-red-200 dark:border-red-800 hover:bg-red-50 dark:hover:bg-red-900/10">
                       <Trash2 className="h-4 w-4 mr-2"/> Очистить историю активности
                    </Button>
                    <Button variant="outline" className="w-full justify-start text-red-600 border-red-200 dark:border-red-800 hover:bg-red-50 dark:hover:bg-red-900/10">
                       <Trash2 className="h-4 w-4 mr-2"/> Сбросить счетчик Coins
                    </Button>
                 </CardContent>
              </Card>

              <Card className="bg-red-50/30 dark:bg-red-900/10 border-red-200 dark:border-red-800">
                 <CardHeader>
                    <CardTitle className="text-red-600 dark:text-red-400 flex items-center gap-2">
                       <ShieldAlert className="h-5 w-5"/> Удаление аккаунта
                    </CardTitle>
                    <CardDescription>Это действие необратимо и удалит все данные.</CardDescription>
                 </CardHeader>
                 <CardContent className="space-y-4">
                    <div className="p-4 bg-white dark:bg-gray-800 rounded-lg border border-red-200 dark:border-red-900">
                       <p className="text-sm text-muted-foreground">
                          После удаления аккаунта вы потеряете доступ к Premium функциям, истории финансов и заметкам.
                       </p>
                    </div>
                    <Button className="w-full btn-danger flex items-center justify-center gap-2">
                       <Trash2 className="h-4 w-4"/> Удалить аккаунт
                    </Button>
                 </CardContent>
              </Card>
           </div>
        </TabsContent>

      </Tabs>
    </div>
  );
}