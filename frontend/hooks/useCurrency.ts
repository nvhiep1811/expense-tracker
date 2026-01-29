import { useMemo } from "react";

/**
 * Custom hook for formatting currency
 * @param currency - The currency code (default: VND)
 * @param locale - The locale string (default: vi-VN)
 */
export function useCurrency(currency = "VND", locale = "vi-VN") {
  const formatCurrency = useMemo(() => {
    const formatter = new Intl.NumberFormat(locale, {
      style: "currency",
      currency,
    });
    return (amount: number) => formatter.format(amount);
  }, [currency, locale]);

  return formatCurrency;
}
