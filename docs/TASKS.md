# TASKS: Bauschritte

Diese Datei füllt /plan. /task arbeitet sie von oben nach unten ab und hakt jeden Task ab.
Ein Beispiel mit allen 6 Tasks von Bau 1 steht in docs/PROMPTS.md unter «Beispiel: die 6 Tasks von Bau 1».

Format je Task:

```text
[ ] N  Titel
- Ziel: Ein Satz, was danach sichtbar oder möglich ist.
- Dateien: Genau die Dateien, die geändert werden dürfen.
- Test zuerst: Welcher Test zuerst rot sein muss.
- Fertig wenn: Prüfbares Ergebnis plus «npm run check grün».
```

## Tasks

[x] 1  Projekt einrichten
- Ziel: Leerer App-Rahmen im Look Candy läuft unter http://localhost:5173/hwz-todo/.
- Dateien: alle aus docs/STACK.md, Abschnitt «Dateien für Task 1», plus src/components/ui/*.
- Test zuerst: src/App.test.tsx (kommt mit Task 1, siehe STACK.md).
- Fertig wenn: Titel «Meine Aufgaben» in dunklem Orange sichtbar, npm run check grün.

[x] 2  Datenmodell und Speicher mit Tests
- Ziel: Aufgaben lassen sich anlegen, abhaken, löschen, wiederherstellen und im localStorage speichern, noch ohne Oberfläche.
- Dateien: src/features/tasks/model.ts, src/features/tasks/model.test.ts, src/lib/storage.ts, src/lib/storage.test.ts, src/features/tasks/useTasks.ts, src/features/tasks/useTasks.test.ts.
- Test zuerst: addTask ignoriert leeren Titel und kürzt auf 200 Zeichen; loadState gibt bei kaputtem JSON eine leere Liste zurück; gespeicherter Zustand kommt nach erneutem Laden unverändert zurück.
- Fertig wenn: «Leere Eingabe», «200 Zeichen» und «Neu laden» im Model getestet, npm run check grün.

[x] 3  Liste anzeigen
- Ziel: Gespeicherte Aufgaben erscheinen als Karten mit Listen-Animation.
- Dateien: src/features/tasks/components/TaskList.tsx, src/features/tasks/components/TaskCard.tsx, src/features/tasks/components/TaskCard.test.tsx, src/App.tsx.
- Test zuerst: TaskList zeigt zwei Aufgaben aus dem localStorage nach dem Rendern an; ein Titel mit 200 Zeichen ohne Leerzeichen bricht um.
- Fertig wenn: «Neu laden» und «Schmales Fenster» erfüllt (DESIGN.md, Rezepte 3, 4, 7, 8), npm run check grün.

[x] 4  Aufgabe hinzufügen
- Ziel: Neue Aufgabe per Enter oder Plus-Knopf, leere Eingabe schüttelt.
- Dateien: src/features/tasks/components/TaskInput.tsx, src/features/tasks/components/TaskInput.test.tsx, src/lib/useHotkey.ts, src/App.tsx.
- Test zuerst: Tippen + Enter zeigt die Aufgabe und leert das Feld; Enter bei leerem Feld fügt nichts hinzu; «N» fokussiert das Feld.
- Fertig wenn: «Anlegen», «Leere Eingabe» und «200 Zeichen» erfüllt (DESIGN.md, Rezepte 2 und 9), npm run check grün.

[x] 5  Abhaken und löschen
- Ziel: Abhaken mit Federn, Durchstreichen und Konfetti; Löschen mit Meldung «Rückgängig».
- Dateien: src/features/tasks/components/TaskCard.tsx, src/features/tasks/components/TaskCard.test.tsx, src/lib/celebrate.ts, src/lib/theme.ts.
- Test zuerst: Klick auf Checkbox setzt done und ruft celebrate auf, zweiter Klick macht es rückgängig; Löschen und «Rückgängig» stellt die Aufgabe an derselben Stelle wieder her.
- Fertig wenn: «Abhaken» und «Löschen mit Rückgängig» erfüllt, Zustand bleibt nach Neuladen (DESIGN.md, Rezept 3), npm run check grün.

[x] 6  Zähler und leerer Zustand
- Ziel: Fortschrittsring zeigt erledigt von gesamt; ohne Aufgaben erscheint die Wolke des Candy-Looks.
- Dateien: src/components/ProgressRing.tsx, src/components/ProgressRing.test.tsx, src/features/tasks/components/EmptyState.tsx, src/App.tsx.
- Test zuerst: Ring hat bei 3 Aufgaben mit 1 erledigten das aria-label «1 von 3 erledigt»; leere Liste zeigt «Alles erledigt. Zeit für Kaffee.».
- Fertig wenn: «Zähler» und «Leerer Zustand» erfüllt (DESIGN.md, Rezepte 1 und 5), npm run check grün.
