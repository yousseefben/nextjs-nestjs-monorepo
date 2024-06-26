import { JWT } from "next-auth/jwt";

export const isTokenExpired = (token: JWT | null) => {
  return !token?.expiryTime || token.expiryTime < Date.now() / 1000;
};
