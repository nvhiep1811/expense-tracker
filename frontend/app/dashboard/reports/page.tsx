'use client';

import Header from '@/components/layout/Header';
import { DollarSign } from 'lucide-react';

export default function ReportsPage() {
  return (
    <>
      <Header title="Báo cáo" subtitle="Xem báo cáo tài chính chi tiết" />
      
      <main className="flex-1 overflow-y-auto p-8">
        <div className="text-center py-20">
          <DollarSign className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-600">Tính năng báo cáo đang phát triển</h3>
          <p className="text-gray-500 mt-2">Chúng tôi đang xây dựng tính năng này. Vui lòng quay lại sau!</p>
        </div>
      </main>
    </>
  );
}
