"use client";

import { useState } from "react";
import { Radio, Send, Plus, AlertCircle, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";

const MOCK_USERS_COUNT = 1250; // Заглушка

const PROMO_CODES = [
  { code: "WELCOME10", discount: "10%", type: "first_sub", uses: 45, active: true },
  { code: "LEO2024", discount: "30 дн.", type: "gift", uses: 12, active: true },
  { code: "OLDUSER", discount: "50₽", type: "fixed", uses: 120, active: false },
];

export default function AdminMarketingPage() {
  const [mailText, setMailText] = useState("");

  return (
    <div className="fade-in main-content">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Radio className="text-primary" /> Маркетинг
        </h1>
        <Badge className="bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400">Admin + Mod</Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* РАССЫЛКИ */}
        <div className="card">
           <h3 className="section-title">📢 Массовая рассылка</h3>
           <div className="space-y-4">
             <div>
               <label className="text-sm font-medium mb-2 block">Текст сообщения</label>
               <Textarea 
                 placeholder="Введите текст рассылки..." 
                 rows={5} 
                 value={mailText}
                 onChange={(e) => setMailText(e.target.value)}
               />
             </div>
             <div className="flex items-center gap-4">
               <div className="flex-1">
                  <label className="text-xs font-medium mb-1 block">Получатели</label>
                  <Select defaultValue="all">
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Все пользователи ({MOCK_USERS_COUNT})</SelectItem>
                      <SelectItem value="premium">Только Premium</SelectItem>
                      <SelectItem value="active">Только Активные (неделя)</SelectItem>
                    </SelectContent>
                  </Select>
               </div>
               <div className="w-[180px]">
                  <label className="text-xs font-medium mb-1 block">Кнопка действия</label>
                  <Input placeholder="/premium" />
               </div>
             </div>
             <div className="flex items-center gap-2 text-sm text-muted-foreground bg-orange-50 dark:bg-orange-900/20 p-3 rounded-lg">
               <AlertCircle size={16} className="text-orange-500" />
               <span>Внимание: Рассылка будет отправлена {MOCK_USERS_COUNT} пользователям.</span>
             </div>
             <Button className="w-full md:w-auto" onClick={() => alert("Рассылка запланирована (Эмуляция)")}>
               <Send className="h-4 w-4 mr-2"/> Отправить рассылку
             </Button>
           </div>
        </div>

        {/* ПРОМОКОДЫ */}
        <div className="card">
           <h3 className="section-title">🏷️ Активные промокоды</h3>
           <div className="space-y-2 mb-4">
             {PROMO_CODES.map((promo, i) => (
               <div key={i} className="flex items-center justify-between p-3 border rounded-lg bg-card">
                 <div className="flex items-center gap-3">
                   <div className="font-mono font-bold bg-yellow-100 dark:bg-yellow-900/30 px-2 py-1 rounded text-yellow-700 dark:text-yellow-500">{promo.code}</div>
                   <div>
                     <div className="text-sm font-medium">{promo.discount}</div>
                     <div className="text-xs text-muted-foreground">Использований: {promo.uses}</div>
                   </div>
                 </div>
                 <Switch checked={promo.active} />
               </div>
             ))}
           </div>
           <div className="border-t pt-4">
              <div className="grid grid-cols-4 gap-2 items-end mb-2">
                 <Input placeholder="CODE" className="col-span-1"/>
                 <Select><SelectTrigger><SelectValue placeholder="Тип"/></SelectTrigger><SelectContent><SelectItem value="%">%</SelectItem><SelectItem value="days">Дни</SelectItem></SelectContent></Select>
                 <Input placeholder="Знач." className="col-span-1"/>
                 <Button size="sm" variant="outline" className="h-9"><Plus size={14}/></Button>
              </div>
           </div>
        </div>
      </div>

      {/* РЕКЛАМА / БАННЕРЫ */}
      <div className="card mt-6">
         <h3 className="section-title">📣 Управление рекламой</h3>
         <div className="space-y-3">
            {["Summer Promo", "New Year Discount", "Referral Boost"].map((ad, i) => (
              <div key={i} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-16 bg-gray-200 dark:bg-gray-700 rounded flex items-center justify-center text-xs text-muted-foreground">
                    Banner
                  </div>
                  <div>
                    <div className="font-medium">{ad}</div>
                    <div className="text-xs text-muted-foreground">Показов: {Math.floor(Math.random()*5000)} | Кликов: {Math.floor(Math.random()*200)}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                   <Badge variant={i === 0 ? "default" : "secondary"}>{i === 0 ? "Активна" : "Остановлена"}</Badge>
                   <Button size="sm" variant="outline" className="h-8">Настройки</Button>
                </div>
              </div>
            ))}
         </div>
      </div>
    </div>
  );
}