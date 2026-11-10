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

### F1: Delegieren

Ich gebe eine Aufgabe an ein Familienmitglied weiter, indem ich eine aufsteigende Seifenblase mit dem Namen anklicke. Mögliche Personen: Phil, Harvey, Sophie, Lisa, MogliTheCat, Wichtel.

1. Blasen steigen auf
   - Gegeben: Eine Aufgabe ist in der Liste.
   - Wenn: Ich auf ihrer Karte auf «Delegieren» (Zauberstab) klicke.
   - Dann: Sechs Seifenblasen mit den Namen Phil, Harvey, Sophie, Lisa, MogliTheCat und Wichtel erscheinen dort, wo ich geklickt habe, werden schnell nach aussen geblasen und schweben dann in verschiedene Richtungen weiter, bis sie den Bildschirmrand verlassen.
2. Zauberstab
   - Gegeben: Die Seifenblasen sind sichtbar.
   - Wenn: Ich die Maus bewege.
   - Dann: Der Mauszeiger ist ein Zauberstab. Sind die Blasen weg, ist er wieder normal.
3. Blase platzt und ordnet zu
   - Gegeben: Die Seifenblasen sind sichtbar.
   - Wenn: Ich auf die Blase «Sophie» klicke.
   - Dann: Die Blase platzt mit einer kurzen Animation, alle anderen Blasen verschwinden, und auf der Karte steht ein Abzeichen «Sophie».
4. Neu delegieren
   - Gegeben: Die Aufgabe ist Sophie zugeordnet.
   - Wenn: Ich nochmals auf «Delegieren» klicke und die Blase «Phil» anklicke.
   - Dann: Auf der Karte steht nur noch «Phil».
5. Zuordnung entfernen
   - Gegeben: Die Aufgabe ist Phil zugeordnet.
   - Wenn: Ich auf das × am Abzeichen «Phil» klicke.
   - Dann: Das Abzeichen verschwindet, die Aufgabe ist niemandem zugeordnet.
6. Abbrechen
   - Gegeben: Die Seifenblasen sind sichtbar.
   - Wenn: Ich Esc drücke oder neben die Blasen klicke.
   - Dann: Die Blasen verschwinden und die Zuordnung der Aufgabe bleibt unverändert.
7. Tastatur und ruhige Bewegung
   - Gegeben: Die Seifenblasen sind sichtbar.
   - Wenn: Ich mit Tab zu einer Blase gehe und Enter drücke.
   - Dann: Die Person wird zugeordnet wie per Klick. Bei «Bewegung reduzieren» erscheinen die Blasen ohne Aufsteigen an ihrem Platz.
8. Nach dem Neuladen
   - Gegeben: Eine Aufgabe ist Lisa zugeordnet.
   - Wenn: Ich die Seite neu lade.
   - Dann: Auf der Karte steht weiterhin «Lisa».
9. Davongeflogen
   - Gegeben: Die Seifenblasen steigen auf.
   - Wenn: Ich keine Blase rechtzeitig anklicke.
   - Dann: Alle Blasen verlassen das Bild, die Ebene schliesst sich, und die Zuordnung der Aufgabe bleibt unverändert.
10. Alte Daten
   - Gegeben: Aufgaben aus der alten Version sind gespeichert.
   - Wenn: Ich die neue Version öffne.
   - Dann: Alle Aufgaben sind noch da, im richtigen Zustand, und niemandem zugeordnet.

### F2: Spalte «Delegiert»

Delegierte Aufgaben stehen in einer eigenen Spalte neben meiner Liste, damit ich sofort sehe, was ich abgegeben habe.

1. Zweite Spalte
   - Gegeben: Ich öffne die App auf einem breiten Bildschirm (ab 768 px).
   - Wenn: Ich die Seite ansehe.
   - Dann: Neben meiner Aufgabenliste steht eine zweite Spalte mit Rand und dem Titel «Delegiert 😄».
2. Verschieben beim Delegieren
   - Gegeben: Die Aufgabe «Einkaufen» steht in meiner Liste.
   - Wenn: Ich sie an Sophie delegiere.
   - Dann: «Einkaufen» verschwindet animiert aus meiner Liste und erscheint in der Spalte «Delegiert» mit dem Abzeichen «Sophie».
3. Zurück beim Entfernen
   - Gegeben: «Einkaufen» steht in der Spalte «Delegiert» bei Sophie.
   - Wenn: Ich auf das × am Abzeichen klicke.
   - Dann: «Einkaufen» wandert zurück in meine Liste, ohne Abzeichen.
4. Bedienbar in der Spalte
   - Gegeben: Eine Aufgabe steht in der Spalte «Delegiert».
   - Wenn: Ich sie abhake, neu delegiere oder lösche.
   - Dann: Es funktioniert gleich wie in meiner Liste, inklusive Konfetti und «Rückgängig».
5. Leere Spalte
   - Gegeben: Keine Aufgabe ist delegiert.
   - Wenn: Ich die Seite ansehe.
   - Dann: In der Spalte «Delegiert» steht der Hinweis «Noch nichts delegiert.».
6. Schmales Fenster
   - Gegeben: Das Fenster ist 360 px breit.
   - Wenn: Ich die App benutze.
   - Dann: Die Spalte «Delegiert» steht unter meiner Liste, alles ist lesbar, ohne seitliches Scrollen.
7. Nach dem Neuladen
   - Gegeben: «Einkaufen» ist an Lisa delegiert.
   - Wenn: Ich die Seite neu lade.
   - Dann: «Einkaufen» steht weiterhin in der Spalte «Delegiert» bei Lisa.
