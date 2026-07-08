import { T, btn } from '../../tokens'

const INJURIES = ['Keine','Knie','Rücken','Handgelenk','Sprunggelenk','Schulter']

export default function Step8Injuries({ user, updateUser, onFinish }) {
  const toggle = (inj) => {
    if (inj === 'Keine') { updateUser({ injuries: ['Keine'] }); return }
    const current = user.injuries.filter(x => x !== 'Keine')
    const idx = current.indexOf(inj)
    if (idx > -1) updateUser({ injuries: current.filter(x => x !== inj) })
    else updateUser({ injuries: [...current, inj] })
  }
  return (
    <div style={{ display: 'flex', flexDirection: 'column', flex: 1, padding: '40px 24px 32px' }}>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 32, fontWeight: 700, color: T.textPrimary, lineHeight: 1.2, marginBottom: 10 }}>Verletzungen?</div>
        <div style={{ fontSize: 16, color: T.textMuted, marginBottom: 32, lineHeight: 1.6 }}>Wichtig für einen sicheren Plan.</div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
          {INJURIES.map(inj => (
            <button key={inj} onClick={() => toggle(inj)} style={{
              padding: '12px 20px', borderRadius: 24, fontSize: 15,
              border: `2px solid ${user.injuries.includes(inj) ? T.primary : T.border}`,
              background: user.injuries.includes(inj) ? T.primaryTint : '#fff',
              color: user.injuries.includes(inj) ? T.primary : T.textSecondary,
              fontWeight: user.injuries.includes(inj) ? 600 : 400,
              fontFamily: 'inherit', cursor: 'pointer'
            }}>{inj}</button>
          ))}
        </div>
      </div>
      <div style={{ marginTop: 32 }}>
        <button onClick={onFinish} style={btn('primary')}>Plan erstellen</button>
      </div>
    </div>
  )
}