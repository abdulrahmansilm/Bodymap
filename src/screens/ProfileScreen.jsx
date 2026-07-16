import { useState } from 'react'
import { signOut, updatePassword } from 'firebase/auth'
import { auth } from '../firebase'
import { T } from '../tokens'

// Profildaten bearbeiten, Plan neu generieren, Passwort ändern und Logout
export default function ProfileScreen({ user, updateUser, currentUser, onRecreatePlan }) {
  const [newPassword, setNewPassword] = useState('')
  const [message, setMessage] = useState('')

  const W = { maxWidth: 680, margin: '0 auto', width: '100%', padding: '0 24px' }

  const inputStyle = {
    width: '100%',
    padding: '14px 16px',
    borderRadius: T.radiusMd,
    border: `1.5px solid ${T.border}`,
    fontSize: 15,
    fontFamily: 'inherit',
    color: T.textPrimary,
    background: '#fff',
    marginTop: 8,
    marginBottom: 14
  }

  const labelStyle = {
    fontSize: 11,
    fontWeight: 700,
    color: T.textMuted,
    textTransform: 'uppercase',
    letterSpacing: '0.06em'
  }

  const cardStyle = {
    border: `1.5px solid ${T.border}`,
    borderRadius: T.radiusMd,
    padding: '18px 20px',
    background: '#fff',
    marginBottom: 18
  }

  const primaryButton = {
    width: '100%',
    padding: '15px 0',
    background: T.primary,
    border: 'none',
    borderRadius: T.radiusMd,
    color: '#fff',
    fontSize: 16,
    fontWeight: 600,
    fontFamily: 'inherit',
    cursor: 'pointer'
  }

  const updateArrayField = (field, value) => {
    updateUser({ [field]: value ? [value] : [] })
  }

  // Ändert das Passwort beim eingeloggten Firebase-User
  const handlePasswordChange = async () => {
    setMessage('')

    if (newPassword.length < 6) {
      setMessage('Passwort muss mindestens 6 Zeichen haben.')
      return
    }

    try {
      await updatePassword(currentUser, newPassword)
      setNewPassword('')
      setMessage('Passwort wurde geändert.')
    } catch {
      setMessage('Bitte neu einloggen, dann Passwort ändern.')
    }
  }

  return (
    <div style={{ background: '#fff', minHeight: '100vh' }}>
      <div style={{ ...W, paddingTop: 48, paddingBottom: 8 }}>
        <div style={{ fontSize: 32, fontWeight: 700, color: T.textPrimary }}>
          Du
        </div>
        <div style={{ fontSize: 15, color: T.textMuted, marginTop: 6 }}>
          Deine Eingaben und dein Konto.
        </div>
      </div>

      <div style={{ ...W, paddingTop: 20, paddingBottom: 90 }}>
        <div style={{
          background: T.primaryTint,
          borderRadius: T.radiusMd,
          padding: '16px 20px',
          marginBottom: 24,
          border: `1px solid ${T.primaryBorder}`
        }}>
          <div style={{
            fontSize: 11,
            fontWeight: 700,
            color: T.primary,
            marginBottom: 6,
            textTransform: 'uppercase',
            letterSpacing: '0.06em'
          }}>
            Profil
          </div>
          <div style={{ fontSize: 14, color: T.textSecondary, lineHeight: 1.7 }}>
            Hier kannst du deine Angaben ändern.
          </div>
        </div>

        <div style={{ fontSize: 11, fontWeight: 700, color: T.textMuted, marginBottom: 14, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
          Deine Daten
        </div>

        <div style={cardStyle}>
          <label style={labelStyle}>Name</label>
          <input style={inputStyle} value={user.name || ''} onChange={(e) => updateUser({ name: e.target.value })} />

          <label style={labelStyle}>Alter</label>
          <input style={inputStyle} type="number" value={user.age || ''} onChange={(e) => updateUser({ age: Number(e.target.value) })} />

          <label style={labelStyle}>Größe</label>
          <input style={inputStyle} type="number" value={user.height || ''} onChange={(e) => updateUser({ height: Number(e.target.value) })} />

          <label style={labelStyle}>Gewicht</label>
          <input style={inputStyle} type="number" value={user.weight || ''} onChange={(e) => updateUser({ weight: Number(e.target.value) })} />

          <label style={labelStyle}>Geschlecht</label>
          <select style={inputStyle} value={user.gender || 'weiblich'} onChange={(e) => updateUser({ gender: e.target.value })}>
            <option value="weiblich">Weiblich</option>
            <option value="männlich">Männlich</option>
            <option value="divers">Divers</option>
          </select>

          <label style={labelStyle}>Ziel</label>
          <select style={inputStyle} value={user.goal || 'Fitness verbessern'} onChange={(e) => updateUser({ goal: e.target.value })}>
            <option value="Muskelaufbau">Muskelaufbau</option>
            <option value="Abnehmen">Abnehmen</option>
            <option value="Fitness verbessern">Fitness verbessern</option>
            <option value="Kraft aufbauen">Kraft aufbauen</option>
            <option value="Beweglichkeit verbessern">Beweglichkeit verbessern</option>
          </select>

          <label style={labelStyle}>Erfahrung</label>
          <select style={inputStyle} value={user.experience || 'Anfänger'} onChange={(e) => updateUser({ experience: e.target.value })}>
            <option value="Anfänger">Anfänger</option>
            <option value="Fortgeschritten">Fortgeschritten</option>
            <option value="Erfahren">Erfahren</option>
          </select>

          <label style={labelStyle}>Lifestyle</label>
          <select style={inputStyle} value={user.lifestyle || 'Regelmäßig aktiv'} onChange={(e) => updateUser({ lifestyle: e.target.value })}>
            <option value="Wenig aktiv">Wenig aktiv</option>
            <option value="Regelmäßig aktiv">Regelmäßig aktiv</option>
            <option value="Sehr aktiv">Sehr aktiv</option>
          </select>

          <label style={labelStyle}>Trainingstage pro Woche</label>
          <select style={inputStyle} value={user.days || 3} onChange={(e) => updateUser({ days: Number(e.target.value) })}>
            <option value={2}>2 Tage</option>
            <option value={3}>3 Tage</option>
            <option value={4}>4 Tage</option>
            <option value={5}>5 Tage</option>
          </select>

          <label style={labelStyle}>Dauer pro Training</label>
          <select style={inputStyle} value={user.duration || 45} onChange={(e) => updateUser({ duration: Number(e.target.value) })}>
            <option value={30}>30 Minuten</option>
            <option value={45}>45 Minuten</option>
            <option value={60}>60 Minuten</option>
            <option value={75}>75 Minuten</option>
          </select>

          <label style={labelStyle}>Trainingsort</label>
          <select style={inputStyle} value={user.location || 'Zuhause'} onChange={(e) => updateUser({ location: e.target.value })}>
            <option value="Zuhause">Zuhause</option>
            <option value="Fitnessstudio">Fitnessstudio</option>
            <option value="Draußen">Draußen</option>
          </select>

          <label style={labelStyle}>Sport</label>
          <select
            style={inputStyle}
            value={Array.isArray(user.sport) && user.sport.length > 0 ? user.sport[0] : ''}
            onChange={(e) => updateArrayField('sport', e.target.value)}
          >
            <option value="">Kein bestimmter Sport</option>
            <option value="Laufen">Laufen</option>
            <option value="Fußball">Fußball</option>
            <option value="Yoga">Yoga</option>
            <option value="Tanzen">Tanzen</option>
            <option value="Krafttraining">Krafttraining</option>
            <option value="Schwimmen">Schwimmen</option>
          </select>

          <label style={labelStyle}>Verletzungen</label>
          <select
            style={inputStyle}
            value={Array.isArray(user.injuries) && user.injuries.length > 0 ? user.injuries[0] : ''}
            onChange={(e) => updateArrayField('injuries', e.target.value)}
          >
            <option value="">Keine Verletzungen</option>
            <option value="Knie">Knie</option>
            <option value="Rücken">Rücken</option>
            <option value="Schulter">Schulter</option>
            <option value="Handgelenk">Handgelenk</option>
            <option value="Fuß">Fuß</option>
            <option value="Nacken">Nacken</option>
          </select>
        </div>

        <div style={{ fontSize: 11, fontWeight: 700, color: T.textMuted, marginBottom: 14, marginTop: 28, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
          Plan aktualisieren
        </div>

        <div style={cardStyle}>
          <div style={{ fontSize: 14, color: T.textSecondary, lineHeight: 1.7, marginBottom: 14 }}>
            Wenn du wichtige Angaben geändert hast, kannst du einen neuen Plan erstellen.
          </div>

          <button style={primaryButton} onClick={onRecreatePlan}>
            Plan neu erstellen
          </button>
        </div>

        <div style={{ fontSize: 11, fontWeight: 700, color: T.textMuted, marginBottom: 14, marginTop: 28, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
          Konto
        </div>

        <div style={cardStyle}>
          <label style={labelStyle}>Neues Passwort</label>
          <input
            style={inputStyle}
            type="password"
            placeholder="Mindestens 6 Zeichen"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />

          <button style={primaryButton} onClick={handlePasswordChange}>
            Passwort speichern
          </button>

          {message && (
            <div style={{ fontSize: 14, color: T.textMuted, marginTop: 12 }}>
              {message}
            </div>
          )}
        </div>

        <button
          onClick={() => signOut(auth)}
          style={{
            ...primaryButton,
            background: '#fff',
            color: T.textMuted,
            border: `1.5px solid ${T.border}`
          }}
        >
          Abmelden
        </button>
      </div>
    </div>
  )
}