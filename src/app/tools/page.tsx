"use client";

import { useState } from "react";
import { Calculator, Book, Ruler, Weight, Activity, Utensils, Keyboard, Shirt, HelpCircle, DollarSign, ArrowRightLeft } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

// --- DATA FOR REFERENCES ---
const HOTKEYS = [
  { key: "Ctrl + C / Cmd + C", desc: "Копировать" },
  { key: "Ctrl + V / Cmd + V", desc: "Вставить" },
  { key: "Ctrl + Z / Cmd + Z", desc: "Отменить" },
  { key: "Ctrl + F / Cmd + F", desc: "Найти" },
  { key: "Alt + Tab / Cmd + Tab", desc: "Переключение окон" },
  { key: "Win + D / F11", desc: "Показать рабочий стол / Полный экран" },
];

const ABBREVIATIONS = [
  { term: "API", full: "Application Programming Interface", category: "IT" },
  { term: "CRM", full: "Customer Relationship Management", category: "Biz" },
  { term: "KPI", full: "Key Performance Indicators", category: "Biz" },
  { term: "ROI", full: "Return on Investment", category: "Fin" },
  { term: "SaaS", full: "Software as a Service", category: "IT" },
  { term: "B2B", full: "Business to Business", category: "Biz" },
];

const CLOTHING_SIZES = [
  { ru: "42", eu: "S", us: "XS", chest: "84-89" },
  { ru: "44", eu: "M", us: "S", chest: "90-95" },
  { ru: "46", eu: "L", us: "M", chest: "96-101" },
  { ru: "48", eu: "XL", us: "L", chest: "102-107" },
  { ru: "50", eu: "XXL", us: "XL", chest: "108-113" },
];

// --- MOCK RATES ---
const CURRENCY_RATES = {
  RUB: 1,
  USD: 92.50,
  EUR: 101.20,
  CNY: 12.80,
  GBP: 115.40,
  JPY: 0.62,
  KZT: 0.19
};

const CURRENCIES = [
  { code: "RUB", name: "Рубль", flag: "🇷🇺" },
  { code: "USD", name: "Доллар", flag: "🇺🇸" },
  { code: "EUR", name: "Евро", flag: "🇪🇺" },
  { code: "CNY", name: "Юань", flag: "🇨🇳" },
  { code: "GBP", name: "Фунт", flag: "🇬🇧" },
  { code: "JPY", name: "Йена", flag: "🇯🇵" },
  { code: "KZT", name: "Тенге", flag: "🇰🇿" },
];

