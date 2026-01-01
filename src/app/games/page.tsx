"use client";

import { Gamepad2, ExternalLink, Lock } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function GamesPage() {
  return (
    <div className="container py-8 max-w-4xl main-content">
      <div className="mb-8">
        <p className="text-muted-foreground">Развлекайтесь с Telegram мини-играми и нашими эксклюзивами.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Telegram Games */}
        <Card>
          <CardHeader>
            <CardTitle>Telegram Игры</CardTitle>
            <CardDescription>Доступно всем пользователям</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button variant="outline" className="w-full justify-between" asChild>
              <a href="https://t.me/LeoGamesBot" target="_blank">
                <span>Lumberjack</span> <ExternalLink className="h-4 w-4" />
              </a>
            </Button>
            <Button variant="outline" className="w-full justify-between" asChild>
              <a href="https://t.me/LeoGamesBot" target="_blank">
                <span>Warlords</span> <ExternalLink className="h-4 w-4" />
              </a>
            </Button>
          </CardContent>
        </Card>

        {/* Custom Games (Premium) */}
        <Card className="border-purple-200 dark:border-purple-900">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Кастомные игры</CardTitle>
              <Badge><Lock className="h-3 w-3 mr-1" /> Premium</Badge>
            </div>
            <CardDescription>Эксклюзивные игры от Лео</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg text-center border-2 border-dashed border-purple-300 dark:border-purple-700">
              <Gamepad2 className="h-10 w-10 mx-auto text-purple-500 mb-2" />
              <h3 className="font-semibold">Квест Лео</h3>
              <p className="text-sm text-muted-foreground">В разработке...</p>
              <Button className="mt-2" size="sm" variant="secondary" disabled>Скоро</Button>
            </div>
             <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg text-center border-2 border-dashed border-purple-300 dark:border-purple-700">
              <Gamepad2 className="h-10 w-10 mx-auto text-purple-500 mb-2" />
              <h3 className="font-semibold">Тренировка памяти</h3>
              <p className="text-sm text-muted-foreground">В разработке...</p>
              <Button className="mt-2" size="sm" variant="secondary" disabled>Скоро</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}