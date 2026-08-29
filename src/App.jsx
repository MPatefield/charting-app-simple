import { useEffect, useState } from 'react'
import ApiKeyGate, { loadStoredApiKey } from './components/ApiKeyGate.jsx'
import SymbolSearch from './components/SymbolSearch.jsx'
import QuoteCard from './components/QuoteCard.jsx'
import RangeSelector from './components/RangeSelector.jsx'
import StockChart from './components/StockChart.jsx'
import { getQuote, getCompanyProfile, getCandles, FinnhubError } from './finnhub.js'

const LAST_SYMBOL_KEY = 'last_symbol'

export default function App() {
  const [apiKey, setApiKey] = useState(loadStoredApiKey)
  const [symbol, setSymbol] = useState(() => {
    try {
      return localStorage.getItem(LAST_SYMBOL_KEY) || 'AAPL'
    } catch {
      return 'AAPL'
    }
  })
  const [range, setRange] = useState('3M')
  const [quote, setQuote] = useState(null)
  const [companyName, setCompanyName] = useState('')
  const [candles, setCandles] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!apiKey || !symbol) return
    let cancelled = false
    setLoading(true)
    setError('')

    Promise.all([
      getQuote(symbol, apiKey),
      getCompanyProfile(symbol, apiKey).catch(() => null),
      getCandles(symbol, range, apiKey),
    ])
      .then(([q, profile, c]) => {
        if (cancelled) return
        if (!q || q.c === 0) {
          setError(`No data found for "${symbol}"`)
          setQuote(null)
          setCandles([])
          return
        }
        setQuote(q)
        setCompanyName(profile?.name || '')
        setCandles(c)
        try {
          localStorage.setItem(LAST_SYMBOL_KEY, symbol)
        } catch {
          // ignore
        }
      })
      .catch((err) => {
        if (cancelled) return
        setError(err instanceof FinnhubError ? err.message : 'Something went wrong')
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [apiKey, symbol, range])

  return (
    <>
      <h1>Stock Charts</h1>
      <div className="stack">
        {!apiKey && <ApiKeyGate onSave={setApiKey} />}

        {apiKey && (
          <>
            <SymbolSearch apiKey={apiKey} onSelect={setSymbol} />

            {error && <p className="error-text">{error}</p>}
            {loading && !quote && <p className="muted">Loading {symbol}…</p>}

            {quote && (
              <>
                <QuoteCard symbol={symbol} companyName={companyName} quote={quote} />
                <div className="card stack">
                  <RangeSelector value={range} onChange={setRange} />
                  <StockChart symbol={symbol} data={candles} />
                </div>
              </>
            )}
          </>
        )}
      </div>
    </>
  )
}
