import { Router } from 'express';
import { pool } from '../../config/database.js';

export const convocatoriasRouter = Router();

/*
|--------------------------------------------------------------------------
| ESTADOS PERMITIDOS
|--------------------------------------------------------------------------
*/

const STATES = [
  'PUBLICADA',
  'CERRADA'
];

/*
|--------------------------------------------------------------------------
| VALIDAR DATOS DE CONVOCATORIA
|--------------------------------------------------------------------------
*/

function validateConvocatoria(body) {
  const fields = [
    'titulo',
    'cargo',
    'descripcion',
    'requisitos',
    'fecha_publicacion',
    'fecha_cierre'
  ];

  const missing = fields.filter(
    (field) =>
      !body[field]?.toString().trim()
  );

  if (missing.length) {
    return {
      error:
        `Campos requeridos: ${missing.join(', ')}.`
    };
  }

  const fechaPublicacion =
    body.fecha_publicacion
      .toString()
      .trim();

  const fechaCierre =
    body.fecha_cierre
      .toString()
      .trim();

  if (
    !/^\d{4}-\d{2}-\d{2}$/.test(
      fechaPublicacion
    )
  ) {
    return {
      error:
        'La fecha de publicación no es válida.'
    };
  }

  if (
    !/^\d{4}-\d{2}-\d{2}$/.test(
      fechaCierre
    )
  ) {
    return {
      error:
        'La fecha de cierre no es válida.'
    };
  }

  if (
    new Date(fechaCierre) <
    new Date(fechaPublicacion)
  ) {
    return {
      error:
        'La fecha de cierre no puede ser anterior a la fecha de publicación.'
    };
  }

  return {
    values: {
      titulo:
        body.titulo.toString().trim(),

      cargo:
        body.cargo.toString().trim(),

      descripcion:
        body.descripcion.toString().trim(),

      requisitos:
        body.requisitos.toString().trim(),

      fecha_publicacion:
        fechaPublicacion,

      fecha_cierre:
        fechaCierre
    }
  };
}

/*
|--------------------------------------------------------------------------
| CONSULTAR CONVOCATORIAS
|--------------------------------------------------------------------------
*/

convocatoriasRouter.get(
  '/',
  async (_request, response, next) => {
    try {
      const [rows] =
        await pool.execute(
          `
          SELECT
            id_convocatoria,
            titulo,
            cargo,
            descripcion,
            requisitos,
            fecha_publicacion,
            fecha_cierre,
            estado
          FROM convocatoria
          ORDER BY
            id_convocatoria DESC
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
| CONSULTAR UNA CONVOCATORIA
|--------------------------------------------------------------------------
*/

convocatoriasRouter.get(
  '/:id',
  async (request, response, next) => {
    try {
      const id =
        Number(request.params.id);

      if (
        !Number.isInteger(id) ||
        id < 1
      ) {
        return response.status(400).json({
          error:
            'El identificador de la convocatoria no es válido.'
        });
      }

      const [rows] =
        await pool.execute(
          `
          SELECT
            id_convocatoria,
            titulo,
            cargo,
            descripcion,
            requisitos,
            fecha_publicacion,
            fecha_cierre,
            estado
          FROM convocatoria
          WHERE id_convocatoria = ?
          LIMIT 1
          `,
          [id]
        );

      if (!rows[0]) {
        return response.status(404).json({
          error:
            'Convocatoria no encontrada.'
        });
      }

      response.json({
        data: rows[0]
      });
    } catch (error) {
      next(error);
    }
  }
);

/*
|--------------------------------------------------------------------------
| CREAR CONVOCATORIA
|--------------------------------------------------------------------------
*/

convocatoriasRouter.post(
  '/',
  async (request, response, next) => {
    const payload =
      validateConvocatoria(
        request.body
      );

    if (payload.error) {
      return response.status(400).json(
        payload
      );
    }

    try {
      const {
        titulo,
        cargo,
        descripcion,
        requisitos,
        fecha_publicacion,
        fecha_cierre
      } = payload.values;

      const [result] =
        await pool.execute(
          `
          INSERT INTO convocatoria
          (
            titulo,
            cargo,
            descripcion,
            requisitos,
            fecha_publicacion,
            fecha_cierre,
            estado
          )
          VALUES (?, ?, ?, ?, ?, ?, 'PUBLICADA')
          `,
          [
            titulo,
            cargo,
            descripcion,
            requisitos,
            fecha_publicacion,
            fecha_cierre
          ]
        );

      response.status(201).json({
        data: {
          id_convocatoria:
            result.insertId,

          titulo,

          cargo,

          estado:
            'PUBLICADA'
        }
      });
    } catch (error) {
      next(error);
    }
  }
);

/*
|--------------------------------------------------------------------------
| ACTUALIZAR CONVOCATORIA
|--------------------------------------------------------------------------
*/

convocatoriasRouter.patch(
  '/:id',
  async (request, response, next) => {
    try {
      const id =
        Number(request.params.id);

      if (
        !Number.isInteger(id) ||
        id < 1
      ) {
        return response.status(400).json({
          error:
            'El identificador de la convocatoria no es válido.'
        });
      }

      const [existing] =
        await pool.execute(
          `
          SELECT
            id_convocatoria
          FROM convocatoria
          WHERE id_convocatoria = ?
          LIMIT 1
          `,
          [id]
        );

      if (!existing[0]) {
        return response.status(404).json({
          error:
            'Convocatoria no encontrada.'
        });
      }

      /*
      |--------------------------------------------------------------
      | CAMBIAR SOLO ESTADO
      |--------------------------------------------------------------
      */

      if (
        request.body.estado &&
        Object.keys(request.body).length === 1
      ) {
        const estado =
          request.body.estado
            .toString()
            .trim()
            .toUpperCase();

        if (!STATES.includes(estado)) {
          return response.status(400).json({
            error:
              `Estado inválido. Use: ${STATES.join(', ')}.`
          });
        }

        await pool.execute(
          `
          UPDATE convocatoria
          SET estado = ?
          WHERE id_convocatoria = ?
          `,
          [
            estado,
            id
          ]
        );

        return response.json({
          data: {
            id_convocatoria: id,
            estado
          }
        });
      }

      /*
      |--------------------------------------------------------------
      | ACTUALIZAR INFORMACIÓN COMPLETA
      |--------------------------------------------------------------
      */

      const payload =
        validateConvocatoria(
          request.body
        );

      if (payload.error) {
        return response.status(400).json(
          payload
        );
      }

      const {
        titulo,
        cargo,
        descripcion,
        requisitos,
        fecha_publicacion,
        fecha_cierre
      } = payload.values;

      await pool.execute(
        `
        UPDATE convocatoria
        SET
          titulo = ?,
          cargo = ?,
          descripcion = ?,
          requisitos = ?,
          fecha_publicacion = ?,
          fecha_cierre = ?
        WHERE id_convocatoria = ?
        `,
        [
          titulo,
          cargo,
          descripcion,
          requisitos,
          fecha_publicacion,
          fecha_cierre,
          id
        ]
      );

      response.json({
        data: {
          id_convocatoria: id,
          titulo,
          cargo,
          descripcion,
          requisitos,
          fecha_publicacion,
          fecha_cierre
        }
      });
    } catch (error) {
      next(error);
    }
  }
);