import { T } from '../tokens'

export default function HomeScreen({ user, plan, goTo, setWorkoutState, completedDays, onReset }) {
  if (!plan) return <div style={{ padding: 24 }}>Kein Plan vorhanden.</div>

  const nextDayIndex = plan.days.findIndex(d => !completedDays.includes(d.label))
  const todayPlan = nextDayIndex !== -1 ? plan.days[nextDayIndex] : null
  const allDone = nextDayIndex === -1

  const handleStartWorkout = () => {
    setWorkoutState({ dayIndex: nextDayIndex, exerciseIndex: 0, setIndex: 0 })
    goTo('workout')
  }

  const W = { maxWidth: 680, margin: '0 auto', width: '100%', padding: '0 24px' }

  return (
    <div style={{ background: '#fff', minHeight: '100vh' }}>

      {/* Header */}
      <div style={{ ...W, paddingTop: 48, paddingBottom: 8 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <div style={{ fontSize: 32, fontWeight: 700, color: T.textPrimary }}>
              Hey {user.name}!
            </div>
            <div style={{ fontSize: 15, color: T.textMuted, marginTop: 6 }}>
              <span style={{ fontSize: 22, fontWeight: 700, color: T.primary }}>
                {completedDays.length}
              </span> Trainingstage diese Woche 
            </div>
          </div>
          <button onClick={onReset} style={{
            marginTop: 8, padding: '8px 14px', background: 'none',
            border: `1px solid ${T.border}`, borderRadius: T.radiusSm,
            fontSize: 12, color: T.textMuted, fontFamily: 'inherit',
            cursor: 'pointer', fontWeight: 500
          }}>
            Neu starten
          </button>
        </div>
      </div>

      <div style={{ ...W, paddingTop: 20, paddingBottom: 40 }}>

        {/* Today Card */}
        {allDone ? (
          <div style={{ background: T.primary, borderRadius: T.radiusLg, padding: 28, marginBottom: 24 }}>
            <div style={{ fontSize: 36, marginBottom: 10 }}>🎉</div>
            <div style={{ fontSize: 22, fontWeight: 700, color: '#fff' }}>Woche abgeschlossen!</div>
            <div style={{ fontSize: 15, color: 'rgba(255,255,255,0.75)', marginTop: 6 }}>
              Alle {plan.days.length} Einheiten erledigt. Gute Erholung!
            </div>
          </div>
        ) : (
          <div style={{ background: T.primary, borderRadius: T.radiusLg, padding: 28, marginBottom: 24 }}>
            <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.65)', marginBottom: 6, fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
              {completedDays.length === 0 ? 'Heute geplant' : 'Nächste Einheit'}
            </div>
            <div style={{ fontSize: 24, fontWeight: 700, color: '#fff', marginBottom: 6 }}>
              {todayPlan.name}
            </div>
            <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.75)' }}>
              {todayPlan.exercises.length} Übungen · ~{user.duration} min
            </div>
            <button onClick={handleStartWorkout} style={{
              marginTop: 20, width: '100%', padding: '15px 0',
              background: 'rgba(255,255,255,0.15)',
              border: '1.5px solid rgba(255,255,255,0.4)',
              borderRadius: T.radiusMd, color: '#fff',
              fontSize: 16, fontWeight: 600,
              fontFamily: 'inherit', cursor: 'pointer'
            }}>
              Training starten →
            </button>
          </div>
        )}

        {/* Personal Note */}
        {plan.personalNote && (
          <div style={{
            background: T.primaryTint, borderRadius: T.radiusMd,
            padding: '16px 20px', marginBottom: 24,
            border: `1px solid ${T.primaryBorder}`
          }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: T.primary, marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              Warum dieser Plan?
            </div>
            <div style={{ fontSize: 14, color: T.textSecondary, lineHeight: 1.7 }}>
              {plan.personalNote}
            </div>
          </div>
        )}

        {/* Week Row */}
        <div style={{ fontSize: 11, fontWeight: 700, color: T.textMuted, marginBottom: 12, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
          Diese Woche
        </div>
        <div style={{ display: 'flex', gap: 6, marginBottom: 32 }}>
          {[
            { short: 'Mo', full: 'Montag' },
            { short: 'Di', full: 'Dienstag' },
            { short: 'Mi', full: 'Mittwoch' },
            { short: 'Do', full: 'Donnerstag' },
            { short: 'Fr', full: 'Freitag' },
            { short: 'Sa', full: 'Samstag' },
            { short: 'So', full: 'Sonntag' },
          ].map((d) => {
            const isTrainingDay = plan.days.some(day => day.label === d.full)
            const isDone = completedDays.includes(d.full)
            const isNext = todayPlan && todayPlan.label === d.full
            return (
              <div key={d.short} style={{
                flex: 1, padding: '10px 4px', borderRadius: 12, textAlign: 'center',
                border: `1.5px solid ${isDone ? T.primary : isNext ? T.primary : isTrainingDay ? T.primaryBorder : T.border}`,
                background: isDone ? T.primary : isNext ? T.primaryTint : isTrainingDay ? T.primaryTint : '#fff',
              }}>
                <span style={{
                  fontSize: 11, display: 'block', fontWeight: 700,
                  color: isDone ? '#fff' : isNext ? T.primary : isTrainingDay ? T.primaryLight : T.textMuted,
                }}>
                  {isDone ? '✓' : d.short}
                </span>
                <div style={{
                  width: 5, height: 5, borderRadius: '50%', margin: '5px auto 0',
                  background: isDone ? '#fff' : isNext ? T.primary : isTrainingDay ? T.primary : 'transparent',
                  border: !isTrainingDay && !isDone ? `1px solid ${T.border}` : 'none',
                }} />
              </div>
            )
          })}
        </div>

        {/* Plan Days */}
        <div style={{ fontSize: 11, fontWeight: 700, color: T.textMuted, marginBottom: 14, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
          Dein Plan
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 12 }}>
          {plan.days.map((day, i) => {
            const isDone = completedDays.includes(day.label)
            const isNext = todayPlan && todayPlan.label === day.label
            return (
              <div key={i} style={{
                border: `1.5px solid ${isDone ? T.primaryBorder : isNext ? T.primary : T.border}`,
                borderRadius: T.radiusMd, padding: '16px 18px',
                background: isDone ? T.primaryTint : '#fff',
                opacity: isDone ? 0.8 : 1,
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <div style={{ fontSize: 12, color: T.textMuted, marginBottom: 4 }}>{day.label}</div>
                    <div style={{ fontSize: 16, fontWeight: 700, color: isDone ? T.primary : T.textPrimary }}>
                      {isDone ? '✓ ' : ''}{day.name}
                    </div>
                    <div style={{ fontSize: 13, color: T.textMuted, marginTop: 4 }}>
                      {day.exercises.slice(0, 3).map(e => e.name).join(' · ')}
                    </div>
                  </div>
                  {isDone && <div style={{ fontSize: 20 }}>✅</div>}
                </div>
                <span style={{
                  display: 'inline-block', marginTop: 10, fontSize: 11,
                  background: T.surface2, borderRadius: 6,
                  padding: '3px 10px', color: T.textMuted, fontWeight: 500
                }}>
                  {day.exercises.length} Übungen
                </span>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}