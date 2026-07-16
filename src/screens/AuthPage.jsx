import { useState } from 'react'
import { auth, db } from '../firebase'
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword
} from 'firebase/auth'
import { doc, setDoc, serverTimestamp } from 'firebase/firestore'
import { T } from '../tokens'

// Login/Registrierung, nur mit Name statt E-Mail
export default function AuthPage() {
  const [isRegister, setIsRegister] = useState(false)
  const [name, setName] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  // Firebase braucht eine E-Mail, deshalb bauen wir eine aus dem Namen
  const createFakeEmail = (username) => {
    return `${username.trim().toLowerCase().replaceAll(' ', '')}@bodymap.local`
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!name.trim() || !password.trim()) {
      setError('Bitte Name und Passwort eingeben.')
      return
    }

    if (password.length < 6) {
      setError('Das Passwort muss mindestens 6 Zeichen haben.')
      return
    }

    const email = createFakeEmail(name)

    try {
      if (isRegister) {
        const result = await createUserWithEmailAndPassword(auth, email, password)

        await setDoc(doc(db, 'users', result.user.uid), {
          name: name.trim(),
          loginName: name.trim().toLowerCase(),
          createdAt: serverTimestamp()
        })
      } else {
        await signInWithEmailAndPassword(auth, email, password)
      }
    } catch (err) {
      console.error(err)

      if (err.code === 'auth/email-already-in-use') {
        setError('Dieser Name ist schon vergeben.')
      } else if (err.code === 'auth/invalid-credential') {
        setError('Name oder Passwort ist falsch.')
      } else {
        setError('Etwas ist schiefgelaufen. Bitte nochmal versuchen.')
      }
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: '#fff',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '34px 24px'
    }}>
      <div style={{ width: '100%', maxWidth: 680 }}>
        <div style={{ textAlign: 'center', marginBottom: 36 }}>

          


          <h1 style={{
            fontSize: 58,
            lineHeight: 1,
            margin: 0,
            color: T.primary,
            fontWeight: 800
          }}>
            BodyMap
          </h1>

          <p style={{
            fontSize: 18,
            color: T.textMuted,
            marginTop: 14,
            marginBottom: 0
          }}>
            Dein persönlicher Trainingsplan.
          </p>
        </div>

        <div style={{
          background: '#fff',
          border: `1.5px solid ${T.border}`,
          borderRadius: T.radiusLg,
          padding: '34px 28px',
          boxShadow: '0 18px 45px rgba(0,0,0,0.06)'
        }}>
          <h2 style={{
            fontSize: 34,
            margin: 0,
            marginBottom: 10,
            color: T.textPrimary
          }}>
            {isRegister ? 'Registrieren' : 'Einloggen'}
          </h2>

          <p style={{
            color: T.textMuted,
            fontSize: 16,
            lineHeight: 1.6,
            marginBottom: 28
          }}>
            {isRegister
              ? 'Erstelle dein Konto und speichere deinen Fortschritt.'
              : 'Melde dich an und mache dort weiter, wo du aufgehört hast.'}
          </p>

          <form onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Vorname"
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={{
                width: '100%',
                padding: '17px 18px',
                marginBottom: 14,
                borderRadius: T.radiusMd,
                border: `1.5px solid ${T.border}`,
                fontSize: 18,
                fontFamily: 'inherit',
                background: '#fff'
              }}
            />

            <input
              type="password"
              placeholder="Passwort"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{
                width: '100%',
                padding: '17px 18px',
                marginBottom: 20,
                borderRadius: T.radiusMd,
                border: `1.5px solid ${T.border}`,
                fontSize: 18,
                fontFamily: 'inherit',
                background: '#fff'
              }}
            />

            <button
              type="submit"
              style={{
                width: '100%',
                padding: '17px 0',
                borderRadius: T.radiusMd,
                border: 'none',
                background: T.primary,
                color: '#fff',
                fontSize: 18,
                fontWeight: 700,
                fontFamily: 'inherit',
                cursor: 'pointer'
              }}
            >
              {isRegister ? 'Konto erstellen' : 'Einloggen'}
            </button>
          </form>

          {error && (
            <p style={{ color: '#d93025', marginTop: 16 }}>
              {error}
            </p>
          )}

          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 14,
            marginTop: 28,
            marginBottom: 20,
            color: T.textMuted
          }}>
            <div style={{ flex: 1, height: 1, background: T.border }} />
            <span>oder</span>
            <div style={{ flex: 1, height: 1, background: T.border }} />
          </div>

          <button
            onClick={() => {
              setIsRegister(!isRegister)
              setError('')
            }}
            style={{
              width: '100%',
              padding: '15px 0',
              background: '#fff',
              border: `1.5px solid ${T.border}`,
              borderRadius: T.radiusMd,
              color: T.primary,
              fontSize: 16,
              fontWeight: 600,
              fontFamily: 'inherit',
              cursor: 'pointer'
            }}
          >
            {isRegister
              ? 'Ich habe schon ein Konto'
              : 'Ich habe noch kein Konto'}
          </button>
        </div>
      </div>
    </div>
  )
}