import { useState } from 'react'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'

function CustomTooltip({ active, payload, label, prefix, precision }) {
  if (!active || !payload?.length) return null
  return (
    <div
      className="card"
      style={{ padding: '8px 10px', fontSize: 13, boxShadow: '0 2px 8px rgba(0,0,0,0.12)' }}
    >
      <div className="muted" style={{ fontSize: 11, marginBottom: 2 }}>
        {label}
      </div>
      <div className="tabular" style={{ fontWeight: 600 }}>
        {prefix}
        {payload[0].value.toFixed(precision)}
      </div>
    </div>
  )
}

export default function PriceChart({ symbol, data, prefix = '', precision = 2 }) {
  const [showTable, setShowTable] = useState(false)

  if (!data || data.length === 0) {
    return <p className="muted">No candle data for this range.</p>
  }

  const tickInterval = Math.max(Math.floor(data.length / 6), 1)

  return (
    <div className="stack">
      <div style={{ width: '100%', height: 280 }}>
        <ResponsiveContainer>
          <AreaChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="priceFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--series-1)" stopOpacity={0.22} />
                <stop offset="100%" stopColor="var(--series-1)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid stroke="var(--gridline)" vertical={false} />
            <XAxis
              dataKey="date"
              interval={tickInterval}
              tick={{ fill: 'var(--text-muted)', fontSize: 11 }}
              axisLine={{ stroke: 'var(--baseline)' }}
              tickLine={false}
            />
            <YAxis
              domain={['auto', 'auto']}
              tick={{ fill: 'var(--text-muted)', fontSize: 11 }}
              axisLine={false}
              tickLine={false}
              width={64}
              tickFormatter={(v) => `${prefix}${v.toFixed(precision === 2 ? 0 : precision)}`}
            />
            <Tooltip
              content={<CustomTooltip prefix={prefix} precision={precision} />}
              cursor={{ stroke: 'var(--baseline)' }}
            />
            <Area
              type="monotone"
              dataKey="close"
              stroke="var(--series-1)"
              strokeWidth={2}
              fill="url(#priceFill)"
              dot={false}
              activeDot={{ r: 4, strokeWidth: 0 }}
              name={symbol}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      <button
        type="button"
        onClick={() => setShowTable((s) => !s)}
        className="secondary"
        style={{ background: 'none', border: 'none', fontSize: 13, alignSelf: 'flex-start', padding: 0 }}
      >
        {showTable ? 'Hide' : 'Show'} data table
      </button>
      {showTable && (
        <div style={{ maxHeight: 240, overflowY: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
            <thead>
              <tr>
                {['Date', 'Open', 'High', 'Low', 'Close'].map((h) => (
                  <th
                    key={h}
                    className="muted"
                    style={{ textAlign: 'right', padding: '4px 8px', borderBottom: '1px solid var(--gridline)' }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[...data].reverse().map((row) => (
                <tr key={row.date}>
                  <td style={{ padding: '4px 8px' }}>{row.date}</td>
                  <td className="tabular" style={{ padding: '4px 8px', textAlign: 'right' }}>
                    {row.open.toFixed(precision)}
                  </td>
                  <td className="tabular" style={{ padding: '4px 8px', textAlign: 'right' }}>
                    {row.high.toFixed(precision)}
                  </td>
                  <td className="tabular" style={{ padding: '4px 8px', textAlign: 'right' }}>
                    {row.low.toFixed(precision)}
                  </td>
                  <td className="tabular" style={{ padding: '4px 8px', textAlign: 'right' }}>
                    {row.close.toFixed(precision)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
