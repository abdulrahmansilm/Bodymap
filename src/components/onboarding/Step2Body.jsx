import { T, btn } from '../../tokens'

export default function Step2Body({ user, updateUser, goNext }) {
  const Slider = ({ label, field, min, max, unit }) => (
    <div style={{ marginBottom: 28 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 15, color: T.textSecondary, marginBottom: 10 }}>
        <span>{label}</span>
        <span style={{ fontWeight: 700, color: T.primary }}>{user[field]} {unit}</span>
      </div>
      <input type="range" min={min} max={max} value={user[field]}
        onChange={e => updateUser({ [field]: parseInt(e.target.value) })}
        style={{ width: '100%', accentColor: T.primary, height: 6 }} />
    </div>
  )
  return (
    <div style={{ display: 'flex', flexDirection: 'column', flex: 1, padding: '40px 24px 32px' }}>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 32, fontWeight: 700, color: T.textPrimary, lineHeight: 1.2, marginBottom: 10 }}>
          Etwas über deinen Körper
        </div>
        <div style={{ fontSize: 16, color: T.textMuted, marginBottom: 36, lineHeight: 1.6 }}>
          Für einen präziseren Plan.
        </div>
        <Slider label="Alter" field="age" min={14} max={70} unit="Jahre" />
        <Slider label="Größe" field="height" min={140} max={220} unit="cm" />
        <Slider label="Gewicht" field="weight" min={40} max={150} unit="kg" />
        <div style={{ fontSize: 15, color: T.textSecondary, marginBottom: 12, marginTop: 8, fontWeight: 500 }}>Geschlecht</div>
        <div style={{ display: 'flex', gap: 10 }}>
          {[{v:'m',l:'Männlich'},{v:'w',l:'Weiblich'},{v:'d',l:'Divers'}].map(g => (
            <button key={g.v} onClick={() => updateUser({ gender: g.v })} style={{
              flex: 1, padding: '14px 0',
              border: `2px solid ${user.gender === g.v ? T.primary : T.border}`,
              borderRadius: T.radiusMd,
              background: user.gender === g.v ? T.primaryTint : '#fff',
              color: user.gender === g.v ? T.primary : T.textSecondary,
              fontWeight: 600, fontSize: 14, fontFamily: 'inherit', cursor: 'pointer'
            }}>{g.l}</button>
          ))}
        </div>
      </div>
      <div style={{ marginTop: 32 }}>
        <button onClick={goNext} disabled={!user.gender} style={user.gender ? btn('primary') : btn('disabled')}>
          Weiter →
        </button>
      </div>
    </div>
  )
}