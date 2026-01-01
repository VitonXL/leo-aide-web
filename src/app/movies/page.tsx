"use client";

import { useState } from "react";
import { Search, Film, Star, Clock, Lock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function MoviesPage() {
  const [query, setQuery] = useState("");
  const [searched, setSearched] = useState(false);
  
  // Mock Data
  const mockMovies = [
    { id: 1, title: "Начало", year: 2010, rating: 8.8, genre: "Фантастика", duration: "2ч 28м" },
    { id: 2, title: "Интерстеллар", year: 2014, rating: 8.6, genre: "Фантастика", duration: "2ч 49м" },
    { id: 3, title: "Матрица", year: 1999, rating: 8.7, genre: "Экшн", duration: "2ч 16м" },
  ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearched(true);
  };

  return (
    <div className="container py-8 max-w-4xl main-content">
      <div className="mb-8 text-center">
        <p className="text-muted-foreground">Найдите идеальный фильм для вечера через Kinopoisk API</p>
        <Badge variant="outline" className="mt-2"><Lock className="h-3 w-3 mr-1" /> Функция Premium</Badge>
      </div>

      <Card className="mb-8">
        <CardContent className="pt-6">
          <form onSubmit={handleSearch} className="flex gap-2">
            <Input 
              placeholder="Введите название фильма..." 
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              disabled={true} // Mock disabled
            />
            <Button type="submit" disabled={true}>
              <Search className="mr-2 h-4 w-4" /> Поиск
            </Button>
          </form>
          {!searched && (
            <p className="text-sm text-muted-foreground mt-2 text-center">
              Для использования этой функции необходимо оформить Premium подписку.
            </p>
          )}
        </CardContent>
      </Card>

      {searched && (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {mockMovies.map(movie => (
            <Card key={movie.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <CardTitle className="text-base truncate">{movie.title}</CardTitle>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span>{movie.year}</span> • <span>{movie.genre}</span>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-1 text-yellow-500 font-bold">
                    <Star size={14} fill="currentColor" /> {movie.rating}
                  </div>
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <Clock size={14} /> {movie.duration}
                  </div>
                </div>
                <Button className="w-full" size="sm" variant="outline">Смотреть</Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}