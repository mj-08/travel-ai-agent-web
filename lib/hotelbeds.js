
import crypto from "crypto";

function signature() {
  const key = process.env.HOTELBEDS_KEY || "";
  const secret = process.env.HOTELBEDS_SECRET || "";
  const ts = Math.floor(Date.now()/1000).toString();
  const sig = crypto.createHash("sha256").update(ts + key + secret).digest("hex");
  return { ts, sig, key };
}

export async function hotelbedsSearch({ city, checkIn, checkOut, rooms, adultsPerRoom, currency, maxPrice }) {
  const { sig, key } = signature();
  const url = "https://api.test.hotelbeds.com/hotel-api/1.0/hotels";

  const body = {
    stay: { checkIn, checkOut },
    occupancies: [{ rooms, adults: adultsPerRoom * rooms }],
    destination: { code: "TYO" }, // Tokyo
    dailyRate: true,
    filter: {}
  };
  if (maxPrice) body.filter.maxRate = maxPrice;

  const res = await fetch(url + `?currency=${encodeURIComponent(currency || "KRW")}&language=${encodeURIComponent(process.env.DEFAULT_LOCALE || "ko")}`, {
    method: "POST",
    headers: {
      "Api-key": key,
      "X-Signature": sig,
      "Accept": "application/json",
      "Content-Type": "application/json"
    },
    body: JSON.stringify(body)
  });
  if (!res.ok) {
    const text = await res.text();
    console.error("Hotelbeds error:", text);
    throw new Error("Hotelbeds search error: " + text);
  }
}

export async function hotelbedsHold(payload) {
  const { sig, key } = signature();
  const url = "https://api.test.hotelbeds.com/hotel-api/1.0/bookings";
  const body = { ...payload, confirm: false }; // 모의 결제(홀드만)

  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Api-key": key,
      "X-Signature": sig,
      "Accept": "application/json",
      "Content-Type": "application/json"
    },
    body: JSON.stringify(body)
  });
  if (!res.ok) throw new Error("Hotelbeds hold error");
  const json = await res.json();
  return json;
}
