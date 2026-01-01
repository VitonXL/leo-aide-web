"use client";

import { useState } from "react";
import { MessageSquare, Send, ThumbsUp, ThumbsDown, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";

export default function FeedbackPage() {
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
    setRating(0);
    setFeedback("");
  };

  return (
    <div className="fade-in main-content">
      <div className="mb-8 text-center">
        <div className="h-16 w-16 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center mx-auto mb-4">
          <MessageSquare size={32} />
        </div>
        <h1 className="text-3xl font-bold mb-2">Обратная связь</h1>
        <p className="text-muted-foreground">Ваше мнение помогает нам делать сервис лучше</p>
      </div>

      <div className="card">
        <h3 className="text-lg font-bold mb-4">Оставить отзыв</h3>
        {submitted ? (
          <div className="text-center py-8">
            <div className="text-green-500 mb-2">Спасибо за ваш отзыв!</div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex justify-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  className={`transition-colors ${rating >= star ? "text-yellow-400 fill-current" : "text-gray-300"}`}
                >
                  <Star size={32} />
                </button>
              ))}
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Ваше сообщение</label>
              <Textarea 
                placeholder="Расскажите, что вам понравилось или что можно улучшить..."
                value={feedback}
                onChange={e => setFeedback(e.target.value)}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
               <div>
                 <label className="text-sm font-medium mb-2 block">Email (опционально)</label>
                 <Input type="email" placeholder="Для связи с вами" />
               </div>
               <div className="flex items-end gap-2">
                 <button type="button" className="btn btn-outline flex-1 flex-col gap-1 h-20 justify-center">
                   <ThumbsUp size={20} /> Понравилось
                 </button>
                 <button type="button" className="btn btn-outline flex-1 flex-col gap-1 h-20 justify-center">
                   <ThumbsDown size={20} /> Нет
                 </button>
               </div>
            </div>

            <button type="submit" className="btn btn-primary w-full">
              <Send className="mr-2 h-4 w-4" /> Отправить отзыв
            </button>
          </form>
        )}
      </div>
    </div>
  );
}