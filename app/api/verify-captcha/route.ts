import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { token } = await req.json();

    if (!token) {
      return NextResponse.json(
        { success: false, message: "Токен капчи отсутствует" },
        { status: 400 }
      );
    }

    const secretKey = process.env.RECAPTCHA_SECRET_KEY;

    if (!secretKey) {
      console.error("RECAPTCHA_SECRET_KEY не настроен в переменных окружения");
      return NextResponse.json(
        { success: false, message: "Ошибка конфигурации сервера" },
        { status: 500 }
      );
    }

    // Отправляем запрос к API Google для проверки токена
    const response = await fetch(
      `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${token}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    const data = await response.json();

    // В reCAPTCHA v3 мы получаем оценку от 0.0 до 1.0
    if (data.success) {
      // Проверяем оценку - обычно 0.5 является минимальным порогом для нормальных пользователей
      const score = data.score || 0;
      
      if (score >= 0.5) {
        return NextResponse.json({ 
          success: true,
          score 
        });
      } else {
        // Оценка слишком низкая, вероятно бот
        console.warn(`Низкая оценка reCAPTCHA: ${score}. Возможно бот.`);
        return NextResponse.json(
          { 
            success: false, 
            message: "Проверка безопасности не пройдена. Пожалуйста, попробуйте еще раз.",
            score
          },
          { status: 400 }
        );
      }
    } else {
      console.error("Ошибка reCAPTCHA:", data["error-codes"]);
      return NextResponse.json(
        { success: false, message: "Проверка капчи не пройдена" },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error("Ошибка при проверке капчи:", error);
    return NextResponse.json(
      { success: false, message: "Внутренняя ошибка сервера" },
      { status: 500 }
    );
  }
} 