import { T, btn } from '../../tokens'
import { IconLock } from '../Icons'

// Onboarding Schritt 8: Verletzungen/Einschränkungen auswählen, letzter Schritt
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
    <div style={{ display: 'flex', flexDirection: 'column', flex: 1, padding: '8px 24px 32px' }}>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 28, fontWeight: 800, color: T.textPrimary, lineHeight: 1.2, marginBottom: 6 }}>Verletzungen oder Einschränkungen?</div>
        <div style={{ fontSize: 14, color: T.textMuted, marginBottom: 24, lineHeight: 1.5 }}>Wichtig für einen sicheren Plan – du kannst später anpassen</div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginBottom: 28 }}>
          {INJURIES.map(inj => {
            const isNone = inj === 'Keine'
            const active = user.injuries.includes(inj)
            const color = isNone ? T.success : T.primary
            const tint = isNone ? T.successTint : T.primaryTint
            return (
              <button key={inj} onClick={() => toggle(inj)} style={{
                padding: '10px 18px', borderRadius: 50, fontSize: 14,
                border: `2px solid ${active ? color : (isNone ? T.success : T.border)}`,
                background: active ? tint : '#fff',
                color: active ? color : (isNone ? T.success : T.textPrimary),
                fontWeight: active || isNone ? 700 : 500,
                fontFamily: 'inherit', cursor: 'pointer'
              }}>{isNone && active ? '✓ ' : ''}{inj}</button>
            )
          })}
        </div>
        <div style={{ background: T.surface1, borderRadius: T.radiusMd, padding: '14px 16px', border: `1.5px solid ${T.border}`, display: 'flex', alignItems: 'flex-start', gap: 8 }}>
          <IconLock color={T.textMuted} size={13} />
          <div style={{ fontSize: 12, color: T.textMuted, lineHeight: 1.6 }}>Deine Angaben werden nur für die Planerstellung verwendet und bleiben privat.</div>
        </div>
      </div>
      <div style={{ marginTop: 24 }}>
        <button onClick={onFinish} style={btn('primary')}>Plan erstellen</button>
      </div>
    </div>
  )
}