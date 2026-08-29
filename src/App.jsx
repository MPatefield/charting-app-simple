import { useEffect, useState } from 'react'
import ApiKeyGate, { loadStoredApiKey } from './components/ApiKeyGate.jsx'
import AssetTypeTabs from './components/AssetTypeTabs.jsx'
import SymbolPicker from './components/SymbolPicker.jsx'
import QuoteCard from './components/QuoteCard.jsx'
import RangeSelector from './components/RangeSelector.jsx'
import PriceChart from './components/PriceChart.jsx'
import { getSymbols, getCandles, deriveQuote, FinnhubError } from './finnhub.js'

const LAST_SYMBOL_KEY = 'last_symbol_v2'

const DEFAULTS = {
  crypto: { symbol: 'BINANCE:BTCUSDT', displaySymbol: 'BTCUSDT', description: 'Bitcoin / TetherUS' },
  forex: { symbol: 'OANDA:EUR_USD', displaySymbol: 'EUR/USD', description: 'Euro / US Dollar' },
}

const DISPLAY = {
  crypto: { prefix: '$', precision: 2 },
  forex: { prefix: '', precision: 4 },
}

function loadLastSelection() {
  try {
    const raw = localStorage.getItem(LAST_SYMBOL_KEY)
    return raw ? JSON.parse(raw) : {}
  } catch {
    return {}
  }
}

export default function App() {
  const [apiKey, setApiKey] = useState(loadStoredApiKey)
  const [assetType, setAssetType] = useState('crypto')
  const [selection, setSelection] = useState(() => {
    const last = loadLastSelection()
    return { crypto: last.crypto ?? DEFAULTS.crypto, forex: last.forex ?? DEFAULTS.forex }
  })

  const [symbolLists, setSymbolLists] = useState({ crypto: null, forex: null })
  const [symbolsError, setSymbolsError] = useState('')

  const [range, setRange] = useState('3M')
  const [candles, setCandles] = useState([])
  const [candlesLoading, setCandlesLoading] = useState(false)
  const [candlesError, setCandlesError] = useState('')

  const active = selection[assetType]
  const { prefix, precision } = DISPLAY[assetType]

  // Load the symbol list for an asset type once, on first use.
  useEffect(() => {
    if (!apiKey || symbolLists[assetType] !== null) return
    let cancelled = false
    setSymbolsError('')
    getSymbols(assetType, apiKey)
      .then((list) => {
        if (cancelled) return
        setSymbolLists((prev) => ({ ...prev, [assetType]: list }))
      })
      .catch((err) => {
        if (cancelled) return
        setSymbolsError(err instanceof FinnhubError ? err.message : 'Failed to load symbol list')
      })
    return () => {
      cancelled = true
    }
  }, [apiKey, assetType, symbolLists])

  // Load candles for the active symbol/range.
  useEffect(() => {
    if (!apiKey || !active) return
    let cancelled = false
    setCandlesLoading(true)
    setCandlesError('')

    getCandles(assetType, active.symbol, range, apiKey)
      .then((c) => {
        if (cancelled) return
        if (c.length === 0) {
          setCandlesError(`No candle data returned for ${active.displaySymbol}`)
        }
        setCandles(c)
      })
      .catch((err) => {
        if (cancelled) return
        setCandlesError(err instanceof FinnhubError ? err.message : 'Something went wrong')
        setCandles([])
      })
      .finally(() => {
        if (!cancelled) setCandlesLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [apiKey, assetType, active, range])

  function selectSymbol(result) {
    setSelection((prev) => {
      const next = { ...prev, [assetType]: result }
      try {
        localStorage.setItem(LAST_SYMBOL_KEY, JSON.stringify(next))
      } catch {
        // ignore
      }
      return next
    })
  }

  const quote = deriveQuote(candles)

  return (
    <>
      <h1>Live Crypto & Forex Charts</h1>
      <div className="stack">
        {!apiKey && <ApiKeyGate onSave={setApiKey} />}

        {apiKey && (
          <>
            <AssetTypeTabs value={assetType} onChange={setAssetType} />
            <SymbolPicker
              symbols={symbolLists[assetType]}
              loading={symbolLists[assetType] === null}
              onSelect={selectSymbol}
            />

            {symbolsError && <p className="error-text">{symbolsError}</p>}
            {candlesError && <p className="error-text">{candlesError}</p>}
            {candlesLoading && !quote && <p className="muted">Loading {active.displaySymbol}…</p>}

            {quote && (
              <QuoteCard label={active.description || active.displaySymbol} quote={quote} prefix={prefix} precision={precision} />
            )}

            <div className="card stack">
              <RangeSelector value={range} onChange={setRange} />
              <PriceChart symbol={active.displaySymbol} data={candles} prefix={prefix} precision={precision} />
            </div>
          </>
        )}
      </div>
    </>
  )
}
