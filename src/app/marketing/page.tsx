"use client";

import { useState } from "react";
import { Radio, Send, Plus, AlertCircle, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";

const MOCK_USERS_COUNT = 1250; 

const PROMO_CODES = [
  { code: "WELCOME10", discount: "10%", type: "first_sub", uses: 45, active: true },
  { code: "LEO2024", discount: "30 дн.", type: "gift", uses: 12, active: true },
  { code: "OLDUSER", discount: "50₽", type: "fixed", uses: 120, active: false },
];

const ADVERTISEMENTS = [
  { id: 1, name: "Summer Promo", views: 4250, clicks: 120, status: "active" },
  { id: 2, name: "New Year Discount", views: 3100, clicks: 85, status: "paused" },
  { id: 3, name: "Referral Boost", views: 1500, clicks: 40, status: "active" },
];

export default function MarketingPage() {
  const [mailText, setMailText] = useState("");

  return (
    <div className="fade-in main-content">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Radio className="text-primary" /> Маркетинг
        </h1>
        <Badge className="bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400">Admin + Mod</Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* МАССОВАЯ РАССЫЛКА */}
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
                 className="resize-none"
               />
             </div>
             <div className="grid grid-cols-2 gap-4">
               <div>
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
               <div>
                  <label className="text-xs font-medium mb-1 block">Кнопка действия</label>
                  <Input placeholder="/premium" />
               </div>
             </div>
             <div className="p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg border border-orange-200 dark:border-orange-800 flex gap-3">
               <AlertCircle size={16} className="text-orange-500 flex-shrink-0 mt-0.5" />
               <span className="text-sm text-orange-800 dark:text-orange-200">Внимание: Рассылка будет отправлена {MOCK_USERS_COUNT} пользователям.</span>
             </div>
             <button className="btn btn-primary w-full" onClick={() => alert("Рассылка запланирована (Эмуляция)")}>
               <Send className="h-4 w-4 mr-2"/> Отправить рассылку
             </button>
           </div>
        </div>

        {/* ПРОМОКОДЫ */}
        <div className="card">
           <h3 className="section-title">🏷️ Управление промокодами</h3>
           <div className="space-y-3 mb-4">
             {PROMO_CODES.map((promo, i) => (
               <div key={i} className="flex items-center justify-between p-3 border rounded-lg bg-card hover:border-primary/30 transition-colors">
                 <div className="flex items-center gap-3">
                   <div className="font-mono font-bold bg-yellow-100 dark:bg-yellow-900/30 px-2 py-1 rounded text-yellow-700 dark:text-yellow-500 text-sm">{promo.code}</div>
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
              <h4 className="text-sm font-medium mb-2">Добавить новый</h4>
              <div className="grid grid-cols-12 gap-2 items-end">
                 <div className="col-span-4">
                    <Input placeholder="CODE" className="h-9"/>
                 </div>
                 <div className="col-span-3">
                    <Select><SelectTrigger className="h-9"><SelectValue placeholder="Тип"/></SelectTrigger><SelectContent><SelectItem value="%">%</SelectItem><SelectItem value="days">Дни</SelectItem></SelectContent></Select>
                 </div>
                 <div className="col-span-3">
                    <Input placeholder="Знач." className="h-9"/>
                 </div>
                 <button className="btn btn-outline col-span-2 h-9 flex justify-center"><Plus size={14}/></button>
              </div>
           </div>
        </div>
      </div>

      {/* РЕКЛАМА / БАННЕРЫ */}
      <div className="card">
         <h3 className="section-title">📣 Активные кампании</h3>
         <div className="space-y-3">
            {ADVERTISEMENTS.map((ad) => (
              <div key={ad.id} className="flex items-center justify-between p-4 border rounded-lg bg-card hover:bg-muted/50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 bg-muted rounded flex items-center justify-center text-muted-foreground text-xs font-mono">
                    IMG
                  </div>
                  <div>
                    <div className="font-medium">{ad.name}</div>
                    <div className="text-xs text-muted-foreground mt-1">Показов: {ad.views.toLocaleString()} | Кликов: {ad.clicks}</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                   <Badge variant={ad.status === 'active' ? "default" : "secondary"}>
                     {ad.status === 'active' ? 'Активна' : 'Остановлена'}
                   </Badge>
                   <button className="btn btn-outline btn-sm h-8">Настройки</button>
                </div>
              </div>
            ))}
         </div>
      </div>
    </div>
  );
}