"use client";

import { Newspaper, Clock, Share2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const mockNews = [
  { id: 1, title: "Курс доллара превысил 99 рублей", desc: "Новый рекорд на валютном рынке.", date: "2 часа назад" },
  { id: 2, title: "Обновление GigaChat", desc: "Теперь можно генерировать изображения.", date: "5 часов назад" },
  { id: 3, title: "Скидка на Premium 20%", desc: "Только до конца месяца успейте оформить подписку.", date: "1 день назад" },
];

export default function NewsPage() {
  return (
    <div className="container py-8 max-w-3xl main-content">
      <div className="space-y-4">
        {mockNews.map(news => (
          <Card key={news.id} className="hover:bg-muted/50 transition-colors">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-xl mb-2">{news.title}</CardTitle>
                  <CardDescription>{news.desc}</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="flex items-center justify-between">
              <div className="flex items-center text-sm text-muted-foreground gap-1">
                <Clock className="h-4 w-4" /> {news.date}
              </div>
              <Button variant="ghost" size="sm">
                <Share2 className="h-4 w-4 mr-2" /> Поделиться
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}