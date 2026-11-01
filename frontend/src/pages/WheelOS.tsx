import { Activity, CircleDollarSign, Gauge, ShieldCheck, TrendingUp } from 'lucide-react'

const metrics = [
  ['VIX / VVIX', '— / —', 'Volatility'],
  ['MOVE', '—', 'Rates risk'],
  ['Market Breadth', '—', '% > 200DMA'],
  ['Gamma Regime', '—', 'Put Wall / Flip'],
]

const wheels = [
  { symbol: 'SPY', status: 'WAIT', action: '等待市场数据', dte: '7–30D', delta: '0.08–0.12', position: '—' },
  { symbol: 'QQQ', status: 'WAIT', action: '等待市场数据', dte: '7–30D', delta: '0.08–0.12', position: '—' },
]

export function WheelOS() {
  return (
    <div className="min-h-full bg-base p-6 text-foreground">
      <div className="mx-auto max-w-7xl space-y-6">
        <header className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <div className="text-xs font-semibold uppercase tracking-[0.28em] text-accent">YOYO CAPITAL</div>
            <h1 className="mt-2 text-3xl font-semibold">Index Wheel OS</h1>
            <p className="mt-2 text-sm text-muted">SPY / QQQ · Sell PUT → Assignment → Covered Call → Called Away → Cash</p>
          </div>
          <div className="rounded-xl border border-border bg-elevated/40 px-4 py-3 text-right">
            <div className="text-[11px] uppercase tracking-wider text-muted">Market Regime</div>
            <div className="mt-1 flex items-center gap-2 font-semibold"><Gauge className="h-4 w-4 text-warning" /> DATA PENDING</div>
          </div>
        </header>

        <section className="grid gap-3 md:grid-cols-4">
          {metrics.map(([label, value, note]) => (
            <div key={label} className="rounded-xl border border-border bg-elevated/35 p-4">
              <div className="text-xs text-muted">{label}</div>
              <div className="mt-2 font-mono text-xl font-semibold">{value}</div>
              <div className="mt-1 text-[11px] text-secondary">{note}</div>
            </div>
          ))}
        </section>

        <section className="grid gap-4 lg:grid-cols-3">
          <div className="rounded-xl border border-border bg-elevated/30 p-5 lg:col-span-2">
            <div className="mb-4 flex items-center gap-2"><TrendingUp className="h-4 w-4 text-accent" /><h2 className="font-semibold">Wheel Decision Engine</h2></div>
            <div className="space-y-3">
              {wheels.map(w => (
                <div key={w.symbol} className="grid grid-cols-2 gap-3 rounded-lg border border-border/70 bg-base/50 p-4 md:grid-cols-6">
                  <div><div className="text-[10px] text-muted">ETF</div><div className="mt-1 text-lg font-bold">{w.symbol}</div></div>
                  <div><div className="text-[10px] text-muted">STATUS</div><div className="mt-1 font-mono text-warning">{w.status}</div></div>
                  <div className="md:col-span-2"><div className="text-[10px] text-muted">ACTION</div><div className="mt-1 text-sm">{w.action}</div></div>
                  <div><div className="text-[10px] text-muted">DTE / Δ</div><div className="mt-1 font-mono text-xs">{w.dte}<br />{w.delta}</div></div>
                  <div><div className="text-[10px] text-muted">SIZE</div><div className="mt-1 font-mono">{w.position}</div></div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-xl border border-border bg-elevated/30 p-5">
            <div className="mb-4 flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-accent" /><h2 className="font-semibold">Risk Budget</h2></div>
            <div className="space-y-4 text-sm">
              <div className="flex justify-between border-b border-border/60 pb-3"><span className="text-muted">Net Liquidation</span><span className="font-mono">—</span></div>
              <div className="flex justify-between border-b border-border/60 pb-3"><span className="text-muted">Cash Available</span><span className="font-mono">—</span></div>
              <div className="flex justify-between border-b border-border/60 pb-3"><span className="text-muted">PUT Cash Secured</span><span className="font-mono">—</span></div>
              <div className="flex justify-between"><span className="text-muted">Single-trade risk limit</span><span className="font-mono">0.10%</span></div>
            </div>
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-3">
          <div className="rounded-xl border border-border bg-elevated/30 p-5"><Activity className="mb-3 h-4 w-4 text-accent"/><div className="text-xs text-muted">STEP 1</div><div className="mt-1 font-semibold">Sell Cash-Secured PUT</div><p className="mt-2 text-xs text-secondary">Regime允许时，根据Delta、DTE、Put Wall与风险预算建立仓位。</p></div>
          <div className="rounded-xl border border-border bg-elevated/30 p-5"><CircleDollarSign className="mb-3 h-4 w-4 text-accent"/><div className="text-xs text-muted">STEP 2</div><div className="mt-1 font-semibold">Assignment / Hold ETF</div><p className="mt-2 text-xs text-secondary">被指派后记录真实成本、权利金与ETF持仓，不追逐个股。</p></div>
          <div className="rounded-xl border border-border bg-elevated/30 p-5"><TrendingUp className="mb-3 h-4 w-4 text-accent"/><div className="text-xs text-muted">STEP 3</div><div className="mt-1 font-semibold">Sell Covered Call</div><p className="mt-2 text-xs text-secondary">持仓阶段卖Call；被行权后回到Cash并重新进入Wheel。</p></div>
        </section>
      </div>
    </div>
  )
}
