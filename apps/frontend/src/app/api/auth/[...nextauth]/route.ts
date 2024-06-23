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
      // The name to display on the sign in form (e.g. 'Sign in with...')
      name: "Credentials",
      credentials: {
        email: {},
        password: {},
      },
      async authorize(credentials, req) {
        console.log("credentials :>> ", credentials);
        // You need to provide your own logic here that takes the credentials
        // submitted and returns either a object representing a user or value
        // that is false/null if the credentials are invalid.
        // e.g. return { id: 1, name: 'J Smith', email: 'jsmith@example.com' }
        // You can also use the `req` object to obtain additional parameters
        // (i.e., the request IP address)
        try {
          const { email, password } = credentials;
          const res = await fetch("http://localhost:4000/api/login", {
            method: "POST",
            body: JSON.stringify({ email, password }),
            headers: { "Content-Type": "application/json" },
          });
          const user = await res.json();
          console.log("user :>> ", user);

          // If no error and we have user data, return it
          if (res.ok && user) {
            return user;
          }
          return null;
        } catch (err) {
          console.log("err :>> ", err);
        }
      },
    }),
  ],
  callbacks: {
    jwt: async ({ token, user }) => {
      // user is only available the first time a user signs in authorized

      if (user) {
        const tokenDecoded = jwtDecode(user.access_token);
        console.log("tokenDecoded :>> ", tokenDecoded);
        return {
          accessToken: user.access_token,
          expiryTime: tokenDecoded.exp,
          ...tokenDecoded,
        };
      }
      console.log("token :>> ", token);
      return token;
    },
    session: async ({ session, token }) => {
      console.log("token session :>> ", token);
      if (isTokenExpired(token)) return null;
      if (token) {
        session.accessToken = token.accessToken;
      }
      return session;
    },
  },
};
const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
