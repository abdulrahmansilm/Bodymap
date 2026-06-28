import { T, btn, card } from '../../tokens'

const EXPS = [
  { val: 'beginner', title: 'Kompletter Anfänger', sub: 'Ich fange gerade erst an', icon: '🌱' },
  { val: 'returning', title: 'Wiedereinsteiger', sub: 'War aktiv, längere Pause', icon: '🔄' },
  { val: 'occasional', title: 'Gelegentlich', sub: 'Ab und zu, ohne Plan', icon: '🎯' },
  { val: 'regular', title: 'Regelmäßig', sub: 'Trainiere mehrmals pro Woche', icon: '🏆' },
]

export default function Step4Experience({ user, updateUser, goNext }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', flex: 1, padding: '40px 24px 32px' }}>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 32, fontWeight: 700, color: T.textPrimary, lineHeight: 1.2, marginBottom: 10 }}>Deine Erfahrung?</div>
        <div style={{ fontSize: 16, color: T.textMuted, marginBottom: 32, lineHeight: 1.6 }}>Ehrlich antworten — dein Plan passt sich an.</div>
        {EXPS.map(e => (
          <button key={e.val} onClick={() => updateUser({ experience: e.val })}
            style={{ ...card(user.experience === e.val), display: 'flex', alignItems: 'center', gap: 16, textAlign: 'left', width: '100%', fontFamily: 'inherit' }}>
            <span style={{ width: 48, height: 48, borderRadius: 14, background: user.experience === e.val ? T.primary : T.surface2, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, flexShrink: 0 }}>{e.icon}</span>
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