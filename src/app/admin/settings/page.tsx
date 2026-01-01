"use client";

import { useState } from "react";
import { Shield, Key, History, Bell, Database, Server } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const LOGS = [
  { id: 1, admin: "SuperAdmin", action: "Выдача Premium пользователю @user_1", date: "2023-10-26 10:00", ip: "192.168.1.5" },
  { id: 2, admin: "Moderator1", action: "Удаление комментария #452", date: "2023-10-26 10:15", ip: "192.168.1.6" },
  { id: 3, admin: "SuperAdmin", action: "Смена ключа API VirusTotal", date: "2023-10-26 11:00", ip: "192.168.1.5" },
];

export default function AdminSettingsPage() {
  const [maintenanceMode, setMaintenanceMode] = useState(false);

  return (
    <div className="fade-in main-content">
      <h1 className="text-3xl font-bold mb-6 flex items-center gap-2"><Shield className="text-primary"/> Настройки и Безопасность</h1>

      <Tabs defaultValue="general" className="space-y-4">
        <TabsList>
          <TabsTrigger value="general">Основное</TabsTrigger>
          <TabsTrigger value="security">Безопасность</TabsTrigger>
          <TabsTrigger value="logs">Логи действий</TabsTrigger>
          <TabsTrigger value="api">Интеграции</TabsTrigger>
        </TabsList>

        <TabsContent value="general">
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader><CardTitle>Режим работы</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">Технические работы</div>
                    <div className="text-xs text-muted-foreground">Бот будет недоступен для пользователей</div>
                  </div>
                  <Switch checked={maintenanceMode} onCheckedChange={setMaintenanceMode} />
                </div>
                {maintenanceMode && (
                  <div className="p-3 bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded text-sm">
                    Внимание! Бот недоступен. Для продолжения работы выключите режим техработ.
                  </div>
                )}
              </CardContent>
            </Card>
            <Card>
               <CardHeader><CardTitle>Уведомления Админа</CardTitle></CardHeader>
               <CardContent className="space-y-4">
                 <div className="flex items-center justify-between">
                    <span>Новые тикеты</span>
                    <Switch defaultChecked />
                 </div>
                 <div className="flex items-center justify-between">
                    <span>Критические ошибки сервера</span>
                    <Switch defaultChecked />
                 </div>
                 <div className="flex items-center justify-between">
                    <span>Новые покупки Premium</span>
                    <Switch />
                 </div>
               </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="security">
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
               <CardHeader><CardTitle>IP Фильтрация</CardTitle></CardHeader>
               <CardContent className="space-y-4">
                 <div>
                   <label className="text-sm font-medium mb-1 block">Белый список IP (через запятую)</label>
                   <Input placeholder="192.168.1.1, 10.0.0.1" className="font-mono text-xs" />
                 </div>
                 <p className="text-xs text-muted-foreground">Только эти IP смогут получить доступ к админ-панели.</p>
                 <Button className="w-full btn-sm">Сохранить список</Button>
               </CardContent>
            </Card>
            <Card>
               <CardHeader><CardTitle>Резервное копирование</CardTitle></CardHeader>
               <CardContent className="space-y-4">
                 <div className="flex items-center justify-between">
                    <span>Авто-бэкап (Ежедневно)</span>
                    <Switch defaultChecked />
                 </div>
                 <div className="p-3 bg-gray-100 dark:bg-gray-800 rounded font-mono text-xs">
                   Последний: backup_2023-10-26.sql <br/>
                   Размер: 45.2 MB
                 </div>
                 <Button variant="outline" className="w-full btn-sm"><Database className="mr-2 h-4 w-4"/> Создать бэкап сейчас</Button>
               </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="logs">
          <Card>
            <CardHeader><CardTitle>Журнал действий Администраторов</CardTitle></CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Админ</TableHead>
                      <TableHead>Действие</TableHead>
                      <TableHead>Дата</TableHead>
                      <TableHead>IP</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {LOGS.map(log => (
                      <TableRow key={log.id}>
                        <TableCell className="font-bold">{log.admin}</TableCell>
                        <TableCell className="text-sm">{log.action}</TableCell>
                        <TableCell className="text-xs text-muted-foreground">{log.date}</TableCell>
                        <TableCell className="font-mono text-xs text-muted-foreground">{log.ip}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="api">
          <Card>
            <CardHeader><CardTitle>API Интеграции</CardTitle></CardHeader>
            <CardContent className="space-y-6">
              <div>
                <label className="text-sm font-medium mb-1 block">VirusTotal API Key</label>
                <Input type="password" defaultValue="xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx" />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">OpenWeather API Key</label>
                <Input type="password" defaultValue="yyyyyyyyyyyyyyyyyyyyyyyyyyyy" />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Telegram Bot Token</label>
                <Input type="password" defaultValue="123456789:ABCDefGHIjklMNOpqrsTUVwxyz" />
              </div>
              <Button className="btn-primary">Сохранить ключи</Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}