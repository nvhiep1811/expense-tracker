import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Utility function để merge Tailwind CSS classes
 * Kết hợp clsx (conditional classes) với tailwind-merge (resolve conflicts)
 *
 * @example
 * cn("px-4 py-2", condition && "bg-blue-500", "px-6")
 * // Result: "py-2 px-6 bg-blue-500" (px-6 overrides px-4)
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
