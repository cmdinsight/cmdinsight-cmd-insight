# Perfiles de deportista — personalización del formulario, el algoritmo y el dashboard

> Estado: **propuesta / a validar**. No hay documentación previa sobre esto; el modelo
> actual (formularios + score) está diseñado para deporte de equipo (fútbol).
> Base bibliográfica al final.

## El problema

La carga de un corredor no se mide igual que la de alguien que hace pesas, y las lesiones
no aparecen por los mismos motivos:

- **Corredor / ciclista / triatleta:** las lesiones son casi todas por **sobrecarga**
  (estrés óseo, tendinopatías, periostitis). El ACWR es el predictor central y el umbral de
  peligro real está en **> 1.5–1.6** (3–5× más riesgo), no en 1.3.
- **Fuerza / gimnasio (musculación, powerlifting, crossfit):** predomina la lesión
  **aguda bajo carga** (disco, hombro, tendón) más que la gradual. El **dolor muscular
  post-entreno (DOMS) es normal y esperado** — pico a las 24–72 h, se va en ~1 semana. Tratar
  ese dolor muscular como "dolor persistente" (regla actual: ≥5/10 por ≥5 días) da falsos
  positivos constantes. La señal real es el **dolor articular / tendinoso**, no el muscular.
- **Deporte de equipo amateur:** el modelo actual sirve tal cual.
- Además: el mal sueño dispara el riesgo en **todas** las disciplinas (eso no cambia).

## Perfiles propuestos

| Perfil | Métrica de carga | ACWR | Dolor | Eventos típicos |
|---|---|---|---|---|
| `EQUIPO` (actual) | RPE × minutos | peso alto, peligro > 1.3 | regla actual | golpe, tirón, sobrecarga, calambres |
| `CORREDOR` | km del día + RPE × min | **peso muy alto, peligro > 1.5** | 3–4 días misma zona ya es señal (tendinopatía incipiente) | dolor agudo al correr, cambio de calzado, pisada en falso |
| `CICLISTA` | horas + RPE (o km + desnivel) | peso medio-alto | zonas de contacto además de MMII | caída, cambio de posición/bici, adormecimiento manos |
| `TRIATLETA` | carga total ponderada por segmento (nado / bici / corrida) | peso alto | combina corredor + ciclista | los tres |
| `FUERZA` | tonelaje (series × reps × kg) **o** RPE de sesión + entrenó al fallo (sí/no) | peso bajo-medio | **separar dolor muscular (DOMS, tolerado) de dolor articular/tendinoso (alarma)** | pinchazo agudo levantando, molestia articular bajo carga, fallo técnico con peso |
| `FITNESS` | RPE de sesión | peso bajo | versión simple | sobreesfuerzo, molestia que no cede |

## Qué se parametriza por perfil (`lib/score/perfiles.ts`)

1. **Preguntas del formulario diario:**
   - Núcleo común a todos: dolor, zona, fatiga, sueño, estrés, RPE.
   - `CORREDOR`: + km, + superficie (asfalto / pista / trail), + calzado nuevo esta semana.
   - `CICLISTA`: + horas, + desnivel.
   - `TRIATLETA`: + qué disciplina(s) y volumen de cada una.
   - `FUERZA`: + tonelaje o RPE de sesión, + ¿entrenaste al fallo?, + grupos trabajados,
     + tipo de dolor (muscular / articular-tendinoso).
   - `FITNESS`: solo el núcleo.

2. **Métrica de carga para el ACWR:** RPE × min es el piso universal; encima se usa la métrica
   externa del perfil (km, horas, tonelaje) cuando existe.

3. **Pesos y umbrales del score:**
   - `acwrPeligro`: EQUIPO 1.3 · CORREDOR/TRIATLETA 1.5 · CICLISTA 1.5 · FUERZA 1.6 · FITNESS 1.6
   - `dolorPersistenteDias`: EQUIPO 5 · CORREDOR/CICLISTA 3 · FUERZA solo cuenta el articular
   - `pesoACWR` / `pesoDolor` / `pesoEvento` distintos por perfil (endurance ↑ACWR, fuerza ↑evento).

