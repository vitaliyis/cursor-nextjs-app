import { auth } from "@/auth";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export default auth((req) => {
  const { nextUrl, auth } = req;
  const isLoggedIn = !!auth?.user;
  
  // Защищенные маршруты (требуют аутентификации)
  const isProtectedRoute = nextUrl.pathname.startsWith("/dashboard");
  
  // Маршруты аутентификации
  const isAuthRoute = 
    nextUrl.pathname.startsWith("/login") || 
    nextUrl.pathname.startsWith("/register");

  // Если пользователь не авторизован и пытается перейти к защищенному маршруту
  if (!isLoggedIn && isProtectedRoute) {
    return NextResponse.redirect(new URL("/login", nextUrl));
  }

  // Если пользователь авторизован и пытается перейти к маршруту аутентификации
  if (isLoggedIn && isAuthRoute) {
    return NextResponse.redirect(new URL("/dashboard", nextUrl));
  }

  return NextResponse.next();
});

// Конфигурация матчера - указываем, какие маршруты должны проходить через middleware
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
}; 