# Daniell-Element Simulation

Eine browserbasierte Simulation einer galvanischen Zelle für den Chemieunterricht in der Sekundarstufe II. Die Webanwendung zeigt ein Daniell-Element mit Zink-Anode, Kupfer-Kathode, äußerem Elektronenfluss, Verbraucher und Ionenbrücke. Zusätzlich gibt es Detailansichten zur Oxidation an der Zink-Elektrode, zur Reduktion an der Kupfer-Elektrode, eine Ansicht zum Zustand nach längerer Betriebszeit und eine Selbstüberprüfung mit Drag-and-Drop.

## Lokal starten

Die Anwendung benötigt keine Installation und keine externen Frameworks.

1. Den Projektordner öffnen.
2. Die Datei `index.html` im Browser öffnen.
3. Über die Buttons `Start`, `Pause`, `Reset` und `Schrittweise Erklärung` die Simulation bedienen.
4. Auf die Zink-Elektrode klicken, um die vergrößerte Detailansicht der Oxidation zu öffnen.
5. Auf die Kupfer-Elektrode klicken, um die vergrößerte Detailansicht der Reduktion zu öffnen.
6. Den Button `Zustand nach längerem Betrieb` nutzen, um die Veränderungen der Elektroden und Ionenkonzentrationen zu betrachten.
7. Den Button `Selbstüberprüfung` nutzen, um die Fachbegriffe selbst zuzuordnen und zu überprüfen.

## Nutzung mit GitHub Pages

Das Projekt kann direkt in ein GitHub-Repository hochgeladen werden. Für GitHub Pages genügt es, in den Repository-Einstellungen GitHub Pages für den Branch mit der Datei `index.html` zu aktivieren.

## Fachliche Einordnung

Die Simulation stellt das Daniell-Element als galvanische Zelle dar. Zink ist die Anode und wird oxidiert:

`Zn → Zn²⁺ + 2 e⁻`

Kupfer ist die Kathode. Dort werden Kupfer-Ionen reduziert:

`Cu²⁺ + 2 e⁻ → Cu`

Die Elektronen fließen im äußeren Stromkreis von der Zink-Elektrode zur Kupfer-Elektrode. Die Ionenbrücke ermöglicht den Ladungsausgleich zwischen den Halbzellen.

In der Detailansicht wird vergrößert gezeigt, dass ein Zink-Atom an der Metalloberfläche zwei Elektronen abgibt, als Zn²⁺-Ion in Lösung geht und die Elektronen im Metall in Richtung äußerer Stromkreis weitergeleitet werden.

In der Kupfer-Detailansicht wird gezeigt, dass ein Cu²⁺-Ion zwei Elektronen aufnimmt, zu einem neutralen Cu-Atom wird und sich an der Kupfer-Elektrode abscheidet.

Die Ansicht `Zustand nach längerem Betrieb` zeigt die Folgen des Zellbetriebs: Die Zink-Elektrode wird kleiner, die Kupfer-Elektrode wächst, in der Zink-Halbzelle befinden sich mehr Zn²⁺-Ionen und in der Kupfer-Halbzelle weniger Cu²⁺-Ionen.

Die Selbstüberprüfung blendet die Fachbeschriftungen aus. Lernende ordnen zentrale Begriffe per Drag-and-Drop zu und erhalten anschließend eine farbliche Rückmeldung.
