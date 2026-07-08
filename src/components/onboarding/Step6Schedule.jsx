import { T, btn } from '../../tokens'

const LOCATIONS = ['Zuhause (ohne Geräte)', 'Zuhause (mit Hanteln)', 'Fitnessstudio']

export default function Step6Schedule({ user, updateUser, goNext }) {
  const Circle = ({ value, field, label }) => (
    <button onClick={() => updateUser({ [field]: value })} style={{
      width: 60, height: 60, borderRadius: '50%',
      border: `2px solid ${user[field] === value ? T.primary : T.border}`,
      background: user[field] === value ? T.primary : '#fff',
      color: user[field] === value ? '#fff' : T.textSecondary,
      fontSize: 14, fontWeight: 700, fontFamily: 'inherit', cursor: 'pointer'
    }}>{label}</button>
  )
  return (
    <div style={{ display: 'flex', flexDirection: 'column', flex: 1, padding: '40px 24px 32px' }}>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 32, fontWeight: 700, color: T.textPrimary, lineHeight: 1.2, marginBottom: 10 }}>Wann und wo?</div>
        <div style={{ fontSize: 16, color: T.textMuted, marginBottom: 36, lineHeight: 1.6 }}>Damit dein Plan in deinen Alltag passt.</div>

        <div style={{ fontSize: 15, fontWeight: 600, color: T.textSecondary, marginBottom: 14 }}>Tage pro Woche</div>
        <div style={{ display: 'flex', gap: 10, marginBottom: 32 }}>
          {[1,2,3,4,5].map(d => <Circle key={d} value={d} field="days" label={`${d}x`} />)}
        </div>

        <div style={{ fontSize: 15, fontWeight: 600, color: T.textSecondary, marginBottom: 14 }}>Dauer pro Einheit</div>
        <div style={{ display: 'flex', gap: 10, marginBottom: 32 }}>
          {[20,45,60,90].map(d => <Circle key={d} value={d} field="duration" label={`${d}m`} />)}
        </div>

        <div style={{ fontSize: 15, fontWeight: 600, color: T.textSecondary, marginBottom: 14 }}>Trainingsort</div>
        {LOCATIONS.map(l => (
          <button key={l} onClick={() => updateUser({ location: l })} style={{
            display: 'block', width: '100%', padding: '16px 18px', marginBottom: 10,
            border: `2px solid ${user.location === l ? T.primary : T.border}`,
            borderRadius: T.radiusMd, background: user.location === l ? T.primaryTint : '#fff',
            color: user.location === l ? T.primary : T.textPrimary,
            fontSize: 15, fontWeight: 500, textAlign: 'left', fontFamily: 'inherit', cursor: 'pointer'
          }}>{l}</button>
        ))}
      </div>
      <div style={{ marginTop: 16 }}>
        <button onClick={goNext} disabled={!user.location} style={user.location ? btn('primary') : btn('disabled')}>Weiter →</button>
      </div>
    </div>
  )
}