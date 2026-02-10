import { ChevronLeft, ChevronRight } from "lucide-react";
import type { PaginationMeta } from "@/types";

interface PaginationProps {
  pagination: PaginationMeta;
  page: number;
  limit: number;
  onPageChange: (page: number) => void;
  onLimitChange: (limit: number) => void;
  itemName?: string;
}

export default function Pagination({
  pagination,
  page,
  limit,
  onPageChange,
  onLimitChange,
  itemName = "mục",
}: PaginationProps) {
  return (
    <div className="flex flex-col sm:flex-row items-center justify-between px-6 py-4 border-t border-card-border gap-4">
      <div className="flex items-center gap-2 text-sm text-muted-text">
        <span>Hiển thị</span>
        <select
          value={limit}
          onChange={(e) => {
            onLimitChange(Number(e.target.value));
            onPageChange(1);
          }}
          className="px-2 py-1 border border-input-border rounded bg-input-bg text-foreground"
        >
          <option value={10}>10</option>
          <option value={20}>20</option>
          <option value={50}>50</option>
          <option value={100}>100</option>
        </select>
        <span>
          / {pagination.total} {itemName}
        </span>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={() => onPageChange(Math.max(1, page - 1))}
          disabled={page === 1}
          className="p-2 rounded-lg border border-input-border hover:bg-hover-bg disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <span className="text-sm text-muted-text">
          Trang {pagination.page} / {pagination.totalPages}
        </span>
        <button
          onClick={() =>
            onPageChange(Math.min(pagination.totalPages, page + 1))
          }
          disabled={page === pagination.totalPages}
          className="p-2 rounded-lg border border-input-border hover:bg-hover-bg disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
