# CMD Insight — backlog

Pendientes acordados, para retomar más adelante. Ordenado por bloque, no por prioridad.

## 1. Planes y cobros

- [ ] Modelar los planes con precio y modalidad (mensual / trimestral / semestral / anual),
      similar al catálogo de Vivam. Hoy `PlanTipo` es solo un enum sin precio.
- [ ] Estados de suscripción: trial activo → vencido → pago → moroso → baja.
- [ ] Integración de pagos con **dLocal** (mencionado en el copy como el procesador).
      Checkout, webhooks de confirmación, reintentos.
- [ ] Facturación / comprobantes por organización.
- [ ] "Plan Cortesía CMD" ya existe como enum — falta el flujo de asignación y su vencimiento.
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
- [ ] Planes Individual vs Individual Premium (informes para médico, chequeo precompetitivo,
      prioridad en red CMD) — hoy solo están en el enum y el copy.

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
- [ ] Reemplazar `public/cmd-insight-logo.jpeg` por el SVG oficial (ver `components/Logo.tsx`).
- [ ] La sesión guarda rol y organización por 30 días; evaluar refrescar el token al cambiar
      rol/organización de un usuario.
