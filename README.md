# charting-app-simple

A simple crypto & forex charting app built with React, Vite, and [Finnhub](https://finnhub.io).

Pick Crypto or Forex, search a symbol, see the derived quote, and view a
daily price chart over 1M/3M/6M/1Y/5Y ranges. Finnhub's free tier does
**not** include historical stock candles, so this app deliberately sticks
to crypto (Binance) and forex (OANDA) instead.

## Setup

1. Get a free API key at [finnhub.io/register](https://finnhub.io/register).
2. Install dependencies:
   ```
   npm install
   ```
3. Start the dev server:
   ```
   npm run dev
   ```
4. On first load, paste your API key into the prompt (it's stored in your
   browser's `localStorage` and only ever sent to Finnhub). Alternatively,
   copy `.env.example` to `.env` and set `VITE_FINNHUB_API_KEY` to skip the
   prompt.

## Notes

- Only **daily** resolution candles are used — Finnhub's free tier doesn't
  include intraday data, so the chart shows daily closes, not live
  tick-by-tick movement.
- Finnhub has no standalone "quote" endpoint for crypto/forex, so the price
  and day-change shown are derived from the latest two daily candles.
- The API key lives entirely in the browser — there's no backend server, so
  don't use a key you need to keep secret from users of a deployed instance.
- If you see "Finnhub denied this request", double check the key is right;
  if it is, it likely means that data isn't included in your Finnhub plan
  (see [finnhub.io/pricing](https://finnhub.io/pricing)).

## Build

```
npm run build
```

Outputs a static site to `dist/`, deployable anywhere (Vercel, Netlify,
GitHub Pages, etc).
