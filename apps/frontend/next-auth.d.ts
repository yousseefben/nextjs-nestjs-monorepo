import "next-auth";

declare module "next-auth" {
  interface Session {
    accessToken?: string;
    error?: string;
  }
  interface User {
    access_token?: string;
  }
}
declare module "next-auth/jwt" {
  interface JWT {
    accessToken?: string;
    expiryTime?: number;
  }
}
