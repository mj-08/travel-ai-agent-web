export default function BundleCard({ bundle, onCheckout }) {
  const flightPrice = Number(bundle?.flight?.price?.grandTotal || 0);
  const hotelPrice = Number(bundle?.hotel?.price || 0);
  const total = flightPrice + hotelPrice;

  const colors = {
    CHEAPEST: "bg-green-100 text-green-800",
    FASTEST: "bg-blue-100 text-blue-800",
    LOW_RISK: "bg-orange-100 text-orange-800"
  };

  return (
    <div className="card hover:shadow-xl transition">
      <div className="flex items-center justify-between">
        <span className={`px-3 py-1 rounded-full text-sm font-medium ${colors[bundle.label]}`}>
          {bundle.label === "CHEAPEST" ? "💰 최저가" :
           bundle.label === "FASTEST" ? "⚡ 최단시간" : "🛡️ 최소리스크"}
        </span>
        <span className="text-2xl font-bold text-sky-700">
          {total.toLocaleString()} KRW
        </span>
      </div>
      <div className="mt-3 grid md:grid-cols-2 gap-4 text-sm">
        <div>
          <div className="font-semibold text-gray-700">✈️ 항공편</div>
          <p>가격: {flightPrice.toLocaleString()} KRW</p>
          <p>구간: {bundle.flight?.itineraries?.[0]?.segments?.length || 1} 구간</p>
        </div>
        <div>
          <div className="font-semibold text-gray-700">🏨 호텔</div>
          <p>{bundle.hotel?.name || "호텔명 미상"}</p>
          <p>예상가: {hotelPrice.toLocaleString()} KRW</p>
        </div>
      </div>
      <div className="mt-4">
        <button
          className="btn bg-sky-600 hover:bg-sky-700 w-full"
          onClick={() => onCheckout?.(bundle)}
        >
          이 옵션으로 예약 진행 →
        </button>
      </div>
    </div>
  );
}
