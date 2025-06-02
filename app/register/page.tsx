"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Проверка на совпадение паролей
    if (password !== confirmPassword) {
      alert("Пароли не совпадают");
      return;
    }
    // Здесь будет логика регистрации
    console.log("Registration attempt", { email, password });
  };

  return (
    <div className="flex min-h-[80vh] flex-col items-center justify-center">
      <div className="w-full max-w-md space-y-8 rounded-lg border p-6 shadow-md">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Регистрация</h1>
          <p className="mt-2 text-sm text-gray-600">
            Создайте новый аккаунт
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
                autoComplete="new-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="mt-1"
              />
            </div>
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium">
                Подтвердите пароль
              </label>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                autoComplete="new-password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className="mt-1"
              />
            </div>
          </div>

          <div>
            <Button type="submit" className="w-full">
              Зарегистрироваться
            </Button>
          </div>

          <div className="text-center text-sm">
            <a href="/login" className="text-blue-600 hover:underline">
              Уже есть аккаунт? Войдите
            </a>
          </div>
        </form>
      </div>
    </div>
  );
} 