import { T, btn } from '../../tokens'

const SPORTS = ['Fußball','Tennis','Boxen','Basketball','Schwimmen','Radfahren','Laufen','Hockey','Andere']

export default function Step7Sport({ user, updateUser, goNext }) {
  const toggle = (s) => {
    const idx = user.sport.indexOf(s)
    if (idx > -1) updateUser({ sport: user.sport.filter(x => x !== s) })
    else updateUser({ sport: [...user.sport, s] })
  }
  return (
    <div style={{ display: 'flex', flexDirection: 'column', flex: 1, padding: '40px 24px 32px' }}>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 32, fontWeight: 700, color: T.textPrimary, lineHeight: 1.2, marginBottom: 10 }}>Treibst du Sport?</div>
        <div style={{ fontSize: 16, color: T.textMuted, marginBottom: 32, lineHeight: 1.6 }}>Optional — verbessert deinen Plan gezielt.</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: 10, marginBottom: 12 }}>
          {SPORTS.map(s => (
            <button key={s} onClick={() => toggle(s)} style={{
              padding: '14px 8px', borderRadius: T.radiusMd, fontSize: 14, fontWeight: 500,
              border: `2px solid ${user.sport.includes(s) ? T.primary : T.border}`,
              background: user.sport.includes(s) ? T.primaryTint : '#fff',
              color: user.sport.includes(s) ? T.primary : T.textSecondary,
              fontFamily: 'inherit', cursor: 'pointer'
            }}>{s}</button>
          ))}
        </div>
        <button onClick={() => updateUser({ sport: [] })} style={{
          width: '100%', padding: '16px', textAlign: 'center',
          border: `2px solid ${user.sport.length === 0 ? T.primary : T.border}`,
          borderRadius: T.radiusMd,
          background: user.sport.length === 0 ? T.primaryTint : '#fff',
          color: user.sport.length === 0 ? T.primary : T.textSecondary,
          fontSize: 15, fontWeight: 500, fontFamily: 'inherit', cursor: 'pointer'
        }}>Keine Sportart</button>
      </div>
      <div style={{ marginTop: 16 }}>
        <button onClick={goNext} style={btn('primary')}>Weiter →</button>
      </div>
    </div>
  )
}