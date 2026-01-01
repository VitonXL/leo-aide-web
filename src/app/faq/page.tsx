"use client";

import { HelpCircle, ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";

const FAQ_ITEMS = [
  {
    question: "Как оформить Premium подписку?",
    answer: "Перейдите в раздел 'Премиум' в меню или на главной странице, выберите подходящий тариф и оплатите удобным способом. Доступ откроется мгновенно."
  },
  {
    question: "Что входит в Premium функционал?",
    answer: "Полный список функций доступен на странице тарифов. Основные преимущества: GigaChat без лимитов, Антивирус, Подбор фильмов и отсутствие рекламы."
  },
  {
    question: "Как связаться с поддержкой?",
    answer: "Вы можете создать тикет в разделе 'Поддержка' или написать нам напрямую в Telegram @support_leo."
  },
  {
    question: "Можно ли вернуть деньги?",
    answer: "Да, мы возвращаем деньги в течение 14 дней с момента оплаты, если услуга вам не подошла. Для этого напишите в поддержку."
  },
  {
    question: "Как привязать банковскую карту?",
    answer: "В данный момент мы используем разовые платежи через шлюз FreeKassa. Привязка карты для регулярных списаний находится в разработке."
  }
];

export default function FaqPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="fade-in main-content">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold flex items-center justify-center gap-2 mb-2">
          <HelpCircle className="text-primary" /> Часто задаваемые вопросы
        </h1>
        <p className="text-muted-foreground">Ответы на популярные вопросы о сервисе</p>
      </div>

      <div className="space-y-4">
        {FAQ_ITEMS.map((item, index) => (
          <div key={index} className="card">
            <div 
              onClick={() => toggle(index)}
              className="cursor-pointer flex justify-between items-center py-4"
            >
              <h3 className="text-base pr-4 font-medium">{item.question}</h3>
              {openIndex === index ? <ChevronUp className="text-muted-foreground" /> : <ChevronDown className="text-muted-foreground" />}
            </div>
            {openIndex === index && (
              <div className="pt-0 text-muted-foreground pb-4">
                {item.answer}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}