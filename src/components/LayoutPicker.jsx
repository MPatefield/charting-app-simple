const COUNTS = [1, 2, 4, 6, 8]

export default function LayoutPicker({ value, onChange }) {
  return (
    <div style={{ display: 'flex', gap: 4 }}>
      {COUNTS.map((n) => {
        const active = n === value
        return (
          <button
            key={n}
            type="button"
            onClick={() => onChange(n)}
            title={`${n} chart${n === 1 ? '' : 's'}`}
            style={{
              padding: '6px 14px',
              borderRadius: 8,
              border: '1px solid var(--border)',
              background: active ? 'var(--series-1)' : 'transparent',
              color: active ? '#fff' : 'var(--text-secondary)',
              fontWeight: active ? 600 : 400,
            }}
          >
            {n}
          </button>
        )
      })}
    </div>
  )
}
