# Flujo y diseño del primer bloque

```text
Candidato → Consulta convocatoria activa → Diligencia formulario
          → API valida datos y fecha de cierre
          → Candidato (existente o nuevo) + Postulación (RECIBIDA)

Personal TH/Admin RH → Consulta postulaciones → Actualiza estado
```

## Decisiones

- **React + Vite** mantiene el frontend moderno pero fácil de explicar y ejecutar en una sustentación SENA.
- **Express + mysql2** permite ver las consultas SQL y las transacciones sin una capa adicional difícil de aprender.
- La creación de candidato y postulación usa una **transacción**: evita que se cree un candidato sin su postulación si algo falla.
- Por ahora las rutas internas están separadas por intención, pero aún no se agrega inicio de sesión. La siguiente entrega incorpora autenticación basada en `usuario` y `rol`, antes de mostrar el panel interno al público.
