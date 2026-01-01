"use client";

import { useState, useEffect } from "react";
import { RefreshCw, Settings2, X, ChevronRight, DollarSign, Cloud, FileText, Calendar, Newspaper, Zap, ExternalLink } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useLang } from "@/contexts/LanguageContext";

type WidgetId = "greeting" | "weather" | "currency" | "shortcuts" | "news";

interface WidgetConfig {
  id: WidgetId;
  nameKey: string; // Key for translation
  icon: any;
  visible: boolean;
}

// --- ДОСТУПНЫЕ ВИДЖЕТЫ ---
const AVAILABLE_WIDGETS: WidgetConfig[] = [
  { id: "greeting", nameKey: "widget_greeting", icon: Zap, visible: true },
  { id: "weather", nameKey: "widget_weather", icon: Cloud, visible: true },
  { id: "currency", nameKey: "widget_currency", icon: DollarSign, visible: true },
  { id: "shortcuts", nameKey: "widget_shortcuts", icon: ChevronRight, visible: true },
  { id: "news", nameKey: "widget_news", icon: Newspaper, visible: false },
];

// --- ДАННЫЕ ---
const MOCK_WEATHER = { temp: 14, city: "Москва", condition: "Облачно" };
const MOCK_CURRENCY = { usd: 98.50, eur: 109.80 };
const MOCK_NEWS = [
  { title: "Курс доллара превысил 99 рублей", time: "10 мин назад" },
  { title: "Обновление GigaChat v2.1", time: "2 часа назад" },
  { title: "Новая акция на Premium", time: "5 часов назад" },
];

// --- КОМПОНЕНТЫ ДЛЯ БЫСТРОГО ДОСТУПА ---
const QUICK_ACCESS_ITEMS = [
  { labelKey: "finance", icon: "💰", href: "/finance", color: "bg-green-100 text-green-600 dark:bg-green-900/20 dark:text-green-400 border-green-200 dark:border-green-800" },
  { labelKey: "gigachat", icon: "💬", href: "/gigachat", color: "bg-blue-100 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400 border-blue-200 dark:border-blue-800" },
  { labelKey: "games", icon: "🎮", href: "/games", color: "bg-purple-100 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400 border-purple-200 dark:border-purple-800" },
  { labelKey: "weather", icon: "🌦", href: "/weather", color: "bg-orange-100 text-orange-600 dark:bg-orange-900/20 dark:text-orange-400 border-orange-200 dark:border-orange-800" },
];

