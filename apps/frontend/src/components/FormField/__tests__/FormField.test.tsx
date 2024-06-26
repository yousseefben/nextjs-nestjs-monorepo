import React from "react";
import { render, screen } from "@testing-library/react";
import FormField from "../FormField";
import { FormFieldProps } from "../form.types";
import { UseFormRegister } from "react-hook-form";

const mockRegister: UseFormRegister<any> = jest.fn<any, any[]>(() => ({
  name: "test",
  onBlur: jest.fn(),
  onChange: jest.fn(),
  ref: jest.fn(),
}));

const defaultProps: FormFieldProps = {
  type: "text",
  placeholder: "Enter text",
  name: "testField",
  register: mockRegister,
  label: "Test Field",
  error: undefined,
};

describe("FormField Component", () => {
  test("renders with default props", () => {
    render(<FormField {...defaultProps} />);
    expect(screen.getByLabelText(/Test Field/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Enter text/i)).toBeInTheDocument();
  });

  test("renders with error message", () => {
    const errorProps: FormFieldProps = {
      ...defaultProps,
      error: { message: "This field is required" } as any,
    };
    render(<FormField {...errorProps} />);
    expect(screen.getByText(/This field is required/i)).toBeInTheDocument();
  });

  test("renders with type number and valueAsNumber", () => {
    const numberProps: FormFieldProps = {
      ...defaultProps,
      type: "number",
      valueAsNumber: true,
      placeholder: "Enter number",
    };
    render(<FormField {...numberProps} />);
    expect(screen.getByLabelText(/Test Field/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Enter number/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Test Field/i)).toHaveAttribute(
      "type",
      "number"
    );
  });

  test("renders with different label", () => {
    const labelProps: FormFieldProps = {
      ...defaultProps,
      label: "New Label",
    };
    render(<FormField {...labelProps} />);
    expect(screen.getByLabelText(/New Label/i)).toBeInTheDocument();
  });

  test("renders with different placeholder", () => {
    const placeholderProps: FormFieldProps = {
      ...defaultProps,
      placeholder: "New Placeholder",
    };
    render(<FormField {...placeholderProps} />);
    expect(screen.getByPlaceholderText(/New Placeholder/i)).toBeInTheDocument();
  });

  test("register function is called with correct name and valueAsNumber", () => {
    const registerProps: FormFieldProps = {
      ...defaultProps,
      valueAsNumber: true,
    };
    render(<FormField {...registerProps} />);
    expect(mockRegister).toHaveBeenCalledWith(registerProps.name, {
      valueAsNumber: registerProps.valueAsNumber,
    });
  });

  test("renders with type password", () => {
    const passwordProps: FormFieldProps = {
      ...defaultProps,
      type: "password",
      placeholder: "Enter password",
    };
    render(<FormField {...passwordProps} />);
    expect(screen.getByLabelText(/Test Field/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Enter password/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Test Field/i)).toHaveAttribute(
      "type",
      "password"
    );
  });

  test("renders with type email", () => {
    const emailProps: FormFieldProps = {
      ...defaultProps,
      type: "email",
      placeholder: "Enter email",
    };
    render(<FormField {...emailProps} />);
    expect(screen.getByLabelText(/Test Field/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Enter email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Test Field/i)).toHaveAttribute(
      "type",
      "email"
    );
  });
});
