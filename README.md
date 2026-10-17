# Frutopical TalentHub

Sistema web de apoyo a Talento Humano para publicar convocatorias, recibir postulaciones y administrar sus etapas. Es un proyecto académico SENA con una arquitectura simple de mantener: React + Node.js/Express + MySQL.

## Estructura

```text
frutopical-talenthub/
├── frontend/       # Portal público y panel interno (React + Vite)
├── backend/        # API REST, reglas de negocio y acceso a MySQL
├── database/       # Verificación y datos iniciales de la base existente
├── docs/           # Requisitos, flujos, contrato API y decisiones
├── uploads/        # Archivos locales de desarrollo (no se versionan)
└── tests/          # Pruebas de integración y de interfaz futuras
```

## Alcance implementado en el primer bloque

- Consulta pública de convocatorias activas.
- Registro de candidato y postulación a una convocatoria.
- Estado inicial obligatorio: `RECIBIDA`.
- Consulta interna de postulaciones y cambio controlado de estado.

No se crea un empleado al marcar una postulación como `ELEGIBLE`; la vinculación y el expediente continúan siendo procesos separados.

## Inicio rápido

1. En MySQL Workbench, ejecuta `database/verify_database.sql` y luego `database/seed_reference_data.sql`.
2. Copia `backend/.env.example` como `backend/.env` y completa tus credenciales MySQL.
3. En dos terminales:

   ```powershell
   cd backend; npm install; npm run dev
   cd frontend; npm install; npm run dev
   ```

4. Abre la dirección indicada por Vite (normalmente `http://localhost:5173`). La API queda en `http://localhost:3000/api/v1`.

La guía funcional y las rutas están en `docs/`.
