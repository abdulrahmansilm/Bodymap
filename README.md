# BodyMap

BodyMap ist eine React-Anwendung, die auf Basis eines kurzen Onboardings einen
personalisierten Trainingsplan erstellt, Übungsdetails anzeigt und den Trainingsfortschritt
trackt.

## Installation

1. Repository klonen:
   ```bash
   git clone https://github.com/abdulrahmansilm/Bodymap.git
   cd Bodymap
   ```
2. Abhängigkeiten installieren:
   ```bash
   npm install
   ```
3. `.env`-Datei im Projekt-Root anlegen mit folgenden Variablen:
   ```
   VITE_GROQ_KEY=dein-groq-api-key
   VITE_RAPIDAPI_KEY=dein-rapidapi-key
   ```
   - `VITE_GROQ_KEY`: wird für die KI-gestützte Trainingsplan-Generierung (Groq LLM API) benötigt.
   - `VITE_RAPIDAPI_KEY`: wird für den Abruf von Übungsdetails über die ExerciseDB-API benötigt.
4. Entwicklungsserver starten:
   ```bash
   npm run dev
   ```
   Die App läuft danach standardmäßig unter `http://localhost:5173`.

Weitere Skripte:
- `npm run build` – Produktions-Build erzeugen
- `npm run preview` – Produktions-Build lokal testen
- `npm run lint` – Code mit oxlint prüfen

## Architektur

**Haupt-Komponenten & Funktionen**
- `App.jsx` – zentrale Screen-Steuerung (Onboarding, Home, Dashboard, Plan, Workout, Profil) und Laden/Speichern der Nutzerdaten in Firestore.
- `screens/OnboardingScreen.jsx` + `components/onboarding/Step1…Step8` – mehrstufige Erfassung von Nutzerprofil, Zielen und Trainingsvorlieben.
- `screens/HomeScreen.jsx`, `DashboardScreen.jsx`, `PlanScreen.jsx`, `ProfileScreen.jsx` – Übersicht, Statistiken, Trainingsplan-Ansicht, Profilverwaltung.
- `screens/WorkoutScreen.jsx` + `components/workout/*` – aktiver Trainingsmodus (Übersicht, laufende Übung, Abschluss).
- `AuthContext.jsx` + `screens/AuthPage.jsx` – Firebase-Authentifizierung (Login/Registrierung, Session-Status).
- `firebase.js` – Firebase-Initialisierung (Auth + Firestore).
- `utils/api.js` – externe API-Anbindungen (Plan-Generierung, Übungsdaten).
- `tokens.js` – zentrale Design-Tokens (Farben, Radius, Button-Styles) für ein konsistentes UI.

**Verwendete Bibliotheken (neben React)**
- **Firebase** (Auth + Firestore): Nutzerverwaltung und Persistenz der Trainingsdaten. Kein separates Backend nötig.
- **Kein React Router**: Die Navigation zwischen Screens läuft über einen einfachen State (`screen` in `App.jsx`), da die App keine URL-basierte Navigation benötigt (single-page Flow ohne tiefe Verlinkung).
- **Kein Redux/Zustand**: Der App-State ist überschaubar und wird über React State + `AuthContext` (Context API) verwaltet. Für den Umfang der App reicht das aus, ohne zusätzliche Komplexität einzuführen.
- **Kein Tailwind CSS**: Styling erfolgt über Inline-Styles in Kombination mit zentralen Design-Tokens (`tokens.js`), um schnelle Iteration während der Prototyping-Phase zu ermöglichen.

**Ansicht (Mobile/Tablet/Desktop)**
Die App ist **Mobile-First** und aktuell ausschließlich auf mobile Nutzung ausgelegt
(Inhalte sind auf `max-width: 680px` begrenzt, keine eigenen Breakpoints für Tablet/Desktop).
Grund: BodyMap wird primär während des Trainings am Smartphone genutzt, Desktop/Tablet-Nutzung
ist für den Use Case nachrangig.

