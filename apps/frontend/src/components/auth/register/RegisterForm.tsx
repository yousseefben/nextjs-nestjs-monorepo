"use client";

import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { RegisterFormType, registerSchema } from "./registerForm.schema";
import FormField from "../../FormField/FormField";
import { getSession } from "next-auth/react";
import fetcher from "@frontend/src/helper/fetcher";
import { ROUTES } from "@frontend/src/constants/routes";
import { useRouter } from "next/navigation";
import { useRegisterForm } from "./useRegisterForm.hook";

const RegisterForm = () => {
  // const {
  //   handleSubmit,
  //   register,
  //   formState: { errors, isSubmitting, isDirty, isValid },
  //   setError,
  // } = useForm<RegisterFormType>({
  //   resolver: zodResolver(registerSchema),
  //   reValidateMode: "onChange",
  // });

  // const router = useRouter();
  // async function onSubmit(data: RegisterFormType) {
  //   console.log(isSubmitting);
  //   console.log(data);
  //   const formdata = new FormData();
  //   for (const key in data) {
  //     console.log("key :>> ", key, data[key]);
  //     if (key !== "photos") formdata.append(key, data[key]);
  //   }
  //   Array.from(data.photos).forEach((photo) =>
  //     formdata.append("photos", photo)
  //   );
  //   const requestOptions = {
  //     method: "POST",
  //     body: formdata,
  //   };

  //   fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/register`, requestOptions)
  //     .then((response) => response.json())
  //     .then((result) => {
  //       if (result.error) {
  //         result.message?.forEach((err) =>
  //           setError(err.property, {
  //             type: "server",
  //             message: err.message,
  //           })
  //         );
  //       } else {
  //         router.push(ROUTES.LOGIN);
  //       }
  //     })

  //     .catch((error) => {
  //       console.error("err", error);
  //     });
  // }
  // console.log("errors :>> ", errors);
  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormType>({
    resolver: zodResolver(registerSchema),
    mode: "onChange",
  });

  const { onSubmit } = useRegisterForm();

  return (
    <section className="bg-gray-50 dark:bg-gray-900">
      <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
        <a
          href="#"
          className="flex items-center mb-6 text-2xl font-semibold text-gray-900 dark:text-white"
        >
          Register
        </a>
        <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
            <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
              Create an account
            </h1>
            <form
              className="space-y-4 md:space-y-6"
              action="#"
              method="POST"
              onSubmit={handleSubmit(onSubmit)}
            >
              <div>
                <FormField
                  name="firstName"
                  error={errors.firstName}
                  label="Fristname"
                  register={register}
                  type="text"
                  placeholder="Fill your firstname"
                />
              </div>
              <div>
                <FormField
                  name="lastName"
                  error={errors.lastName}
                  label="Lastname"
                  register={register}
                  type="text"
                  placeholder="Fill your lastname"
                />
              </div>
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
              <div>
                <FormField
                  name="confirmPassword"
                  error={errors.confirmPassword}
                  label="Confirm password"
                  register={register}
                  type="password"
                  placeholder="Confirm your password"
                />
              </div>
              <div>
                <label
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  htmlFor="photos"
                >
                  Upload photos
                </label>
                <input
                  {...register("photos")}
                  className="block w-full mb-5 text-xs text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
                  id="photos"
                  type="file"
                  multiple
                />
                {errors?.photos && (
                  <p className="mt-2 text-sm text-red-600 dark:text-red-500">
                    <span className="font-medium">
                      {errors?.photos.message}
                    </span>
                  </p>
                )}
              </div>

              <button
                type="submit"
                className="w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
                // disabled={!isDirty || !isValid || isSubmitting}
              >
                {isSubmitting ? "Submitting.." : "Sign In"}
              </button>
              <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                Already have an account?{" "}
                <a
                  href={ROUTES.LOGIN}
                  className="font-medium text-primary-600 hover:underline dark:text-primary-500"
                >
                  Login here
                </a>
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default RegisterForm;
