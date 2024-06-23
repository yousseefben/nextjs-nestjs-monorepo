"use client";

import React, { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { LoginFormType } from "./loginForm.schema";
import FormField from "../../FormField/FormField";
import { loginSchema } from "./loginForm.schema";
import { signIn } from "next-auth/react";
import { ROUTES } from "@frontend/src/constants/routes";

const LoginForm = () => {
  const [error, setError] = useState<{ message?: string }>({});

  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormType>({
    resolver: zodResolver(loginSchema),
    reValidateMode: "onChange",
  });
  async function onSubmit(data: LoginFormType) {
    try {
      const signinResponse = await signIn("credentials", {
        ...data,
        callbackUrl: ROUTES.PROFILE,
      });
      if (!signinResponse) throw new Error("Error Signin");
      const { ok, error } = signinResponse;
      if (!ok && error === "CredentialsSignin")
        setError({ message: "Bad email or password !" });
    } catch (error) {
      setError({ message: "Error occured, try to signin later" });
    }
  }

  return (
    <section className="bg-gray-50 dark:bg-gray-900">
      <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
        <a
          href="#"
          className="flex items-center mb-6 text-2xl font-semibold text-gray-900 dark:text-white"
        >
          Signin
        </a>
        <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
          {error?.message && (
            <p className="mt-2 text-sm text-red-600 dark:text-red-500 text-center">
              <span className="font-medium">{error.message}</span>
            </p>
          )}
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
            <form
              className="space-y-4 md:space-y-6"
              action="#"
              method="POST"
              onSubmit={handleSubmit(onSubmit)}
            >
              <div>
                <FormField
                  name="email"
                  error={errors.email}
                  label="E-mail"
                  register={register}
                  type="email"
                  placeholder="Fill your email"
                />
              </div>
              <div>
                <FormField
                  name="password"
                  error={errors.password}
                  label="Password"
                  register={register}
                  type="password"
                  placeholder="Fill your password"
                />
              </div>
              <button
                type="submit"
                className="w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
              >
                {isSubmitting ? "Submitting.." : "Sign In"}
              </button>
              <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                Dont have an account?{" "}
                <a
                  href={ROUTES.REGISTER}
                  className="font-medium text-primary-600 hover:underline dark:text-primary-500"
                >
                  Register here
                </a>
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LoginForm;
