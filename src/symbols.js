// Curated quick-pick list. Anything else is reachable via the widget's own
// built-in symbol search (click the symbol name inside a chart).
export const QUICK_SYMBOLS = [
  {
    group: 'Crypto',
    options: [
      { value: 'BINANCE:BTCUSDT', label: 'BTC/USDT' },
      { value: 'BINANCE:ETHUSDT', label: 'ETH/USDT' },
      { value: 'BINANCE:SOLUSDT', label: 'SOL/USDT' },
      { value: 'BINANCE:XRPUSDT', label: 'XRP/USDT' },
      { value: 'BINANCE:BNBUSDT', label: 'BNB/USDT' },
      { value: 'BINANCE:ADAUSDT', label: 'ADA/USDT' },
      { value: 'BINANCE:DOGEUSDT', label: 'DOGE/USDT' },
    ],
  },
  {
    group: 'Forex',
    options: [
      { value: 'OANDA:EURUSD', label: 'EUR/USD' },
      { value: 'OANDA:GBPUSD', label: 'GBP/USD' },
      { value: 'OANDA:USDJPY', label: 'USD/JPY' },
      { value: 'OANDA:AUDUSD', label: 'AUD/USD' },
      { value: 'OANDA:USDCAD', label: 'USD/CAD' },
      { value: 'OANDA:USDCHF', label: 'USD/CHF' },
      { value: 'OANDA:NZDUSD', label: 'NZD/USD' },
      { value: 'OANDA:EURGBP', label: 'EUR/GBP' },
    ],
  },
]

export const DEFAULT_SYMBOLS = QUICK_SYMBOLS.flatMap((g) => g.options.map((o) => o.value))

export function labelFor(symbol) {
  for (const group of QUICK_SYMBOLS) {
    const match = group.options.find((o) => o.value === symbol)
    if (match) return match.label
  }
  return symbol
}
