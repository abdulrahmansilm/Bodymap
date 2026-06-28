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
          content: `Du bist ein erfahrener, zertifizierter Personal Trainer. Erstelle einen hochpersonalisierten Trainingsplan.

NUTZERPROFIL:
- Name: ${user.name}
- Alter: ${user.age} Jahre
- Größe: ${user.height}cm, Gewicht: ${user.weight}kg
- Geschlecht: ${user.gender}
- Ziel: ${user.goal}
- Erfahrung: ${user.experience}
- Alltag: ${user.lifestyle}
- Gewünschte Trainingstage: ${user.days} pro Woche
- Dauer pro Einheit: ${user.duration} Minuten
- Trainingsort: ${user.location}
- Sportarten: ${user.sport.join(', ') || 'keine'}
- Verletzungen: ${user.injuries.join(', ') || 'keine'}

PERSONALISIERUNGSREGELN:
1. RUHETAGE:
   - Anfänger: nie 2 Tage hintereinander
   - 1 Tag: Samstag
   - 2 Tage: Dienstag + Samstag
   - 3 Tage: Montag + Mittwoch + Freitag
   - 4 Tage: Montag + Dienstag + Donnerstag + Samstag
   - 5 Tage: Montag + Dienstag + Donnerstag + Freitag + Sonntag

2. ÜBUNGSANZAHL pro Einheit:
   - Anfänger: ${Math.round(user.duration / 8)} bis ${Math.round(user.duration / 6)} Übungen
   - Fortgeschrittene: ${Math.round(user.duration / 7)} bis ${Math.round(user.duration / 5)} Übungen

3. ÜBUNGSAUSWAHL:
   - Verletzungen berücksichtigen: ${user.injuries.join(', ') || 'keine'}
   - Ort: ${user.location}
   - Ziel: ${user.goal}

4. SPLIT:
   - 1-2 Tage: Ganzkörper
   - 3 Tage: Oberkörper/Unterkörper/Ganzkörper
   - 4+ Tage: Muskelgruppen aufteilen

5. SETS UND PAUSEN:
   - muscle: 3-5 Sets, 6-10 Reps, 90-120s Pause
   - lose: 3 Sets, 12-15 Reps, 45-60s Pause
   - fit: 3 Sets, 10-12 Reps, 60-90s Pause

Antworte NUR mit validem JSON:
{
  "summary": "${user.days}x pro Woche · ${user.duration} min · ${user.location}",
  "personalNote": "Kurze Erklärung warum dieser Plan optimal ist",
  "days": [
    {
      "label": "Montag",
      "name": "Oberkörper-Tag",
      "focus": "Brust und Schultern",
      "exercises": [
        {
          "name": "Bankdrücken",
          "searchTerm": "barbell bench press",
          "sets": 3,
          "reps": 10,
          "rest": 90,
          "muscle": "Brust",
          "why": "Warum diese Übung.",
          "tip": "Ausführungstipp."
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

export async function fetchExerciseData(searchTerm) {
  if (EXERCISE_CACHE[searchTerm]) return EXERCISE_CACHE[searchTerm]
  try {
    const res = await fetch(
      `https://exercisedb.p.rapidapi.com/exercises/name/${encodeURIComponent(searchTerm)}?limit=1`,
      {
        headers: {
          'X-RapidAPI-Key': import.meta.env.VITE_RAPIDAPI_KEY,
          'X-RapidAPI-Host': 'exercisedb.p.rapidapi.com'
        }
      }
    )
    const data = await res.json()
    if (!data[0]) return null
    const ex = data[0]
    const result = {
      bodyPart: ex.bodyPart,
      equipment: ex.equipment,
      instructions: ex.instructions || [],
      description: ex.description || '',
      difficulty: ex.difficulty || '',
    }
    EXERCISE_CACHE[searchTerm] = result
    return result
  } catch (err) {
    console.error('Exercise fetch error:', err)
    return null
  }
}