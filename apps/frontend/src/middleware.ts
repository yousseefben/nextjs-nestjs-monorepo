import { withAuth } from "next-auth/middleware";
import { isTokenExpired } from "./helper/auth";
import { ROUTES } from "./constants/routes";

export default withAuth({
  callbacks: {
    authorized: ({ token }) => {
      return !isTokenExpired(token);
    },
  },
  pages: {
    signIn: ROUTES.LOGIN,
  },
});

export const config = {
  matcher: ["/", "/profile"],
};
