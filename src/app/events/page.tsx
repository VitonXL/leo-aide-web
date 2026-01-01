"use client";

import { Calendar as CalendarIcon, MapPin, Clock, Ticket, Filter } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const EVENTS = [
  { 
    id: 1, 
    title: "Запуск Leo Premium 2.0", 
    date: "15 Ноября, 18:00", 
    location: "Онлайн (Telegram)", 
    price: "Бесплатно",
    tags: ["Обновление", "Premium"]
  },
  { 
    id: 2, 
    title: "Вебинар: Финансовая грамотность", 
    date: "20 Ноября, 19:30", 
    location: "Zoom", 
    price: "300 ₽",
    tags: ["Образование", "Финансы"]
  },
  { 
    id: 3, 
    title: "Новогодняя акция", 
    date: "1 Декабря", 
    location: "Бот", 
    price: "Скидки до 50%",
    tags: ["Акция"]
  }
];

export default function EventsPage() {
  return (
    <div className="fade-in main-content">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <CalendarIcon className="text-primary" /> Афиша событий
        </h1>
        <button className="btn btn-outline"><Filter className="h-4 w-4 mr-2" /> Фильтры</button>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {EVENTS.map(event => (
          <div key={event.id} className="card flex flex-col h-full hover:shadow-md transition-shadow">
            <div className="flex gap-2 mb-2">
              {event.tags.map(tag => (
                <Badge key={tag} className="text-xs bg-muted">{tag}</Badge>
              ))}
            </div>
            <h3 className="text-xl font-bold mb-2 leading-tight">{event.title}</h3>
            <div className="space-y-2 text-sm text-muted-foreground mb-4 flex-1">
              <div className="flex items-center gap-2">
                <Clock size={16} className="text-primary" /> {event.date}
              </div>
              <div className="flex items-center gap-2">
                <MapPin size={16} className="text-primary" /> {event.location}
              </div>
            </div>
            <div className="flex items-center justify-between border-t pt-4 mt-auto">
              <span className="font-bold text-green-600">{event.price}</span>
              <button className="btn btn-sm btn-outline"><Ticket className="h-4 w-4 mr-1" /> Подробнее</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}