"use client";

import { useState } from "react";
import { LayoutDashboard, Users, DollarSign, Settings, Activity, Crown, TrendingUp, Headphones, Key, Download } from "lucide-react";
import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer, CartesianGrid, AreaChart, Area } from "recharts";

// --- MOCK DATA ---
const DASHBOARD_STATS = {
  activeUsers: 1250,
  churnRate: "2.4%",
  avgSession: "5m 30s",
  revenue: 154000, 
  serverLoad: 42, 
  errors: 3,
  premiumUsers: 342
};

const MOCK_USERS = [
  { id: 1, name: "Алексей И.", username: "@alex_ivan", status: "active", sub: "premium", joined: "2023-10-01", lastActive: "2 мин назад" },
  { id: 2, name: "Мария К.", username: "@maria_key", status: "active", sub: "free", joined: "2023-10-05", lastActive: "1 час назад" },
  { id: 3, name: "Дмитрий В.", username: "@dmitry_v", status: "blocked", sub: "free", joined: "2023-09-15", lastActive: "3 дня назад" },
  { id: 4, name: "Елена С.", username: "@elena_s", status: "active", sub: "expired", joined: "2023-08-20", lastActive: "Вчера" },
];

const REVENUE_DATA = [
  { name: "Пн", income: 12000, expense: 5000 },
  { name: "Вт", income: 15000, expense: 4500 },
  { name: "Ср", income: 11000, expense: 6000 },
  { name: "Чт", income: 18000, expense: 5200 },
  { name: "Пт", income: 22000, expense: 8000 },
  { name: "Сб", income: 25000, expense: 7000 },
  { name: "Вс", income: 20000, expense: 6500 },
];

