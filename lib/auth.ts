import { compare } from "bcrypt";
import { prisma } from "./prisma";

export async function authenticateUser(email: string, password: string) {
  try {
    // Ищем пользователя в БД по email
    const user = await prisma.user.findUnique({
      where: { email }
    });

    // Если пользователь не найден, возвращаем null
    if (!user || !user.password) {
      return null;
    }

    // Проверяем пароль
    const passwordMatch = await compare(password, user.password);

    // Если пароль не совпадает, возвращаем null
    if (!passwordMatch) {
      return null;
    }

    // Возвращаем пользователя без пароля
    return {
      id: user.id,
      name: user.name || "",
      email: user.email || "",
    };
  } catch (error) {
    console.error("Ошибка при аутентификации:", error);
    return null;
  }
} 