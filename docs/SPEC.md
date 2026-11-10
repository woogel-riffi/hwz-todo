# SPEC: Was die App können muss

Diese Datei füllt /spec. Ein ausgefülltes Beispiel steht in docs/PROMPTS.md unter «Beispiel einer SPEC».

## Ziel

Eine ToDo-Liste für mich, in der ich Aufgaben schnell anlege, abhake und lösche.

## Muss

- Aufgabe mit Titel anlegen (Enter oder Plus-Knopf).
- Aufgabe abhaken und wieder öffnen.
- Aufgabe löschen, mit «Rückgängig».
- Zähler «erledigt von gesamt» ist immer sichtbar.
- Leerer Zustand mit freundlichem Hinweis, wenn keine Aufgabe da ist.

## Look

Candy

## Nicht

- Kein Login, kein Server. Die Daten bleiben im Browser.
- Keine Fälligkeitsdaten, Kategorien oder Prioritäten.
- Kein Bearbeiten des Titels nach dem Anlegen.

## Fertig, wenn

1. Leere Eingabe
   - Gegeben: Das Eingabefeld ist leer oder enthält nur Leerzeichen.
   - Wenn: Ich Enter drücke.
   - Dann: Es kommt keine Aufgabe dazu und das Feld schüttelt sich kurz.
2. 200 Zeichen
   - Gegeben: Ich tippe einen Titel mit mehr als 200 Zeichen.
   - Wenn: Ich Enter drücke.
   - Dann: Die Aufgabe hat höchstens 200 Zeichen, der Text bricht in der Karte um und nichts ragt hinaus.
3. Neu laden
   - Gegeben: Es gibt drei Aufgaben, eine davon ist abgehakt.
   - Wenn: Ich die Seite neu lade.
   - Dann: Alle drei Aufgaben sind noch da, die abgehakte ist weiterhin abgehakt.
4. Abhaken
   - Gegeben: Eine offene Aufgabe ist in der Liste.
   - Wenn: Ich ihre Checkbox anklicke.
   - Dann: Der Text wird animiert durchgestrichen, Konfetti erscheint und der Zähler steigt um 1. Ein zweiter Klick macht alles rückgängig und der Zähler sinkt um 1.
5. Schmales Fenster
   - Gegeben: Das Fenster ist 360 px breit.
   - Wenn: Ich die App benutze.
   - Dann: Alles ist lesbar und bedienbar, ohne seitliches Scrollen.
6. Anlegen
   - Gegeben: Das Eingabefeld enthält «Einkaufen».
   - Wenn: Ich Enter drücke oder auf den Plus-Knopf klicke.
   - Dann: «Einkaufen» erscheint als neue Karte in der Liste und das Feld ist wieder leer.
7. Löschen mit Rückgängig
   - Gegeben: Die Aufgabe «Einkaufen» ist in der Liste.
   - Wenn: Ich auf Löschen klicke und danach in der Meldung auf «Rückgängig».
   - Dann: Die Karte verschwindet zuerst und ist nach «Rückgängig» wieder an derselben Stelle.
8. Zähler
   - Gegeben: Es gibt 3 Aufgaben, 1 davon ist abgehakt.
   - Wenn: Ich die App ansehe.
   - Dann: Der Zähler zeigt «1 von 3 erledigt».
9. Leerer Zustand
   - Gegeben: Es gibt keine Aufgaben.
   - Wenn: Ich die App öffne.
   - Dann: Statt einer Liste erscheint ein Bild mit dem Hinweis, die erste Aufgabe anzulegen.

## Features

(leer)
