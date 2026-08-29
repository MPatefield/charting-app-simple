# charting-app-simple

A simple stock/share charting app built with React, Vite, and [Finnhub](https://finnhub.io).

Search a symbol, see the current quote, and view a daily price chart over
1M/3M/6M/1Y/5Y ranges.

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

- Finnhub's free tier only provides **daily** resolution candles (no
  intraday), so the chart shows daily closes rather than live tick-by-tick
  movement.
- The API key lives entirely in the browser — there's no backend server, so
  don't use a key you need to keep secret from users of a deployed instance.

## Build

```
npm run build
```

Outputs a static site to `dist/`, deployable anywhere (Vercel, Netlify,
GitHub Pages, etc).
