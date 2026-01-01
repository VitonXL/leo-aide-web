import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Script from "next/script";
import LayoutClientWrapper from "@/components/LayoutClientWrapper";
import { LangProvider } from "@/contexts/LanguageContext"; // Import Provider

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Лео Помощник",
  description: "Умный помощник для Telegram",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" suppressHydrationWarning>
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet" />
        
        {/* ПОЛИФИЛ ДЛЯ LOCALSTORAGE (Исправляет ошибку Access Denied) */}
        <Script id="local-storage-polyfill" strategy="beforeInteractive">
          {`
          (function() {
            try {
              // Пытаемся записать тестовое значение
              var testKey = '__test__';
              window.localStorage.setItem(testKey, testKey);
              window.localStorage.removeItem(testKey);
            } catch (e) {
              console.warn('localStorage access denied. Initializing memory polyfill.');
              // Создаем полифил на базе памяти
              var MemoryStorage = function() {
                this._data = {};
                this.length = 0;
              };
              
              MemoryStorage.prototype.setItem = function(id, val) {
                if (!this.hasOwnProperty(id)) {
                  this.length++;
                }
                this._data[id] = String(val);
              };
              
              MemoryStorage.prototype.getItem = function(id) {
                return this._data.hasOwnProperty(id) ? this._data[id] : null;
              };
              
              MemoryStorage.prototype.removeItem = function(id) {
                if (this.hasOwnProperty(id)) {
                  delete this._data[id];
                  this.length--;
                }
              };
              
              MemoryStorage.prototype.clear = function() {
                this._data = {};
                this.length = 0;
              };
              
              MemoryStorage.prototype.key = function(index) {
                var keys = Object.keys(this._data);
                return keys[index] || null;
              };
              
              Object.defineProperty(window, 'localStorage', {
                value: new MemoryStorage(),
                writable: true,
                configurable: true
              });
            }
          })();
          `}
        </Script>

        <Script src="https://cdn.jsdelivr.net/npm/chart.js" strategy="afterInteractive" />
      </head>
      <body className={inter.className}>
        {/* WRAP WITH LANGUAGE PROVIDER */}
        <LangProvider>
          <LayoutClientWrapper>
            {children}
          </LayoutClientWrapper>
        </LangProvider>

        <Script id="main-js" strategy="afterInteractive">
          {`
          document.addEventListener('DOMContentLoaded', () => {
            const themeToggle = document.getElementById('theme-toggle');
            const html = document.documentElement;

            let savedTheme = 'light';
            try {
              savedTheme = localStorage.getItem('theme') || 'light';
            } catch (e) {
              console.log('LocalStorage is not available');
            }
            html.setAttribute('data-theme', savedTheme);
            
            if (themeToggle) {
              themeToggle.onclick = () => {
                const isDark = html.getAttribute('data-theme') === 'dark';
                const newTheme = isDark ? 'light' : 'dark';
                html.setAttribute('data-theme', newTheme);
                try {
                  localStorage.setItem('theme', newTheme);
                  document.cookie = \`theme=\${newTheme}; path=/; max-age=31536000\`;
                } catch (e) {
                  console.log('Cannot save theme to localStorage');
                }
              };
            }

            const header = document.getElementById('combined-header');
            let lastScroll = 0;
            if (header) {
              window.addEventListener('scroll', () => {
                const current = window.scrollY;
                if (current > 100 && current > lastScroll) {
                  header.classList.add('hidden');
                } else if (current < lastScroll && current > 50) {
                  header.classList.remove('hidden');
                }
                lastScroll = current;
              });
            }

            window.Toast = {
              show: (msg) => {
                const toast = document.getElementById('toast');
                if (!toast) return;
                toast.textContent = msg;
                toast.className = 'show';
                setTimeout(() => toast.className = '', 3000);
              },
              info: (msg) => window.Toast ? window.Toast.show(msg) : console.log(msg),
              success: (msg) => window.Toast ? window.Toast.show(msg) : console.log(msg),
              warning: (msg) => window.Toast ? window.Toast.show(msg) : console.log(msg),
              error: (msg) => window.Toast ? window.Toast.show(msg) : console.log(msg)
            };

            if (window.Telegram?.WebApp) {
              window.Telegram.WebApp.ready();
              window.Telegram.WebApp.expand();
            }
          });
          `}
        </Script>
      </body>
    </html>
  );
}