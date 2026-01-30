import { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "MoneyTrack - Quản lý chi tiêu thông minh",
    short_name: "MoneyTrack",
    description:
      "Ứng dụng quản lý tài chính cá nhân thông minh. Theo dõi thu chi, ngân sách, báo cáo chi tiết.",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#2563eb",
    orientation: "portrait",
    categories: ["finance", "productivity", "business"],
    lang: "vi",
    dir: "ltr",
    icons: [
      {
        src: "/icon-192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/icon-512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}
