import { T } from '../tokens'
import Step1Name from '../components/onboarding/Step1Name'
import Step2Body from '../components/onboarding/Step2Body'
import Step3Goal from '../components/onboarding/Step3Goal'
import Step4Experience from '../components/onboarding/Step4Experience'
import Step5Lifestyle from '../components/onboarding/Step5Lifestyle'
import Step6Schedule from '../components/onboarding/Step6Schedule'
import Step7Sport from '../components/onboarding/Step7Sport'
import Step8Injuries from '../components/onboarding/Step8Injuries'

export default function OnboardingScreen({ step, user, updateUser, goNext, onFinish }) {
  const pct = (step / 8) * 100
  const steps = {
    1: <Step1Name user={user} updateUser={updateUser} goNext={goNext} />,
    2: <Step2Body user={user} updateUser={updateUser} goNext={goNext} />,
    3: <Step3Goal user={user} updateUser={updateUser} goNext={goNext} />,
    4: <Step4Experience user={user} updateUser={updateUser} goNext={goNext} />,
    5: <Step5Lifestyle user={user} updateUser={updateUser} goNext={goNext} />,
    6: <Step6Schedule user={user} updateUser={updateUser} goNext={goNext} />,
    7: <Step7Sport user={user} updateUser={updateUser} goNext={goNext} />,
    8: <Step8Injuries user={user} updateUser={updateUser} onFinish={onFinish} />,
  }
  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: '#fff' }}>
      <div style={{ maxWidth: 680, width: '100%', margin: '0 auto', padding: '48px 24px 0' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
          <span style={{ fontSize: 13, color: T.textMuted, fontWeight: 500 }}>Schritt {step} von 8</span>
          <span style={{ fontSize: 13, color: T.primary, fontWeight: 600 }}>{Math.round(pct)}%</span>
        </div>
        <div style={{ height: 4, background: T.surface2, borderRadius: 2 }}>
          <div style={{ height: 4, background: T.primary, borderRadius: 2, width: `${pct}%`, transition: 'width 0.4s ease' }} />
        </div>
      </div>
      <div style={{ maxWidth: 680, width: '100%', margin: '0 auto', flex: 1, display: 'flex', flexDirection: 'column' }}>
        {steps[step]}
      </div>
    </div>
  )
}