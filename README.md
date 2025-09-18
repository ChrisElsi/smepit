# SMePit - iRacing Pit Analysis System

Ein team-basiertes Pit-Stop-Analyse-System für iRacing mit Live-Datenintegration.

## Features

- **Multi-Team Support**: Verwaltung mehrerer Teams (slowmo, slowmo2, slowmo3)
- **Live Dashboard**: Interaktive Anzeige von Pit-Stop-Daten
- **iRacing Bridge**: C# Komponente für Live-Datenübertragung
- **Supabase Integration**: Zentrale Datenspeicherung
- **Real-time Updates**: Live-Aktualisierung beim Team-Wechsel

## Tech Stack

- **Frontend**: Next.js 15, React, Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: Supabase (PostgreSQL)
- **Bridge**: C# .NET 8 Console Application

## Setup

### 1. Dependencies installieren
```bash
npm install
```

### 2. Environment Variables
Erstelle `.env.local`:
```bash
NEXT_PUBLIC_SUPABASE_URL=https://zfpwfxripfpyhjwixywl.supabase.co
SUPABASE_SERVICE_ROLE=your_service_role_key
NEXT_PUBLIC_TEAMS=slowmo,slowmo2,slowmo3
```

### 3. Development Server
```bash
npm run dev
```

### 4. iRacing Bridge
```bash
cd iRacingBridge
dotnet run
```

## Verwendung

1. **Dashboard**: http://localhost:3000
2. **Teams wechseln**: Links im Dashboard zwischen Teams klicken
3. **Test-Daten**: Bridge starten und 't' drücken
4. **Live-Updates**: Dashboard zeigt neue Pit-Stops automatisch

## API Endpoints

- `GET /api/teams` - Alle Teams laden
- `GET /api/pit-logs?team_slug=slowmo` - Team-spezifische Pit-Logs
- `POST /api/pit-logs` - Neuen Pit-Log erstellen
- `POST /api/iracing/webhook` - Bridge-Webhook für Live-Daten

## Production Deployment

Das System ist für Vercel-Deployment konfiguriert:
- Repository: https://github.com/ChrisElsi/smepit.git
- Live-URL: https://smepit.vercel.app
- Environment Variables in Vercel Dashboard setzen

## Bridge Commands

- `t` - Test-Pit-Stop senden
- `1/2/3` - Team wechseln
- `p` - Production Mode (vercel.app)
- `d` - Development Mode (localhost)
- `q` - Beenden