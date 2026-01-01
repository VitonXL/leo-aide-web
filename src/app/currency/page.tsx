"use client";

import { useState, useEffect } from "react";
import { RefreshCw, TrendingUp, TrendingDown, AlertCircle, Bell, BarChart3, Table as TableIcon, Globe, Clock, ArrowUpRight, ArrowDownRight, X, Plus, LineChart as LineChartIcon } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, BarChart, Bar } from "recharts";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Types
type Currency = "RUB" | "USD" | "EUR" | "CNY" | "JPY" | "KZT" | "UAH" | "BYN" | "KGS" | "TRY" | "AED" | "GBP";
type TimeRange = "1D" | "1W" | "1M";
type ViewMode = "chart" | "table" | "diagram";

// --- NEW TYPE FOR ALERTS ---
interface CurrencyAlert {
  id: number;
  currency: Currency;
  condition: "above" | "below";
  targetRate: number;
}

// Mock Data
const BASE_RATES: Record<Currency, number> = {
  RUB: 1.0,
  USD: 92.50,
  EUR: 101.20,
  CNY: 12.80,
  JPY: 0.62,
  KZT: 0.19,
  UAH: 2.45,
  BYN: 28.50,
  KGS: 1.05,
  TRY: 2.90,
  AED: 25.20,
  GBP: 115.40
};

const CURRENCIES = [
  { code: "RUB", name: "Рубль", flag: "🇷🇺" },
  { code: "USD", name: "Доллар США", flag: "🇺🇸" },
  { code: "EUR", name: "Евро", flag: "🇪🇺" },
  { code: "GBP", name: "Фунт Стерлингов", flag: "🇬🇧" },
  { code: "CNY", name: "Юань", flag: "🇨🇳" },
  { code: "AED", name: "Дирхам (ОАЭ)", flag: "🇦🇪" },
  { code: "KZT", name: "Тенге", flag: "🇰🇿" },
  { code: "UAH", name: "Гривна", flag: "🇺🇦" },
  { code: "TRY", name: "Лира", flag: "🇹🇷" },
];

// --- DATA: FACTORS AFFECTING RATES ---
const NEWS_FACTORS = [
  { id: 1, title: "Снижение ключевой ставки ЦБ до 16%", impact: "negative", desc: "Давит на рубль вниз", date: "2 часа назад" },
  { id: 2, title: "Рост цен на нефть +2%", impact: "positive", desc: "Поддерживает рубль", date: "Вчера" },
  { id: 3, title: "Новые санкции ЕС", impact: "negative", desc: "Риск падения рубля", date: "3 дня назад" },
  { id: 4, title: "Экспорт зерновых рекордный", impact: "positive", desc: "Положительно влияет на торговый баланс", date: "5 дней назад" },
  { id: 5, title: "Отток капитала", impact: "negative", desc: "Давит на валютный рынок", date: "1 неделю назад" },
];

const generateHistory = (baseValue: number, range: TimeRange) => {
  const data = [];
  let current = baseValue;
  const now = new Date();
  let points = 24; 
  if (range === "1W") points = 7;
  if (range === "1M") points = 30;

  for (let i = points; i >= 0; i--) {
    const date = new Date(now);
    if (range === "1D") date.setHours(date.getHours() - i);
    else date.setDate(date.getDate() - i);
    const volatility = (Math.random() - 0.5) * (baseValue * 0.015);
    current += volatility;
    data.push({
      date: range === "1D" 
        ? date.toLocaleTimeString("ru", { hour: "2-digit", minute: "2-digit" }) 
        : date.toLocaleDateString("ru", { day: "numeric", month: "short" }),
      value: parseFloat(current.toFixed(4)),
    });
  }
  return data;
};

