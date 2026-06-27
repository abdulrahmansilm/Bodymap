import { T } from '../tokens'

export default function PlanScreen({ plan, goTo }) {
  if (!plan) return null
  return (
    <div style={{ background: '#fff', minHeight: '100vh' }}>
      <div style={{ maxWidth: 680, margin: '0 auto', padding: '48px 24px 40px' }}>
        <div style={{ fontSize: 14, color: T.primary, cursor: 'pointer', marginBottom: 16, fontWeight: 600 }} onClick={() => goTo('home')}>← Startseite</div>
        <div style={{ fontSize: 32, fontWeight: 700, color: T.textPrimary, marginBottom: 4 }}>Dein Plan</div>
        <div style={{ fontSize: 15, color: T.textMuted, marginBottom: 32 }}>{plan.summary}</div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 20 }}>
          {plan.days.map((day, di) => (
            <div key={di} style={{ border: `1px solid ${T.border}`, borderRadius: T.radiusMd, overflow: 'hidden' }}>
              <div style={{ padding: '14px 18px', background: T.surface1, borderBottom: `1px solid ${T.border}` }}>
                <div style={{ fontSize: 12, color: T.textMuted, marginBottom: 2, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>{day.label}</div>
                <div style={{ fontSize: 17, fontWeight: 700, color: T.textPrimary }}>{day.name}</div>
                {day.focus && <div style={{ fontSize: 13, color: T.textMuted, marginTop: 2 }}>{day.focus}</div>}
              </div>
              {day.exercises.map((ex, ei) => (
                <div key={ei} style={{ padding: '12px 18px', borderBottom: ei < day.exercises.length - 1 ? `0.5px solid ${T.border}` : 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 600, color: T.textPrimary }}>{ex.name}</div>
                    <div style={{ fontSize: 12, color: T.textMuted, marginTop: 2 }}>{ex.sets} × {ex.reps} · Pause {ex.rest}s</div>
                  </div>
                  <span style={{ fontSize: 11, background: T.primaryTint, borderRadius: 6, padding: '3px 10px', color: T.primary, fontWeight: 600, flexShrink: 0, marginLeft: 8 }}>{ex.muscle}</span>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}