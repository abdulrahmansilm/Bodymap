import { T, btn } from '../../tokens'

const SPORTS = ['Fußball', 'Tennis', 'Boxen', 'Basketball', 'Schwimmen', 'Radfahren', 'Laufen', 'Hockey', 'Andere']

export default function Step7Sport({ user, updateUser, goNext }) {
  const toggle = (s) => {
    const idx = user.sport.indexOf(s)
    if (idx > -1) updateUser({ sport: user.sport.filter(x => x !== s) })
    else updateUser({ sport: [...user.sport, s] })
  }
  return (
    <div style={{ display: 'flex', flexDirection: 'column', flex: 1, padding: '8px 24px 32px' }}>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 28, fontWeight: 800, color: T.textPrimary, lineHeight: 1.2, marginBottom: 6 }}>Treibst du eine Sportart?</div>
        <div style={{ fontSize: 14, color: T.textMuted, marginBottom: 20, lineHeight: 1.5 }}>Optional — verbessert deinen Plan gezielt</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, marginBottom: 12 }}>
          {SPORTS.map(s => (
            <button key={s} onClick={() => toggle(s)} style={{
              padding: '16px 8px', borderRadius: T.radiusMd, fontSize: 13, fontWeight: 600, textAlign: 'center',
              border: `2px solid ${user.sport.includes(s) ? T.primary : T.border}`,
              background: user.sport.includes(s) ? T.primaryTint : '#fff',
              color: user.sport.includes(s) ? T.primaryDark : T.textPrimary,
              fontFamily: 'inherit', cursor: 'pointer'
            }}>{s}</button>
          ))}
        </div>
        <button onClick={() => updateUser({ sport: [] })} style={{
          width: '100%', padding: '14px', textAlign: 'center',
          border: `2px solid ${user.sport.length === 0 ? T.textMuted : T.border}`,
          borderRadius: T.radiusMd,
          background: user.sport.length === 0 ? T.surface1 : '#fff',
          color: user.sport.length === 0 ? T.textPrimary : T.textMuted,
          fontSize: 14, fontWeight: 600, fontFamily: 'inherit', cursor: 'pointer'
        }}>Nein, keine Sportart</button>
      </div>
      <div style={{ marginTop: 16 }}>
        <button onClick={goNext} style={btn('primary')}>Weiter →</button>
        <div onClick={goNext} style={{ textAlign: 'center', fontSize: 14, fontWeight: 600, color: T.textMuted, cursor: 'pointer', marginTop: 14, padding: 10 }}>Überspringen</div>
      </div>
    </div>
  )
}