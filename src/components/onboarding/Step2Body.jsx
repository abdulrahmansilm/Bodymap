import { T, btn } from '../../tokens'

export default function Step2Body({ user, updateUser, goNext }) {
  const Slider = ({ label, field, min, max, unit }) => {
    const value = user[field]
    const pct = ((value - min) / (max - min)) * 100
    const clamp = (n) => Math.min(max, Math.max(min, n))
    return (
      <div style={{ marginBottom: 24 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 10 }}>
          <span style={{ fontSize: 13, color: T.textMuted, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5 }}>{label}</span>
          <span>
            <input
              type="number" inputMode="numeric" className="onb-num-input" value={value}
              onChange={e => e.target.value !== '' && updateUser({ [field]: clamp(parseInt(e.target.value) || min) })}
              onBlur={e => updateUser({ [field]: clamp(parseInt(e.target.value) || min) })}
              style={{
                width: 52, fontSize: 20, fontWeight: 800, color: T.textPrimary,
                border: 'none', borderBottom: `2px dashed ${T.border}`, background: 'transparent',
                textAlign: 'right', outline: 'none', fontFamily: 'inherit', padding: '0 2px',
              }}
            />
            <span style={{ fontSize: 13, color: T.textMuted, fontWeight: 500, marginLeft: 2 }}> {unit}</span>
          </span>
        </div>
        <input type="range" min={min} max={max} value={value}
          onChange={e => updateUser({ [field]: parseInt(e.target.value) })}
          style={{ background: `linear-gradient(to right, ${T.primary} ${pct}%, #E5E7EB ${pct}%)` }} />
      </div>
    )
  }
  return (
    <div style={{ display: 'flex', flexDirection: 'column', flex: 1, padding: '8px 24px 32px' }}>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 28, fontWeight: 800, color: T.textPrimary, lineHeight: 1.2, marginBottom: 6 }}>
          Etwas über deinen Körper
        </div>
        <div style={{ fontSize: 14, color: T.textMuted, marginBottom: 28, lineHeight: 1.5 }}>
          Für einen präzisen Plan
        </div>
        <Slider label="Alter" field="age" min={14} max={70} unit="Jahre" />
        <Slider label="Größe" field="height" min={140} max={220} unit="cm" />
        <Slider label="Gewicht" field="weight" min={40} max={150} unit="kg" />
        <div style={{ fontSize: 13, color: T.textMuted, marginBottom: 10, marginTop: 4, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.5 }}>Geschlecht</div>
        <div style={{ display: 'flex', gap: 10 }}>
          {[{v:'m',l:'Männlich'},{v:'w',l:'Weiblich'},{v:'d',l:'Divers'}].map(g => (
            <button key={g.v} onClick={() => updateUser({ gender: g.v })} style={{
              flex: 1, padding: '13px 0',
              border: `2px solid ${user.gender === g.v ? T.primary : T.border}`,
              borderRadius: T.radiusMd,
              background: user.gender === g.v ? T.primary : '#fff',
              color: user.gender === g.v ? '#fff' : T.textMuted,
              fontWeight: 600, fontSize: 14, fontFamily: 'inherit', cursor: 'pointer',
              boxShadow: user.gender === g.v ? '0 4px 15px rgba(0,180,216,0.35)' : 'none',
              transition: 'all 0.2s',
            }}>{g.l}</button>
          ))}
        </div>
      </div>
      <div style={{ marginTop: 24 }}>
        <button onClick={goNext} disabled={!user.gender} style={user.gender ? btn('primary') : btn('disabled')}>
          Weiter →
        </button>
      </div>
    </div>
  )
}