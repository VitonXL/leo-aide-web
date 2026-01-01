"use client";

import { Monitor, Download, ExternalLink, Shield, AlertCircle } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const mockPrograms = [
  { id: 1, name: "Dr.Web CureIt!", url: "https://free.drweb.ru/download+cureit+free/", category: "Антивирус", desc: "Лечащий антивирус от Dr.Web" },
  { id: 2, name: "Malwarebytes AdwCleaner", url: "https://www.malwarebytes.com/adwcleaner", category: "Утилиты", desc: "Удаление рекламного ПО" },
  { id: 3, name: "MinerSearch", url: "https://github.com/BlendLog/MinerSearch/releases", category: "Майнинг", desc: "Поиск майнеров" },
  { id: 4, name: "Kaspersky Virus Removal Tool", url: "https://support.kaspersky.com/virus-removal-tool", category: "Антивирус", desc: "Утилита Касперского" },
];

export default function SoftwarePage() {
  return (
    <div className="container py-8 max-w-5xl main-content">
      <div className="mb-8">
        <p className="text-muted-foreground">Подборка полезных программ от администрации (Безопасно)</p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
        {mockPrograms.map((prog) => (
          <Card key={prog.id} className="flex flex-col h-full hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-center justify-between mb-2">
                <CardTitle className="text-base truncate">{prog.name}</CardTitle>
                <Badge variant="outline">{prog.category}</Badge>
              </div>
              <CardDescription className="line-clamp-2 h-10">
                {prog.desc}
              </CardDescription>
            </CardHeader>
            <CardContent className="mt-auto pt-4">
              <div className="flex items-center justify-between">
                <div className="text-xs text-muted-foreground">
                   <div className="flex items-center gap-1"><Shield className="h-3 w-3 text-green-500" /><span>Проверено</span></div>
                </div>
                <Button variant="outline" size="sm" asChild>
                  <a href={prog.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                    Скачать <Download className="h-4 w-4" />
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      <Card className="mt-8 border-dashed">
        <CardContent className="flex items-center gap-4 py-4">
          <AlertCircle className="h-8 w-8 text-orange-500" />
          <div>
            <div className="font-semibold">Нужна другая программа?</div>
            <div className="text-sm text-muted-foreground">Напишите в поддержку, и мы её добавим.</div>
          </div>
          <Button variant="ghost">Написать</Button>
        </CardContent>
      </Card>
    </div>
  );
}