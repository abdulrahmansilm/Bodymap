import { T, btn } from '../../tokens'

export default function WorkoutOverview({ day, onStart, onBack }) {
  return (
    <div style={{ background: '#fff', minHeight: '100vh' }}>
      <div style={{ maxWidth: 680, margin: '0 auto', padding: '48px 24px 40px' }}>
        <div style={{ fontSize: 14, color: T.primary, cursor: 'pointer', marginBottom: 16, fontWeight: 600 }} onClick={onBack}>← Startseite</div>
        <div style={{ fontSize: 32, fontWeight: 700, color: T.textPrimary, marginBottom: 4 }}>{day.name}</div>
        <div style={{ fontSize: 15, color: T.textMuted, marginBottom: 32 }}>{day.exercises.length} Übungen</div>

        <div style={{ border: `1px solid ${T.border}`, borderRadius: T.radiusMd, overflow: 'hidden', marginBottom: 32 }}>
          {day.exercises.map((ex, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '16px 20px', borderBottom: i < day.exercises.length - 1 ? `0.5px solid ${T.border}` : 'none' }}>
              <div style={{ width: 36, height: 36, borderRadius: '50%', background: T.surface1, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 700, color: T.textMuted, flexShrink: 0, border: `1px solid ${T.border}` }}>
                {i + 1}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 15, fontWeight: 600, color: T.textPrimary }}>{ex.name}</div>
                <div style={{ fontSize: 13, color: T.textMuted, marginTop: 2 }}>{ex.sets} Sätze × {ex.reps} Wdh. · Pause {ex.rest}s</div>
              </div>
              <span style={{ fontSize: 12, background: T.primaryTint, borderRadius: 6, padding: '4px 10px', color: T.primary, fontWeight: 600, flexShrink: 0 }}>{ex.muscle}</span>
            </div>
          ))}
        </div>
        <button onClick={onStart} style={btn('primary')}>Los geht's →</button>
      </div>
    </div>
  )
}