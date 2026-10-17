# Pruebas manuales del primer bloque

1. Ejecuta los dos scripts de `database/` en Workbench.
2. Configura y enciende la API; visita `GET /api/v1/health`. Debe devolver `status: ok`.
3. Crea una convocatoria con fecha de cierre futura si aún no hay una.
4. Abre el portal, verifica que aparece y registra una postulación.
5. Confirma en Workbench que la postulación está relacionada con candidato, convocatoria y estado `RECIBIDA`.
6. Envía `PATCH /api/v1/postulaciones/1/estado` con `{ "estado": "PRESELECCIONADA" }` y comprueba el cambio.
7. Intenta postular el mismo documento a la misma convocatoria: debe responder `409` y no duplicar registros.
