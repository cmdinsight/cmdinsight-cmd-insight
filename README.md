# CMD Insight — plataforma web

Sitio de marketing + plataforma real (auth, roles, base de datos) + demo pública
simulada, de **CMD Insight**, la unidad de prevención de lesiones de CMD — Cobertura
Médica Deportiva.

> "No solo cubrimos lesiones — las anticipamos."

## Stack

- Next.js 14 (App Router) · React 18 · TypeScript
- Tailwind CSS
- Prisma + PostgreSQL
- Auth propia con JWT en cookie (`jose`) + `bcryptjs`
- Gráficos en SVG puro, sin dependencias

## Estructura

```
app/(site)/            Landing de marketing (pública)
app/demo/              Demo simulada, sin login (datos ficticios en lib/demo)
app/acceder  app/setup Login y configuración inicial
app/app/               Plataforma autenticada
  mi/                  Deportista: 3 formularios + evolución
  plantel/             Entrenador / médico: dashboard + ficha por jugador
  organizacion/        Admin de club/gimnasio: deportistas, usuarios, import CSV
  cmd/                 Admin CMD: organizaciones, planes, datos demo
app/api/               Route handlers (auth, controles, deportistas, organizaciones…)
lib/score/             Motor de riesgo (puro): engine.ts + trend.ts
lib/data/              Acceso a datos (Prisma) + mapeo a los tipos del motor
lib/demo/data.ts       Plantel ficticio determinístico (demo + seed)
prisma/schema.prisma   Modelo de datos
```

## Roles

| Rol | Ve |
|---|---|
| `DEPORTISTA` | sus 3 formularios y su propio score / evolución |
| `ENTRENADOR` | dashboard del plantel (ranking, alertas, carga) |
| `MEDICO` | lo del entrenador + ficha médica editable + registrar eventos clínicos |
| `ADMIN_ORG` | alta/baja de deportistas y usuarios, import CSV, dashboard |
| `ADMIN_CMD` | organizaciones, planes, plan cortesía, datos demo |

## Puesta en marcha (Vercel)

1. Importar el repo en Vercel.
2. Crear una base **Vercel Postgres** y conectarla al proyecto (setea `DATABASE_URL`).
3. Agregar la variable `AUTH_SECRET` (cadena larga aleatoria).
4. Redeploy. El build corre `prisma db push` y crea las tablas.
5. Entrar a `/setup` y crear el primer usuario **ADMIN CMD**.
6. Desde `/app/cmd` → "Cargar datos demo" para poblar un club de ejemplo con
   14 deportistas, 35 días de historial y cuentas de prueba.

## Local

```bash
npm install
cp .env.example .env.local   # completar DATABASE_URL y AUTH_SECRET
npx prisma db push
npm run dev
```

## Motor de score

Score 0–7 = ACWR (máx 2) + IFS (máx 2) + Dolor persistente (máx 2) + Evento (máx 1).
Semáforo: 0–2 verde · 3–4 amarillo · 5–7 rojo. La landing, la demo y la plataforma
real llaman al **mismo** motor (`lib/score/`).

## Notas

- `next.config.mjs` tiene `typescript.ignoreBuildErrors: true` como red de seguridad
  del primer deploy (el proyecto se escribió sin poder correr `tsc` localmente).
  Cuando `npm run build` pase limpio, ponelo en `false`.
- Reemplazar `public/cmd-insight-logo.jpeg` por el SVG oficial cuando esté.

## Roadmap

- **Fase 2 del algoritmo:** modelo predictivo (regresión logística / random forest /
  XGBoost) con 6–12 semanas de datos.
- Importación de fichas médicas por CSV, notificaciones (email/WhatsApp), export PDF.
