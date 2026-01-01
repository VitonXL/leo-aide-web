"use client";

import { useState } from "react";
import { FileText, MessageSquare, Trash2, Check, Edit, Eye, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const POSTS = [
  { id: 1, title: "Обновление GigaChat v2.0", author: "Admin", status: "published", views: 1240, date: "2023-10-25" },
  { id: 2, title: "Скидки на Black Friday", author: "Manager", status: "draft", views: 0, date: "2023-11-01" },
];

const COMMENTS = [
  { id: 101, user: "Ivan123", text: "Отличный бот, спасибо!", post: "Обновление GigaChat", date: "2 мин назад" },
  { id: 102, user: "SpamBot", text: "Купить дешевые билеты...", post: "Обновление GigaChat", date: "10 мин назад" },
  { id: 103, user: "UserX", text: "Не работает функция支付", post: "Скидки", date: "1 час назад" },
];

export default function AdminContentPage() {
  const [newPost, setNewPost] = useState({ title: "", content: "" });

  return (
    <div className="fade-in main-content">
      <h1 className="text-3xl font-bold mb-6 flex items-center gap-2"><FileText className="text-primary"/> Управление контентом</h1>

      <Tabs defaultValue="posts" className="space-y-4">
        <TabsList>
          <TabsTrigger value="posts">Посты и Статьи</TabsTrigger>
          <TabsTrigger value="comments">Модерация комментариев</TabsTrigger>
          <TabsTrigger value="editor">Создать пост</TabsTrigger>
        </TabsList>

        {/* Посты */}
        <TabsContent value="posts">
          <Card>
            <CardHeader>
              <CardTitle>База знаний и Новости</CardTitle>
              <CardDescription>Управление видимостью и публикацией материалов</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {POSTS.map(post => (
                  <div key={post.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold">{post.title}</h3>
                        <Badge variant={post.status === 'published' ? 'default' : 'secondary'}>
                          {post.status === 'published' ? 'Опубликован' : 'Черновик'}
                        </Badge>
                      </div>
                      <div className="text-sm text-muted-foreground">Автор: {post.author} • Просмотров: {post.views}</div>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline"><Eye className="h-4 w-4" /></Button>
                      <Button size="sm" variant="outline"><Edit className="h-4 w-4" /></Button>
                      <Button size="sm" variant="ghost" className="text-red-500"><Trash2 className="h-4 w-4" /></Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Комментарии */}
        <TabsContent value="comments">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><AlertCircle className="text-orange-500"/> Ожидают проверки</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {COMMENTS.map(comment => (
                  <div key={comment.id} className="p-4 border rounded-lg bg-card">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <span className="font-bold text-sm">{comment.user}</span>
                        <span className="text-xs text-muted-foreground ml-2">к: {comment.post}</span>
                      </div>
                      <span className="text-xs text-muted-foreground">{comment.date}</span>
                    </div>
                    <p className="text-sm mb-3">{comment.text}</p>
                    <div className="flex justify-end gap-2">
                      <Button size="sm" variant="ghost" className="text-red-500 hover:text-red-700"><Trash2 className="h-4 w-4 mr-1"/> Удалить</Button>
                      <Button size="sm" variant="outline" className="text-green-600 hover:bg-green-50"><Check className="h-4 w-4 mr-1"/> Одобрить</Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Редактор */}
        <TabsContent value="editor">
          <Card>
            <CardHeader><CardTitle>Создать новую статью</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-1 block">Заголовок</label>
                <Input placeholder="Введите заголовок..." value={newPost.title} onChange={e => setNewPost({...newPost, title: e.target.value})} />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Категория</label>
                <Select>
                  <SelectTrigger><SelectValue placeholder="Выберите категорию"/></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="news">Новости</SelectItem>
                    <SelectItem value="tutorial">Обучение</SelectItem>
                    <SelectItem value="update">Обновления</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Содержание (Markdown)</label>
                <Textarea 
                  placeholder="Напишите статью..." 
                  rows={10} 
                  value={newPost.content} 
                  onChange={e => setNewPost({...newPost, content: e.target.value})}
                  className="font-mono text-sm"
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline">Сохранить как черновик</Button>
                <Button className="btn-primary">Опубликовать</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}