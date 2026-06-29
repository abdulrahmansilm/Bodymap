import { T, btn } from '../../tokens'

export default function WorkoutDone({ day, plan, completedDays, onBack }) {
  const nextDay = plan.days.find(d => !completedDays.includes(d.label) && d.label !== day.label)
  return (
    <div style={{ background: '#fff', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ maxWidth: 480, width: '100%', padding: '40px 24px', textAlign: 'center' }}>
        <div style={{ fontSize: 72, marginBottom: 20 }}>💪</div>
        <div style={{ fontSize: 36, fontWeight: 700, color: T.textPrimary, marginBottom: 8 }}>Stark gemacht!</div>
        <div style={{ fontSize: 17, color: T.textMuted, marginBottom: 36 }}>{day.name} abgeschlossen</div>

        <div style={{ display: 'flex', gap: 14, marginBottom: 28 }}>
          <div style={{ flex: 1, padding: 20, border: `1px solid ${T.border}`, borderRadius: T.radiusMd, textAlign: 'center' }}>
            <div style={{ fontSize: 32, fontWeight: 700, color: T.primary }}>{completedDays.length}</div>
            <div style={{ fontSize: 13, color: T.textMuted, marginTop: 4 }}>Diese Woche</div>
          </div>
          <div style={{ flex: 1, padding: 20, border: `1px solid ${T.border}`, borderRadius: T.radiusMd, textAlign: 'center' }}>
            <div style={{ fontSize: 32, fontWeight: 700, color: T.primary }}>{plan.days.length - completedDays.length}</div>
            <div style={{ fontSize: 13, color: T.textMuted, marginTop: 4 }}>Noch übrig</div>
          </div>
        </div>

        <div style={{ background: T.primaryTint, borderRadius: T.radiusMd, padding: '18px 20px', textAlign: 'left', fontSize: 15, color: T.textSecondary, lineHeight: 1.7, marginBottom: 32, border: `1px solid ${T.primaryBorder}` }}>
          {nextDay
            ? <>Nächste Einheit: <span style={{ fontWeight: 700, color: T.primary }}>{nextDay.label} — {nextDay.name}</span><br />Bis dahin: <span style={{ fontWeight: 700, color: T.primary }}>gute Erholung!</span></>
            : <span style={{ fontWeight: 700, color: T.primary }}>🎉 Alle Einheiten diese Woche abgeschlossen!</span>
          }
        </div>
        <button onClick={onBack} style={btn('primary')}>Zurück zur Startseite →</button>
      </div>
    </div>
  )
}