4. **Lista de zonas de dolor** (anatomía por disciplina):
   - `CORREDOR`: rodilla (femoropatelar), tibia (periostitis / estrés), Aquiles, fascia plantar,
     cintilla iliotibial, cadera, isquios, gemelo.
   - `CICLISTA`: rodilla, cintilla, lumbar, cervical, muñecas / manos, periné.
   - `FUERZA`: hombro, lumbar / pelvis, rodilla, codo, muñeca / mano, cadera.
   - `EQUIPO`: la lista actual.

5. **Textos de las recomendaciones** (`lib/score/recomendaciones.ts` por perfil):
   - CORREDOR: "reducí el kilometraje 20–30% esta semana, evitá asfalto y cuestas".
   - FUERZA: "bajá el tonelaje, sacá el trabajo al fallo, priorizá técnica".
   - EQUIPO: el actual.

## Dashboard por perfil

- `CORREDOR`: kilometraje semanal (barras) + ACWR destacado + mapa de dolor de MMII + racha de descanso.
- `FUERZA`: tonelaje semanal + tendencia del dolor **articular** (separada del muscular) + grupos más cargados.
- `CICLISTA`: horas / semana + desnivel + zonas de contacto.
- `TRIATLETA`: carga por segmento + ACWR combinado.
- `EQUIPO`: el dashboard actual.
- `FITNESS`: versión mínima (score + tendencia, sin métricas técnicas).

## Implementación (fases)

1. `Deportista.perfil` (enum `EQUIPO | CORREDOR | CICLISTA | TRIATLETA | FUERZA | FITNESS`).
   Club/gimnasio → `EQUIPO` por defecto. Individual → lo elige al registrarse (self-serve, ya en backlog).
2. `lib/score/perfiles.ts` con la config de cada perfil (preguntas, zonas, eventos, pesos, umbrales).
3. `computeRisk(input, perfil)` — hoy los parámetros de EQUIPO están hardcodeados; pasarlos a la config.
4. Formularios: renderizan las preguntas según el perfil.
5. `PlayerInsight` / dashboard: eligen la vista según el perfil.
6. `recomendaciones.ts`: textos por perfil.

**Recomendación de alcance:** empezar por **`CORREDOR`** y **`FUERZA`** además del actual — son los
más distintos entre sí y los de mayor mercado en el plan individual. Validar el mapa de parámetros
con un fisio / preparador antes de codificar el motor.

## Base bibliográfica

- ACWR sweet spot 0.8–1.3, zona de peligro > 1.5 (riesgo 3–5×): revisión general de ACWR.
- Endurance: en ultramaratón la carga baja también sube el riesgo y el cambio agudo pesa menos que en
  deportes de equipo → el ACWR se interpreta distinto (Scientific Reports 2025; PMC9924505; PMC7312824).
- Lesiones de running por zona: rodilla 28 %, tobillo-pie 26 %, tibia 16 %; femoropatelar 17 %,
  Aquiles 10 %, periostitis tibial 8 % (PubMed 30787648).
- Fuerza: zonas más lesionadas hombro, lumbar, rodilla, codo, muñeca; en powerlifting lumbar/pelvis
  primero (PubMed 27328853; 39650568).
- DOMS: inicio 12–24 h, pico 24–72 h, resuelve en ~1 semana; depende de excéntrico, volumen y
  progresión → es esperable, no es alarma (varias fuentes de fisiología del ejercicio).
- Ciclismo: rodilla (tendinopatía rotuliana), cintilla, lumbar, cervical y compresión de manos/periné
  (PMC6347182).
- Sueño pobre: aumenta el riesgo de lesión de forma transversal a todas las disciplinas.
