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
      throw new FinnhubError('Invalid or unauthorized Finnhub API key')
    }
    if (res.status === 429) {
      throw new FinnhubError('Finnhub rate limit reached, try again shortly')
    }
    throw new FinnhubError(`Finnhub request failed (${res.status})`)
  }
  return res.json()
}

// Current quote: current price, change, percent change, high/low/open, previous close
export function getQuote(symbol, apiKey) {
  return request('/quote', { symbol }, apiKey)
}

// Basic company info (name, industry, logo) for the searched symbol
export function getCompanyProfile(symbol, apiKey) {
  return request('/stock/profile2', { symbol }, apiKey)
}

// Symbol lookup, used to power the search box
export async function searchSymbols(query, apiKey) {
  const data = await request('/search', { q: query }, apiKey)
  return (data.result ?? []).filter((r) => r.type === 'Common Stock')
}

const RANGE_TO_SECONDS = {
  '1M': 60 * 60 * 24 * 30,
  '3M': 60 * 60 * 24 * 30 * 3,
  '6M': 60 * 60 * 24 * 30 * 6,
  '1Y': 60 * 60 * 24 * 365,
  '5Y': 60 * 60 * 24 * 365 * 5,
}

// Daily candles. Finnhub's free tier only supports daily ('D') resolution
// and higher, no intraday.
export async function getCandles(symbol, range, apiKey) {
  const to = Math.floor(Date.now() / 1000)
  const from = to - (RANGE_TO_SECONDS[range] ?? RANGE_TO_SECONDS['3M'])

  const data = await request(
    '/stock/candle',
    { symbol, resolution: 'D', from, to },
    apiKey
  )

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

export { FinnhubError }
