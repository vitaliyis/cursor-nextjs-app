"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { GoogleReCaptchaProvider, useGoogleReCaptcha } from "react-google-recaptcha-v3";

// Компонент формы логина
function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
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
        const token = await executeRecaptcha('login');
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
        setError(captchaData.message || "Ошибка проверки капчи");
        setIsLoading(false);
        // Пытаемся получить новый токен
        if (executeRecaptcha) {
          const newToken = await executeRecaptcha('login_retry');
          setCaptchaToken(newToken);
        }
        return;
      }

      // Если капча прошла проверку, выполняем вход
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError("Неверный email или пароль");
        setIsLoading(false);
        // Пытаемся получить новый токен
        if (executeRecaptcha) {
          const newToken = await executeRecaptcha('login_error');
          setCaptchaToken(newToken);
        }
        return;
      }

      router.push("/dashboard");
      router.refresh();
    } catch (error) {
      setError("Произошла ошибка при входе");
      setIsLoading(false);
      // Пытаемся получить новый токен
      if (executeRecaptcha) {
        const newToken = await executeRecaptcha('login_error');
        setCaptchaToken(newToken);
      }
    }
  };

  const handleGoogleSignIn = async () => {
    if (!captchaToken) {
      setError("Ожидание проверки reCAPTCHA. Пожалуйста, подождите...");
      return;
    }
    
    setIsLoading(true);
    try {
      // Проверяем капчу перед входом через Google
      const captchaResponse = await fetch("/api/verify-captcha", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token: captchaToken }),
      });
      
      const captchaData = await captchaResponse.json();
      
      if (!captchaData.success) {
        setError(captchaData.message || "Ошибка проверки капчи");
        setIsLoading(false);
        // Пытаемся получить новый токен
        if (executeRecaptcha) {
          const newToken = await executeRecaptcha('google_login_retry');
          setCaptchaToken(newToken);
        }
        return;
      }

      await signIn("google", { callbackUrl: "/dashboard" });
    } catch (error) {
      setError("Произошла ошибка при входе через Google");
      setIsLoading(false);
      // Пытаемся получить новый токен
      if (executeRecaptcha) {
        const newToken = await executeRecaptcha('google_login_error');
        setCaptchaToken(newToken);
      }
    }
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

        {error && (
          <div className="rounded-md bg-red-50 p-3">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

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
            <Button 
              type="submit" 
              className="w-full"
              disabled={isLoading || !captchaToken}
            >
              {isLoading ? "Вход..." : "Войти"}
            </Button>
          </div>

          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-white px-2 text-gray-500">Или</span>
            </div>
          </div>

          <div>
            <Button 
              type="button" 
              className="w-full flex items-center justify-center gap-2 bg-white text-black border border-gray-300 hover:bg-gray-50"
              onClick={handleGoogleSignIn}
              disabled={isLoading || !captchaToken}
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" className="h-5 w-5">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              Войти с Google
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

// Обертка с провайдером reCAPTCHA
export default function LoginPage() {
  return (
    <GoogleReCaptchaProvider
      reCaptchaKey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || ""}
      scriptProps={{
        async: true,
        defer: true,
        appendTo: 'head',
      }}
    >
      <LoginForm />
    </GoogleReCaptchaProvider>
  );
} 