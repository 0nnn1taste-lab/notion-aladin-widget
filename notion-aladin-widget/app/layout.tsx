import "./globals.css";

export const metadata = {
  title: "Notion Book Import",
  description: "Aladin → Notion DB 자동 등록 위젯"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
