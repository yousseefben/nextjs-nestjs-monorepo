import LoginForm from "@frontend/src/components/auth/login/LoginForm";
import React from "react";
import { redirect } from "next/navigation";
import { ROUTES } from "@frontend/src/constants/routes";
import { getSession } from "@frontend/src/helper/auth";

const Login = async () => {
  const session = await getSession();
  if (session && !session?.error) redirect(ROUTES.PROFILE);
  return <LoginForm />;
};

export default Login;
