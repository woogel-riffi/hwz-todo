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

[x] 7  Migration mit Test
- Ziel: Gespeicherte Aufgaben aus Version 1 laden als Version 2 mit `assignee: null`, nichts geht verloren.
- Dateien: src/lib/storage.ts, src/lib/storage.test.ts, src/features/tasks/model.ts, src/features/tasks/model.test.ts.
- Test zuerst: Echte Version-1-Daten im localStorage ergeben nach loadState dieselben Aufgaben mit `assignee: null` und `version: 2`; ein unbekannter Name wird zu `null`.
- Fertig wenn: «Alte Daten» erfüllt, npm run check grün.

[x] 8  Zuordnen im Model und Hook
- Ziel: Eine Aufgabe lässt sich einer Person zuordnen, neu zuordnen und freigeben, gespeichert im localStorage.
- Dateien: src/features/tasks/model.ts, src/features/tasks/model.test.ts, src/features/tasks/useTasks.ts, src/features/tasks/useTasks.test.ts.
- Test zuerst: assignTask setzt «Sophie», dann «Phil» ersetzt sie, `null` entfernt sie; nach erneutem Rendern des Hooks steht die Person noch da.
- Fertig wenn: «Nach dem Neuladen» im Hook getestet, npm run check grün.

[x] 9  Seifenblasen und Zauberstab
- Ziel: Eine Blasen-Ebene zeigt sechs aufsteigende Namens-Blasen mit Zauberstab-Zeiger, Klick platzt die Blase und meldet den Namen.
- Dateien: DESIGN.md, docs/STACK.md, src/index.css, src/features/tasks/components/DelegateBubbles.tsx, src/features/tasks/components/DelegateBubbles.test.tsx.
- Test zuerst: Es gibt sechs Knöpfe mit den Namen; Klick auf «Sophie» ruft onPick mit «Sophie» auf; Esc und Klick daneben rufen onClose auf; die Ebene hat die Klasse `cursor-wand`; Tab und Enter wählen eine Blase.
- Fertig wenn: «Blasen steigen auf», «Zauberstab», «Abbrechen» und «Tastatur und ruhige Bewegung» erfüllt (neues DESIGN.md-Rezept 10), npm run check grün.

[x] 10  Delegieren auf der Karte
- Ziel: Knopf «Delegieren» auf jeder Karte öffnet die Blasen; der gewählte Name erscheint als Abzeichen mit ×.
- Dateien: src/features/tasks/components/TaskCard.tsx, src/features/tasks/components/TaskCard.test.tsx, src/features/tasks/components/TaskList.tsx, src/App.tsx.
- Test zuerst: «Delegieren» klicken, dann «Sophie» zeigt das Abzeichen «Sophie»; erneut delegieren an «Phil» ersetzt es; × entfernt es; nach neuem Rendern der App steht die Person noch da.
- Fertig wenn: «Blase platzt und ordnet zu», «Neu delegieren», «Zuordnung entfernen» und «Nach dem Neuladen» erfüllt, npm run check grün.

[x] 11  Aufteilen im Model
- Ziel: Eine reine Funktion trennt eigene und delegierte Aufgaben, die Reihenfolge bleibt erhalten.
- Dateien: src/features/tasks/model.ts, src/features/tasks/model.test.ts.
- Test zuerst: splitTasks legt Aufgaben mit Person in `delegated` und ohne Person in `mine`, beide in der ursprünglichen Reihenfolge.
- Fertig wenn: Funktion getestet, npm run check grün.

[x] 12  Spalte «Delegiert»
- Ziel: Neben der Liste steht die Spalte «Delegiert 😄»; delegierte Aufgaben wandern dorthin und mit × zurück.
- Dateien: src/features/tasks/components/DelegatedColumn.tsx, src/features/tasks/components/DelegatedColumn.test.tsx, src/App.tsx.
- Test zuerst: Spalte mit Titel «Delegiert 😄» und Hinweis «Noch nichts delegiert.»; Delegieren an Sophie verschiebt die Karte in die Spalte; × holt sie zurück; Abhaken und Löschen in der Spalte funktionieren; nach erneutem Rendern steht sie noch in der Spalte.
- Fertig wenn: «Zweite Spalte», «Verschieben beim Delegieren», «Zurück beim Entfernen», «Bedienbar in der Spalte», «Leere Spalte», «Schmales Fenster» und «Nach dem Neuladen» erfüllt (DESIGN.md, Rezepte 1 und 6), npm run check grün.