**Daten & externe APIs**
- **Firebase Firestore**: Speichert Nutzerprofil, generierten Trainingsplan und Fortschritt (`users/{uid}/bodymapData/main`).
- **Groq API** (`utils/api.js` → `generatePlan`): Generiert basierend auf dem Nutzerprofil einen personalisierten Trainingsplan per LLM (Modell `llama-3.3-70b-versatile`).
- **ExerciseDB API** (`utils/api.js` → `fetchExerciseData`): Liefert Zusatzinformationen (Körperbereich, Equipment, Anleitung) zu einzelnen Übungen, Ergebnisse werden im Speicher gecacht.

Hinweis zu `firebase.js`: Der dort enthaltene `apiKey` ist bewusst öffentlich sichtbar –
das ist bei Firebase Web-Apps normal, die eigentliche Absicherung erfolgt über die
Firestore Security Rules serverseitig, nicht über die Geheimhaltung des Keys.

**Ordnerstruktur**
```
src/
├── components/       # wiederverwendbare UI-Bausteine (onboarding/, workout/, Icons, Charts)
├── screens/           # ganze Bildschirme/Views der App
├── utils/             # externe API-Anbindung (api.js)
├── tokens.js          # Design-Tokens
├── firebase.js        # Firebase-Setup
├── AuthContext.jsx     # Auth-State global verfügbar machen
└── App.jsx            # Einstiegspunkt / Screen-Routing
```


## Release Notes

| Datum      | Änderung                                                              | Verantwortliche(r)         |
|------------|------------------------------------------------------------------------|-----------------------------|
| 2026-06-01 | Projekt initialisiert                                                  | Abdulrahman Mahio Silm                 |
| 2026-06-27 | Projektsetup, Design System, API-Anbindung, Onboarding Schritte 1–4                                 | Zakaria el mourig                |
| 2026-06-28 |HomeScreen, Wochenkalender,planScreen    |Abdulrahman Mahio Silm                |
| 2026-06-28 | OnboardingFlow Schritte 5-8,LoadingScreen,OnboardingScreen    |Maeva Carelle Wandji Nappa                |
| 2026-06-28 | Workout-Modus: Übersicht, aktive Übung, Abschluss-Screen                |  Abdellah Nabil          |
| 2026-07-08 | State Managment , localStorage    | kreisslsync                |
| 2026-07-08 | DashboardScreen, KI-Trainingsplan     | Abdellah Nabil               |
| 2026-07-09 | Firebase-Authentifizierung, zwei neue Profil-Screens                   | Maeva Carelle Wandji Nappa     |
| 2026-07-14 | Design-Überarbeitung: Farbschema, Onboarding-Feinschliff, Dashboard-Charts | Zakaria el mourig          |

---

## Authentifizierung (HTTPS)

### Token erstellen
1. GitHub → Settings → Developer Settings → Personal access tokens → Tokens (classic)
2. "Generate new token (classic)" klicken
3. Name eingeben (z.B. "bodymap"), Expiration: 90 days, Scope: **repo** anhaken
4. Token generieren und kopieren — wird nur einmal angezeigt!

### Token einrichten
```bash
git remote set-url origin https://DEIN-GITHUB-USERNAME:DEIN-TOKEN@github.com/abdulrahmansilm/Bodymap.git
```

Danach funktioniert `git push` normal ohne Passwort-Abfrage.

---

# Regeln

> [!IMPORTANT]
Issues:
> - Alle Aufgaben stehen als Issues im Repo
> - Jeder nimmt sich **3–4 Issues**
> - Markiere deine Issues mit einem **Label mit deinem Namen**
> - Nimm dir eine **Mischung aus leichten und schweren Issues** — nicht nur die einfachen

> [!IMPORTANT]
Reihenfolge:
> - Issues werden **nach Phasen** bearbeitet — erst Phase 1, dann Phase 2, dann Phase 3
> - **Nicht vorausarbeiten** solange die vorherige Phase noch offen ist
