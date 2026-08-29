function fmt(n, digits) {
  return typeof n === 'number' && !Number.isNaN(n) ? n.toFixed(digits) : '—'
}

export default function QuoteCard({ label, quote, prefix = '', precision = 2 }) {
  if (!quote) return null

  const change = quote.d
  const changePercent = quote.dp
  const isUp = change >= 0
  const deltaColor = isUp ? 'var(--good)' : 'var(--critical)'
  const arrow = isUp ? '▲' : '▼'

  return (
    <div className="card stack">
      <div>
        <div className="secondary" style={{ fontSize: 14 }}>
          {label}
        </div>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginTop: 2 }}>
          <span className="tabular" style={{ fontSize: 34, fontWeight: 600 }}>
            {prefix}
            {fmt(quote.c, precision)}
          </span>
          <span className="tabular" style={{ color: deltaColor, fontSize: 16 }}>
            {arrow} {fmt(Math.abs(change), precision)} ({fmt(Math.abs(changePercent), 2)}%)
          </span>
        </div>
      </div>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: 12,
          borderTop: '1px solid var(--gridline)',
          paddingTop: 12,
        }}
      >
        <Stat label="Open" value={quote.o} prefix={prefix} precision={precision} />
        <Stat label="High" value={quote.h} prefix={prefix} precision={precision} />
        <Stat label="Low" value={quote.l} prefix={prefix} precision={precision} />
        <Stat label="Prev close" value={quote.pc} prefix={prefix} precision={precision} />
      </div>
    </div>
  )
}

function Stat({ label, value, prefix, precision }) {
  return (
    <div>
      <div className="muted" style={{ fontSize: 12 }}>
        {label}
      </div>
      <div className="tabular" style={{ fontSize: 14 }}>
        {prefix}
        {fmt(value, precision)}
      </div>
    </div>
  )
}
