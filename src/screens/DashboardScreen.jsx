import { useState } from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { T, btn } from '../tokens'

const HISTORY_KEY = 'sessionHistory'
const DEMO_DAY_NAMES = ['Oberkörper-Tag', 'Unterkörper-Tag', 'Ganzkörper-Tag']
const DEMO_SETS = [12, 15, 14, 18, 11, 17]

function loadSessionHistory() {
  try {
    const raw = localStorage.getItem(HISTORY_KEY)
    const parsed = raw ? JSON.parse(raw) : []
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

function saveSessionHistory(history) {
  localStorage.setItem(HISTORY_KEY, JSON.stringify(history))
}

function mondayOf(date) {
  const d = new Date(date)
  d.setHours(0, 0, 0, 0)
  const offset = (d.getDay() + 6) % 7
  d.setDate(d.getDate() - offset)
  return d
}

function isInWeekOf(dateStr, ref) {
  const d = new Date(`${dateStr}T00:00:00`)
  const weekStart = mondayOf(ref)
  const weekEnd = new Date(weekStart)
  weekEnd.setDate(weekEnd.getDate() + 7)
  return d >= weekStart && d < weekEnd
}

function isInMonthOf(dateStr, ref) {
  const d = new Date(`${dateStr}T00:00:00`)
  return d.getFullYear() === ref.getFullYear() && d.getMonth() === ref.getMonth()
}

function localDateStr(d) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

// Generiert 6 Demo-Einträge, die letzten Trainingstage rückwärts, ~2-3 Tage Abstand
function buildDemoHistory() {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const todayDow = (today.getDay() + 6) % 7 // 0 = Montag
  // Lücke zum vorletzten Eintrag darf die aktuelle Woche nicht verlassen
  const firstGap = Math.min(2, todayDow)
  const gapsFromNewest = [firstGap, 3, 2, 3, 2]

  const datesDesc = [new Date(today)]
  for (const gap of gapsFromNewest) {
    const prev = new Date(datesDesc[datesDesc.length - 1])
    prev.setDate(prev.getDate() - gap)
    datesDesc.push(prev)
  }

  return [...datesDesc].reverse().map((d, i) => ({
    date: localDateStr(d),
    dayName: DEMO_DAY_NAMES[i % DEMO_DAY_NAMES.length],
    completedSets: DEMO_SETS[i],
  }))
}

function LastDot(props) {
  const { cx, cy, index, dataLength } = props
  const isLast = index === dataLength - 1
  return <circle cx={cx} cy={cy} r={isLast ? 7 : 4} fill={T.primary} stroke="#fff" strokeWidth={1.5} />
}

// Liniendiagramm: erledigte Sätze pro absolvierter Einheit, chronologisch
function VolumePerSessionChart({ history }) {
  if (history.length === 0) {
    return (
      <div style={{ border: `1px solid ${T.border}`, borderRadius: T.radiusMd, padding: '28px 18px', textAlign: 'center' }}>
        <div style={{ fontSize: 13, color: T.textMuted }}>Noch keine Einheiten absolviert</div>
      </div>
    )
  }

  const sorted = [...history].sort((a, b) => a.date.localeCompare(b.date))
  const data = sorted.map((s, i) => ({
    label: i === sorted.length - 1 ? 'Heute' : String(i + 1),
    sets: s.completedSets,
  }))

  return (
    <div style={{ border: `1px solid ${T.border}`, borderRadius: T.radiusMd, padding: '18px 14px 6px' }}>
      <ResponsiveContainer width="100%" height={220}>
        <LineChart data={data} margin={{ top: 10, right: 16, left: -10, bottom: 0 }}>
          <CartesianGrid stroke={T.surface2} vertical={false} />
          <XAxis dataKey="label" tick={{ fontSize: 12, fill: T.textMuted }} axisLine={{ stroke: T.border }} tickLine={false} />
          <YAxis allowDecimals={false} tick={{ fontSize: 12, fill: T.textMuted }} axisLine={{ stroke: T.border }} tickLine={false} />
          <Tooltip contentStyle={{ borderRadius: 8, border: `1px solid ${T.border}`, fontSize: 13 }} />
          <Line
            type="monotone"
            dataKey="sets"
            stroke={T.primary}
            strokeWidth={2}
            dot={(props) => <LastDot key={props.index} {...props} dataLength={data.length} />}
            activeDot={{ r: 7 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

// Übersicht mit Stats, Körperdaten/BMI und Charts, basiert komplett auf dem generierten Plan
export default function DashboardScreen({ user, plan, completedDays, weightHistory }) {
  const [refreshTick, setRefreshTick] = useState(0)
  if (!plan) return null

  const history = loadSessionHistory()
  const now = new Date()
  const plannedPerWeek = plan.days.length
  const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate()
  const weeksInMonth = Math.ceil(daysInMonth / 7)

  const thisWeekCount = history.filter(s => isInWeekOf(s.date, now)).length
  const thisMonthCount = history.filter(s => isInMonthOf(s.date, now)).length
  const monthTarget = plannedPerWeek * weeksInMonth

  const bmi = (user.weight / ((user.height / 100) ** 2)).toFixed(1)
  const bmiLabel = bmi < 18.5 ? 'Untergewicht' : bmi < 25 ? 'Normalgewicht' : bmi < 30 ? 'Übergewicht' : 'Adipositas'
  const bmiColor = bmi < 18.5 ? '#2196F3' : bmi < 25 ? T.primary : bmi < 30 ? '#F59E0B' : '#EF4444'

  const loadDemoData = () => {
    saveSessionHistory(buildDemoHistory())
    setRefreshTick(t => t + 1)
  }

  const resetHistory = () => {
    saveSessionHistory([])
    setRefreshTick(t => t + 1)
  }

  return (
    <div style={{ background: '#fff', minHeight: '100vh' }}>
      <div style={{ maxWidth: 680, margin: '0 auto', padding: '48px 24px 40px' }}>
        <div style={{ fontSize: 32, fontWeight: 700, color: T.textPrimary, marginBottom: 4 }}>Dashboard</div>
        <div style={{ fontSize: 15, color: T.textMuted, marginBottom: 32 }}>Dein Fortschritt auf einen Blick</div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 32 }}>
          {[
            { label: 'Einheiten diese Woche', value: `${thisWeekCount} / ${plannedPerWeek}` },
            { label: 'Einheiten diesen Monat', value: `${thisMonthCount} / ${monthTarget}` },
            { label: 'Einheiten gesamt', value: `${history.length}` },
          ].map((s, i) => (
            <div key={i} style={{ background: T.surface1, borderRadius: T.radiusMd, padding: '20px 16px', textAlign: 'center', border: `1px solid ${T.border}` }}>
              <div style={{ fontSize: 28, fontWeight: 700, color: T.primary }}>{s.value}</div>
              <div style={{ fontSize: 13, color: T.textSecondary, marginTop: 4 }}>{s.label}</div>
            </div>
          ))}
        </div>

        <div style={{ fontSize: 11, fontWeight: 700, color: T.textMuted, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 14 }}>Körperdaten</div>
        <div style={{ border: `1px solid ${T.border}`, borderRadius: T.radiusMd, padding: 20, marginBottom: 32 }}>
          <div style={{ display: 'flex', justifyContent: 'space-around', marginBottom: 20 }}>
            {[{ label: 'Größe', value: `${user.height} cm` }, { label: 'Gewicht', value: `${user.weight} kg` }, { label: 'Alter', value: `${user.age} J.` }].map((item, i) => (
              <div key={i} style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 20, fontWeight: 700, color: T.textPrimary }}>{item.value}</div>
                <div style={{ fontSize: 12, color: T.textMuted, marginTop: 2 }}>{item.label}</div>
              </div>
            ))}
          </div>
          <div style={{ background: T.surface1, borderRadius: T.radiusSm, padding: '14px 18px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontSize: 12, color: T.textMuted, marginBottom: 2 }}>BMI</div>
              <div style={{ fontSize: 28, fontWeight: 700, color: bmiColor }}>{bmi}</div>
            </div>
            <div style={{ background: bmiColor + '18', borderRadius: 10, padding: '8px 16px', fontSize: 14, fontWeight: 700, color: bmiColor }}>{bmiLabel}</div>
          </div>
        </div>

        <div style={{ marginBottom: 32 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: T.textMuted, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 4 }}>Volumen pro Einheit</div>
          <div style={{ fontSize: 13, color: T.textMuted, marginBottom: 14 }}>Sätze pro Trainingseinheit</div>
          <VolumePerSessionChart history={history} />
        </div>

        <div style={{ background: T.primaryTint, borderRadius: T.radiusMd, padding: '18px 20px', border: `1px solid ${T.primaryBorder}`, marginBottom: 32 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: T.primary, marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Nächstes Training</div>
          <div style={{ fontSize: 18, fontWeight: 700, color: T.textPrimary }}>{plan.days[0].label} — {plan.days[0].name}</div>
          <div style={{ fontSize: 14, color: T.textMuted, marginTop: 4 }}>{plan.days[0].exercises.length} Übungen · ~{user.duration} min</div>
        </div>

        <div style={{ display: 'flex', gap: 10 }}>
          <button onClick={loadDemoData} style={{ ...btn('ghost'), flex: 1 }}>Demo-Daten laden</button>
          <button onClick={resetHistory} style={{ ...btn('ghost'), flex: 1 }}>Verlauf zurücksetzen</button>
        </div>
      </div>
    </div>
  )
}
