import { T } from '../tokens'

export default function DashboardScreen({ user, plan }) {
  if (!plan) return null

  const allExercises = plan.days.flatMap(d => d.exercises)
  const allMuscles = allExercises.map(e => e.muscle)
  const muscleCounts = allMuscles.reduce((acc, m) => { acc[m] = (acc[m] || 0) + 1; return acc }, {})
  const totalSets = allExercises.reduce((acc, e) => acc + e.sets, 0)
  const bmi = (user.weight / ((user.height / 100) ** 2)).toFixed(1)
  const bmiLabel = bmi < 18.5 ? 'Untergewicht' : bmi < 25 ? 'Normalgewicht' : bmi < 30 ? 'Übergewicht' : 'Adipositas'
  const bmiColor = bmi < 18.5 ? '#2196F3' : bmi < 25 ? T.primary : bmi < 30 ? '#F59E0B' : '#EF4444'

  return (
    <div style={{ background: '#fff', minHeight: '100vh' }}>
      <div style={{ maxWidth: 680, margin: '0 auto', padding: '48px 24px 40px' }}>
        <div style={{ fontSize: 32, fontWeight: 700, color: T.textPrimary, marginBottom: 4 }}>Dashboard</div>
        <div style={{ fontSize: 15, color: T.textMuted, marginBottom: 32 }}>Dein Fortschritt auf einen Blick</div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 32 }}>
          {[
            { label: 'Einheiten', value: plan.days.length, unit: 'pro Woche' },
            { label: 'Übungen', value: allExercises.length, unit: 'gesamt' },
            { label: 'Sätze', value: totalSets, unit: 'pro Woche' },
          ].map((s, i) => (
            <div key={i} style={{ background: T.surface1, borderRadius: T.radiusMd, padding: '20px 16px', textAlign: 'center', border: `1px solid ${T.border}` }}>
              <div style={{ fontSize: 28, fontWeight: 700, color: T.primary }}>{s.value}</div>
              <div style={{ fontSize: 13, color: T.textSecondary, marginTop: 4 }}>{s.label}</div>
              <div style={{ fontSize: 11, color: T.textMuted }}>{s.unit}</div>
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

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 20, marginBottom: 32 }}>
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, color: T.textMuted, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 14 }}>Wöchentliches Volumen</div>
            <div style={{ border: `1px solid ${T.border}`, borderRadius: T.radiusMd, overflow: 'hidden' }}>
              {plan.days.map((day, i) => {
                const daySets = day.exercises.reduce((acc, e) => acc + e.sets, 0)
                const pct = Math.round((daySets / totalSets) * 100)
                return (
                  <div key={i} style={{ padding: '14px 18px', borderBottom: i < plan.days.length - 1 ? `0.5px solid ${T.border}` : 'none' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                      <span style={{ fontSize: 14, fontWeight: 600, color: T.textPrimary }}>{day.label} — {day.name}</span>
                      <span style={{ fontSize: 13, color: T.textMuted }}>{daySets} Sätze</span>
                    </div>
                    <div style={{ height: 8, background: T.surface2, borderRadius: 4 }}>
                      <div style={{ height: 8, background: T.primary, borderRadius: 4, width: `${pct}%` }} />
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          <div>
            <div style={{ fontSize: 11, fontWeight: 700, color: T.textMuted, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 14 }}>Muskelgruppen</div>
            <div style={{ border: `1px solid ${T.border}`, borderRadius: T.radiusMd, overflow: 'hidden' }}>
              {Object.entries(muscleCounts).sort((a, b) => b[1] - a[1]).map(([muscle, count], i, arr) => {
                const pct = Math.round((count / arr[0][1]) * 100)
                return (
                  <div key={muscle} style={{ padding: '14px 18px', borderBottom: i < arr.length - 1 ? `0.5px solid ${T.border}` : 'none' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                      <span style={{ fontSize: 14, fontWeight: 600, color: T.textPrimary }}>{muscle}</span>
                      <span style={{ fontSize: 13, color: T.textMuted }}>{count} Übungen</span>
                    </div>
                    <div style={{ height: 8, background: T.surface2, borderRadius: 4 }}>
                      <div style={{ height: 8, background: T.primaryLight, borderRadius: 4, width: `${pct}%` }} />
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        <div style={{ background: T.primaryTint, borderRadius: T.radiusMd, padding: '18px 20px', border: `1px solid ${T.primaryBorder}` }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: T.primary, marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Nächstes Training</div>
          <div style={{ fontSize: 18, fontWeight: 700, color: T.textPrimary }}>{plan.days[0].label} — {plan.days[0].name}</div>
          <div style={{ fontSize: 14, color: T.textMuted, marginTop: 4 }}>{plan.days[0].exercises.length} Übungen · ~{user.duration} min</div>
        </div>
      </div>
    </div>
  )
}