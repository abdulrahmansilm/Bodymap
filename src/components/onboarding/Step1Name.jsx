import { useState } from 'react'
import { T, btn } from '../../tokens'

export default function Step1Name({ user, updateUser, goNext }) {
  const [val, setVal] = useState(user.name)
  const handleNext = () => { updateUser({ name: val.trim() }); goNext() }
  return (
    <div style={{ display: 'flex', flexDirection: 'column', flex: 1, padding: '40px 24px 32px' }}>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 32, fontWeight: 700, color: T.textPrimary, lineHeight: 1.2, marginBottom: 10 }}>
          Wie sollen wir dich nennen?
        </div>
        <div style={{ fontSize: 16, color: T.textMuted, marginBottom: 40, lineHeight: 1.6 }}>
          Vorname, Spitzname — ganz wie du magst.
        </div>
        <input
          type="text" placeholder="Dein Name" value={val} autoFocus
          onChange={e => setVal(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && val.trim() && handleNext()}
          style={{
            width: '100%', padding: '16px 18px', fontSize: 18,
            border: `2px solid ${val ? T.primary : T.border}`,
            borderRadius: T.radiusMd, background: T.surface1,
            color: T.textPrimary, outline: 'none', fontFamily: 'inherit',
            transition: 'border-color 0.2s'
          }}
        />
      </div>
      <button onClick={handleNext} disabled={!val.trim()} style={val.trim() ? btn('primary') : btn('disabled')}>
        Weiter →
      </button>
    </div>
  )
}