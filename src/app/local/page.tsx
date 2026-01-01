"use client";

import { useState } from "react";
import { Bus, MapPin, Navigation, Droplet, Zap, Search, Clock, AlertTriangle, CheckCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";

// --- MOCK DATA ---
const TRANSPORT_DATA = [
  { id: 1, type: "bus", route: "12", destination: "Вокзал", arrival: 2, status: "on_time" },
  { id: 2, type: "metro", route: "M1", destination: "Центр", arrival: 5, status: "on_time" },
  { id: 3, type: "bus", route: "45", destination: "Микрорайон Северный", arrival: 8, status: "delayed" },
  { id: 4, type: "tram", route: "3", destination: "Парк", arrival: 12, status: "on_time" },
];

const PLACES_DATA = [
  { id: 1, name: "Аптека 'Здоровье 36.6'", type: "pharmacy", address: "ул. Ленина, 12", distance: 350, hours: "08:00 - 22:00" },
  { id: 2, name: "Городская Клиническая Больница №1", type: "hospital", address: "пр. Мира, 45", distance: 1200, hours: "Круглосуточно" },
  { id: 3, name: "Аптека 'Ригла'", type: "pharmacy", address: "ул. Пушкина, 8", distance: 550, hours: "09:00 - 21:00" },
  { id: 4, name: "Станция Скорой Помощи", type: "hospital", address: "пер. Тупиковый, 3", distance: 2100, hours: "Круглосуточно" },
];

const UTILITIES_DATA = [
  { id: 1, type: "water", title: "Отключение холодной воды", date: "28 Окт, 09:00 - 17:00", streets: ["ул. Ленина", "ул. Гагарина"], status: "planned" },
  { id: 2, type: "electricity", title: "Аварийные работы на подстанции", date: "Вчера, 14:00 - 16:00", streets: ["пер. Садовый"], status: "completed" },
  { id: 3, type: "water", title: "Гидравлические испытания", date: "01 Ноя, 23:00 - 04:00", streets: ["мкр. Южный"], status: "planned" },
];

export default function LocalPage() {
  const [transportSearch, setTransportSearch] = useState("");
  const [selectedPlaceType, setSelectedPlaceType] = useState<"all" | "pharmacy" | "hospital">("all");

  const filteredTransport = TRANSPORT_DATA.filter(t => 
    t.destination.toLowerCase().includes(transportSearch.toLowerCase()) || 
    t.route.includes(transportSearch)
  );

  const filteredPlaces = PLACES_DATA.filter(p => 
    selectedPlaceType === "all" || p.type === selectedPlaceType
  );

  return (
    <div className="container py-8 max-w-5xl main-content">
      <div className="mb-8">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <MapPin className="text-primary" /> Локальные сервисы
        </h1>
        <p className="text-muted-foreground">Транспорт, карта и городские уведомления</p>
      </div>

      <Tabs defaultValue="transport" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3 h-12">
          <TabsTrigger value="transport" className="gap-2"><Bus size={18} /> Транспорт</TabsTrigger>
          <TabsTrigger value="map" className="gap-2"><Navigation size={18} /> Карта</TabsTrigger>
          <TabsTrigger value="utilities" className="gap-2"><Droplet size={18} /> ЖКХ</TabsTrigger>
        </TabsList>

        {/* --- ТРАНСПОРТ --- */}
        <TabsContent value="transport">
          <Card>
            <CardHeader>
              <CardTitle>Расписание транспорта (Live)</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="Поиск маршрута или остановки..." 
                  className="pl-9"
                  value={transportSearch}
                  onChange={(e) => setTransportSearch(e.target.value)}
                />
              </div>

              <div className="space-y-3 mt-4">
                {filteredTransport.map(item => (
                  <div key={item.id} className="flex items-center justify-between p-4 border rounded-lg bg-card hover:bg-muted/50 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-md ${
                        item.type === 'bus' ? 'bg-blue-500' : item.type === 'metro' ? 'bg-red-500' : 'bg-green-500'
                      }`}>
                        {item.type === 'bus' ? <Bus size={20} /> : item.type === 'metro' ? <span>M</span> : <span>T</span>}
                      </div>
                      <div>
                        <div className="font-bold text-lg">№ {item.route}</div>
                        <div className="text-sm text-muted-foreground">{item.destination}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-primary">{item.arrival} мин</div>
                      <div className="flex items-center gap-1 justify-end mt-1">
                        {item.status === 'on_time' ? (
                          <span className="text-xs text-green-600 font-medium flex items-center gap-1"><CheckCircle size={12}/> По расписанию</span>
                        ) : (
                          <span className="text-xs text-orange-600 font-medium flex items-center gap-1"><AlertTriangle size={12}/> Задержка</span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
                {filteredTransport.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">Ничего не найдено</div>
                )}
              </div>
              
              <div className="text-xs text-muted-foreground mt-4 text-center">
                Данные предоставлены через API OpenData (Эмуляция)
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* --- КАРТА --- */}
        <TabsContent value="map" className="space-y-6">
          <div className="grid md:grid-cols-3 gap-6">
            {/* Map Placeholder */}
            <div className="md:col-span-2">
              <Card className="h-[500px] overflow-hidden relative">
                <div className="absolute inset-0 bg-gray-100 dark:bg-gray-800 flex flex-col items-center justify-center">
                   {/* Simple CSS Map Pattern */}
                   <div className="absolute inset-0 opacity-10 bg-[url('https://upload.wikimedia.org/wikipedia/commons/e/ec/World_map_blank_without_borders.svg')] bg-cover bg-center"></div>
                   
                   <MapPin size={64} className="text-green-500 mb-4 animate-bounce" />
                   <h3 className="text-xl font-semibold text-gray-600 dark:text-gray-300">Интерактивная карта</h3>
                   <p className="text-sm text-muted-foreground">Ваше местоположение</p>
                   
                   <div className="absolute bottom-4 right-4 flex gap-2">
                     <button className="btn btn-primary btn-sm shadow-lg"><MapPin size={14}/> Меня</button>
                   </div>
                </div>
              </Card>
            </div>

            {/* Sidebar List */}
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Фильтр</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Показать аптеки</span>
                    <Switch 
                      checked={selectedPlaceType === 'pharmacy'} 
                      onCheckedChange={(checked) => setSelectedPlaceType(checked ? 'pharmacy' : 'all')}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Показать больницы</span>
                    <Switch 
                      checked={selectedPlaceType === 'hospital'} 
                      onCheckedChange={(checked) => setSelectedPlaceType(checked ? 'hospital' : 'all')}
                    />
                  </div>
                </CardContent>
              </Card>

              <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2">
                {filteredPlaces.map(place => (
                  <Card key={place.id} className="p-4 hover:shadow-md transition-shadow cursor-pointer group">
                    <div className="flex items-start justify-between mb-2">
                      <div className={`p-2 rounded-full ${place.type === 'pharmacy' ? 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400' : 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400'}`}>
                        {place.type === 'pharmacy' ? <Droplet size={16} /> : <Zap size={16} />}
                      </div>
                      <span className="text-xs font-bold bg-primary/10 text-primary px-2 py-1 rounded">{place.distance}м</span>
                    </div>
                    <h4 className="font-semibold text-sm mb-1 group-hover:text-primary transition-colors">{place.name}</h4>
                    <p className="text-xs text-muted-foreground mb-2">{place.address}</p>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock size={12} /> {place.hours}
                    </div>
                    <Button variant="outline" size="sm" className="w-full mt-3 h-8">
                      <Navigation size={14} className="mr-2"/> Маршрут
                    </Button>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </TabsContent>

        {/* --- ЖКХ --- */}
        <TabsContent value="utilities">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4 md:col-span-2">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-bold">Ближайшие отключения</h3>
                <Badge variant="outline" className="text-xs">API: CityPortal</Badge>
              </div>

              {UTILITIES_DATA.map(item => (
                <Card key={item.id} className={`border-l-4 ${
                  item.status === 'planned' ? 'border-l-orange-500' : 'border-l-green-500'
                }`}>
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-4">
                        <div className={`p-3 rounded-full ${
                          item.type === 'water' ? 'bg-blue-100 text-blue-600' : 'bg-yellow-100 text-yellow-600'
                        }`}>
                          {item.type === 'water' ? <Droplet size={24} /> : <Zap size={24} />}
                        </div>
                        <div>
                          <h4 className="font-bold text-base mb-1">{item.title}</h4>
                          <div className="text-sm text-muted-foreground mb-2 flex items-center gap-2">
                             <Clock size={14} /> {item.date}
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {item.streets.map(street => (
                              <Badge key={street} variant="secondary" className="text-xs">{street}</Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge className={item.status === 'planned' ? 'bg-orange-100 text-orange-700' : 'bg-green-100 text-green-700'}>
                          {item.status === 'planned' ? 'Запланировано' : 'Выполнено'}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card className="bg-blue-50 dark:bg-blue-900/10 border-blue-200 dark:border-blue-800">
              <CardHeader><CardTitle className="text-base text-blue-700 dark:text-blue-400">Подписка на уведомления</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-blue-600/80 dark:text-blue-400/80">
                  Получайте уведомления об отключениях воды и электричества в вашем районе в Telegram.
                </p>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                     <Switch defaultChecked />
                     <span className="text-sm font-medium">Вода</span>
                  </div>
                  <div className="flex items-center gap-2">
                     <Switch defaultChecked />
                     <span className="text-sm font-medium">Электричество</span>
                  </div>
                </div>
                <Button className="w-full btn-primary btn-sm">Активировать бота</Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}