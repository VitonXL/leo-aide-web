"use client";

import { Check, Crown, Zap, Shield, Star, HelpCircle, Loader2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

// Mock User Data (берем из ProfilePage для примера)
const MOCK_USER_EMAIL = "alex@example.com"; 
const MOCK_USER_ID = "12459384";

const plans = [
  {
    name: "Старт",
    duration: "30 дней",
    price: 99,
    oldPrice: null,
    features: ["Доступ к GigaChat", "Погода в 5 городах", "Без рекламы"],
    popular: false,
  },
  {
    name: "Стандарт",
    duration: "90 дней",
    price: 249,
    oldPrice: 299,
    features: ["Всё из Старт", "Приоритетная поддержка", "Расширенные заметки"],
    popular: false,
  },
  {
    name: "Максимум",
    duration: "365 дней",
    price: 699,
    oldPrice: 999,
    features: ["Всё из Стандарт", "Антивирус VirusTotal", "Подбор фильмов", "Кастомные игры"],
    popular: true,
  },
];

export default function PremiumPage() {
  const [loadingPlanId, setLoadingPlanId] = useState<string | null>(null);

  const handlePayment = async (price: number, planName: string) => {
    setLoadingPlanId(planName);
    
    // Генерация уникального ID заказа
    const orderId = `${MOCK_USER_ID}_${Date.now()}`;

    try {
      const response = await fetch('/api/payment/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: price,
          orderId: orderId,
          email: MOCK_USER_EMAIL,
          description: `Подписка: ${planName}`
        }),
      });

      const data = await response.json();

      if (data.url) {
        // Перенаправляем пользователя на страницу оплаты FreeKassa
        window.location.href = data.url;
      } else {
        alert("Ошибка при создании платежа. Попробуйте позже.");
      }
    } catch (error) {
      console.error(error);
      alert("Произошла ошибка соединения.");
    } finally {
      setLoadingPlanId(null);
    }
  };

  return (
    <div className="container py-8 max-w-5xl main-content">
      <div className="text-center mb-10 fade-in">
        <div className="inline-flex items-center justify-center p-3 bg-green-500/10 rounded-full mb-4">
          <Crown className="h-8 w-8 text-green-600 dark:text-green-400" />
        </div>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Разблокируйте весь потенциал бота. GigaChat, Фильмы, Антивирус и многое другое без ограничений.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {plans.map((plan, index) => (
          <div key={index} className={`card relative flex flex-col ${plan.popular ? 'border-green-500 border-2 shadow-lg' : ''}`}>
            {plan.popular && (
              <div className="absolute -top-[1.5rem] left-1/2 -translate-x-1/2 bg-green-600 text-white px-4 py-1 rounded-full text-xs font-bold shadow-md z-10">
                Популярный
              </div>
            )}
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold">{plan.price} ₽</h3>
              <p className="text-sm text-muted-foreground">{plan.duration}</p>
              {plan.oldPrice && (
                <div className="text-sm text-muted-foreground line-through">{plan.oldPrice} ₽</div>
              )}
            </div>
            <ul className="space-y-3 mb-6 flex-1">
              {plan.features.map((feature, idx) => (
                <li key={idx} className="flex items-start gap-2 text-sm">
                  <Check className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700 dark:text-gray-300">{feature}</span>
                </li>
              ))}
            </ul>
            <button 
              className={`btn w-full ${plan.popular ? 'btn-primary' : 'btn-outline'}`}
              onClick={() => handlePayment(plan.price, plan.name)}
              disabled={loadingPlanId === plan.name}
            >
              {loadingPlanId === plan.name ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" /> Обработка...
                </>
              ) : (
                "Выбрать"
              )}
            </button>
          </div>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-6 mt-10 fade-in">
        <div className="card">
          <h3 className="section-title"><Zap className="h-5 w-5" /> Возможности</h3>
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-green-600"><Shield className="h-5 w-5" /></div>
              <div>
                <div className="font-semibold text-gray-900 dark:text-white">Антивирус</div>
                <div className="text-sm text-muted-foreground">Проверка файлов и ссылок через VirusTotal</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-green-600"><Star className="h-5 w-5" /></div>
              <div>
                <div className="font-semibold text-gray-900 dark:text-white">Подбор фильмов</div>
                <div className="text-sm text-muted-foreground">Kinopoisk API (до 10 запросов)</div>
              </div>
            </div>
          </div>
        </div>
        <div className="card">
          <h3 className="section-title"><Crown className="h-5 w-5" /> Оплата</h3>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">Поддержка платежных систем:</p>
            <div className="flex gap-2">
               <span className="btn-sm" style={{background: "#e8f5e9", color: "#2e7d32", border: "1px solid #c8e6c9"}}>FreeKassa</span>
            </div>
            <div className="p-4 bg-muted/30 rounded-lg text-sm border-l-4 border-green-500">
              <p className="mb-2 font-medium">Нужна помощь?</p>
              <p className="text-muted-foreground mb-2">Если возникли проблемы с оплатой, создайте тикет.</p>
              <Link href="/support" className="btn-sm btn-primary inline-flex items-center gap-2">
                 <HelpCircle className="h-4 w-4" /> Создать тикет
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}