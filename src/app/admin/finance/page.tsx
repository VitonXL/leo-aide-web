"use client";

import { DollarSign, Download, ArrowUpRight, ArrowDownRight, CreditCard, Wallet } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";

const TRANSACTIONS = [
  { id: "TRX-001", user: "@alex_iv", amount: 299, type: "income", method: "FreeKassa", date: "2023-10-25 14:30", status: "success" },
  { id: "TRX-002", user: "@maria_k", amount: 99, type: "income", method: "Stripe", date: "2023-10-25 15:00", status: "pending" },
  { id: "TRX-003", user: "@dmitry_v", amount: 99, type: "refund", method: "FreeKassa", date: "2023-10-24 10:00", status: "success" },
];

const REVENUE_DATA = [
  { name: "Пн", value: 15000 },
  { name: "Вт", value: 22000 },
  { name: "Ср", value: 18000 },
  { name: "Чт", value: 29000 },
  { name: "Пт", value: 35000 },
  { name: "Сб", value: 31000 },
  { name: "Вс", value: 25000 },
];

const GATEWAYS = [
  { name: "FreeKassa", status: "active", volume: "125 000 ₽" },
  { name: "Stripe", status: "active", volume: "45 000 ₽" },
  { name: "YooKassa", status: "inactive", volume: "0 ₽" },
];

export default function AdminFinancePage() {
  return (
    <div className="fade-in main-content">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold flex items-center gap-2"><DollarSign className="text-primary"/> Финансы и Статистика</h1>
        <Button variant="outline"><Download className="mr-2 h-4 w-4"/> CSV Экспорт</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="bg-green-50 border-green-200 dark:bg-green-900/10 dark:border-green-800">
          <CardHeader className="pb-2"><CardTitle className="text-sm text-green-700 dark:text-green-400">Общий доход (мес)</CardTitle></CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-800 dark:text-green-300">175 000 ₽</div>
            <div className="flex items-center text-xs text-green-600 mt-1"><ArrowUpRight size={12}/> +12.5%</div>
          </CardContent>
        </Card>
        <Card className="bg-red-50 border-red-200 dark:bg-red-900/10 dark:border-red-800">
          <CardHeader className="pb-2"><CardTitle className="text-sm text-red-700 dark:text-red-400">Возвраты (мес)</CardTitle></CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-red-800 dark:text-red-300">2 450 ₽</div>
            <div className="flex items-center text-xs text-red-600 mt-1"><ArrowDownRight size={12}/> -1.4%</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">Вывод средств</CardTitle></CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">15 000 ₽</div>
            <div className="text-xs text-muted-foreground mt-1">Ожидают проверки</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="transactions" className="space-y-4">
        <TabsList>
          <TabsTrigger value="transactions">Транзакции</TabsTrigger>
          <TabsTrigger value="analytics">Графики</TabsTrigger>
          <TabsTrigger value="gateways">Шлюзы</TabsTrigger>
        </TabsList>

        <TabsContent value="transactions">
          <Card>
            <CardHeader><CardTitle>История операций</CardTitle></CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Пользователь</TableHead>
                    <TableHead>Сумма</TableHead>
                    <TableHead>Метод</TableHead>
                    <TableHead>Дата</TableHead>
                    <TableHead>Статус</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {TRANSACTIONS.map(trx => (
                    <TableRow key={trx.id}>
                      <TableCell className="font-mono text-xs">{trx.id}</TableCell>
                      <TableCell>{trx.user}</TableCell>
                      <TableCell className={trx.type === 'income' ? 'text-green-600 font-bold' : 'text-red-500'}>
                        {trx.type === 'income' ? '+' : '-'}{trx.amount} ₽
                      </TableCell>
                      <TableCell>{trx.method}</TableCell>
                      <TableCell className="text-xs text-muted-foreground">{trx.date}</TableCell>
                      <TableCell>
                        <Badge variant={trx.status === 'success' ? 'default' : 'secondary'}>
                          {trx.status === 'success' ? 'Успешно' : 'В обработке'}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics">
          <Card>
            <CardHeader><CardTitle>Динамика доходов</CardTitle></CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={REVENUE_DATA}>
                    <defs>
                      <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#4CAF50" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#4CAF50" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Area type="monotone" dataKey="value" stroke="#4CAF50" fillOpacity={1} fill="url(#colorRev)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="gateways">
          <div className="grid md:grid-cols-3 gap-4">
             {GATEWAYS.map((gw, idx) => (
               <Card key={idx} className="p-4">
                 <div className="flex justify-between items-start mb-4">
                    <Wallet className="text-muted-foreground"/>
                    <Badge variant={gw.status === 'active' ? 'default' : 'outline'}>
                      {gw.status === 'active' ? 'Активен' : 'Выключен'}
                    </Badge>
                 </div>
                 <div className="font-bold text-lg">{gw.name}</div>
                 <div className="text-sm text-muted-foreground">Оборот: {gw.volume}</div>
                 <Button size="sm" variant="outline" className="w-full mt-4">Настроить</Button>
               </Card>
             ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}