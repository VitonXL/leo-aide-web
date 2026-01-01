"use client";

import { useState, useEffect } from "react";
import { Cloud, CloudDrizzle, Sun, Snowflake, MapPin, Search, Plus, Trash2, Star, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";

// Mock Weather Data
const MOCK_WEATHER_DATA: Record<string, { temp: number; condition: string; humidity: number; wind: number; icon: "Sun" | "Cloud" | "CloudDrizzle" }> = {
  "Москва": { temp: 14, condition: "Облачно", humidity: 68, wind: 3.5, icon: "Cloud" },
  "Санкт-Петербург": { temp: 10, condition: "Дождь", humidity: 85, wind: 5.2, icon: "CloudDrizzle" },
  "Сочи": { temp: 22, condition: "Ясно", humidity: 45, wind: 2.1, icon: "Sun" },
  "Новосибирск": { temp: 5, condition: "Снег", humidity: 60, wind: 4.0, icon: "Snowflake" },
  "Екатеринбург": { temp: 8, condition: "Облачно", humidity: 55, wind: 3.8, icon: "Cloud" },
  "Краснодар": { temp: 20, condition: "Ясно", humidity: 50, wind: 2.5, icon: "Sun" },
};

const AVAILABLE_CITIES = Object.keys(MOCK_WEATHER_DATA);

export default function WeatherPage() {
  const [search, setSearch] = useState("");
  const [selectedCity, setSelectedCity] = useState("Москва");
  const [isPremium] = useState(false); // Mock state. Set true to test 5 cities.
  const [savedCities, setSavedCities] = useState<string[]>(["Москва"]);
  
  const currentWeather = MOCK_WEATHER_DATA[selectedCity] || MOCK_WEATHER_DATA["Москва"];

  // Filter cities based on search
  const filteredCities = AVAILABLE_CITIES.filter(c => c.toLowerCase().includes(search.toLowerCase()));

  // Logic for available cities based on plan
  const availableCitiesForUser = isPremium ? AVAILABLE_CITIES.slice(0, 5) : AVAILABLE_CITIES.slice(0, 1);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (filteredCities.length > 0) {
      if (!isPremium && savedCities.length >= 1) {
         alert("Обычным пользователям доступен отслеживание только одного города.");
         return;
      }
      setSelectedCity(filteredCities[0]);
      if (!savedCities.includes(filteredCities[0])) {
        setSavedCities([...savedCities, filteredCities[0]]);
      }
    }
  };

  const getIconComponent = (iconName: string) => {
     switch(iconName) {
       case 'Sun': return <Sun className="text-yellow-500" />;
       case 'CloudDrizzle': return <CloudDrizzle className="text-blue-500" />;
       case 'Snowflake': return <Snowflake className="text-blue-200" />;
       default: return <Cloud className="text-gray-500" />;
     }
  };

  return (
    <div className="fade-in main-content">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Cloud className="text-primary" /> Погода
          </h1>
          <div className="text-sm text-muted-foreground flex items-center gap-2 mt-1">
             {!isPremium && <Badge variant="outline" className="text-xs"><Lock className="h-3 w-3 mr-1"/> Обычный план</Badge>}
             {isPremium && <Badge className="bg-yellow-100 text-yellow-700 text-xs"><Star className="h-3 w-3 mr-1"/> Premium: 5 городов</Badge>}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Main Weather Card */}
        <div className="lg:col-span-2 space-y-6">
          <div className="card bg-gradient-to-br from-blue-500 to-blue-600 text-white mb-8">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <MapPin className="h-5 w-5 opacity-80" /> <span className="text-2xl font-bold">{selectedCity}</span>
                </div>
                <div className="text-6xl font-bold mb-2">{currentWeather.temp}°C</div>
                <div className="text-xl opacity-90 flex items-center gap-2">
                   {getIconComponent(currentWeather.icon)}
                   <span>{currentWeather.condition}</span>
                </div>
              </div>
              <div className="text-right opacity-80 hidden md:block">
                 <div className="text-sm">Часовой пояс: МСК+3</div>
                 <div className="text-xs opacity-70">Обновлено только что</div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 mt-6 pt-6 border-t border-white/20">
              <div>
                <div className="text-sm opacity-80">Влажность</div>
                <div className="text-2xl font-semibold">{currentWeather.humidity}%</div>
              </div>
              <div>
                <div className="text-sm opacity-80">Ветер</div>
                <div className="text-2xl font-semibold">{currentWeather.wind} м/с</div>
              </div>
            </div>
          </div>

          {/* City Selector Tabs */}
          <div className="card">
            <h3 className="text-lg font-bold mb-4">Отслеживаемые города</h3>
            <Tabs defaultValue={savedCities[0]}>
              <TabsList className="grid w-full grid-cols-2 md:grid-cols-3 lg:grid-cols-5 h-auto gap-2">
                {availableCitiesForUser.map((city) => (
                  <TabsTrigger 
                    key={city} 
                    value={city}
                    onClick={() => setSelectedCity(city)}
                    className="data-[state=active]:bg-blue-100 data-[state=active]:text-blue-700 dark:data-[state=active]:bg-blue-900/30 dark:data-[state=active]:text-blue-400"
                  >
                    {city}
                  </TabsTrigger>
                ))}
                {!isPremium && (
                   <div className="col-span-2 p-2 text-center text-xs text-muted-foreground bg-muted/20 rounded flex flex-col justify-center items-center">
                     <Lock size={16} className="mb-1"/>
                     <span>Только 1 город</span>
                     <a href="/premium" className="text-primary underline font-bold mt-1">Premium</a>
                   </div>
                )}
              </TabsList>

              {availableCitiesForUser.map((city) => (
                 <TabsContent key={city} value={city}>
                    {/* This allows switching content inside the main card if needed, 
                        but here we just use the trigger to set state. 
                        We render the specific data below if we want a detailed view per city. */}
                    <div className="p-4 text-center text-muted-foreground text-sm">
                       {selectedCity === city ? "Вы смотрите прогноз для этого города" : "Нажмите выше"}
                    </div>
                 </TabsContent>
              ))}
            </Tabs>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <div className="card">
            <h3 className="text-lg font-bold mb-4">Поиск</h3>
            <form onSubmit={handleSearch} className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Введите город..." className="pl-9 h-12" value={search} onChange={e => setSearch(e.target.value)} />
              </div>
              <button type="submit" className="btn btn-primary">
                <Search className="mr-2 h-4 w-4"/> Найти
              </button>
            </form>
            <div className="text-xs text-muted-foreground mt-2">
               {!isPremium && "Для добавления города в избранное нужен Premium."}
               {isPremium && "Вы можете добавить до 5 городов."}
            </div>
          </div>

          <div className="card">
             <h3 className="text-lg font-bold mb-4">Ваши города</h3>
             <div className="space-y-2">
                {savedCities.map(city => (
                  <div key={city} className="flex items-center justify-between p-2 rounded-lg bg-muted/30 border border-transparent hover:bg-muted hover:border-primary/20 cursor-pointer" onClick={() => setSelectedCity(city)}>
                    <div className="flex items-center gap-2">
                       <MapPin size={14} className="text-primary"/>
                       <span className="text-sm font-medium">{city}</span>
                    </div>
                    {savedCities.indexOf(city) === 0 && <Badge className="bg-green-100 text-green-700 text-[10px] px-1.5">Основной</Badge>}
                  </div>
                ))}
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}