import GuestNav from "@/components/layout/GuestNav";
import Footer from "@/components/layout/Footer";
import { Shield } from "lucide-react";
import Link from "next/link";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background">
      <GuestNav />

      <div className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full mb-4">
              <Shield className="w-8 h-8 text-blue-600 dark:text-blue-400" />
            </div>
            <h1 className="text-4xl font-bold text-foreground mb-4">
              Chính sách bảo mật
            </h1>
            <p className="text-muted-text">
              Cập nhật lần cuối: {new Date().toLocaleDateString("vi-VN")}
            </p>
          </div>

          <div className="bg-card-bg rounded-2xl p-8 border border-card-border space-y-8">
            <section>
              <h2 className="text-2xl font-bold text-foreground mb-4">
                1. Giới thiệu
              </h2>
              <p className="text-muted-text leading-relaxed">
                MoneyTrack cam kết bảo vệ quyền riêng tư và thông tin cá nhân
                của bạn. Chính sách bảo mật này giải thích cách chúng tôi thu
                thập, sử dụng, lưu trữ và bảo vệ thông tin của bạn khi sử dụng
                dịch vụ của chúng tôi.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-foreground mb-4">
                2. Thông tin chúng tôi thu thập
              </h2>
              <div className="space-y-3 text-muted-text leading-relaxed">
                <p>
                  <strong className="text-foreground">
                    Thông tin cá nhân:
                  </strong>{" "}
                  Tên, email, số điện thoại khi bạn đăng ký tài khoản.
                </p>
                <p>
                  <strong className="text-foreground">
                    Dữ liệu tài chính:
                  </strong>{" "}
                  Thông tin về các giao dịch, tài khoản ngân hàng, và ngân sách
                  mà bạn nhập vào hệ thống.
                </p>
                <p>
                  <strong className="text-foreground">
                    Thông tin kỹ thuật:
                  </strong>{" "}
                  Địa chỉ IP, loại trình duyệt, thiết bị và hệ điều hành của
                  bạn.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-foreground mb-4">
                3. Cách chúng tôi sử dụng thông tin
              </h2>
              <ul className="list-disc list-inside space-y-2 text-muted-text leading-relaxed">
                <li>Cung cấp và cải thiện dịch vụ của chúng tôi</li>
                <li>Xử lý các giao dịch và quản lý tài khoản của bạn</li>
                <li>Gửi thông báo về dịch vụ và cập nhật quan trọng</li>
                <li>Phân tích và cải thiện trải nghiệm người dùng</li>
                <li>Bảo vệ chống gian lận và đảm bảo bảo mật</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-foreground mb-4">
                4. Bảo vệ dữ liệu
              </h2>
              <p className="text-muted-text leading-relaxed">
                Chúng tôi sử dụng các biện pháp bảo mật kỹ thuật và tổ chức phù
                hợp để bảo vệ dữ liệu của bạn khỏi truy cập trái phép, mất mát
                hoặc tiết lộ. Dữ liệu của bạn được mã hóa cả khi truyền tải và
                khi lưu trữ trên hệ thống của chúng tôi.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-foreground mb-4">
                5. Chia sẻ thông tin
              </h2>
              <p className="text-muted-text leading-relaxed mb-3">
                Chúng tôi <strong className="text-foreground">không bán</strong>{" "}
                thông tin cá nhân của bạn cho bên thứ ba. Chúng tôi chỉ chia sẻ
                thông tin của bạn trong các trường hợp sau:
              </p>
              <ul className="list-disc list-inside space-y-2 text-muted-text leading-relaxed">
                <li>Khi có sự đồng ý của bạn</li>
                <li>Với các nhà cung cấp dịch vụ đáng tin cậy</li>
                <li>Khi được yêu cầu bởi pháp luật</li>
                <li>
                  Để bảo vệ quyền lợi và an toàn của chúng tôi và người dùng
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-foreground mb-4">
                6. Quyền của bạn
              </h2>
              <p className="text-muted-text leading-relaxed mb-3">
                Bạn có các quyền sau đối với dữ liệu cá nhân của mình:
              </p>
              <ul className="list-disc list-inside space-y-2 text-muted-text leading-relaxed">
                <li>Quyền truy cập và xem dữ liệu của bạn</li>
                <li>Quyền chỉnh sửa hoặc cập nhật thông tin</li>
                <li>Quyền xóa tài khoản và dữ liệu</li>
                <li>Quyền xuất dữ liệu của bạn</li>
                <li>Quyền từ chối hoặc hạn chế xử lý dữ liệu</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-foreground mb-4">
                7. Cookie và theo dõi
              </h2>
              <p className="text-muted-text leading-relaxed">
                Chúng tôi sử dụng cookie và các công nghệ theo dõi tương tự để
                cải thiện trải nghiệm người dùng và phân tích cách sử dụng dịch
                vụ. Bạn có thể kiểm soát việc sử dụng cookie thông qua cài đặt
                trình duyệt của mình.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-foreground mb-4">
                8. Thay đổi chính sách
              </h2>
              <p className="text-muted-text leading-relaxed">
                Chúng tôi có thể cập nhật chính sách bảo mật này theo thời gian.
                Chúng tôi sẽ thông báo cho bạn về bất kỳ thay đổi quan trọng nào
                qua email hoặc thông báo trên ứng dụng.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-foreground mb-4">
                9. Liên hệ
              </h2>
              <p className="text-muted-text leading-relaxed">
                Nếu bạn có bất kỳ câu hỏi nào về chính sách bảo mật này hoặc
                cách chúng tôi xử lý dữ liệu của bạn, vui lòng liên hệ với chúng
                tôi:
              </p>
              <div className="mt-4 p-4 bg-hover-bg rounded-lg">
                <p className="text-foreground">
                  <strong>Email:</strong>{" "}
                  <a
                    href="mailto:nguyenvohiep.29122004@gmail.com"
                    className="text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    nguyenvohiep.29122004@gmail.com
                  </a>
                </p>
                <p className="text-foreground mt-2">
                  <strong>Địa chỉ:</strong> Việt Nam
                </p>
              </div>
            </section>
          </div>

          <div className="mt-8 text-center">
            <Link
              href="/"
              className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:underline"
            >
              ← Quay lại trang chủ
            </Link>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
