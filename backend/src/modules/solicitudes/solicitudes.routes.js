import express from 'express';
import { pool } from '../../config/database.js';

const router = express.Router();

/*
  GET /api/v1/solicitudes

  Consulta todas las solicitudes internas.
*/
router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT
        si.id_solicitud,
        si.numero_solicitud,
        si.fecha,
        si.id_empleado,
        CONCAT(e.nombres, ' ', e.apellidos) AS nombre_empleado,
        e.numero_documento,
        e.correo AS correo_empleado,
        ts.nombre AS tipo_solicitud,
        es.nombre AS estado,
        si.descripcion,
        si.id_responsable,
        si.fecha_respuesta,
        si.respuesta_observacion
      FROM solicitud_interna si
      INNER JOIN empleado e
        ON e.id_empleado = si.id_empleado
      INNER JOIN tipo_solicitud ts
        ON ts.id_tipo_solicitud = si.id_tipo_solicitud
      INNER JOIN estado_solicitud es
        ON es.id_estado_solicitud = si.id_estado_solicitud
      ORDER BY si.fecha DESC
    `);

    return res.json({
      data: rows
    });
  } catch (error) {
    console.error('Error consultando solicitudes:', error);

    return res.status(500).json({
      error: 'No fue posible consultar las solicitudes.'
    });
  }
});


/*
  POST /api/v1/solicitudes

  Crea una nueva solicitud de certificado laboral.
*/
router.post('/', async (req, res) => {
  const {
    id_empleado,
    id_responsable,
    descripcion
  } = req.body;

  if (!id_empleado) {
    return res.status(400).json({
      error: 'El empleado es obligatorio.'
    });
  }

  if (!descripcion) {
    return res.status(400).json({
      error: 'La descripción de la solicitud es obligatoria.'
    });
  }

  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    // Verificar empleado
    const [empleados] = await connection.query(
      `
      SELECT
        id_empleado,
        nombres,
        apellidos,
        correo
      FROM empleado
      WHERE id_empleado = ?
      LIMIT 1
      `,
      [id_empleado]
    );

    if (empleados.length === 0) {
      await connection.rollback();

      return res.status(404).json({
        error: 'El empleado no existe.'
      });
    }

    // Buscar tipo CERTIFICADO LABORAL
    const [tipos] = await connection.query(
      `
      SELECT
        id_tipo_solicitud,
        nombre
      FROM tipo_solicitud
      WHERE nombre = 'CERTIFICADO LABORAL'
      LIMIT 1
      `
    );

    if (tipos.length === 0) {
      await connection.rollback();

      return res.status(400).json({
        error: 'No existe el tipo de solicitud CERTIFICADO LABORAL.'
      });
    }

    // Buscar estado RECIBIDA
    const [estados] = await connection.query(
      `
      SELECT
        id_estado_solicitud,
        nombre
      FROM estado_solicitud
      WHERE nombre = 'RECIBIDA'
      LIMIT 1
      `
    );

    if (estados.length === 0) {
      await connection.rollback();

      return res.status(400).json({
        error: 'No existe el estado RECIBIDA.'
      });
    }

    // Verificar responsable si fue enviado
    if (id_responsable) {
      const [usuarios] = await connection.query(
        `
        SELECT id_usuario
        FROM usuario
        WHERE id_usuario = ?
        LIMIT 1
        `,
        [id_responsable]
      );

      if (usuarios.length === 0) {
        await connection.rollback();

        return res.status(404).json({
          error: 'El usuario responsable no existe.'
        });
      }
    }

    /*
      Generar número de solicitud.
      Ejemplo: SOL-2026-0001
    */
    const [ultimaSolicitud] = await connection.query(
      `
      SELECT numero_solicitud
      FROM solicitud_interna
      ORDER BY id_solicitud DESC
      LIMIT 1
      `
    );

    let consecutivo = 1;

    if (ultimaSolicitud.length > 0) {
      const ultimoNumero = ultimaSolicitud[0].numero_solicitud;
      const partes = ultimoNumero.split('-');
      const ultimoConsecutivo = Number(partes[partes.length - 1]);

      if (!Number.isNaN(ultimoConsecutivo)) {
        consecutivo = ultimoConsecutivo + 1;
      }
    }

    const anio = new Date().getFullYear();

    const numeroSolicitud =
      `SOL-${anio}-${String(consecutivo).padStart(4, '0')}`;

    const [result] = await connection.query(
      `
      INSERT INTO solicitud_interna
      (
        numero_solicitud,
        id_empleado,
        id_tipo_solicitud,
        descripcion,
        id_responsable,
        id_estado_solicitud
      )
      VALUES (?, ?, ?, ?, ?, ?)
      `,
      [
        numeroSolicitud,
        id_empleado,
        tipos[0].id_tipo_solicitud,
        descripcion,
        id_responsable ?? null,
        estados[0].id_estado_solicitud
      ]
    );

    await connection.commit();

    return res.status(201).json({
      message: 'Solicitud creada correctamente.',
      data: {
        id_solicitud: result.insertId,
        numero_solicitud: numeroSolicitud,
        id_empleado,
        tipo_solicitud: 'CERTIFICADO LABORAL',
        estado: 'RECIBIDA'
      }
    });
  } catch (error) {
    await connection.rollback();

    console.error('Error creando solicitud:', error);

    return res.status(500).json({
      error: 'No fue posible crear la solicitud.'
    });
  } finally {
    connection.release();
  }
});


/*
  PATCH /api/v1/solicitudes/:id/estado

  Actualiza el estado de una solicitud.
*/
router.patch('/:id/estado', async (req, res) => {
  const { id } = req.params;

  const {
    estado,
    respuesta_observacion = null
  } = req.body;

  const estadosPermitidos = [
    'RECIBIDA',
    'EN PROCESO',
    'ATENDIDA',
    'CERRADA'
  ];

  if (!estado) {
    return res.status(400).json({
      error: 'El estado es obligatorio.'
    });
  }

  if (!estadosPermitidos.includes(estado)) {
    return res.status(400).json({
      error: 'Estado de solicitud no válido.'
    });
  }

  try {
    // Buscar ID del estado
    const [estados] = await pool.query(
      `
      SELECT id_estado_solicitud
      FROM estado_solicitud
      WHERE nombre = ?
      LIMIT 1
      `,
      [estado]
    );

    if (estados.length === 0) {
      return res.status(400).json({
        error: 'El estado indicado no existe en la base de datos.'
      });
    }

    const idEstado = estados[0].id_estado_solicitud;

    // Verificar solicitud
    const [solicitudes] = await pool.query(
      `
      SELECT id_solicitud
      FROM solicitud_interna
      WHERE id_solicitud = ?
      LIMIT 1
      `,
      [id]
    );

    if (solicitudes.length === 0) {
      return res.status(404).json({
        error: 'La solicitud no existe.'
      });
    }

    let fechaRespuesta = null;

    if (estado === 'ATENDIDA' || estado === 'CERRADA') {
      fechaRespuesta = new Date();
    }

    await pool.query(
      `
      UPDATE solicitud_interna
      SET
        id_estado_solicitud = ?,
        respuesta_observacion = ?,
        fecha_respuesta = ?
      WHERE id_solicitud = ?
      `,
      [
        idEstado,
        respuesta_observacion,
        fechaRespuesta,
        id
      ]
    );

    return res.json({
      message: 'Solicitud actualizada correctamente.',
      data: {
        id_solicitud: Number(id),
        estado
      }
    });
  } catch (error) {
    console.error('Error actualizando solicitud:', error);

    return res.status(500).json({
      error: 'No fue posible actualizar la solicitud.'
    });
  }
});

export { router as solicitudesRouter };