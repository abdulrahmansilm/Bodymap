import { useState } from 'react'
import { T } from '../tokens'

// Validated sequential ramp (dark -> light), single hue, passes
// scripts/validate_palette.js --ordinal (lightness monotone, adjacent ΔL >= 0.06,
// light-end contrast >= 2:1 on white, single hue).
const RAMP = ['#023E8A', '#0077B6', '#0096C7', '#00B4D8']

function rampColor(pct) {
  const idx = Math.min(RAMP.length - 1, Math.round((1 - pct / 100) * (RAMP.length - 1)))
  return RAMP[idx]
}

function niceTicks(max, count = 4) {
  if (max <= 0) return [0, 1]
  if (max <= count) {
    // small integer range (counts, not continuous quantities) — step by whole numbers
    const ticks = []
    for (let v = 0; v <= max; v += 1) ticks.push(v)
    return ticks
  }
  const rawStep = max / count
  const mag = Math.pow(10, Math.floor(Math.log10(rawStep)))
  const norm = rawStep / mag
  const niceNorm = norm <= 1 ? 1 : norm <= 2 ? 2 : norm <= 5 ? 5 : 10
  const step = niceNorm * mag
  const niceMax = Math.ceil(max / step) * step
  const ticks = []
  for (let v = 0; v <= niceMax + 1e-9; v += step) ticks.push(Math.round(v * 100) / 100)
  return ticks
}

function TableToggle({ show, onToggle }) {
  return (
    <button onClick={onToggle} style={{
      background: 'none', border: 'none', color: T.primary, fontSize: 12, fontWeight: 600,
      cursor: 'pointer', fontFamily: 'inherit', padding: 0, marginTop: 12,
    }}>{show ? '← Diagramm anzeigen' : 'Als Tabelle anzeigen'}</button>
  )
}

