# CMD Insight — backlog

Pendientes acordados, para retomar más adelante. Ordenado por bloque, no por prioridad.

## 1. Planes y cobros

**Precios de lista definidos (pesos uruguayos / mes), ya en `lib/planes.ts` y en la web:**
Club **$4.500** · Gimnasio **$8.500** (hasta 200 socios) · Individual **$160**.
El Plan Club va incluido sin costo para clubes con cobertura médica CMD *durante entrenamientos*
(no los que solo cubren partidos). Plan Cortesía CMD: se asigna caso por caso, no es automático.

- [ ] Modelo de datos de precios y modalidad (mensual / trimestral / semestral / anual con
      descuento por compromiso, si se decide). Hoy `lib/planes.ts` tiene solo el precio mensual.
- [ ] Estados de suscripción: trial activo → vencido → pago → moroso → baja.
- [ ] Integración de pagos con **dLocal** — pagos por la web, sobre todo el plan individual.
      Checkout, webhooks de confirmación, reintentos. dLocal Go **sí** tiene API de suscripciones /
      pagos recurrentes (`create_subscription_plan`, `create_recurring_payment`, webhooks de
      ejecución, cancelación). Cliente de referencia: github.com/MetaLabs-inc/dlocal_go.
  - Claves de dLocal → **variables de entorno en Vercel** (`DLOCAL_API_KEY`, `DLOCAL_SECRET_KEY`,
    `DLOCAL_WEBHOOK_SECRET`), nunca en el repo ni en conversación. Construir y probar en sandbox
    primero; pasar a producción cuando dLocal valide el merchant.
  - Necesito de Manuel: doc de la API de dLocal Go (auth/firma, campos de subscription plan,
    formato de webhooks) + confirmar que "Pagos recurrentes" está habilitado en la cuenta.
  - Alcance: modelos `Suscripcion` y `Pago`; alta self-serve del plan individual (registro → crea
    org INDIVIDUAL + usuario → checkout); `/api/dlocal/webhook`; estados trial→activa→fallido→
    suspendida→cancelada; "Mi suscripción" en el panel del deportista; panel de cobros Admin CMD;
    cron de vencimientos. **Club/gimnasio:** después y opcional (link de pago, no recurrente obligatorio).
  - Cuenta dLocal Go: **González Guerrero Manuel Alejandro y Arredondo Diez Camila - Sociedad de
    Hecho**, RUT **220266830010**, Uruguay. Teléfono público del negocio: **+598 96 276 998**
    (el registrado en dLocal Go es +598 98 052210 — conviene unificarlo).
  - Requisitos de validación de merchant — HECHO en la web: `/terminos`, `/privacidad`, `/contacto`
    (formulario probado y funcionando + bandeja en `/app/cmd/mensajes`), línea legal en el footer,
    datos legales centralizados en `lib/legal.ts`. Sin redes sociales (dLocal lo prefiere a íconos rotos).
  - **Falta (bloqueado por el dominio):**
    1. Conseguir el subdominio definitivo — va a ser un subdominio de **`cmdtech.uy`** (todavía no lo tienen).
    2. Conectar ese subdominio a Vercel.
    3. En dLocal Go → Datos de la empresa → cambiar el sitio de `cmdinsight.lovable.app` a esa URL.
    4. (Opcional) actualizar el teléfono en dLocal Go a +598 96 276 998.
    5. Recién ahí avisarle a Bruna (dLocal) para que revise / valide.
- [ ] Facturación / comprobantes por organización.
- [ ] Flujo de asignación del Plan Cortesía CMD y su vencimiento.
- [ ] Panel de cobros para Admin CMD (quién pagó, quién debe, próximos vencimientos).

## 2. Gimnasios — flujo completo

- [ ] Onboarding de socios (alta masiva + ficha médica básica al registrarse).
- [ ] Evaluación médica inicial obligatoria al dar de alta un socio.
- [ ] Gestión por grupos y niveles (principiante / intermedio / avanzado, turnos).
- [ ] Material / flujo de "capacitación del equipo de instructores" (incluida en la suscripción).
- [ ] Vista y reportes pensados para el dueño del gimnasio (no cuerpo técnico deportivo).
- [ ] Reducción de responsabilidad legal: registro auditable de evaluaciones y alertas.

## 3. Deportista individual

