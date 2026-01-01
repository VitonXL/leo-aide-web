"use client";

import { useState } from "react";
import { 
  Plus, TrendingUp, Settings, Calendar, Bell, Calculator, 
  CreditCard, Utensils, Car, Home, Gamepad2, ShoppingBag, Briefcase, 
  Download, Target, FileText, PieChart, Users, Share2, PiggyBank, Percent, ArrowUpRight, ArrowDownRight, Server, Wallet
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  PieChart as RechartsPieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip, 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, LineChart, Line
} from "recharts";

const CATEGORIES = [
  { id: 'food', name: 'Еда', icon: Utensils, color: '#4CAF50' },
  { id: 'transport', name: 'Транспорт', icon: Car, color: '#2196F3' },
  { id: 'housing', name: 'Жилье', icon: Home, color: '#9C27B0' },
  { id: 'entertainment', name: 'Развлечения', icon: Gamepad2, color: '#E91E63' },
  { id: 'shopping', name: 'Покупки', icon: ShoppingBag, color: '#FF9800' },
  { id: 'salary', name: 'Зарплата', icon: Briefcase, color: '#4CAF50' },
];

const MOCK_REMINDERS = [
  { id: 1, title: "Аренда квартиры", date: "28", amount: 35000, type: "expense" },
  { id: 2, title: "Зарплата", date: "05", amount: 120000, type: "income" },
];

// Mock Subscriptions
const INITIAL_SUBS = [
  { id: 1, name: "Netflix", price: 899, cycle: "месяц", nextDate: "2023-11-15" },
  { id: 2, name: "Spotify", price: 199, cycle: "месяц", nextDate: "2023-11-20" },
];

