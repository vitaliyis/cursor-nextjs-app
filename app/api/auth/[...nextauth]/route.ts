import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

const handler = NextAuth({
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
    strategy: "jwt"
  }
});

export { handler as GET, handler as POST }; 