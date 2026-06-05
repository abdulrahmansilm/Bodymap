# BodyMap



---

## Projekt starten

```bash
# Repo klonen
git clone https://github.com/abdulrahmansilm/Bodymap.git
cd Bodymap

# Abhängigkeiten installieren
npm install

# App starten
npm run dev

```

---

# Regeln

> [!IMPORTANT]
 ** Issues**
> - Alle Aufgaben stehen als Issues im Repo
> - Jeder nimmt sich **3–4 Issues**
> - Markiere deine Issues mit einem **Label mit deinem Namen**
> - Nimm dir eine **Mischung aus leichten und schweren Issues** — nicht nur die einfachen
 
> [!IMPORTANT]
 ** Reihenfolge**
> - Issues werden **nach Phasen** bearbeitet — erst Phase 1, dann Phase 2, dann Phase 3
> - **Nicht vorausarbeiten** solange die vorherige Phase noch offen ist
 
> [!WARNING]
 ** Branches**
> - Jedes Issue gehört zu einem Branch (steht am Label) — **push immer in den richtigen Branch**
> - **NIEMALS direkt auf `main` pushen** — `main` ist nur für die finale Abgabe am letzten Tag
> - Jeder Push geht per **Pull Request** rein — kein direktes Pushen auf `develop` oder `main`
 
---

---

## Branch-Struktur

```
main              ← nur finale Abgabe (letzter Tag)
└── develop       ← tägliche Integration
    ├── onboarding       ← Phase 1: Onboarding Screens 1–9
    ├── home-and-plan    ← Phase 2: Home + KI-Integration
    └── workout          ← Phase 3: Workout-Modus + Timer + ExerciseDB
```

---

## Täglicher Workflow

```bash
git checkout develop
git pull origin develop
git checkout [branch in den ein issue bearbeitest] 
git merge develop

# arbeiten...

git add .
git commit -m "feat: kurze Beschreibung"
git push origin [branch in den ein issue bearbeitest]
```

Danach einen **Pull Request** auf `develop` erstellen und jemanden als Reviewer eintragen.

- Feature-Branch → `develop`: PR mit Reviewer
- `develop` → `main`: PR, nur am letzten Tag für die Abgabe
