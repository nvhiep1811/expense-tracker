import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { QueryProvider } from "@/providers/QueryProvider";
import { Toaster } from "react-hot-toast";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "MoneyTrack - Quản lý chi tiêu thông minh",
    template: "%s | MoneyTrack",
  },
  description:
    "Ứng dụng quản lý tài chính cá nhân thông minh. Theo dõi thu chi, ngân sách, báo cáo chi tiết. Miễn phí, an toàn, dễ sử dụng.",
  keywords: [
    "quản lý chi tiêu",
    "quản lý tài chính",
    "sổ thu chi",
    "ngân sách",
    "expense tracker",
    "budget",
    "personal finance",
  ],
  authors: [{ name: "MoneyTrack Team" }],
  creator: "MoneyTrack",
  publisher: "MoneyTrack",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
  ),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "MoneyTrack - Quản lý chi tiêu thông minh",
    description:
      "Ứng dụng quản lý tài chính cá nhân thông minh. Theo dõi thu chi, ngân sách, báo cáo chi tiết.",
    url: "/",
    siteName: "MoneyTrack",
    locale: "vi_VN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "MoneyTrack - Quản lý chi tiêu thông minh",
    description:
      "Ứng dụng quản lý tài chính cá nhân thông minh. Miễn phí, an toàn, dễ sử dụng.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    // Add your verification tokens here when ready
    // google: "your-google-verification-token",
    // yandex: "your-yandex-verification-token",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var theme = localStorage.getItem('theme');
                  var systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                  var resolvedTheme = theme === 'dark' ? 'dark' : theme === 'light' ? 'light' : (systemDark ? 'dark' : 'light');
                  document.documentElement.classList.add(resolvedTheme);
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider>
          <QueryProvider>
            <AuthProvider>{children}</AuthProvider>
          </QueryProvider>
        </ThemeProvider>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 1000,
            style: {
              background: "var(--card-bg)",
              color: "var(--foreground)",
              padding: "16px",
              borderRadius: "8px",
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
            },
            success: {
              iconTheme: {
                primary: "#10b981",
                secondary: "#fff",
              },
            },
            error: {
              iconTheme: {
                primary: "#ef4444",
                secondary: "#fff",
              },
            },
          }}
          containerStyle={{
            cursor: "pointer",
          }}
        />
      </body>
    </html>
  );
}
