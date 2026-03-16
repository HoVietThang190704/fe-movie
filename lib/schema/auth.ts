import z from "zod";

const passwordSchema = z
  .string()
  .min(8, "Mật khẩu phải có ít nhất 8 ký tự")
  .max(100, "Mật khẩu quá dài")
  .regex(/[a-z]/, "Cần ít nhất một chữ cái thường")
  .regex(/[A-Z]/, "Cần ít nhất một chữ cái viết hoa") // Ít nhất 1 chữ hoa
  .regex(/[0-9]/, "Cần ít nhất một chữ số") // Ít nhất 1 số
  .regex(/[^a-zA-Z0-9]/, "Cần ít nhất một ký tự đặc biệt"); // Ít nhất 1 ký tự đặc biệt

// Schema đăng nhập tổng quát
export const loginSchema = z.object({
  email: z.email("Email không hợp lệ"), // Kiểm tra định dạng email
  password: passwordSchema,
});

export const registerSchema = z
  .object({
    email: z.email("Email không hợp lệ"), // Kiểm tra định dạng email
    password: passwordSchema,
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Mật khẩu xác nhận không khớp",
  });