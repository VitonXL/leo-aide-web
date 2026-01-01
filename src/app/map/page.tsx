"use client";

import { MapPin, Navigation, Search, Star } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const SERVICES = [
  { id: 1, name: "Аптека 'Здоровье'", distance: "300 м", rating: 4.5, address: "ул. Ленина, 10" },
  { id: 2, name: "Кафе 'Утро'", distance: "500 м", rating: 4.8, address: "ул. Пушкина, 5" },
  { id: 3, name: "Банкомат Сбербанка", distance: "1.2 км", rating: 0, address: "пр. Мира, 22" },
];

export default function MapPage() {
  return (
    <div className="fade-in main-content">
      <h1 className="text-3xl font-bold mb-6 flex items-center gap-2">
        <MapPin className="text-primary" /> Карта сервисов
      </h1>

      <div className="flex gap-2 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Поиск мест..." className="pl-9 h-12" />
        </div>
        <button className="btn btn-outline">Категории</button>
      </div>

      <div className="w-full h-64 bg-gray-100 dark:bg-gray-800 rounded-xl flex items-center justify-center mb-6 relative overflow-hidden border border-dashed">
        <div className="absolute inset-0 opacity-20 bg-[url('https://upload.wikimedia.org/wikipedia/commons/e/ec/World_map_blank_without_borders.svg')] bg-cover bg-center"></div>
        <div className="text-center z-10">
          <MapPin size={48} className="mx-auto text-green-500 mb-2 animate-bounce" />
          <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Интерактивная карта</p>
        </div>
      </div>

      <div className="space-y-4">
        {SERVICES.map(service => (
          <div key={service.id} className="card hover:bg-muted/50 transition-colors cursor-pointer">
            <div className="flex items-start justify-between p-4">
              <div className="flex items-start gap-4">
                <div className="h-10 w-10 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-green-600 dark:text-green-400 mt-1">
                  <MapPin size={20} />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-base">{service.name}</h3>
                    {service.rating > 0 && (
                      <div className="flex items-center text-yellow-500 text-xs">
                        <Star size={12} fill="currentColor" /> {service.rating}
                      </div>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground flex items-center gap-2">
                    <span>{service.address}</span>
                    <span className="w-1 h-1 bg-muted-foreground rounded-full"></span>
                    <span className="font-medium text-primary">{service.distance}</span>
                  </p>
                </div>
              </div>
              <button className="btn btn-outline btn-sm rounded-full h-10 w-10 p-0">
                <Navigation size={18} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}