export default function CurrencyPage() {
  const [rates, setRates] = useState(BASE_RATES);
  const [selectedCurrency, setSelectedCurrency] = useState<Currency>("USD");
  const [timeRange, setTimeRange] = useState<TimeRange>("1W");
  const [viewMode, setViewMode] = useState<ViewMode>("diagram"); // Default to diagram for overview
  const [historyData, setHistoryData] = useState(generateHistory(BASE_RATES.USD, "1W"));
  const [lastUpdate, setLastUpdate] = useState(new Date());
  
  const [amount, setAmount] = useState(100);
  const [fromCurrency, setFromCurrency] = useState<Currency>("USD");
  const [toCurrency, setToCurrency] = useState<Currency>("EUR");
  
  // --- ALERT STATE ---
  const [alertRate, setAlertRate] = useState("");
  const [alertCondition, setAlertCondition] = useState<"above" | "below">("below");
  const [activeAlerts, setActiveAlerts] = useState<CurrencyAlert[]>([]);

  // --- DATA FOR DIAGRAM VIEW ---
  const diagramData = CURRENCIES.map(c => ({
    name: c.code,
    fullName: c.name,
    value: rates[c.code as Currency],
    flag: c.flag
  })).sort((a, b) => b.value - a.value);

  useEffect(() => {
    const interval = setInterval(() => {
      setRates(prev => {
        const newRates = { ...prev };
        const key = selectedCurrency;
        
        // Don't fluctuate base currency (RUB)
        if (key === "RUB") return newRates;

        // Random fluctuation
        const change = (Math.random() - 0.5) * 0.2; 
        newRates[key] = parseFloat((newRates[key] + change).toFixed(4));
        
        // --- CHECK ALERTS ---
        activeAlerts.forEach(alert => {
          const currentRate = newRates[alert.currency];
          let triggered = false;
          
          if (alert.condition === "below" && currentRate < alert.targetRate) {
            triggered = true;
          } else if (alert.condition === "above" && currentRate > alert.targetRate) {
            triggered = true;
          }

          if (triggered) {
            // Trigger Notification
            if (window && (window as any).Toast) {
              (window as any).Toast.success(`🔔 Сработало уведомление: ${alert.currency} ${alert.condition === 'below' ? '<' : '>'} ${alert.targetRate} ₽ (Текущий: ${currentRate.toFixed(2)})`);
            }
            // Remove triggered alert
            setActiveAlerts(prev => prev.filter(a => a.id !== alert.id));
          }
        });

        return newRates;
      });
      setLastUpdate(new Date());
    }, 5000); // Increased to 5s for demo purposes to see changes
    return () => clearInterval(interval);
  }, [selectedCurrency, activeAlerts]);

  useEffect(() => {
    setHistoryData(generateHistory(rates[selectedCurrency], timeRange));
  }, [selectedCurrency, timeRange, rates]);

  const refreshRates = () => {
    setRates(prev => {
      const newRates = { ...prev };
      Object.keys(newRates).forEach(key => {
        if (key !== "RUB") {
            newRates[key as Currency] = parseFloat((newRates[key as Currency] * (1 + (Math.random() - 0.5) * 0.005)).toFixed(4));
        }
      });
      return newRates;
    });
    setLastUpdate(new Date());
    if (window && (window as any).Toast) (window as any).Toast.success("Курсы обновлены");
  };

  const convert = (val: number, from: Currency, to: Currency): string => {
    const inRub = val * rates[from];
    const result = inRub / rates[to];
    return result.toFixed(2);
  };

  const addAlert = () => {
    if (!alertRate) return;
    const rateNum = parseFloat(alertRate);
    if (isNaN(rateNum)) return;

    const newAlert: CurrencyAlert = {
      id: Date.now(),
      currency: selectedCurrency,
      condition: alertCondition,
      targetRate: rateNum
    };

    setActiveAlerts([...activeAlerts, newAlert]);
    setAlertRate("");
    if (window && (window as any).Toast) {
      (window as any).Toast.info(`Уведомление создано для ${selectedCurrency}`);
    }
  };

  const removeAlert = (id: number) => {
    setActiveAlerts(activeAlerts.filter(a => a.id !== id));
  };

  const currentCurrencyInfo = CURRENCIES.find(c => c.code === selectedCurrency);

  return (
    <div className="fade-in main-content">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            💵 Курсы валют
          </h1>
          <div className="text-sm text-muted-foreground flex items-center gap-2 mt-1">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
            Обновлено: {lastUpdate.toLocaleTimeString()}
          </div>
        </div>
        <button className="btn btn-outline" onClick={refreshRates}>
          <RefreshCw className="h-4 w-4" /> Обновить
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        <div className="lg:col-span-8 space-y-6">
          <div className="card">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center pb-4 border-b mb-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-bold flex items-center gap-2">
                    {currentCurrencyInfo?.flag} {selectedCurrency} / RUB
                  </h2>
                </div>
                <p className="text-sm text-muted-foreground">Центробанк РФ</p>
              </div>
              <Select value={selectedCurrency} onValueChange={(v) => setSelectedCurrency(v as Currency)}>
                <SelectTrigger className="w-[160px]">
                  <SelectValue placeholder="Валюта" />
                </SelectTrigger>
                <SelectContent>
                  {CURRENCIES.map(c => (
                    <SelectItem key={c.code} value={c.code}>{c.flag} {c.code}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Current Rate Display */}
            <div className="flex items-end gap-6 mb-6">
              <div className="text-5xl font-bold tracking-tight">{rates[selectedCurrency].toFixed(4)} ₽</div>
              <div className={`flex flex-col pb-2 ${Math.random() > 0.5 ? 'text-green-600' : 'text-red-500'}`}>
                <div className="flex items-center gap-1 font-bold text-lg">
                  {Math.random() > 0.5 ? <TrendingUp size={20} /> : <TrendingDown size={20} />}
                  {(Math.abs(Math.random() * 0.5)).toFixed(4)}%
                </div>
                <div className="text-xs opacity-75">за сегодня</div>
              </div>
            </div>

            {/* View Switcher & Controls */}
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6 pb-4 border-b">
              {/* Time Range - Only relevant for Line Chart */}
              <div className={`flex bg-muted p-1 rounded-lg ${viewMode !== 'chart' ? 'opacity-50 pointer-events-none' : ''}`}>
                {(["1D", "1W", "1M"] as TimeRange[]).map((range) => (
                  <button
                    key={range}
                    onClick={() => setTimeRange(range)}
                    className={`px-3 py-1.5 text-sm rounded-md transition-all font-medium ${timeRange === range ? "bg-white dark:bg-gray-800 shadow-sm text-black dark:text-white" : "text-muted-foreground hover:bg-white/50 dark:hover:bg-white/10"}`}
                  >
                    {range === "1D" ? "День" : range === "1W" ? "Неделя" : "Месяц"}
                  </button>
                ))}
              </div>

              {/* View Mode Switcher */}
              <div className="flex bg-muted p-1 rounded-lg">
                 <button
                   className={`flex items-center gap-2 px-4 py-1.5 text-sm rounded-md transition-all font-medium ${viewMode === 'diagram' ? "bg-white dark:bg-gray-800 shadow-sm text-black dark:text-white" : "text-muted-foreground hover:bg-white/50 dark:hover:bg-white/10"}`}
                   onClick={() => setViewMode('diagram')}
                 >
                  <BarChart3 className="h-4 w-4"/> Сравнение
                 </button>
                 <button 
                   className={`flex items-center gap-2 px-4 py-1.5 text-sm rounded-md transition-all font-medium ${viewMode === 'chart' ? "bg-white dark:bg-gray-800 shadow-sm text-black dark:text-white" : "text-muted-foreground hover:bg-white/50 dark:hover:bg-white/10"}`}
                   onClick={() => setViewMode('chart')}
                 >
                  <LineChartIcon className="h-4 w-4"/> График
                 </button>
                 <button 
                   className={`flex items-center gap-2 px-4 py-1.5 text-sm rounded-md transition-all font-medium ${viewMode === 'table' ? "bg-white dark:bg-gray-800 shadow-sm text-black dark:text-white" : "text-muted-foreground hover:bg-white/50 dark:hover:bg-white/10"}`}
                   onClick={() => setViewMode('table')}
                 >
                  <TableIcon className="h-4 w-4"/> Таблица
                 </button>
              </div>
            </div>

            {/* --- VIEW: DIAGRAM (BAR CHART) --- */}
            {viewMode === 'diagram' && (
              <div className="h-[350px] w-full animate-in fade-in slide-in-from-bottom-2">
                <div className="text-center mb-4 text-sm text-muted-foreground">Сравнение стоимости валют относительно Рубля</div>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={diagramData} layout="horizontal" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" vertical={false} />
                    <XAxis dataKey="name" type="category" tick={{ fontSize: 12 }} tickLine={false} axisLine={false} />
                    <YAxis type="number" hide />
                    <Tooltip 
                      cursor={{ fill: 'rgba(51, 121, 110, 0.1)' }}
                      contentStyle={{ borderRadius: '8px', border: '1px solid var(--border-light)', backgroundColor: 'var(--bg-secondary)' }}
                      formatter={(value: number, name: string, props: any) => {
                        const item = props.payload;
                        return [`${value.toFixed(2)} ₽`, `${item.flag} ${item.name}`];
                      }}
                    />
                    <Bar dataKey="value" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} barSize={20} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}

            {/* --- VIEW: CHART (LINE CHART) --- */}
            {viewMode === 'chart' && (
              <div className="h-[350px] w-full animate-in fade-in">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={historyData}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" vertical={false} />
                    <XAxis dataKey="date" className="text-xs" tick={{ fill: 'var(--text-secondary)' }} />
                    <YAxis domain={['auto', 'auto']} className="text-xs" tick={{ fill: 'var(--text-secondary)' }} />
                    <Tooltip 
                      contentStyle={{ borderRadius: '8px', border: '1px solid var(--border-light)', backgroundColor: 'var(--bg-secondary)' }}
                      formatter={(value: number) => [`${value.toFixed(4)} ₽`, 'Курс']}
                    />
                    <Line type="monotone" dataKey="value" stroke="#4CAF50" strokeWidth={2} dot={false} activeDot={{ r: 4 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            )}

            {/* --- VIEW: TABLE --- */}
            {viewMode === 'table' && (
              <div className="max-h-[350px] overflow-y-auto border rounded-md bg-card animate-in fade-in">
                <table className="w-full text-sm text-left">
                  <thead className="text-xs uppercase bg-muted sticky top-0">
                    <tr>
                      <th className="px-4 py-3 font-medium">Дата / Время</th>
                      <th className="px-4 py-3 text-right font-medium">Курс (RUB)</th>
                      <th className="px-4 py-3 text-right font-medium">Изменение</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {historyData.map((row, idx) => (
                      <tr key={idx} className="hover:bg-muted/50 transition-colors">
                        <td className="px-4 py-3 text-muted-foreground">{row.date}</td>
                        <td className="px-4 py-3 text-right font-mono font-medium">{row.value}</td>
                        <td className="px-4 py-3 text-right">
                          {idx < historyData.length - 1 ? (
                            <span className={row.value > historyData[idx+1].value ? "text-green-600 font-bold" : "text-red-500 font-bold"}>
                              {row.value > historyData[idx+1].value ? "+" : ""}
                              {(row.value - historyData[idx+1].value).toFixed(4)}
                            </span>
                          ) : <span className="text-muted-foreground">-</span>}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        <div className="lg:col-span-4 space-y-6">
          
          {/* Анализ факторов */}
          <div className="card">
             <h3 className="section-title flex items-center gap-2"><Globe className="h-5 w-5"/> Анализ факторов</h3>
             <div className="space-y-3">
               <div className="text-xs text-muted-foreground bg-muted/50 p-2 rounded text-center">
                 Влияние на курс {selectedCurrency}
               </div>
               {NEWS_FACTORS.map((news) => (
                 <div key={news.id} className="flex gap-3 p-3 rounded-lg border hover:shadow-md transition-all bg-card">
                   <div className={`mt-1 flex-shrink-0 text-xs px-2 py-1 rounded font-medium uppercase tracking-wider ${
                     news.impact === 'positive' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                     news.impact === 'negative' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' :
                     'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400'
                   }`}>
                     {news.impact === 'positive' ? <><ArrowUpRight className="w-3 h-3 inline mr-1"/> Рост RUB</> : news.impact === 'negative' ? <><ArrowDownRight className="w-3 h-3 inline mr-1"/> Падение RUB</> : "⚖️ Нейтрально"}
                   </div>
                   <div className="flex-1 min-w-0">
                     <div className="text-sm font-semibold mb-1 truncate">{news.title}</div>
                     <div className="text-xs text-muted-foreground mb-1 truncate">{news.desc}</div>
                     <div className="text-xs text-muted-foreground flex items-center gap-1">
                       <Clock size={10} /> {news.date}
                     </div>
                   </div>
                 </div>
               ))}
             </div>
          </div>

          {/* Конвертер */}
          <div className="card">
            <h3 className="section-title">💱 Конвертер</h3>
            <div className="space-y-5">
              <div>
                <label className="text-sm font-medium mb-2 block">Сумма</label>
                <div className="relative">
                  <Input type="number" value={amount} onChange={(e) => setAmount(Number(e.target.value))} className="text-xl font-semibold pl-4 h-12" />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">{fromCurrency}</span>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">Отдаю</label>
                  <Select value={fromCurrency} onValueChange={(v) => setFromCurrency(v as Currency)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>{CURRENCIES.map(c => <SelectItem key={c.code} value={c.code}>{c.flag} {c.code}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">Получаю</label>
                  <Select value={toCurrency} onValueChange={(v) => setToCurrency(v as Currency)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>{CURRENCIES.map(c => <SelectItem key={c.code} value={c.code}>{c.flag} {c.code}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
              </div>

              <div className="p-4 bg-gradient-to-br from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 rounded-xl border border-green-100 dark:border-green-800 text-center relative overflow-hidden">
                <div className="text-xs text-muted-foreground mb-1 uppercase tracking-wider">Итого</div>
                <div className="text-4xl font-extrabold text-green-700 dark:text-green-400 mb-1">
                  {convert(amount, fromCurrency, toCurrency)}
                </div>
                <div className="text-sm font-medium text-green-600 dark:text-green-500">{toCurrency}</div>
                <div className="mt-3 pt-3 border-t border-green-200 dark:border-green-800 text-xs text-muted-foreground">
                  Курс: 1 {fromCurrency} ≈ {(rates[fromCurrency] / rates[toCurrency]).toFixed(4)} {toCurrency}
                </div>
              </div>
            </div>
          </div>

          {/* Уведомления */}
          <div className="card">
            <h3 className="section-title flex items-center gap-2"><Bell className="h-4 w-4"/> Уведомления</h3>
            <div className="space-y-4">
              
              {/* Active Alerts List */}
              {activeAlerts.length > 0 && (
                <div className="space-y-2">
                   <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Активные ({activeAlerts.length})</div>
                   {activeAlerts.map((alert) => (
                      <div key={alert.id} className="flex justify-between items-center p-2 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-md text-xs">
                        <div className="flex items-center gap-2">
                           <Bell className="h-3 w-3 text-blue-600" />
                           <span className="font-medium text-blue-700 dark:text-blue-300">
                              {alert.currency} {alert.condition === 'above' ? '>' : '<'} {alert.targetRate}
                           </span>
                        </div>
                        <button 
                          onClick={() => removeAlert(alert.id)}
                          className="text-blue-400 hover:text-red-500 transition-colors p-1 rounded hover:bg-red-50 dark:hover:bg-red-900/20"
                        >
                          <X size={12} />
                        </button>
                      </div>
                   ))}
                </div>
              )}

              {/* Add New Alert */}
              <div className="space-y-3 pt-2 border-t">
                <div className="flex items-center gap-2 text-sm text-muted-foreground"><AlertCircle className="h-4 w-4 text-orange-500" /> Создать новое:</div>
                <div className="flex gap-2">
                  <Select value={alertCondition} onValueChange={(v: any) => setAlertCondition(v)}>
                     <SelectTrigger className="w-[110px]"><SelectValue /></SelectTrigger>
                     <SelectContent><SelectItem value="below">Ниже</SelectItem><SelectItem value="above">Выше</SelectItem></SelectContent>
                  </Select>
                  <Input placeholder="90.00" type="number" step="0.01" value={alertRate} onChange={e => setAlertRate(e.target.value)} className="flex-1" />
                  <button 
                    onClick={addAlert} 
                    disabled={!alertRate || isNaN(parseFloat(alertRate))}
                    className="btn btn-primary h-9 px-3"
                  >
                    <Plus size={16} />
                  </button>
                </div>
                <div className="text-[10px] text-muted-foreground text-center">
                  Уведомление для {selectedCurrency} сработает автоматически.
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}