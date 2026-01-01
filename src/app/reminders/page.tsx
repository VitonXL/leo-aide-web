
```tsx
"use client";

import { useState } from "react";
import { Calendar, MapPin, Plus, Check, Trash2, Bell, Clock, AlertCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

type Priority = "low" | "medium" | "high";

interface Task {
  id: number;
  text: string;
  priority: Priority;
  date: string;
  completed: boolean;
  location?: string;
}

const INITIAL_TASKS: Task[] = [
  { id: 1, text: "Купить продукты", priority: "high", date: "Сегодня", completed: false, location: "Пятерочка" },
  { id: 2, text: "Позвонить маме", priority: "medium", date: "Сегодня", completed: true },
];

export default function RemindersPage() {
  const [tasks, setTasks] = useState<Task[]>(INITIAL_TASKS);
  const [newTask, setNewTask] = useState({ text: "", priority: "medium" as Priority, location: "" });
  const [showLocationInput, setShowLocationInput] = useState(false);

  const addTask = () => {
    if (!newTask.text) return;
    setTasks([...tasks, {
      id: Date.now(),
      text: newTask.text,
      priority: newTask.priority,
      date: "Сегодня",
      completed: false,
      location: newTask.location || undefined
    }]);
    setNewTask({ text: "", priority: "medium", location: "" });
    setShowLocationInput(false);
  };

  const toggleComplete = (id: number) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const deleteTask = (id: number) => {
    setTasks(tasks.filter(t => t.id !== id));
  };

  const getPriorityColor = (p: Priority) => {
    switch(p) {
      case 'high': return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400';
      case 'medium': return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400';
      case 'low': return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
    }
  };

  return (
    <div className="container py-8 max-w-4xl main-content">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold flex items-center gap-2"><Bell className="text-primary"/> Напоминания</h1>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <MapPin size={16} />
          <Switch checked={showLocationInput} onCheckedChange={setShowLocationInput} />
        </div>
      </div>

      {/* New Task Input */}
      <Card className="mb-8">
        <CardContent className="pt-6">
          <div className="flex gap-2 mb-2">
            <Input 
              placeholder="Новая задача..." 
              value={newTask.text}
              onChange={e => setNewTask({ ...newTask, text: e.target.value })}
              onKeyDown={e => e.key === 'Enter' && addTask()}
              className="flex-1"
            />
            <Select value={newTask.priority} onValueChange={(v: any) => setNewTask({ ...newTask, priority: v })}>
              <SelectTrigger className="w-[120px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="high">Высокий</SelectItem>
                <SelectItem value="medium">Средний</SelectItem>
                <SelectItem value="low">Низкий</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={addTask}><Plus className="h-4 w-4"/></Button>
          </div>
          {showLocationInput && (
            <div className="flex gap-2 items-center animate-in fade-in slide-in-from-top-2">
              <MapPin size={16} className="text-muted-foreground" />
              <Input 
                placeholder="Место (геопривязка)..." 
                value={newTask.location}
                onChange={e => setNewTask({ ...newTask, location: e.target.value })}
              />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Task List */}
      <div className="space-y-3">
        {tasks.filter(t => !t.completed).length > 0 && (
          <h3 className="font-semibold text-muted-foreground text-sm uppercase">Активные</h3>
        )}
        {tasks.filter(t => !t.completed).map(task => (
          <Card key={task.id} className="flex items-center justify-between p-4 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3 flex-1">
              <button onClick={() => toggleComplete(task.id)} className="w-6 h-6 rounded-full border-2 border-primary flex items-center justify-center text-transparent hover:bg-primary hover:text-white transition-colors" />
              <div className="flex-1">
                <p className={`font-medium ${task.completed ? 'line-through text-muted-foreground' : ''}`}>{task.text}</p>
                <div className="flex gap-2 items-center mt-1">
                  <Badge variant="outline" className={`text-[10px] h-5 px-1.5 ${getPriorityColor(task.priority)}`}>
                    {task.priority === 'high' ? 'Важно' : 'Обычно'}
                  </Badge>
                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                    <Clock size={12}/> {task.date}
                  </span>
                  {task.location && (
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <MapPin size={12}/> {task.location}
                    </span>
                  )}
                </div>
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={() => deleteTask(task.id)}>
              <Trash2 size={16} className="text-red-500" />
            </Button>
          </Card>
        ))}

        {tasks.filter(t => t.completed).length > 0 && (
          <>
            <h3 className="font-semibold text-muted-foreground text-sm uppercase mt-6">Выполнено</h3>
            {tasks.filter(t => t.completed).map(task => (
              <Card key={task.id} className="flex items-center justify-between p-4 opacity-60">
                <div className="flex items-center gap-3 flex-1">
                  <div className="w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center">
                    <Check size={14} />
                  </div>
                  <p className="line-through text-muted-foreground">{task.text}</p>
                </div>
                <Button variant="ghost" size="icon" onClick={() => deleteTask(task.id)}>
                  <Trash2 size={16} />
                </Button>
              </Card>
            ))}
          </>
        )}
      </div>
    </div>
  );
}
```