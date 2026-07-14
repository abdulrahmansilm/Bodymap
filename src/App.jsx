import { useState, useEffect } from 'react'
import './App.css'
import { generatePlan } from './utils/api'
import OnboardingScreen from './screens/OnboardingScreen'
import LoadingScreen from './screens/LoadingScreen'
import HomeScreen from './screens/HomeScreen'
import PlanScreen from './screens/PlanScreen'
import WorkoutScreen from './screens/WorkoutScreen'
import DashboardScreen from './screens/DashboardScreen'
import { T } from './tokens'
import { IconHome, IconChart, IconList } from './components/Icons'

const INITIAL_USER = {
  name: '', age: 22, height: 178, weight: 74, gender: '',
  goal: '', experience: '', lifestyle: '',
  days: 3, duration: 45, location: '',
  sport: [], injuries: []
}

const NAV_ITEMS = [
  { id: 'home', label: 'Home', Icon: IconHome },
  { id: 'dashboard', label: 'Stats', Icon: IconChart },
  { id: 'plan', label: 'Plan', Icon: IconList },
]

function loadState() {
  try {
    const saved = localStorage.getItem('bodymap_state')
    if (saved) return JSON.parse(saved)
  } catch { }
  return null
}

function saveState(state) {
  try {
    localStorage.setItem('bodymap_state', JSON.stringify(state))
  } catch { }
}

export default function App() {
  const saved = loadState()

  const [screen, setScreen] = useState(saved?.plan ? 'home' : 'onboarding')
  const [step, setStep] = useState(1)
  const [user, setUser] = useState(saved?.user || INITIAL_USER)
  const [plan, setPlan] = useState(saved?.plan || null)
  const [completedDays, setCompletedDays] = useState(saved?.completedDays || [])
  const [workoutState, setWorkoutState] = useState({ dayIndex: 0, exerciseIndex: 0, setIndex: 0 })

  const updateUser = (fields) => setUser(prev => ({ ...prev, ...fields }))
  const goNext = () => setStep(s => s + 1)
  const goBack = () => setStep(s => Math.max(1, s - 1))
  const goTo = (s) => setScreen(s)

  useEffect(() => {
    if (plan) {
      saveState({ user, plan, completedDays })
    }
  }, [user, plan, completedDays])

  const handleCreatePlan = async () => {
    setScreen('loading')
    try {
      const generatedPlan = await generatePlan(user)
      setPlan(generatedPlan)
      setCompletedDays([])
      setScreen('home')
    } catch (err) {
      console.error('Fehler:', err)
      alert('Plan konnte nicht erstellt werden. API Key prüfen.')
      setScreen('onboarding')
    }
  }

  const handleReset = () => {
    localStorage.removeItem('bodymap_state')
    setUser(INITIAL_USER)
    setPlan(null)
    setCompletedDays([])
    setStep(1)
    setScreen('onboarding')
  }

  const showNav = ['home', 'dashboard', 'plan'].includes(screen)

  return (
    <div className="app-container">
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {screen === 'onboarding' && (
          <OnboardingScreen
            step={step} user={user} updateUser={updateUser}
            goNext={goNext} goBack={goBack} onFinish={handleCreatePlan}
          />
        )}
        {screen === 'loading' && <LoadingScreen />}
        {screen === 'home' && (
          <HomeScreen
            user={user} plan={plan} goTo={goTo}
            setWorkoutState={setWorkoutState}
            completedDays={completedDays}
            onReset={handleReset}
          />
        )}
        {screen === 'dashboard' && (
          <DashboardScreen user={user} plan={plan} goTo={goTo} />
        )}
        {screen === 'plan' && <PlanScreen plan={plan} goTo={goTo} />}
        {screen === 'workout' && (
          <WorkoutScreen
            plan={plan} workoutState={workoutState}
            setWorkoutState={setWorkoutState}
            completedDays={completedDays}
            setCompletedDays={setCompletedDays}
            goTo={goTo}
          />
        )}
      </div>

      {showNav && (
        <div style={{ borderTop: `0.5px solid ${T.border}`, background: '#fff', flexShrink: 0 }}>
          <div style={{ maxWidth: 680, margin: '0 auto', display: 'flex' }}>
            {NAV_ITEMS.map(item => (
              <button key={item.id} onClick={() => goTo(item.id)} style={{
                flex: 1, padding: '12px 0 10px', background: 'none', border: 'none',
                cursor: 'pointer', display: 'flex', flexDirection: 'column',
                alignItems: 'center', gap: 4
              }}>
                <item.Icon color={screen === item.id ? T.primary : T.textMuted} size={22} />
                <span style={{
                  fontSize: 11,
                  fontWeight: screen === item.id ? 600 : 400,
                  color: screen === item.id ? T.primary : T.textMuted
                }}>
                  {item.label}
                </span>
                {screen === item.id && (
                  <div style={{ width: 20, height: 3, borderRadius: 2, background: T.primary }} />
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}