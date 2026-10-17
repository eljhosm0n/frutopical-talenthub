# Contrato API — v1

Base local: `http://localhost:3000/api/v1`

| Método y ruta | Propósito |
|---|---|
| `GET /health` | Comprueba que la API responde. |
| `GET /convocatorias` | Lista convocatorias abiertas. |
| `GET /convocatorias/:id` | Obtiene el detalle de una convocatoria. |
| `POST /postulaciones` | Crea candidato si hace falta y registra postulación en RECIBIDA. |
| `GET /postulaciones` | Lista postulaciones para gestión interna. |
| `PATCH /postulaciones/:id/estado` | Actualiza el estado de la postulación. |

Ejemplo de `POST /postulaciones`:

```json
{
  "id_convocatoria": 1,
  "tipo_documento": "CC",
  "numero_documento": "1000000001",
  "nombres": "Carlos",
  "apellidos": "Pérez",
  "correo": "carlos.perez@example.com",
  "telefono": "3000000000",
  "ciudad": "Barranquilla"
}
```
