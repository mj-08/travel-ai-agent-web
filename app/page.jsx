
"use client";
import { useState } from "react";
import BundleCard from "./(components)/BundleCard";

export default function Page() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [err, setErr] = useState(null);
  const [form, setForm] = useState({
    origin: "ICN",
    destination: "TYO",
    departDate: "2025-11-10",
    returnDate: "2025-11-12",
    adults: 2,
    currency: "KRW",
    hotel: {
      city: "Tokyo",
      checkIn: "2025-11-10",
      checkOut: "2025-11-12",
      rooms: 1,
      adultsPerRoom: 2,
      maxPrice: 200000
    }
  });

  const onChange = (path, value) => {
    setForm(prev => {
      const next = structuredClone(prev);
      const keys = path.split(".");
      let cur = next;
      for (let i=0;i<keys.length-1;i++) cur = cur[keys[i]];
      cur[keys[keys.length-1]] = value;
      return next;
    });
  };

  async function onSearch() {
    setLoading(true); setErr(null);
    try {
      const res = await fetch("/api/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "검색 실패");
      setResult(data);
    } catch (e) {
      setErr(e.message);
    } finally {
      setLoading(false);
    }
  }

  async function onCheckout(bundle) {
    setLoading(true); setErr(null);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bundle,
          traveler: { givenName: "TEST", familyName: "USER" },
          guest: { name: "TEST", surname: "USER" }
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "체크아웃 실패");
      alert("모의 결제 단계로 이동했습니다. 콘솔을 확인하세요.");
      console.log("CHECKOUT RESULT", data);
    } catch (e) {
      setErr(e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="space-y-6">
      <section className="card space-y-3">
        <h2 className="text-xl font-semibold">여행 검색</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div>
            <div className="label">출발</div>
            <input className="input" value={form.origin} onChange={e=>onChange("origin", e.target.value)} />
          </div>
          <div>
            <div className="label">도착</div>
            <input className="input" value={form.destination} onChange={e=>onChange("destination", e.target.value)} />
          </div>
          <div>
            <div className="label">성인 수</div>
            <input type="number" className="input" value={form.adults} onChange={e=>onChange("adults", Number(e.target.value))} />
          </div>
          <div>
            <div className="label">출발일</div>
            <input type="date" className="input" value={form.departDate} onChange={e=>onChange("departDate", e.target.value)} />
          </div>
          <div>
            <div className="label">귀국일</div>
            <input type="date" className="input" value={form.returnDate} onChange={e=>onChange("returnDate", e.target.value)} />
          </div>
          <div>
            <div className="label">통화</div>
            <input className="input" value={form.currency} onChange={e=>onChange("currency", e.target.value)} />
          </div>
        </div>
        <details className="mt-2">
          <summary className="cursor-pointer text-sm text-gray-600">호텔 옵션</summary>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-2">
            <div>
              <div className="label">체크인</div>
              <input type="date" className="input" value={form.hotel.checkIn} onChange={e=>onChange("hotel.checkIn", e.target.value)} />
            </div>
            <div>
              <div className="label">체크아웃</div>
              <input type="date" className="input" value={form.hotel.checkOut} onChange={e=>onChange("hotel.checkOut", e.target.value)} />
            </div>
            <div>
              <div className="label">1박 최대가격 (KRW)</div>
              <input type="number" className="input" value={form.hotel.maxPrice ?? ""} onChange={e=>onChange("hotel.maxPrice", Number(e.target.value))} />
            </div>
          </div>
        </details>
        <button className="btn mt-2" onClick={onSearch} disabled={loading}>{loading ? "검색 중..." : "검색"}</button>
        {err && <div className="text-red-600 text-sm">오류: {err}</div>}
      </section>

      {result?.bundles?.length > 0 && (
        <section className="space-y-4">
          <h2 className="text-xl font-semibold">대표 옵션 3가지</h2>
          <div className="grid grid-cols-1 gap-4">
            {result.bundles.map((b) => (
              <BundleCard key={b.label} bundle={b} onCheckout={onCheckout} />
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
