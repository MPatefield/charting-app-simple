const TYPES = [
  { key: 'crypto', label: 'Crypto' },
  { key: 'forex', label: 'Forex' },
]

export default function AssetTypeTabs({ value, onChange }) {
  return (
    <div style={{ display: 'flex', gap: 4 }}>
      {TYPES.map(({ key, label }) => {
        const active = key === value
        return (
          <button
            key={key}
            type="button"
            onClick={() => onChange(key)}
            style={{
              padding: '6px 14px',
              borderRadius: 8,
              border: '1px solid var(--border)',
              background: active ? 'var(--series-1)' : 'transparent',
              color: active ? '#fff' : 'var(--text-secondary)',
              fontWeight: active ? 600 : 400,
            }}
          >
            {label}
          </button>
        )
      })}
    </div>
  )
}