function DataTable({ headers, rows }) {
  return (
    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
      <thead>
        <tr>
          {headers.map((h, i) => (
            <th key={i} style={{
              textAlign: i === 0 ? 'left' : 'right', padding: '8px', color: T.textMuted,
              fontWeight: 600, borderBottom: `1px solid ${T.border}`, fontSize: 11,
              textTransform: 'uppercase', letterSpacing: 0.4,
            }}>{h}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row, i) => (
          <tr key={i}>
            {row.map((cell, j) => (
              <td key={j} style={{
                padding: '8px', color: T.textPrimary, borderBottom: `1px solid ${T.border}`,
                textAlign: j === 0 ? 'left' : 'right', fontWeight: j === 0 ? 500 : 700,
              }}>{cell}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  )
}

// Vertical column chart — sets already completed per day, this week.
export function CompletedSetsChart({ days, completedDays }) {
  const [hover, setHover] = useState(null)
  const [showTable, setShowTable] = useState(false)

  const data = days.map(day => ({
    key: day.label,
    short: day.label.slice(0, 2),
    name: day.name,
    value: completedDays.includes(day.label) ? day.exercises.reduce((a, e) => a + e.sets, 0) : 0,
  }))
  const max = Math.max(...data.map(d => d.value), 1)
  const ticks = niceTicks(max)
  const niceMax = ticks[ticks.length - 1]
  const plotHeight = 140

  if (showTable) {
    return (
      <div>
        <DataTable headers={['Tag', 'Erledigte Sätze']} rows={data.map(d => [`${d.key} — ${d.name}`, d.value])} />
        <TableToggle show={showTable} onToggle={() => setShowTable(false)} />
      </div>
    )
  }

  return (
    <div>
      <div
        role="img"
        aria-label={`Balkendiagramm, erledigte Sätze pro Tag diese Woche: ${data.map(d => `${d.key} ${d.value} Sätze`).join(', ')}.`}
        style={{ border: `1px solid ${T.border}`, borderRadius: T.radiusMd, padding: '18px 14px 14px', display: 'grid', gridTemplateColumns: '26px 1fr', gap: 8 }}
      >
        <div style={{ position: 'relative', height: plotHeight }}>
          {ticks.map((t, i) => (
            <span key={i} style={{
              position: 'absolute', right: 0, bottom: `calc(${(t / niceMax) * 100}% - 6px)`,
              fontSize: 10, color: T.textMuted, fontWeight: 500,
            }}>{t}</span>
          ))}
        </div>
        <div>
          <div style={{ position: 'relative', height: plotHeight }}>
            {ticks.map((t, i) => (
              <div key={i} style={{
                position: 'absolute', left: 0, right: 0, bottom: `${(t / niceMax) * 100}%`,
                borderTop: `1px solid ${T.surface2}`,
              }} />
            ))}
            <div style={{ position: 'absolute', inset: 0, display: 'grid', gridTemplateColumns: `repeat(${data.length}, 1fr)`, gap: 10, padding: '0 4px' }}>
              {data.map((d, i) => {
                const pct = (d.value / niceMax) * 100
                const isHover = hover === i
                return (
                  <div key={d.key} style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-end', height: '100%' }}>
                    {isHover && (
                      <div style={{
                        position: 'absolute', bottom: `calc(${pct}% + 20px)`,
                        ...(i === 0 ? { left: 0 } : i === data.length - 1 ? { right: 0 } : { left: '50%', transform: 'translateX(-50%)' }),
                        background: T.textPrimary, color: '#fff', fontSize: 11, fontWeight: 600,
                        padding: '5px 9px', borderRadius: 8, whiteSpace: 'nowrap', zIndex: 2, pointerEvents: 'none',
                      }}>{d.key} — {d.name}: {d.value} erledigt</div>
                    )}
                    <span style={{ fontSize: 11, fontWeight: 700, color: T.textSecondary, marginBottom: 4 }}>{d.value}</span>
                    <div
                      tabIndex={0}
                      onMouseEnter={() => setHover(i)} onMouseLeave={() => setHover(null)}
                      onFocus={() => setHover(i)} onBlur={() => setHover(null)}
                      style={{
                        width: '100%', maxWidth: 26, height: `${pct}%`, minHeight: 3,
                        borderRadius: '4px 4px 0 0', background: rampColor(pct),
                        transition: 'height 0.5s ease, opacity 0.15s', opacity: isHover ? 0.8 : 1,
                        cursor: 'pointer', outline: 'none',
                        boxShadow: isHover ? `0 0 0 3px ${T.primaryTint}` : 'none',
                      }}
                    />
                  </div>
                )
              })}
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: `repeat(${data.length}, 1fr)`, gap: 10, padding: '0 4px', marginTop: 8 }}>
            {data.map(d => (
              <span key={d.key} style={{ textAlign: 'center', fontSize: 11, fontWeight: 600, color: T.textMuted }}>{d.short}</span>
            ))}
          </div>
        </div>
      </div>
      <TableToggle show={showTable} onToggle={() => setShowTable(true)} />
    </div>
  )
}

function startOfWeekKey(dateStr) {
  const d = new Date(`${dateStr}T00:00:00`)
  const mondayOffset = (d.getDay() + 6) % 7
  d.setDate(d.getDate() - mondayOffset)
  return d.toISOString().slice(0, 10)
}

function formatShortDate(dateStr) {
  const d = new Date(`${dateStr}T00:00:00`)
  return `${String(d.getDate()).padStart(2, '0')}.${String(d.getMonth() + 1).padStart(2, '0')}`
}

// One weight entry per calendar week — the latest logged value in that week.
function weeklyWeights(weightHistory) {
  const sorted = [...weightHistory].sort((a, b) => a.date.localeCompare(b.date))
  const byWeek = new Map()
  for (const entry of sorted) byWeek.set(startOfWeekKey(entry.date), entry)
  return [...byWeek.entries()].map(([weekStart, entry]) => ({ weekStart, weight: entry.weight }))
}

// Line chart — bodyweight trend, one point per week.
export function WeightTrendChart({ weightHistory }) {
  const [hover, setHover] = useState(null)
  const [showTable, setShowTable] = useState(false)

  const data = weeklyWeights(weightHistory)

  if (data.length === 0) {
    return (
      <div style={{ border: `1px solid ${T.border}`, borderRadius: T.radiusMd, padding: '28px 18px', textAlign: 'center' }}>
        <div style={{ fontSize: 13, color: T.textMuted, lineHeight: 1.6 }}>Noch keine Gewichtsdaten.<br />Trage dein Gewicht im Profil ein, um deinen Trend zu sehen.</div>
      </div>
    )
  }

  if (showTable) {
    return (
      <div>
        <DataTable headers={['Woche', 'Gewicht (kg)']} rows={data.map(d => [formatShortDate(d.weekStart), d.weight])} />
        <TableToggle show={showTable} onToggle={() => setShowTable(false)} />
      </div>
    )
  }

  const weights = data.map(d => d.weight)
  const rawMin = Math.min(...weights)
  const rawMax = Math.max(...weights)
  const pad = Math.max(1, Math.ceil((rawMax - rawMin) * 0.25))
  const min = Math.floor(rawMin - pad)
  const max = Math.ceil(rawMax + pad)
  const range = max - min
  const ticks = [min, Math.round((min + max) / 2), max]
  const plotHeight = 140
  const plotWidth = Math.max(220, data.length * 60)
  const lineColor = RAMP[1]

  const points = data.map((d, i) => ({
    ...d,
    x: data.length === 1 ? plotWidth / 2 : (i / (data.length - 1)) * plotWidth,
    y: plotHeight - ((d.weight - min) / range) * plotHeight,
  }))
  const path = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(' ')

  return (
    <div>
      <div
        role="img"
        aria-label={`Liniendiagramm, Körpergewicht pro Woche: ${data.map(d => `${formatShortDate(d.weekStart)} ${d.weight} Kilogramm`).join(', ')}.`}
        style={{ border: `1px solid ${T.border}`, borderRadius: T.radiusMd, padding: '18px 14px 14px', display: 'grid', gridTemplateColumns: '30px 1fr', gap: 8 }}
      >
        <div style={{ position: 'relative', height: plotHeight }}>
          {ticks.map((t, i) => (
            <span key={i} style={{
              position: 'absolute', right: 0, bottom: `calc(${((t - min) / range) * 100}% - 6px)`,
              fontSize: 10, color: T.textMuted, fontWeight: 500,
            }}>{t}</span>
          ))}
        </div>
        <div style={{ overflowX: 'auto' }}>
          <div style={{ width: plotWidth }}>
            <svg width={plotWidth} height={plotHeight} viewBox={`0 0 ${plotWidth} ${plotHeight}`} style={{ display: 'block', overflow: 'visible' }}>
              {ticks.map((t, i) => (
                <line key={i}
                  x1={0} x2={plotWidth}
                  y1={plotHeight - ((t - min) / range) * plotHeight} y2={plotHeight - ((t - min) / range) * plotHeight}
                  stroke={T.surface2} strokeWidth={1}
                />
              ))}
              <path d={path} fill="none" stroke={lineColor} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
              {points.map((p, i) => (
                <circle
                  key={p.weekStart}
                  tabIndex={0}
                  cx={p.x} cy={p.y} r={hover === i ? 6 : 4}
                  fill={lineColor} stroke="#fff" strokeWidth={1.5}
                  style={{ cursor: 'pointer', outline: 'none', transition: 'r 0.15s' }}
                  onMouseEnter={() => setHover(i)} onMouseLeave={() => setHover(null)}
                  onFocus={() => setHover(i)} onBlur={() => setHover(null)}
                />
              ))}
            </svg>
            <div style={{ display: 'grid', gridTemplateColumns: `repeat(${data.length}, 1fr)`, marginTop: 8 }}>
              {data.map(d => (
                <span key={d.weekStart} style={{ textAlign: 'center', fontSize: 11, fontWeight: 600, color: T.textMuted }}>{formatShortDate(d.weekStart)}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div style={{ fontSize: 12, fontWeight: 600, color: T.textPrimary, marginTop: 8, textAlign: 'center', visibility: hover === null ? 'hidden' : 'visible' }}>
        {hover !== null ? `${formatShortDate(points[hover].weekStart)}: ${points[hover].weight} kg` : '—'}
      </div>
      <TableToggle show={showTable} onToggle={() => setShowTable(true)} />
    </div>
  )
}
