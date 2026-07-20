import { T, btn, circleOpt } from '../../tokens'

const LOCATIONS = ['Zuhause (ohne Geräte)', 'Zuhause (mit Hanteln)', 'Fitnessstudio']

export default function Step6Schedule({ user, updateUser, goNext }) {
  const Circle = ({ value, field, label, small }) => (
    <button onClick={() => updateUser({ [field]: value })}
      style={{ ...circleOpt(user[field] === value, 52), fontSize: small ? 12 : 14 }}>{label}</button>
  )
  return (
    <div style={{ display: 'flex', flexDirection: 'column', flex: 1, padding: '8px 24px 32px' }}>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 28, fontWeight: 800, color: T.textPrimary, lineHeight: 1.2, marginBottom: 6 }}>Wann &amp; Wo</div>
        <div style={{ fontSize: 14, color: T.textMuted, marginBottom: 24, lineHeight: 1.5 }}>Dein perfekter Trainingsplan startet hier</div>

        <div style={{ fontSize: 12, fontWeight: 700, color: T.textMuted, textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 10 }}>Tage pro Woche</div>
        <div style={{ display: 'flex', gap: 10, marginBottom: 22, flexWrap: 'wrap' }}>
          {[1,2,3,4,5].map(d => <Circle key={d} value={d} field="days" label={`${d}×`} />)}
        </div>

        <div style={{ fontSize: 12, fontWeight: 700, color: T.textMuted, textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 10 }}>Dauer pro Einheit</div>
        <div style={{ display: 'flex', gap: 10, marginBottom: 22, flexWrap: 'wrap' }}>
          {[20,45,60,90].map(d => <Circle key={d} value={d} field="duration" label={`${d}m`} small />)}
        </div>

        <div style={{ fontSize: 12, fontWeight: 700, color: T.textMuted, textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 12 }}>Trainingsort</div>
        {LOCATIONS.map(l => (
          <button key={l} onClick={() => updateUser({ location: l })} style={{
            display: 'block', width: '100%', padding: '15px 18px', marginBottom: 10,
            border: `2px solid ${user.location === l ? T.primary : T.border}`,
            borderRadius: T.radiusMd, background: user.location === l ? T.primaryTint : '#fff',
            color: user.location === l ? T.primary : T.textPrimary,
            fontSize: 15, fontWeight: 600, textAlign: 'left', fontFamily: 'inherit', cursor: 'pointer'
          }}>{l}</button>
        ))}
      </div>
      <div style={{ marginTop: 16 }}>
        <button onClick={goNext} disabled={!user.location} style={user.location ? btn('primary') : btn('disabled')}>Weiter →</button>
      </div>
    </div>
  )
}