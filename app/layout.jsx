
export const metadata = {
  title: "Travel AI Agent",
  description: "ICN↔TYO 항공 + 도쿄 2박 호텔 — 최저가/최단시간/최소리스크"
};

export default function RootLayout({ children }) {
  return (
    <html lang="ko">
      <body className="container py-8">
        <header className="mb-8">
          <h1 className="text-3xl font-bold">Travel AI Agent</h1>
          <p className="text-gray-600">Amadeus + Hotelbeds (샌드박스) • 모의 결제 직전까지</p>
        </header>
        {children}
        <footer className="mt-12 text-center text-sm text-gray-500">© {new Date().getFullYear()} Travel AI Agent</footer>
      </body>
    </html>
  );
}
