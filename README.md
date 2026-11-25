# DZNT Lead Follow-up Demo

Ein ausführbares Beispiel für die Entscheidung, ob ein Lead ein Follow-up erhält. Die Demo arbeitet mit synthetischen Ereignissen und einem simulierten Versand.

## Ausführen

Voraussetzung ist Node.js 20 oder neuer. Die Demo braucht keine Pakete, Zugangsdaten oder Netzwerkverbindung.

```sh
node demo.mjs
node --test demo.test.mjs
```

## Ablauf

1. Jedes Ereignis enthält eine Lead-ID, eine Ereignis-ID und den Einwilligungsstatus.
2. Die Kombination aus Lead und Ereignis verhindert eine zweite Verarbeitung innerhalb des Laufs. Bereits erfolgreich versendete Ereignisse werden im übergebenen Speicher erfasst.
3. Eine fehlende Einwilligung überspringt den Versand. Ein simulierter Versandfehler bleibt in einem späteren Lauf mit demselben Speicher erneut versuchbar.

| Beispiel | Ergebnis |
| --- | --- |
| Einwilligung und erfolgreicher simulierter Versand | `sent` |
| Doppeltes Ereignis | `duplicate` |
| Keine Einwilligung | `skipped_no_consent` |
| Simulierter Versandfehler | `retryable_failure` |

Der Speicher lebt im Prozess. Für eine Produktionsintegration wären dauerhafte Zustände, ein asynchroner Versandadapter und providerseitige Idempotenz erforderlich.
