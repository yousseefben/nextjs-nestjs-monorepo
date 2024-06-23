import "next-auth";

declare module "next-auth" {
  interface Session {
    accessToken?: string;
  }
  interface User {
    access_token?: string;
  }
  interface JWT {
    accessToken?: string;
    expiryTime?: number;
  }
}
