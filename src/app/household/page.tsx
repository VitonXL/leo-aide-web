"use client";

import { useState } from "react";
import { ChefHat, Calculator, Clock, Trash2, Plus, CheckCircle, AlertCircle, Zap, Droplet, Thermometer } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";

// --- RECIPE MOCK DATA ---
const RECIPES = [
  { id: 1, title: "Яичница с беконом", time: "15 мин", difficulty: "Легко", ingredients: ["яйца", "бекон", "масло", "соль"] },
  { id: 2, title: "Паста Карбонара", time: "30 мин", difficulty: "Средне", ingredients: ["спагетти", "бекон", "яйца", "сыр"] },
  { id: 3, title: "Овощной салат", time: "10 мин", difficulty: "Легко", ingredients: ["огурец", "помидор", "масло", "зелень"] },
  { id: 4, title: "Куриный суп", time: "1 час", difficulty: "Сложно", ingredients: ["курица", "картофель", "морковь", "лук", "вода"] },
  { id: 5, title: "Тост с авокадо", time: "5 мин", difficulty: "Легко", ingredients: ["хлеб", "авокадо", "лимон", "соль"] },
];

// --- UTILITIES RATES MOCK ---
const RATES = {
  water: 45.5, // за м3
  electricity: 5.2, // за кВт
  gas: 55.0, // за м3
  heating: 1800, // за м2 (условно)
};

