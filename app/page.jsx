<section className="bg-white shadow-lg rounded-2xl p-6 space-y-4">
  <h2 className="text-xl font-semibold text-sky-700">🛫 여행 검색</h2>
  <div className="grid md:grid-cols-3 gap-4">
    <div>
      <label className="label">출발지</label>
      <input className="input" value={form.origin} onChange={...}/>
    </div>
    <div>
      <label className="label">도착지</label>
      <input className="input" value={form.destination} onChange={...}/>
    </div>
    <div>
      <label className="label">성인 수</label>
      <input type="number" className="input" value={form.adults} onChange={...}/>
    </div>
    <div>
      <label className="label">출발일</label>
      <input type="date" className="input" value={form.departDate} onChange={...}/>
    </div>
    <div>
      <label className="label">귀국일</label>
      <input type="date" className="input" value={form.returnDate} onChange={...}/>
    </div>
    <div>
      <label className="label">통화</label>
      <input className="input" value={form.currency} onChange={...}/>
    </div>
  </div>
  <button className="btn bg-sky-600 hover:bg-sky-700" onClick={onSearch}>
    {loading ? "검색 중..." : "🔍 검색하기"}
  </button>
</section>
