"use client";

import { useState, useEffect } from "react";
import { Menu, Moon, Sun, Shield, Globe, Check } from "lucide-react";
import Link from "next/link";

interface HeaderProps {
  onMenuClick: () => void;
}

export default function Header({ onMenuClick }: HeaderProps) {
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [lang, setLang] = useState<"ru" | "en">("ru");
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);

  useEffect(() => {
    try {
      const savedTheme = localStorage.getItem("theme") || "light";
      setTheme(savedTheme);
      document.documentElement.setAttribute("data-theme", savedTheme);
    } catch (error) {
      console.warn("Failed to access localStorage for theme", error);
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    document.documentElement.setAttribute("data-theme", newTheme);
    try {
      localStorage.setItem("theme", newTheme);
    } catch (error) {
      console.warn("Failed to save theme to localStorage", error);
    }
  };

  const handleLangChange = (newLang: "ru" | "en") => {
    setLang(newLang);
    setIsLangMenuOpen(false);
  };

  return (
    <header id="combined-header">
      <div className="header-container">
        {/* Левая часть: Иконка + Кнопка Меню */}
        <div className="header-left">
          <div className="app-icon-wrapper">
             <div className="app-icon" style={{background: "#4CAF50", display:"flex", alignItems:"center", justifyContent:"center", color:"white", fontSize:"20px"}}>L</div>
          </div>
          
          {/* КНОПКА МЕНЮ (БУРГЕР) */}
          <button 
            id="menu-btn" 
            onClick={onMenuClick} 
            aria-label="Открыть меню" 
            className="hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full p-1"
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>

        {/* Центр: Заголовок страницы */}
        <div className="page-title">
          Лео Помощник
        </div>

        {/* Правая часть: Админка + Язык + Тема + Аватар */}
        <div className="header-right flex gap-2">
          {/* Админка */}
          <Link href="/admin" className="w-10 h-10 rounded-full bg-transparent border border-green-500/20 text-green-500 flex items-center justify-center hover:bg-green-50 dark:border-green-400/20 dark:text-green-400 dark:hover:bg-green-900/20 transition-colors" title="Админ панель">
            <Shield className="w-5 h-5" />
          </Link>

          {/* Язык */}
          <div className="relative">
            <button 
              onClick={() => setIsLangMenuOpen(!isLangMenuOpen)}
              className="w-10 h-10 rounded-full bg-transparent border border-gray-300 text-gray-600 dark:border-gray-600 dark:text-gray-300 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors relative z-20" 
              title="Сменить язык"
            >
              <Globe className="w-5 h-5" />
            </button>
            {isLangMenuOpen && (
              <div className="absolute right-0 top-12 w-32 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-50 overflow-hidden animate-in fade-in zoom-in-95">
                <button onClick={() => handleLangChange('ru')} className="w-full text-left px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 text-sm flex justify-between items-center text-gray-700 dark:text-gray-200">
                  Русский {lang === 'ru' && <Check className="w-4 h-4 text-green-500" />}
                </button>
                <button onClick={() => handleLangChange('en')} className="w-full text-left px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 text-sm flex justify-between items-center text-gray-700 dark:text-gray-200">
                  English {lang === 'en' && <Check className="w-4 h-4 text-green-500" />}
                </button>
              </div>
            )}
          </div>

          {/* Тема */}
          <button id="theme-toggle" onClick={toggleTheme} aria-label="Сменить тему" className="hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full p-1">
            {theme === "light" ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
          </button>

          {/* Аватар */}
          <img 
             src="https://ui-avatars.com/api/?name=User&background=4CAF50&color=fff" 
             alt="User" 
             className="user-avatar" 
          />
        </div>
      </div>
    </header>
  );
}