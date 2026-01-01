"use client";

import { useState } from "react";
import { User, Palette, Star, History, Shield, Trash2 } from "lucide-react";

const AVAILABLE_FEATURES = [
  { id: 'finance', name: 'Финансы', icon: '💰', pinned: true },
  { id: 'weather', name: 'Погода', icon: '🌦', pinned: true },
  { id: 'gigachat', name: 'GigaChat', icon: '💬', pinned: false },
  { id: 'movies', name: 'Фильмы', icon: '🎬', pinned: false },
];

export default function SettingsPage() {
  const [favorites, setFavorites] = useState(AVAILABLE_FEATURES);
  const [fontSize, setFontSize] = useState<"normal" | "large">("normal");

  const toggleFavorite = (id: string) => {
    setFavorites(prev => prev.map(f => f.id === id ? { ...f, pinned: !f.pinned } : f));
  };

  return (
    <div className="fade-in main-content">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Настройки</h1>
        <p className="text-muted-foreground">Персонализация интерфейса</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="card">
          <h3 className="section-title"><Palette className="h-5 w-5"/> Интерфейс</h3>
          <div className="space-y-4">
             <div className="flex items-center justify-between">
               <div className="space-y-0.5"><label className="text-sm font-medium">Размер шрифта</label></div>
               <select className="select w-[120px]" value={fontSize} onChange={(e: any) => setFontSize(e.target.value)}>
                 <option value="normal">Обычный</option>
                 <option value="large">Крупный</option>
               </select>
             </div>
          </div>
        </div>

        <div className="card lg:col-span-2">
          <h3 className="section-title"><Star className="h-5 w-5"/> Быстрый доступ</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {favorites.map((feature) => (
              <div 
                key={feature.id} 
                className={`flex items-center justify-between p-3 rounded-lg border transition-all cursor-pointer ${
                  feature.pinned 
                    ? 'bg-yellow-50 border-yellow-200 dark:bg-yellow-900/20 dark:border-yellow-800' 
                    : 'bg-card border-border hover:bg-muted'
                }`}
                onClick={() => toggleFavorite(feature.id)}
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-md ${feature.pinned ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-400' : 'bg-muted text-muted-foreground'}`}>
                    <span className="text-xl">{feature.icon}</span>
                  </div>
                  <span className={`font-medium text-sm ${feature.pinned ? 'text-foreground' : 'text-muted-foreground'}`}>
                    {feature.name}
                  </span>
                </div>
                <Star size={16} className={feature.pinned ? "fill-yellow-500 text-yellow-500" : "text-gray-400"} />
              </div>
            ))}
          </div>
        </div>

        <div className="card">
           <h3 className="section-title"><User className="h-5 w-5"/> Профиль</h3>
           <div className="flex items-center gap-3 mb-4">
             <div className="h-12 w-12 rounded-full bg-green-500 flex items-center justify-center text-white font-bold text-xl">A</div>
             <div><div className="font-bold">Алексей Иванов</div><div className="text-xs text-muted-foreground">@alexey_iv</div></div>
           </div>
           <input defaultValue="alex@example.com" className="input mb-2" />
           <button className="btn btn-outline w-full text-sm">Редактировать</button>
        </div>

        <div className="card">
           <h3 className="section-title"><History className="h-5 w-5"/> История</h3>
           <div className="space-y-2">
             <div className="text-sm text-muted-foreground border-b pb-2">Добавлен расход: Еда (500 ₽)</div>
             <div className="text-sm text-muted-foreground border-b pb-2">Запрошен прогноз погоды</div>
             <button className="btn btn-outline btn-sm w-full mt-2">Очистить</button>
           </div>
        </div>

        <div className="card bg-red-50/30 dark:bg-red-900/10 border-red-200 dark:border-red-800">
           <h3 className="section-title text-red-600 dark:text-red-400"><Shield className="h-5 w-5"/> Безопасность</h3>
           <div className="space-y-3">
              <button className="btn btn-outline w-full text-sm">Сменить пароль</button>
              <button className="btn btn-danger w-full text-sm flex items-center justify-center gap-2"><Trash2 className="h-3 w-3"/> Удалить аккаунт</button>
           </div>
        </div>
      </div>
    </div>
  );
}