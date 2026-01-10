"use client";

import { Wallet, Menu, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function GuestNav() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-md border-b border-gray-200 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center space-x-2">
            <Wallet className="w-8 h-8 text-blue-600" />
            <span className="text-xl font-bold text-gray-800">MoneyTrack</span>
          </Link>

          <div className="hidden md:flex items-center space-x-8">
            <Link
              href="/#features"
              className="text-gray-600 hover:text-gray-900 font-medium"
            >
              Tính năng
            </Link>
            <Link
              href="/#pricing"
              className="text-gray-600 hover:text-gray-900 font-medium"
            >
              Bảng giá
            </Link>
            <Link
              href="/#about"
              className="text-gray-600 hover:text-gray-900 font-medium"
            >
              Về chúng tôi
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-4">
            <Link
              href="/login"
              className="text-gray-600 hover:text-gray-900 font-medium"
            >
              Đăng nhập
            </Link>
            <Link
              href="/register"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              Đăng ký
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-gray-600 hover:text-gray-900"
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200">
          <div className="px-4 py-4 space-y-3">
            <Link
              href="/#features"
              className="block text-gray-600 hover:text-gray-900 font-medium py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              Tính năng
            </Link>
            <Link
              href="/#pricing"
              className="block text-gray-600 hover:text-gray-900 font-medium py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              Bảng giá
            </Link>
            <Link
              href="/#about"
              className="block text-gray-600 hover:text-gray-900 font-medium py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              Về chúng tôi
            </Link>
            <div className="pt-3 border-t border-gray-200 space-y-2">
              <Link
                href="/login"
                className="block text-center py-2 text-gray-600 hover:text-gray-900 font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                Đăng nhập
              </Link>
              <Link
                href="/register"
                className="block text-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                onClick={() => setMobileMenuOpen(false)}
              >
                Đăng ký
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
