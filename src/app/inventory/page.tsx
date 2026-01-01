"use client";

import { useState } from "react";
import { Package, Plus, DollarSign, Trash2, ArrowRight, AlertCircle, Tag, TrendingUp, Wallet, Check } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";

// --- MOCK DATA ---
const INITIAL_INVENTORY = [
  { id: 1, name: "Кофе арабика 1кг", buyPrice: 800, sellPrice: 1200, stock: 15, category: "Продукты" },
  { id: 2, name: "Молоко 3.2%", buyPrice: 45, sellPrice: 65, stock: 50, category: "Продукты" },
  { id: 3, name: "Шампунь", buyPrice: 200, sellPrice: 350, stock: 10, category: "Бытовая химия" },
];

type Item = typeof INITIAL_INVENTORY[0];

export default function InventoryPage() {
  const [inventory, setInventory] = useState<Item[]>(INITIAL_INVENTORY);
  const [categories, setCategories] = useState<string[]>(["Продукты", "Бытовая химия", "Канцелярия"]);
  const [dailyRevenue, setDailyRevenue] = useState(0); // Выручка за день
  const [dailyProfit, setDailyProfit] = useState(0); // Прибыль за день
  
  // Forms
  const [newItem, setNewItem] = useState({ name: "", buyPrice: "", sellPrice: "", stock: "", category: "Продукты" });
  const [newCategory, setNewCategory] = useState("");

  const handleSell = (id: number) => {
    const itemIndex = inventory.findIndex(i => i.id === id);
    if (itemIndex === -1) return;

    const item = inventory[itemIndex];
    if (item.stock <= 0) return;

    const updatedInventory = [...inventory];
    updatedInventory[itemIndex] = { ...item, stock: item.stock - 1 };
    setInventory(updatedInventory);

    const profit = item.sellPrice - item.buyPrice;
    setDailyRevenue(prev => prev + item.sellPrice);
    setDailyProfit(prev => prev + profit);
    
    // Simulate Toast
    if (typeof window !== 'undefined' && (window as any).Toast) {
      (window as any).Toast.success(`Продано: ${item.name}. Прибыль: +${profit} ₽`);
    }
  };

  const addCategory = () => {
    if (!newCategory) return;
    setCategories([...categories, newCategory]);
    setNewCategory("");
  };

  const addItem = () => {
    if (!newItem.name || !newItem.buyPrice || !newItem.sellPrice) return;
    
    setInventory([...inventory, {
      id: Date.now(),
      name: newItem.name,
      buyPrice: parseFloat(newItem.buyPrice),
      sellPrice: parseFloat(newItem.sellPrice),
      stock: parseInt(newItem.stock) || 0,
      category: newItem.category
    }]);
    setNewItem({ name: "", buyPrice: "", sellPrice: "", stock: "", category: categories[0] });
  };

  const deleteItem = (id: number) => {
    setInventory(inventory.filter(i => i.id !== id));
  };

  const transferToBudget = () => {
    if (dailyRevenue === 0) return;
    alert(`Переведено ${dailyRevenue} ₽ в основной бюджет!`);
    setDailyRevenue(0);
    setDailyProfit(0);
  };

  const deleteCategory = (cat: string) => {
    setCategories(categories.filter(c => c !== cat));
  };

  return (
    <div className="container py-8 max-w-6xl main-content">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2"><Package className="text-primary" /> Склад и Продажи</h1>
          <p className="text-muted-foreground">Учет товара, точки продаж и прибыль</p>
        </div>
        <Button onClick={transferToBudget} disabled={dailyRevenue === 0} className="btn-primary">
          <Wallet className="mr-2 h-4 w-4"/> Перевести выручку в бюджет ({dailyRevenue} ₽)
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card className="bg-green-50 dark:bg-green-900/10 border-green-200 dark:border-green-800">
          <CardContent className="pt-6 text-center">
            <div className="text-3xl font-bold text-green-700 dark:text-green-400">{dailyRevenue.toLocaleString()} ₽</div>
            <div className="text-sm text-muted-foreground">Выручка сегодня</div>
          </CardContent>
        </Card>
        <Card className="bg-blue-50 dark:bg-blue-900/10 border-blue-200 dark:border-blue-800">
          <CardContent className="pt-6 text-center">
            <div className="text-3xl font-bold text-blue-700 dark:text-blue-400">{dailyProfit.toLocaleString()} ₽</div>
            <div className="text-sm text-muted-foreground">Чистая прибыль</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <div className="text-3xl font-bold">{inventory.length}</div>
            <div className="text-sm text-muted-foreground">Наименований товара</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="pos" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3 h-12">
          <TabsTrigger value="pos" className="gap-2"><DollarSign size={18} /> Касса (Продажа)</TabsTrigger>
          <TabsTrigger value="inventory" className="gap-2"><Package size={18} /> Склад</TabsTrigger>
          <TabsTrigger value="settings" className="gap-2"><Tag size={18} /> Категории</TabsTrigger>
        </TabsList>

        {/* --- 1. POS / ПРОДАЖА --- */}
        <TabsContent value="pos">
          <div className="grid md:grid-cols-4 gap-6">
            <div className="md:col-span-3">
               <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {inventory.map(item => (
                    <Card key={item.id} className={`hover:border-primary transition-all cursor-pointer flex flex-col justify-between h-full ${item.stock === 0 ? 'opacity-50 grayscale' : ''}`}>
                      <CardContent className="pt-4 text-center">
                         <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary mx-auto mb-3">
                           <Package size={24} />
                         </div>
                         <h3 className="font-bold text-base line-clamp-2 h-10">{item.name}</h3>
                         <div className="text-xs text-muted-foreground mt-1">{item.category}</div>
                         <div className="flex justify-center items-center gap-2 mt-2">
                            <span className="text-xs font-mono bg-muted px-2 py-0.5 rounded">Цена: {item.sellPrice} ₽</span>
                         </div>
                      </CardContent>
                      <div className="p-4 border-t bg-muted/30 mt-auto">
                         <div className="flex justify-between items-center mb-2 text-sm">
                            <span className="text-muted-foreground">Остаток:</span>
                            <span className={`font-bold ${item.stock < 5 ? 'text-red-500' : 'text-foreground'}`}>{item.stock} шт.</span>
                         </div>
                         <Button 
                           onClick={() => handleSell(item.id)} 
                           disabled={item.stock === 0}
                           className="w-full"
                           size="sm"
                           variant={item.stock === 0 ? "outline" : "default"}
                         >
                            {item.stock === 0 ? "Нет в наличии" : "Продать"}
                         </Button>
                      </div>
                    </Card>
                  ))}
                  {inventory.length === 0 && (
                    <div className="col-span-full text-center py-12 text-muted-foreground border-2 border-dashed rounded-lg">
                      Склад пуст. Добавьте товары во вкладке "Склад".
                    </div>
                  )}
               </div>
            </div>

            <div className="space-y-4">
               <Card className="bg-gradient-to-b from-primary to-primary/80 text-white">
                  <CardHeader>
                    <CardTitle className="text-lg text-white">Текущий чек</CardTitle>
                  </CardHeader>
                  <CardContent>
                     <div className="space-y-2 text-sm">
                        <div className="flex justify-between opacity-80">
                           <span>Выручка</span>
                           <span className="font-mono font-bold">{dailyRevenue} ₽</span>
                        </div>
                        <div className="flex justify-between opacity-80">
                           <span>Прибыль (маржа)</span>
                           <span className="font-mono font-bold">{dailyProfit} ₽</span>
                        </div>
                        <div className="h-px bg-white/20 my-2"></div>
                        <div className="flex justify-between text-lg font-bold">
                           <span>Итого</span>
                           <span>{dailyRevenue} ₽</span>
                        </div>
                     </div>
                     <Button onClick={transferToBudget} disabled={dailyRevenue === 0} className="w-full mt-4 bg-white text-primary hover:bg-gray-100 font-bold" variant="secondary">
                        Закрыть смену и в бюджет <ArrowRight className="ml-2 h-4 w-4" />
                     </Button>
                  </CardContent>
               </Card>
               
               <div className="p-4 bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg">
                  <div className="flex items-start gap-2">
                     <AlertCircle className="h-5 w-5 text-orange-500 mt-0.5" />
                     <div className="text-sm text-orange-800 dark:text-orange-200">
                        <strong>Автоматическая синхронизация</strong>
                        <p className="mt-1 opacity-80">Выручка из этой точки продаж будет автоматически добавлена как "Прочий доход" в финансовый калькулятор.</p>
                     </div>
                  </div>
               </div>
            </div>
          </div>
        </TabsContent>

        {/* --- 2. СКЛАД --- */}
        <TabsContent value="inventory">
          <div className="flex justify-between items-center mb-4">
             <h3 className="text-lg font-bold">Список товаров</h3>
             <Button onClick={() => setNewItem({...newItem, name: "", buyPrice: "", sellPrice: "", stock: ""})}><Plus className="h-4 w-4 mr-2"/> Добавить товар</Button>
          </div>

          <div className="overflow-x-auto border rounded-lg bg-card">
             <table className="w-full text-sm text-left">
               <thead className="bg-muted">
                 <tr>
                   <th className="p-4 font-medium">Товар</th>
                   <th className="p-4 font-medium">Категория</th>
                   <th className="p-4 font-medium text-right">Закупка</th>
                   <th className="p-4 font-medium text-right">Продажа</th>
                   <th className="p-4 font-medium text-right">Маржа</th>
                   <th className="p-4 font-medium text-center">Остаток</th>
                   <th className="p-4 text-center">Действия</th>
                 </tr>
               </thead>
               <tbody className="divide-y">
                 {inventory.map((item) => (
                   <tr key={item.id} className="hover:bg-muted/50 transition-colors">
                     <td className="p-4">
                        <div className="font-medium">{item.name}</div>
                     </td>
                     <td className="p-4"><Badge variant="outline">{item.category}</Badge></td>
                     <td className="p-4 text-right font-mono">{item.buyPrice} ₽</td>
                     <td className="p-4 text-right font-mono text-primary">{item.sellPrice} ₽</td>
                     <td className="p-4 text-right font-mono">
                        <span className={item.sellPrice > item.buyPrice ? "text-green-600 font-bold" : "text-red-500 font-bold"}>
                           {item.sellPrice - item.buyPrice > 0 ? "+" : ""}{item.sellPrice - item.buyPrice} ₽
                        </span>
                     </td>
                     <td className="p-4 text-center">
                        <span className={item.stock < 5 ? "text-red-500 font-bold" : ""}>{item.stock} шт.</span>
                     </td>
                     <td className="p-4 text-center">
                        <div className="flex justify-center gap-2">
                           <Button size="icon" variant="ghost" onClick={() => deleteItem(item.id)} className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50"><Trash2 size={16} /></Button>
                        </div>
                     </td>
                   </tr>
                 ))}
               </tbody>
             </table>
          </div>
          
          {newItem.name && (
            <div className="mt-6 p-4 border rounded-lg bg-card animate-in fade-in">
              <h4 className="font-semibold mb-4">Добавление нового товара</h4>
              <div className="grid md:grid-cols-5 gap-4 mb-4">
                 <Input placeholder="Название" value={newItem.name} onChange={e => setNewItem({...newItem, name: e.target.value})} />
                 <Input type="number" placeholder="Цена закупки" value={newItem.buyPrice} onChange={e => setNewItem({...newItem, buyPrice: e.target.value})} />
                 <Input type="number" placeholder="Цена продажи" value={newItem.sellPrice} onChange={e => setNewItem({...newItem, sellPrice: e.target.value})} />
                 <Input type="number" placeholder="Кол-во" value={newItem.stock} onChange={e => setNewItem({...newItem, stock: e.target.value})} />
                 <Select value={newItem.category} onValueChange={(v) => setNewItem({...newItem, category: v})}>
                    <SelectTrigger><SelectValue placeholder="Категория"/></SelectTrigger>
                    <SelectContent>{categories.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
                 </Select>
              </div>
              <div className="flex gap-2">
                 <Button onClick={addItem} className="btn-primary">Сохранить товар</Button>
                 <Button variant="outline" onClick={() => setNewItem({ name: "", buyPrice: "", sellPrice: "", stock: "", category: categories[0] })}>Отмена</Button>
              </div>
            </div>
          )}
        </TabsContent>

        {/* --- 3. КАТЕГОРИИ --- */}
        <TabsContent value="settings">
          <div className="max-w-2xl">
            <Card>
              <CardHeader>
                <CardTitle>Управление категориями</CardTitle>
                <CardDescription>Создавайте собственные группы товаров для удобства.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                 <div className="flex gap-2">
                    <Input placeholder="Название новой категории" value={newCategory} onChange={e => setNewCategory(e.target.value)} onKeyDown={e => e.key === 'Enter' && addCategory()} />
                    <Button onClick={addCategory}><Plus className="h-4 w-4"/></Button>
                 </div>
                 
                 <div className="space-y-2">
                    {categories.map((cat, idx) => (
                       <div key={idx} className="flex items-center justify-between p-3 border rounded-lg">
                          <div className="flex items-center gap-3">
                             <div className="w-8 h-8 rounded bg-primary/10 text-primary flex items-center justify-center font-bold">{cat.charAt(0)}</div>
                             <span className="font-medium">{cat}</span>
                          </div>
                          <Button size="icon" variant="ghost" className="h-8 w-8 text-red-500" onClick={() => deleteCategory(cat)}><Trash2 size={16}/></Button>
                       </div>
                    ))}
                 </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}