import NextAuth from "next-auth/next";
import CredentialsProvider from "next-auth/providers/credentials";
import type { NextAuthOptions } from "next-auth";
import { jwtDecode } from "jwt-decode";
import { isTokenExpired } from "@frontend/src/helper/auth";
import { ROUTES } from "@frontend/src/constants/routes";

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
  },

  pages: {
    signIn: ROUTES.LOGIN,
  },

  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: {},
        password: {},
      },
      async authorize(credentials, req) {
        try {
          const { email, password } = credentials!;
          const res = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/api/login`,
            {
              method: "POST",
              body: JSON.stringify({ email, password }),
              headers: { "Content-Type": "application/json" },
            }
          );
          const user = await res.json();

          if (res.ok && user) {
            return user;
          }
          return null;
        } catch (err) {}
      },
    }),
  ],
  callbacks: {
    jwt: async ({ token, user }) => {
      if (user?.access_token) {
        const tokenDecoded = jwtDecode(user.access_token);
        return {
          accessToken: user.access_token,
          expiryTime: tokenDecoded.exp,
          ...tokenDecoded,
        };
      }
      return token;
    },
    session: async ({ session, token }) => {
      if (isTokenExpired(token)) return null;
      if (token?.accessToken) {
        session.accessToken = token.accessToken as string;
      }
      return session;
    },
  },
};
const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
