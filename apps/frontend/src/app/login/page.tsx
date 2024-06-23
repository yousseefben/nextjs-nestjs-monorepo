import LoginForm from "@frontend/src/components/auth/login/LoginForm";
import React from "react";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import fetcher from "@frontend/src/helper/fetcher";
import { ROUTES } from "@frontend/src/constants/routes";

const Login = async () => {
  const session = await getServerSession(authOptions);
  if (session) redirect(ROUTES.PROFILE);
  return <LoginForm />;
};

export default Login;
