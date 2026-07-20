import { useState, useEffect } from 'react'
import './App.css'
import { doc, getDoc, setDoc } from 'firebase/firestore'
import { db } from './firebase'
import { generatePlan } from './utils/api'
import AuthPage from './screens/AuthPage'
import { useAuth } from './AuthContext'
import OnboardingScreen from './screens/OnboardingScreen'
import LoadingScreen from './screens/LoadingScreen'
import HomeScreen from './screens/HomeScreen'
import PlanScreen from './screens/PlanScreen'
import WorkoutScreen from './screens/WorkoutScreen'
import DashboardScreen from './screens/DashboardScreen'
import ProfileScreen from './screens/ProfileScreen'
import { T } from './tokens'
import { IconHome, IconChart, IconList, IconUser } from './components/Icons'

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
  { id: 'profile', label: 'Du', Icon: IconUser },
]

export default function App() {
  const { currentUser, authLoading } = useAuth()

  const [dataLoading, setDataLoading] = useState(false)
  const [dataLoaded, setDataLoaded] = useState(false)

  const [screen, setScreen] = useState('onboarding')
  const [step, setStep] = useState(1)
  const [user, setUser] = useState(INITIAL_USER)
  const [plan, setPlan] = useState(null)
  const [completedDays, setCompletedDays] = useState([])
  const [workoutState, setWorkoutState] = useState({
    dayIndex: 0,
    exerciseIndex: 0,
    setIndex: 0
  })

  const updateUser = (fields) => setUser(prev => ({ ...prev, ...fields }))
  const goNext = () => setStep(s => s + 1)
  const goBack = () => setStep(s => Math.max(1, s - 1))
  const goTo = (s) => setScreen(s)

  // Daten aus Firestore laden wenn sich der eingeloggte User ändert
  useEffect(() => {
    async function loadUserData() {
      if (!currentUser) {
        setDataLoaded(false)
        return
      }

      setDataLoading(true)

      try {
        const docRef = doc(db, 'users', currentUser.uid, 'bodymapData', 'main')
        const docSnap = await getDoc(docRef)

        if (docSnap.exists()) {
          const data = docSnap.data()

          setUser(data.user || INITIAL_USER)
          setPlan(data.plan || null)
          setCompletedDays(data.completedDays || [])
          setStep(1)

          if (data.plan) {
            setScreen('home')
          } else {
            setScreen('onboarding')
          }
        } else {
          setUser(INITIAL_USER)
          setPlan(null)
          setCompletedDays([])
          setStep(1)
          setScreen('onboarding')
        }

        setDataLoaded(true)
      } catch (err) {
        console.error('Fehler beim Laden:', err)
      } finally {
        setDataLoading(false)
      }
    }

    loadUserData()
  }, [currentUser])

  // Speichert User, Plan und Fortschritt automatisch in Firestore sobald sich was ändert
  useEffect(() => {
    async function saveUserData() {
      if (!currentUser || !dataLoaded) return

      await setDoc(
        doc(db, 'users', currentUser.uid, 'bodymapData', 'main'),
        {
          user,
          plan,
          completedDays
        },
        { merge: true }
      )
    }

    if (plan) {
      saveUserData()
    }
  }, [currentUser, dataLoaded, user, plan, completedDays])

  if (authLoading) {
    return <p style={{ padding: 24 }}>Chargement...</p>
  }

  if (!currentUser) {
    return <AuthPage />
  }

  if (dataLoading || !dataLoaded) {
    return <LoadingScreen />
  }

  // Ruft die KI-API auf und speichert den neuen Trainingsplan
  const handleCreatePlan = async () => {
    setScreen('loading')

    try {
      const generatedPlan = await generatePlan(user)

      setPlan(generatedPlan)
      setCompletedDays([])

      await setDoc(
        doc(db, 'users', currentUser.uid, 'bodymapData', 'main'),
        {
          user,
          plan: generatedPlan,
          completedDays: []
        },
        { merge: true }
      )

      setScreen('home')
    } catch (err) {
      console.error('Fehler:', err)
      alert('Plan konnte nicht erstellt werden. API Key prüfen.')
      setScreen('onboarding')
    }
  }

  // Setzt Profil und Plan zurück auf den Anfangszustand
  const handleReset = async () => {
    setUser(INITIAL_USER)
    setPlan(null)
    setCompletedDays([])
    setStep(1)
    setScreen('onboarding')

    await setDoc(
      doc(db, 'users', currentUser.uid, 'bodymapData', 'main'),
      {
        user: INITIAL_USER,
        plan: null,
        completedDays: []
      },
      { merge: true }
    )
  }

  const showNav = ['home', 'dashboard', 'plan', 'profile'].includes(screen)

  return (
    <div className="app-container">
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {screen === 'onboarding' && (
          <OnboardingScreen
            step={step}
            user={user}
            updateUser={updateUser}
            goNext={goNext}
            goBack={goBack}
            onFinish={handleCreatePlan}
          />
        )}

        {screen === 'loading' && <LoadingScreen />}

        {screen === 'home' && (
          <HomeScreen
            user={user}
            plan={plan}
            goTo={goTo}
            setWorkoutState={setWorkoutState}
            completedDays={completedDays}
            onReset={handleReset}
          />
        )}

        {screen === 'dashboard' && (
          <DashboardScreen user={user} plan={plan} goTo={goTo} />
        )}

        {screen === 'plan' && <PlanScreen plan={plan} goTo={goTo} />}

        {screen === 'profile' && (
          <ProfileScreen
            user={user}
            updateUser={updateUser}
            currentUser={currentUser}
            onRecreatePlan={handleCreatePlan}
          />
        )}

        {screen === 'workout' && (
          <WorkoutScreen
            plan={plan}
            workoutState={workoutState}
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
              <button
                key={item.id}
                onClick={() => goTo(item.id)}
                style={{
                  flex: 1,
                  padding: '12px 0 10px',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 4
                }}
              >
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
