// Schickt das Userprofil an die KI und bekommt den fertigen Trainingsplan als JSON zurück
export async function generatePlan(user) {
  const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${import.meta.env.VITE_GROQ_KEY}`
    },
    body: JSON.stringify({
      model: 'llama-3.3-70b-versatile',
      messages: [
        {
          role: 'system',
          content: 'Du bist ein erfahrener Fitness-Coach. Antworte NUR mit validem JSON, kein Markdown, kein Text davor oder danach.'
        },
        {
          role: 'user',
         content: `Du bist ein erfahrener, zertifizierter Personal Trainer mit 15 Jahren Erfahrung. Analysiere das komplette Nutzerprofil und erstelle einen hochpersonalisierten Trainingsplan. Die folgenden Regeln sind Richtlinien — DU triffst die finale Entscheidung basierend auf dem Gesamtprofil dieser spezifischen Person.

NUTZERPROFIL:
- Name: ${user.name}
- Alter: ${user.age} Jahre
- Größe: ${user.height}cm, Gewicht: ${user.weight}kg, BMI: ${(user.weight / ((user.height/100)**2)).toFixed(1)}
- Geschlecht: ${user.gender}
- Ziel: ${user.goal}
- Erfahrung: ${user.experience}
- Alltag: ${user.lifestyle}
- Gewünschte Trainingstage: ${user.days} pro Woche
- Dauer pro Einheit: ${user.duration} Minuten
- Trainingsort: ${user.location}
- Sportarten: ${user.sport.join(', ') || 'keine'}
- Verletzungen: ${user.injuries.join(', ') || 'keine'}

RICHTLINIEN (nutze dein professionelles Urteil um sie für diese Person anzupassen):

1. RUHETAGE — HARTE REGEL, keine Ausnahme:
   NIEMALS alle Trainingstage hintereinander legen. Zwischen den Einheiten müssen Ruhetage verteilt sein.
   Bewährte Verteilungen als Orientierung:
   - 1 Tag: z.B. Samstag
   - 2 Tage: z.B. Dienstag + Samstag
   - 3 Tage: z.B. Montag + Mittwoch + Freitag
   - 4 Tage: z.B. Montag + Dienstag + Donnerstag + Samstag (nie 4 aufeinander!)
   - 5 Tage: z.B. Montag + Dienstag + Donnerstag + Freitag + Sonntag
   DU entscheidest die genaue Verteilung basierend auf Alltag und Erfahrung — aber NIE mehr als 2 Tage hintereinander, bei Anfängern nie 2 hintereinander.

2. SPLIT-METHODE — wähle intelligent:
   - Wenige Tage oder Anfänger → eher Ganzkörper
   - Mehr Tage + Erfahrung → PPL (Push/Pull/Legs), Upper/Lower oder Bro Split
   - Ziel health/fit → funktionelle Splits
   DU entscheidest welcher Split für dieses Profil optimal ist — begründe es im personalNote.

3. TAGESNAMEN — WICHTIG, benenne die Tage aussagekräftig nach ihrem Inhalt:
   Gute Beispiele: "Push-Tag (Brust, Schultern, Trizeps)", "Pull-Tag (Rücken, Bizeps)", "Bein-Tag", "Ganzkörper A", "Ganzkörper B", "Oberkörper Kraft", "Core & Mobilität"
   Schlechte Beispiele (NICHT verwenden): dreimal "Ganzkörper-Tag" ohne Unterscheidung, generische Namen die sich wiederholen
   Jeder Tag muss einen EINDEUTIGEN Namen haben der zeigt was trainiert wird.

4. ÜBUNGSVIELFALT — WICHTIG:
   - Keine Übung darf sich über die Woche wiederholen (außer bei Ganzkörper A/B/C Varianten, dort maximal 1-2 Überschneidungen)
   - Nutze verschiedene Übungen für die gleiche Muskelgruppe an verschiedenen Tagen
   - Mische Grundübungen und Isolationsübungen passend zur Erfahrung

5. ÜBUNGSANZAHL — HARTE REGEL, muss sich nach der Dauer richten:
   Eine Übung mit Sätzen und Pausen braucht ca. 8-12 Minuten.
   Bei ${user.duration} Minuten passen realistisch ${Math.floor(user.duration / 10)} bis ${Math.floor(user.duration / 7)} Übungen.
   Die Anzahl der Übungen MUSS sich mit der Dauer ändern — kürzere Einheiten bekommen spürbar weniger Übungen, längere Einheiten spürbar mehr. Verwende NIEMALS die gleiche Übungsanzahl unabhängig von ${user.duration} Minuten.
   Ältere oder unerfahrene Nutzer brauchen mehr Zeit pro Übung, tendiere dann eher zum unteren Ende der Spanne — DU entscheidest die genaue Anzahl innerhalb der berechneten Spanne.

6. SETS, REPS UND PAUSEN — Orientierungswerte:
   - muscle: eher 3-5 Sets, 6-10 Reps, 90-120s Pause
   - lose: eher 3 Sets, 12-15 Reps, 45-60s Pause
   - fit: eher 3 Sets, 10-12 Reps, 60-90s Pause
   - health: eher 2-3 Sets, 12-15 Reps, 60-90s Pause
   ABER passe diese Werte an Alter und Erfahrung an: ältere Nutzer (55+) brauchen weniger Sets, mehr Reps mit leichtem Gewicht und längere Pausen. Sehr junge trainierte Nutzer vertragen mehr Volumen. DU wählst jede Zahl selbst — kopiere NICHT die Beispielwerte aus dem JSON.

7. ALTER UND BMI BEACHTEN:
   - Nutzer über 55: sanftes Training, gelenkschonende Übungen, kein Springen, keine schweren Grundübungen
   - Nutzer über 65: sehr sanft, Fokus auf Mobilität, Balance, Sturzprävention, maximal 2-3 Sets
   - Hoher BMI (über 30): keine Sprungübungen, Low Impact
   DU beurteilst die Kombination aus Alter + Erfahrung + Alltag zusammen.

8. VERLETZUNGEN — HARTE REGEL:
   Verletzungen strikt beachten: ${user.injuries.join(', ') || 'keine'}
   Keine Übungen die verletzte Bereiche direkt belasten. Wähle passende Alternativen.

9. TRAININGSORT — HARTE REGEL:
   Nur Übungen die hier möglich sind: ${user.location}

Frage dich am Ende: Was würde ich dieser spezifischen Person wirklich verschreiben wenn sie heute in mein Studio kommt?

Antworte NUR mit validem JSON, kein Text davor oder danach. Die Felder sets, reps und rest musst DU selbst wählen — die Beispielwerte im Format sind nur Platzhalter:
{
  "summary": "${user.days}x pro Woche · ${user.duration} min · ${user.location}",
  "splitType": "Name der gewählten Split-Methode auf Deutsch",
  "personalNote": "Erkläre auf Deutsch spezifisch was du an diesem Profil bemerkt hast und warum du diesen Split, diese Tagesverteilung und diese Intensität gewählt hast",
  "days": [
    {
      "label": "Montag",
      "name": "Eindeutiger aussagekräftiger Tagesname",
      "focus": "Trainierte Muskelgruppen",
      "exercises": [
        {
          "name": "Übungsname auf Deutsch",
          "searchTerm": "exercise name in english",
          "sets": 0,
          "reps": 0,
          "rest": 0,
          "muscle": "Muskelgruppe auf Deutsch",
          "why": "Warum diese Übung für dieses Profil auf Deutsch.",
          "tip": "Ausführungstipp auf Deutsch.",
          "instructions": [
            "Schritt 1 auf Deutsch.",
            "Schritt 2 auf Deutsch.",
            "Schritt 3 auf Deutsch.",
            "Schritt 4 auf Deutsch."
          ]
        }
      ]
    }
  ]
}`
        }
      ],
      temperature: 0.7
    })
  })

  const data = await res.json()
  if (data.error) {
    console.error('Groq Fehler:', data.error)
    throw new Error(data.error.message)
  }
  const text = data.choices[0].message.content
  console.log('AI Response:', text)
  const clean = text.replace(/```json|```/g, '').trim()
  return JSON.parse(clean)
}

const EXERCISE_CACHE = {}

// Holt Zusatzinfos (Bild, Anleitung, Equipment) zu einer Übung, cached pro Suchbegriff
export async function fetchExerciseData(searchTerm) {
  if (EXERCISE_CACHE[searchTerm]) return EXERCISE_CACHE[searchTerm]
  try {
    const res = await fetch(
      `https://api.workoutxapp.com/v1/exercises/name/${encodeURIComponent(searchTerm)}?limit=1`,
      {
        headers: {
          'X-WorkoutX-Key': import.meta.env.VITE_WORKOUTX_KEY
        }
      }
    )
    const data = await res.json()
    if (!data.data || data.data.length === 0) return null
    const ex = data.data[0]

    // Fetch GIF as blob with auth header
    let gifBlobUrl = null
    if (ex.gifUrl) {
      try {
        const gifRes = await fetch(ex.gifUrl, {
          headers: {
            'X-WorkoutX-Key': import.meta.env.VITE_WORKOUTX_KEY
          }
        })
        const blob = await gifRes.blob()
        gifBlobUrl = URL.createObjectURL(blob)
      } catch {
        gifBlobUrl = null
      }
    }

    const result = {
      bodyPart: ex.bodyPart,
      equipment: ex.equipment,
      instructions: ex.instructions || [],
      description: ex.description || '',
      difficulty: ex.difficulty || '',
      gifUrl: gifBlobUrl,
    }
    EXERCISE_CACHE[searchTerm] = result
    return result
  } catch (err) {
    console.error('Exercise fetch error:', err)
    return null
  }
}