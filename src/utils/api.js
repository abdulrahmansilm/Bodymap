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
         content: `You are an elite personal trainer and sports scientist with 15 years of experience. Your job is to create a truly personalized training plan. These are guidelines to help you, but YOU must make the final decision based on the complete profile of this specific person.

USER PROFILE:
- Name: ${user.name}
- Age: ${user.age} years
- Height: ${user.height}cm, Weight: ${user.weight}kg, BMI: ${(user.weight / ((user.height/100)**2)).toFixed(1)}
- Gender: ${user.gender}
- Goal: ${user.goal}
- Experience level: ${user.experience}
- Daily lifestyle: ${user.lifestyle}
- Desired training days: ${user.days} per week
- Session duration: ${user.duration} minutes
- Training location: ${user.location}
- Sports activities: ${user.sport.join(', ') || 'none'}
- Injuries/limitations: ${user.injuries.join(', ') || 'none'}

GUIDELINES (use your professional judgment to adapt these for this specific person):

AGE GUIDELINES:
- Younger users generally tolerate higher intensity, more volume and heavier weights
- Older users generally need lower intensity, more rest, joint-friendly exercises and mobility work
- However, YOU decide what is appropriate based on the full profile — a very active 65 year old may need more challenge than a sedentary 30 year old
- Consider the combination of age + experience + lifestyle together, not age alone

BMI GUIDELINES:
- Higher BMI may suggest avoiding high-impact exercises and focusing on movement quality
- Lower BMI may suggest focusing on muscle building
- But YOU decide based on the goal and full context — BMI alone does not determine the plan

EXPERIENCE GUIDELINES:
- Beginners generally need simpler movements and less volume
- Advanced users can handle more complexity and volume
- But YOU decide — someone returning after years may need to start fresh even if experienced before

LIFESTYLE GUIDELINES:
- Sedentary lifestyle may benefit from posture and core work
- Physically active jobs may need lighter training to avoid overtraining
- But YOU decide how much to adjust based on the full picture

GOAL GUIDELINES:
- muscle: generally higher weights, lower reps, longer rest
- lose: generally more reps, shorter rest, higher heart rate
- fit: generally balanced approach
- health: generally functional and mobility focused
- But YOU decide the exact balance based on age, experience and lifestyle together

VOLUME GUIDELINES:
- A ${user.duration} minute session can realistically fit ${Math.floor(user.duration / 8)} to ${Math.floor(user.duration / 6)} exercises
- Older or less experienced users need more time per exercise
- But YOU decide the exact number based on the complete profile

SPLIT GUIDELINES:
- Fewer days and less experience generally means full body
- More days and more experience generally means split training
- But YOU decide the best split considering ALL factors together

INJURY GUIDELINES:
- Respect all injuries and limitations listed: ${user.injuries.join(', ') || 'none'}
- Avoid exercises that directly stress injured areas
- But YOU decide the best alternatives and modifications

LOCATION:
- Only suggest exercises possible at: ${user.location}
- This is a hard rule, not a guideline

After reading the full profile, make your own professional judgment call. Ask yourself: what would I actually prescribe to this specific person if they walked into my gym today?

Write the personalNote in German explaining specifically what YOU noticed about this profile and why you made these specific choices.

IMPORTANT: sets, reps and rest must be chosen by YOU based on the profile. Do NOT use the example values. A 70 year old needs different reps than a 25 year old. A weight loss goal needs different reps than a muscle building goal. Choose every number yourself based on the complete profile.

Respond ONLY with valid JSON, no text before or after:
{
  "summary": "${user.days}x pro Woche · ${user.duration} min · ${user.location}",
  "splitType": "Name der Split-Methode auf Deutsch",
  "personalNote": "Erkläre auf Deutsch sehr spezifisch was du an diesem Profil bemerkt hast und warum du genau diese Entscheidungen getroffen hast",
  "days": [
    {
      "label": "Montag",
      "name": "Ganzkörper A",
      "focus": "Full Body",
      "exercises": [
        {
  "name": "Übungsname auf Deutsch",
  "searchTerm": "exercise name in english for database",
  "sets": null,
  "reps": null,
  "rest": null,
  "muscle": "Muskelgruppe auf Deutsch",
  "why": "Warum diese Übung speziell für dieses Profil auf Deutsch.",
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