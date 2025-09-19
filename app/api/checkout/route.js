
import { amadeusPriceOffer } from "@/lib/amadeus";
import { hotelbedsHold } from "@/lib/hotelbeds";

export async function POST(req) {
  try {
    const body = await req.json();
    const { bundle, traveler, guest } = body;

    if (!bundle?.flight || !bundle?.hotel) {
      return new Response(JSON.stringify({ error: "bundle.flight and bundle.hotel required" }), { status: 400 });
    }

    const priced = await amadeusPriceOffer(bundle.flight);

    const hbPayload = {
      holder: { name: guest?.name || "TEST", surname: guest?.surname || "USER" },
      clientReference: "MOCK-CHECKOUT",
      rooms: [
        {
          rateKey: bundle.hotel?.raw?.rooms?.[0]?.rates?.[0]?.rateKey || bundle.hotel?.raw?.rateKey,
          paxes: [{ type: "AD", age: 30 }, { type: "AD", age: 30 }]
        }
      ]
    };
    const hold = await hotelbedsHold(hbPayload);

    return Response.json({
      checkoutId: String(Date.now()),
      note: "Mock checkout — no real payment",
      flightPriced: priced,
      hotelHold: hold
    });
  } catch (e) {
    console.error(e);
    return new Response(JSON.stringify({ error: e?.message || "checkout_failed" }), { status: 500 });
  }
}
