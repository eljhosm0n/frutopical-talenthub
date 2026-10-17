import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import crypto from 'crypto';

import { pool } from '../../config/database.js';

const router = express.Router();

/*
|--------------------------------------------------------------------------
| CONFIGURACIÓN DE MULTER
|--------------------------------------------------------------------------
*/

const uploadsDir = path.join(
  process.cwd(),
  'uploads'
);

if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, {
    recursive: true
  });
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, uploadsDir);
  },

  filename: (_req, file, cb) => {
    const extension = path.extname(
      file.originalname
    );

    const nombreUnico =
      `${Date.now()}-${crypto.randomUUID()}${extension}`;

    cb(null, nombreUnico);
  }
});

const upload = multer({
  storage,

  limits: {
    fileSize: 10 * 1024 * 1024
  }
});

/*
|--------------------------------------------------------------------------
| GET /api/v1/expedientes
|--------------------------------------------------------------------------
| Consulta todos los expedientes junto con
| la información básica del empleado.
|--------------------------------------------------------------------------
*/

router.get('/', async (_req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT
        e.id_expediente,
        e.id_empleado,
        emp.tipo_documento,
        emp.numero_documento,
        emp.nombres,
        emp.apellidos,
        emp.correo,
        emp.cargo,
        emp.fecha_ingreso,
        emp.estado
      FROM expediente e
      INNER JOIN empleado emp
        ON emp.id_empleado = e.id_empleado
      ORDER BY
        emp.apellidos ASC,
        emp.nombres ASC
    `);

    return res.json({
      data: rows
    });
  } catch (error) {
    console.error(
      'Error consultando expedientes:',
      error
    );

    return res.status(500).json({
      error:
        'No fue posible consultar los expedientes.'
    });
  }
});

/*
|--------------------------------------------------------------------------
| GET /api/v1/expedientes/documentos/:id_archivo/descargar
|--------------------------------------------------------------------------
| Descarga un documento almacenado en el expediente.
|--------------------------------------------------------------------------
*/

router.get(
  '/documentos/:id_archivo/descargar',
  async (req, res) => {
    try {
      const { id_archivo } = req.params;

      const [rows] = await pool.query(
        `
        SELECT
          id_archivo,
          nombre_original,
          ruta_archivo,
          tipo_mime
        FROM archivo
        WHERE id_archivo = ?
          AND estado = 1
        LIMIT 1
        `,
        [id_archivo]
      );

      if (!rows.length) {
        return res.status(404).json({
          error:
            'El documento no existe.'
        });
      }

      const archivo = rows[0];

      const rutaCompleta = path.resolve(
        process.cwd(),
        archivo.ruta_archivo
      );

      if (!fs.existsSync(rutaCompleta)) {
        return res.status(404).json({
          error:
            'El archivo no se encuentra en el servidor.'
        });
      }

      return res.download(
        rutaCompleta,
        archivo.nombre_original,
        (error) => {
          if (error && !res.headersSent) {
            console.error(
              'Error descargando archivo:',
              error
            );

            return res.status(500).json({
              error:
                'No fue posible descargar el documento.'
            });
          }
        }
      );
    } catch (error) {
      console.error(
        'Error en descarga de documento:',
        error
      );

      return res.status(500).json({
        error:
          'Error interno al descargar el documento.'
      });
    }
  }
);

/*
|--------------------------------------------------------------------------
| GET /api/v1/expedientes/:id
|--------------------------------------------------------------------------
| Consulta un expediente específico.
|--------------------------------------------------------------------------
*/

router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const [rows] = await pool.query(
      `
      SELECT
        e.id_expediente,
        e.id_empleado,
        emp.tipo_documento,
        emp.numero_documento,
        emp.nombres,
        emp.apellidos,
        emp.correo,
        emp.cargo,
        emp.fecha_ingreso,
        emp.estado
      FROM expediente e
      INNER JOIN empleado emp
        ON emp.id_empleado = e.id_empleado
      WHERE e.id_expediente = ?
      LIMIT 1
      `,
      [id]
    );

    if (!rows.length) {
      return res.status(404).json({
        error:
          'El expediente no existe.'
      });
    }

    return res.json({
      data: rows[0]
    });
  } catch (error) {
    console.error(
      'Error consultando expediente:',
      error
    );

    return res.status(500).json({
      error:
        'No fue posible consultar el expediente.'
    });
  }
});

/*
|--------------------------------------------------------------------------
| POST /api/v1/expedientes
|--------------------------------------------------------------------------
| Crea un expediente para un empleado.
|--------------------------------------------------------------------------
*/

router.post('/', async (req, res) => {
  const connection =
    await pool.getConnection();

  try {
    const {
      id_empleado
    } = req.body;

    if (!id_empleado) {
      return res.status(400).json({
        error:
          'El id_empleado es obligatorio.'
      });
    }

    const [empleados] =
      await connection.query(
        `
        SELECT id_empleado
        FROM empleado
        WHERE id_empleado = ?
        LIMIT 1
        `,
        [id_empleado]
      );

    if (!empleados.length) {
      return res.status(404).json({
        error:
          'El empleado no existe.'
      });
    }

    const [existentes] =
      await connection.query(
        `
        SELECT id_expediente
        FROM expediente
        WHERE id_empleado = ?
        LIMIT 1
        `,
        [id_empleado]
      );

    if (existentes.length) {
      return res.status(409).json({
        error:
          'El empleado ya tiene un expediente.'
      });
    }

    const [result] =
      await connection.query(
        `
        INSERT INTO expediente
        (
          id_empleado
        )
        VALUES (?)
        `,
        [id_empleado]
      );

    return res.status(201).json({
      message:
        'Expediente creado correctamente.',
      data: {
        id_expediente:
          result.insertId,
        id_empleado
      }
    });
  } catch (error) {
    console.error(
      'Error creando expediente:',
      error
    );

    return res.status(500).json({
      error:
        'No fue posible crear el expediente.'
    });
  } finally {
    connection.release();
  }
});

/*
|--------------------------------------------------------------------------
| GET /api/v1/expedientes/:id/documentos
|--------------------------------------------------------------------------
| Consulta los documentos asociados a un expediente.
|--------------------------------------------------------------------------
*/

router.get(
  '/:id/documentos',
  async (req, res) => {
    try {
      const {
        id
      } = req.params;

      const [rows] = await pool.query(
        `
        SELECT
          ea.id_expediente,
          ea.id_archivo,
          ea.tipo_documento,
          ea.categoria,
          a.nombre_original,
          a.nombre_guardado,
          a.ruta_archivo,
          a.tipo_mime,
          a.tamano,
          a.fecha_carga,
          a.estado AS estado_archivo
        FROM expediente_archivo ea
        INNER JOIN archivo a
          ON a.id_archivo = ea.id_archivo
        WHERE ea.id_expediente = ?
          AND a.estado = 1
        ORDER BY
          a.fecha_carga DESC
        `,
        [id]
      );

      return res.json({
        data: rows
      });
    } catch (error) {
      console.error(
        'Error consultando documentos:',
        error
      );

      return res.status(500).json({
        error:
          'No fue posible consultar los documentos.'
      });
    }
  }
);

/*
|--------------------------------------------------------------------------
| POST /api/v1/expedientes/:id/documentos
|--------------------------------------------------------------------------
| Sube un documento y lo asocia al expediente.
|--------------------------------------------------------------------------
*/

router.post(
  '/:id/documentos',
  upload.single('archivo'),
  async (req, res) => {
    const connection =
      await pool.getConnection();

    try {
      const {
        id
      } = req.params;

      const {
        tipo_documento,
        categoria,
        id_usuario
      } = req.body;

      if (!req.file) {
        return res.status(400).json({
          error:
            'Debe seleccionar un archivo.'
        });
      }

      if (!tipo_documento) {
        fs.unlinkSync(
          req.file.path
        );

        return res.status(400).json({
          error:
            'El tipo_documento es obligatorio.'
        });
      }

      if (!categoria) {
        fs.unlinkSync(
          req.file.path
        );

        return res.status(400).json({
          error:
            'La categoria es obligatoria.'
        });
      }

      if (!id_usuario) {
        fs.unlinkSync(
          req.file.path
        );

        return res.status(400).json({
          error:
            'El id_usuario es obligatorio.'
        });
      }

      const categoriasPermitidas = [
        'CV',
        'Contrato',
        'Afiliaciones',
        'Vinculación',
        'SST',
        'EPP',
        'Otros'
      ];

      if (
        !categoriasPermitidas.includes(
          categoria
        )
      ) {
        fs.unlinkSync(
          req.file.path
        );

        return res.status(400).json({
          error:
            'La categoría indicada no es válida.'
        });
      }

      const [expedientes] =
        await connection.query(
          `
          SELECT id_expediente
          FROM expediente
          WHERE id_expediente = ?
          LIMIT 1
          `,
          [id]
        );

      if (!expedientes.length) {
        fs.unlinkSync(
          req.file.path
        );

        return res.status(404).json({
          error:
            'El expediente no existe.'
        });
      }

      const [usuarios] =
        await connection.query(
          `
          SELECT id_usuario
          FROM usuario
          WHERE id_usuario = ?
          LIMIT 1
          `,
          [id_usuario]
        );

      if (!usuarios.length) {
        fs.unlinkSync(
          req.file.path
        );

        return res.status(404).json({
          error:
            'El usuario indicado no existe.'
        });
      }

      const rutaArchivo =
        path.relative(
          process.cwd(),
          req.file.path
        ).replaceAll('\\', '/');

      await connection.beginTransaction();

      const [archivoResult] =
        await connection.query(
          `
          INSERT INTO archivo
          (
            nombre_original,
            nombre_guardado,
            ruta_archivo,
            tipo_mime,
            tamano,
            id_usuario
          )
          VALUES (?, ?, ?, ?, ?, ?)
          `,
          [
            req.file.originalname,
            req.file.filename,
            rutaArchivo,
            req.file.mimetype,
            req.file.size,
            id_usuario
          ]
        );

      const id_archivo =
        archivoResult.insertId;

      await connection.query(
        `
        INSERT INTO expediente_archivo
        (
          id_expediente,
          id_archivo,
          tipo_documento,
          categoria
        )
        VALUES (?, ?, ?, ?)
        `,
        [
          id,
          id_archivo,
          tipo_documento,
          categoria
        ]
      );

      await connection.commit();

      return res.status(201).json({
        message:
          'Documento subido y asociado al expediente correctamente.',
        data: {
          id_expediente:
            Number(id),
          id_archivo,
          nombre_original:
            req.file.originalname,
          nombre_guardado:
            req.file.filename,
          tipo_documento,
          categoria,
          tipo_mime:
            req.file.mimetype,
          tamano:
            req.file.size,
          ruta_archivo:
            rutaArchivo
        }
      });
    } catch (error) {
      await connection.rollback();

      if (
        req.file &&
        fs.existsSync(req.file.path)
      ) {
        fs.unlinkSync(
          req.file.path
        );
      }

      console.error(
        'Error subiendo documento:',
        error
      );

      return res.status(500).json({
        error:
          'No fue posible subir el documento.'
      });
    } finally {
      connection.release();
    }
  }
);

export const expedientesRouter =
  router;