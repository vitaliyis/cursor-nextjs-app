"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Здесь будет логика авторизации
    console.log("Login attempt", { email, password });
  };

  return (
    <div className="flex min-h-[80vh] flex-col items-center justify-center">
      <div className="w-full max-w-md space-y-8 rounded-lg border p-6 shadow-md">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Вход в систему</h1>
          <p className="mt-2 text-sm text-gray-600">
            Введите ваши данные для входа
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium">
                Email
              </label>
              <Input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="mt-1"
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium">
                Пароль
              </label>
              <Input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="mt-1"
              />
            </div>
          </div>

          <div>
            <Button type="submit" className="w-full">
              Войти
            </Button>
          </div>

          <div className="text-center text-sm">
            <a href="/register" className="text-blue-600 hover:underline">
              Нет аккаунта? Зарегистрируйтесь
            </a>
          </div>
        </form>
      </div>
    </div>
  );
} 