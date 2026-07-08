import { T, btn, card } from '../../tokens'

const GOALS = [
  { val: 'muscle', title: 'Muskeln aufbauen', sub: 'Stärker und definiert werden', icon: '💪' },
  { val: 'lose', title: 'Abnehmen', sub: 'Fett reduzieren, schlanker werden', icon: '🔥' },
  { val: 'fit', title: 'Fitter werden', sub: 'Mehr Energie, besser fühlen', icon: '⚡' },
  { val: 'health', title: 'Gesund bleiben', sub: 'Rücken, Haltung, Alltag', icon: '🫀' },
]

export default function Step3Goal({ user, updateUser, goNext }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', flex: 1, padding: '40px 24px 32px' }}>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 32, fontWeight: 700, color: T.textPrimary, lineHeight: 1.2, marginBottom: 10 }}>
          Was ist dein Ziel?
        </div>
        <div style={{ fontSize: 16, color: T.textMuted, marginBottom: 32, lineHeight: 1.6 }}>
          Dein Plan wird genau darauf ausgerichtet.
        </div>
        {GOALS.map(g => (
          <button key={g.val} onClick={() => updateUser({ goal: g.val })}
            style={{ ...card(user.goal === g.val), display: 'flex', alignItems: 'center', gap: 16, textAlign: 'left', width: '100%', fontFamily: 'inherit' }}>
            <span style={{ width: 48, height: 48, borderRadius: 14, background: user.goal === g.val ? T.primary : T.surface2, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, flexShrink: 0 }}>{g.icon}</span>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 16, fontWeight: 600, color: user.goal === g.val ? T.primary : T.textPrimary }}>{g.title}</div>
              <div style={{ fontSize: 13, color: T.textMuted, marginTop: 3 }}>{g.sub}</div>
            </div>
            {user.goal === g.val && (
              <div style={{ width: 22, height: 22, borderRadius: '50%', background: T.primary, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <span style={{ color: '#fff', fontSize: 12 }}>✓</span>
              </div>
            )}
          </button>
        ))}
      </div>
      <div style={{ marginTop: 16 }}>
        <button onClick={goNext} disabled={!user.goal} style={user.goal ? btn('primary') : btn('disabled')}>Weiter →</button>
      </div>
    </div>
  )
}