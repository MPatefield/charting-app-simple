import { useEffect, useRef, useState } from 'react'
import { searchSymbols } from '../finnhub.js'

export default function SymbolSearch({ apiKey, onSelect }) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [open, setOpen] = useState(false)
  const containerRef = useRef(null)

  useEffect(() => {
    if (query.trim().length < 1) {
      setResults([])
      return
    }
    const timer = setTimeout(async () => {
      try {
        const matches = await searchSymbols(query.trim(), apiKey)
        setResults(matches.slice(0, 8))
        setOpen(true)
      } catch {
        setResults([])
      }
    }, 300)
    return () => clearTimeout(timer)
  }, [query, apiKey])

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
    setResults([])
    setOpen(false)
    onSelect(result.symbol)
  }

  function submitRaw(e) {
    e.preventDefault()
    if (!query.trim()) return
    pick({ symbol: query.trim().toUpperCase() })
  }

  return (
    <div ref={containerRef} style={{ position: 'relative' }}>
      <form onSubmit={submitRaw}>
        <input
          type="text"
          placeholder="Search symbol, e.g. AAPL"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => results.length > 0 && setOpen(true)}
          style={{
            width: '100%',
            padding: '10px 12px',
            borderRadius: 8,
            border: '1px solid var(--border)',
            background: 'var(--surface-1)',
            color: 'var(--text-primary)',
          }}
        />
      </form>
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
                <strong>{r.symbol}</strong>{' '}
                <span className="secondary">{r.description}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
