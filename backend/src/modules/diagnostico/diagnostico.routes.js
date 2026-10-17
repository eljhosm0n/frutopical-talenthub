import { Router } from 'express';
import { pool } from '../../config/database.js';

const router = Router();

// Endpoint para obtener identidad corporativa y matriz DOFA
router.get('/info', async (req, res) => {
  try {
    const [dofa] = await pool.query('SELECT * FROM diagnostico_dofa ORDER BY tipo, id');

    const empresaInfo = {
      razonSocial: 'Frutas Del Atlántico S.A.S.',
      nombreComercial: 'Frutopical',
      nit: '900.999.999-1',
      representanteLegal: 'Samy Dariany Rodríguez Seña',
      municipio: 'Sabanagrande, Atlántico',
      direccion: 'Carrera 2A 20-35',
      telefono: '3246064388',
      correo: 'frutopical.sas@gmail.com',
      ciiu: '1030 (Elaboración de productos de frutas y derivados)',
      sector: 'Agroindustrial',
      colaboradores: 18,
      slogan: 'Sabor natural que nutre tu vida',
      mision: 'FRUTOPICAL S.A.S. produce y comercializa frutas tropicales y sus derivados, ofreciendo productos de calidad mediante procesos eficientes, un equipo humano comprometido y el uso de tecnologías que contribuyen a la satisfacción de clientes, el desarrollo sostenible y el crecimiento organizacional.',
      vision: 'Para el año 2030, FRUTOPICAL S.A.S. será reconocida como una empresa referente del sector agroindustrial por la calidad de sus productos, la innovación de sus procesos y la implementación de soluciones digitales que fortalezcan la gestión del talento humano y el servicio al cliente.',
      valores: [
        { nombre: 'Integridad', desc: 'Honestidad, ética y responsabilidad cumpliendo la normatividad.' },
        { nombre: 'Compromiso', desc: 'Sentido de pertenencia, disciplina y orientación al logro.' },
        { nombre: 'Trabajo en Equipo', desc: 'Colaboración, respeto y comunicación efectiva.' },
        { nombre: 'Innovación', desc: 'Uso de herramientas digitales, creatividad y mejora continua.' },
        { nombre: 'Calidad y Servicio', desc: 'Atención oportuna, amable y orientada a la excelencia.' }
      ]
    };

    return res.json({
      ok: true,
      data: {
        empresa: empresaInfo,
        dofa: dofa || []
      }
    });
  } catch (error) {
    console.error('Error en /diagnostico/info:', error);
    return res.status(500).json({
      ok: false,
      mensaje: 'Error interno en la base de datos al consultar diagnóstico.'
    });
  }
});

export default router;