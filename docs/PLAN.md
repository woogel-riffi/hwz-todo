# PLAN: Wie die App gebaut wird

Diese Datei füllt /plan aus docs/SPEC.md.

## Stack

Siehe docs/STACK.md. Keine Abweichungen.

## Ordner und Dateien

- `package.json`, `index.html`, `vite.config.ts`, `src/main.tsx`, `src/App.tsx`, `src/App.test.tsx`, `src/index.css` und `src/components/ui/*`: Grundgerüst aus docs/STACK.md, angelegt von `scripts/setup.mjs` (Look `candy`).
- `src/features/tasks/model.ts`: Typ Task und reine Funktionen addTask, toggleTask, removeTask, restoreTask.
- `src/features/tasks/model.test.ts`: Tests für das Model.
- `src/lib/storage.ts`: loadState und saveState für den localStorage.
- `src/lib/storage.test.ts`: Tests für Laden, Speichern und kaputte Daten.
- `src/features/tasks/useTasks.ts`: React-Hook, verbindet Model und Storage.
- `src/features/tasks/useTasks.test.ts`: Tests für den Hook.
- `src/features/tasks/components/TaskInput.tsx` und `TaskInput.test.tsx`: Eingabe mit Plus-Knopf.
- `src/features/tasks/components/TaskCard.tsx` und `TaskCard.test.tsx`: eine Aufgabe mit Checkbox und Löschen.
- `src/features/tasks/components/TaskList.tsx`: animierte Liste der Karten.
- `src/features/tasks/components/EmptyState.tsx`: Illustration und Hinweis bei leerer Liste.
- `src/components/ProgressRing.tsx` und `ProgressRing.test.tsx`: Zähler als Fortschrittsring.
- `src/lib/celebrate.ts`: Konfetti beim Abhaken.
- `src/lib/theme.ts`: readConfettiColors liest die Konfettifarben aus CSS.
- `src/lib/useHotkey.ts`: Taste «N» fokussiert die Eingabe.

Hier stehen nur Dateien, die neu entstehen oder sich ändern, je mit einem Halbsatz Zweck. Beispiel: `src/features/tasks/model.ts`: Typ Task und reine Funktionen addTask, toggleTask, removeTask.

## Datenmodell

```ts
// localStorage "hwz-todo" = { version: 1, tasks: Task[] }
export type Task = {
  id: string // crypto.randomUUID()
  title: string // getrimmt, 1 bis 200 Zeichen
  done: boolean
  createdAt: number // Date.now()
}

export type StoredState = { version: 1; tasks: Task[] }
```

Schlüssel `hwz-todo`, Version 1. Keine Migration nötig, weil es noch keine alten Daten gibt. Kaputte oder fehlende Daten ergeben eine leere Liste (docs/STACK.md, «Datenhaltung»).

Typen als TypeScript-Block, dazu Schlüssel und Version im localStorage. Beispiel: `localStorage "hwz-todo" = { version: 1, tasks: Task[] }`.

## Komponenten

- App: Rahmen mit Titel «Meine Aufgaben», Datum, Fortschrittsring und Toaster (DESIGN.md, Rezept 1).
- TaskInput: Eingabefeld mit Plus-Knopf, schüttelt bei leerer Eingabe, Taste «N» fokussiert (Rezepte 2 und 9).
- TaskList: Liste mit Ein- und Ausgleit-Animation (Rezept 4).
- TaskCard: Karte mit Checkbox, animierter Durchstreichung, Konfetti und Löschen mit «Rückgängig» (Rezepte 3 und 7).
- ProgressRing: Ring mit «1/3» in der Mitte und aria-label «1 von 3 erledigt» (Rezept 1).
- EmptyState: lächelnde Wolke (Candy) und freundlicher Satz (Rezept 5).

Je Komponente: Name, was sie zeigt, welches Rezept aus DESIGN.md sie umsetzt. Beispiel: TaskInput: Eingabefeld mit Plus-Knopf (DESIGN.md, Rezept 2).

## Risiken

- Der Candy-Titel ist bewusst einfarbig, die Wow-Checkliste verlangt aber Verlaufstext: Der Titel nutzt trotzdem `text-gradient`, der Verlauf ist in Candy einfarbig. Im Review gilt das als erfüllt.
- Lange Titel ohne Leerzeichen sprengen die Karte bei 360 px: `break-words [overflow-wrap:anywhere]` und `min-w-0` (Rezept 7), dazu ein Test mit 200 Zeichen.
- Konfetti und Animationen stören bei «Bewegung reduzieren»: `MotionConfig reducedMotion="user"` und kein Konfetti bei `prefers-reduced-motion`.

Höchstens 3, je mit Gegenmassnahme. Beispiel: Alte Daten im localStorage passen nicht mehr: Migration mit Test (AGENTS.md, Regel 9).
