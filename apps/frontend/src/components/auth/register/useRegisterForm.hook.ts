import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { RegisterFormType } from "./registerForm.schema";
import { useState } from "react";

const PHOTO_FIELS = "photos";

export const useRegisterForm = () => {
  const router = useRouter();
  const [isSuccessful, setIsSuccessful] = useState(false);
  const { setError } = useForm<RegisterFormType>();

  const onSubmit = async (data: RegisterFormType) => {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (key !== PHOTO_FIELS) {
        formData.append(key, value);
      }
    });

    Array.from<File>(data.photos).forEach((photo: File) =>
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
        setIsSuccessful(true);
      }
    } catch (error) {
      console.error("Registration error:", error);
    }
  };

  return { onSubmit, isSuccessful };
};
