import { useState, useEffect } from 'react'
import { T, btn } from '../../tokens'
import { fetchExerciseData } from '../../utils/api'
import { IconDumbbell } from '../Icons'

export default function WorkoutActive({ day, workoutState, onSetDone, onSkip }) {
  const [showInfo, setShowInfo] = useState(false)
  const [exerciseData, setExerciseData] = useState(null)
  const [currentStep, setCurrentStep] = useState(0)
  const [timeLeft, setTimeLeft] = useState(0)
  const [timerInterval, setTimerInterval] = useState(null)

  const ex = day.exercises[workoutState.exerciseIndex]
  const totalEx = day.exercises.length
  const pct = (workoutState.exerciseIndex / totalEx) * 100

  useEffect(() => {
    setExerciseData(null)
    setShowInfo(false)
    setCurrentStep(0)
    setTimeLeft(0)
    if (timerInterval) clearInterval(timerInterval)
    fetchExerciseData(ex.searchTerm).then(data => setExerciseData(data))
  }, [workoutState.exerciseIndex])

  useEffect(() => {
    return () => { if (timerInterval) clearInterval(timerInterval) }
  }, [timerInterval])

  const handleSetDone = () => {
    if (timerInterval) clearInterval(timerInterval)
    setTimeLeft(ex.rest)
    const interval = setInterval(() => {
      setTimeLeft(prev => { if (prev <= 1) { clearInterval(interval); return 0 } return prev - 1 })
    }, 1000)
    setTimerInterval(interval)
    onSetDone()
  }

  const skipRest = () => { if (timerInterval) clearInterval(timerInterval); setTimeLeft(0) }

  return (
    <div style={{ background: '#fff', minHeight: '100vh' }}>
      <div style={{ maxWidth: 680, margin: '0 auto', padding: '0 24px 40px' }}>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '48px 0 16px', borderBottom: `1px solid ${T.border}`, marginBottom: 24 }}>
          <div style={{ fontSize: 14, color: T.textMuted, fontWeight: 500 }}>Übung {workoutState.exerciseIndex + 1} von {totalEx}</div>
          <button onClick={() => setShowInfo(s => !s)} style={{ fontSize: 14, color: T.primary, background: 'none', border: 'none', fontFamily: 'inherit', cursor: 'pointer', fontWeight: 600 }}>
            {showInfo ? 'Info schließen' : 'Warum diese Übung?'}
          </button>
        </div>

        <div style={{ height: 4, background: T.surface2, borderRadius: 2, marginBottom: 28 }}>
          <div style={{ height: 4, background: T.primary, borderRadius: 2, width: `${pct}%`, transition: 'width 0.4s' }} />
        </div>

        <div style={{ background: T.primaryTint, borderRadius: T.radiusLg, height: 200, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', marginBottom: 28, position: 'relative' }}>
          <IconDumbbell color={T.primary} size={56} />
          <div style={{ fontSize: 15, fontWeight: 600, color: T.primary, marginTop: 10 }}>{ex.name}</div>
          {exerciseData && (
            <>
              <div style={{ position: 'absolute', bottom: 12, left: 14, fontSize: 12, background: T.primary, borderRadius: 6, padding: '3px 10px', color: '#fff', fontWeight: 600 }}>{exerciseData.equipment}</div>
              <div style={{ position: 'absolute', bottom: 12, right: 14, fontSize: 12, background: T.primaryLight, borderRadius: 6, padding: '3px 10px', color: '#fff', fontWeight: 600 }}>{exerciseData.difficulty}</div>
            </>
          )}
        </div>

        <div style={{ fontSize: 26, fontWeight: 700, color: T.textPrimary, marginBottom: 6 }}>
          {ex.name}
          <span style={{ fontSize: 12, background: T.primaryTint, borderRadius: 6, padding: '4px 10px', color: T.primary, marginLeft: 10, fontWeight: 600 }}>{ex.muscle}</span>
        </div>
        <div style={{ fontSize: 15, color: T.textMuted, marginBottom: 24 }}>{ex.sets} Sätze × {ex.reps} Wdh.</div>

        <div style={{ marginBottom: 24 }}>
          <div style={{ fontSize: 13, color: T.textMuted, marginBottom: 10, fontWeight: 500 }}>Satz {workoutState.setIndex + 1} von {ex.sets}</div>
          <div style={{ display: 'flex', gap: 10 }}>
            {Array.from({ length: ex.sets }).map((_, i) => (
              <div key={i} style={{ width: 14, height: 14, borderRadius: '50%', background: i < workoutState.setIndex ? T.primary : 'transparent', border: `2px solid ${i < workoutState.setIndex ? T.primary : T.borderStrong}` }} />
            ))}
          </div>
        </div>

        {timeLeft > 0 && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24, padding: '16px 20px', background: T.surface1, borderRadius: T.radiusMd, border: `1px solid ${T.border}` }}>
            <div style={{ width: 72, height: 72, borderRadius: '50%', border: `3px solid ${T.primary}`, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <div style={{ fontSize: 20, fontWeight: 700, color: T.primary }}>{timeLeft}s</div>
              <div style={{ fontSize: 11, color: T.textMuted }}>Pause</div>
            </div>
            <button onClick={skipRest} style={{ ...btn('secondary'), flex: 1, padding: '14px 0' }}>Pause überspringen</button>
          </div>
        )}

        {exerciseData && exerciseData.instructions.length > 0 && (
          <div style={{ marginBottom: 24 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: T.textSecondary, marginBottom: 12 }}>
              Ausführung — Schritt {currentStep + 1} von {exerciseData.instructions.length}
            </div>
            <div style={{ background: T.primaryTint, borderRadius: T.radiusMd, padding: '16px 18px', fontSize: 15, color: T.textSecondary, lineHeight: 1.7, marginBottom: 10 }}>
              {exerciseData.instructions[currentStep]}
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              <button onClick={() => setCurrentStep(s => Math.max(0, s - 1))} disabled={currentStep === 0}
                style={{ flex: 1, padding: '12px 0', background: '#fff', border: `1px solid ${T.border}`, borderRadius: T.radiusSm, fontSize: 14, color: currentStep === 0 ? T.textMuted : T.textSecondary, fontFamily: 'inherit', cursor: currentStep === 0 ? 'not-allowed' : 'pointer', fontWeight: 500 }}>← Zurück</button>
              <button onClick={() => setCurrentStep(s => Math.min(exerciseData.instructions.length - 1, s + 1))} disabled={currentStep === exerciseData.instructions.length - 1}
                style={{ flex: 1, padding: '12px 0', background: '#fff', border: `1px solid ${T.border}`, borderRadius: T.radiusSm, fontSize: 14, color: T.textSecondary, fontFamily: 'inherit', cursor: 'pointer', fontWeight: 500 }}>Weiter →</button>
            </div>
          </div>
        )}

        {showInfo && (
          <div style={{ background: T.surface1, borderRadius: T.radiusMd, padding: '16px 18px', marginBottom: 24, border: `1px solid ${T.border}` }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: T.textSecondary, marginBottom: 6 }}>Warum {ex.name}?</div>
            <div style={{ fontSize: 14, color: T.textMuted, lineHeight: 1.7, marginBottom: 14 }}>{ex.why}</div>
            <div style={{ fontSize: 13, fontWeight: 700, color: T.textSecondary, marginBottom: 6 }}>Tipp</div>
            <div style={{ fontSize: 14, color: T.textMuted, lineHeight: 1.7 }}>{ex.tip}</div>
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <button onClick={handleSetDone} style={btn('primary')}>Satz erledigt ✓</button>
          <button onClick={onSkip} style={btn('secondary')}>Übung überspringen</button>
        </div>
      </div>
    </div>
  )
}