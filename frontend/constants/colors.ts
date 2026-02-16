/**
 * Centralized color palettes for the application
 * Organized by hue groups for visual consistency
 */

// Account colors - 32 colors for financial institutions
export const ACCOUNT_COLORS = [
  // Blues (8) - Professional, trustworthy
  "#3B82F6",
  "#2563EB",
  "#1D4ED8",
  "#0EA5E9",
  "#06B6D4",
  "#0891B2",
  "#0284C7",
  "#38BDF8",
  // Greens (8) - Growth, money
  "#10B981",
  "#059669",
  "#047857",
  "#22C55E",
  "#16A34A",
  "#14B8A6",
  "#0D9488",
  "#84CC16",
  // Warm colors (8) - Energy, attention
  "#F59E0B",
  "#D97706",
  "#F97316",
  "#EA580C",
  "#EF4444",
  "#DC2626",
  "#EAB308",
  "#CA8A04",
  // Purples & Pinks (8) - Creative, premium
  "#8B5CF6",
  "#7C3AED",
  "#6366F1",
  "#4F46E5",
  "#A855F7",
  "#9333EA",
  "#EC4899",
  "#DB2777",
] as const;

// Category colors - 40 colors for expense/income categories
export const CATEGORY_COLORS = [
  // Greens (8)
  "#10B981",
  "#059669",
  "#047857",
  "#34D399",
  "#22C55E",
  "#16A34A",
  "#84CC16",
  "#65A30D",
  // Blues & Cyans (8)
  "#3B82F6",
  "#2563EB",
  "#0EA5E9",
  "#0891B2",
  "#06B6D4",
  "#14B8A6",
  "#0D9488",
  "#38BDF8",
  // Purples & Pinks (8)
  "#8B5CF6",
  "#7C3AED",
  "#A855F7",
  "#9333EA",
  "#6366F1",
  "#4F46E5",
  "#EC4899",
  "#DB2777",
  // Oranges & Reds (8)
  "#F97316",
  "#EA580C",
  "#EF4444",
  "#DC2626",
  "#F43F5E",
  "#E11D48",
  "#FB7185",
  "#FDA4AF",
  // Yellows & Ambers (8)
  "#EAB308",
  "#CA8A04",
  "#F59E0B",
  "#D97706",
  "#FBBF24",
  "#FCD34D",
  "#FDE047",
  "#FEF08A",
] as const;

// Budget colors - subset focused on status indication
export const BUDGET_COLORS = [
  "#10B981", // Green - healthy
  "#3B82F6", // Blue - info
  "#F59E0B", // Amber - warning
  "#EF4444", // Red - danger
  "#8B5CF6", // Purple - special
  "#06B6D4", // Cyan - cool
  "#EC4899", // Pink - highlight
  "#6366F1", // Indigo - primary
] as const;

// Default colors for quick selection
export const DEFAULT_ACCOUNT_COLOR = "#3B82F6";
export const DEFAULT_CATEGORY_COLOR = "#10B981";
export const DEFAULT_BUDGET_COLOR = "#3B82F6";

// Type exports
export type AccountColor = (typeof ACCOUNT_COLORS)[number];
export type CategoryColor = (typeof CATEGORY_COLORS)[number];
export type BudgetColor = (typeof BUDGET_COLORS)[number];

/**
 * Validate if a color is in the palette or is a valid hex color
 */
export function isValidHexColor(color: string): boolean {
  return /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(color);
}

/**
 * Get contrasting text color (white or black) for a background
 */
export function getContrastColor(hexColor: string): "#ffffff" | "#000000" {
  const hex = hexColor.replace("#", "");
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  // Using relative luminance formula
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.5 ? "#000000" : "#ffffff";
}
