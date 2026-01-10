"use client";

interface PasswordStrengthMeterProps {
  password: string;
}

interface StrengthResult {
  strength: number; // 0-4
  label: string;
  color: string;
  bgColor: string;
  textColor: string;
  checks: {
    length: boolean;
    lowercase: boolean;
    uppercase: boolean;
    number: boolean;
    special: boolean;
  };
}

export default function PasswordStrengthMeter({
  password,
}: PasswordStrengthMeterProps) {
  const calculateStrength = (pwd: string): StrengthResult => {
    const checks = {
      length: pwd.length >= 8,
      lowercase: /[a-z]/.test(pwd),
      uppercase: /[A-Z]/.test(pwd),
      number: /\d/.test(pwd),
      special: /[@$!%*?&#]/.test(pwd),
    };

    const score = Object.values(checks).filter(Boolean).length;

    if (score === 0 || pwd.length === 0) {
      return {
        strength: 0,
        label: "",
        color: "",
        bgColor: "",
        textColor: "",
        checks,
      };
    }

    if (score <= 2) {
      return {
        strength: 1,
        label: "Yếu",
        color: "bg-red-500",
        bgColor: "bg-red-100",
        textColor: "text-red-700",
        checks,
      };
    }

    if (score === 3) {
      return {
        strength: 2,
        label: "Trung bình",
        color: "bg-yellow-500",
        bgColor: "bg-yellow-100",
        textColor: "text-yellow-700",
        checks,
      };
    }

    if (score === 4) {
      return {
        strength: 3,
        label: "Khá",
        color: "bg-blue-500",
        bgColor: "bg-blue-100",
        textColor: "text-blue-700",
        checks,
      };
    }

    return {
      strength: 4,
      label: "Mạnh",
      color: "bg-green-500",
      bgColor: "bg-green-100",
      textColor: "text-green-700",
      checks,
    };
  };

  const result = calculateStrength(password);

  if (!password || password.length === 0) {
    return null;
  }

  return (
    <div className="mt-2 space-y-2">
      {/* Strength Bar */}
      <div className="flex gap-1">
        {[1, 2, 3, 4].map((level) => (
          <div
            key={level}
            className={`h-1.5 flex-1 rounded-full transition-colors ${
              level <= result.strength ? result.color : "bg-gray-200"
            }`}
          />
        ))}
      </div>

      {/* Strength Label */}
      {result.label && (
        <div className="flex items-center justify-between">
          <span className={`text-xs font-medium ${result.textColor}`}>
            Độ mạnh: {result.label}
          </span>
        </div>
      )}

      {/* Requirements Checklist */}
      <div className="text-xs space-y-1 mt-3">
        <p className="font-medium text-gray-700 mb-2">Yêu cầu mật khẩu:</p>
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div
              className={`w-4 h-4 rounded-full flex items-center justify-center ${
                result.checks.length ? "bg-green-500 text-white" : "bg-gray-200"
              }`}
            >
              {result.checks.length && (
                <svg
                  className="w-3 h-3"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={3}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              )}
            </div>
            <span
              className={
                result.checks.length ? "text-green-700" : "text-gray-500"
              }
            >
              Ít nhất 8 ký tự
            </span>
          </div>

          <div className="flex items-center gap-2">
            <div
              className={`w-4 h-4 rounded-full flex items-center justify-center ${
                result.checks.lowercase
                  ? "bg-green-500 text-white"
                  : "bg-gray-200"
              }`}
            >
              {result.checks.lowercase && (
                <svg
                  className="w-3 h-3"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={3}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              )}
            </div>
            <span
              className={
                result.checks.lowercase ? "text-green-700" : "text-gray-500"
              }
            >
              Chữ thường (a-z)
            </span>
          </div>

          <div className="flex items-center gap-2">
            <div
              className={`w-4 h-4 rounded-full flex items-center justify-center ${
                result.checks.uppercase
                  ? "bg-green-500 text-white"
                  : "bg-gray-200"
              }`}
            >
              {result.checks.uppercase && (
                <svg
                  className="w-3 h-3"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={3}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              )}
            </div>
            <span
              className={
                result.checks.uppercase ? "text-green-700" : "text-gray-500"
              }
            >
              Chữ hoa (A-Z)
            </span>
          </div>

          <div className="flex items-center gap-2">
            <div
              className={`w-4 h-4 rounded-full flex items-center justify-center ${
                result.checks.number ? "bg-green-500 text-white" : "bg-gray-200"
              }`}
            >
              {result.checks.number && (
                <svg
                  className="w-3 h-3"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={3}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              )}
            </div>
            <span
              className={
                result.checks.number ? "text-green-700" : "text-gray-500"
              }
            >
              Số (0-9)
            </span>
          </div>

          <div className="flex items-center gap-2">
            <div
              className={`w-4 h-4 rounded-full flex items-center justify-center ${
                result.checks.special
                  ? "bg-green-500 text-white"
                  : "bg-gray-200"
              }`}
            >
              {result.checks.special && (
                <svg
                  className="w-3 h-3"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={3}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              )}
            </div>
            <span
              className={
                result.checks.special ? "text-green-700" : "text-gray-500"
              }
            >
              Ký tự đặc biệt (@$!%*?&#)
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