export default function AdminDashboardPage() {
  const [users, setUsers] = useState(MOCK_USERS);

  const handleGrantPremium = (userId: number) => {
    alert(`Premium выдан пользователю ID: ${userId} (Эмуляция)`);
    setUsers(users.map(u => u.id === userId ? { ...u, sub: 'premium' } : u));
  };

  const handleBlockUser = (userId: number) => {
    const confirm = window.confirm("Вы уверены, что хотите заблокировать пользователя?");
    if (confirm) {
      setUsers(users.map(u => u.id === userId ? { ...u, status: 'blocked' } : u));
    }
  };

  return (
    <div className="fade-in main-content">
      <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <LayoutDashboard className="text-primary" /> Панель управления
        </h1>
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-full bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 text-xs font-bold">Admin Access</span>
          <div className="h-2 w-2 rounded-full bg-red-500 animate-pulse"></div>
        </div>
      </div>

      {/* --- СТАТИСТИКА --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
         <div className="stat-card">
           <div className="stat-title text-green-700"><Activity className="h-4 w-4 mr-1"/> Активно (День)</div>
           <div className="text-3xl font-bold">{DASHBOARD_STATS.activeUsers}</div>
           <div className="text-xs text-green-600 flex items-center gap-1 mt-1">
             <TrendingUp size={12}/> +5% к вчерашнему дню
           </div>
         </div>
         <div className="stat-card">
           <div className="stat-title text-purple-700"><Crown className="h-4 w-4 mr-1"/> Premium</div>
           <div className="text-3xl font-bold">{DASHBOARD_STATS.premiumUsers}</div>
           <div className="text-xs text-muted-foreground mt-1">
             {Math.round((DASHBOARD_STATS.premiumUsers / DASHBOARD_STATS.activeUsers) * 100)}% от базы
           </div>
         </div>
         <div className="stat-card">
           <div className="stat-title text-blue-700"><DollarSign className="h-4 w-4 mr-1"/> Доход (Сегодня)</div>
           <div className="text-3xl font-bold">{DASHBOARD_STATS.revenue.toLocaleString()} ₽</div>
         </div>
         <div className="stat-card">
           <div className="stat-title text-orange-700"><Headphones className="h-4 w-4 mr-1"/> Нагрузка</div>
           <div className="text-3xl font-bold">{DASHBOARD_STATS.serverLoad}%</div>
           <div className="text-xs text-muted-foreground mt-1">CPU Load</div>
         </div>
      </div>

      {/* ГРАФИКИ */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="card">
          <h3 className="section-title">💰 Доходы и Расходы</h3>
          <div className="h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={REVENUE_DATA}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                <Tooltip />
                <Bar dataKey="income" fill="#4CAF50" name="Доход" radius={[4, 4, 0, 0]} />
                <Bar dataKey="expense" fill="#F44336" name="Расход" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="card">
           <h3 className="section-title">🌐 Статус сервера</h3>
           <div className="h-[200px]">
             <ResponsiveContainer width="100%" height="100%">
               <AreaChart data={[{name: 'CPU', val: 45}, {name: 'RAM', val: 62}, {name: 'DB', val: 30}]}>
                 <defs>
                    <linearGradient id="colorLoad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#2196F3" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#2196F3" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                 <CartesianGrid strokeDasharray="3 3" vertical={false} />
                 <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                 <Tooltip />
                 <Area type="monotone" dataKey="val" stroke="#2196F3" fillOpacity={1} fill="url(#colorLoad)" />
               </AreaChart>
             </ResponsiveContainer>
           </div>
        </div>
      </div>

      {/* ПОЛЬЗОВАТЕЛИ */}
      <div className="card mb-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-4">
          <h3 className="text-lg font-bold">Управление пользователями</h3>
          <div className="flex gap-2 w-full md:w-auto">
            <div className="relative flex-1 md:w-64">
              <Activity className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <input className="input pl-8 h-9" placeholder="Поиск по ID или имени..." />
            </div>
            <select className="select w-[140px] h-9">
              <option value="all">Все статусы</option>
              <option value="premium">Premium</option>
              <option value="active">Активные</option>
              <option value="blocked">Заблокированы</option>
            </select>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs uppercase bg-muted">
              <tr>
                <th className="px-4 py-3 font-medium">ID</th>
                <th className="px-4 py-3 font-medium">Пользователь</th>
                <th className="px-4 py-3 font-medium">Статус</th>
                <th className="px-4 py-3 font-medium">Подписка</th>
                <th className="px-4 py-3 font-medium">Последняя активность</th>
                <th className="px-4 py-3 text-right font-medium">Действия</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {users.map(user => (
                <tr key={user.id} className="hover:bg-muted/50">
                  <td className="px-4 py-3 font-mono text-xs">{user.id}</td>
                  <td className="px-4 py-3">
                    <div>
                      <div className="font-medium">{user.name}</div>
                      <div className="text-xs text-muted-foreground">{user.username}</div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${user.status === 'active' ? 'bg-blue-100 text-blue-700' : 'bg-red-100 text-red-700'}`}>
                      {user.status === 'active' ? 'Активен' : 'Заблокирован'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    {user.sub === 'premium' && <Crown size={14} className="text-yellow-500 inline mr-1" />}
                    <span className="text-xs">{user.sub}</span>
                  </td>
                  <td className="px-4 py-3 text-xs text-muted-foreground">{user.lastActive}</td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex justify-end gap-2">
                      {user.sub !== 'premium' && (
                        <button className="btn btn-outline h-7 px-2 text-xs" onClick={() => handleGrantPremium(user.id)}>
                          <Crown size={12} className="mr-1"/> Премиум
                        </button>
                      )}
                      {user.status === 'active' ? (
                         <button className="btn btn-danger h-7 px-2 text-xs" onClick={() => handleBlockUser(user.id)}>
                           Блок
                         </button>
                      ) : (
                         <button className="btn btn-outline h-7 px-2 text-xs" onClick={() => alert('Разблокировка (Эмуляция)')}>
                           Разблок
                         </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* СИСТЕМНЫЕ НАСТРОЙКИ */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card">
          <h3 className="section-title"><Key className="h-4 w-4 mr-1"/> API Ключи</h3>
          <div className="space-y-3">
            <div>
              <label className="text-xs font-medium mb-1 block">OpenWeatherMap API Key</label>
              <input type="password" defaultValue="sk-xxxxxxxxxxxxxxxx" className="input text-xs" />
            </div>
            <div>
              <label className="text-xs font-medium mb-1 block">VirusTotal API Key</label>
              <input type="password" defaultValue="sk-yyyyyyyyyyyyyyyy" className="input text-xs" />
            </div>
            <button className="btn btn-outline btn-sm">Сохранить ключи</button>
          </div>
        </div>
        <div className="card">
          <h3 className="section-title"><Settings className="h-4 w-4 mr-1"/> Резервное копирование</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center text-sm">
              <span>Авто-бэкап (База данных)</span>
              <div className="w-10 h-5 bg-primary rounded-full relative"><div className="absolute right-1 top-1 w-3 h-3 bg-white rounded-full"></div></div>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span>Последний бэкап:</span>
              <span className="font-mono text-xs bg-muted px-2 py-1 rounded">2023-10-27_04:00.sql</span>
            </div>
            <button className="btn btn-outline w-full text-sm flex items-center justify-center">
              <Download className="h-4 w-4 mr-2"/> Скачать полный бэкап
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}