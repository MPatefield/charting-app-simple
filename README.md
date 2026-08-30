# charting-app-simple

A multi-chart crypto & forex dashboard built with React, Vite, and
TradingView's free **Advanced Real-Time Chart** widget.

Pick a layout (1/2/4/6/8 panes), and each pane gets its own live,
fully-interactive TradingView chart — including its built-in drawing
toolbar (trend lines, curves, Fibonacci, shapes, and the rest) and its own
symbol search. A quick-pick dropdown above each pane covers common
crypto/forex pairs; click the chart's own symbol name for anything else
TradingView supports.

## Why TradingView's widget instead of building charts from scratch

Live market data plus a full annotation toolset (trend lines, curve
drawing, editing) is most of the hard work in a tool like this. TradingView
gives both away for free via this widget — no backend, no API key. The
tradeoff: TradingView branding stays on each chart (their attribution link
must not be removed — see Licensing below), we don't control the data
pipeline, and drawings a viewer makes are stored by the widget itself, not
by this app (see Persistence below).

## Setup

```
npm install
npm run dev
```

No API key needed — the widget handles data itself.

## Layout & persistence

The chosen layout (pane count + which symbol each pane shows) is saved to
the browser's `localStorage` (see `src/layoutStorage.js`) so it's there on
your next visit. That file is intentionally the only place layout state is
read/written — if this becomes a paid product with user accounts, swap its
two functions for API calls and nothing else in the app needs to change.

Drawings/annotations are a separate story: they live inside the TradingView
widget itself, not in this app's state. Anonymously, they persist in that
browser via the widget's own local storage; a viewer who signs into their
TradingView account inside the widget gets them synced to their TradingView
account instead. There's no hook here to save a user's drawings into our
own backend — that would require TradingView's paid Charting Library /
Trading Platform product, not the free widget.

## Licensing — read before charging for this

TradingView's widget is free for embedding **with attribution kept intact**
(the "Track all markets on TradingView" link in each pane — don't remove
or hide it). Their terms say commercial use isn't permitted without a
separate agreement with TradingView. That's fine for building/demoing this,
but **before launching this as a paid product, talk to TradingView about a
commercial license** — this is a business step, not something fixable in
code. See [tradingview.com/policies](https://www.tradingview.com/policies/).

## Build

```
npm run build
```

Outputs a static site to `dist/`, deployable anywhere (Vercel, Netlify,
GitHub Pages, etc).
