import { withAuth } from "next-auth/middleware";
import { ROUTES } from "./constants/routes";
import { isTokenExpired } from "./helper/utils";

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
