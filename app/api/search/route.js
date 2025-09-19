
import { amadeusSearchFlights, offerTotalPriceKRW } from "@/lib/amadeus";
import { hotelbedsSearch } from "@/lib/hotelbeds";
import { pickFlights, pickHotels } from "@/lib/ranking";

export async function POST(req) {
  try {
    const body = await req.json();
    const {
      origin = "ICN",
      destination = "TYO",
      departDate,
      returnDate,
      adults = 1,
      currency = process.env.DEFAULT_CURRENCY || "KRW",
      cabin = "ECONOMY",
      hotel
    } = body;

    if (!departDate || !returnDate) {
      return new Response(JSON.stringify({ error: "departDate/returnDate required" }), { status: 400 });
    }

    const [flights, hb] = await Promise.all([
      amadeusSearchFlights({ origin, destination, departDate, returnDate, adults, currency, cabin }),
      hotelbedsSearch({
        city: hotel?.city || "Tokyo",
        checkIn: hotel?.checkIn || departDate,
        checkOut: hotel?.checkOut || returnDate,
        rooms: hotel?.rooms || 1,
        adultsPerRoom: hotel?.adultsPerRoom || adults,
        currency,
        maxPrice: hotel?.maxPrice
      })
    ]);

    const f = pickFlights(flights || []);
    const h = pickHotels(hb);
    const bundles = [
      { label: "CHEAPEST", flight: f.cheapest, hotel: h.cheapest },
      { label: "FASTEST",  flight: f.fastest,  hotel: h.lowRisk || h.cheapest },
      { label: "LOW_RISK", flight: f.lowRisk, hotel: h.lowRisk || h.cheapest }
    ].filter(b => b.flight && b.hotel).map(b=> ({
      ...b,
      totalPrice: (offerTotalPriceKRW(b.flight) || 0) + Number(b.hotel?.price || 0)
    }));

    return Response.json({ bundles, meta: { flights: flights?.length || 0, hotels: hb?.hotels?.total || 0 } });
  } catch (e) {
    console.error(e);
    return new Response(JSON.stringify({ error: e?.message || "search_failed" }), { status: 500 });
  }
}
