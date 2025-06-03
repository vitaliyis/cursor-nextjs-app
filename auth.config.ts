import type { NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";

export const authConfig = {
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Пароль", type: "password" }
      },
      async authorize(credentials) {
        // В реальном приложении здесь будет проверка учетных данных из БД
        // Сейчас просто принимаем любые учетные данные для демонстрации
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        // Для демонстрации - тестовый пользователь
        const user = {
          id: "1",
          name: "Тестовый Пользователь",
          email: credentials.email,
        };

        return user;
      }
    })
  ],
  pages: {
    signIn: "/login",
    signOut: "/login",
    error: "/login",
    newUser: "/register",
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isOnDashboard = nextUrl.pathname.startsWith("/dashboard");
      if (isOnDashboard) {
        if (isLoggedIn) return true;
        return false; // перенаправление на страницу входа
      } else if (isLoggedIn) {
        return true;
      }
      return true;
    },
    jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
      }
      return session;
    },
  },
} satisfies NextAuthConfig; 