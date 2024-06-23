import { FormFieldProps } from "./form.types";

const FormField: React.FC<FormFieldProps> = ({
  type,
  placeholder,
  name,
  register,
  error,
  label,
  valueAsNumber,
}) => (
  <>
    <label
      htmlFor={name}
      className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
    >
      {label}
    </label>

    <input
      id={name}
      type={type}
      placeholder={placeholder}
      {...register(name, { valueAsNumber })}
      className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
      required
    />
    {error && (
      <p className="mt-2 text-sm text-red-600 dark:text-red-500">
        <span className="font-medium">{error.message}</span>
      </p>
    )}
  </>
);
export default FormField;
