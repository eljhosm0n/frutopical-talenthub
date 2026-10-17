import { Router } from 'express';
import { pool } from '../../config/database.js';

const router = Router();

// 1. Listar entregas de EPP
router.get('/epp', async (req, res) => {
  try {
    const [entregas] = await pool.query(`
      SELECT * FROM sst_entregas_epp 
      ORDER BY fecha_entrega DESC
    `);
    return res.json({ ok: true, data: entregas });
  } catch (error) {
    console.error('Error al listar EPP:', error);
    return res.status(500).json({ ok: false, mensaje: 'Error al consultar entregas de EPP.' });
  }
});

// 2. Registrar entrega de EPP
router.post('/epp', async (req, res) => {
  try {
    const { empleado_id, elemento_epp, talla_especificacion, cantidad, fecha_entrega, estado_elemento, observaciones } = req.body;
    
    if (!elemento_epp || !fecha_entrega) {
      return res.status(400).json({ ok: false, mensaje: 'El elemento EPP y la fecha son obligatorios.' });
    }

    const [result] = await pool.query(
      `INSERT INTO sst_entregas_epp (empleado_id, elemento_epp, talla_especificacion, cantidad, fecha_entrega, estado_elemento, observaciones)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [empleado_id || 1, elemento_epp, talla_especificacion || 'Estándar', cantidad || 1, fecha_entrega, estado_elemento || 'NUEVO', observaciones || '']
    );

    return res.status(201).json({ ok: true, mensaje: 'Entrega de EPP guardada correctamente.', id: result.insertId });
  } catch (error) {
    console.error('Error guardando EPP:', error);
    return res.status(500).json({ ok: false, mensaje: 'Error al registrar entrega de EPP.' });
  }
});

// 3. Listar inducciones
router.get('/inducciones', async (req, res) => {
  try {
    const [inducciones] = await pool.query(`
      SELECT * FROM sst_inducciones 
      ORDER BY fecha_induccion DESC
    `);
    return res.json({ ok: true, data: inducciones });
  } catch (error) {
    console.error('Error al listar inducciones:', error);
    return res.status(500).json({ ok: false, mensaje: 'Error al consultar inducciones.' });
  }
});

// 4. Registrar inducción
router.post('/inducciones', async (req, res) => {
  try {
    const { empleado_id, fecha_induccion, temas_cubiertos, evaluacion_puntaje, estado_induccion, instructor_responsable } = req.body;

    if (!fecha_induccion || !temas_cubiertos || !instructor_responsable) {
      return res.status(400).json({ ok: false, mensaje: 'Fecha, temas y responsable son obligatorios.' });
    }

    const [result] = await pool.query(
      `INSERT INTO sst_inducciones (empleado_id, fecha_induccion, temas_cubiertos, evaluacion_puntaje, estado_induccion, instructor_responsable)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [empleado_id || 1, fecha_induccion, temas_cubiertos, evaluacion_puntaje || 100.00, estado_induccion || 'APROBADA', instructor_responsable]
    );

    return res.status(201).json({ ok: true, mensaje: 'Inducción registrada con éxito.', id: result.insertId });
  } catch (error) {
    console.error('Error guardando inducción:', error);
    return res.status(500).json({ ok: false, mensaje: 'Error al registrar inducción.' });
  }
});

export default router;