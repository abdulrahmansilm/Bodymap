import { T, btn, card } from '../../tokens'

const LIVES = [
  { val: 'sitting', title: 'Meistens sitzend', sub: 'Student, Bürojob, Home Office', icon: '💻' },
  { val: 'mixed', title: 'Gemischt', sub: 'Mal sitzend, mal aktiv', icon: '🔀' },
  { val: 'active', title: 'Körperlich aktiv', sub: 'Handwerker, viel laufen, stehen', icon: '🦺' },
]

export default function Step5Lifestyle({ user, updateUser, goNext }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', flex: 1, padding: '40px 24px 32px' }}>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 32, fontWeight: 700, color: T.textPrimary, lineHeight: 1.2, marginBottom: 10 }}>Wie ist dein Alltag?</div>
        <div style={{ fontSize: 16, color: T.textMuted, marginBottom: 32, lineHeight: 1.6 }}>Wer im Büro sitzt braucht einen anderen Plan.</div>
        {LIVES.map(l => (
          <button key={l.val} onClick={() => updateUser({ lifestyle: l.val })}
            style={{ ...card(user.lifestyle === l.val), display: 'flex', alignItems: 'center', gap: 16, textAlign: 'left', width: '100%', fontFamily: 'inherit' }}>
            <span style={{ width: 48, height: 48, borderRadius: 14, background: user.lifestyle === l.val ? T.primary : T.surface2, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, flexShrink: 0 }}>{l.icon}</span>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 16, fontWeight: 600, color: user.lifestyle === l.val ? T.primary : T.textPrimary }}>{l.title}</div>
              <div style={{ fontSize: 13, color: T.textMuted, marginTop: 3 }}>{l.sub}</div>
            </div>
            {user.lifestyle === l.val && (
              <div style={{ width: 22, height: 22, borderRadius: '50%', background: T.primary, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <span style={{ color: '#fff', fontSize: 12 }}>✓</span>
              </div>
            )}
          </button>
        ))}
      </div>
      <div style={{ marginTop: 16 }}>
        <button onClick={goNext} disabled={!user.lifestyle} style={user.lifestyle ? btn('primary') : btn('disabled')}>Weiter →</button>
      </div>
    </div>
  )
}