"use client";

import { useState } from "react";
import { Sparkles, Lightbulb, RefreshCw, Copy, CheckCircle, Smile, Frown, Brain, Zap, Coffee, Heart } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// --- MOCK DATA ---
const QUOTES = [
  { text: "Единственный способ делать великие дела — любить то, что вы делаете.", author: "Стив Джобс" },
  { text: "Будущее принадлежит тем, кто верит в красоту своей мечты.", author: "Элеонора Рузвельт" },
  { text: "Успех — это способность идти от поражения к поражению, не теряя энтузиазма.", author: "Уинстон Черчилль" },
  { text: "Жизнь — это то, что случается с нами, пока мы строим другие планы.", author: "Джон Леннон" },
  { text: "Мудрость — это не знание множества ответов, а умение задавать правильные вопросы.", author: "Клод Леви-Стросс" },
];

const FACTS = [
  { text: "Медь — единственный металл, который имеет естественный цвет, отличный от серого или серебристого." },
  { text: "Медузы не имеют мозга, сердца, костей или глаз." },
  { text: "В Японии существует более 50 способов приготовления одной лишь яйцеклетки угря." },
  { text: "Первая орбитальная станция «Мир» была самой сложной космической конструкцией своего времени." },
  { text: "Мед имеет бесконечный срок годности." },
];

const MOOD_QUOTES = {
  happy: [
    "Счастье — это не что иное, как здоровье и плохая память.",
    "Улыбайтесь! Это сбивает с толку ваших врагов.",
    "Самый верный способ быть счастливым — это делать счастливым других."
  ],
  sad: [
    "Плачь, и ты будешь меньше смеяться. Смейся, и ты будешь меньше плакать.",
    "Даже самая темная ночь закончится, и взойдет солнце.",
    "Не печалься о том, что прошло, и не тревожься о том, что будет."
  ],
  thoughtful: [
    "Мыслите глубоко, говорите мягко, любите много.",
    "Знание — сила, но только тогда, когда оно применяется.",
    "Кто ходит с мудрыми, тот мудрым станет."
  ],
  energetic: [
    "Действие — ключ ко всем успехам.",
    "Не бойся идти медленно, бойся стоять на месте.",
    "Энергия и настойчивость conquers all things."
  ],
  romantic: [
    "Любовь — это искусство, которое нужно изучать и практиковать.",
    "Настоящая любовь начинается там, где заканчивается ничто.",
    "Лучшее доказательство любви — это доверие."
  ]
};

