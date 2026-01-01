"use client";

import { useState } from "react";
import { Newspaper, Clock, Tag, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/button";
import { Button } from "@/components/ui/button";

const POSTS = [
  { 
    id: 1, 
    title: "Как эффективно управлять финансами в 2024 году", 
    excerpt: "5 простых советов для увеличения сбережений без жесткой экономии.",
    date: "12 Окт 2023",
    category: "Финансы",
    readTime: "5 мин"
  },
  { 
    id: 2, 
    title: "Обновление GigaChat: что нового?", 
    excerpt: "Мы добавили генерацию изображений и улучшили понимание контекста.",
    date: "05 Окт 2023",
    category: "Новости",
    readTime: "3 мин"
  },
  { 
    id: 3, 
    title: "Топ-10 бесплатных фильмов на этой неделе", 
    excerpt: "Подборка лучших картин, доступных по подписке Premium.",
    date: "28 Сен 2023",
    category: "Развлечения",
    readTime: "8 мин"
  }
];

export default function BlogPage() {
  const [filter, setFilter] = useState("Все");

  return (
    <div className="fade-in main-content">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Newspaper className="text-primary" /> Блог
        </h1>
        <div className="relative w-full md:w-64">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Поиск..." className="pl-9" />
        </div>
      </div>

      <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
        {["Все", "Финансы", "Новости", "Развлечения"].map(cat => (
          <button 
            key={cat}
            className={`btn btn-sm rounded-full ${filter === cat ? "btn-primary" : "btn-outline"}`}
            onClick={() => setFilter(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="news-feed">
        {POSTS.map(post => (
          <div key={post.id} className="news-item">
            <div className="news-icon"><Newspaper size={20} /></div>
            <div className="news-content">
               <div className="flex items-center gap-2 mb-1">
                 <Badge variant="outline" className="text-xs">{post.category}</Badge>
                 <div className="flex items-center text-xs text-muted-foreground gap-1">
                  <Clock size={12} /> {post.date}
                </div>
                <div className="text-xs text-muted-foreground ml-auto">{post.readTime}</div>
               </div>
              <div className="news-title text-xl hover:text-primary transition-colors cursor-pointer">{post.title}</div>
              <p className="text-sm text-muted-foreground mt-1">{post.excerpt}</p>
              <button className="btn-sm btn-link px-0 mt-2">Читать далее &rarr;</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}