export default function ToolsPage() {
  // --- CALCULATOR STATES ---
  const [calcType, setCalcType] = useState<"loan" | "converter" | "bmi" | "split" | "currency">("currency"); // Set currency as default to highlight it
  
  // Loan
  const [loanAmount, setLoanAmount] = useState<number>(100000);
  const [loanRate, setLoanRate] = useState<number>(15);
  const [loanTerm, setLoanTerm] = useState<number>(12);
  
  // Unit Converter
  const [convCategory, setConvCategory] = useState<"length" | "weight" | "temp">("length");
  const [convValue, setConvValue] = useState<number>(1);
  const [convFrom, setConvFrom] = useState("m");
  const [convTo, setConvTo] = useState("cm");
  
  // BMI
  const [bmiWeight, setBmiWeight] = useState<number>(70);
  const [bmiHeight, setBmiHeight] = useState<number>(175);
  
  // Split Bill
  const [billTotal, setBillTotal] = useState<number>(3000);
  const [billTip, setBillTip] = useState<number>(10);
  const [billPeople, setBillPeople] = useState<number>(2);

  // --- CURRENCY CONVERTER STATE ---
  const [currencyAmount, setCurrencyAmount] = useState<number>(100);
  const [currencyFrom, setCurrencyFrom] = useState<string>("USD");
  const [currencyTo, setCurrencyTo] = useState<string>("RUB");

  // --- REFERENCE STATES ---
  const [refType, setRefType] = useState<"hotkeys" | "abbr" | "sizes">("hotkeys");

  // --- CALCULATIONS ---
  const calculateLoan = () => {
    const r = loanRate / 100 / 12;
    const n = loanTerm;
    if (r === 0) return loanAmount / n;
    const payment = loanAmount * (r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    return payment;
  };

  const calculateBMI = () => {
    const hM = bmiHeight / 100;
    return (bmiWeight / (hM * hM)).toFixed(1);
  };

  const getBMIStatus = (bmi: number) => {
    if (bmi < 18.5) return { label: "Дефицит массы", color: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400" };
    if (bmi < 25) return { label: "Норма", color: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" };
    if (bmi < 30) return { label: "Избыток веса", color: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400" };
    return { label: "Ожирение", color: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400" };
  };

  const splitBill = () => {
    const totalWithTip = billTotal * (1 + billTip / 100);
    return totalWithTip / billPeople;
  };

  const convertUnits = () => {
    let val = convValue;
    let base: number = 0;

    if (convCategory === "length") {
      const rates: Record<string, number> = { m: 1, km: 0.001, cm: 100, mm: 1000, ft: 3.28084, in: 39.3701 };
      base = val / rates[convFrom];
      const result = base * rates[convTo];
      return result.toFixed(2);
    } else if (convCategory === "weight") {
      const rates: Record<string, number> = { kg: 1, g: 1000, lb: 2.20462, oz: 35.274 };
      base = val / rates[convFrom];
      const result = base * rates[convTo];
      return result.toFixed(2);
    } else if (convCategory === "temp") {
      if (convFrom === convTo) return val;
      let celsius = val;
      if (convFrom === "f") celsius = (val - 32) * 5/9;
      if (convFrom === "k") celsius = val - 273.15;
      
      if (convTo === "f") return ((celsius * 9/5) + 32).toFixed(1);
      if (convTo === "k") return (celsius + 273.15).toFixed(1);
      return celsius.toFixed(1);
    }
    return 0;
  };

  // --- CURRENCY LOGIC ---
  const calculateCurrency = () => {
    // Convert Source -> RUB -> Target
    const inRub = currencyAmount * CURRENCY_RATES[currencyFrom as keyof typeof CURRENCY_RATES];
    const result = inRub / CURRENCY_RATES[currencyTo as keyof typeof CURRENCY_RATES];
    return result.toLocaleString('ru-RU', { maximumFractionDigits: 2 });
  };

  const swapCurrencies = () => {
    setCurrencyFrom(currencyTo);
    setCurrencyTo(currencyFrom);
  };

  return (
    <div className="container py-8 max-w-5xl main-content">
      <div className="mb-8">
        <h1 className="text-3xl font-bold flex items-center gap-2 mb-2">
          <Calculator className="text-primary"/> Полезные инструменты
        </h1>
        <p className="text-muted-foreground">Быстрые вычисления и мини-справочники</p>
      </div>

      <Tabs defaultValue="calculators" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 h-12">
          <TabsTrigger value="calculators" className="gap-2"><Calculator size={18}/> Калькуляторы</TabsTrigger>
          <TabsTrigger value="reference" className="gap-2"><Book size={18}/> Справочники</TabsTrigger>
        </TabsList>

        {/* --- КАЛЬКУЛЯТОРЫ --- */}
        <TabsContent value="calculators" className="space-y-6">
          
          {/* Выбор типа калькулятора */}
          <div className="flex flex-wrap gap-2 mb-4">
            <Button variant={calcType === 'currency' ? 'default' : 'outline'} onClick={() => setCalcType('currency')} className="gap-2">
              <DollarSign size={16}/> Валюта
            </Button>
            <Button variant={calcType === 'loan' ? 'default' : 'outline'} onClick={() => setCalcType('loan')}>Кредит</Button>
            <Button variant={calcType === 'converter' ? 'default' : 'outline'} onClick={() => setCalcType('converter')}>Конвертер</Button>
            <Button variant={calcType === 'bmi' ? 'default' : 'outline'} onClick={() => setCalcType('bmi')}>ИМТ</Button>
            <Button variant={calcType === 'split' ? 'default' : 'outline'} onClick={() => setCalcType('split')}>Счет</Button>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  {calcType === 'loan' && <Activity />}
                  {calcType === 'converter' && <Ruler />}
                  {calcType === 'bmi' && <Weight />}
                  {calcType === 'split' && <Utensils />}
                  {calcType === 'currency' && <DollarSign className="text-green-600"/>}
                  {calcType === 'loan' && 'Расчет кредита'}
                  {calcType === 'converter' && 'Конвертер величин'}
                  {calcType === 'bmi' && 'Индекс массы тела'}
                  {calcType === 'split' && 'Деление счета'}
                  {calcType === 'currency' && 'Конвертер валют'}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                
                {/* Валюта */}
                {calcType === 'currency' && (
                  <>
                    <div>
                      <label className="text-sm font-medium mb-1 block">Сумма</label>
                      <Input 
                        type="number" 
                        value={currencyAmount} 
                        onChange={(e) => setCurrencyAmount(Number(e.target.value))}
                        className="text-xl font-bold h-12"
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex-1">
                         <label className="text-xs text-muted-foreground mb-1 block">Отдаю</label>
                         <Select value={currencyFrom} onValueChange={setCurrencyFrom}>
                            <SelectTrigger><SelectValue /></SelectTrigger>
                            <SelectContent>
                              {CURRENCIES.map(c => (
                                <SelectItem key={c.code} value={c.code}>{c.flag} {c.code}</SelectItem>
                              ))}
                            </SelectContent>
                         </Select>
                      </div>
                      <Button variant="outline" size="icon" onClick={swapCurrencies} className="mt-4">
                        <ArrowRightLeft className="h-4 w-4" />
                      </Button>
                      <div className="flex-1">
                         <label className="text-xs text-muted-foreground mb-1 block">Получаю</label>
                         <Select value={currencyTo} onValueChange={setCurrencyTo}>
                            <SelectTrigger><SelectValue /></SelectTrigger>
                            <SelectContent>
                              {CURRENCIES.map(c => (
                                <SelectItem key={c.code} value={c.code}>{c.flag} {c.code}</SelectItem>
                              ))}
                            </SelectContent>
                         </Select>
                      </div>
                    </div>
                    <div className="text-xs text-muted-foreground text-center pt-2 border-t">
                      Курс ЦБ РФ на {new Date().toLocaleDateString()}
                    </div>
                  </>
                )}

                {/* Кредит */}
                {calcType === 'loan' && (
                  <>
                    <div>
                      <label className="text-sm font-medium mb-1 block">Сумма кредита (₽)</label>
                      <Input type="number" value={loanAmount} onChange={e => setLoanAmount(Number(e.target.value))} />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-1 block">Процентная ставка (%)</label>
                      <Input type="number" value={loanRate} onChange={e => setLoanRate(Number(e.target.value))} />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-1 block">Срок (мес)</label>
                      <Input type="number" value={loanTerm} onChange={e => setLoanTerm(Number(e.target.value))} />
                    </div>
                  </>
                )}

                {/* Конвертер */}
                {calcType === 'converter' && (
                  <>
                    <div>
                      <label className="text-sm font-medium mb-1 block">Категория</label>
                      <Select value={convCategory} onValueChange={(v: any) => setConvCategory(v)}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="length">Длина</SelectItem>
                          <SelectItem value="weight">Вес</SelectItem>
                          <SelectItem value="temp">Температура</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-1 block">Значение</label>
                      <Input type="number" value={convValue} onChange={e => setConvValue(Number(e.target.value))} />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-xs text-muted-foreground">Из</label>
                        <Select value={convFrom} onValueChange={setConvFrom}>
                          <SelectTrigger className="h-9"><SelectValue /></SelectTrigger>
                          <SelectContent>
                            {convCategory === 'length' && ['m', 'km', 'cm', 'mm', 'ft', 'in'].map(u => <SelectItem key={u} value={u}>{u}</SelectItem>)}
                            {convCategory === 'weight' && ['kg', 'g', 'lb', 'oz'].map(u => <SelectItem key={u} value={u}>{u}</SelectItem>)}
                            {convCategory === 'temp' && ['c', 'f', 'k'].map(u => <SelectItem key={u} value={u}>{u === 'c' ? '°C' : u === 'f' ? '°F' : 'K'}</SelectItem>)}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <label className="text-xs text-muted-foreground">В</label>
                        <Select value={convTo} onValueChange={setConvTo}>
                          <SelectTrigger className="h-9"><SelectValue /></SelectTrigger>
                          <SelectContent>
                            {convCategory === 'length' && ['m', 'km', 'cm', 'mm', 'ft', 'in'].map(u => <SelectItem key={u} value={u}>{u}</SelectItem>)}
                            {convCategory === 'weight' && ['kg', 'g', 'lb', 'oz'].map(u => <SelectItem key={u} value={u}>{u}</SelectItem>)}
                            {convCategory === 'temp' && ['c', 'f', 'k'].map(u => <SelectItem key={u} value={u}>{u === 'c' ? '°C' : u === 'f' ? '°F' : 'K'}</SelectItem>)}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </>
                )}

                {/* ИМТ */}
                {calcType === 'bmi' && (
                  <>
                    <div>
                      <label className="text-sm font-medium mb-1 block">Вес (кг)</label>
                      <Input type="number" value={bmiWeight} onChange={e => setBmiWeight(Number(e.target.value))} />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-1 block">Рост (см)</label>
                      <Input type="number" value={bmiHeight} onChange={e => setBmiHeight(Number(e.target.value))} />
                    </div>
                  </>
                )}

                {/* Счет */}
                {calcType === 'split' && (
                  <>
                    <div>
                      <label className="text-sm font-medium mb-1 block">Сумма счета</label>
                      <Input type="number" value={billTotal} onChange={e => setBillTotal(Number(e.target.value))} />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-1 block">Чаевые (%)</label>
                      <Input type="number" value={billTip} onChange={e => setBillTip(Number(e.target.value))} />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-1 block">Кол-во человек</label>
                      <Input type="number" value={billPeople} onChange={e => setBillPeople(Number(e.target.value))} />
                    </div>
                  </>
                )}

              </CardContent>
            </Card>

            {/* Результат */}
            <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
              <CardHeader>
                <CardTitle className="text-base text-muted-foreground">Результат</CardTitle>
              </CardHeader>
              <CardContent>
                {calcType === 'loan' && (
                  <div>
                    <div className="text-3xl font-bold mb-2">{Math.round(calculateLoan()).toLocaleString()} ₽</div>
                    <p className="text-sm text-muted-foreground">Ежемесячный платеж</p>
                  </div>
                )}
                {calcType === 'converter' && (
                  <div>
                    <div className="text-3xl font-bold mb-2">{convertUnits()} {convTo === 'c' ? '°C' : convTo === 'f' ? '°F' : convTo}</div>
                    <p className="text-sm text-muted-foreground">Результат конвертации</p>
                  </div>
                )}
                {calcType === 'bmi' && (
                  <div>
                    <div className="text-4xl font-bold mb-3">{calculateBMI()}</div>
                    <Badge className={getBMIStatus(Number(calculateBMI())).color}>
                      {getBMIStatus(Number(calculateBMI())).label}
                    </Badge>
                  </div>
                )}
                {calcType === 'split' && (
                  <div>
                    <div className="text-3xl font-bold mb-2">{Math.round(splitBill())} ₽</div>
                    <p className="text-sm text-muted-foreground">С человека (включая чаевые)</p>
                  </div>
                )}
                {calcType === 'currency' && (
                  <div>
                    <div className="text-4xl font-extrabold text-green-700 dark:text-green-400 mb-1 tracking-tight">
                      {calculateCurrency()}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {CURRENCIES.find(c => c.code === currencyTo)?.flag} {currencyTo}
                    </p>
                    <div className="mt-4 pt-4 border-t border-primary/10 text-xs text-muted-foreground">
                      1 {currencyFrom} ≈ {(CURRENCY_RATES[currencyFrom as keyof typeof CURRENCY_RATES] / CURRENCY_RATES[currencyTo as keyof typeof CURRENCY_RATES]).toFixed(4)} {currencyTo}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* --- СПРАВОЧНИКИ --- */}
        <TabsContent value="reference" className="space-y-6">
           <div className="flex gap-2 mb-4">
             <Button variant={refType === 'hotkeys' ? 'default' : 'outline'} onClick={() => setRefType('hotkeys')} className="flex items-center gap-2">
               <Keyboard size={16}/> Горячие клавиши
             </Button>
             <Button variant={refType === 'abbr' ? 'default' : 'outline'} onClick={() => setRefType('abbr')} className="flex items-center gap-2">
               <HelpCircle size={16}/> Аббревиатуры
             </Button>
             <Button variant={refType === 'sizes' ? 'default' : 'outline'} onClick={() => setRefType('sizes')} className="flex items-center gap-2">
               <Shirt size={16}/> Размеры одежды
             </Button>
           </div>

           <Card>
             <CardContent className="p-0">
               
                {/* Горячие клавиши */}
                {refType === 'hotkeys' && (
                  <div className="p-6">
                    <h3 className="font-bold text-lg mb-4">Популярные сочетания</h3>
                    <div className="space-y-3">
                      {HOTKEYS.map((hk, i) => (
                        <div key={i} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg border">
                          <kbd className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded px-2 py-1 text-sm font-mono shadow-sm">
                            {hk.key}
                          </kbd>
                          <span className="text-sm font-medium text-muted-foreground">{hk.desc}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Аббревиатуры */}
                {refType === 'abbr' && (
                  <div className="p-6">
                    <h3 className="font-bold text-lg mb-4">IT и Бизнес</h3>
                    <div className="space-y-2">
                      {ABBREVIATIONS.map((abbr, i) => (
                        <div key={i} className="p-3 border-b last:border-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-mono font-bold text-primary">{abbr.term}</span>
                            <Badge variant="outline" className="text-[10px]">{abbr.category}</Badge>
                          </div>
                          <div className="text-sm text-muted-foreground">{abbr.full}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Размеры */}
                {refType === 'sizes' && (
                  <div className="p-6">
                    <h3 className="font-bold text-lg mb-4">Таблица соответствия (Мужская одежда)</h3>
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Russia</TableHead>
                            <TableHead>Europe</TableHead>
                            <TableHead>USA</TableHead>
                            <TableHead>Обхват груди (см)</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {CLOTHING_SIZES.map((s, i) => (
                            <TableRow key={i}>
                              <TableCell className="font-bold">{s.ru}</TableCell>
                              <TableCell>{s.eu}</TableCell>
                              <TableCell>{s.us}</TableCell>
                              <TableCell className="text-muted-foreground">{s.chest}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
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