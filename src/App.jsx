import { useEffect, useState } from 'react'
import LayoutPicker from './components/LayoutPicker.jsx'
import ChartPane from './components/ChartPane.jsx'
import { DEFAULT_SYMBOLS } from './symbols.js'
import { loadLayout, saveLayout } from './layoutStorage.js'

function initialLayout() {
  const saved = loadLayout()
  if (saved) return saved
  return { count: 4, symbols: DEFAULT_SYMBOLS.slice(0, 4) }
}

// Reconciles a new pane count against the existing symbol choices, keeping
// what's already picked and filling new panes from the defaults.
function resizeSymbols(symbols, count) {
  const next = symbols.slice(0, count)
  let i = 0
  while (next.length < count) {
    const candidate = DEFAULT_SYMBOLS[i % DEFAULT_SYMBOLS.length]
    if (!next.includes(candidate)) next.push(candidate)
    i += 1
  }
  return next
}

const GRID_COLUMNS = { 1: 1, 2: 2, 4: 2, 6: 3, 8: 4 }

export default function App() {
  const [layout, setLayout] = useState(initialLayout)

  useEffect(() => {
    saveLayout(layout)
  }, [layout])

  function handleCountChange(count) {
    setLayout((prev) => ({ count, symbols: resizeSymbols(prev.symbols, count) }))
  }

  function handleSymbolChange(index, symbol) {
    setLayout((prev) => {
      const symbols = [...prev.symbols]
      symbols[index] = symbol
      return { ...prev, symbols }
    })
  }

  return (
    <>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
        <h1 style={{ margin: 0 }}>Crypto & Forex Charts</h1>
        <LayoutPicker value={layout.count} onChange={handleCountChange} />
      </div>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${GRID_COLUMNS[layout.count]}, 1fr)`,
          gap: 16,
        }}
      >
        {layout.symbols.map((symbol, index) => (
          <ChartPane
            key={index}
            symbol={symbol}
            onSymbolChange={(next) => handleSymbolChange(index, next)}
          />
        ))}
      </div>
    </>
  )
}
