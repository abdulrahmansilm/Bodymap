import { T, btn, card } from '../../tokens'

// Onboarding Schritt 4: Trainingserfahrung auswählen
const EXPS = [
  { val: 'beginner', title: 'Kompletter Anfänger', sub: 'Ich fange gerade erst an' },
  { val: 'returning', title: 'Wiedereinsteiger', sub: 'War aktiv, längere Pause' },
  { val: 'occasional', title: 'Gelegentlich', sub: 'Ab und zu, ohne Plan' },
  { val: 'regular', title: 'Regelmäßig', sub: 'Trainiere mehrmals pro Woche' },
]

export default function Step4Experience({ user, updateUser, goNext }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', flex: 1, padding: '8px 24px 32px' }}>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 28, fontWeight: 800, color: T.textPrimary, lineHeight: 1.2, marginBottom: 6 }}>Deine Erfahrung?</div>
        <div style={{ fontSize: 14, color: T.textMuted, marginBottom: 24, lineHeight: 1.5 }}>So können wir den richtigen Start finden</div>
        {EXPS.map(e => (
          <button key={e.val} onClick={() => updateUser({ experience: e.val })}
            style={{ ...card(user.experience === e.val), display: 'flex', alignItems: 'center', gap: 16, textAlign: 'left', width: '100%', fontFamily: 'inherit' }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 16, fontWeight: 600, color: user.experience === e.val ? T.primary : T.textPrimary }}>{e.title}</div>
              <div style={{ fontSize: 13, color: T.textMuted, marginTop: 3 }}>{e.sub}</div>
            </div>
            {user.experience === e.val && (
              <div style={{ width: 22, height: 22, borderRadius: '50%', background: T.primary, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <span style={{ color: '#fff', fontSize: 12 }}>✓</span>
              </div>
            )}
          </button>
        ))}
      </div>
      <div style={{ marginTop: 16 }}>
        <button onClick={goNext} disabled={!user.experience} style={user.experience ? btn('primary') : btn('disabled')}>Weiter →</button>
      </div>
    </div>
  )
}