import GuestNav from "@/components/layout/GuestNav";
import Footer from "@/components/layout/Footer";
import {
  Wallet,
  TrendingUp,
  Shield,
  Target,
  PieChart,
  CheckCircle,
  ArrowRight,
  Users,
  Star,
  ChevronDown,
  Clock,
  BarChart3,
  Smartphone,
} from "lucide-react";
import Link from "next/link";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <GuestNav />

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 bg-linear-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-800">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            {/* Trust Badge */}
            <div className="inline-flex items-center gap-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Shield className="w-4 h-4" />
              <span>Miễn phí 100% • Bảo mật và đáng tin cậy</span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 leading-tight">
              Kiểm soát tiền bạc,{" "}
              <span className="text-blue-600 dark:text-blue-400">
                Tự do tài chính
              </span>
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-muted-text mb-8 max-w-3xl mx-auto leading-relaxed">
              Quản lý thu chi thông minh, đặt ngân sách hiệu quả và đạt được mục
              tiêu tài chính với MoneyTrack - Ứng dụng quản lý tài chính cá nhân
              được nhiều người tin dùng.
            </p>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 sm:gap-4 mb-8 max-w-md mx-auto sm:max-w-none">
              <Link
                href="/register"
                className="group px-6 sm:px-8 py-3 sm:py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all font-semibold text-base sm:text-lg shadow-lg flex items-center justify-center gap-2"
              >
                Bắt đầu miễn phí ngay
                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/login"
                className="px-6 sm:px-8 py-3 sm:py-4 bg-card-bg text-foreground rounded-lg hover:bg-hover-bg transition-all font-semibold text-base sm:text-lg border-2 border-card-border text-center"
              >
                Đăng nhập
              </Link>
            </div>

            {/* Social Proof Stats */}
            <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 md:gap-8 text-xs sm:text-sm text-muted-text">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                <span>
                  <strong className="text-foreground">100%</strong> Miễn phí mãi
                  mãi
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Star className="w-5 h-5 text-yellow-500" />
                <span>
                  <strong className="text-foreground">Không</strong> quảng cáo
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-green-600 dark:text-green-400" />
                <span>
                  <strong className="text-foreground">Bảo mật</strong> tối đa
                </span>
              </div>
            </div>
          </div>

          {/* Hero Image/Dashboard Preview */}
          <div className="mt-12 sm:mt-16">
            <div className="bg-card-bg rounded-xl sm:rounded-2xl shadow-2xl p-3 sm:p-6 md:p-8 max-w-5xl mx-auto border border-card-border">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                <div className="bg-linear-to-br from-blue-500 to-blue-600 rounded-lg sm:rounded-xl p-4 sm:p-6 text-white hover:scale-105 transition-transform cursor-default">
                  <Wallet className="w-6 h-6 sm:w-8 sm:h-8 mb-2" />
                  <p className="text-xs sm:text-sm font-medium">Tổng tài sản</p>
                  <p className="text-xl sm:text-2xl font-bold mt-1 sm:mt-2">
                    32.470.000đ
                  </p>
                  <p className="text-xs mt-1 sm:mt-2 text-blue-100">
                    +12.5% so với tháng trước
                  </p>
                </div>
                <div className="bg-linear-to-br from-green-500 to-green-600 rounded-lg sm:rounded-xl p-4 sm:p-6 text-white hover:scale-105 transition-transform cursor-default">
                  <TrendingUp className="w-6 h-6 sm:w-8 sm:h-8 mb-2" />
                  <p className="text-xs sm:text-sm font-medium">
                    Thu nhập tháng này
                  </p>
                  <p className="text-xl sm:text-2xl font-bold mt-1 sm:mt-2">
                    15.000.000đ
                  </p>
                  <p className="text-xs mt-1 sm:mt-2 text-green-100">
                    42 giao dịch
                  </p>
                </div>
                <div className="bg-linear-to-br from-red-500 to-red-600 rounded-lg sm:rounded-xl p-4 sm:p-6 text-white hover:scale-105 transition-transform cursor-default">
                  <Target className="w-6 h-6 sm:w-8 sm:h-8 mb-2" />
                  <p className="text-xs sm:text-sm font-medium">
                    Chi tiêu tháng này
                  </p>
                  <p className="text-xl sm:text-2xl font-bold mt-1 sm:mt-2">
                    10.400.000đ
                  </p>
                  <p className="text-xs mt-1 sm:mt-2 text-red-100">
                    73% ngân sách
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-12 sm:py-16 md:py-20 px-4 sm:px-6 lg:px-8 bg-background">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-3 sm:mb-4">
              Cách thức hoạt động
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-muted-text">
              Chỉ với 3 bước đơn giản để bắt đầu quản lý tài chính
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            {[
              {
                step: "1",
                icon: Users,
                title: "Đăng ký tài khoản",
                description:
                  "Tạo tài khoản miễn phí chỉ trong 30 giây. Không cần thẻ tín dụng.",
              },
              {
                step: "2",
                icon: Wallet,
                title: "Thêm giao dịch",
                description:
                  "Ghi lại thu chi hàng ngày một cách nhanh chóng và dễ dàng.",
              },
              {
                step: "3",
                icon: BarChart3,
                title: "Theo dõi & phân tích",
                description:
                  "Xem báo cáo trực quan và nhận insights để quản lý tài chính tốt hơn.",
              },
            ].map((item, idx) => (
              <div key={idx} className="relative">
                <div className="bg-card-bg rounded-xl p-6 sm:p-8 border-2 border-card-border hover:border-blue-400 dark:hover:border-blue-500 hover:shadow-lg transition text-center">
                  <div className="inline-flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full mb-4">
                    <item.icon className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                    {item.step}
                  </div>
                  <h3 className="text-lg sm:text-xl font-semibold text-foreground mb-2">
                    {item.title}
                  </h3>
                  <p className="text-sm sm:text-base text-muted-text">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section
        id="features"
        className="py-12 sm:py-16 md:py-20 px-4 sm:px-6 lg:px-8 bg-background"
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

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 md:gap-8">
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
                className="bg-card-bg rounded-xl p-5 sm:p-6 border-2 border-card-border hover:border-blue-400 dark:hover:border-blue-500 hover:shadow-lg transition"
              >
                <div
                  className={`w-12 h-12 rounded-lg ${feature.color} flex items-center justify-center mb-4`}
                >
                  <feature.icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg sm:text-xl font-semibold text-foreground mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm sm:text-base text-muted-text">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section
        id="pricing"
        className="py-12 sm:py-16 md:py-20 px-4 sm:px-6 lg:px-8 bg-hover-bg"
      >
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-4">
              100% Miễn phí
            </h2>
            <p className="text-xl text-muted-text mb-4">
              MoneyTrack hoàn toàn miễn phí với đầy đủ tính năng
            </p>
            <p className="text-sm text-muted-text italic">
              (Các gói Premium sẽ ra mắt sớm với nhiều tính năng nâng cao hơn)
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            {/* Free Plan - Highlighted */}
            <div className="bg-linear-to-br from-blue-500 to-blue-600 rounded-xl sm:rounded-2xl p-6 sm:p-8 md:p-12 border-2 border-blue-600 shadow-2xl text-white">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                <div>
                  <h3 className="text-2xl sm:text-3xl font-bold mb-2">
                    Miễn phí mãi mãi
                  </h3>
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl sm:text-5xl font-bold">0đ</span>
                    <span className="text-blue-100 text-base sm:text-lg">
                      /tháng
                    </span>
                  </div>
                </div>
                <div className="px-3 sm:px-4 py-1.5 sm:py-2 bg-yellow-400 text-yellow-900 rounded-full text-xs sm:text-sm font-bold whitespace-nowrap">
                  ĐANG SỬ DỤNG
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-3 sm:gap-4 mb-6 sm:mb-8">
                {[
                  "Không giới hạn giao dịch",
                  "Không giới hạn tài khoản",
                  "Báo cáo chi tiết và biểu đồ",
                  "Đặt ngân sách cho từng danh mục",
                  "Xuất dữ liệu CSV/Excel",
                  "Cảnh báo vượt ngân sách",
                  "Đa nền tảng (Web, Mobile)",
                  "Bảo mật với mã hóa AES-256",
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2 sm:gap-3">
                    <div className="shrink-0 w-5 h-5 sm:w-6 sm:h-6 bg-white/20 rounded-full flex items-center justify-center">
                      <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4" />
                    </div>
                    <span className="text-sm sm:text-base text-white">
                      {item}
                    </span>
                  </div>
                ))}
              </div>

              <Link
                href="/register"
                className="block w-full text-center px-6 py-3 sm:py-4 bg-white text-blue-600 rounded-xl hover:bg-blue-50 transition-all font-bold text-base sm:text-lg shadow-lg"
              >
                Đăng ký ngay - Miễn phí 100%
              </Link>
            </div>

            {/* Coming Soon Plans Preview */}
            <div className="mt-6 sm:mt-8 p-5 sm:p-6 bg-card-bg rounded-xl border-2 border-dashed border-card-border text-center">
              <Clock className="w-12 h-12 text-muted-text mx-auto mb-3" />
              <h4 className="text-lg font-semibold text-foreground mb-2">
                Các gói Premium sắp ra mắt
              </h4>
              <p className="text-muted-text text-sm">
                Chúng tôi đang phát triển các gói Premium với tính năng nâng
                cao: API tích hợp, Quản lý đa người dùng, Báo cáo tùy chỉnh, và
                Hỗ trợ ưu tiên. Hãy đăng ký ngay để không bỏ lỡ!
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-12 sm:py-16 md:py-20 px-4 sm:px-6 lg:px-8 bg-background">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-4">
              Người dùng nói gì về chúng tôi
            </h2>
            <p className="text-xl text-muted-text">
              Hàng trăm người đã cải thiện tài chính với MoneyTrack
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: "Nguyễn Văn An",
                role: "Freelancer",
                content:
                  "MoneyTrack giúp tôi kiểm soát thu nhập bất thường từ các dự án. Giờ tôi biết chính xác mình kiếm và tiêu bao nhiêu mỗi tháng.",
                avatar: "NA",
              },
              {
                name: "Trần Thị Bình",
                role: "Nhân viên văn phòng",
                content:
                  "Giao diện đơn giản, dễ sử dụng. Tính năng cảnh báo ngân sách giúp tôi tiết kiệm được 30% chi tiêu hàng tháng!",
                avatar: "TB",
              },
              {
                name: "Lê Minh Cường",
                role: "Chủ doanh nghiệp nhỏ",
                content:
                  "Tôi dùng MoneyTrack để quản lý cả tài chính cá nhân và doanh nghiệp. Báo cáo chi tiết rất hữu ích cho việc lập kế hoạch.",
                avatar: "LC",
              },
            ].map((testimonial, idx) => (
              <div
                key={idx}
                className="bg-card-bg rounded-xl p-5 sm:p-6 border-2 border-card-border hover:shadow-lg transition"
              >
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-5 h-5 fill-yellow-400 text-yellow-400"
                    />
                  ))}
                </div>
                <p className="text-sm sm:text-base text-muted-text mb-6 italic leading-relaxed">
                  &quot;{testimonial.content}&quot;
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center text-blue-600 dark:text-blue-400 font-bold">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <div className="font-semibold text-foreground">
                      {testimonial.name}
                    </div>
                    <div className="text-sm text-muted-text">
                      {testimonial.role}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Comparison Table */}
      <section className="py-12 sm:py-16 md:py-20 px-4 sm:px-6 lg:px-8 bg-hover-bg">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-4">
              So sánh chi tiết tính năng
            </h2>
            <p className="text-xl text-muted-text">
              Xem đầy đủ những gì bạn nhận được
            </p>
          </div>

          <div className="bg-card-bg rounded-xl sm:rounded-2xl overflow-hidden border border-card-border shadow-xl">
            <div className="overflow-x-auto scrollbar-thin">
              <table className="w-full">
                <thead className="bg-blue-600 text-white">
                  <tr>
                    <th className="text-left p-3 sm:p-4 font-semibold text-sm sm:text-base min-w-35">
                      Tính năng
                    </th>
                    <th className="text-center p-3 sm:p-4 font-semibold text-sm sm:text-base min-w-25">
                      Miễn phí
                      <div className="text-xs font-normal text-blue-100 mt-1">
                        Hiện tại
                      </div>
                    </th>
                    <th className="text-center p-3 sm:p-4 font-semibold text-sm sm:text-base min-w-25">
                      Premium
                      <div className="text-xs font-normal text-blue-100 mt-1">
                        Sắp ra mắt
                      </div>
                    </th>
                    <th className="text-center p-3 sm:p-4 font-semibold text-sm sm:text-base min-w-27.5">
                      Doanh nghiệp
                      <div className="text-xs font-normal text-blue-100 mt-1">
                        Sắp ra mắt
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-card-border">
                  {[
                    {
                      feature: "Số lượng giao dịch",
                      free: "Không giới hạn",
                      premium: "Không giới hạn",
                      business: "Không giới hạn",
                    },
                    {
                      feature: "Số lượng tài khoản",
                      free: "Không giới hạn",
                      premium: "Không giới hạn",
                      business: "Không giới hạn",
                    },
                    {
                      feature: "Báo cáo & Biểu đồ",
                      free: true,
                      premium: true,
                      business: true,
                    },
                    {
                      feature: "Đặt ngân sách",
                      free: true,
                      premium: true,
                      business: true,
                    },
                    {
                      feature: "Xuất dữ liệu CSV/Excel",
                      free: true,
                      premium: true,
                      business: true,
                    },
                    {
                      feature: "Cảnh báo thông minh",
                      free: "Cơ bản",
                      premium: "Nâng cao",
                      business: "Tùy chỉnh",
                    },
                    {
                      feature: "Phân tích AI",
                      free: false,
                      premium: true,
                      business: true,
                    },
                    {
                      feature: "API tích hợp",
                      free: false,
                      premium: false,
                      business: true,
                    },
                    {
                      feature: "Quản lý đa người dùng",
                      free: false,
                      premium: false,
                      business: true,
                    },
                    {
                      feature: "Hỗ trợ",
                      free: "Email",
                      premium: "Ưu tiên",
                      business: "24/7",
                    },
                  ].map((row, idx) => (
                    <tr key={idx} className="hover:bg-hover-bg transition">
                      <td className="p-3 sm:p-4 font-medium text-foreground text-sm sm:text-base">
                        {row.feature}
                      </td>
                      <td className="p-3 sm:p-4 text-center">
                        {typeof row.free === "boolean" ? (
                          row.free ? (
                            <CheckCircle className="w-5 h-5 text-green-600 mx-auto" />
                          ) : (
                            <span className="text-muted-text">-</span>
                          )
                        ) : (
                          <span className="text-muted-text text-xs sm:text-sm">
                            {row.free}
                          </span>
                        )}
                      </td>
                      <td className="p-3 sm:p-4 text-center">
                        {typeof row.premium === "boolean" ? (
                          row.premium ? (
                            <CheckCircle className="w-5 h-5 text-green-600 mx-auto" />
                          ) : (
                            <span className="text-muted-text">-</span>
                          )
                        ) : (
                          <span className="text-muted-text text-xs sm:text-sm">
                            {row.premium}
                          </span>
                        )}
                      </td>
                      <td className="p-3 sm:p-4 text-center">
                        {typeof row.business === "boolean" ? (
                          row.business ? (
                            <CheckCircle className="w-5 h-5 text-green-600 mx-auto" />
                          ) : (
                            <span className="text-muted-text">-</span>
                          )
                        ) : (
                          <span className="text-muted-text text-xs sm:text-sm">
                            {row.business}
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-12 sm:py-16 md:py-20 px-4 sm:px-6 lg:px-8 bg-background">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-4">
              Câu hỏi thường gặp
            </h2>
            <p className="text-xl text-muted-text">
              Giải đáp những thắc mắc phổ biến
            </p>
          </div>

          <div className="space-y-4">
            {[
              {
                question: "MoneyTrack có thực sự miễn phí 100% không?",
                answer:
                  "Có! MoneyTrack hoàn toàn miễn phí với đầy đủ tính năng quản lý tài chính cá nhân. Chúng tôi không hiển thị quảng cáo và không yêu cầu thông tin thẻ tín dụng. Trong tương lai, chúng tôi sẽ ra mắt các gói Premium với tính năng nâng cao cho doanh nghiệp.",
              },
              {
                question: "Dữ liệu của tôi có an toàn không?",
                answer:
                  "Bảo mật là ưu tiên hàng đầu của chúng tôi. Tất cả dữ liệu được mã hóa với AES-256 cả khi truyền tải và lưu trữ. Chúng tôi không bao giờ chia sẻ hoặc bán dữ liệu của bạn cho bên thứ ba. Máy chủ được đặt tại các trung tâm dữ liệu có chứng nhận ISO 27001.",
              },
              {
                question: "Tôi có thể sử dụng trên điện thoại không?",
                answer:
                  "Có! MoneyTrack có giao diện responsive hoạt động mượt mà trên mọi thiết bị - máy tính, tablet và điện thoại. Dữ liệu được đồng bộ tự động giữa các thiết bị của bạn.",
              },
              {
                question: "Làm sao để xuất dữ liệu của tôi?",
                answer:
                  'Bạn có thể xuất toàn bộ dữ liệu giao dịch dưới dạng file CSV hoặc Excel. Vào trang "Báo cáo", chọn khoảng thời gian và nhấn nút "Xuất dữ liệu". File sẽ bao gồm tất cả thông tin chi tiết về giao dịch của bạn.',
              },
              {
                question: "Tôi có thể hủy tài khoản bất cứ lúc nào không?",
                answer:
                  'Có, bạn có toàn quyền kiểm soát tài khoản của mình. Vào "Cài đặt" > "Tài khoản" > "Xóa tài khoản" để xóa vĩnh viễn tài khoản và toàn bộ dữ liệu. Hành động này không thể hoàn tác.',
              },
              {
                question: "MoneyTrack có hỗ trợ nhiều loại tiền tệ không?",
                answer:
                  "Hiện tại MoneyTrack hỗ trợ chính cho tiền Việt Nam Đồng (VND). Chúng tôi đang phát triển hỗ trợ đa tiền tệ và sẽ ra mắt trong các phiên bản tiếp theo.",
              },
            ].map((faq, idx) => (
              <details
                key={idx}
                className="group bg-card-bg rounded-xl border border-card-border overflow-hidden"
              >
                <summary className="flex items-center justify-between p-4 sm:p-6 cursor-pointer hover:bg-hover-bg transition">
                  <span className="font-semibold text-foreground text-base sm:text-lg pr-4">
                    {faq.question}
                  </span>
                  <ChevronDown className="w-5 h-5 text-muted-text group-open:rotate-180 transition-transform shrink-0" />
                </summary>
                <div className="px-4 sm:px-6 pb-4 sm:pb-6 text-sm sm:text-base text-muted-text leading-relaxed">
                  {faq.answer}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section
        id="about"
        className="py-12 sm:py-16 md:py-20 px-4 sm:px-6 lg:px-8 bg-linear-to-br from-blue-600 to-indigo-700"
      >
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 leading-tight">
            Bắt đầu hành trình tự do tài chính ngay hôm nay
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-blue-100 mb-6 sm:mb-8 leading-relaxed">
            Tham gia cùng hàng trăm người dùng đang quản lý tài chính thông minh
            với MoneyTrack. Hoàn toàn miễn phí, không quảng cáo, không cam kết.
          </p>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 sm:gap-4 max-w-md sm:max-w-none mx-auto">
            <Link
              href="/register"
              className="group px-6 sm:px-8 py-3 sm:py-4 bg-white text-blue-600 rounded-xl hover:bg-blue-50 transition-all font-bold text-base sm:text-lg shadow-lg flex items-center justify-center gap-2"
            >
              Đăng ký miễn phí - 30 giây
              <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="#features"
              className="px-6 sm:px-8 py-3 sm:py-4 bg-blue-700 text-white rounded-xl hover:bg-blue-800 transition-all font-semibold text-base sm:text-lg border-2 border-blue-500 text-center"
            >
              Tìm hiểu thêm
            </Link>
          </div>
          <p className="text-xs sm:text-sm text-blue-200 mt-4 sm:mt-6">
            ✓ Không cần thẻ tín dụng ✓ Miễn phí mãi mãi ✓ Hủy bất cứ lúc nào
          </p>
        </div>
      </section>

      <Footer />
    </div>
  );
}
