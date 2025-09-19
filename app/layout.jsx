export const metadata = {
  title: "Travel AI Agent",
  description: "인천 ↔ 도쿄 항공 + 호텔 패키지 AI 추천"
};

export default function RootLayout({ children }) {
  return (
    <html lang="ko">
      <body className="bg-gradient-to-b from-sky-100 to-white min-h-screen">
        <header className="bg-sky-600 text-white py-6 shadow">
          <div className="container flex items-center justify-between">
            <h1 className="text-2xl font-bold">✈️ Travel AI Agent</h1>
            <nav className="space-x-4 text-sm">
              <a href="#" className="hover:underline">홈</a>
              <a href="#" className="hover:underline">서비스</a>
              <a href="#" className="hover:underline">문의</a>
            </nav>
          </div>
        </header>
        <main className="container py-10">{children}</main>
        <footer className="bg-gray-100 py-6 mt-12 text-center text-sm text-gray-500">
          © {new Date().getFullYear()} Travel AI Agent — AI가 추천하는 똑똑한 여행
        </footer>
      </body>
    </html>
  );
}
