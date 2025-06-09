import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { authConfig } from "./auth.config";
import { prisma } from "./lib/prisma";

export const { 
  handlers, 
  auth, 
  signIn, 
  signOut
} = NextAuth({
  adapter: PrismaAdapter(prisma),
  ...authConfig,
  session: { strategy: "jwt" },
  secret: process.env.NEXTAUTH_SECRET || "your-super-secret-key-that-should-be-in-env",
  debug: process.env.NODE_ENV === "development",
}); 