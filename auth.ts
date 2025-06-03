import NextAuth from "next-auth";
import { authConfig } from "./auth.config";

export const { 
  handlers, 
  auth, 
  signIn, 
  signOut,
  update 
} = NextAuth({
  ...authConfig,
  session: { strategy: "jwt" },
  secret: process.env.AUTH_SECRET || "your-super-secret-key-that-should-be-in-env",
  debug: process.env.NODE_ENV === "development",
}); 