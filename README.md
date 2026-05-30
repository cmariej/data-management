# data-management

Admin-Frontend für die Datenverwaltung. Deployed auf GitHub Pages unter `data.clara-jung.de`.

## Architektur

| Komponente | Technologie | URL |
|-----------|-------------|-----|
| Admin-Frontend (dieses Repo) | Angular → GitHub Pages | `data.clara-jung.de` |
| Backend API | Express → Docker (Heimserver) | `warehouse.jung-privat.de` |

Das Backend läuft im separaten Repository [warehouse](https://github.com/cmariej/warehouse) als Docker-Container auf dem Heimserver hinter nginx.

## Lokale Entwicklung

```bash
npm install
ng serve
```

Der Dev-Server leitet API-Aufrufe automatisch per Proxy an das Backend weiter (konfiguriert in `proxy.conf.json`). Es wird kein lokales Backend benötigt.

Erwartete Ausgabe: `http://localhost:4200`

## Deployment

Das Frontend wird automatisch über GitHub Actions auf GitHub Pages deployed wenn Änderungen auf `main` gepusht werden.

Manuell:

```bash
ng deploy
```

## Konfiguration

| Datei | Zweck |
|-------|-------|
| `src/environments/environment.ts` | Lokale Entwicklung → API via Proxy (`/api`) |
| `src/environments/environment.prod.ts` | Produktion → `https://warehouse.jung-privat.de/api` |
| `proxy.conf.json` | Proxy-Konfiguration für `ng serve` |
