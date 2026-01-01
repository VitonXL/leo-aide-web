"use client";

import { useState } from "react";
import { Users, FileText, Settings, BarChart3, DollarSign, ArrowRight, Activity, Crown, Shield, Database, Zap } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

// Mock Data for Analytics Summary
const DATA_7_DAYS = [
  { name: "Пн", income: 12000, expense: 5000 },
  { name: "Вт", income: 15000, expense: 4500 },
  { name: "Ср", income: 11000, expense: 6000 },
  { name: "Чт", income: 18000, expense: 5200 },
  { name: "Пт", income: 22000, expense: 8000 },
  { name: "Сб", income: 25000, expense: 7000 },
  { name: "Вс", income: 20000, expense: 6500 },
];

export default function AdminManagementPage() {
  return (
    <div className="fade-in main-content">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <LayoutGrid className="text-primary" /> Панель Управления
        </h1>
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-full bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 text-xs font-bold">Admin Access</span>
        </div>
      </div>

      {/* АНАЛИТИКА (ОБЗОР) */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          <BarChart3 className="text-blue-600 h-5 w-5" />
          <h2 className="text-lg font-bold">Общая Аналитика</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <Card className="bg-blue-50/30 border-blue-100">
             <CardContent className="pt-4">
                <div className="text-xs text-blue-600 font-medium mb-1">Активно (День)</div>
                <div className="text-2xl font-bold text-blue-900">1,250</div>
             </CardContent>
          </Card>
          <Card className="bg-green-50/30 border-green-100">
             <CardContent className="pt-4">
                <div className="text-xs text-green-600 font-medium mb-1">Premium</div>
                <div className="text-2xl font-bold text-green-900">342</div>
             </CardContent>
          </Card>
          <Card className="bg-purple-50/30 border-purple-100">
             <CardContent className="pt-4">
                <div className="text-xs text-purple-600 font-medium mb-1">Доход (Сегодня)</div>
                <div className="text-2xl font-bold text-purple-900">154K ₽</div>
             </CardContent>
          </Card>
          <Card className="bg-orange-50/30 border-orange-100">
             <CardContent className="pt-4">
                <div className="text-xs text-orange-600 font-medium mb-1">Нагрузка CPU</div>
                <div className="text-2xl font-bold text-orange-900">42%</div>
             </CardContent>
          </Card>
        </div>
        
        <Card className="mb-8">
          <CardContent className="pt-6">
            <h3 className="text-sm font-medium text-muted-foreground mb-4">Динамика доходов</h3>
            <div className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={DATA_7_DAYS}>
                  <defs>
                    <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#4CAF50" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#4CAF50" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} className="stroke-muted" />
                  <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                  <YAxis />
                  <Tooltip />
                  <Area type="monotone" dataKey="income" stroke="#4CAF50" fillOpacity={1} fill="url(#colorRev)" name="Доход" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* БЫСТРЫЙ ДОСТУП К РАЗДЕЛАМ */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        
        {/* ПОЛЬЗОВАТЕЛИ */}
        <Card className="hover:shadow-lg transition-all cursor-pointer group border-l-4 border-l-blue-500">
          <CardHeader>
            <div className="flex justify-between items-start">
              <div className="p-3 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg">
                <Users className="h-6 w-6" />
              </div>
              <ArrowRight className="text-muted-foreground group-hover:text-blue-500 transition-colors" />
            </div>
            <CardTitle className="text-lg mt-4">Пользователи</CardTitle>
            <div className="text-sm text-muted-foreground">Управление базой, роли и баны</div>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2 text-sm mb-4">
              <span className="font-bold">Всего: 12,450</span>
              <span className="text-green-600">+24 сегодня</span>
            </div>
            <Button asChild className="w-full" variant="outline">
              <a href="/admin/users">Перейти к пользователям</a>
            </Button>
          </CardContent>
        </Card>

        {/* КОНТЕНТ */}
        <Card className="hover:shadow-lg transition-all cursor-pointer group border-l-4 border-l-purple-500">
          <CardHeader>
            <div className="flex justify-between items-start">
              <div className="p-3 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-lg">
                <FileText className="h-6 w-6" />
              </div>
              <ArrowRight className="text-muted-foreground group-hover:text-purple-500 transition-colors" />
            </div>
            <CardTitle className="text-lg mt-4">Контент</CardTitle>
            <div className="text-sm text-muted-foreground">Блог, новости и база знаний</div>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2 text-sm mb-4">
              <span className="font-bold">Постов: 45</span>
              <span className="text-muted-foreground">Модерация: 2</span>
            </div>
            <Button asChild className="w-full" variant="outline">
              <a href="/admin/content">Редактировать контент</a>
            </Button>
          </CardContent>
        </Card>

        {/* ФИНАНСЫ (АДМИН) */}
        <Card className="hover:shadow-lg transition-all cursor-pointer group border-l-4 border-l-green-500">
          <CardHeader>
            <div className="flex justify-between items-start">
              <div className="p-3 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-lg">
                <DollarSign className="h-6 w-6" />
              </div>
              <ArrowRight className="text-muted-foreground group-hover:text-green-500 transition-colors" />
            </div>
            <CardTitle className="text-lg mt-4">Финансы</CardTitle>
            <div className="text-sm text-muted-foreground">Транзакции и шлюзы оплаты</div>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2 text-sm mb-4">
              <span className="font-bold text-green-600">+175K ₽ (мес)</span>
              <span className="text-red-500">-2.4K (возвраты)</span>
            </div>
            <Button asChild className="w-full" variant="outline">
              <a href="/admin/finance">Статистика платежей</a>
            </Button>
          </CardContent>
        </Card>

        {/* НАСТРОЙКИ */}
        <Card className="hover:shadow-lg transition-all cursor-pointer group border-l-4 border-l-gray-500">
          <CardHeader>
            <div className="flex justify-between items-start">
              <div className="p-3 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded-lg">
                <Settings className="h-6 w-6" />
              </div>
              <ArrowRight className="text-muted-foreground group-hover:text-gray-500 transition-colors" />
            </div>
            <CardTitle className="text-lg mt-4">Настройки</CardTitle>
            <div className="text-sm text-muted-foreground">API ключи, бэкапы и режим работ</div>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2 text-sm mb-4">
              <span className="flex items-center gap-1 text-green-600"><Shield size={14}/> Безопасность</span>
              <span className="flex items-center gap-1 text-blue-600"><Database size={14}/> Бэкап</span>
            </div>
            <Button asChild className="w-full" variant="outline">
              <a href="/admin/settings">Системные настройки</a>
            </Button>
          </CardContent>
        </Card>

        {/* АНАЛИТИКА (ПОЛНАЯ) */}
        <Card className="hover:shadow-lg transition-all cursor-pointer group border-l-4 border-l-indigo-500">
          <CardHeader>
            <div className="flex justify-between items-start">
              <div className="p-3 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-lg">
                <BarChart3 className="h-6 w-6" />
              </div>
              <ArrowRight className="text-muted-foreground group-hover:text-indigo-500 transition-colors" />
            </div>
            <CardTitle className="text-lg mt-4">Аналитика</CardTitle>
            <div className="text-sm text-muted-foreground">Глубокий анализ DAU/MAU и Churn</div>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2 text-sm mb-4">
              <span className="font-bold">Sticky: 25%</span>
              <span className="text-red-500">Churn: 2.4%</span>
            </div>
            <Button asChild className="w-full" variant="outline">
              <a href="/admin/analytics">Детальная аналитика</a>
            </Button>
          </CardContent>
        </Card>

      </div>
    </div>
  );
}