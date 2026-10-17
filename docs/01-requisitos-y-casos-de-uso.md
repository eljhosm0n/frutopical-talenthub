# Requisitos y casos de uso

## Reglas que guían el desarrollo

| Área | Regla acordada |
|---|---|
| Roles internos | Admin RH y Personal TH. |
| Candidatos | Consultan convocatorias y se postulan. |
| Estados | RECIBIDA, PRESELECCIONADA, EN EVALUACIÓN, ELEGIBLE, NO SELECCIONADA. |
| Elegibilidad | `ELEGIBLE` no crea un empleado ni una vinculación. |
| Vinculación | PENDIENTE, EN TRÁMITE y COMPLETO; proceso independiente. |
| Solicitudes | Solo certificado laboral. |
| PQRSF | Módulo independiente y simple. |
| Integraciones | Encuesta y requisición mediante Google Forms; Drive queda pendiente de arquitectura. |

## Primer bloque: gestión de postulaciones

**RU-01 — Consultar convocatorias.** Un candidato puede ver las convocatorias cuya fecha de cierre no ha vencido.

**RU-02 — Postularse.** Un candidato registra sus datos y se postula una única vez a una convocatoria activa. La postulación nace en `RECIBIDA`.

**RU-03 — Consultar postulaciones.** El personal interno revisa candidato, convocatoria y estado.

**RU-04 — Actualizar estado.** El personal interno asigna uno de los cinco estados acordados. Este cambio no modifica `empleado`, `vinculacion` ni `expediente`.
