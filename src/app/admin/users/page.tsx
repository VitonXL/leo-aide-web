"use client";

import { useState } from "react";
import { Users, Shield, Crown, Search, Filter, Ban, CheckCircle, Mail, MapPin, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

// Mock Data
const USERS = [
  { id: 1, name: "Алексей И.", email: "alex@mail.ru", role: "admin", status: "active", ip: "192.168.1.10", sub: "lifetime", joined: "2023-01-10" },
  { id: 2, name: "Мария К.", email: "maria@gmail.com", role: "user", status: "active", ip: "10.0.0.5", sub: "premium", joined: "2023-05-15" },
  { id: 3, name: "Дмитрий В.", email: "dmitry@yandex.ru", role: "user", status: "active", ip: "172.16.0.1", sub: "expired", joined: "2023-08-20" },
  { id: 4, name: "Елена С.", email: "elena@inbox.ru", role: "moderator", status: "active", ip: "192.168.1.55", sub: "free", joined: "2023-09-01" },
  { id: 5, name: "Бот Спамер", email: "spam@bot.net", role: "user", status: "blocked", ip: "45.33.32.156", sub: "none", joined: "2023-10-25" },
];

export default function AdminUsersPage() {
  const [search, setSearch] = useState("");
  const [filterRole, setFilterRole] = useState("all");
  const [filterSub, setFilterSub] = useState("all");

  const filteredUsers = USERS.filter(u => {
    const matchesSearch = u.name.toLowerCase().includes(search.toLowerCase()) || u.email.includes(search);
    const matchesRole = filterRole === "all" || u.role === filterRole;
    const matchesSub = filterSub === "all" || u.sub === filterSub;
    return matchesSearch && matchesRole && matchesSub;
  });

  const getRoleBadge = (role: string) => {
    switch(role) {
      case 'admin': return <Badge className="bg-red-100 text-red-700">Admin</Badge>;
      case 'moderator': return <Badge className="bg-blue-100 text-blue-700">Mod</Badge>;
      default: return <Badge variant="outline">User</Badge>;
    }
  };

  const getSubBadge = (sub: string) => {
    switch(sub) {
      case 'premium': return <Crown size={14} className="text-yellow-500 inline mr-1" /> + "Premium";
      case 'lifetime': return <Crown size={14} className="text-purple-500 inline mr-1" fill="currentColor" /> + "Lifetime";
      case 'expired': return <span className="text-orange-500 font-medium text-xs">Истек</span>;
      default: return <span className="text-gray-400">Free</span>;
    }
  };

  return (
    <div className="fade-in main-content">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2"><Users className="text-primary"/> Управление пользователями</h1>
          <p className="text-muted-foreground text-sm">Всего пользователей: {USERS.length}</p>
        </div>
        <Button className="btn-gold">
          <Crown className="mr-2 h-4 w-4"/> Выдать Premium по IP
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card className="p-4">
          <div className="text-sm text-muted-foreground">Активно (День)</div>
          <div className="text-2xl font-bold">1,240</div>
        </Card>
        <Card className="p-4">
          <div className="text-sm text-muted-foreground">Premium</div>
          <div className="text-2xl font-bold text-yellow-600">342</div>
        </Card>
        <Card className="p-4">
          <div className="text-sm text-muted-foreground">Модераторы</div>
          <div className="text-2xl font-bold text-blue-600">12</div>
        </Card>
        <Card className="p-4">
          <div className="text-sm text-muted-foreground">Заблокировано</div>
          <div className="text-2xl font-bold text-red-600">45</div>
        </Card>
      </div>

      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Поиск по имени или email..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9" />
            </div>
            <Select value={filterRole} onValueChange={setFilterRole}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Роль" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Все роли</SelectItem>
                <SelectItem value="admin">Админы</SelectItem>
                <SelectItem value="moderator">Модераторы</SelectItem>
                <SelectItem value="user">Пользователи</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterSub} onValueChange={setFilterSub}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Подписка" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Все статусы</SelectItem>
                <SelectItem value="premium">Premium</SelectItem>
                <SelectItem value="expired">Истекает</SelectItem>
                <SelectItem value="free">Free</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Пользователь</TableHead>
                  <TableHead>Роль</TableHead>
                  <TableHead>Подписка</TableHead>
                  <TableHead>IP Адрес</TableHead>
                  <TableHead>Статус</TableHead>
                  <TableHead className="text-right">Действия</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map(user => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{user.name}</div>
                        <div className="text-xs text-muted-foreground flex items-center gap-1"><Mail size={10}/> {user.email}</div>
                      </div>
                    </TableCell>
                    <TableCell>{getRoleBadge(user.role)}</TableCell>
                    <TableCell className="font-mono text-sm">{getSubBadge(user.sub)}</TableCell>
                    <TableCell className="text-xs font-mono text-muted-foreground">{user.ip}</TableCell>
                    <TableCell>
                      <span className={`flex items-center gap-1 text-xs font-bold ${user.status === 'active' ? 'text-green-600' : 'text-red-600'}`}>
                        <div className={`w-2 h-2 rounded-full ${user.status === 'active' ? 'bg-green-500' : 'bg-red-500'}`}></div>
                        {user.status === 'active' ? 'Активен' : 'Заблокирован'}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon"><MoreHorizontal className="h-4 w-4" /></Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem><Shield className="mr-2 h-4 w-4"/> Сменить роль</DropdownMenuItem>
                          <DropdownMenuItem><Crown className="mr-2 h-4 w-4"/> Выдать Premium</DropdownMenuItem>
                          <DropdownMenuItem><MapPin className="mr-2 h-4 w-4"/> Локация</DropdownMenuItem>
                          <DropdownMenuItem className="text-red-600"><Ban className="mr-2 h-4 w-4"/> Заблокировать</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}