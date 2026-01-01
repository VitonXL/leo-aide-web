"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { X, Home, User, Crown, Shield, Gamepad2, Film, DollarSign, Cloud, Monitor, Globe, Newspaper, MessageSquare, Settings, LifeBuoy, Headphones, PieChart, Radio, LayoutGrid, HelpCircle, FileText, Map, Download, Calendar, Megaphone, BarChart3, FileEdit, Lock, History, Calculator, Wrench, Sparkles, Bus, Scissors, ChefHat, Briefcase, PushPin, Pencil, Check, ChevronDown, ChevronRight, BookOpen, Music, ShoppingCart, Package, Share2, Zap } from "lucide-react";
import { useEffect, useState } from "react";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  isAdmin: boolean;
  isModerator: boolean;
  userId: string;
}

// --- ДАННЫЕ НАВИГАЦИИ С ГРУППИРОВКОЙ ---
const NAV_ITEMS = [
  // Основное (без группы, всегда видны или в pinned)
  { id: "/", label: "Главная", icon: Home, group: "main" },
  { id: "/profile", label: "Профиль", icon: User, group: "main" },
  { id: "/premium", label: "Премиум", icon: Crown, group: "main", isGold: true },
  
  // Работа и Финансы
  { id: "/finance", label: "Финансы", icon: PieChart, group: "work" },
  { id: "/currency", label: "Курсы валют", icon: DollarSign, group: "work" },
  { id: "/inventory", label: "Склад/POS", icon: Package, group: "work" },
  { id: "/household", label: "Быт и Счета", icon: ChefHat, group: "work" },
  { id: "/tools", label: "Инструменты", icon: Wrench, group: "work" },
  
  // Развлечения и Медиа
  { id: "/movies", label: "Фильмы", icon: Film, group: "ent", badge: "Pro" },
  { id: "/games", label: "Игры", icon: Gamepad2, group: "ent" },
  { id: "/music", label: "Музыка", icon: Music, group: "ent" },
  { id: "/social", label: "Соцсети", icon: Share2, group: "ent" },
  
  // Контент и Инфо
  { id: "/blog", label: "Блог", icon: Newspaper, group: "content" },
  { id: "/news", label: "Новости", icon: Radio, group: "content" },
  { id: "/inspiration", label: "Вдохновение", icon: Sparkles, group: "content" },
  { id: "/recommendations", label: "Рекомендации", icon: BookOpen, group: "content" },
  { id: "/faq", label: "FAQ", icon: HelpCircle, group: "content" },
  
  // Полезное
  { id: "/templates", label: "Шаблоны", icon: Download, group: "utils" },
  { id: "/events", label: "Афиша", icon: Calendar, group: "utils" },
  { id: "/local", label: "Город", icon: Bus, group: "utils" },
  { id: "/map", label: "Карта", icon: Map, group: "utils" },
  { id: "/search", label: "Поиск", icon: Briefcase, group: "utils" }, // Используем Briefcase как иконку поиска, т.к. она уже импортирована
  
  // Настройки
  { id: "/settings", label: "Настройки", icon: Settings, group: "settings" },
  { id: "/support", label: "Поддержка", icon: LifeBuoy, group: "settings" },
];

const GROUPS = {
  work: { label: "Финансы и Работа", icon: Briefcase, color: "text-green-600 dark:text-green-400" },
  ent: { label: "Развлечения", icon: Gamepad2, color: "text-purple-600 dark:text-purple-400" },
  content: { label: "Контент", icon: Newspaper, color: "text-blue-600 dark:text-blue-400" },
  utils: { label: "Полезное", icon: Zap, color: "text-orange-600 dark:text-orange-400" },
  settings: { label: "Система", icon: Settings, color: "text-gray-600 dark:text-gray-400" },
};

const ADMIN_LINKS = [
  { href: "/admin/management", icon: LayoutGrid, label: "Панель Управления" },
  { href: "/admin/support", icon: Headphones, label: "Тех.поддержка" },
  { href: "/admin/marketing", icon: Megaphone, label: "Маркетинг" },
];

