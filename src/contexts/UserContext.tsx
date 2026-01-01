
```typescript
"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface User {
  balance: number;
  isPremium: boolean;
  premiumExpiry: string | null;
  referralCode: string;
  referralCount: number;
}

interface UserContextType {
  user: User;
  addCoins: (amount: number, description?: string) => void;
  spendCoins: (amount: number, description?: string) => void;
  setPremium: (isActive: boolean, days?: number) => void;
  addReferral: () => void;
  resetUser: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

const INITIAL_USER: User = {
  balance: 150, // Стартовый бонус
  isPremium: false,
  premiumExpiry: null,
  referralCode: "LEO" + Math.floor(Math.random() * 10000),
  referralCount: 0,
};

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User>(INITIAL_USER);

  // Загрузка из localStorage при старте
  useEffect(() => {
    try {
      const savedUser = localStorage.getItem("leo-user-data");
      if (savedUser) {
        setUser(JSON.parse(savedUser));
      }
    } catch (e) {
      console.warn("Failed to load user data", e);
    }
  }, []);

  // Сохранение при изменениях
  useEffect(() => {
    try {
      localStorage.setItem("leo-user-data", JSON.stringify(user));
    } catch (e) {
      console.warn("Failed to save user data", e);
    }
  }, [user]);

  const addCoins = (amount: number, description?: string) => {
    setUser(prev => ({ ...prev, balance: prev.balance + amount }));
    if (description && typeof window !== 'undefined' && (window as any).Toast) {
      (window as any).Toast.success(`+${amount} Coins: ${description}`);
    }
  };

  const spendCoins = (amount: number, description?: string) => {
    setUser(prev => ({ ...prev, balance: Math.max(0, prev.balance - amount) }));
    if (description && typeof window !== 'undefined' && (window as any).Toast) {
      (window as any).Toast.info(`-${amount} Coins: ${description}`);
    }
  };

  const setPremium = (isActive: boolean, days = 30) => {
    const expiry = isActive ? new Date(Date.now() + days * 24 * 60 * 60 * 1000).toISOString() : null;
    setUser(prev => ({ 
      ...prev, 
      isPremium: isActive, 
      premiumExpiry: expiry 
    }));
  };

  const addReferral = () => {
    setUser(prev => ({ 
      ...prev, 
      referralCount: prev.referralCount + 1,
      balance: prev.balance + 50 // Бонус за реферала
    }));
    if (typeof window !== 'undefined' && (window as any).Toast) {
      (window as any).Toast.success("Новый реферал! +50 Coins");
    }
  };

  const resetUser = () => {
    setUser(INITIAL_USER);
    localStorage.removeItem("leo-user-data");
  };

  return (
    <UserContext.Provider value={{ user, addCoins, spendCoins, setPremium, addReferral, resetUser }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
}
```

### 2. Подключаем провайдер в корневой layout
Важно обернуть приложение в провайдер, чтобы контекст был доступен на всех страницах.

