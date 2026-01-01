"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

type Lang = "ru" | "en";

interface LangContextType {
  lang: Lang;
  setLang: (lang: Lang) => void;
  t: (key: string) => string; // Simple translation helper
}

const LangContext = createContext<LangContextType | undefined>(undefined);

// Словарь переводов
const DICTIONARY: Record<Lang, Record<string, string>> = {
  ru: {
    // Header
    "menu": "Меню",
    "customize": "Настроить",
    "save": "Сохранить",
    // Home
    "home": "Главная",
    "welcome_back": "Добро пожаловать обратно",
    "select_widgets": "Выберите виджеты для отображения",
    "quick_access": "Быстрый доступ",
    "latest_news": "Последние новости",
    "all_news": "Все новости",
    "greeting_morning": "Доброе утро!",
    "greeting_day": "Добрый день!",
    "greeting_evening": "Добрый вечер!",
    "greeting_night": "Привет ночным!",
    "greeting_text": "Лео Ассистент готов помочь. Здесь ваши финансы, новости и AI.",
    "weather": "Погода",
    "currency": "Курсы ЦБ",
    "finance": "Финансы",
    "gigachat": "GigaChat",
    "games": "Игры",
    "news": "Новости",
    // Widgets
    "widget_greeting": "Приветствие",
    "widget_weather": "Погода",
    "widget_currency": "Курсы валют",
    "widget_shortcuts": "Быстрые действия",
    "widget_news": "Новости",
    "updated": "Обновлено",
    "condition": "Облачно",
    "moscow": "Москва",
  },
  en: {
    // Header
    "menu": "Menu",
    "customize": "Customize",
    "save": "Save",
    // Home
    "home": "Home",
    "welcome_back": "Welcome back",
    "select_widgets": "Select widgets to display",
    "quick_access": "Quick Access",
    "latest_news": "Latest News",
    "all_news": "All News",
    "greeting_morning": "Good Morning!",
    "greeting_day": "Good Afternoon!",
    "greeting_evening": "Good Evening!",
    "greeting_night": "Good Night!",
    "greeting_text": "Leo Assistant is ready to help. Your finances, news, and AI are here.",
    "weather": "Weather",
    "currency": "Currency",
    "finance": "Finance",
    "gigachat": "GigaChat",
    "games": "Games",
    "news": "News",
    // Widgets
    "widget_greeting": "Greeting",
    "widget_weather": "Weather",
    "widget_currency": "Currency",
    "widget_shortcuts": "Quick Shortcuts",
    "widget_news": "News",
    "updated": "Updated",
    "condition": "Cloudy",
    "moscow": "Moscow",
  },
};

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("ru");

  // Загрузка из localStorage при монтировании
  useEffect(() => {
    try {
      const savedLang = localStorage.getItem("app-lang") as Lang;
      if (savedLang && (savedLang === "ru" || savedLang === "en")) {
        setLangState(savedLang);
      }
    } catch (e) {
      console.warn("Failed to load language", e);
    }
  }, []);

  const setLang = (newLang: Lang) => {
    setLangState(newLang);
    try {
      localStorage.setItem("app-lang", newLang);
    } catch (e) {
      console.warn("Failed to save language", e);
    }
  };

  const t = (key: string): string => {
    return DICTIONARY[lang][key] || key;
  };

  return (
    <LangContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LangContext.Provider>
  );
}

export function useLang() {
  const context = useContext(LangContext);
  if (context === undefined) {
    throw new Error("useLang must be used within a LangProvider");
  }
  return context;
}