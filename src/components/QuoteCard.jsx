function fmt(n, digits = 2) {
  return typeof n === 'number' && !Number.isNaN(n) ? n.toFixed(digits) : '—'
}

export default function QuoteCard({ symbol, companyName, quote }) {
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
          {companyName || symbol}
        </div>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginTop: 2 }}>
          <span className="tabular" style={{ fontSize: 34, fontWeight: 600 }}>
            ${fmt(quote.c)}
          </span>
          <span className="tabular" style={{ color: deltaColor, fontSize: 16 }}>
            {arrow} {fmt(Math.abs(change))} ({fmt(Math.abs(changePercent))}%)
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
        <Stat label="Open" value={fmt(quote.o)} />
        <Stat label="High" value={fmt(quote.h)} />
        <Stat label="Low" value={fmt(quote.l)} />
        <Stat label="Prev close" value={fmt(quote.pc)} />
      </div>
    </div>
  )
}

function Stat({ label, value }) {
  return (
    <div>
      <div className="muted" style={{ fontSize: 12 }}>
        {label}
      </div>
      <div className="tabular" style={{ fontSize: 14 }}>
        ${value}
      </div>
    </div>
  )
}
