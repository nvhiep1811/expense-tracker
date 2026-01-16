import GuestNav from "@/components/layout/GuestNav";
import Footer from "@/components/layout/Footer";
import {
  Wallet,
  TrendingUp,
  Shield,
  Smartphone,
  Target,
  PieChart,
  CheckCircle,
} from "lucide-react";
import Link from "next/link";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <GuestNav />

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-800">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-6">
            Quản lý chi tiêu{" "}
            <span className="text-blue-600 dark:text-blue-400">thông minh</span>
          </h1>
          <p className="text-xl text-muted-text mb-8 max-w-3xl mx-auto">
            MoneyTrack giúp bạn kiểm soát tài chính cá nhân một cách dễ dàng.
            Theo dõi thu chi, đặt ngân sách và đạt được mục tiêu tài chính của
            bạn.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <Link
              href="/register"
              className="px-8 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold text-lg shadow-lg"
            >
              Bắt đầu miễn phí
            </Link>
            <Link
              href="/login"
              className="px-8 py-4 bg-card-bg text-foreground rounded-lg hover:bg-hover-bg transition font-semibold text-lg border-2 border-card-border"
            >
              Đăng nhập
            </Link>
          </div>

          {/* Hero Image/Illustration */}
          <div className="mt-16">
            <div className="bg-card-bg rounded-2xl shadow-2xl p-4 sm:p-8 max-w-5xl mx-auto border border-card-border">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white">
                  <Wallet className="w-8 h-8 mb-2" />
                  <p className="text-sm font-medium">Tổng tài sản</p>
                  <p className="text-2xl font-bold mt-2">32.470.000đ</p>
                </div>
                <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white">
                  <TrendingUp className="w-8 h-8 mb-2" />
                  <p className="text-sm font-medium">Thu nhập</p>
                  <p className="text-2xl font-bold mt-2">15.000.000đ</p>
                </div>
                <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-xl p-6 text-white sm:col-span-2 lg:col-span-1">
                  <Target className="w-8 h-8 mb-2" />
                  <p className="text-sm font-medium">Chi tiêu</p>
                  <p className="text-2xl font-bold mt-2">10.400.000đ</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section
        id="features"
        className="py-20 px-4 sm:px-6 lg:px-8 bg-background"
      >
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-4">
              Tính năng nổi bật
            </h2>
            <p className="text-xl text-muted-text">
              Tất cả những gì bạn cần để quản lý tài chính hiệu quả
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: PieChart,
                title: "Theo dõi chi tiêu",
                description:
                  "Ghi chép và phân loại mọi khoản chi tiêu của bạn một cách tự động và chính xác.",
                color:
                  "bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400",
              },
              {
                icon: Target,
                title: "Đặt ngân sách",
                description:
                  "Thiết lập ngân sách cho từng danh mục và nhận cảnh báo khi vượt mức.",
                color:
                  "bg-purple-100 dark:bg-purple-900/50 text-purple-600 dark:text-purple-400",
              },
              {
                icon: TrendingUp,
                title: "Báo cáo chi tiết",
                description:
                  "Xem biểu đồ và báo cáo trực quan về tình hình tài chính của bạn.",
                color:
                  "bg-green-100 dark:bg-green-900/50 text-green-600 dark:text-green-400",
              },
              {
                icon: Wallet,
                title: "Quản lý tài khoản",
                description:
                  "Theo dõi số dư của nhiều tài khoản ngân hàng, ví điện tử trong một nơi.",
                color:
                  "bg-orange-100 dark:bg-orange-900/50 text-orange-600 dark:text-orange-400",
              },
              {
                icon: Shield,
                title: "Bảo mật cao",
                description:
                  "Dữ liệu của bạn được mã hóa và bảo vệ với công nghệ bảo mật hiện đại.",
                color:
                  "bg-red-100 dark:bg-red-900/50 text-red-600 dark:text-red-400",
              },
              {
                icon: Smartphone,
                title: "Đa nền tảng",
                description:
                  "Truy cập từ mọi thiết bị - máy tính, tablet, điện thoại. Dữ liệu luôn đồng bộ.",
                color:
                  "bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400",
              },
            ].map((feature, idx) => (
              <div
                key={idx}
                className="bg-card-bg rounded-xl p-6 border-2 border-card-border hover:border-blue-400 dark:hover:border-blue-500 hover:shadow-lg transition"
              >
                <div
                  className={`w-12 h-12 rounded-lg ${feature.color} flex items-center justify-center mb-4`}
                >
                  <feature.icon className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  {feature.title}
                </h3>
                <p className="text-muted-text">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 px-4 sm:px-6 lg:px-8 bg-hover-bg">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-4">
              Bảng giá đơn giản
            </h2>
            <p className="text-xl text-muted-text">
              Chọn gói phù hợp với nhu cầu của bạn
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Free Plan */}
            <div className="bg-card-bg rounded-2xl p-8 border-2 border-card-border hover:border-blue-400 dark:hover:border-blue-500 transition">
              <h3 className="text-2xl font-bold text-foreground mb-2">
                Miễn phí
              </h3>
              <div className="mb-6">
                <span className="text-4xl font-bold text-foreground">0đ</span>
                <span className="text-muted-text">/tháng</span>
              </div>
              <ul className="space-y-4 mb-8">
                {[
                  "Theo dõi chi tiêu cơ bản",
                  "Tối đa 3 tài khoản",
                  "Báo cáo tháng",
                  "Hỗ trợ email",
                ].map((item, idx) => (
                  <li key={idx} className="flex items-center space-x-2">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span className="text-muted-text">{item}</span>
                  </li>
                ))}
              </ul>
              <Link
                href="/register"
                className="block w-full text-center px-6 py-3 bg-hover-bg text-foreground rounded-lg hover:bg-card-border transition font-semibold"
              >
                Bắt đầu
              </Link>
            </div>

            {/* Premium Plan */}
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-8 border-2 border-blue-600 shadow-xl transform scale-105">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-2xl font-bold text-white">Premium</h3>
                <span className="px-3 py-1 bg-yellow-400 text-yellow-900 rounded-full text-xs font-bold">
                  PHỔ BIẾN
                </span>
              </div>
              <div className="mb-6">
                <span className="text-4xl font-bold text-white">99.000đ</span>
                <span className="text-blue-100">/tháng</span>
              </div>
              <ul className="space-y-4 mb-8">
                {[
                  "Không giới hạn tài khoản",
                  "Báo cáo chi tiết",
                  "Đặt ngân sách nâng cao",
                  "Xuất dữ liệu Excel",
                  "Hỗ trợ ưu tiên",
                ].map((item, idx) => (
                  <li key={idx} className="flex items-center space-x-2">
                    <CheckCircle className="w-5 h-5 text-white" />
                    <span className="text-white">{item}</span>
                  </li>
                ))}
              </ul>
              <Link
                href="/register"
                className="block w-full text-center px-6 py-3 bg-white text-blue-600 rounded-lg hover:bg-blue-50 transition font-semibold"
              >
                Nâng cấp ngay
              </Link>
            </div>

            {/* Business Plan */}
            <div className="bg-card-bg rounded-2xl p-8 border-2 border-card-border hover:border-blue-400 dark:hover:border-blue-500 transition">
              <h3 className="text-2xl font-bold text-foreground mb-2">
                Doanh nghiệp
              </h3>
              <div className="mb-6">
                <span className="text-4xl font-bold text-foreground">
                  299.000đ
                </span>
                <span className="text-muted-text">/tháng</span>
              </div>
              <ul className="space-y-4 mb-8">
                {[
                  "Tất cả tính năng Premium",
                  "Quản lý đa người dùng",
                  "API tích hợp",
                  "Báo cáo tùy chỉnh",
                  "Hỗ trợ 24/7",
                ].map((item, idx) => (
                  <li key={idx} className="flex items-center space-x-2">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span className="text-muted-text">{item}</span>
                  </li>
                ))}
              </ul>
              <Link
                href="/register"
                className="block w-full text-center px-6 py-3 bg-hover-bg text-foreground rounded-lg hover:bg-card-border transition font-semibold"
              >
                Liên hệ
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section
        id="about"
        className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-600 to-indigo-700"
      >
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-4">
            Sẵn sàng kiểm soát tài chính của bạn?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Hàng nghìn người đã tin tưởng sử dụng MoneyTrack để quản lý tài
            chính cá nhân. Tham gia cùng chúng tôi ngay hôm nay!
          </p>
          <Link
            href="/register"
            className="inline-block px-8 py-4 bg-white text-blue-600 rounded-lg hover:bg-blue-50 transition font-semibold text-lg shadow-lg"
          >
            Đăng ký miễn phí ngay
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