const MOOD_CONFIG = [
  { id: 'happy' as const, label: 'Радость', icon: Smile, color: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' },
  { id: 'sad' as const, label: 'Грусть', icon: Frown, color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' },
  { id: 'thoughtful' as const, label: 'Размышления', icon: Brain, color: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400' },
  { id: 'energetic' as const, label: 'Энергия', icon: Zap, color: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' },
  { id: 'romantic' as const, label: 'Любовь', icon: Heart, color: 'bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-400' },
];

type MoodKey = keyof typeof MOOD_QUOTES;

export default function InspirationPage() {
  const [quoteIndex, setQuoteIndex] = useState(0);
  const [factIndex, setFactIndex] = useState(0);
  const [selectedMood, setSelectedMood] = useState<MoodKey | null>(null);
  const [moodQuoteIndex, setMoodQuoteIndex] = useState(0);
  const [copied, setCopied] = useState(false);

  const currentQuote = QUOTES[quoteIndex];
  const currentFact = FACTS[factIndex];

  const refreshQuote = () => {
    let newIndex;
    do {
      newIndex = Math.floor(Math.random() * QUOTES.length);
    } while (newIndex === quoteIndex);
    setQuoteIndex(newIndex);
  };

  const refreshFact = () => {
    let newIndex;
    do {
      newIndex = Math.floor(Math.random() * FACTS.length);
    } while (newIndex === factIndex);
    setFactIndex(newIndex);
  };

  const handleMoodSelect = (mood: MoodKey) => {
    setSelectedMood(mood);
    setMoodQuoteIndex(Math.floor(Math.random() * MOOD_QUOTES[mood].length));
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="container py-8 max-w-4xl main-content">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold flex items-center justify-center gap-2">
          <Sparkles className="text-primary" /> Вдохновение
        </h1>
        <p className="text-muted-foreground">Контент для поднятия настроения и размышлений</p>
      </div>

      <Tabs defaultValue="quote" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="quote">Цитата дня</TabsTrigger>
          <TabsTrigger value="fact">Факт недели</TabsTrigger>
          <TabsTrigger value="mood">Афоризм</TabsTrigger>
        </TabsList>

        {/* --- ЦИТАТА ДНЯ --- */}
        <TabsContent value="quote">
          <Card className="bg-gradient-to-br from-green-50 to-teal-50 dark:from-green-900/20 dark:to-teal-900/20 border-green-200 dark:border-green-800 overflow-hidden">
            <CardHeader className="pb-4">
              <div className="flex justify-between items-start">
                <Badge className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                  Цитата #{quoteIndex + 1}
                </Badge>
                <Button size="sm" variant="ghost" onClick={() => copyToClipboard(`"${currentQuote.text}" — ${currentQuote.author}`)}>
                  {copied ? <CheckCircle className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>
            </CardHeader>
            <CardContent className="text-center py-8">
              <div className="text-4xl text-green-200 absolute top-4 left-4 opacity-20 select-none">“</div>
              <p className="text-2xl font-serif font-medium text-gray-800 dark:text-gray-100 mb-6 italic leading-relaxed px-8">
                {currentQuote.text}
              </p>
              <div className="text-sm font-bold text-gray-600 dark:text-gray-400 uppercase tracking-widest mb-6">
                — {currentQuote.author}
              </div>
              <Button onClick={refreshQuote} className="mx-auto" variant="outline">
                <RefreshCw className="mr-2 h-4 w-4"/> Новая цитата
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* --- ФАКТ НЕДЕЛИ --- */}
        <TabsContent value="fact">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl">
                <Lightbulb className="text-yellow-500" /> Знаете ли вы?
              </CardTitle>
            </CardHeader>
            <CardContent className="py-8">
              <div className="flex flex-col items-center justify-center space-y-6">
                <div className="h-24 w-24 bg-yellow-100 dark:bg-yellow-900/30 rounded-full flex items-center justify-center text-yellow-600 dark:text-yellow-400">
                  <Lightbulb size={48} />
                </div>
                <p className="text-xl font-medium text-center leading-relaxed">
                  {currentFact.text}
                </p>
                <Button onClick={refreshFact} variant="outline" className="min-w-[160px]">
                  <RefreshCw className="mr-2 h-4 w-4"/> Другой факт
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* --- АФОРИЗМ ПО НАСТРОЕНИЮ --- */}
        <TabsContent value="mood">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Подбор афоризма</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center text-sm text-muted-foreground mb-4">
                Выберите своё настроение
              </div>
              
              <div className="grid grid-cols-5 gap-2">
                {MOOD_CONFIG.map((mood) => (
                  <Button
                    key={mood.id}
                    variant={selectedMood === mood.id ? "default" : "outline"}
                    className={`flex-col h-20 gap-2 ${selectedMood === mood.id ? 'ring-2 ring-offset-2 ring-primary' : ''}`}
                    onClick={() => handleMoodSelect(mood.id)}
                  >
                    <mood.icon size={24} />
                    <span className="text-xs">{mood.label}</span>
                  </Button>
                ))}
              </div>

              {selectedMood && (
                <div className="pt-6 border-t animate-in fade-in slide-in-from-bottom-4">
                  <div className="flex items-center gap-2 mb-4">
                    <Badge className={MOOD_CONFIG.find(m => m.id === selectedMood)!.color}>
                      {MOOD_CONFIG.find(m => m.id === selectedMood)!.label}
                    </Badge>
                    <div className="h-px flex-1 bg-muted"></div>
                  </div>
                  
                  <div className="relative p-6 rounded-xl bg-muted/50 border border-muted">
                    <div className="text-4xl text-muted absolute top-2 left-4 opacity-30">“</div>
                    <p className="text-lg font-medium text-center italic px-4">
                      {MOOD_QUOTES[selectedMood][moodQuoteIndex]}
                    </p>
                  </div>
                  
                  <div className="flex justify-center mt-4">
                    <Button 
                      size="sm" 
                      variant="ghost" 
                      onClick={() => setMoodQuoteIndex(Math.floor(Math.random() * MOOD_QUOTES[selectedMood].length))}
                    >
                      <RefreshCw className="mr-2 h-4 w-4"/> Ещё вариант
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}