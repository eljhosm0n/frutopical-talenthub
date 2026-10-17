import { Router } from 'express';
import { pool } from '../../config/database.js';

const router = Router();

// ==================================================
// 1. LISTAR TODAS LAS POSTULACIONES (A PRUEBA DE COLUMNAS)
// ==================================================
router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT 
        p.*,
        COALESCE(p.candidato, CONCAT(COALESCE(p.nombres, ''), ' ', COALESCE(p.apellidos, ''))) AS nombre_completo,
        c.titulo AS convocatoria,
        c.cargo
      FROM postulaciones p
      LEFT JOIN convocatorias c ON p.id_convocatoria = c.id_convocatoria
      ORDER BY p.id_postulacion DESC
    `);

    // Aseguramos que el campo candidato siempre exista para el frontend
    const adaptadas = rows.map((item) => ({
      ...item,
      candidato: item.candidato || item.nombre_completo?.trim() || item.nombre || 'Candidato postulado'
    }));

    return res.json({
      ok: true,
      data: adaptadas
    });
  } catch (error) {
    console.error('Error detallado al listar postulaciones:', error.message);
    
    // Si la tabla convocatorias o algún campo falla, hacemos un SELECT directo a la tabla
    try {
      const [fallbackRows] = await pool.query(`SELECT * FROM postulaciones ORDER BY id_postulacion DESC`);
      return res.json({
        ok: true,
        data: fallbackRows
      });
    } catch (fallbackError) {
      console.error('Fallo total consultando postulaciones:', fallbackError.message);
      return res.status(500).json({
        ok: false,
        error: fallbackError.message
      });
    }
  }
});

// ==================================================
// 2. REGISTRAR UNA POSTULACIÓN (DESDE LA LANDING PÚBLICA)
// ==================================================
router.post('/', async (req, res) => {
  try {
    const {
      id_convocatoria,
      tipo_documento,
      numero_documento,
      nombres,
      apellidos,
      correo,
      telefono,
      ciudad
    } = req.body;

    if (!id_convocatoria || !numero_documento || !nombres || !apellidos || !correo) {
      return res.status(400).json({
        ok: false,
        error: 'Todos los campos obligatorios deben ser diligenciados.'
      });
    }

    const [result] = await pool.query(
      `INSERT INTO postulaciones 
        (id_convocatoria, tipo_documento, numero_documento, nombres, apellidos, correo, telefono, ciudad, estado, observacion)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'RECIBIDA', 'Postulación radicada a través del portal público.')`,
      [
        id_convocatoria,
        tipo_documento || 'CC',
        numero_documento,
        nombres,
        apellidos,
        correo,
        telefono || '',
        ciudad || 'Sabanagrande'
      ]
    );

    return res.status(201).json({
      ok: true,
      mensaje: 'Postulación registrada con éxito.',
      data: {
        id_postulacion: result.insertId,
        estado: 'RECIBIDA'
      }
    });
  } catch (error) {
    console.error('Error al registrar postulación:', error);
    return res.status(500).json({
      ok: false,
      error: 'Error interno en el servidor al registrar la postulación.'
    });
  }
});

// ==================================================
// 3. EVALUACIÓN DE CANDIDATO CON MATRIZ PONDERADA SENA
// ==================================================
router.patch('/:id/estado', async (req, res) => {
  try {
    const { id } = req.params;
    const {
      estado,
      observacion,
      puntaje_tecnico,
      puntaje_entrevista,
      puntaje_hv,
      puntaje_total
    } = req.body;

    if (!estado) {
      return res.status(400).json({
        ok: false,
        error: 'El estado del aspirante es obligatorio.'
      });
    }

    // Si viene la calificación de la matriz técnica del Equipo 2, estructuramos la auditoría
    const detalleAuditoria = puntaje_total !== undefined
      ? `[MATRIZ TÉCNICA SENA] Nota Final: ${puntaje_total}/100 pts (Prueba Técnica: ${puntaje_tecnico || 0}%, Entrevista: ${puntaje_entrevista || 0}%, HV/Exp: ${puntaje_hv || 0}%). Observación: ${observacion || 'Sin comentarios adicionales.'}`
      : (observacion || '');

    const [result] = await pool.query(
      `UPDATE postulaciones 
       SET estado = ?, observacion = ? 
       WHERE id_postulacion = ?`,
      [estado, detalleAuditoria, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        ok: false,
        error: 'La postulación solicitada no existe.'
      });
    }

    return res.json({
      ok: true,
      message: 'Evaluación y estado de postulación actualizados con éxito.',
      data: {
        id_postulacion: Number(id),
        estado,
        observacion: detalleAuditoria
      }
    });
  } catch (error) {
    console.error('Error actualizando postulación:', error);
    return res.status(500).json({
      ok: false,
      error: 'Error interno en la base de datos al evaluar candidato.'
    });
  }
});
export { router as postulacionesRouter };
export default router;