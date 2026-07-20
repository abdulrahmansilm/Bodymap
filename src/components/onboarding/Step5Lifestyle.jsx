import { T, btn, card } from '../../tokens'

// Onboarding Schritt 5: Alltag/Lifestyle auswählen
const LIVES = [
  { val: 'sitting', title: 'Meistens sitzend', sub: 'Student, Bürojob, Home Office' },
  { val: 'mixed', title: 'Gemischt', sub: 'Mal sitzend, mal aktiv' },
  { val: 'active', title: 'Körperlich aktiv', sub: 'Handwerker, viel laufen, stehen' },
]

export default function Step5Lifestyle({ user, updateUser, goNext }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', flex: 1, padding: '8px 24px 32px' }}>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 28, fontWeight: 800, color: T.textPrimary, lineHeight: 1.2, marginBottom: 6 }}>Wie ist dein Alltag?</div>
        <div style={{ fontSize: 14, color: T.textMuted, marginBottom: 24, lineHeight: 1.5 }}>Wer den ganzen Tag sitzt, braucht einen anderen Plan als jemand, der viel läuft</div>
        {LIVES.map(l => (
          <button key={l.val} onClick={() => updateUser({ lifestyle: l.val })}
            style={{ ...card(user.lifestyle === l.val), display: 'flex', alignItems: 'center', gap: 16, textAlign: 'left', width: '100%', fontFamily: 'inherit' }}>
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