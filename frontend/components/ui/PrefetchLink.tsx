"use client";

import Link, { LinkProps } from "next/link";
import { ReactNode, useCallback } from "react";
import { usePrefetch } from "@/hooks/usePrefetch";

type PrefetchTarget =
  | "accounts"
  | "categories"
  | "transactions"
  | "budgets"
  | "dashboard";

interface PrefetchLinkProps extends LinkProps {
  children: ReactNode;
  className?: string;
  prefetchData?: PrefetchTarget;
  onClick?: () => void;
}

/**
 * Link component với data prefetching
 * Prefetch React Query data khi hover để navigation nhanh hơn
 *
 * @example
 * <PrefetchLink href="/dashboard/accounts" prefetchData="accounts">
 *   Tài khoản
 * </PrefetchLink>
 */
export function PrefetchLink({
  children,
  className,
  prefetchData,
  onClick,
  ...props
}: PrefetchLinkProps) {
  const prefetch = usePrefetch();

  const handleMouseEnter = useCallback(() => {
    if (prefetchData) {
      prefetch(prefetchData);
    }
  }, [prefetch, prefetchData]);

  return (
    <Link
      {...props}
      className={className}
      onMouseEnter={handleMouseEnter}
      onClick={onClick}
    >
      {children}
    </Link>
  );
}
