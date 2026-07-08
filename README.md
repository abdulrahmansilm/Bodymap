# BodyMap


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

```bash
# Repo klonen
git clone https://github.com/abdulrahmansilm/Bodymap.git
cd Bodymap

```

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


