import { Router } from 'express';
import { pool } from '../../config/database.js';

export const vinculacionesRouter = Router();

const STATES = [
  'PENDIENTE',
  'EN TRÁMITE',
  'COMPLETO'
];

/*
|--------------------------------------------------------------------------
| CONSULTAR VINCULACIONES
|--------------------------------------------------------------------------
*/

vinculacionesRouter.get(
  '/',
  async (_request, response, next) => {
    try {
      const [rows] = await pool.execute(
        `
        SELECT
          v.id_vinculacion,

          e.id_empleado,
          e.numero_documento,
          e.nombres,
          e.apellidos,
          e.cargo,
          e.fecha_ingreso,
          e.estado AS estado_empleado,

          ev.id_estado_vinculacion,
          ev.nombre AS estado_vinculacion,

          v.fecha_inicio,
          v.fecha_actualizacion,
          v.observacion

        FROM vinculacion v

        INNER JOIN empleado e
          ON e.id_empleado = v.id_empleado

        INNER JOIN estado_vinculacion ev
          ON ev.id_estado_vinculacion =
             v.id_estado_vinculacion

        ORDER BY
          v.id_vinculacion DESC
        `
      );

      response.json({
        data: rows
      });
    } catch (error) {
      next(error);
    }
  }
);

/*
|--------------------------------------------------------------------------
| CREAR VINCULACIÓN
|--------------------------------------------------------------------------
*/

vinculacionesRouter.post(
  '/',
  async (request, response, next) => {
    const {
      id_empleado,
      estado = 'PENDIENTE',
      fecha_inicio,
      observacion
    } = request.body;

    const idEmpleado = Number(id_empleado);

    if (
      !Number.isInteger(idEmpleado) ||
      idEmpleado < 1
    ) {
      return response.status(400).json({
        error: 'id_empleado no es válido.'
      });
    }

    const estadoNormalizado = estado
      ?.toString()
      .trim()
      .toUpperCase();

    if (!STATES.includes(estadoNormalizado)) {
      return response.status(400).json({
        error:
          `Estado inválido. Use: ${STATES.join(', ')}.`
      });
    }

    const fecha =
      fecha_inicio?.toString().trim() || null;

    const nota =
      observacion?.toString().trim() || null;

    try {
      const [employee] = await pool.execute(
        `
        SELECT
          id_empleado
        FROM empleado
        WHERE id_empleado = ?
        `,
        [idEmpleado]
      );

      if (!employee[0]) {
        return response.status(404).json({
          error: 'El empleado no existe.'
        });
      }

      const [existing] = await pool.execute(
        `
        SELECT
          id_vinculacion
        FROM vinculacion
        WHERE id_empleado = ?
        `,
        [idEmpleado]
      );

      if (existing[0]) {
        return response.status(409).json({
          error:
            'Este empleado ya tiene una vinculación registrada.'
        });
      }

      const [state] = await pool.execute(
        `
        SELECT
          id_estado_vinculacion
        FROM estado_vinculacion
        WHERE nombre = ?
        `,
        [estadoNormalizado]
      );

      if (!state[0]) {
        return response.status(422).json({
          error:
            'El estado de vinculación no existe en la base de datos.'
        });
      }

      const [created] = await pool.execute(
        `
        INSERT INTO vinculacion
        (
          id_empleado,
          id_estado_vinculacion,
          fecha_inicio,
          observacion
        )
        VALUES (?, ?, ?, ?)
        `,
        [
          idEmpleado,
          state[0].id_estado_vinculacion,
          fecha,
          nota
        ]
      );

      response.status(201).json({
        data: {
          id_vinculacion: created.insertId,
          id_empleado: idEmpleado,
          estado_vinculacion: estadoNormalizado,
          fecha_inicio: fecha,
          observacion: nota
        }
      });
    } catch (error) {
      next(error);
    }
  }
);

/*
|--------------------------------------------------------------------------
| CAMBIAR ESTADO DE VINCULACIÓN
|--------------------------------------------------------------------------
*/

vinculacionesRouter.patch(
  '/:id/estado',
  async (request, response, next) => {
    const estado = request.body.estado
      ?.toString()
      .trim()
      .toUpperCase();

    const observacion =
      request.body.observacion
        ?.toString()
        .trim() || null;

    if (!STATES.includes(estado)) {
      return response.status(400).json({
        error:
          `Estado inválido. Use: ${STATES.join(', ')}.`
      });
    }

    const idVinculacion = Number(
      request.params.id
    );

    if (
      !Number.isInteger(idVinculacion) ||
      idVinculacion < 1
    ) {
      return response.status(400).json({
        error: 'ID de vinculación no válido.'
      });
    }

    try {
      const [state] = await pool.execute(
        `
        SELECT
          id_estado_vinculacion
        FROM estado_vinculacion
        WHERE nombre = ?
        `,
        [estado]
      );

      if (!state[0]) {
        return response.status(422).json({
          error:
            'El estado de vinculación no existe.'
        });
      }

      const [result] = await pool.execute(
        `
        UPDATE vinculacion

        SET
          id_estado_vinculacion = ?,
          observacion = ?,
          fecha_actualizacion = CURRENT_TIMESTAMP

        WHERE id_vinculacion = ?
        `,
        [
          state[0].id_estado_vinculacion,
          observacion,
          idVinculacion
        ]
      );

      if (!result.affectedRows) {
        return response.status(404).json({
          error:
            'Vinculación no encontrada.'
        });
      }

      response.json({
        data: {
          id_vinculacion: idVinculacion,
          estado_vinculacion: estado,
          observacion
        }
      });
    } catch (error) {
      next(error);
    }
  }
);