import GuestNav from "@/components/layout/GuestNav";
import Footer from "@/components/layout/Footer";
import { FileText } from "lucide-react";
import Link from "next/link";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-background">
      <GuestNav />

      <div className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full mb-4">
              <FileText className="w-8 h-8 text-blue-600 dark:text-blue-400" />
            </div>
            <h1 className="text-4xl font-bold text-foreground mb-4">
              Điều khoản dịch vụ
            </h1>
            <p className="text-muted-text">
              Cập nhật lần cuối: {new Date().toLocaleDateString("vi-VN")}
            </p>
          </div>

          <div className="bg-card-bg rounded-2xl p-8 border border-card-border space-y-8">
            <section>
              <h2 className="text-2xl font-bold text-foreground mb-4">
                1. Chấp nhận điều khoản
              </h2>
              <p className="text-muted-text leading-relaxed">
                Bằng việc truy cập và sử dụng MoneyTrack, bạn đồng ý tuân thủ và
                bị ràng buộc bởi các điều khoản và điều kiện này. Nếu bạn không
                đồng ý với bất kỳ phần nào của điều khoản, bạn không được phép
                sử dụng dịch vụ của chúng tôi.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-foreground mb-4">
                2. Mô tả dịch vụ
              </h2>
              <p className="text-muted-text leading-relaxed">
                MoneyTrack là một ứng dụng quản lý tài chính cá nhân cho phép
                người dùng theo dõi thu chi, quản lý ngân sách, và tạo báo cáo
                tài chính. Chúng tôi cung cấp dịch vụ &quot;nguyên trạng&quot;
                và có thể thay đổi hoặc ngừng cung cấp dịch vụ bất kỳ lúc nào.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-foreground mb-4">
                3. Tài khoản người dùng
              </h2>
              <div className="space-y-3 text-muted-text leading-relaxed">
                <p>
                  <strong className="text-foreground">Đăng ký:</strong> Bạn phải
                  cung cấp thông tin chính xác và đầy đủ khi đăng ký tài khoản.
                </p>
                <p>
                  <strong className="text-foreground">Bảo mật:</strong> Bạn có
                  trách nhiệm bảo mật thông tin tài khoản và mật khẩu của mình.
                </p>
                <p>
                  <strong className="text-foreground">Trách nhiệm:</strong> Bạn
                  chịu trách nhiệm về tất cả hoạt động diễn ra trong tài khoản
                  của mình.
                </p>
                <p>
                  <strong className="text-foreground">Độ tuổi:</strong> Bạn phải
                  từ 18 tuổi trở lên để sử dụng dịch vụ này.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-foreground mb-4">
                4. Quy tắc sử dụng
              </h2>
              <p className="text-muted-text leading-relaxed mb-3">
                Bạn đồng ý <strong className="text-foreground">KHÔNG</strong>:
              </p>
              <ul className="list-disc list-inside space-y-2 text-muted-text leading-relaxed">
                <li>Sử dụng dịch vụ cho mục đích bất hợp pháp</li>
                <li>
                  Vi phạm quyền sở hữu trí tuệ của chúng tôi hoặc người khác
                </li>
                <li>Cố gắng truy cập trái phép vào hệ thống</li>
                <li>Gửi virus, malware hoặc mã độc hại</li>
                <li>Sao chép, sửa đổi hoặc phân phối nội dung của chúng tôi</li>
                <li>Sử dụng dịch vụ theo cách gây hại cho người dùng khác</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-foreground mb-4">
                5. Nội dung người dùng
              </h2>
              <div className="space-y-3 text-muted-text leading-relaxed">
                <p>
                  Bạn giữ quyền sở hữu đối với dữ liệu tài chính mà bạn nhập vào
                  hệ thống. Tuy nhiên, bạn cấp cho chúng tôi quyền sử dụng dữ
                  liệu này để cung cấp và cải thiện dịch vụ.
                </p>
                <p>
                  Bạn chịu trách nhiệm về tính chính xác của dữ liệu bạn cung
                  cấp và đảm bảo rằng dữ liệu đó không vi phạm bất kỳ quyền nào
                  của bên thứ ba.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-foreground mb-4">
                6. Thanh toán và hoàn tiền
              </h2>
              <div className="space-y-3 text-muted-text leading-relaxed">
                <p>
                  <strong className="text-foreground">Gói miễn phí:</strong>{" "}
                  Cung cấp các tính năng cơ bản miễn phí mãi mãi.
                </p>
                <p>
                  <strong className="text-foreground">Gói trả phí:</strong>{" "}
                  Thanh toán được thu theo tháng hoặc năm. Phí không được hoàn
                  lại trừ khi có quy định khác.
                </p>
                <p>
                  <strong className="text-foreground">Hủy đăng ký:</strong> Bạn
                  có thể hủy đăng ký bất kỳ lúc nào. Dịch vụ sẽ tiếp tục cho đến
                  hết kỳ thanh toán hiện tại.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-foreground mb-4">
                7. Giới hạn trách nhiệm
              </h2>
              <p className="text-muted-text leading-relaxed">
                Chúng tôi không chịu trách nhiệm cho bất kỳ thiệt hại trực tiếp,
                gián tiếp, ngẫu nhiên, đặc biệt hoặc hậu quả nào phát sinh từ
                việc sử dụng hoặc không thể sử dụng dịch vụ của chúng tôi. Bạn
                sử dụng dịch vụ với rủi ro của riêng mình.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-foreground mb-4">
                8. Chấm dứt dịch vụ
              </h2>
              <p className="text-muted-text leading-relaxed">
                Chúng tôi có quyền tạm ngừng hoặc chấm dứt tài khoản của bạn nếu
                bạn vi phạm điều khoản dịch vụ hoặc sử dụng dịch vụ một cách
                không phù hợp. Khi tài khoản bị chấm dứt, quyền truy cập của bạn
                vào dịch vụ sẽ bị hủy bỏ ngay lập tức.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-foreground mb-4">
                9. Thay đổi điều khoản
              </h2>
              <p className="text-muted-text leading-relaxed">
                Chúng tôi có quyền sửa đổi các điều khoản này bất kỳ lúc nào.
                Chúng tôi sẽ thông báo cho bạn về các thay đổi quan trọng thông
                qua email hoặc thông báo trên ứng dụng. Việc tiếp tục sử dụng
                dịch vụ sau khi thay đổi có nghĩa là bạn chấp nhận điều khoản
                mới.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-foreground mb-4">
                10. Luật áp dụng
              </h2>
              <p className="text-muted-text leading-relaxed">
                Các điều khoản này được điều chỉnh bởi pháp luật Việt Nam. Mọi
                tranh chấp phát sinh từ hoặc liên quan đến các điều khoản này sẽ
                được giải quyết tại tòa án có thẩm quyền tại Việt Nam.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-foreground mb-4">
                11. Liên hệ
              </h2>
              <p className="text-muted-text leading-relaxed">
                Nếu bạn có bất kỳ câu hỏi nào về điều khoản dịch vụ này, vui
                lòng liên hệ với chúng tôi:
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
