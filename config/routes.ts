export const routes = {
  public: [
    { href: '/', label: 'Главная' },
  ],
  private: [
    { href: '/video', label: 'Видео' },
    { href: '/dashboard', label: 'Дашборд' },
    { href: '/profile', label: 'Профиль' },
  ],
  auth: [
    { href: '/login', label: 'Войти' },
    { href: '/register', label: 'Регистрация' },
  ]
} as const;

export const isProtectedRoute = (pathname: string) => {
  return routes.private.some(route => pathname.startsWith(route.href));
};

export const isAuthRoute = (pathname: string) => {
  return routes.auth.some(route => pathname.startsWith(route.href));
}; 