import TradingViewWidget from './TradingViewWidget.jsx'
import { QUICK_SYMBOLS, labelFor } from '../symbols.js'

export default function ChartPane({ symbol, onSymbolChange }) {
  return (
    <div className="card stack" style={{ padding: 8, gap: 8 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 4px' }}>
        <span className="secondary" style={{ fontSize: 13, fontWeight: 600 }}>
          {labelFor(symbol)}
        </span>
        <select
          value={symbol}
          onChange={(e) => onSymbolChange(e.target.value)}
          style={{
            fontSize: 12,
            padding: '4px 6px',
            borderRadius: 6,
            border: '1px solid var(--border)',
            background: 'var(--surface-1)',
            color: 'var(--text-primary)',
          }}
        >
          {QUICK_SYMBOLS.map((group) => (
            <optgroup key={group.group} label={group.group}>
              {group.options.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </optgroup>
          ))}
        </select>
      </div>
      <div style={{ height: 420 }}>
        <TradingViewWidget symbol={symbol} />
      </div>
    </div>
  )
}
