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
      Checkout, webhooks de confirmación, reintentos.
  - Cuenta dLocal Go: **González Guerrero Manuel Alejandro y Arredondo Diez Camila** (sociedad de
    hecho), RUT **220266830010**, Uruguay. Tel. registrado +598 98 052210.
  - Requisitos de validación de merchant: HECHO en la web → `/terminos`, `/privacidad`,
    `/contacto` (formulario funcional + bandeja en `/app/cmd/mensajes`), línea legal en el footer.
  - **Falta:** (1) en dLocal Go cambiar el sitio de `cmdinsight.lovable.app` a la URL real;
    (2) conectar el subdominio definitivo de `cmd.uy`; (3) confirmar el nombre legal completo
    (en dLocal aparece cortado: "...CAMILA -"); (4) decidir qué teléfono público se muestra;
    (5) recién ahí pedirle a dLocal (Bruna) que valide.
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

- [ ] **Alta self-serve**: registro directo desde la landing → crea una organización tipo
      INDIVIDUAL + usuario DEPORTISTA + su Deportista, todo en un paso. Hoy lo crea Admin CMD.
- [ ] **Variantes de perfil** dentro de INDIVIDUAL: fitness, runner, ciclista, triatleta, etc.
      Cada variante puede ajustar:
  - qué formularios / preguntas aplican,
  - los umbrales del score (la carga y el dolor no pesan igual en un runner que en fitness),
  - el copy y las recomendaciones.
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
