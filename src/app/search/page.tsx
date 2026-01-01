"use client";

import { useState } from "react";
import { Search, FileText, DollarSign, Cloud, Film } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const SEARCH_SUGGESTIONS = [
  { query: "курс", title: "Курсы валют", desc: "Конвертер и графики", icon: DollarSign, href: "/currency" },
  { query: "погода", title: "Погода", desc: "Прогноз по городам", icon: Cloud, href: "/weather" },
  { query: "фильм", title: "Фильмы", desc: "Подборка на вечер", icon: Film, href: "/movies" },
  { query: "финансы", title: "Финансы", desc: "Калькулятор и бюджет", icon: FileText, href: "/finance" },
];

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState(SEARCH_SUGGESTIONS);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.toLowerCase();
    setQuery(e.target.value);
    if (!val) {
      setResults(SEARCH_SUGGESTIONS);
      return;
    }
    const filtered = SEARCH_SUGGESTIONS.filter(s => 
      s.query.includes(val) || s.title.toLowerCase().includes(val)
    );
    setResults(filtered);
  };

  return (
    <div className="fade-in main-content">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold mb-2">Поиск по функциям</h1>
        <p className="text-muted-foreground">Например: <em>"курс"</em>, <em>"погода"</em>, <em>"финансы"</em></p>
      </div>

      <div className="relative mb-8">
        <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
        <Input 
          placeholder="Что вы ищете?" 
          className="pl-10 h-12 text-lg border-input focus:ring-primary"
          value={query}
          onChange={handleSearch}
          autoFocus
        />
        <kbd className="pointer-events-none absolute right-3 top-3 hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
          <span className="text-xs">⌘</span>K
        </kbd>
      </div>

      <div className="space-y-2">
        {results.length === 0 && (
          <div className="card">
            <div className="text-center py-8 text-muted-foreground">
              Ничего не найдено по запросу "{query}"
            </div>
          </div>
        )}
        {results.map((item) => (
          <a key={item.query} href={item.href} className="block">
            <div className="card hover:bg-muted/50 transition-colors cursor-pointer p-4 flex items-center gap-4">
              <div className="p-2 bg-primary/10 rounded-lg text-primary">
                <item.icon size={20} />
              </div>
              <div>
                <h3 className="text-base font-semibold">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.desc}</p>
              </div>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}