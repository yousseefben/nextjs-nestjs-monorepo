import { FieldError, UseFormRegister } from "react-hook-form";

export type FormFieldProps = {
  type: string;
  label: string;
  placeholder: string;
  name: string;
  register: UseFormRegister<any>;
  error: FieldError | undefined;
  valueAsNumber?: boolean;
};
