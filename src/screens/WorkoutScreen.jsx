import { useState } from 'react'
import WorkoutOverview from '../components/workout/WorkoutOverview'
import WorkoutActive from '../components/workout/WorkoutActive'
import WorkoutDone from '../components/workout/WorkoutDone'

// Steuert die 3 Phasen des Trainings: Übersicht -> aktive Übung -> fertig
export default function WorkoutScreen({ plan, workoutState, setWorkoutState, completedDays, setCompletedDays, goTo }) {
  const [phase, setPhase] = useState('overview')

  const day = plan.days[workoutState.dayIndex]

  const startWorkout = () => {
    setWorkoutState(prev => ({ ...prev, exerciseIndex: 0, setIndex: 0 }))
    setPhase('active')
  }

  const handleSetDone = () => {
    const ex = day.exercises[workoutState.exerciseIndex]
    const nextSet = workoutState.setIndex + 1
    if (nextSet >= ex.sets) {
      const nextEx = workoutState.exerciseIndex + 1
      if (nextEx >= day.exercises.length) {
        // Mark day as completed
        setCompletedDays(prev => [...prev, day.label])
        setPhase('done')
      } else {
        setWorkoutState(prev => ({ ...prev, exerciseIndex: nextEx, setIndex: 0 }))
      }
    } else {
      setWorkoutState(prev => ({ ...prev, setIndex: nextSet }))
    }
  }

  const handleSkip = () => {
    const nextEx = workoutState.exerciseIndex + 1
    if (nextEx >= day.exercises.length) {
      setCompletedDays(prev => [...prev, day.label])
      setPhase('done')
    } else {
      setWorkoutState(prev => ({ ...prev, exerciseIndex: nextEx, setIndex: 0 }))
    }
  }

  const handleBack = () => {
    // Find next incomplete day
    const nextDayIndex = plan.days.findIndex(d => !completedDays.includes(d.label))
    if (nextDayIndex !== -1) {
      setWorkoutState({ dayIndex: nextDayIndex, exerciseIndex: 0, setIndex: 0 })
    }
    goTo('home')
  }

  if (phase === 'overview') return (
    <WorkoutOverview day={day} onStart={startWorkout} onBack={() => goTo('home')} />
  )
  if (phase === 'active') return (
    <WorkoutActive
      day={day}
      workoutState={workoutState}
      onSetDone={handleSetDone}
      onSkip={handleSkip}
    />
  )
  if (phase === 'done') return (
    <WorkoutDone
      day={day}
      plan={plan}
      completedDays={completedDays}
      onBack={handleBack}
    />
  )
}