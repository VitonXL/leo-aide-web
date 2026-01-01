"use client";

import { useState } from "react";
import { Headphones, MessageSquare, History, Clock, ArrowRight, AlertTriangle, CheckCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

// Mock Data
const TICKETS_SUMMARY = [
  { id: 101, user: "@ivan_g", subject: "Не работает GigaChat", status: "open", date: "2 ч. назад" },
  { id: 102, user: "@maria_k", subject: "Вопрос по оплате", status: "in_progress", date: "5 ч. назад" },
  { id: 103, user: "@dmitry_v", subject: "Жалоба на бан", status: "resolved", date: "1 д. назад" },
];

const LOGS_SUMMARY = [
  { id: 1, admin: "SuperAdmin", action: "Выдача Premium пользователю @user_1", date: "2023-10-26 10:00", ip: "192.168.1.5" },
  { id: 2, admin: "Moderator1", action: "Удаление комментария #452", date: "2023-10-26 10:15", ip: "192.168.1.6" },
];

export default function AdminSupportPage() {
  return (
    <div className="fade-in main-content">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Headphones className="text-primary" /> Техническая поддержка
        </h1>
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 text-xs font-bold">Admin + Mods</span>
        </div>
      </div>

      {/* СТАТИСТИКА ПОДДЕРЖКИ */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card className="bg-red-50 dark:bg-red-900/10 border-red-200 dark:border-red-800">
           <CardContent className="pt-4 text-center">
             <div className="text-3xl font-bold text-red-700 dark:text-red-400">{TICKETS_SUMMARY.filter(t => t.status === 'open').length}</div>
             <div className="text-sm text-red-600/80">Открытые тикеты</div>
           </CardContent>
        </Card>
        <Card>
           <CardContent className="pt-4 text-center">
             <div className="text-3xl font-bold text-blue-600">{TICKETS_SUMMARY.filter(t => t.status === 'in_progress').length}</div>
             <div className="text-sm text-muted-foreground">В работе</div>
           </CardContent>
        </Card>
        <Card>
           <CardContent className="pt-4 text-center">
             <div className="text-3xl font-bold text-green-600">{TICKETS_SUMMARY.filter(t => t.status === 'resolved').length}</div>
             <div className="text-sm text-muted-foreground">Решено</div>
           </CardContent>
        </Card>
        <Card>
           <CardContent className="pt-4 text-center">
             <div className="text-3xl font-bold">{TICKETS_SUMMARY.length}</div>
             <div className="text-sm text-muted-foreground">Всего за неделю</div>
           </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* ТИКЕТЫ */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold flex items-center gap-2">
              <MessageSquare className="text-primary h-5 w-5"/> Тикеты
            </h2>
            <Button variant="outline" size="sm" asChild>
              <a href="/tickets">Все тикеты <ArrowRight className="ml-1 h-3 w-3"/></a>
            </Button>
          </div>
          <Card>
             <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Пользователь</TableHead>
                      <TableHead>Тема</TableHead>
                      <TableHead>Статус</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {TICKETS_SUMMARY.map(ticket => (
                      <TableRow key={ticket.id} className={ticket.status === 'open' ? "bg-red-50/50 dark:bg-red-900/10" : ""}>
                        <TableCell className="font-medium">{ticket.user}</TableCell>
                        <TableCell className="text-sm">{ticket.subject}</TableCell>
                        <TableCell>
                          <Badge className={ticket.status === 'open' ? 'bg-red-100 text-red-700' : ticket.status === 'in_progress' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'}>
                            {ticket.status === 'open' ? 'Открыт' : ticket.status === 'in_progress' ? 'В работе' : 'Решен'}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
             </CardContent>
          </Card>
        </div>

        {/* ЛОГИ ДЕЙСТВИЙ */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold flex items-center gap-2">
              <History className="text-purple-600 h-5 w-5"/> Логи действий
            </h2>
            <Button variant="outline" size="sm" asChild>
              <a href="/admin/settings">Полные логи <ArrowRight className="ml-1 h-3 w-3"/></a>
            </Button>
          </div>
          <Card>
             <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Админ</TableHead>
                      <TableHead>Действие</TableHead>
                      <TableHead>Дата</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {LOGS_SUMMARY.map(log => (
                      <TableRow key={log.id}>
                        <TableCell className="font-bold text-sm">{log.admin}</TableCell>
                        <TableCell className="text-sm">{log.action}</TableCell>
                        <TableCell className="text-xs text-muted-foreground">{log.date}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
             </CardContent>
          </Card>
        </div>
      </div>

      {/* СТАТУС СИСТЕМЫ */}
      <div className="mt-8">
        <Card>
           <CardHeader>
             <CardTitle className="text-base flex items-center gap-2"><AlertTriangle className="h-4 w-4 text-orange-500"/> Статус сервисов</CardTitle>
           </CardHeader>
           <CardContent>
             <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-3 bg-green-50 dark:bg-green-900/10 rounded border border-green-200 dark:border-green-800 flex items-center justify-between">
                   <span className="text-sm font-medium">API Server</span>
                   <span className="text-green-600 font-bold text-xs flex items-center gap-1"><CheckCircle size={12}/> Online</span>
                </div>
                <div className="p-3 bg-green-50 dark:bg-green-900/10 rounded border border-green-200 dark:border-green-800 flex items-center justify-between">
                   <span className="text-sm font-medium">Database</span>
                   <span className="text-green-600 font-bold text-xs flex items-center gap-1"><CheckCircle size={12}/> Stable</span>
                </div>
                <div className="p-3 bg-orange-50 dark:bg-orange-900/10 rounded border border-orange-200 dark:border-orange-800 flex items-center justify-between">
                   <span className="text-sm font-medium">Queue (Worker)</span>
                   <span className="text-orange-600 font-bold text-xs">Delayed (1s)</span>
                </div>
             </div>
           </CardContent>
        </Card>
      </div>
    </div>
  );
}