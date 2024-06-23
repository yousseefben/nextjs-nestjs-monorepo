import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation"; // Corrected from 'next/navigation'
import { ROUTES } from "@frontend/src/constants/routes";
import { RegisterFormType, registerSchema } from "./registerForm.schema";

const PHOTO_FIELS = "photos";

export const useRegisterForm = () => {
  const router = useRouter();
  const { setError } = useForm<RegisterFormType>();

  const onSubmit = async (data: RegisterFormType) => {
    console.log("data :>> ", data);
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (key !== PHOTO_FIELS) {
        formData.append(key, value);
      }
    });

    Array.from(data.photos).forEach((photo: any) =>
      formData.append(PHOTO_FIELS, photo)
    );

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/register`,
        {
          method: "POST",
          body: formData,
        }
      );
      const result = await response.json();

      if (result.error) {
        result.message?.forEach(
          (err: { property: keyof RegisterFormType; message: string }) =>
            setError(err.property, {
              type: "server",
              message: err.message,
            })
        );
      } else {
        router.push(ROUTES.LOGIN);
      }
    } catch (error) {
      console.error("Registration error:", error);
    }
  };

  return { onSubmit };
};
