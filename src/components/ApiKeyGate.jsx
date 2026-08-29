import { useState } from 'react'

const STORAGE_KEY = 'finnhub_api_key'

export function loadStoredApiKey() {
  try {
    return localStorage.getItem(STORAGE_KEY) ?? import.meta.env.VITE_FINNHUB_API_KEY ?? ''
  } catch {
    return import.meta.env.VITE_FINNHUB_API_KEY ?? ''
  }
}

export default function ApiKeyGate({ onSave }) {
  const [value, setValue] = useState('')

  function handleSubmit(e) {
    e.preventDefault()
    const key = value.trim()
    if (!key) return
    try {
      localStorage.setItem(STORAGE_KEY, key)
    } catch {
      // localStorage unavailable (private browsing, etc); key still works for this session
    }
    onSave(key)
  }

  return (
    <div className="card stack">
      <div>
        <strong>Add your Finnhub API key</strong>
        <p className="secondary" style={{ marginTop: 4 }}>
          Get a free key at{' '}
          <a href="https://finnhub.io/register" target="_blank" rel="noreferrer">
            finnhub.io/register
          </a>
          . It's stored only in your browser, never sent anywhere but Finnhub.
        </p>
      </div>
      <form onSubmit={handleSubmit} style={{ display: 'flex', gap: 8 }}>
        <input
          type="password"
          placeholder="Finnhub API key"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          style={{
            flex: 1,
            padding: '8px 10px',
            borderRadius: 8,
            border: '1px solid var(--border)',
            background: 'var(--page)',
            color: 'var(--text-primary)',
          }}
        />
        <button
          type="submit"
          style={{
            padding: '8px 14px',
            borderRadius: 8,
            border: '1px solid var(--border)',
            background: 'var(--series-1)',
            color: '#fff',
          }}
        >
          Save
        </button>
      </form>
    </div>
  )
}
