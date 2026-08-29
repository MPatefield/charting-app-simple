import { useEffect, useRef, useState } from 'react'

// Crypto symbol lists (Binance via Finnhub) run into the thousands, so cap
// suggestions and prefer common USD/USDT-quoted pairs until the user types.
function rank(symbols, query) {
  const q = query.trim().toLowerCase()
  const pool = q
    ? symbols.filter(
        (s) =>
          s.displaySymbol.toLowerCase().includes(q) ||
          s.description?.toLowerCase().includes(q)
      )
    : symbols.filter((s) => /usdt?$/i.test(s.displaySymbol.replace(/[/_]/g, '')))
  return pool.slice(0, 8)
}

export default function SymbolPicker({ symbols, loading, onSelect }) {
  const [query, setQuery] = useState('')
  const [open, setOpen] = useState(false)
  const containerRef = useRef(null)

  const results = symbols ? rank(symbols, query) : []

  useEffect(() => {
    function handleClickOutside(e) {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  function pick(result) {
    setQuery('')
    setOpen(false)
    onSelect(result)
  }

  return (
    <div ref={containerRef} style={{ position: 'relative' }}>
      <input
        type="text"
        placeholder={loading ? 'Loading symbols…' : 'Search symbol, e.g. BTC or EUR/USD'}
        value={query}
        disabled={loading}
        onChange={(e) => setQuery(e.target.value)}
        onFocus={() => setOpen(true)}
        style={{
          width: '100%',
          padding: '10px 12px',
          borderRadius: 8,
          border: '1px solid var(--border)',
          background: 'var(--surface-1)',
          color: 'var(--text-primary)',
        }}
      />
      {open && results.length > 0 && (
        <ul
          className="card"
          style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            marginTop: 4,
            padding: 4,
            listStyle: 'none',
            zIndex: 10,
            maxHeight: 280,
            overflowY: 'auto',
          }}
        >
          {results.map((r) => (
            <li key={r.symbol}>
              <button
                type="button"
                onClick={() => pick(r)}
                style={{
                  width: '100%',
                  textAlign: 'left',
                  padding: '8px 10px',
                  borderRadius: 6,
                  border: 'none',
                  background: 'transparent',
                  color: 'var(--text-primary)',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--page)')}
                onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
              >
                <strong>{r.displaySymbol}</strong>{' '}
                <span className="secondary">{r.description}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
