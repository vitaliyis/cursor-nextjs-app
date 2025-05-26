import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    // Здесь должна быть логика создания пользователя в базе данных
    // Пока просто имитируем успешную регистрацию
    
    return NextResponse.json({ message: "Регистрация успешна" });
  } catch (error) {
    return NextResponse.json(
      { message: "Ошибка при регистрации" },
      { status: 500 }
    );
  }
} 