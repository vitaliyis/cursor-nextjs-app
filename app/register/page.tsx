"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { GoogleReCaptchaProvider, useGoogleReCaptcha } from "react-google-recaptcha-v3";

// Компонент формы регистрации
function RegisterForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const { executeRecaptcha } = useGoogleReCaptcha();
  const router = useRouter();

  // Получаем токен капчи при загрузке компонента
  useEffect(() => {
    const handleReCaptchaVerify = async () => {
      if (!executeRecaptcha) {
        return;
      }
      
      try {
        const token = await executeRecaptcha('register');
        setCaptchaToken(token);
      } catch (error) {
        console.error("Ошибка reCAPTCHA:", error);
        setError("Не удалось загрузить капчу. Пожалуйста, перезагрузите страницу.");
      }
    };

    handleReCaptchaVerify();
  }, [executeRecaptcha]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    // Проверка на совпадение паролей
    if (password !== confirmPassword) {
      setError("Пароли не совпадают");
      return;
    }
    
    // Проверка капчи
    if (!captchaToken) {
      setError("Ожидание проверки reCAPTCHA. Пожалуйста, подождите...");
      return;
    }

    setIsLoading(true);

    try {
      // Сначала проверяем капчу на сервере
      const captchaResponse = await fetch("/api/verify-captcha", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token: captchaToken }),
      });
      
      const captchaData = await captchaResponse.json();
      
      if (!captchaData.success) {
        setError(captchaData.message || "Ошибка проверки безопасности");
        setIsLoading(false);
        // Пытаемся получить новый токен
        if (executeRecaptcha) {
          const newToken = await executeRecaptcha('register_retry');
          setCaptchaToken(newToken);
        }
        return;
      }

      // Если капча прошла проверку, выполняем регистрацию
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Ошибка при регистрации");
        setIsLoading(false);
        // Пытаемся получить новый токен
        if (executeRecaptcha) {
          const newToken = await executeRecaptcha('register_error');
          setCaptchaToken(newToken);
        }
        return;
      }

      // Если регистрация успешна, выполняем вход
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError("Регистрация выполнена, но произошла ошибка при входе");
        setIsLoading(false);
        return;
      }

      router.push("/dashboard");
      router.refresh();
    } catch (error) {
      setError("Произошла ошибка при регистрации");
      setIsLoading(false);
      // Пытаемся получить новый токен
      if (executeRecaptcha) {
        const newToken = await executeRecaptcha('register_error');
        setCaptchaToken(newToken);
      }
    }
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

        {error && (
          <div className="rounded-md bg-red-50 p-3">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium">
                Имя (необязательно)
              </label>
              <Input
                id="name"
                name="name"
                type="text"
                autoComplete="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ваше имя"
                className="mt-1"
              />
            </div>
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
            <Button 
              type="submit" 
              className="w-full"
              disabled={isLoading || !captchaToken}
            >
              {isLoading ? "Регистрация..." : "Зарегистрироваться"}
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

// Обертка с провайдером reCAPTCHA
export default function RegisterPage() {
  return (
    <GoogleReCaptchaProvider
      reCaptchaKey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || ""}
      scriptProps={{
        async: true,
        defer: true,
        appendTo: 'head',
      }}
    >
      <RegisterForm />
    </GoogleReCaptchaProvider>
  );
} 