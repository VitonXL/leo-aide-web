"use client";

import { useState } from "react";
import { Users, Clock, Activity, TrendingDown, TrendingUp, BarChart3 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AreaChart, Area, BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// --- MOCK DATA GENERATION ---
const generateData = (days: number) => {
  return Array.from({ length: days }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (days - i));
    return {
      date: date.toLocaleDateString("ru", { day: "numeric", month: "short" }),
      fullDate: date.toISOString().split('T')[0],
      dau: Math.floor(Math.random() * (1500 - 1000) + 1000), // 1000-1500
      mau: Math.floor(Math.random() * (5000 - 4000) + 4000), // 4000-5000
      sessionMin: Math.floor(Math.random() * (8 - 3) + 3), // 3-8 mins
      churn: (Math.random() * (3 - 0.5) + 0.5).toFixed(1) // 0.5-3.0 %
    };
  });
};

const DATA_7_DAYS = generateData(7);
const DATA_30_DAYS = generateData(30);

export default function AdminAnalyticsPage() {
  const [timeRange, setTimeRange] = useState<"7d" | "30d">("7d");
  const data = timeRange === "7d" ? DATA_7_DAYS : DATA_30_DAYS;

  // Calculate aggregates
  const avgDAU = Math.round(data.reduce((acc, curr) => acc + curr.dau, 0) / data.length);
  const avgMAU = Math.round(data.reduce((acc, curr) => acc + curr.mau, 0) / data.length);
  const avgSession = (data.reduce((acc, curr) => acc + curr.sessionMin, 0) / data.length).toFixed(1);
  const avgChurn = (data.reduce((acc, curr) => acc + parseFloat(curr.churn), 0) / data.length).toFixed(1);
  const stickyFactor = ((avgDAU / avgMAU) * 100).toFixed(0); // DAU/MAU Stickiness

  return (
    <div className="fade-in main-content">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <BarChart3 className="text-primary" /> Аналитика и Метрики
          </h1>
          <p className="text-muted-foreground text-sm">Глубокий анализ вовлеченности и удержания</p>
        </div>
        <div className="flex items-center gap-2">
           <Select value={timeRange} onValueChange={(v: any) => setTimeRange(v)}>
             <SelectTrigger className="w-[140px]">
               <SelectValue />
             </SelectTrigger>
             <SelectContent>
               <SelectItem value="7d">7 дней</SelectItem>
               <SelectItem value="30d">30 дней</SelectItem>
             </SelectContent>
           </Select>
        </div>
      </div>

      {/* --- KPI CARDS --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex justify-between items-start mb-4">
              <div className="text-sm text-muted-foreground font-medium">DAU (Дневная)</div>
              <Users className="h-4 w-4 text-primary" />
            </div>
            <div className="text-3xl font-bold mb-1">{avgDAU.toLocaleString()}</div>
            <div className="flex items-center text-xs text-green-600">
              <TrendingUp size={12} className="mr-1"/> +5.2%
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex justify-between items-start mb-4">
              <div className="text-sm text-muted-foreground font-medium">MAU (Месячная)</div>
              <Badge className="bg-purple-100 text-purple-700">Sticky: {stickyFactor}%</Badge>
            </div>
            <div className="text-3xl font-bold mb-1">{avgMAU.toLocaleString()}</div>
            <div className="flex items-center text-xs text-green-600">
              <TrendingUp size={12} className="mr-1"/> +2.8%
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex justify-between items-start mb-4">
              <div className="text-sm text-muted-foreground font-medium">Session (Время)</div>
              <Clock className="h-4 w-4 text-blue-500" />
            </div>
            <div className="text-3xl font-bold mb-1">{avgSession} м</div>
            <div className="flex items-center text-xs text-muted-foreground">
              Средняя длительность
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex justify-between items-start mb-4">
              <div className="text-sm text-muted-foreground font-medium">Churn Rate</div>
              <Activity className="h-4 w-4 text-red-500" />
            </div>
            <div className="text-3xl font-bold mb-1 text-red-600">{avgChurn}%</div>
            <div className="flex items-center text-xs text-green-600">
              <TrendingDown size={12} className="mr-1"/> -0.4%
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        
        {/* --- DAU / MAU GRAPH --- */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Активность пользователей (DAU vs MAU)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data}>
                  <defs>
                    <linearGradient id="colorDau" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#4CAF50" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#4CAF50" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorMau" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} className="stroke-muted" />
                  <XAxis dataKey="date" tick={{ fontSize: 10 }} />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Area type="monotone" dataKey="dau" stroke="#4CAF50" fillOpacity={1} fill="url(#colorDau)" name="DAU" />
                  <Area type="monotone" dataKey="mau" stroke="#3B82F6" fillOpacity={1} fill="url(#colorMau)" name="MAU" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* --- SESSION DURATION --- */}
        <Card>
          <CardHeader>
            <CardTitle>Средняя сессия (мин)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} className="stroke-muted" />
                  <XAxis dataKey="date" tick={{ fontSize: 10 }} />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="sessionMin" fill="#3B82F6" name="Минут" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 flex justify-between text-sm text-muted-foreground">
              <span>Мин: 3.2 м</span>
              <span>Макс: 7.8 м</span>
            </div>
          </CardContent>
        </Card>

        {/* --- CHURN RATE --- */}
        <Card>
          <CardHeader>
            <CardTitle>Отток пользователей (Churn)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} className="stroke-muted" />
                  <XAxis dataKey="date" tick={{ fontSize: 10 }} />
                  <YAxis domain={[0, 5]} />
                  <Tooltip 
                    formatter={(value: number) => [`${value}%`, 'Churn']}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="churn" 
                    stroke="#EF4444" 
                    strokeWidth={2} 
                    dot={{ fill: "#EF4444", r: 3 }}
                    activeDot={{ r: 5 }} 
                    name="Churn Rate"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800 rounded text-center">
              <div className="text-xs text-red-700 dark:text-red-400 font-medium">
                Критический уровень churn: > 2.5%
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* --- DETAILED TABLE --- */}
      <Card>
        <CardHeader>
          <CardTitle>Детализация за период</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
             <table className="w-full text-sm text-left">
                <thead className="text-xs uppercase bg-muted">
                  <tr>
                    <th className="px-4 py-3 font-medium">Дата</th>
                    <th className="px-4 py-3 font-medium">DAU</th>
                    <th className="px-4 py-3 font-medium">MAU</th>
                    <th className="px-4 py-3 font-medium">Сессия</th>
                    <th className="px-4 py-3 font-medium">Churn</th>
                    <th className="px-4 py-3 font-medium text-right">Статус</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {data.map((day, idx) => (
                    <tr key={idx} className="hover:bg-muted/50">
                      <td className="px-4 py-3">{day.date}</td>
                      <td className="px-4 py-3 font-medium">{day.dau.toLocaleString()}</td>
                      <td className="px-4 py-3 text-muted-foreground">{day.mau.toLocaleString()}</td>
                      <td className="px-4 py-3">{day.sessionMin} м</td>
                      <td className="px-4 py-3">
                        <span className={parseFloat(day.churn) > 2.5 ? "text-red-500 font-bold" : ""}>
                          {day.churn}%
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                         {parseFloat(day.churn) > 2.5 ? (
                           <Badge variant="destructive" className="text-[10px]">Высокий</Badge>
                         ) : (
                           <Badge variant="outline" className="text-[10px]">Норма</Badge>
                         )}
                      </td>
                    </tr>
                  ))}
                </tbody>
             </table>
          </div>
        </CardContent>
      </Card>

    </div>
  );
}