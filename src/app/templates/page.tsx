"use client";

import { Download, FileText, Calendar, FileSpreadsheet } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const TEMPLATES = [
  { id: 1, title: "Бюджет на месяц", desc: "Excel таблица для отслеживания расходов", type: "Excel", icon: FileSpreadsheet, size: "24 KB" },
  { id: 2, title: "Список покупок", desc: "Печатный формат для планирования закупок", type: "PDF", icon: FileText, size: "150 KB" },
  { id: 3, title: "План тренировок", desc: "График занятий на неделю", type: "PDF", icon: Calendar, size: "200 KB" },
];

export default function TemplatesPage() {
  return (
    <div className="fade-in main-content">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">📁 Шаблоны и файлы</h1>
        <p className="text-muted-foreground">Готовые макеты для упорядочивания вашей жизни</p>
      </div>

      <div className="button-grid mb-8">
        {TEMPLATES.map(tmpl => (
          <div key={tmpl.id} className="card text-center hover:shadow-md transition-shadow">
             <div className={`p-3 rounded-lg bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 mx-auto mb-4 inline-block`}>
              <tmpl.icon size={32} />
            </div>
            <h3 className="font-bold text-lg mb-1">{tmpl.title}</h3>
            <p className="text-xs text-muted-foreground mb-4 h-8">{tmpl.desc}</p>
            <div className="flex items-center justify-between border-t pt-4 mt-2">
              <span className="text-xs text-muted-foreground">{tmpl.size}</span>
              <button className="btn btn-sm btn-primary"><Download className="h-4 w-4 mr-2" /> Скачать</button>
            </div>
          </div>
        ))}
      </div>

      <div className="card bg-green-50 dark:bg-green-900/10 border-green-200 dark:border-green-800">
        <div className="text-center">
          <h3 className="font-bold text-lg mb-2">Нужен другой шаблон?</h3>
          <p className="text-sm text-muted-foreground mb-4">Напишите нам, и мы добавим его в библиотеку.</p>
          <button className="btn btn-primary">Запросить шаблон</button>
        </div>
      </div>
    </div>
  );
}