"use client";

import { useState } from "react";
import { Link2, Download, Scissors, Copy, Check, Youtube, FileText, AlertCircle } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";

export default function MediaPage() {
  // --- LINK SHORTENER STATE ---
  const [longUrl, setLongUrl] = useState("");
  const [shortUrl, setShortUrl] = useState("");
  const [copied, setCopied] = useState(false);

  // --- YOUTUBE DOWNLOADER STATE ---
  const [videoUrl, setVideoUrl] = useState("");
  const [videoId, setVideoId] = useState<string | null>(null);

  // --- TEXT TRUNCATOR STATE ---
  const [inputText, setInputText] = useState("");
  const [truncatedText, setTruncatedText] = useState("");

  // --- HANDLERS ---

  const handleShorten = () => {
    if (!longUrl) return;
    // Mock shortening logic
    const randomCode = Math.random().toString(36).substring(2, 8);
    setShortUrl(`https://leo.ly/${randomCode}`);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleVideoParse = () => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = videoUrl.match(regExp);
    const id = (match && match[2].length === 11) ? match[2] : null;
    setVideoId(id);
  };

  const handleTruncate = () => {
    if (!inputText) return;
    const limit = 280;
    let result = inputText.slice(0, limit);
    if (inputText.length > limit) {
      result += "...";
    }
    setTruncatedText(result);
  };

  return (
    <div className="container py-8 max-w-4xl main-content">
      <div className="mb-8">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Scissors className="text-primary" /> Медиа-инструменты
        </h1>
        <p className="text-muted-foreground">Утилиты для работы с ссылками, видео и текстом</p>
      </div>

      <Tabs defaultValue="shortener" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="shortener" className="gap-2"><Link2 size={18}/> Ссылки</TabsTrigger>
          <TabsTrigger value="youtube" className="gap-2"><Youtube size={18}/> YouTube</TabsTrigger>
          <TabsTrigger value="text" className="gap-2"><FileText size={18}/> Текст</TabsTrigger>
        </TabsList>

        {/* --- СОКРАТИТЕЛЬ ССЫЛОК --- */}
        <TabsContent value="shortener">
          <Card>
            <CardHeader>
              <CardTitle>Сокращение ссылок</CardTitle>
              <CardDescription>Сделайте длинные URL аккуратными и короткими</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input 
                  placeholder="Вставьте длинную ссылку..." 
                  value={longUrl}
                  onChange={(e) => setLongUrl(e.target.value)}
                />
                <Button onClick={handleShorten} disabled={!longUrl}>
                  <Link2 className="h-4 w-4 mr-2"/> Сократить
                </Button>
              </div>

              {shortUrl && (
                <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg animate-in fade-in">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs font-bold text-green-700 dark:text-green-400 uppercase">Ваша короткая ссылка</span>
                    <Badge className="bg-green-100 text-green-700">Готово</Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <Input value={shortUrl} readOnly className="bg-white dark:bg-gray-900 font-mono text-sm" />
                    <Button variant="outline" size="icon" onClick={() => copyToClipboard(shortUrl)}>
                      {copied ? <Check className="h-4 w-4 text-green-600" /> : <Copy className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* --- YOUTUBE ЗАГРУЗЧИК --- */}
        <TabsContent value="youtube">
          <Card>
            <CardHeader>
              <CardTitle>Скачать видео с YouTube</CardTitle>
              <CardDescription>Используем сторонние сервисы для загрузки контента</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex gap-2">
                <Input 
                  placeholder="https://youtube.com/watch?v=..." 
                  value={videoUrl}
                  onChange={(e) => setVideoUrl(e.target.value)}
                />
                <Button onClick={handleVideoParse} disabled={!videoUrl}>
                  <Download className="h-4 w-4 mr-2"/> Найти
                </Button>
              </div>

              {!videoId && videoUrl && (
                <div className="p-4 bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg flex items-start gap-3">
                  <AlertCircle className="h-5 w-5 text-orange-500 flex-shrink-0 mt-0.5"/>
                  <div className="text-sm text-orange-800 dark:text-orange-200">
                    Введите ссылку на видео, чтобы увидеть варианты скачивания.
                  </div>
                </div>
              )}

              {videoId && (
                <div className="space-y-4 animate-in fade-in">
                  <div className="flex items-start gap-4">
                    <div className="relative aspect-video w-64 rounded-lg overflow-hidden bg-black shadow-md flex-shrink-0">
                      <img 
                        src={`https://img.youtube.com/vi/${videoId}/hqdefault.jpg`} 
                        alt="Thumbnail" 
                        className="w-full h-full object-cover"
                      />
                      <Youtube className="absolute inset-0 m-auto h-12 w-12 text-white/80 drop-shadow-lg pointer-events-none" />
                    </div>
                    <div className="space-y-3 flex-1 pt-1">
                      <h4 className="font-semibold">Варианты скачивания</h4>
                      <p className="text-sm text-muted-foreground mb-4">
                        Нажмите на кнопку, чтобы открыть сервис для скачивания в новом окне.
                      </p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <Button variant="outline" className="justify-start" asChild>
                          <a href={`https://www.y2mate.com/youtube/${videoId}`} target="_blank" rel="noopener noreferrer">
                            <Download className="h-4 w-4 mr-2"/> Y2Mate (MP4/MP3)
                          </a>
                        </Button>
                        <Button variant="outline" className="justify-start" asChild>
                          <a href={`https://en.savefrom.net/1-youtube-video-downloader-4/?url=https://www.youtube.com/watch?v=${videoId}`} target="_blank" rel="noopener noreferrer">
                            <Download className="h-4 w-4 mr-2"/> SaveFrom.net
                          </a>
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* --- ОБРЕЗКА ТЕКСТА --- */}
        <TabsContent value="text">
          <Card>
            <CardHeader>
              <CardTitle>Обрезка текста</CardTitle>
              <CardDescription>Приведите текст к лимиту в 280 символов (как в X/Twitter)</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm font-medium">Исходный текст</label>
                  <span className={`text-xs font-bold ${inputText.length > 280 ? 'text-red-500' : 'text-muted-foreground'}`}>
                    {inputText.length} / 280
                  </span>
                </div>
                <Textarea 
                  placeholder="Вставьте длинный текст здесь..." 
                  rows={6}
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                />
              </div>

              <div className="flex justify-between items-center">
                <Button onClick={handleTruncate} disabled={!inputText} className="btn-primary">
                  <Scissors className="h-4 w-4 mr-2"/> Обрезать до 280
                </Button>
                <Button variant="ghost" size="sm" onClick={() => { setInputText(""); setTruncatedText(""); }}>
                  Очистить
                </Button>
              </div>

              {truncatedText && (
                <div className="pt-4 border-t">
                  <label className="text-sm font-medium mb-2 block block">Результат</label>
                  <div className="p-4 bg-muted rounded-lg border relative group">
                    <div className="text-sm leading-relaxed">{truncatedText}</div>
                    <Button 
                      size="icon" 
                      variant="ghost" 
                      className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => copyToClipboard(truncatedText)}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex justify-between mt-2 text-xs text-muted-foreground">
                    <span>Длина: {truncatedText.length} символов</span>
                    <span>Изменено: {inputText.length - truncatedText.length} символов</span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}