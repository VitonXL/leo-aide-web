"use client";

import { useState } from "react";
import { BookOpen, Film, Music, Brain, Sparkles, Sun, CloudRain, Moon, Coffee, Zap, Heart, Play, ExternalLink, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// --- MOCK DATA ---
const MOVIES = [
  { id: 1, title: "Начало", genre: "Фантастика", mood: ["think", "energetic"], rating: 8.8, year: 2010 },
  { id: 2, title: "Форрест Гамп", genre: "Драма", mood: ["happy", "sad"], rating: 8.8, year: 1994 },
  { id: 3, title: "Интерстеллар", genre: "Фантастика", mood: ["think", "sad"], rating: 8.6, year: 2014 },
  { id: 4, title: "Мстители: Финал", genre: "Экшн", mood: ["energetic", "happy"], rating: 8.4, year: 2019 },
  { id: 5, title: "Властелин Колец", genre: "Фэнтези", mood: ["think", "energetic"], rating: 8.9, year: 2003 },
  { id: 6, title: "Амели", genre: "Романтика", mood: ["happy", "calm"], rating: 8.3, year: 2001 },
];

const BOOKS = [
  { id: 1, title: "Sapiens. Краткая история человечества", author: "Юваль Ной Харари", genre: "Наука", pages: 443 },
  { id: 2, title: "Маленький принц", author: "Антуан де Сент-Экзюпери", genre: "Философия", pages: 96 },
  { id: 3, title: "Дюна", author: "Фрэнк Герберт", genre: "Фантастика", pages: 412 },
  { id: 4, title: "Сто лет одиночества", author: "Габриэль Гарсиа Маркес", genre: "Классика", pages: 360 },
];

const PLAYLISTS = [
  { id: 1, name: "Lo-Fi Study", vibe: "calm", icon: "☕", tracks: 24 },
  { id: 2, name: "Gym Hype", vibe: "energetic", icon: "🔥", tracks: 50 },
  { id: 3, name: "Evening Jazz", vibe: "relaxed", icon: "🎷", tracks: 30 },
  { id: 4, name: "Road Trip", vibe: "happy", icon: "🚗", tracks: 45 },
];

type MoodType = "happy" | "sad" | "energetic" | "calm" | "think";
type WeatherType = "sunny" | "rainy" | "cloudy";
type TimeType = "morning" | "day" | "evening";

export default function RecommendationsPage() {
  // --- SMART RECOMMENDER STATE ---
  const [smartMood, setSmartMood] = useState<MoodType>("happy");
  const [smartWeather, setSmartWeather] = useState<WeatherType>("sunny");
  const [smartTime, setSmartTime] = useState<TimeType>("evening");
  const [suggestion, setSuggestion] = useState<any>(null);

  // --- FILTERS STATE ---
  const [movieFilter, setMovieFilter] = useState<string>("all");
  const [bookSearch, setBookSearch] = useState("");

  // --- LOGIC: SMART RECOMMENDER ---
  const generateSuggestion = () => {
    let recommendedMovie = MOVIES[0];
    let recommendedBook = BOOKS[0];
    let text = "";

    // Simple Logic Tree
    if (smartWeather === "rainy") {
      if (smartMood === "sad") {
        text = "На улице дождь и грустно? Уютный вечер с книгой или трогательным фильмом — это то, что нужно.";
        recommendedMovie = MOVIES.find(m => m.id === 2) || MOVIES[0]; // Forrest Gump
        recommendedBook = BOOKS.find(b => b.id === 2) || BOOKS[0]; // Little Prince
      } else {
        text = "Идеальная погода, чтобы остаться дома и посмотреть что-то захватывающее.";
        recommendedMovie = MOVIES.find(m => m.id === 1) || MOVIES[0]; // Inception
      }
    } else if (smartWeather === "sunny") {
      if (smartMood === "energetic") {
        text = "Солнечно и сил много? Время для экшна или прогулки, но если остаетесь — включите музыку.";
        recommendedMovie = MOVIES.find(m => m.id === 4) || MOVIES[0]; // Avengers
      } else {
        text = "Прекрасный день для легкого чтения или доброго фильма.";
        recommendedMovie = MOVIES.find(m => m.id === 6) || MOVIES[0]; // Amelie
      }
    } else {
      // Cloudy/Neutral
      text = "Погода нейтральная, почитаем что-нибудь умное.";
      recommendedBook = BOOKS.find(b => b.id === 1) || BOOKS[0]; // Sapiens
    }

    setSuggestion({ text, movie: recommendedMovie, book: recommendedBook });
  };

  // --- FILTERS LOGIC ---
  const filteredMovies = movieFilter === "all" 
    ? MOVIES 
    : MOVIES.filter(m => m.mood.includes(movieFilter as MoodType));

  const filteredBooks = bookSearch 
    ? BOOKS.filter(b => b.title.toLowerCase().includes(bookSearch.toLowerCase()) || b.author.toLowerCase().includes(bookSearch.toLowerCase()))
    : BOOKS;

  return (
    <div className="fade-in main-content">
      <div className="mb-8">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Sparkles className="text-primary" /> Умные рекомендации
        </h1>
        <p className="text-muted-foreground">AI-подбор контента на основе вашего настроения</p>
      </div>

      <Tabs defaultValue="smart" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="smart" className="gap-2"><Brain size={18}/> Ассистент</TabsTrigger>
          <TabsTrigger value="movies" className="gap-2"><Film size={18}/> Фильмы</TabsTrigger>
          <TabsTrigger value="books" className="gap-2"><BookOpen size={18}/> Книги</TabsTrigger>
          <TabsTrigger value="music" className="gap-2"><Music size={18}/> Музыка</TabsTrigger>
        </TabsList>

        {/* --- 1. SMART ASSISTANT --- */}
        <TabsContent value="smart">
          <div className="grid md:grid-cols-2 gap-6">
            {/* Controls */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2"><Zap className="text-yellow-500"/> Параметры</CardTitle>
                <CardDescription>Настройте контекст для точной рекомендации</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Какое у вас настроение?</label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { v: "happy" as MoodType, l: "Радость", i: "😊" },
                      { v: "sad" as MoodType, l: "Грусть", i: "😢" },
                      { v: "energetic" as MoodType, l: "Энергия", i: "⚡" },
                      { v: "calm" as MoodType, l: "Спокойствие", i: "🍵" },
                      { v: "think" as MoodType, l: "Думать", i: "🧠" },
                    ].map((opt) => (
                      <button
                        key={opt.v}
                        onClick={() => setSmartMood(opt.v)}
                        className={`p-3 rounded-lg text-sm font-medium border transition-all ${smartMood === opt.v ? 'bg-primary text-white border-primary' : 'bg-card hover:bg-muted border-border'}`}
                      >
                        <div className="text-xl mb-1">{opt.i}</div>
                        {opt.l}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Погода</label>
                    <Select value={smartWeather} onValueChange={(v) => setSmartWeather(v as WeatherType)}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="sunny"><Sun className="h-4 w-4 mr-2 text-yellow-500"/> Солнечно</SelectItem>
                        <SelectItem value="rainy"><CloudRain className="h-4 w-4 mr-2 text-blue-500"/> Дождь</SelectItem>
                        <SelectItem value="cloudy"><CloudRain className="h-4 w-4 mr-2 text-gray-500"/> Облачно</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Время суток</label>
                    <Select value={smartTime} onValueChange={(v) => setSmartTime(v as TimeType)}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="morning"><Sun className="h-4 w-4 mr-2 text-orange-400"/> Утро</SelectItem>
                        <SelectItem value="day"><Sun className="h-4 w-4 mr-2 text-yellow-500"/> День</SelectItem>
                        <SelectItem value="evening"><Moon className="h-4 w-4 mr-2 text-indigo-400"/> Вечер</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <Button onClick={generateSuggestion} className="w-full btn-primary">
                  <Brain className="mr-2 h-4 w-4"/> Получить совет
                </Button>
              </CardContent>
            </Card>

            {/* Result */}
            <Card className="bg-gradient-to-br from-primary/10 to-blue-500/10 border-primary/20">
              <CardContent className="p-8 h-full flex flex-col justify-center text-center">
                {!suggestion ? (
                  <div className="opacity-50">
                    <Sparkles className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                    <p className="text-muted-foreground">Выберите параметры слева</p>
                  </div>
                ) : (
                  <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
                    <p className="text-lg font-medium leading-relaxed italic">"{suggestion.text}"</p>
                    
                    <div className="grid grid-cols-2 gap-4 text-left">
                      <div className="p-4 bg-white dark:bg-card rounded-lg border shadow-sm">
                        <div className="text-xs font-bold text-muted-foreground mb-2">ФИЛЬМ ДЛЯ ВАС</div>
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="font-bold">{suggestion.movie.title}</div>
                            <div className="text-xs text-muted-foreground">{suggestion.movie.genre} • {suggestion.movie.rating}</div>
                          </div>
                          <Button size="icon" variant="ghost"><Play className="h-4 w-4 text-primary" /></Button>
                        </div>
                      </div>
                      <div className="p-4 bg-white dark:bg-card rounded-lg border shadow-sm">
                        <div className="text-xs font-bold text-muted-foreground mb-2">КНИГА ДЛЯ ВАС</div>
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="font-bold text-sm">{suggestion.book.title}</div>
                            <div className="text-xs text-muted-foreground truncate max-w-[100px]">{suggestion.book.author}</div>
                          </div>
                          <Button size="icon" variant="ghost"><BookOpen className="h-4 w-4 text-primary" /></Button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* --- 2. MOVIES --- */}
        <TabsContent value="movies">
          <div className="flex justify-between items-center mb-6">
            <div className="flex gap-2">
              <Button 
                variant={movieFilter === "all" ? "default" : "outline"} 
                onClick={() => setMovieFilter("all")}
              >Все</Button>
              <Button 
                variant={movieFilter === "happy" ? "default" : "outline"} 
                onClick={() => setMovieFilter("happy")}
              >Радостные</Button>
              <Button 
                variant={movieFilter === "sad" ? "default" : "outline"} 
                onClick={() => setMovieFilter("sad")}
              >Грустные</Button>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {filteredMovies.map(movie => (
              <Card key={movie.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="h-40 bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center text-muted-foreground">
                  <Film className="h-12 w-12 opacity-50" />
                </div>
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold line-clamp-1">{movie.title}</h3>
                    <Badge variant="outline" className="text-xs">{movie.year}</Badge>
                  </div>
                  <div className="flex justify-between items-center text-sm text-muted-foreground mb-4">
                    <span>{movie.genre}</span>
                    <div className="flex items-center text-yellow-500">
                      <span className="text-xs mr-1">★</span> {movie.rating}
                    </div>
                  </div>
                  <Button variant="outline" className="w-full">
                    <Play className="h-4 w-4 mr-2"/> Смотреть
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* --- 3. BOOKS --- */}
        <TabsContent value="books">
          <div className="max-w-2xl mx-auto">
            <div className="relative mb-6">
              <BookOpen className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Поиск по названию или автору..." 
                className="pl-9 h-12"
                value={bookSearch}
                onChange={(e) => setBookSearch(e.target.value)}
              />
            </div>
            
            <div className="space-y-4">
              {filteredBooks.map(book => (
                <Card key={book.id} className="flex gap-4 items-center">
                  <div className="w-16 h-24 bg-primary/10 rounded flex items-center justify-center text-primary flex-shrink-0">
                    <BookOpen className="h-8 w-8" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-lg">{book.title}</h3>
                    <p className="text-sm text-muted-foreground">{book.author}</p>
                    <div className="flex gap-2 mt-2">
                      <Badge variant="secondary">{book.genre}</Badge>
                      <Badge variant="outline">{book.pages} стр.</Badge>
                    </div>
                  </div>
                  <Button variant="ghost" className="text-primary">
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                </Card>
              ))}
            </div>
          </div>
        </TabsContent>

        {/* --- 4. MUSIC --- */}
        <TabsContent value="music">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {PLAYLISTS.map(playlist => (
              <Card key={playlist.id} className="group hover:border-primary transition-colors cursor-pointer">
                <div className="p-6 text-center">
                  <div className="text-4xl mb-3 bg-muted/50 w-16 h-16 rounded-full flex items-center justify-center mx-auto group-hover:scale-110 transition-transform">
                    {playlist.icon}
                  </div>
                  <h3 className="font-bold text-lg mb-1">{playlist.name}</h3>
                  <div className="text-sm text-muted-foreground mb-4 capitalize">{playlist.vibe}</div>
                  <Button variant="outline" className="w-full btn-sm">
                    <Play className="h-3 w-3 mr-1" /> Слушать ({playlist.tracks})
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}