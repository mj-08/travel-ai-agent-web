
# Travel AI Agent Web (Amadeus + Hotelbeds)

Next.js(App Router) + Serverless API(Vercel) + Tailwind UI.
- 자연어 대신 간단 폼으로 입력 → 서버(API routes)에서 Amadeus/Hotelbeds 호출
- 결과를 **최저가 / 최단시간 / 최소리스크** 3가지로 묶어 카드로 표시
- **모의 결제 직전**까지(Hotelbeds confirm=false)

## Run Local
```bash
cp .env.example .env.local
# 위 파일에 Amadeus/Hotelbeds 샌드박스 자격증명 입력
npm i
npm run dev
```
- http://localhost:3000

## Deploy on Vercel
1. GitHub에 푸시 → Vercel에서 Import  
2. Project Settings → Environment Variables에 `.env.local`의 값을 그대로 추가  
3. Deploy

## API
- `POST /api/search` : 항공+호텔 검색 후 3개 번들 반환
- `POST /api/checkout` : 선택 번들로 항공 가격 재확인 + 호텔 hold(confirm=false)

> 참고: 실제 결제는 하지 않습니다. Hotelbeds **confirm=false** 로 홀드만 수행합니다.
