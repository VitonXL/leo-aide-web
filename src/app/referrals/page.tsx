"use client";

import { useState } from "react";
import { Users, Gift, Copy, Check, Crown, Share2, QrCode, Calendar } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

// --- MOCK DATA ---
const MOCK_REFERRALS = [
  { id: 1, name: "Иван Петров", username: "@ivan_p", status: "active", joined: "2023-10-20" },
  { id: 2, name: "Мария Иванова", username: "@maria_k", status: "active", joined: "2023-10-22" },
  { id: 3, name: "Дмитрий Сидоров", username: "@dmitry_v", status: "pending", joined: "2023-10-25" },
  { id: 4, name: "Елена Смирнова", username: "@elena_s", status: "active", joined: "2023-10-26" },
];

const REFERRAL_RULES = [
  { 
    title: "Пригласил друга", 
    reward: "+7 дней Премиума", 
    desc: "Вам начисляется бонус, как только друг активирует бота",
    color: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
    icon: Users
  },
  { 
    title: "Бонус другу", 
    reward: "+3 дня другу", 
    desc: "Ваш друг также получает подарок за вашу рекомендацию",
    color: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
    icon: Gift
  },
  { 
    title: "За каждого третьего", 
    reward: "+1 день (Бонус)", 
    desc: "Дополнительные дни за активное приглашение",
    color: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
    icon: Crown
  },
];

export default function ReferralsPage() {
  const [copied, setCopied] = useState(false);
  
  // --- LOGIC ---
  const activeReferrals = MOCK_REFERRALS.filter(r => r.status === 'active').length;
  const baseEarnedDays = activeReferrals * 7;
  const bonusDays = Math.floor(activeReferrals / 3);
  const totalEarnedDays = baseEarnedDays + bonusDays;
  
  const referralLink = `https://t.me/LeoAssistantBot?start=ref_${Date.now()}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    
    // Trigger toast if available
    if (typeof window !== 'undefined' && (window as any).Toast) {
      (window as any).Toast.success("Ссылка скопирована!");
    }

    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fade-in main-content">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold flex items-center justify-center gap-2 mb-2">
          <Users className="text-primary" /> Реферальная система
        </h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Приглашайте друзей и получайте бесплатный Premium. Чем больше друзей — тем больше бонусов.
        </p>
      </div>

      {/* --- STATS CARDS --- */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardContent className="pt-6 text-center">
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users size={24} />
            </div>
            <div className="text-3xl font-bold mb-1">{activeReferrals}</div>
            <div className="text-sm text-muted-foreground">Активных друзей</div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-green-50 to-white dark:from-green-900/20 dark:to-gray-900 border-green-200 dark:border-green-800">
          <CardContent className="pt-6 text-center">
            <div className="w-12 h-12 bg-green-500 text-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg shadow-green-500/20">
              <Calendar size={24} />
            </div>
            <div className="text-3xl font-bold mb-1 text-green-700 dark:text-green-400">{totalEarnedDays}</div>
            <div className="text-xs text-muted-foreground mb-1">Дней Premium</div>
            <div className="text-[10px] text-muted-foreground">({baseEarnedDays} база + {bonusDays} бонус)</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6 text-center">
             <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-full flex items-center justify-center mx-auto mb-4">
              <Crown size={24} />
            </div>
            <div className="text-3xl font-bold mb-1">{bonusDays}</div>
            <div className="text-sm text-muted-foreground">Бонусных дней</div>
            <div className="text-xs text-muted-foreground mt-1">За каждые 3-го друга</div>
          </CardContent>
        </Card>
      </div>

      {/* --- RULES --- */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {REFERRAL_RULES.map((rule, i) => (
          <Card key={i} className="bg-muted/30 border-dashed hover:border-primary transition-colors">
            <CardContent className="p-6 text-center flex flex-col items-center h-full justify-center">
              <div className={`w-14 h-14 rounded-full flex items-center justify-center mb-4 ${rule.color}`}>
                <rule.icon size={28} />
              </div>
              <div className="font-semibold text-base mb-2">{rule.title}</div>
              <div className={`text-lg font-bold mb-2 ${rule.color.split(' ')[1]}`}>{rule.reward}</div>
              <div className="text-xs text-muted-foreground leading-relaxed">
                {rule.desc}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* --- REFERRAL LINK --- */}
      <Card className="mb-8 bg-gradient-to-r from-primary/10 to-blue-500/10 border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Share2 className="h-5 w-5 text-primary" /> Ваша реферальная ссылка
          </CardTitle>
          <CardDescription>
            Поделитесь этой ссылкой с друзьями. Как только они перейдут по ней и активируют бота, вы получите <strong>+7 дней Premium</strong>.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input 
              value={referralLink} 
              readOnly 
              className="font-mono text-sm bg-white dark:bg-gray-900" 
            />
            <Button 
              onClick={handleCopy} 
              variant={copied ? "secondary" : "default"}
              className="min-w-[120px]"
            >
              {copied ? <Check className="h-4 w-4 mr-2" /> : <Copy className="h-4 w-4 mr-2" />}
              {copied ? "Скопировано" : "Копировать"}
            </Button>
          </div>
          
          <div className="flex items-center gap-2 text-sm text-muted-foreground border-t pt-4 mt-2">
             <QrCode className="h-4 w-4" />
             <span>QR-код для быстрого перехода доступен в Telegram боте</span>
          </div>
        </CardContent>
      </Card>

      {/* --- LIST --- */}
      <Card>
        <CardHeader>
          <CardTitle>Ваши приглашения</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Друг</TableHead>
                <TableHead>Статус</TableHead>
                <TableHead>Дата приглашения</TableHead>
                <TableHead className="text-right">Награда</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {MOCK_REFERRALS.map((ref) => (
                <TableRow key={ref.id}>
                  <TableCell>
                    <div className="font-medium">{ref.name}</div>
                    <div className="text-xs text-muted-foreground">{ref.username}</div>
                  </TableCell>
                  <TableCell>
                    <Badge 
                      className={ref.status === 'active' 
                        ? 'bg-green-100 text-green-700 hover:bg-green-100' 
                        : 'bg-orange-100 text-orange-700 hover:bg-orange-100'}
                    >
                      {ref.status === 'active' ? 'Активен' : 'Ожидание'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">{ref.joined}</TableCell>
                  <TableCell className="text-right">
                    {ref.status === 'active' ? (
                      <div className="flex flex-col items-end">
                        <span className="font-bold text-green-600">+7 дней</span>
                        {(MOCK_REFERRALS.indexOf(ref) + 1) % 3 === 0 && <span className="text-[10px] text-purple-600">+1 день (Бонус)</span>}
                      </div>
                    ) : (
                      <span className="text-xs text-muted-foreground">-</span>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}