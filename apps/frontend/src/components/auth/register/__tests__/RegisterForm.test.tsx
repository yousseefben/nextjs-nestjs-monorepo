import React from "react";
import { render, screen } from "@testing-library/react";
import RegisterForm from "../RegisterForm";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRegisterForm } from "../useRegisterForm.hook";
import { useRouter } from "next/navigation";

jest.mock("react-hook-form");
jest.mock("@hookform/resolvers/zod");
jest.mock("../useRegisterForm.hook");
jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));
jest.mock("@frontend/src/helper/fetcher");

describe("RegisterForm", () => {
  const mockPush = jest.fn();

  beforeEach(() => {
    (useForm as jest.Mock).mockReturnValue({
      handleSubmit: jest.fn((fn) => fn),
      register: jest.fn(),
      formState: {
        errors: {},
        isSubmitting: false,
      },
    });

    (useRegisterForm as jest.Mock).mockReturnValue({
      onSubmit: jest.fn(),
    });

    (useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
    });

    (zodResolver as jest.Mock).mockImplementation((schema) => schema);
  });

  test("renders the form fields correctly", () => {
    render(<RegisterForm />);

    expect(screen.getByLabelText(/Fristname/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Lastname/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/E-mail/i)).toBeInTheDocument();
    expect(screen.getByLabelText("Password")).toBeInTheDocument();
    expect(screen.getByLabelText(/Confirm password/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Upload photos/i)).toBeInTheDocument();
  });

  test("shows error messages when fields are invalid", async () => {
    (useForm as jest.Mock).mockReturnValue({
      handleSubmit: jest.fn((fn) => fn),
      register: jest.fn(),
      formState: {
        errors: {
          firstName: { message: "First name is required" },
          lastName: { message: "Last name is required" },
          email: { message: "Email is required" },
          password: { message: "Password is required" },
          confirmPassword: { message: "Confirm password is required" },
          photos: { message: "Photos are required" },
        },
        isSubmitting: false,
      },
    });

    render(<RegisterForm />);

    expect(
      await screen.findByText(/First name is required/i)
    ).toBeInTheDocument();
    expect(
      await screen.findByText(/Last name is required/i)
    ).toBeInTheDocument();
    expect(await screen.findByText(/Email is required/i)).toBeInTheDocument();
    expect(await screen.findByText("Password is required")).toBeInTheDocument();
    expect(
      await screen.findByText(/Confirm password is required/i)
    ).toBeInTheDocument();
    expect(await screen.findByText(/Photos are required/i)).toBeInTheDocument();
  });
});
