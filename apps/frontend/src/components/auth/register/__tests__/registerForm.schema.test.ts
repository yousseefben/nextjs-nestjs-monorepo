import { registerSchema } from "../registerForm.schema"; // Adjust the import path as necessary
describe("registerSchema", () => {
  it("should pass validation with valid data", () => {
    const validData = {
      firstName: "John",
      lastName: "Doe",
      email: "john.doe@example.com",
      password: "Password1",
      confirmPassword: "Password1",
      photos: [
        { name: "photo1.jpg", type: "image/jpeg", size: 1000000 },
        { name: "photo2.jpg", type: "image/jpeg", size: 1500000 },
        { name: "photo3.jpg", type: "image/jpeg", size: 2000000 },
        { name: "photo4.jpg", type: "image/jpeg", size: 2500000 },
      ],
    };

    const result = registerSchema.safeParse(validData);
    expect(result.success).toBe(true);
  });

  it("should fail validation if firstName is too short", () => {
    const invalidData = {
      firstName: "J",
      lastName: "Doe",
      email: "john.doe@example.com",
      password: "Password1",
      confirmPassword: "Password1",
      photos: [
        { name: "photo1.jpg", type: "image/jpeg", size: 1000000 },
        { name: "photo2.jpg", type: "image/jpeg", size: 1500000 },
        { name: "photo3.jpg", type: "image/jpeg", size: 2000000 },
        { name: "photo4.jpg", type: "image/jpeg", size: 2500000 },
      ],
    };

    const result = registerSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
    expect(result.error.issues[0].message).toBe("min 8");
  });

  it("should fail validation if less than 4 photos are provided", () => {
    const invalidData = {
      firstName: "John",
      lastName: "Doe",
      email: "john.doe@example.com",
      password: "Password1",
      confirmPassword: "Password1",
      photos: [
        { name: "photo1.jpg", type: "image/jpeg", size: 1000000 },
        { name: "photo2.jpg", type: "image/jpeg", size: 1500000 },
      ],
    };

    const result = registerSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
    expect(result.error.issues[0].message).toBe(
      "At least 4 files are required."
    );
  });

  it("should fail validation if passwords do not match", () => {
    const invalidData = {
      firstName: "John",
      lastName: "Doe",
      email: "john.doe@example.com",
      password: "Password1",
      confirmPassword: "DifferentPassword",
      photos: [
        { name: "photo1.jpg", type: "image/jpeg", size: 1000000 },
        { name: "photo2.jpg", type: "image/jpeg", size: 1500000 },
        { name: "photo3.jpg", type: "image/jpeg", size: 2000000 },
        { name: "photo4.jpg", type: "image/jpeg", size: 2500000 },
      ],
    };

    const result = registerSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
    expect(result.error.issues[0].message).toBe("Passwords do not match");
  });

  it("should fail validation if any photo size exceeds 5MB", () => {
    const invalidData = {
      firstName: "John",
      lastName: "Doe",
      email: "john.doe@example.com",
      password: "Password1",
      confirmPassword: "Password1",
      photos: [
        { name: "photo1.jpg", type: "image/jpeg", size: 10000000 }, // 10MB, exceeds limit
        { name: "photo2.jpg", type: "image/jpeg", size: 1500000 },
        { name: "photo3.jpg", type: "image/jpeg", size: 2000000 },
        { name: "photo4.jpg", type: "image/jpeg", size: 2500000 },
      ],
    };

    const result = registerSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
    expect(result.error.issues[0].message).toBe(
      "Each file must be at most 5MB."
    );
  });

  it("should fail validation if any photo type is not supported", () => {
    const invalidData = {
      firstName: "John",
      lastName: "Doe",
      email: "john.doe@example.com",
      password: "Password1",
      confirmPassword: "Password1",
      photos: [
        { name: "photo1.jpg", type: "image/jpeg", size: 1000000 },
        { name: "photo2.jpg", type: "image/gif", size: 1500000 }, // Unsupported type
        { name: "photo3.jpg", type: "image/jpeg", size: 2000000 },
        { name: "photo4.jpg", type: "image/jpeg", size: 2500000 },
      ],
    };

    const result = registerSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
    expect(result.error.issues[0].message).toBe(
      "Only .jpg, .jpeg, .png, and .webp formats are supported."
    );
  });
});
