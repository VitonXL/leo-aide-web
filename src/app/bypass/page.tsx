"use client";

import { Download, Shield, Android, Monitor, Info } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function BypassPage() {
  return (
    <div className="container py-8 max-w-4xl main-content">
      <Alert className="mb-6">
        <Info className="h-4 w-4" />
        <AlertDescription>
          Использование этих инструментов осуществляется на ваш страх и риск. Администрация не несет ответственности за их использование.
        </AlertDescription>
      </Alert>

      <Tabs defaultValue="youtube" className="space-y-4">
        <TabsList>
          <TabsTrigger value="youtube">YouTube</TabsTrigger>
          <TabsTrigger value="discord">Discord</TabsTrigger>
          <TabsTrigger value="pc">PC Windows</TabsTrigger>
        </TabsList>

        <TabsContent value="youtube">
          <Card>
            <CardHeader><CardTitle>ByeByDPI для YouTube</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="p-6 bg-muted rounded-lg">
                <h3 className="font-semibold mb-2">Windows / Android</h3>
                <p className="text-sm text-muted-foreground mb-4">Скрипт для обхода DPI в России и других странах.</p>
                <Button variant="outline" className="w-full" asChild>
                   <a href="https://github.com/romanvht/ByeByeDPI/releases" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2">
                    <Download className="h-4 w-4" /> Скачать
                   </a>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="discord">
           <Card>
             <CardHeader><CardTitle>Discord / VOIP</CardTitle></CardHeader>
             <CardContent>
               <p className="text-sm text-muted-foreground">
                 На данный момент специальных инструментов для Discord в разработке. Рекомендуем использовать VPN.
               </p>
             </CardContent>
           </Card>
        </TabsContent>

        <TabsContent value="pc">
           <Card>
             <CardHeader><CardTitle>Обход для Windows</CardTitle></CardHeader>
             <CardContent>
               <p className="text-sm text-muted-foreground">
                 Рекомендуем использование <strong>Proxifier</strong> или <strong>HMA! Pro VPN</strong> для стабильного соединения.
               </p>
             </CardContent>
           </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}