- [x] **Alta self-serve**: `/registro` (público) → `POST /api/registro` crea en una transacción
      org INDIVIDUAL (prueba 30 días) + usuario DEPORTISTA + Deportista con perfil elegido, y abre
      sesión → `/app/mi`. Honeypot antispam. Links desde la landing de deportistas y `/acceder`.
- [x] **Vencimiento del trial**: `lib/trial.ts` (`trialInfo`). El `AppShell` muestra un aviso
      cuando faltan ≤ 5 días o ya venció (todos los roles con org). El deportista individual con
      prueba vencida ve la pantalla `TrialVencido` (recuperable: el admin extiende `trialHasta` o
      asigna un plan). Clubes/gimnasios solo ven el aviso, no se bloquean.
  - [ ] **Pendiente:** cuando exista cobro con dLocal, la pantalla de vencido debe llevar al pago
        en vez de "escribinos".
- [x] **Verificación de email** (alta self-serve): `Usuario.emailVerificadoEn` / `verifToken`.
      Al registrarse se manda el mail (`lib/email.ts`, API REST de Resend por `fetch`, sin
      dependencia). `/verificar-email?token=` confirma; aviso + botón "reenviar" en el `AppShell`.
      **No bloquea** el uso. Las cuentas creadas por un admin quedan verificadas automáticamente.
  - [ ] **Bloqueado por infra:** para que el mail realmente salga hacen falta `RESEND_API_KEY` y
        `EMAIL_FROM` en Vercel + un dominio de envío verificado en Resend (idealmente de cmdtech.uy).
        Sin eso, `enviarEmail` no envía y deja el intento en los logs del servidor.
- [x] **Perfiles de deportista** (EQUIPO / CORREDOR / CICLISTA / TRIATLETA / FUERZA / FITNESS):
      implementados. `lib/score/perfiles.ts` centraliza la config (umbrales ACWR, días de dolor
      persistente, DOMS vs dolor articular, zonas y eventos, preguntas del formulario). El motor
      (`engine`/`trend`/`recomendaciones`) está parametrizado por perfil; EQUIPO mantiene el
      comportamiento anterior exacto. Selector de perfil en alta/edición de deportista (default
      según tipo de org). `ControlDiarioForm` / `EventoForm` con campos condicionales (km,
      tipo de dolor, trabajo al fallo). Propuesta + bibliografía en `docs/perfiles-de-deportista.md`.
  - [ ] **Pendiente:** validar el mapa de parámetros por perfil con un fisio (los umbrales
        actuales son una primera aproximación de la literatura).
  - [ ] Backfill: los deportistas existentes quedan en EQUIPO por default; revisar caso por caso.
- [x] "Plan Premium Individual" eliminado (web, prompt maestro, landing de referencia). Queda
      **un solo Plan Individual $160/mes** — CMD Insight no presta asistencia médica al individuo,
      es autocontrol. **Pendiente:** actualizar `CMD_Insight_Presentacion.pdf` (no se puede editar
      por código; la página 6 del deck todavía muestra dos planes).

## 4. Web principal — branding y copy — HECHO (commit del branding)

- [x] Sacado del footer "Dr. Manuel González · RUT: 220266830010".
- [x] Footer ahora dice: *"CMD Insight fue desarrollada por CMD Tech, la unidad tecnológica de
      Integra Medical Group."*
- [x] Sección "Por qué elegir": atribución a CMD Tech / Integra Medical Group, manteniendo el
      ángulo de "médicos de emergencia con experiencia en cobertura deportiva".
- [x] Quitada la referencia a la web anterior (`insights.coberturamedicad.com`) del footer y del
      bloque de contacto. Quedan solo WhatsApp y email (son de Cobertura Médica Deportiva; se
      cambiarán a los de CMD Tech más adelante).
- [ ] **Pendiente:** cambiar WhatsApp y email por los de CMD Tech cuando estén.
- [ ] Otros detalles de copy de la web principal (a definir).

## 5. Higiene técnica

- [ ] Correr `npm run build` local y poner `typescript.ignoreBuildErrors: false` en `next.config.mjs`.
- [x] Logo pasado a SVG inline (`components/Logo.tsx`) — nítido, con variante light/dark. Es una
      reinterpretación; **pendiente** reemplazar el isotipo por el SVG oficial cuando esté.
- [ ] La sesión guarda rol y organización por 30 días; evaluar refrescar el token al cambiar
      rol/organización de un usuario.
