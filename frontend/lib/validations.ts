import { z } from "zod";

// Login form validation
export const loginSchema = z.object({
  email: z.string().min(1, "Email là bắt buộc").email("Email không hợp lệ"),
  password: z
    .string()
    .min(1, "Mật khẩu là bắt buộc")
    .min(8, "Mật khẩu phải có ít nhất 8 ký tự"),
});

export type LoginFormData = z.infer<typeof loginSchema>;

// Register form validation
export const registerSchema = z
  .object({
    name: z
      .string()
      .min(1, "Họ và tên là bắt buộc")
      .min(2, "Họ và tên phải có ít nhất 2 ký tự")
      .max(100, "Họ và tên không được quá 100 ký tự"),
    email: z.string().min(1, "Email là bắt buộc").email("Email không hợp lệ"),
    password: z
      .string()
      .min(1, "Mật khẩu là bắt buộc")
      .min(8, "Mật khẩu phải có ít nhất 8 ký tự")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])/,
        "Mật khẩu phải có ít nhất 1 chữ thường, 1 chữ hoa, 1 số và 1 ký tự đặc biệt (@$!%*?&#)"
      ),
    confirmPassword: z.string().min(1, "Xác nhận mật khẩu là bắt buộc"),
    terms: z.literal(true, {
      message: "Bạn phải đồng ý với điều khoản dịch vụ và chính sách bảo mật",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Mật khẩu không khớp",
    path: ["confirmPassword"],
  });

export type RegisterFormData = z.infer<typeof registerSchema>;

// Transaction form validation
export const transactionSchema = z.object({
  type: z.enum(["income", "expense"], {
    message: "Loại giao dịch không hợp lệ",
  }),
  amount: z
    .number({
      message: "Số tiền phải là số",
    })
    .positive("Số tiền phải lớn hơn 0"),
  category: z.string().min(1, "Danh mục là bắt buộc"),
  account: z.string().min(1, "Tài khoản là bắt buộc"),
  date: z.string().min(1, "Ngày là bắt buộc"),
  description: z.string().max(500, "Mô tả không được quá 500 ký tự").optional(),
});

export type TransactionFormData = z.infer<typeof transactionSchema>;

// Account form validation
export const accountSchema = z.object({
  name: z
    .string()
    .min(1, "Tên tài khoản là bắt buộc")
    .min(2, "Tên tài khoản phải có ít nhất 2 ký tự")
    .max(100, "Tên tài khoản không được quá 100 ký tự"),
  type: z.enum(["cash", "bank", "e_wallet", "credit_card"], {
    message: "Loại tài khoản không hợp lệ",
  }),
  balance: z
    .number({
      message: "Số dư phải là số",
    })
    .nonnegative("Số dư không được âm"),
  color: z.string().regex(/^#[0-9A-Fa-f]{6}$/, "Màu sắc không hợp lệ"),
});

export type AccountFormData = z.infer<typeof accountSchema>;

// Budget form validation
export const budgetSchema = z.object({
  category: z.string().min(1, "Danh mục là bắt buộc"),
  amount: z
    .number({
      message: "Số tiền phải là số",
    })
    .positive("Số tiền phải lớn hơn 0"),
  period: z.enum(["monthly", "quarterly", "yearly"], {
    message: "Kỳ hạn không hợp lệ",
  }),
});

export type BudgetFormData = z.infer<typeof budgetSchema>;

// Reset password form validation
export const resetPasswordSchema = z
  .object({
    newPassword: z
      .string()
      .min(1, "Mật khẩu mới là bắt buộc")
      .min(8, "Mật khẩu phải có ít nhất 8 ký tự")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])/,
        "Mật khẩu phải có ít nhất 1 chữ thường, 1 chữ hoa, 1 số và 1 ký tự đặc biệt (@$!%*?&#)"
      ),
    confirmPassword: z.string().min(1, "Xác nhận mật khẩu là bắt buộc"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Mật khẩu không khớp",
    path: ["confirmPassword"],
  });

export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;

// Forgot password form validation
export const forgotPasswordSchema = z.object({
  email: z.string().min(1, "Email là bắt buộc").email("Email không hợp lệ"),
});

export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;
