"use client";

import { useState, useEffect } from "react";
import { DollarSign, Cloud, Calculator, Download, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

const RATES = { USD: 92.5, EUR: 101.2, CNY: 12.8 };
const WEATHER = { temp: 18, condition: "Облачно", humidity: 65, wind: 3.2 };
const FINANCE_DATA = [
  { month: "Янв", income: 100000, expense: 80000 },
  { month: "Фев", income: 105000, expense: 85000 },
  { month: "Мар", income: 110000, expense: 90000 },
];

export default function WidgetsPage() {
  const [rates, setRates] = useState(RATES);
  const [lastUpdate, setLastUpdate] = useState(new Date());

  const refreshRates = () => {
    setRates({ USD: 92.5 + Math.random(), EUR: 101.2 + Math.random(), CNY: 12.8 + Math.random() });
    setLastUpdate(new Date());
    if (typeof window !== 'undefined' && (window as any).Toast) {
      (window as any).Toast.success("Курсы обновлены");
    }
  };

  return (
    <div className="fade-in main-content">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Виджеты</h1>
        <p className="text-muted-foreground">Компактный доступ к инструментам</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        <div className="card">
          <div className="flex justify-between items-center mb-4">
            <div className="text-sm font-medium flex items-center gap-2 text-green-700">
              <DollarSign className="h-4 w-4"/> Курсы
            </div>
            <button className="btn btn-sm btn-outline" onClick={refreshRates}><RefreshCw className="h-3 w-3" /></button>
          </div>
          <div className="text-xs text-muted-foreground mb-3">
            Обновлено: {lastUpdate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </div>
          <div className="space-y-2">
            <div className="flex justify-between items-center p-2 bg-muted/50 rounded">
              <span className="font-bold">USD</span>
              <span className="text-sm">{rates.USD.toFixed(2)} ₽</span>
            </div>
            <div className="flex justify-between items-center p-2 bg-muted/50 rounded">
              <span className="font-bold">EUR</span>
              <span className="text-sm">{rates.EUR.toFixed(2)} ₽</span>
            </div>
            <div className="flex justify-between items-center p-2 bg-muted/50 rounded">
              <span className="font-bold">CNY</span>
              <span className="text-sm">{rates.CNY.toFixed(2)} ₽</span>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="text-sm font-medium flex items-center gap-2 text-blue-700 mb-4">
            <Cloud className="h-4 w-4"/> Погода
          </div>
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="text-3xl font-bold">{WEATHER.temp}°C</div>
              <div className="text-sm text-muted-foreground">{WEATHER.condition}</div>
            </div>
            <div className="text-right text-xs text-muted-foreground">
              <div>Вл: {WEATHER.humidity}%</div>
              <div>Ветер: {WEATHER.wind} м/с</div>
            </div>
          </div>
          <div className="flex gap-2 text-xs">
             <div className="flex-1 p-2 bg-blue-50 dark:bg-blue-900/20 rounded text-center"><div className="font-bold">Утро</div><div>15°</div></div>
             <div className="flex-1 p-2 bg-orange-50 dark:bg-orange-900/20 rounded text-center"><div className="font-bold">День</div><div>20°</div></div>
             <div className="flex-1 p-2 bg-indigo-50 dark:bg-indigo-900/20 rounded text-center"><div className="font-bold">Вечер</div><div>17°</div></div>
          </div>
        </div>

        <div className="card">
          <div className="flex justify-between items-center mb-4">
            <div className="text-sm font-medium flex items-center gap-2 text-purple-700">
              <Calculator className="h-4 w-4"/> Баланс
            </div>
            <button className="btn-sm btn-outline"><Download className="h-3 w-3"/></button>
          </div>
          <div className="h-[140px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={FINANCE_DATA}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 10 }} />
                <Tooltip />
                <Bar dataKey="income" fill="#4CAF50" name="Доход" radius={[2, 2, 0, 0]} />
                <Bar dataKey="expense" fill="#F44336" name="Расход" radius={[2, 2, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-between mt-2 text-xs font-bold">
            <span className="text-green-600">+205 000 ₽</span>
            <span className="text-red-500">-255 000 ₽</span>
          </div>
        </div>

      </div>
    </div>
  );
}