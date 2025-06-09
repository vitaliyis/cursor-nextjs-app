import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(request: NextRequest) {
  const token = await getToken({ 
    req: request,
    secret: process.env.NEXTAUTH_SECRET || "your-super-secret-key-that-should-be-in-env"
  });
  const { nextUrl } = request;
  
  const isLoggedIn = !!token;
  
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
}

// Конфигурация матчера - указываем, какие маршруты должны проходить через middleware
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
}; 