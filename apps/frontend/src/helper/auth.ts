import CredentialsProvider from "next-auth/providers/credentials";
import { NextAuthOptions, getServerSession } from "next-auth";
import { jwtDecode } from "jwt-decode";
import { ROUTES } from "@frontend/src/constants/routes";
import { isTokenExpired } from "./utils";

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
      if (isTokenExpired(token)) session.error = "Token expired";
      if (token?.accessToken) {
        session.accessToken = token.accessToken;
      }
      return session;
    },
  },
};

export const getSession = () => getServerSession(authOptions);
