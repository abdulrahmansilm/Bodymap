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

// Vertical column chart — magnitude per day (e.g. weekly training volume).
export function WeeklyVolumeChart({ days }) {
  const [hover, setHover] = useState(null)
  const [showTable, setShowTable] = useState(false)

  const data = days.map(day => ({
    key: day.label,
    short: day.label.slice(0, 2),
    name: day.name,
    value: day.exercises.reduce((a, e) => a + e.sets, 0),
  }))
  const max = Math.max(...data.map(d => d.value), 1)
  const ticks = niceTicks(max)
  const niceMax = ticks[ticks.length - 1]
  const plotHeight = 140

  if (showTable) {
    return (
      <div>
        <DataTable headers={['Tag', 'Sätze']} rows={data.map(d => [`${d.key} — ${d.name}`, d.value])} />
        <TableToggle show={showTable} onToggle={() => setShowTable(false)} />
      </div>
    )
  }

  return (
    <div>
      <div
        role="img"
        aria-label={`Balkendiagramm, Trainingssätze pro Tag: ${data.map(d => `${d.key} ${d.value} Sätze`).join(', ')}.`}
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
                      }}>{d.key} — {d.name}: {d.value} Sätze</div>
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

// Horizontal ranked bar chart — magnitude per category (e.g. exercises per muscle group).
export function MuscleGroupChart({ muscleCounts }) {
  const [hover, setHover] = useState(null)
  const [showTable, setShowTable] = useState(false)

  const data = Object.entries(muscleCounts).sort((a, b) => b[1] - a[1]).map(([muscle, count]) => ({ muscle, count }))
  const max = Math.max(...data.map(d => d.count), 1)
  const ticks = niceTicks(max)
  const niceMax = ticks[ticks.length - 1]
  const cols = '82px 1fr 26px'

  if (showTable) {
    return (
      <div>
        <DataTable headers={['Muskelgruppe', 'Übungen']} rows={data.map(d => [d.muscle, d.count])} />
        <TableToggle show={showTable} onToggle={() => setShowTable(false)} />
      </div>
    )
  }

  return (
    <div>
      <div
        role="img"
        aria-label={`Balkendiagramm, Übungen pro Muskelgruppe: ${data.map(d => `${d.muscle} ${d.count}`).join(', ')}.`}
        style={{ border: `1px solid ${T.border}`, borderRadius: T.radiusMd, padding: '16px 14px 14px' }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {data.map((d, i) => {
            const pct = (d.count / niceMax) * 100
            const isHover = hover === i
            return (
              <div key={d.muscle} style={{ display: 'grid', gridTemplateColumns: cols, alignItems: 'center', gap: 10 }}>
                <span style={{ fontSize: 12, fontWeight: 600, color: T.textPrimary, textAlign: 'right' }}>{d.muscle}</span>
                <div style={{ position: 'relative', height: 14 }}>
                  <div style={{ position: 'absolute', inset: 0, background: T.surface2, borderRadius: 4 }} />
                  <div
                    tabIndex={0}
                    onMouseEnter={() => setHover(i)} onMouseLeave={() => setHover(null)}
                    onFocus={() => setHover(i)} onBlur={() => setHover(null)}
                    style={{
                      position: 'absolute', left: 0, top: 0, bottom: 0, width: `${pct}%`, minWidth: 6,
                      background: rampColor(pct), borderRadius: 4,
                      transition: 'width 0.5s ease, opacity 0.15s', opacity: isHover ? 0.8 : 1,
                      cursor: 'pointer', outline: 'none',
                      boxShadow: isHover ? `0 0 0 3px ${T.primaryTint}` : 'none',
                    }}
                  />
                  {isHover && (
                    <div style={{
                      position: 'absolute', top: '50%', transform: 'translateY(-50%)',
                      ...(pct > 60 ? { right: `calc(${100 - pct}% + 8px)` } : { left: `calc(${pct}% + 8px)` }),
                      background: T.textPrimary, color: '#fff', fontSize: 11, fontWeight: 600,
                      padding: '5px 9px', borderRadius: 8, whiteSpace: 'nowrap', zIndex: 2, pointerEvents: 'none',
                    }}>{d.muscle}: {d.count} Übungen</div>
                  )}
                </div>
                <span style={{ fontSize: 12, fontWeight: 700, color: T.textSecondary }}>{d.count}</span>
              </div>
            )
          })}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: cols, gap: 10, marginTop: 10 }}>
          <span />
          <div style={{ position: 'relative', height: 14 }}>
            {ticks.map((t, i) => (
              <span key={i} style={{
                position: 'absolute', left: `${(t / niceMax) * 100}%`, transform: 'translateX(-50%)',
                fontSize: 10, color: T.textMuted, fontWeight: 500,
              }}>{t}</span>
            ))}
          </div>
          <span />
        </div>
      </div>
      <TableToggle show={showTable} onToggle={() => setShowTable(true)} />
    </div>
  )
}