export default function FinancePage() {
  // --- CORE DATA ---
  const [operations, setOperations] = useState([
    { id: 1, type: 'expense', category: 'Еда', amount: 15000, categoryId: 'food' },
    { id: 2, type: 'expense', category: 'Транспорт', amount: 3000, categoryId: 'transport' },
    { id: 3, type: 'expense', category: 'Жилье', amount: 20000, categoryId: 'housing' },
    { id: 4, type: 'income', category: 'Зарплата', amount: 120000, categoryId: 'salary' },
  ]);
  const [newOp, setNewOp] = useState({ amount: '', categoryId: 'food', type: 'expense' });
  
  // --- BUDGET STATE (Planning) ---
  const [categoryBudgets, setCategoryBudgets] = useState<Record<string, number>>({
    food: 20000, transport: 5000, entertainment: 10000, housing: 35000, shopping: 15000
  });

  // --- ANALYSIS STATE (Tax, Savings, Sharing) ---
  const [taxRate, setTaxRate] = useState(13); // НДФЛ %
  const [savingsPercent, setSavingsPercent] = useState(20); // % от чистого дохода
  const [partners, setPartners] = useState<string[]>([]);
  const [newPartnerEmail, setNewPartnerEmail] = useState("");
  const [shareBudget, setShareBudget] = useState(false);

  // --- SUBSCRIPTIONS STATE ---
  const [subs, setSubs] = useState(INITIAL_SUBS);
  const [isPremium] = useState(true); // Mock premium status
  const [newSub, setNewSub] = useState({ name: "", price: "", cycle: "месяц" });

  // --- BOT FUNDING STATE ---
  const [fundingTarget, setFundingTarget] = useState(5000);
  const [currentFunding, setCurrentFunding] = useState(3450); // Mock collected

  // --- HELPERS ---
  const totalIncome = operations.filter(o => o.type === 'income').reduce((a, b) => a + b.amount, 0);
  const totalExpense = operations.filter(o => o.type === 'expense').reduce((a, b) => a + b.amount, 0);
  
  // Расчет налогов
  const taxAmount = totalIncome * (taxRate / 100);
  const netIncome = totalIncome - taxAmount;
  
  // Расчет сбережений
  const potentialSavings = Math.max(0, netIncome - totalExpense) * (savingsPercent / 100);
  const remainingAfterSavings = netIncome - totalExpense - potentialSavings;

  // Данные для графиков
  const chartData = operations.filter(op => op.type === 'expense')
    .reduce((acc: any[], curr) => {
      const existing = acc.find(item => item.name === curr.category);
      if (existing) {
        existing.value += curr.amount;
      } else {
        const catDef = CATEGORIES.find(c => c.id === curr.categoryId);
        acc.push({ name: curr.category, value: curr.amount, color: catDef?.color || '#ccc' });
      }
      return acc;
    }, []);

  // --- PROGNOSIS LOGIC (Mock) ---
  const forecastData = CATEGORIES.filter(c => c.id !== 'salary').map(cat => {
    const currentSpent = operations.filter(o => o.categoryId === cat.id && o.type === 'expense').reduce((s, o) => s + o.amount, 0);
    const predicted = Math.floor(currentSpent * (1 + (Math.random() * 0.4 - 0.2)));
    return {
      category: cat.name,
      current: currentSpent,
      predicted: predicted
    };
  });

  // --- HANDLERS ---
  const addOperation = () => {
    if (!newOp.amount) return;
    const catDef = CATEGORIES.find(c => c.id === newOp.categoryId);
    setOperations([...operations, {
      id: Date.now(),
      type: newOp.type,
      category: catDef?.name || 'Разное',
      categoryId: newOp.categoryId,
      amount: parseFloat(newOp.amount),
    }]);
    setNewOp({ amount: '', categoryId: 'food', type: 'expense' });
  };

  const addPartner = () => {
    if (!newPartnerEmail || !newPartnerEmail.includes('@')) return;
    setPartners([...partners, newPartnerEmail]);
    setNewPartnerEmail("");
  };

  const addSubscription = () => {
    if (!isPremium && subs.length >= 3) {
      alert("Для добавления более 3 подписок необходим Premium");
      return;
    }
    if (!newSub.name || !newSub.price) return;
    setSubs([...subs, {
      id: Date.now(),
      name: newSub.name,
      price: parseFloat(newSub.price),
      cycle: newSub.cycle,
      nextDate: "1 числа"
    }]);
    setNewSub({ name: "", price: "", cycle: "месяц" });
  };

  const removeSub = (id: number) => setSubs(subs.filter(s => s.id !== id));

  const fundingPercent = Math.min((currentFunding / fundingTarget) * 100, 100);

  return (
    <div className="fade-in main-content">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <PieChart className="text-primary" /> Финансы
        </h1>
        <button className="btn btn-outline btn-sm">
          <Download className="mr-2 h-4 w-4"/> Экспорт
        </button>
      </div>

      {/* Global Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="stat-card">
          <div className="stat-title text-green-700"><TrendingUp className="h-4 w-4"/> Баланс</div>
          <div className="text-2xl font-bold">{(totalIncome - totalExpense).toLocaleString()} ₽</div>
        </div>
        <div className="stat-card">
          <div className="stat-title text-blue-700"><PiggyBank className="h-4 w-4"/> Прогноз сбережений</div>
          <div className="text-2xl font-bold">{potentialSavings.toLocaleString()} ₽</div>
          <div className="text-xs text-muted-foreground">при ставке {savingsPercent}%</div>
        </div>
        <div className="stat-card">
           <div className="stat-title text-purple-700"><Percent className="h-4 w-4"/> Налоги (НДФЛ)</div>
           <div className="text-2xl font-bold">-{taxAmount.toLocaleString()} ₽</div>
           <div className="text-xs text-muted-foreground">{taxRate}% от дохода</div>
        </div>
         <div className="stat-card">
           <div className="stat-title text-orange-700"><Target className="h-4 w-4"/> Остаток накоплений</div>
           <div className="text-2xl font-bold">{remainingAfterSavings.toLocaleString()} ₽</div>
           <div className="text-xs text-muted-foreground">свободных средств</div>
        </div>
      </div>

      <Tabs defaultValue="dashboard" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5 h-auto">
          <TabsTrigger value="dashboard" className="py-3">Обзор</TabsTrigger>
          <TabsTrigger value="subs">Подписки</TabsTrigger>
          <TabsTrigger value="planning" className="py-3">Планирование</TabsTrigger>
          <TabsTrigger value="forecast" className="py-3">Прогноз</TabsTrigger>
          <TabsTrigger value="analysis" className="py-3">Анализ</TabsTrigger>
        </TabsList>

        {/* --- 1. ОБЗОР (DASHBOARD) --- */}
        <TabsContent value="dashboard" className="space-y-6">
          <div className="card">
            <h3 className="section-title">📝 Новая операция</h3>
            <div className="flex flex-col md:flex-row gap-2 mb-2">
              <button className={`btn flex-1 ${newOp.type === 'income' ? 'btn-primary' : 'btn-outline'}`} onClick={() => setNewOp({...newOp, type: 'income'})}>Доход</button>
              <button className={`btn flex-1 ${newOp.type === 'expense' ? 'btn-danger' : 'btn-outline'}`} onClick={() => setNewOp({...newOp, type: 'expense'})}>Расход</button>
            </div>
            <div className="flex gap-2">
              <Input type="number" placeholder="Сумма" value={newOp.amount} onChange={e => setNewOp({...newOp, amount: e.target.value})} className="flex-1" />
              <Select value={newOp.categoryId} onValueChange={(v) => setNewOp({...newOp, categoryId: v})}>
                 <SelectTrigger className="w-[140px]"><SelectValue /></SelectTrigger>
                 <SelectContent>{CATEGORIES.map(c => <SelectItem key={c.id} value={c.id}>{c.icon ? <c.icon size={14} className="mr-2 inline"/> : ''}{c.name}</SelectItem>)}</SelectContent>
              </Select>
              <button onClick={addOperation} className="btn btn-primary"><Plus className="h-4 w-4"/></button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="card">
              <h3 className="section-title">Структура расходов</h3>
              <div className="h-[250px] w-full">
                 <ResponsiveContainer width="100%" height="100%">
                   <RechartsPieChart>
                     <Pie data={chartData} innerRadius={40} outerRadius={80} paddingAngle={5} dataKey="value">
                       {chartData.map((entry, index) => (<Cell key={`cell-${index}`} fill={entry.color} />))}
                     </Pie>
                     <Tooltip />
                   </RechartsPieChart>
                 </ResponsiveContainer>
              </div>
            </div>
            <div className="card">
              <h3 className="section-title"><Calendar className="h-5 w-5"/> Ближайшие события</h3>
              <div className="space-y-3 pt-2">
                 {MOCK_REMINDERS.map((rem) => (
                    <div key={rem.id} className="p-3 rounded-lg border bg-card flex justify-between items-center">
                      <div>
                        <span className="font-medium text-sm">{rem.title}</span>
                        <div className="text-xs text-muted-foreground">{rem.date} числа • {rem.amount.toLocaleString()}</div>
                      </div>
                      <button className={`btn-sm ${rem.type === 'income' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {rem.type === 'income' ? 'Вход' : 'Исход'}
                      </button>
                    </div>
                 ))}
              </div>
            </div>
          </div>
        </TabsContent>

        {/* --- 1.5 ПОДПИСКИ (SUBSCRIPTIONS) --- */}
        <TabsContent value="subs">
           <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
             <div className="card">
               <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-bold flex items-center gap-2"><CreditCard className="text-primary"/> Трекер подписок</h3>
                  {!isPremium && (
                    <span className="text-xs text-orange-600 font-bold bg-orange-50 px-2 py-1 rounded">Лимит: {3 - subs.length}/3</span>
                  )}
                  {isPremium && (
                    <span className="text-xs text-green-600 font-bold bg-green-50 px-2 py-1 rounded flex items-center gap-1"><Crown size={12}/> Premium</span>
                  )}
               </div>
               
               <div className="space-y-3">
                  {subs.map(sub => (
                    <div key={sub.id} className="flex items-center justify-between p-3 rounded-lg border bg-card hover:shadow-md transition-shadow">
                       <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400">
                             <CreditCard size={20} />
                          </div>
                          <div>
                             <div className="font-semibold">{sub.name}</div>
                             <div className="text-xs text-muted-foreground">{sub.price} ₽ / {sub.cycle}</div>
                          </div>
                       </div>
                       <button onClick={() => removeSub(sub.id)} className="text-muted-foreground hover:text-red-500 transition-colors p-2">
                          ✕
                       </button>
                    </div>
                  ))}
               </div>

               <div className="mt-4 pt-4 border-t space-y-3">
                  <h4 className="text-sm font-semibold">Добавить подписку</h4>
                  <div className="flex gap-2">
                     <Input placeholder="Название (Netflix)" value={newSub.name} onChange={e => setNewSub({...newSub, name: e.target.value})} className="flex-1"/>
                     <Input placeholder="Цена" type="number" value={newSub.price} onChange={e => setNewSub({...newSub, price: e.target.value})} className="w-24"/>
                     <Select value={newSub.cycle} onValueChange={(v) => setNewSub({...newSub, cycle: v})}>
                       <SelectTrigger className="w-[110px]"><SelectValue/></SelectTrigger>
                       <SelectContent><SelectItem value="месяц">Месяц</SelectItem><SelectItem value="год">Год</SelectItem></SelectContent>
                     </Select>
                     <button onClick={addSubscription} className="btn btn-outline h-10 px-3"><Plus size={18}/></button>
                  </div>
                  {!isPremium && subs.length >= 3 && (
                     <div className="text-xs text-center text-muted-foreground mt-2">
                       Для добавления большего количества оформите <a href="/premium" className="text-primary underline">Premium</a>
                     </div>
                  )}
               </div>
             </div>

             {/* БОТ ФИНАНСИРОВАНИЕ */}
             <div className="card bg-gradient-to-br from-purple-50 to-white dark:from-purple-900/20 dark:to-gray-900 border-purple-100 dark:border-purple-800">
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2 text-purple-700 dark:text-purple-400"><Server className="h-5 w-5"/> Финансирование бота</h3>
                
                <div className="mb-6">
                   <div className="flex justify-between text-sm mb-2">
                      <span>Собрано средств</span>
                      <span className="font-bold">{currentFunding.toLocaleString()} / {fundingTarget.toLocaleString()} ₽</span>
                   </div>
                   <div className="h-4 w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                      <div className="h-full bg-purple-600 transition-all duration-1000" style={{ width: `${fundingPercent}%` }}></div>
                   </div>
                   <div className="text-xs text-muted-foreground mt-2 text-right">{fundingPercent.toFixed(0)}% от цели</div>
                </div>

                <div className="space-y-3">
                   <div className="flex items-center justify-between text-sm border-b pb-2">
                      <span className="flex items-center gap-2"><Server size={14}/> Хостинг (VPS)</span>
                      <span className="font-mono">500 ₽</span>
                   </div>
                   <div className="flex items-center justify-between text-sm border-b pb-2">
                      <span className="flex items-center gap-2"><Globe size={14}/> Домен</span>
                      <span className="font-mono">100 ₽</span>
                   </div>
                   <div className="flex items-center justify-between text-sm border-b pb-2">
                      <span className="flex items-center gap-2"><ShieldAlert size={14}/> Антивирус (API)</span>
                      <span className="font-mono">1500 ₽</span>
                   </div>
                   <div className="flex items-center justify-between text-sm border-b pb-2">
                      <span className="flex items-center gap-2"><Cloud size={14}/> Погода (API)</span>
                      <span className="font-mono">800 ₽</span>
                   </div>
                   <div className="flex items-center justify-between text-sm">
                      <span className="flex items-center gap-2"><MessageSquare size={14}/> GigaChat (API)</span>
                      <span className="font-mono">2000 ₽</span>
                   </div>
                </div>

                <div className="mt-6 pt-4 border-t border-purple-200 dark:border-purple-800">
                   <Button className="w-full btn-primary bg-purple-600 hover:bg-purple-700">
                      <Wallet className="h-4 w-4 mr-2"/> Внести вклад
                   </Button>
                   <p className="text-xs text-center text-muted-foreground mt-2">
                      Вы помогаете проекту жить. Все средства идут на оплату серверов и API.
                   </p>
                </div>
             </div>
           </div>
        </TabsContent>

        {/* --- 2. ПЛАНИРОВАНИЕ (BUDGETING) --- */}
        <TabsContent value="planning">
           <div className="card">
             <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold flex items-center gap-2"><Target className="text-primary"/> Бюджет на месяц</h3>
                <div className="text-sm text-muted-foreground">
                  Лимит: <span className="font-bold text-foreground">{Object.values(categoryBudgets).reduce((a,b) => a+b, 0).toLocaleString()} ₽</span>
                </div>
             </div>
             
             <div className="space-y-6">
                {CATEGORIES.filter(c => c.id !== 'salary').map(cat => {
                  const spent = operations.filter(o => o.categoryId === cat.id && o.type === 'expense').reduce((s, o) => s + o.amount, 0);
                  const limit = categoryBudgets[cat.id] || 0;
                  const percent = limit > 0 ? (spent / limit) * 100 : 0;
                  const isOver = spent > limit;

                  return (
                    <div key={cat.id} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className={`p-2 rounded-full ${cat.color.replace('#', 'bg-').replace(/,.*$/, '')} bg-opacity-10 text-[${cat.color}]`}>
                             <cat.icon size={18} className="text-gray-700" />
                          </div>
                          <div>
                            <div className="font-semibold">{cat.name}</div>
                            <div className="text-xs text-muted-foreground">Потрачено: {spent.toLocaleString()}</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                           <span className={`text-sm font-bold ${isOver ? 'text-red-500' : 'text-green-600'}`}>
                              {isOver ? `+${(spent - limit).toLocaleString()}` : `${(limit - spent).toLocaleString()}`}
                           </span>
                           <div className="w-24">
                             <Input 
                               type="number" 
                               value={limit} 
                               onChange={(e) => setCategoryBudgets({...categoryBudgets, [cat.id]: Number(e.target.value)})}
                               className="h-8 text-right"
                             />
                           </div>
                        </div>
                      </div>
                      <div className="h-3 w-full bg-secondary rounded-full overflow-hidden relative">
                        <div 
                          className={`h-full ${isOver ? 'bg-red-500' : cat.color} transition-all duration-500`} 
                          style={{ width: `${Math.min(percent, 100)}%` }}
                        ></div>
                        {isOver && <div className="absolute top-0 right-0 h-full w-1 bg-white animate-pulse"></div>}
                      </div>
                    </div>
                  )
                })}
             </div>
           </div>
        </TabsContent>

        {/* --- 3. ПРОГНОЗ (FORECASTING) --- */}
        <TabsContent value="forecast">
           <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
             <div className="card">
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2"><TrendingUp className="text-blue-500"/> Прогноз на след. месяц</h3>
                <p className="text-sm text-muted-foreground mb-6">
                  На основе текущих паттернов трат мы прогнозируем следующие расходы на следующий месяц.
                </p>
                
                <div className="space-y-4">
                  {forecastData.map(item => (
                    <div key={item.category} className="flex items-center justify-between text-sm border-b pb-2 last:border-0">
                       <span className="text-muted-foreground">{item.category}</span>
                       <div className="flex items-center gap-3">
                          <span className="text-gray-500 line-through">{item.current.toLocaleString()}</span>
                          <span className={`font-bold ${item.predicted > item.current ? 'text-orange-500' : 'text-green-500'}`}>
                             {item.predicted.toLocaleString()} ₽
                          </span>
                          <span className={`w-6 h-6 rounded-full flex items-center justify-center text-white ${item.predicted > item.current ? 'bg-orange-500' : 'bg-green-500'}`}>
                             {item.predicted > item.current ? <ArrowUpRight size={12}/> : <ArrowDownRight size={12}/>}
                          </span>
                       </div>
                    </div>
                  ))}
                  <div className="pt-4 border-t flex justify-between items-center font-bold">
                    <span>Итого прогноз</span>
                    <span className="text-lg">
                      {forecastData.reduce((a, b) => a + b.predicted, 0).toLocaleString()} ₽
                    </span>
                  </div>
                </div>
             </div>

             <div className="card">
                <h3 className="text-lg font-bold mb-4">Визуализация динамики</h3>
                <div className="h-[300px] w-full">
                   <ResponsiveContainer width="100%" height="100%">
                     <BarChart data={forecastData}>
                       <CartesianGrid strokeDasharray="3 3" vertical={false} />
                       <XAxis dataKey="category" tick={{ fontSize: 10 }} />
                       <YAxis />
                       <Tooltip />
                       <Bar dataKey="current" fill="#9CA3AF" name="Текущий месяц" radius={[4, 4, 0, 0]} />
                       <Bar dataKey="predicted" fill="#4CAF50" name="Прогноз" radius={[4, 4, 0, 0]} />
                     </BarChart>
                   </ResponsiveContainer>
                </div>
             </div>
           </div>
        </TabsContent>

        {/* --- 4. АНАЛИЗ (ANALYSIS: TAX, SAVINGS, PARTNERS) --- */}
        <TabsContent value="analysis">
           <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              {/* Налоги и Сбережения */}
              <div className="space-y-6">
                 <div className="card">
                    <h3 className="section-title flex items-center gap-2"><Percent className="h-5 w-5"/> Калькулятор налогов</h3>
                    <div className="space-y-4">
                       <div className="flex justify-between items-center">
                          <label className="text-sm font-medium">Ставка НДФЛ</label>
                          <div className="flex items-center gap-2">
                             <Input type="number" value={taxRate} onChange={e => setTaxRate(Number(e.target.value))} className="w-20 text-right h-8" />
                             <span className="text-sm text-muted-foreground">%</span>
                          </div>
                       </div>
                       <div className="p-4 bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800 rounded-lg flex justify-between items-center">
                          <span className="text-sm font-medium text-red-700 dark:text-red-400">К уплате налогов</span>
                          <span className="text-xl font-bold text-red-800 dark:text-red-300">-{taxAmount.toLocaleString()} ₽</span>
                       </div>
                       <div className="p-4 bg-green-50 dark:bg-green-900/10 border border-green-200 dark:border-green-800 rounded-lg flex justify-between items-center">
                          <span className="text-sm font-medium text-green-700 dark:text-green-400">Чистый доход (На руки)</span>
                          <span className="text-xl font-bold text-green-800 dark:text-green-300">{netIncome.toLocaleString()} ₽</span>
                       </div>
                    </div>
                 </div>

                 <div className="card">
                    <h3 className="section-title flex items-center gap-2"><PiggyBank className="h-5 w-5"/> Накопления</h3>
                    <div className="space-y-4">
                       <div>
                          <div className="flex justify-between mb-1">
                             <label className="text-sm font-medium">Откладывать</label>
                             <span className="text-sm text-muted-foreground">{savingsPercent}% от чистого дохода</span>
                          </div>
                          <input 
                             type="range" 
                             min="0" 
                             max="100" 
                             value={savingsPercent} 
                             onChange={(e) => setSavingsPercent(Number(e.target.value))}
                             className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                          />
                       </div>
                       <div className="p-4 bg-blue-50 dark:bg-blue-900/10 border border-blue-200 dark:border-blue-800 rounded-lg text-center">
                          <div className="text-xs text-blue-600 dark:text-blue-400 uppercase tracking-wider mb-1">Сумма накоплений</div>
                          <div className="text-3xl font-extrabold text-blue-800 dark:text-blue-300">
                             {potentialSavings.toLocaleString()} ₽
                          </div>
                       </div>
                    </div>
                 </div>
              </div>

              {/* Совместное использование */}
              <div className="card">
                 <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold flex items-center gap-2"><Users className="text-primary"/> Семейный бюджет</h3>
                    <Switch checked={shareBudget} onCheckedChange={setShareBudget} />
                 </div>

                 <div className="space-y-6">
                    <div className={`p-4 rounded-lg border ${shareBudget ? 'bg-primary/5 border-primary' : 'bg-muted border-muted opacity-50'}`}>
                       <p className="text-sm leading-relaxed">
                          {shareBudget 
                            ? "Совместный доступ активен. Вы и ваши партнеры можете редактировать бюджет и добавлять операции в реальном времени." 
                            : "Включите эту функцию, чтобы пригласить супруга или партнера для совместного ведения бюджета."}
                       </p>
                    </div>

                    {shareBudget && (
                       <>
                          <div className="flex gap-2">
                             <Input 
                               placeholder="email@example.com" 
                               value={newPartnerEmail}
                               onChange={e => setNewPartnerEmail(e.target.value)}
                               onKeyDown={e => e.key === 'Enter' && addPartner()}
                             />
                             <button onClick={addPartner} className="btn btn-outline">
                                <Share2 className="h-4 w-4 mr-1"/> Пригласить
                             </button>
                          </div>

                          {partners.length > 0 && (
                             <div className="space-y-2 mt-4">
                                <div className="text-xs font-bold text-muted-foreground uppercase">Участники</div>
                                {partners.map((email, idx) => (
                                   <div key={idx} className="flex justify-between items-center p-2 bg-card border rounded-md">
                                      <div className="flex items-center gap-2">
                                         <div className="w-8 h-8 rounded-full bg-green-100 text-green-600 flex items-center justify-center text-xs font-bold">
                                            {email.charAt(0).toUpperCase()}
                                         </div>
                                         <span className="text-sm font-medium">{email}</span>
                                      </div>
                                      <span className="text-xs text-green-600 flex items-center gap-1"><Check size={12}/> Доступ</span>
                                   </div>
                                ))}
                             </div>
                          )}
                       </>
                    )}
                 </div>
              </div>
           </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}