export default function HouseholdPage() {
  // --- RECIPE STATE ---
  const [ingredients, setIngredients] = useState("");
  const [recipeResults, setRecipeResults] = useState<typeof RECIPES>([]);

  // --- UTILITIES STATE ---
  const [utilityInputs, setUtilityInputs] = useState({
    water: 10,
    electricity: 150,
    gas: 20,
    heatingArea: 45,
  });

  // --- REMINDERS STATE ---
  const [reminders, setReminders] = useState([
    { id: 1, name: "Фильтр для воды (кухня)", daysLeft: 15, type: "water" },
    { id: 2, name: "Кондиционер (чистка)", daysLeft: 120, type: "hvac" },
    { id: 3, name: "Дымовой датчик", daysLeft: 300, type: "safety" },
  ]);
  const [newReminderName, setNewReminderName] = useState("");

  // --- RECIPE HANDLER ---
  const searchRecipes = () => {
    const ingrList = ingredients.toLowerCase().split(/[\n,]+/).map(i => i.trim()).filter(i => i);
    if (ingrList.length === 0) return;

    // Mock search: find recipes that contain at least one ingredient from input
    const matches = RECIPES.filter(r => 
      r.ingredients.some(ri => ingrList.some(ui => ri.includes(ui)))
    );

    // Fallback if no matches but user typed something
    if (matches.length === 0 && ingrList.length > 0) {
      setRecipeResults([RECIPES[Math.floor(Math.random() * RECIPES.length)]]); // Random suggestion
    } else {
      setRecipeResults(matches.length > 0 ? matches : RECIPES);
    }
  };

  // --- UTILITIES CALCULATION ---
  const totalCost = (
    (utilityInputs.water * RATES.water) +
    (utilityInputs.electricity * RATES.electricity) +
    (utilityInputs.gas * RATES.gas) +
    (utilityInputs.heatingArea * RATES.heating)
  ).toFixed(2);

  // --- REMINDERS HANDLERS ---
  const addReminder = () => {
    if (!newReminderName) return;
    setReminders([...reminders, { 
      id: Date.now(), 
      name: newReminderName, 
      daysLeft: 180, 
      type: "generic" 
    }]);
    setNewReminderName("");
  };

  const resetReminder = (id: number) => {
    setReminders(reminders.map(r => r.id === id ? { ...r, daysLeft: 180 } : r));
  };

  const deleteReminder = (id: number) => {
    setReminders(reminders.filter(r => r.id !== id));
  };

  return (
    <div className="container py-8 max-w-4xl main-content">
      <div className="mb-8">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <ChefHat className="text-primary" /> Бытовые помощники
        </h1>
        <p className="text-muted-foreground">Кулинария, счета и техническое обслуживание</p>
      </div>

      <Tabs defaultValue="recipes" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3 h-12">
          <TabsTrigger value="recipes" className="gap-2"><ChefHat size={18}/> Рецепты</TabsTrigger>
          <TabsTrigger value="utilities" className="gap-2"><Calculator size={18}/> Счета</TabsTrigger>
          <TabsTrigger value="reminders" className="gap-2"><Clock size={18}/> Напоминания</TabsTrigger>
        </TabsList>

        {/* --- ГЕНЕРАТОР РЕЦЕПТОВ --- */}
        <TabsContent value="recipes">
          <Card>
            <CardHeader>
              <CardTitle>Что приготовить?</CardTitle>
              <CardDescription>Введите продукты, которые есть у вас в холодильнике</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea 
                placeholder="Например: яйца, помидоры, хлеб..." 
                rows={3}
                value={ingredients}
                onChange={(e) => setIngredients(e.target.value)}
              />
              <Button onClick={searchRecipes} className="w-full" disabled={!ingredients}>
                <ChefHat className="mr-2 h-4 w-4"/> Найти рецепты
              </Button>

              {recipeResults.length > 0 && (
                <div className="grid gap-4 mt-6 animate-in fade-in">
                  <h3 className="text-sm font-semibold text-muted-foreground">Рекомендации:</h3>
                  {recipeResults.map(recipe => (
                    <Card key={recipe.id} className="hover:shadow-md transition-shadow cursor-pointer">
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-bold text-base mb-1">{recipe.title}</h4>
                            <div className="flex items-center gap-3 text-xs text-muted-foreground mb-2">
                              <span className="flex items-center gap-1"><Clock size={12}/> {recipe.time}</span>
                              <span className="flex items-center gap-1"><AlertCircle size={12}/> {recipe.difficulty}</span>
                            </div>
                            <div className="flex flex-wrap gap-1">
                              {recipe.ingredients.map(ing => (
                                <Badge key={ing} variant="outline" className="text-[10px]">{ing}</Badge>
                              ))}
                            </div>
                          </div>
                          <Button variant="outline" size="sm">Готовить</Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* --- КАЛЬКУЛЯТОР КОММУНАЛЬНЫХ --- */}
        <TabsContent value="utilities">
          <Card>
            <CardHeader>
              <CardTitle>Расчет коммунальных платежей</CardTitle>
              <CardDescription>Ориентировочный расчет на основе тарифов Москвы</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-1 block">Вода (м³)</label>
                  <Input type="number" value={utilityInputs.water} onChange={e => setUtilityInputs({...utilityInputs, water: Number(e.target.value)})} />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Газ (м³)</label>
                  <Input type="number" value={utilityInputs.gas} onChange={e => setUtilityInputs({...utilityInputs, gas: Number(e.target.value)})} />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Электричество (кВт⋅ч)</label>
                  <Input type="number" value={utilityInputs.electricity} onChange={e => setUtilityInputs({...utilityInputs, electricity: Number(e.target.value)})} />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Отопление (площадь м²)</label>
                  <Input type="number" value={utilityInputs.heatingArea} onChange={e => setUtilityInputs({...utilityInputs, heatingArea: Number(e.target.value)})} />
                </div>
              </div>

              <Card className="bg-green-50 dark:bg-green-900/10 border-green-200 dark:border-green-800">
                <CardContent className="p-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="text-sm text-green-700 dark:text-green-400 font-medium">Итого к оплате</div>
                      <div className="text-xs text-green-600/80 dark:text-green-400/80">Включая НДС</div>
                    </div>
                    <div className="text-3xl font-bold text-green-800 dark:text-green-300">
                      {Number(totalCost).toLocaleString()} ₽
                    </div>
                  </div>
                  <div className="mt-3 pt-3 border-t border-green-200/50 text-xs space-y-1">
                    <div className="flex justify-between"><span>Вода ({utilityInputs.water} м³)</span> <span>{(utilityInputs.water * RATES.water).toFixed(0)} ₽</span></div>
                    <div className="flex justify-between"><span>Свет ({utilityInputs.electricity} кВт)</span> <span>{(utilityInputs.electricity * RATES.electricity).toFixed(0)} ₽</span></div>
                    <div className="flex justify-between"><span>Газ ({utilityInputs.gas} м³)</span> <span>{(utilityInputs.gas * RATES.gas).toFixed(0)} ₽</span></div>
                    <div className="flex justify-between"><span>Отопление ({utilityInputs.heatingArea} м²)</span> <span>{(utilityInputs.heatingArea * RATES.heating).toFixed(0)} ₽</span></div>
                  </div>
                </CardContent>
              </Card>
            </CardContent>
          </Card>
        </TabsContent>

        {/* --- НАПОМИНАНИЯ --- */}
        <TabsContent value="reminders">
          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Добавить новое</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex gap-2">
                  <Input 
                    placeholder="Например: Фильтр пылесоса" 
                    value={newReminderName}
                    onChange={e => setNewReminderName(e.target.value)}
                  />
                  <Button onClick={addReminder} size="icon"><Plus className="h-4 w-4"/></Button>
                </div>
              </CardContent>
            </Card>

            <div className="space-y-3">
              {reminders.map(rem => (
                <Card key={rem.id} className={`border-l-4 ${
                  rem.daysLeft < 30 ? 'border-l-red-500' : 'border-l-green-500'
                }`}>
                  <CardContent className="pt-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-full ${
                          rem.type === 'water' ? 'bg-blue-100 text-blue-600' : 
                          rem.type === 'safety' ? 'bg-red-100 text-red-600' : 
                          'bg-gray-100 text-gray-600'
                        }`}>
                          {rem.type === 'water' && <Droplet size={16} />}
                          {rem.type === 'safety' && <Zap size={16} />}
                          {rem.type === 'hvac' && <Thermometer size={16} />}
                          {rem.type === 'generic' && <Clock size={16} />}
                        </div>
                        <div>
                          <div className="font-medium text-sm">{rem.name}</div>
                          <div className="text-xs text-muted-foreground">
                            {rem.daysLeft < 0 ? "Просрочено!" : `Осталось дней: ${rem.daysLeft}`}
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" className="h-8 px-2" onClick={() => resetReminder(rem.id)}>
                          Сброс
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500" onClick={() => deleteReminder(rem.id)}>
                          <Trash2 size={14} />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}