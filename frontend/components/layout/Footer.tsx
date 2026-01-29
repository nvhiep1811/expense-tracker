"use client";

import { Heart, Mail, Phone } from "lucide-react";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* About */}
          <div>
            <h3 className="text-white text-lg font-semibold mb-4">
              MoneyTrack
            </h3>
            <p className="text-sm text-gray-400">
              Ứng dụng quản lý chi tiêu thông minh, giúp bạn kiểm soát tài chính
              cá nhân hiệu quả.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white text-lg font-semibold mb-4">Liên kết</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/about"
                  className="text-sm hover:text-white transition"
                >
                  Về chúng tôi
                </Link>
              </li>
              <li>
                <Link
                  href="/features"
                  className="text-sm hover:text-white transition"
                >
                  Tính năng
                </Link>
              </li>
              <li>
                <Link
                  href="/pricing"
                  className="text-sm hover:text-white transition"
                >
                  Bảng giá
                </Link>
              </li>
              <li>
                <Link
                  href="/blog"
                  className="text-sm hover:text-white transition"
                >
                  Blog
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-white text-lg font-semibold mb-4">Hỗ trợ</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/help"
                  className="text-sm hover:text-white transition"
                >
                  Trung tâm trợ giúp
                </Link>
              </li>
              <li>
                <Link
                  href="/faq"
                  className="text-sm hover:text-white transition"
                >
                  Câu hỏi thường gặp
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-sm hover:text-white transition"
                >
                  Liên hệ
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy"
                  className="text-sm hover:text-white transition"
                >
                  Chính sách bảo mật
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white text-lg font-semibold mb-4">Liên hệ</h3>
            <ul className="space-y-3">
              <li className="flex items-center space-x-2">
                <Mail className="w-4 h-4" />
                <span className="text-sm">nguyenvohiep.29122004@gmail.com</span>
              </li>
              <li className="flex items-center space-x-2">
                <Phone className="w-4 h-4" />
                <span className="text-sm">0896 xx xxxx</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-4 pt-4 flex flex-col md:flex-row items-center justify-between">
          <p className="text-sm text-gray-400">
            © 2026 MoneyTrack. All rights reserved.
          </p>
          <p className="text-sm text-gray-400 flex items-center mt-4 md:mt-0">
            Made with <Heart className="w-4 h-4 mx-1 text-red-500" /> in Vietnam
          </p>
        </div>
      </div>
    </footer>
  );
}
