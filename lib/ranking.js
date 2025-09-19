
import { offerDurationMinutes, offerStops, crossAirportTransfer, offerTotalPriceKRW } from "./amadeus";

export function pickFlights(offers) {
  const byPrice = [...(offers || [])].sort((a,b)=> offerTotalPriceKRW(a) - offerTotalPriceKRW(b));
  const byDuration = [...(offers || [])].sort((a,b)=> offerDurationMinutes(a) - offerDurationMinutes(b));
  const byRisk = [...(offers || [])].sort((a,b)=> riskScore(a) - riskScore(b));
  return {
    cheapest: byPrice[0],
    fastest: byDuration[0],
    lowRisk: byRisk[0]
  };
}

export function riskScore(offer) {
  let s = 0;
  s += offerStops(offer) * 50;
  s += crossAirportTransfer(offer) ? 80 : 0;
  return s;
}

export function pickHotels(hbResp) {
  const hotels = (hbResp?.hotels?.hotels || []).map((h)=> ({
    id: h.code,
    name: h.name?.content,
    price: Number(h.minRate || h.totalNet || 0),
    freeCancel: !!h.cancellationPolicies?.some((p)=> p.type === "FREE"),
    raw: h
  }));
  if (!hotels.length) return { cheapest: null, lowRisk: null };
  const byPrice = [...hotels].sort((a,b)=> a.price - b.price);
  const byRisk = [...hotels].sort((a,b)=> hotelRisk(a) - hotelRisk(b));
  return { cheapest: byPrice[0], lowRisk: byRisk[0] };
}

function hotelRisk(h) {
  let s = 100;
  s -= h.freeCancel ? 20 : 0;
  return s;
}
