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

F1 Delegieren:

- `src/lib/storage.ts` und `storage.test.ts`: Version 2 und Migration `migrateV1toV2`.
- `src/features/tasks/model.ts` und `model.test.ts`: Feld `assignee`, Liste `FAMILY`, Funktion `assignTask`.
- `src/features/tasks/useTasks.ts` und `useTasks.test.ts`: Funktion `assign` im Hook.
- `src/features/tasks/components/DelegateBubbles.tsx` und `DelegateBubbles.test.tsx`: aufsteigende Seifenblasen mit Zauberstab-Zeiger.
- `src/features/tasks/components/TaskCard.tsx` und `TaskCard.test.tsx`: Knopf «Delegieren» und Abzeichen mit ×.
- `src/features/tasks/components/TaskList.tsx`, `src/App.tsx`: reichen `assign` an die Karte weiter.
- `src/index.css`, `DESIGN.md`, `docs/STACK.md`: neues Rezept «Seifenblasen» mit Platz-Animation und Klasse `cursor-wand` (Zauberstab).
- `src/lib/bubbleFlights.ts` und `bubbleFlights.test.ts`: zufällige Bahnen, Reihenfolge und Flugbahnen der Blasen.

F2 Spalte «Delegiert»:

- `src/features/tasks/model.ts` und `model.test.ts`: reine Funktion `splitTasks(tasks)` → `{ mine, delegated }`.
- `src/features/tasks/components/DelegatedColumn.tsx` und `DelegatedColumn.test.tsx`: Spalte mit Rand, Titel «Delegiert 😄», Zähler und Hinweis bei leerer Spalte.
- `src/App.tsx`: zwei Spalten nebeneinander (ab 768 px), sonst untereinander; Seite `max-w-6xl`.

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

F1 Delegieren, Version 2:

```ts
// localStorage "hwz-todo" = { version: 2, tasks: Task[] }
export const FAMILY = ['Phil', 'Harvey', 'Sophie', 'Lisa', 'MogliTheCat', 'Wichtel'] as const
export type FamilyMember = (typeof FAMILY)[number]

export type Task = {
  id: string
  title: string
  done: boolean
  createdAt: number
  assignee: FamilyMember | null // neu, null = niemandem zugeordnet
}

export type StoredState = { version: 2; tasks: Task[] }
```

Migration `migrateV1toV2`: jede Aufgabe aus Version 1 bekommt `assignee: null`, sonst bleibt alles gleich. Ein unbekannter Name beim Laden wird zu `null`.

Schlüssel `hwz-todo`, jetzt Version 2.

F2 braucht kein neues Feld: Eine Aufgabe steht in der Spalte «Delegiert», wenn `assignee` nicht `null` ist. Darum keine neue Version und keine Migration. Kaputte oder fehlende Daten ergeben eine leere Liste (docs/STACK.md, «Datenhaltung»).

Typen als TypeScript-Block, dazu Schlüssel und Version im localStorage. Beispiel: `localStorage "hwz-todo" = { version: 1, tasks: Task[] }`.

## Komponenten

- App: Rahmen mit Titel «Meine Aufgaben», Datum, Fortschrittsring und Toaster (DESIGN.md, Rezept 1).
- TaskInput: Eingabefeld mit Plus-Knopf, schüttelt bei leerer Eingabe, Taste «N» fokussiert (Rezepte 2 und 9).
- TaskList: Liste mit Ein- und Ausgleit-Animation (Rezept 4).
- TaskCard: Karte mit Checkbox, animierter Durchstreichung, Konfetti und Löschen mit «Rückgängig» (Rezepte 3 und 7).
- ProgressRing: Ring mit «1/3» in der Mitte und aria-label «1 von 3 erledigt» (Rezept 1).
- EmptyState: lächelnde Wolke (Candy) und freundlicher Satz (Rezept 5).
- DelegateBubbles: sechs Seifenblasen (shadcn `Button` als Grundlage) steigen nacheinander auf, platzen beim Klick; Esc oder Klick daneben schliesst; Mauszeiger `cursor-wand` (neues Rezept 10 «Seifenblasen»).
- DelegatedColumn (F2): Spalte nach DESIGN.md, Rezept 6 (Board-Spalte): `glass flex min-h-64 flex-col gap-3 rounded-2xl border p-3`, Kopf `h2` «Delegiert 😄» mit shadcn `Badge` als Zähler; darin dieselbe `TaskList`. Leer: `text-muted-foreground` «Noch nichts delegiert.».
- App (F2): `<div className="grid grid-cols-1 gap-6 md:grid-cols-2">` mit linker Spalte (Eingabe und eigene Liste oder EmptyState) und rechter Spalte DelegatedColumn; `main` mit `max-w-6xl` (Rezept 1, Bau 2).
- TaskCard (F1): Knopf «Delegieren» mit Icon `Wand2`; zugeordnete Person als shadcn `Badge` mit ×-Knopf (Rezept 3, ergänzt).
Je Komponente: Name, was sie zeigt, welches Rezept aus DESIGN.md sie umsetzt. Beispiel: TaskInput: Eingabefeld mit Plus-Knopf (DESIGN.md, Rezept 2).

## Risiken

- Gespeicherte Aufgaben aus Version 1 gehen verloren: Migration `migrateV1toV2` mit Test aus echten Version-1-Daten (AGENTS.md, Regel 9).
- Zauberstab-Zeiger und Seifenblasen sind in DESIGN.md noch nicht beschrieben: Task 9 ergänzt zuerst ein Rezept in DESIGN.md und docs/STACK.md. Diese geschützten Dateien werden nur dafür geändert, die Freigabe dieses Plans gilt als Auftrag.
- Aufsteigende Blasen sind per Tastatur oder bei «Bewegung reduzieren» schwer erreichbar: Blasen sind echte Knöpfe mit Fokus, und bei reduzierter Bewegung stehen sie sofort still an ihrem Platz.

Höchstens 3, je mit Gegenmassnahme. Beispiel: Alte Daten im localStorage passen nicht mehr: Migration mit Test (AGENTS.md, Regel 9).