export default function Sidebar({ isOpen, onClose, isAdmin, isModerator, userId }: SidebarProps) {
  const pathname = usePathname();
  
  const [isEditing, setIsEditing] = useState(false);
  
  // Загрузка закрепленных из localStorage + Сохранение
  const [pinnedIds, setPinnedIds] = useState<string[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem("pinned-menu-items");
        return saved ? JSON.parse(saved) : [];
      } catch (e) {
        console.warn("Failed to load pinned items", e);
        return [];
      }
    }
    return [];
  });

  // Сохраняем пины при изменении
  useEffect(() => {
    try {
      localStorage.setItem("pinned-menu-items", JSON.stringify(pinnedIds));
    } catch (e) {
      console.warn("Failed to save pinned items", e);
    }
  }, [pinnedIds]);

  const [openGroups, setOpenGroups] = useState<Set<string>>(new Set(["work"])); // По умолчанию открыта группа "Работа"

  // --- HANDLERS ---
  const toggleGroup = (groupId: string) => {
    const newOpen = new Set(openGroups);
    if (newOpen.has(groupId)) {
      newOpen.delete(groupId);
    } else {
      newOpen.add(groupId);
    }
    setOpenGroups(newOpen);
  };

  const togglePin = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    e.stopPropagation();
    
    const newPinned = pinnedIds.includes(id)
      ? pinnedIds.filter(itemId => itemId !== id)
      : [...pinnedIds, id];
    
    setPinnedIds(newPinned);
  };

  const isPinned = (id: string) => pinnedIds.includes(id);
  const isActive = (href: string) => pathname === href;

  // --- COMPONENTS ---
  
  // 1. Элемент списка
  const NavItem = ({ item }: { item: typeof NAV_ITEMS[0] }) => {
    const active = isActive(item.id);
    const pinned = isPinned(item.id);
    
    return (
      <div className="group relative">
        <Link 
          href={item.id} 
          onClick={onClose} 
          className={`flex items-center justify-between px-4 py-2.5 text-sm font-medium transition-all duration-200 rounded-lg mx-2 mb-1 border ${
            active 
              ? 'bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800 shadow-sm' 
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-200 border-transparent'
          }`}
        >
          <div className="flex items-center gap-3 flex-1">
            <item.icon size={18} className={active ? "text-green-600 dark:text-green-400" : "text-slate-500 dark:text-slate-400"} />
            <span className="flex-1">{item.label}</span>
            {item.badge && <span className="text-[10px] px-1.5 py-0.5 rounded font-bold bg-red-100 text-red-600">{item.badge}</span>}
          </div>
          
          {/* Кнопка Закрепить (видна только в режиме редактирования) */}
          {isEditing && (
            <button 
              onClick={(e) => togglePin(e, item.id)}
              className="p-1.5 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              title={pinned ? "Открепить" : "Закрепить"}
            >
              <PushPin 
                size={14} 
                className={pinned ? "text-primary fill-current" : "text-gray-400"} 
                fill={pinned ? "currentColor" : "none"}
              />
            </button>
          )}
        </Link>
      </div>
    );
  };

  // 2. Группа с аккордеоном
  const NavGroup = ({ groupId, items }: { groupId: string, items: typeof NAV_ITEMS }) => {
    const group = GROUPS[groupId as keyof typeof GROUPS];
    const isOpen = openGroups.has(groupId);
    
    if (!group) return null;

    return (
      <div className="mb-2">
        <button 
          onClick={() => toggleGroup(groupId)}
          className={`w-full flex items-center justify-between px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-lg mx-2 mb-1 transition-colors ${
            isOpen ? 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white' : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'
          }`}
        >
          <div className="flex items-center gap-2">
            <group.icon size={14} className={group.color} />
            <span>{group.label}</span>
          </div>
          {isOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
        </button>
        
        {isOpen && (
          <div className="animate-in fade-in slide-in-from-top-1 duration-200">
            {items.map(item => <NavItem key={item.id} item={item} />)}
          </div>
        )}
      </div>
    );
  };

  // --- RENDER ---
  
  // Фильтруем закрепленные и обычные элементы
  const pinnedItemsData = NAV_ITEMS.filter(item => pinnedIds.includes(item.id));
  const unpinnedItemsData = NAV_ITEMS.filter(item => !pinnedIds.includes(item.id));

  // Группируем незакрепленные элементы
  const groupedItems = unpinnedItemsData.reduce((acc, item) => {
    if (!item.group) return acc;
    if (!acc[item.group]) acc[item.group] = [];
    acc[item.group].push(item);
    return acc;
  }, {} as Record<string, typeof NAV_ITEMS>);

  // Элементы без группы (Главная, Профиль)
  const flatItems = unpinnedItemsData.filter(item => !item.group || item.group === "main");

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 transition-opacity duration-300 md:hidden" onClick={onClose} />
      )}

      <aside className={`fixed inset-y-0 left-0 z-50 w-72 bg-white dark:bg-[#0A0A0C] border-r border-slate-200 dark:border-slate-800 transform transition-transform duration-300 ease-in-out overflow-y-auto flex flex-col shadow-2xl ${isOpen ? "translate-x-0" : "-translate-x-full"}`}>
        
        {/* HEADER */}
        <div className="flex items-center justify-between p-5 border-b border-slate-100 dark:border-slate-800/50 sticky top-0 bg-white/95 dark:bg-[#0A0A0C]/95 backdrop-blur-md z-20 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-gradient-to-br from-green-500 to-teal-600 rounded-xl flex items-center justify-center text-white font-bold shadow-lg shadow-green-500/20">L</div>
            <span className="font-bold text-lg text-slate-800 dark:text-white tracking-tight">Меню</span>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-slate-500 dark:text-slate-400">
            <X size={20} />
          </button>
        </div>

        <div className="py-4 px-2 space-y-1 flex-1">
          
          {/* КНОПКА РЕДАКТИРОВАНИЯ */}
          <div className="flex items-center justify-between px-2 mb-4">
             <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Меню
             </span>
             <button 
                onClick={() => setIsEditing(!isEditing)}
                className={`text-[10px] font-medium px-2 py-1 rounded-full flex items-center gap-1 transition-all ${
                  isEditing 
                  ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' 
                  : 'bg-slate-100 text-slate-500 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-400'
                }`}
             >
                <Pencil size={10} />
                {isEditing ? "Сохранить" : "Изменить"}
             </button>
          </div>

          {/* ЗАКРЕПЛЕННЫЕ ЭЛЕМЕНТЫ (QUICK ACCESS) */}
          {pinnedItemsData.length > 0 && (
             <div className="mb-6">
                <div className="px-2 mb-2 flex items-center gap-1">
                   <PushPin size={12} className="text-primary fill-current" />
                   <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Быстрый доступ</span>
                </div>
                <div className="bg-primary/5 dark:bg-primary/5/20 rounded-lg p-1 border border-primary/10">
                  {pinnedItemsData.map(item => <NavItem key={item.id} item={item} />)}
                </div>
             </div>
          )}

          {/* ОСНОВНЫЕ ПУНКТЫ */}
          {flatItems.map(item => (
            <div key={item.id} className="mb-2">
              <NavItem item={item} />
            </div>
          ))}

          {/* ГРУППИРОВАННЫЕ ПУНКТЫ */}
          {Object.keys(groupedItems).map(groupId => (
            <NavGroup key={groupId} groupId={groupId} items={groupedItems[groupId]} />
          ))}

          {/* АДМИНКА */}
          {isAdmin && (
             <div className="mt-6 pt-6 border-t border-slate-100 dark:border-slate-800/50">
               <div className="px-4 py-2 text-xs font-bold text-green-600 dark:text-green-500 uppercase tracking-wider mb-2 flex items-center gap-2">
                 <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                 Админка
               </div>
               <div className="space-y-1">
                 {ADMIN_LINKS.map(link => (
                   <Link 
                     key={link.href} 
                     href={link.href} 
                     onClick={onClose} 
                     className={`flex items-center gap-3 px-4 py-2.5 text-sm font-medium rounded-lg mx-2 mb-1 transition-colors ${
                       isActive(link.href) 
                        ? 'bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 border border-purple-200 dark:border-purple-800' 
                        : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                     }`}
                   >
                     <link.icon size={18} />
                     <span>{link.label}</span>
                   </Link>
                 ))}
               </div>
             </div>
          )}
        </div>
        
        {/* FOOTER */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800/50 text-center bg-slate-50 dark:bg-[#0F0F10]">
          <p className="text-[10px] text-slate-400 font-medium">© 2024 Leo Assistant</p>
          {isEditing && (
             <p className="text-[9px] text-blue-500 mt-1">Нажмите ★ чтобы закрепить страницу</p>
          )}
        </div>
      </aside>
    </>
  );
}