
export default function BundleCard({ bundle, onCheckout }) {
  const flightPrice = Number(bundle?.flight?.price?.grandTotal || bundle?.flight?.price?.total || 0);
  const hotelPrice = Number(bundle?.hotel?.price || 0);
  const total = flightPrice + hotelPrice;
  return (
    <div className="card space-y-2">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold">{bundle.label}</h3>
        <div className="text-lg font-bold">{total.toLocaleString()} KRW</div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <div className="text-sm text-gray-500">항공</div>
          <div className="text-sm">
            가격: {flightPrice.toLocaleString()} KRW
          </div>
          <pre className="text-xs bg-gray-50 p-2 rounded overflow-auto">{JSON.stringify(bundle.flight?.itineraries?.map(i=>({duration:i.duration, segments:i.segments?.length})), null, 2)}</pre>
        </div>
        <div>
          <div className="text-sm text-gray-500">호텔</div>
          <div className="text-sm">이름: {bundle.hotel?.name || "-"}</div>
          <div className="text-sm">가격(추정): {hotelPrice.toLocaleString()} KRW</div>
        </div>
      </div>
      <div className="pt-2">
        <button className="btn" onClick={()=> onCheckout?.(bundle)}>이 번들로 모의 결제 진행</button>
      </div>
    </div>
  );
}
