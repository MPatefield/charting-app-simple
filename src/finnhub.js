const BASE_URL = 'https://finnhub.io/api/v1'

class FinnhubError extends Error {}

async function request(path, params, apiKey) {
  if (!apiKey) throw new FinnhubError('Missing Finnhub API key')

  const url = new URL(`${BASE_URL}${path}`)
  for (const [key, value] of Object.entries(params)) {
    url.searchParams.set(key, value)
  }
  url.searchParams.set('token', apiKey)

  const res = await fetch(url)
  if (!res.ok) {
    if (res.status === 401 || res.status === 403) {
      throw new FinnhubError(
        `Finnhub denied this request (${res.status}). Either the API key is wrong, or your plan doesn't include this data — see finnhub.io/pricing.`
      )
    }
    if (res.status === 429) {
      throw new FinnhubError('Finnhub rate limit reached, try again shortly')
    }
    throw new FinnhubError(`Finnhub request failed (${res.status})`)
  }
  return res.json()
}

// Default exchanges: Binance (crypto) and OANDA (forex) are both free-tier
// accessible and have broad symbol coverage.
export const EXCHANGES = { crypto: 'binance', forex: 'oanda' }

export function getSymbols(kind, apiKey) {
  const path = kind === 'crypto' ? '/crypto/symbol' : '/forex/symbol'
  return request(path, { exchange: EXCHANGES[kind] }, apiKey)
}

const RANGE_TO_SECONDS = {
  '1M': 60 * 60 * 24 * 30,
  '3M': 60 * 60 * 24 * 30 * 3,
  '6M': 60 * 60 * 24 * 30 * 6,
  '1Y': 60 * 60 * 24 * 365,
  '5Y': 60 * 60 * 24 * 365 * 5,
}

// Daily candles for a crypto or forex symbol.
export async function getCandles(kind, symbol, range, apiKey) {
  const to = Math.floor(Date.now() / 1000)
  const from = to - (RANGE_TO_SECONDS[range] ?? RANGE_TO_SECONDS['3M'])
  const path = kind === 'crypto' ? '/crypto/candle' : '/forex/candle'

  const data = await request(path, { symbol, resolution: 'D', from, to }, apiKey)

  if (data.s !== 'ok') {
    return []
  }

  return data.t.map((timestamp, i) => ({
    date: new Date(timestamp * 1000).toISOString().slice(0, 10),
    close: data.c[i],
    open: data.o[i],
    high: data.h[i],
    low: data.l[i],
    volume: data.v[i],
  }))
}

// Finnhub has no standalone "quote" endpoint for crypto/forex — derive
// current price and day change from the last two daily candles instead.
export function deriveQuote(candles) {
  if (!candles || candles.length === 0) return null
  const latest = candles[candles.length - 1]
  const prev = candles.length > 1 ? candles[candles.length - 2] : latest
  const change = latest.close - prev.close
  const changePercent = prev.close !== 0 ? (change / prev.close) * 100 : 0
  return {
    c: latest.close,
    o: latest.open,
    h: latest.high,
    l: latest.low,
    pc: prev.close,
    d: change,
    dp: changePercent,
  }
}

export { FinnhubError }
