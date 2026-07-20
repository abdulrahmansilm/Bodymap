import { useState } from 'react'
import { T, btn } from '../../tokens'

// Onboarding Schritt 1: Name eingeben
export default function Step1Name({ user, updateUser, goNext }) {
  const [val, setVal] = useState(user.name)
  const handleNext = () => { updateUser({ name: val.trim() }); goNext() }
  return (
    <div style={{ display: 'flex', flexDirection: 'column', flex: 1, padding: '40px 24px 32px' }}>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 28, fontWeight: 800, color: T.textPrimary, lineHeight: 1.2, marginBottom: 6 }}>
          Wie sollen wir dich nennen?
        </div>
        <div style={{ fontSize: 14, color: T.textMuted, marginBottom: 28, lineHeight: 1.5 }}>
          Vorname, Spitzname — ganz wie du magst.
        </div>
        <input
          type="text" placeholder="Dein Name …" value={val} autoFocus
          onChange={e => setVal(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && val.trim() && handleNext()}
          style={{
            width: '100%', padding: '15px 18px', fontSize: 17,
            border: `2px solid ${val ? T.primary : T.border}`,
            borderRadius: T.radiusMd, background: '#fff',
            color: T.textPrimary, outline: 'none', fontFamily: 'inherit',
            transition: 'all 0.2s',
            boxShadow: val ? '0 0 0 4px rgba(0,180,216,0.12)' : 'none',
          }}
        />
      </div>
      <button onClick={handleNext} disabled={!val.trim()} style={val.trim() ? btn('primary') : btn('disabled')}>
        Weiter →
      </button>
    </div>
  )
}