<Edit filename="src/app/layout.tsx">
```typescript
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Script from "next/script";
import LayoutClientWrapper from "@/components/LayoutClientWrapper";
import { LangProvider } from "@/contexts/LanguageContext"; 
import { UserProvider } from "@/contexts/UserContext"; // Импортируем UserProvider

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Лео Помощник",
  description: "Умный помощник для Telegram",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" suppressHydrationWarning>
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet" />
        
        {/* ПОЛИФИЛ ДЛЯ LOCALSTORAGE */}
        <Script id="local-storage-polyfill" strategy="beforeInteractive">
          {`
          (function() {
            try {
              var testKey = '__test__';
              window.localStorage.setItem(testKey, testKey);
              window.localStorage.removeItem(testKey);
            } catch (e) {
              console.warn('localStorage access denied. Initializing memory polyfill.');
              var MemoryStorage = function() {
                this._data = {};
                this.length = 0;
              };
              
              MemoryStorage.prototype.setItem = function(id, val) {
                if (!this.hasOwnProperty(id)) {
                  this.length++;
                }
                this._data[id] = String(val);
              };
              
              MemoryStorage.prototype.getItem = function(id) {
                return this._data.hasOwnProperty(id) ? this._data[id] : null;
              };
              
              MemoryStorage.prototype.removeItem = function(id) {
                if (this.hasOwnProperty(id)) {
                  delete this._data[id];
                  this.length--;
                }
              };
              
              MemoryStorage.prototype.clear = function() {
                this._data = {};
                this.length = 0;
              };
              
              MemoryStorage.prototype.key = function(index) {
                var keys = Object.keys(this._data);
                return keys[index] || null;
              };
              
              Object.defineProperty(window, 'localStorage', {
                value: new MemoryStorage(),
                writable: true,
                configurable: true
              });
            }
          })();
          `}
        </Script>

        <Script src="https://cdn.jsdelivr.net/npm/chart.js" strategy="afterInteractive" />
      </head>
      <body className={inter.className}>
        {/* WRAP WITH USER PROVIDER */}
        <UserProvider>
          <LangProvider>
            <LayoutClientWrapper>
              {children}
            </LayoutClientWrapper>
          </LangProvider>
        </UserProvider>

        <Script id="main-js" strategy="afterInteractive">
          {`
          document.addEventListener('DOMContentLoaded', () => {
            const themeToggle = document.getElementById('theme-toggle');
            const html = document.documentElement;

            let savedTheme = 'light';
            try {
              savedTheme = localStorage.getItem('theme') || 'light';
            } catch (e) {
              console.log('LocalStorage is not available');
            }
            html.setAttribute('data-theme', savedTheme);
            
            if (themeToggle) {
              themeToggle.onclick = () => {
                const isDark = html.getAttribute('data-theme') === 'dark';
                const newTheme = isDark ? 'light' : 'dark';
                html.setAttribute('data-theme', newTheme);
                try {
                  localStorage.setItem('theme', newTheme);
                  document.cookie = \`theme=\${newTheme}; path=/; max-age=31536000\`;
                } catch (e) {
                  console.log('Cannot save theme to localStorage');
                }
              };
            }

            const header = document.getElementById('combined-header');
            let lastScroll = 0;
            if (header) {
              window.addEventListener('scroll', () => {
                const current = window.scrollY;
                if (current > 100 && current > lastScroll) {
                  header.classList.add('hidden');
                } else if (current < lastScroll && current > 50) {
                  header.classList.remove('hidden');
                }
                lastScroll = current;
              });
            }

            window.Toast = {
              show: (msg) => {
                const toast = document.getElementById('toast');
                if (!toast) return;
                toast.textContent = msg;
                toast.className = 'show';
                setTimeout(() => toast.className = '', 3000);
              },
              info: (msg) => window.Toast ? window.Toast.show(msg) : console.log(msg),
              success: (msg) => window.Toast ? window.Toast.show(msg) : console.log(msg),
              warning: (msg) => window.Toast ? window.Toast.show(msg) : console.log(msg),
              error: (msg) => window.Toast ? window.Toast.show(msg) : console.log(msg)
            };

            if (window.Telegram?.WebApp) {
              window.Telegram.WebApp.ready();
              window.Telegram.WebApp.expand();
            }
          });
          `}
        </Script>
      </body>
    </html>
  );
}
```

### 3. Обновляем страницу Рефералов
Теперь страница рефералов будет реально увеличивать баланс через `addCoins`.

<Edit filename="src/app/referrals/page.tsx">
```typescript
"use client";

import { useState } from "react";
import { Users, Gift, Copy, Check, Crown, Share2, QrCode, Calendar } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useUser } from "@/contexts/UserContext"; // Хук пользователя

// --- MOCK DATA ---
// В реальном приложении эти данные приходят с сервера
// Здесь мы используем стейт из UserContext для отображения статистики
const INITIAL_MOCK_FRIENDS = [
  { id: 1, name: "Иван Петров", username: "@ivan_p", status: "active", joined: "2023-10-20" },
  { id: 2, name: "Мария Иванова", username: "@maria_k", status: "active", joined: "2023-10-22" },
];

const REFERRAL_RULES = [
  { 
    title: "Пригласил друга", 
    reward: "+50 Coins", 
    desc: "Начисляется сразу после регистрации друга",
    color: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
    icon: Users
  },
  { 
    title: "Бонус другу", 
    reward: "+10 Coins", 
    desc: "Ваш друг получает приветственный бонус",
    color: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
    icon: Gift
  },
  { 
    title: "Каждый 5-й друг", 
    reward: "+100 Coins", 
    desc: "Дополнительный бонус за активное приглашение",
    color: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
    icon: Crown
  },
];

export default function ReferralsPage() {
  const { user, referralCode } = useUser();
  const [friends, setFriends] = useState(INITIAL_MOCK_FRIENDS);
  const [copied, setCopied] = useState(false);

  // Логика симуляции добавления друга (для демо)
  const handleSimulateFriend = () => {
    const newFriend = {
      id: Date.now(),
      name: "Новый Друг " + (friends.length + 1),
      username: "@new_friend_" + Math.floor(Math.random() * 100),
      status: "active",
      joined: new Date().toLocaleDateString()
    };
    setFriends([newFriend, ...friends]);
  };

  const handleCopy = () => {
    const link = `https://t.me/LeoAssistantBot?start=ref_${referralCode}`;
    navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    
    // Используем Toast из window (есть в layout.tsx)
    if (typeof window !== 'undefined' && (window as any).Toast) {
      (window as any).Toast.success("Ссылка скопирована!");
    }
  };

  const referralLink = `https://t.me/LeoAssistantBot?start=ref_${referralCode}`;
  const earnedFromReferrals = friends.length * 50; // 50 монет за друга
  const bonusDays = Math.floor(friends.length / 5) * 1; // Условный бонус

  return (
    <div className="fade-in main-content">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold flex items-center justify-center gap-2 mb-2">
          <Users className="text-primary" /> Реферальная система
        </h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Приглашайте друзей, получайте <strong>Coins</strong> и обменивайте их на Premium и скидки.
        </p>
      </div>

      {/* --- STATS CARDS --- */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Card>
          <CardContent className="pt-6 text-center">
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users size={24} />
            </div>
            <div className="text-3xl font-bold mb-1">{friends.length}</div>
            <div className="text-sm text-muted-foreground">Друзей приглашено</div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-yellow-50 to-white dark:from-yellow-900/20 dark:to-gray-900 border-yellow-200 dark:border-yellow-800">
          <CardContent className="pt-6 text-center">
            <div className="w-12 h-12 bg-yellow-500 text-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg shadow-yellow-500/20">
              <Calendar size={24} />
            </div>
            <div className="text-3xl font-bold mb-1 text-yellow-700 dark:text-yellow-300">{earnedFromReferrals}</div>
            <div className="text-xs text-yellow-600/80 dark:text-yellow-400/80 mb-1">Coins заработано</div>
            <div className="text-[10px] text-muted-foreground">({friends.length} × 50)</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6 text-center">
            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-full flex items-center justify-center mx-auto mb-4">
              <Crown size={24} />
            </div>
            <div className="text-3xl font-bold mb-1">{bonusDays}</div>
            <div className="text-sm text-muted-foreground">Бонусных дней</div>
          </CardContent>
        </Card>
      </div>

      {/* --- RULES --- */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {REFERRAL_RULES.map((rule, i) => (
          <Card key={i} className="bg-muted/30 border-dashed hover:border-primary/50 transition-colors">
            <CardContent className="p-6 text-center flex flex-col items-center h-full justify-center">
              <div className={`w-14 h-14 rounded-full flex items-center justify-center mb-4 ${rule.color}`}>
                <rule.icon size={28} />
              </div>
              <div className="font-semibold text-lg mb-2">{rule.title}</div>
              <div className={`text-2xl font-bold mb-2 ${rule.color.split(' ')[1]}`}>{rule.reward}</div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {rule.desc}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* --- REFERRAL LINK --- */}
      <Card className="mb-8 bg-gradient-to-r from-primary/10 to-blue-500/10 border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Share2 className="h-5 w-5 text-primary" /> Ваша реферальная ссылка
          </CardTitle>
          <CardDescription>
            Поделитесь этой ссылкой. За каждого зарегистрированного друга вы получите <strong>50 Coins</strong>.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <div className="absolute left-3 top-3 h-4 w-4 text-muted-foreground">
                <QrCode size={16} />
              </div>
              <Input 
                value={referralLink} 
                readOnly 
                className="pl-9 h-12 font-mono text-sm bg-white dark:bg-gray-900" 
              />
            </div>
            <Button 
              onClick={handleCopy} 
              className={copied ? "bg-green-600 hover:bg-green-700" : ""}
            >
              {copied ? <Check className="h-4 w-4 mr-2" /> : <Copy className="h-4 w-4 mr-2" />}
              {copied ? "Скопировано!" : "Копировать"}
            </Button>
          </div>
          
          <div className="flex items-center gap-2 text-sm text-muted-foreground border-t pt-4">
             <Users size={14} />
             <span className="text-xs">Ваш промокод: </span>
             <Badge variant="outline" className="font-mono font-bold text-primary border-primary">{referralCode}</Badge>
          </div>
        </CardContent>
      </Card>

      {/* --- DEMO BUTTON (Только для разработки) --- */}
      {process.env.NODE_ENV === 'development' && (
        <div className="mb-8 text-center">
          <Button onClick={handleSimulateFriend} variant="outline" size="sm">
            [DEV] Симулировать нового друга (+50 Coins)
          </Button>
        </div>
      )}

      {/* --- LIST --- */}
      <Card>
        <CardHeader>
          <CardTitle>Ваши приглашения</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Друг</TableHead>
                <TableHead>Статус</TableHead>
                <TableHead>Дата регистрации</TableHead>
                <TableHead className="text-right">Награда</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {friends.length > 0 ? friends.map((friend) => (
                <TableRow key={friend.id}>
                  <TableCell>
                    <div className="font-medium">{friend.name}</div>
                    <div className="text-xs text-muted-foreground">{friend.username}</div>
                  </TableCell>
                  <TableCell>
                    <Badge className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                      Активен
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">{friend.joined}</TableCell>
                  <TableCell className="text-right font-bold text-green-600">+50 Coins</TableCell>
                </TableRow>
              )) : (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                    Вы пока никого не пригласили. Время исправить это! 🚀
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
```

### 4. Обновляем Профиль
Используем реальный баланс из контекста.

<Edit filename="src/app/profile/page.tsx">
```typescript
"use client";

import { useState } from "react";
import { User, Bell, Palette, Star, History, Shield, Trash2, Clock, BarChart3, Zap, Target, TrendingUp, Award, ChevronRight, PieChart as PieChartIcon, List, Crown, Sparkles, Settings, ShieldAlert, Check } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useUser } from "@/contexts/UserContext"; // Импорт контекста

// --- RECHARTS ---
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend } from "recharts";

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
  const { user } = useUser(); // Получаем пользователя из контекста
  
  const [viewMode, setViewMode] = useState<'chart' | 'list'>('chart');
  
  // MOCK ROLE STATE (Для демонстрации корон)
  const [userRole, setUserRole] = useState<'user' | 'mod' | 'admin'>('admin');

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
          <div className="relative">
            <Crown className="h-10 w-10 text-yellow-500 fill-yellow-500 stroke-yellow-600" />
            <div className="absolute -top-1 -left-1"><Sparkles className="h-4 w-4 text-cyan-400 fill-white drop-shadow-sm" /></div>
            <div className="absolute -top-2 left-1/2 transform -translate-x-1/2"><Sparkles className="h-3 w-3 text-blue-400 fill-white drop-shadow-sm" /></div>
            <div className="absolute -top-1 -right-1"><Sparkles className="h-4 w-4 text-purple-400 fill-white drop-shadow-sm" /></div>
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
    
    if (user.isPremium) { // Используем user.isPremium из контекста
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
              {user.balance.toString().charAt(0)} {/* Первая цифра баланса */}
            </div>
            <div className="absolute bottom-1 right-1 bg-white dark:bg-gray-800 rounded-full p-1 shadow-sm border dark:border-gray-700 z-10">
              <div className="bg-green-100 text-green-700 rounded-full p-1">
                 <Check size={12} />
              </div>
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Пользователь</h1>
              {/* Бейдж роли */}
              {userRole === 'admin' && <Badge className="bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"><Crown size={12} className="mr-1"/> Admin</Badge>}
              {userRole === 'mod' && <Badge className="bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"><Shield size={12} className="mr-1"/> Mod</Badge>}
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              ID: {user.referralCode}
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              {user.isPremium ? "Premium активен" : "Free Plan"}
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <Card className="bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 border-yellow-200 dark:border-yellow-800 p-4 text-center min-w-[140px]">
            <div className="text-xs text-yellow-700 dark:text-yellow-400 font-bold uppercase tracking-wider mb-1">Баланс</div>
            <div className="text-2xl font-bold text-yellow-800 dark:text-yellow-300">{user.balance}</div>
            <div className="text-[10px] text-yellow-600 dark:text-yellow-400">Coins</div>
          </Card>
          <Button variant="outline" className="h-10 px-6" asChild>
             <a href="/cabinet">Магазин</a> {/* Ссылка на магазин */}
          </Button>
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
                      <div className="font-mono text-sm bg-muted p-2 rounded">@user_leo</div>
                   </div>
                   <div>
                      <label className="text-xs font-medium mb-1 block text-muted-foreground uppercase">User ID</label>
                      <div className="font-mono text-sm bg-muted p-2 rounded">{user.referralCode}</div>
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
                          После удаления аккаунта вы потеряете баланс ({user.balance} Coins), Premium статус и историю операций.
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
```

### 5. Обновляем Кабинет (Добавляем Магазин)
Добавим вкладку "Магазин" в `src/app/cabinet/page.tsx`, где можно тратить Coins на дни Premium.

<Edit filename="src/app/cabinet/page.tsx">
```typescript
"use client";

import { useState } from "react";
import { User, Calendar as CalendarIcon, Award, Settings, Copy, Check, Mic, FileText, BarChart3, Download, Bell, ShoppingCart, Crown, Sparkles, Zap, TrendingUp } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useUser } from "@/contexts/UserContext"; // Импорт хука

export default function CabinetPage() {
  const { user, addCoins, spendCoins, setPremium } = useUser(); // Используем хуки
  const [date, setDate] = useState<Date | undefined>(new Date());

  // Shop Items
  const SHOP_ITEMS = [
    { id: 1, name: "1 день Premium", price: 200, icon: Crown, color: "text-yellow-500", type: "premium", duration: 1 },
    { id: 2, name: "7 дней Premium", price: 1200, icon: Crown, color: "text-yellow-500", type: "premium", duration: 7 },
    { id: 3, name: "30 дней Premium", price: 4500, icon: Crown, color: "text-yellow-500", type: "premium", duration: 30, best: true },
    { id: 4, name: "Смена ника", price: 500, icon: Mic, color: "text-blue-500", type: "custom" },
    { id: 5, name: "Фон для профиля", price: 300, icon: Sparkles, color: "text-purple-500", type: "custom" },
  ];

  const handleBuyItem = (item: typeof SHOP_ITEMS[0]) => {
    if (user.balance < item.price) {
      alert("Недостаточно Coins! Пригласите друзей, чтобы заработать больше.");
      return;
    }

    if (item.type === 'premium') {
      spendCoins(item.price, `Покупка: ${item.name}`);
      setPremium(true, item.duration);
    } else {
      spendCoins(item.price, `Покупка: ${item.name}`);
      alert("Функция в разработке, но Coins списаны! 🎉");
    }
  };

  const notes = [
    { id: 1, text: "Купить продукты к обеду", date: "Сегодня" },
    { id: 2, text: "Оплатить хостинг", date: "Завтра" },
  ];

  const usageStats = [
    { name: "GigaChat", value: 85, max: 100, color: "bg-blue-500" },
    { name: "Фильмы", value: 2, max: 10, color: "bg-purple-500" },
    { name: "Антивирус", value: 1, max: 50, color: "bg-green-500" },
  ];

  return (
    <div className="container py-8 max-w-6xl main-content">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* Sidebar - Profile Card */}
        <div className="space-y-6">
          <Card className="bg-gradient-to-br from-green-50 to-white dark:from-green-900/20 dark:to-gray-900">
            <CardHeader>
              <div className="flex items-center gap-4">
                <div className="h-16 w-16 rounded-full bg-green-100 flex items-center justify-center text-2xl relative">
                  {user.balance.toString().charAt(0)}
                  {user.isPremium && <div className="absolute -top-2 -right-2 bg-yellow-400 text-white rounded-full p-1"><Crown size={10} fill="white"/></div>}
                </div>
                <div>
                  <CardTitle className="text-xl">Leo User</CardTitle>
                  <Badge variant={user.isPremium ? "default" : "outline"} className="mt-1">
                    {user.isPremium ? 'Premium' : 'Free'}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Баланс</span>
                  <span className="font-bold flex items-center gap-1">
                    <Zap size={14} className="text-yellow-500"/> {user.balance}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Рефералов</span>
                  <span className="font-bold">{user.referralCount}</span>
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
          <Tabs defaultValue="shop" className="w-full">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="shop">Магазин</TabsTrigger>
              <TabsTrigger value="calendar">Календарь</TabsTrigger>
              <TabsTrigger value="notes">Заметки</TabsTrigger>
              <TabsTrigger value="stats">Статистика</TabsTrigger>
              <TabsTrigger value="tools">Инструменты</TabsTrigger>
            </TabsList>

            {/* SHOP TAB */}
            <TabsContent value="shop">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-xl"><ShoppingCart className="text-primary" /> Магазин Coins</CardTitle>
                  <CardDescription>Обменивайте баллы на премиум и улучшения</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {SHOP_ITEMS.map((item) => {
                      const canAfford = user.balance >= item.price;
                      return (
                        <Card key={item.id} className={`flex flex-col h-full justify-between hover:shadow-md transition-all border-2 ${!canAfford ? 'opacity-60 grayscale' : 'hover:border-primary'} ${item.best ? 'border-yellow-500 ring-1 ring-yellow-500/20' : ''}`}>
                          <CardContent className="pt-6 text-center">
                            <div className={`h-12 w-12 rounded-full bg-primary/10 mx-auto mb-4 flex items-center justify-center ${item.color}`}>
                              <item.icon size={24} />
                            </div>
                            <h3 className="font-bold text-lg mb-1">{item.name}</h3>
                            <div className="text-2xl font-extrabold text-primary mb-2">{item.price}</div>
                            <div className="text-[10px] text-muted-foreground font-mono">COINS</div>
                          </CardContent>
                          <div className="p-4 border-t bg-muted/30">
                            <Button 
                              onClick={() => handleBuyItem(item)}
                              disabled={!canAfford}
                              className={`w-full ${item.best ? 'btn-gold' : 'btn-primary'}`}
                              size="sm"
                            >
                              {canAfford ? "Купить" : "Недостаточно"}
                            </Button>
                          </div>
                        </Card>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>

              {/* PROMO BANNER */}
              <div className="mt-6 p-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg text-white flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <TrendingUp size={24} />
                  <div>
                    <div className="font-bold text-lg">Накопить Coins?</div>
                    <div className="text-sm opacity-90">Пригласите друга и получите 50 монет!</div>
                  </div>
                </div>
                <Button asChild variant="secondary" className="bg-white text-primary hover:bg-gray-100">
                  <a href="/referrals">Рефералы</a>
                </Button>
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

            {/* Notes Tab (Premium) */}
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

Создал глобальную систему экономики с магазином и рефералами.