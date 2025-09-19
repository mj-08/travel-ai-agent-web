
let _tokenCache = null;

async function getToken() {
  const now = Math.floor(Date.now() / 1000);
  if (_tokenCache && _tokenCache.exp > now + 30) return _tokenCache.token;

  const host = process.env.AMADEUS_HOST || "test.api.amadeus.com";
  const url = `https://${host}/v1/security/oauth2/token`;

  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "client_credentials",
      client_id: process.env.AMADEUS_CLIENT_ID || "",
      client_secret: process.env.AMADEUS_CLIENT_SECRET || ""
    })
  });
  if (!res.ok) throw new Error("Amadeus token error");
  const data = await res.json();
  _tokenCache = { token: data.access_token, exp: Math.floor(Date.now()/1000) + data.expires_in };
  return _tokenCache.token;
}

export async function amadeusSearchFlights({ origin, destination, departDate, returnDate, adults, currency, cabin }) {
  const token = await getToken();
  const host = process.env.AMADEUS_HOST || "test.api.amadeus.com";
  const url = new URL(`https://${host}/v2/shopping/flight-offers`);
  url.searchParams.set("originLocationCode", origin);
  url.searchParams.set("destinationLocationCode", destination);
  url.searchParams.set("departureDate", departDate);
  url.searchParams.set("returnDate", returnDate);
  url.searchParams.set("adults", String(adults));
  url.searchParams.set("currencyCode", currency || "KRW");
  url.searchParams.set("travelClass", cabin || "ECONOMY");
  url.searchParams.set("max", "50");
  url.searchParams.set("nonStop", "false");

  const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
  if (!res.ok) throw new Error("Amadeus search error");
  const json = await res.json();
  return json.data;
}

export async function amadeusPriceOffer(offer) {
  const token = await getToken();
  const host = process.env.AMADEUS_HOST || "test.api.amadeus.com";
  const url = `https://${host}/v2/shopping/flight-offers/pricing`;
  const res = await fetch(url, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify({ data: { type: "flight-offers-pricing", flightOffers: [offer] } })
  });
  if (!res.ok) throw new Error("Amadeus pricing error");
  const json = await res.json();
  return json.data;
}

export function offerTotalPriceKRW(offer) {
  const total = Number(offer?.price?.grandTotal ?? offer?.price?.total ?? 0);
  return total;
}

export function offerDurationMinutes(offer) {
  const parse = (s) => {
    const m = /PT(?:(\d+)H)?(?:(\d+)M)?/.exec(s || "") || [];
    const h = Number(m[1] || 0), mm = Number(m[2] || 0);
    return h*60 + mm;
  };
  try {
    return (offer.itineraries || []).reduce((acc, it) => acc + parse(it.duration), 0);
  } catch { return 0; }
}

export function offerStops(offer) {
  try {
    return (offer.itineraries || []).reduce((acc, it) => acc + Math.max(0, (it.segments?.length || 1) - 1), 0);
  } catch { return 0; }
}

export function crossAirportTransfer(offer) {
  try {
    const it = offer.itineraries?.[0];
    if (!it) return false;
    for (let i=1;i<it.segments.length;i++) {
      const prev = it.segments[i-1];
      const seg = it.segments[i];
      if (prev.arrival?.iataCode && seg.departure?.iataCode && prev.arrival.iataCode !== seg.departure.iataCode) return true;
    }
    return false;
  } catch { return false; }
}
