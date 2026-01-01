"use client";

import { Shield, AlertTriangle, Search, CheckCircle } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function AntivirusPage() {
  return (
    <div className="container py-8 max-w-4xl main-content">
      <Alert className="mb-6">
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          Эта функция доступна только для <strong>Premium</strong> пользователей. Мы используем публичный API VirusTotal для сканирования.
        </AlertDescription>
      </Alert>

      <Tabs defaultValue="url" className="space-y-4">
        <TabsList>
          <TabsTrigger value="url">Проверка ссылки</TabsTrigger>
          <TabsTrigger value="file">Проверка файла</TabsTrigger>
          <TabsTrigger value="history">История</TabsTrigger>
        </TabsList>

        <TabsContent value="url" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Проверить ссылку</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input placeholder="https://example.com" />
                <Button>Проверить</Button>
              </div>
              <div className="p-4 bg-muted/50 rounded-md text-sm text-muted-foreground">
                Вставьте ссылку, чтобы проверить её на наличие вредоносного контента в базе VirusTotal.
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="file" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Проверить файл</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-center w-full">
                <Input type="file" className="max-w-sm" />
                <Button>Загрузить и проверить</Button>
              </div>
              <div className="text-center text-sm text-muted-foreground mt-2">
                Максимальный размер файла: 32MB
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="history">
           <Card>
             <CardHeader><CardTitle>История проверок</CardTitle></CardHeader>
             <CardContent className="text-center py-10 text-muted-foreground">
                <CheckCircle className="mx-auto h-12 w-12 mb-2 text-green-500 opacity-50" />
                <p>История проверок пуста</p>
             </CardContent>
           </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}