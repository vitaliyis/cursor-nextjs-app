import NextAuth, { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        console.log('Login attempt for:', credentials.email);

        // Здесь будет логика проверки пользователя
        // Пока возвращаем тестового пользователя
        return {
          id: "1",
          email: credentials.email,
          name: "Test User"
        };
      }
    })
  ],
  pages: {
    signIn: '/auth/signin'
  },
  session: {
    strategy: "jwt" as const,
    maxAge: 15 * 60 // 30 days in seconds
  },
  secret: "your-secret-key"
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST }; 