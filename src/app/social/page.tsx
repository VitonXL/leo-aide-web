
```tsx
"use client";

import { useState } from "react";
import { Share2, ShoppingBag, Users, Gamepad2, Plus, Check, Trash2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";

const MOCK_CONTACTS = [
  { id: 1, name: "Мама", status: "online" },
  { id: 2, name: "Иван", status: "offline" },
];

export default function SocialPage() {
  const [sharedList, setSharedList] = useState([
    { id: 1, text: "Молоко", user: "Я" },
    { id: 2, text: "Хлеб", user: "Мама" }
  ]);
  const [newItem, setNewItem] = useState("");
  
  const [notes, setNotes] = useState([
    { id: 1, title: "Идеи для подарка", content: "Книга, Носки...", sharedBy: "Иван" }
  ]);

  const addItem = () => {
    if (!newItem) return;
    setSharedList([...sharedList, { id: Date.now(), text: newItem, user: "Я" }]);
    setNewItem("");
  };

  const toggleItem = (id: number) => {
    // In a real app, this would sync. Here we just visual toggle for mock
  };

  return (
    <div className="container py-8 max-w-4xl main-content">
      <h1 className="text-3xl font-bold mb-6 flex items-center gap-2"><Users className="text-primary"/> Социальные функции</h1>
      
      <Tabs defaultValue="shopping" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="shopping"><ShoppingBag className="mr-2 h-4 w-4"/> Списки</TabsTrigger>
          <TabsTrigger value="notes"><Share2 className="mr-2 h-4 w-4"/> Заметки</TabsTrigger>
          <TabsTrigger value="games"><Gamepad2 className="mr-2 h-4 w-4"/> Игры</TabsTrigger>
        </TabsList>

        <TabsContent value="shopping">
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Совместный список покупок</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input placeholder="Добавить товар..." value={newItem} onChange={e => setNewItem(e.target.value)} onKeyDown={e => e.key === 'Enter' && addItem()} />
                <Button onClick={addItem}><Plus className="h-4 w-4"/></Button>
              </div>
              <div className="space-y-2">
                {sharedList.map(item => (
                  <div key={item.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <button className="w-5 h-5 rounded border border-primary" />
                      <div>
                        <span className="font-medium">{item.text}</span>
                        <div className="text-xs text-muted-foreground">Добавил: {item.user}</div>
                      </div>
                    </div>
                    <Badge variant="outline">{item.user}</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notes">
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Обмен заметками</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {notes.map(note => (
                  <Card key={note.id} className="p-4 bg-blue-50 dark:bg-blue-900/10 border-blue-200 dark:border-blue-800">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-bold">{note.title}</h3>
                      <span className="text-xs text-muted-foreground">От: {note.sharedBy}</span>
                    </div>
                    <p className="text-sm">{note.content}</p>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="games">
          <Card className="mt-6">
            <CardContent className="pt-6 text-center space-y-4">
               <div className="p-8 border-2 border-dashed rounded-lg">
                 <Gamepad2 className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                 <h3 className="font-semibold mb-2">Мини-игры с друзьями</h3>
                 <p className="text-sm text-muted-foreground mb-4">Играйте в викторины и слова прямо в чате</p>
                 <Button variant="outline">Запустить игру</Button>
               </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
```