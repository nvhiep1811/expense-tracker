"use client";

import Header from "@/components/layout/Header";
import { Target } from "lucide-react";

export default function BudgetsPage() {
  return (
    <>
      <Header title="Ngân sách" subtitle="Quản lý ngân sách của bạn" />

      <main className="flex-1 overflow-y-auto p-8">
        <div className="text-center py-20">
          <Target className="w-16 h-16 text-muted-text mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-muted-text">
            Tính năng ngân sách đang phát triển
          </h3>
          <p className="text-muted-text mt-2">
            Chúng tôi đang xây dựng tính năng này. Vui lòng quay lại sau!
          </p>
        </div>
      </main>
    </>
  );
}
