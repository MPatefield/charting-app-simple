const RANGES = ['1M', '3M', '6M', '1Y', '5Y']

export default function RangeSelector({ value, onChange }) {
  return (
    <div style={{ display: 'flex', gap: 4 }}>
      {RANGES.map((r) => {
        const active = r === value
        return (
          <button
            key={r}
            type="button"
            onClick={() => onChange(r)}
            style={{
              padding: '6px 12px',
              borderRadius: 8,
              border: '1px solid var(--border)',
              background: active ? 'var(--series-1)' : 'transparent',
              color: active ? '#fff' : 'var(--text-secondary)',
              fontWeight: active ? 600 : 400,
            }}
          >
            {r}
          </button>
        )
      })}
    </div>
  )
}
