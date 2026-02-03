import "./globals.css";

export const metadata = {
  title: "Notion Aladin Widget",
  description: "Search books and add to Notion database"
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