export default function HomePage() {
  const { lang, t } = useLang();
  const [greeting, setGreeting] = useState({ textKey: "greeting_morning", icon: "👋" });
  
  // --- СОХРАНЕНИЕ ВИДЖЕТОВ В LOCALSTORAGE ---
  const [widgets, setWidgets] = useState<WidgetConfig[]>(AVAILABLE_WIDGETS);
  
  // Загрузка настроек при старте
  useEffect(() => {
    try {
      const savedWidgets = localStorage.getItem("widgets-config");
      if (savedWidgets) {
        setWidgets(JSON.parse(savedWidgets));
      }
    } catch (e) {
      console.warn("Failed to load widgets config", e);
    }
  }, []);

  // Сохранение настроек при изменении
  useEffect(() => {
    try {
      localStorage.setItem("widgets-config", JSON.stringify(widgets));
    } catch (e) {
      console.warn("Failed to save widgets config", e);
    }
  }, [widgets]);

  const [isEditingWidgets, setIsEditingWidgets] = useState(false);

  // --- ЛОГИКА ПРИВЕТСТВИЯ ---
  useEffect(() => {
    const hour = new Date().getHours();
    if (hour >= 6 && hour < 12) setGreeting({ textKey: "greeting_morning", icon: "🌤" });
    else if (hour >= 12 && hour < 18) setGreeting({ textKey: "greeting_day", icon: "☀️" });
    else if (hour >= 18 && hour < 23) setGreeting({ textKey: "greeting_evening", icon: "🌆" });
    else setGreeting({ textKey: "greeting_night", icon: "🌙" });
  }, []);

  const toggleWidget = (id: WidgetId) => {
    setWidgets(prev => prev.map(w => w.id === id ? { ...w, visible: !w.visible } : w));
  };

  return (
    <div className="fade-in pb-20 max-w-6xl mx-auto">
      
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{t('home')}</h1>
          <p className="text-muted-foreground text-sm">{t('welcome_back')}, Алексей</p>
        </div>
        <button 
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
            isEditingWidgets 
            ? "bg-green-100 text-green-700 hover:bg-green-200 dark:bg-green-900/30 dark:text-green-400 border border-green-200 dark:border-green-800" 
            : "bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-400 border border-transparent"
          }`} 
          onClick={() => setIsEditingWidgets(!isEditingWidgets)}
        >
          {isEditingWidgets ? <X className="h-4 w-4" /> : <Settings2 className="h-4 w-4" />}
          {isEditingWidgets ? t("save") : t("customize")}
        </button>
      </div>

      {/* ПАНЕЛЬ НАСТРОЙКИ ВИДЖЕТОВ */}
      {isEditingWidgets && (
        <div className="card mb-8 bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-inner animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="flex items-center gap-2 mb-4 text-sm font-semibold text-slate-700 dark:text-slate-300">
            <Settings2 size={16} /> {t('select_widgets')}
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
            {widgets.map(widget => (
              <label 
                key={widget.id} 
                className={`flex flex-col items-center justify-between p-4 rounded-xl border cursor-pointer transition-all hover:shadow-sm ${
                  widget.visible 
                    ? 'bg-white dark:bg-slate-800 border-primary ring-1 ring-primary shadow-sm' 
                    : 'bg-transparent border-slate-200 dark:border-slate-700 opacity-60 hover:opacity-100 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <div className="flex flex-col items-center gap-2 text-center flex-1">
                  <div className={`p-2 rounded-lg ${widget.visible ? "text-primary" : "text-slate-400"}`}>
                    <widget.icon size={20} />
                  </div>
                  <span className="text-xs font-medium leading-tight">{t(widget.nameKey)}</span>
                </div>
                <div className={`w-10 h-5 rounded-full relative transition-colors ${widget.visible ? 'bg-primary' : 'bg-slate-300'}`}>
                  <div className={`absolute top-1 left-1 bg-white w-3 h-3 rounded-full transition-transform ${widget.visible ? 'translate-x-5' : ''}`}></div>
                </div>
              </label>
            ))}
          </div>
        </div>
      )}

      {/* ОСНОВНОЙ КОНТЕНТ */}
      <div className="space-y-6">
        
        {/* ПРИВЕТСТВИЕ */}
        {widgets.find(w => w.id === "greeting")?.visible && (
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-primary to-teal-600 text-white shadow-lg card animate-in fade-in">
            <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-white opacity-10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-32 h-32 bg-black opacity-10 rounded-full blur-2xl" />
            <div className="relative p-8 md:p-10 flex flex-col md:flex-row items-center justify-between gap-6">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-4xl filter drop-shadow-md">{greeting.icon}</span>
                  <h2 className="text-3xl font-bold tracking-tight drop-shadow-sm">{t(greeting.textKey)}</h2>
                </div>
                <p className="text-white/90 text-lg max-w-xl">{t('greeting_text')}</p>
              </div>
              <a href="/premium" className="btn bg-white/20 hover:bg-white/30 text-white border-0 backdrop-blur-sm shadow-md transition-all hover:scale-105">
                <span className="mr-2">👑</span> Premium
              </a>
            </div>
          </div>
        )}

        {/* ВЕРХНЯЯ СТРОКА (СТАТИСТИКА) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          
          {/* ПОГОДА */}
          {widgets.find(w => w.id === "weather")?.visible && (
            <div className="card overflow-hidden hover:shadow-lg transition-all duration-300 group animate-in slide-in-from-left-2 delay-100">
              <div className="flex flex-row items-center justify-between space-y-0 pb-2">
                <span className="text-sm font-medium text-blue-600 dark:text-blue-400">{t('weather')}</span>
                <Cloud className="h-4 w-4 text-muted-foreground group-hover:scale-110 transition-transform" />
              </div>
              <div className="mt-4">
                <div className="text-4xl font-bold tracking-tight">{MOCK_WEATHER.temp}°</div>
                <p className="text-xs text-muted-foreground font-medium">{MOCK_WEATHER.city}</p>
                <div className="mt-4 text-xs text-blue-600/80 bg-blue-50 dark:bg-blue-900/20 px-2 py-1 rounded w-fit">
                  {t('condition')}
                </div>
              </div>
            </div>
          )}

          {/* КУРСЫ ВАЛЮТ */}
          {widgets.find(w => w.id === "currency")?.visible && (
            <div className="card overflow-hidden hover:shadow-lg transition-all duration-300 group animate-in slide-in-from-right-2 delay-100">
              <div className="flex flex-row items-center justify-between space-y-0 pb-2">
                <span className="text-sm font-medium text-green-600 dark:text-green-400">{t('currency')}</span>
                <RefreshCw className="h-4 w-4 text-muted-foreground group-hover:rotate-180 transition-transform duration-500" />
              </div>
              <div className="mt-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-muted-foreground">USD</span>
                  <span className="text-lg font-bold tracking-tight">{MOCK_CURRENCY.usd} ₽</span>
                </div>
                <div className="h-px bg-border" />
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-muted-foreground">EUR</span>
                  <span className="text-lg font-bold tracking-tight">{MOCK_CURRENCY.eur} ₽</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* БЫСТРЫЙ ДОСТУП */}
        {widgets.find(w => w.id === "shortcuts")?.visible && (
          <div className="space-y-3 animate-in fade-in slide-in-from-bottom-4 delay-200">
             <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider px-1">{t('quick_access')}</h3>
             <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {QUICK_ACCESS_ITEMS.map((item) => (
                  <a key={item.href} href={item.href} className={`flex flex-col items-center justify-center gap-3 p-6 rounded-xl border ${item.color} hover:shadow-md hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 text-center h-full`}>
                    <div className="text-3xl filter drop-shadow-sm">{item.icon}</div>
                    <span className="font-bold text-sm">{t(item.labelKey)}</span>
                  </a>
                ))}
             </div>
          </div>
        )}

        {/* НОВОСТИ */}
        {widgets.find(w => w.id === "news")?.visible && (
          <div className="space-y-3 animate-in fade-in slide-in-from-bottom-4 delay-300">
            <div className="flex justify-between items-center px-1">
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">{t('latest_news')}</h3>
              <a href="/blog" className="text-xs text-primary hover:underline flex items-center gap-1 font-medium transition-colors hover:text-blue-600">{t('all_news')} <ExternalLink size={12}/></a>
            </div>
            <div className="card p-0 border-border hover:border-primary/50 transition-colors">
              {MOCK_NEWS.map((news, idx) => (
                <div key={idx} className={`p-4 border-b last:border-0 hover:bg-muted/50 transition-colors cursor-pointer group ${idx === 0 ? 'rounded-t-xl' : ''} ${idx === MOCK_NEWS.length - 1 ? 'rounded-b-xl' : ''}`}>
                  <div className="font-semibold text-sm text-foreground group-hover:text-primary transition-colors">{news.title}</div>
                  <div className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                    <Newspaper size={12} className="opacity-50"/> {news.time}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}