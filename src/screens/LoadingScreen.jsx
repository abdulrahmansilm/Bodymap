import { T } from '../tokens'

export default function LoadingScreen() {
  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 32, textAlign: 'center', background: '#fff', minHeight: '80vh' }}>
      <div style={{ width: 60, height: 60, borderRadius: '50%', border: `3px solid ${T.surface2}`, borderTopColor: T.primary, animation: 'spin 0.9s linear infinite', marginBottom: 32 }} />
      <div style={{ fontSize: 22, fontWeight: 700, color: T.textPrimary, marginBottom: 10 }}>Dein Plan wird erstellt</div>
      <div style={{ fontSize: 16, color: T.textMuted, lineHeight: 1.6, maxWidth: 400 }}>Die KI analysiert dein Profil und erstellt einen personalisierten Trainingsplan für dich.</div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}