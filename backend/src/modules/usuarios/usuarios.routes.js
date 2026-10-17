import express from 'express';
import bcrypt from 'bcryptjs';
import { pool } from '../../config/database.js';
import {
  authenticateToken,
  requireRole
} from '../../middlewares/auth.middleware.js';

const router = express.Router();

/**
 * =========================================================
 * GET /api/v1/usuarios
 * Listar usuarios
 * =========================================================
 */
router.get(
  '/',
  authenticateToken,
  requireRole('Administrador RH'),
  async (_req, res) => {
    try {
      const [rows] = await pool.execute(`
        SELECT
          u.id_usuario,
          u.nombre,
          u.apellido,
          u.correo,
          u.usuario,
          u.estado,
          u.fecha_creacion,
          r.id_rol,
          r.nombre AS rol
        FROM usuario u
        INNER JOIN rol r
          ON u.id_rol = r.id_rol
        ORDER BY u.id_usuario DESC
      `);

      return res.json({
        ok: true,
        data: rows
      });
    } catch (error) {
      console.error('Error al listar usuarios:', error);

      return res.status(500).json({
        ok: false,
        mensaje: 'No fue posible consultar los usuarios.'
      });
    }
  }
);

/**
 * =========================================================
 * GET /api/v1/usuarios/roles
 * Listar roles disponibles
 * =========================================================
 */
router.get(
  '/roles',
  authenticateToken,
  requireRole('Administrador RH'),
  async (_req, res) => {
    try {
      const [rows] = await pool.execute(`
        SELECT
          id_rol,
          nombre,
          descripcion,
          estado
        FROM rol
        ORDER BY id_rol ASC
      `);

      return res.json({
        ok: true,
        data: rows
      });
    } catch (error) {
      console.error('Error al listar roles:', error);

      return res.status(500).json({
        ok: false,
        mensaje: 'No fue posible consultar los roles.'
      });
    }
  }
);

/**
 * =========================================================
 * POST /api/v1/usuarios
 * Crear usuario
 * =========================================================
 */
router.post(
  '/',
  authenticateToken,
  requireRole('Administrador RH'),
  async (req, res) => {
    try {
      const {
        nombre,
        apellido,
        correo,
        usuario,
        password,
        id_rol
      } = req.body;

      // Validaciones básicas
      if (
        !nombre ||
        !apellido ||
        !correo ||
        !usuario ||
        !password ||
        !id_rol
      ) {
        return res.status(400).json({
          ok: false,
          mensaje: 'Todos los campos son obligatorios.'
        });
      }

      if (password.length < 8) {
        return res.status(400).json({
          ok: false,
          mensaje: 'La contraseña debe tener mínimo 8 caracteres.'
        });
      }

      // Verificar que el rol exista
      const [roles] = await pool.execute(
        `
        SELECT id_rol
        FROM rol
        WHERE id_rol = ?
          AND estado = 1
        LIMIT 1
        `,
        [id_rol]
      );

      if (roles.length === 0) {
        return res.status(400).json({
          ok: false,
          mensaje: 'El rol seleccionado no existe o está inactivo.'
        });
      }

      // Verificar usuario o correo duplicado
      const [existentes] = await pool.execute(
        `
        SELECT
          id_usuario,
          usuario,
          correo
        FROM usuario
        WHERE usuario = ?
           OR correo = ?
        LIMIT 1
        `,
        [usuario, correo]
      );

      if (existentes.length > 0) {
        const existente = existentes[0];

        if (existente.usuario === usuario) {
          return res.status(409).json({
            ok: false,
            mensaje: 'El nombre de usuario ya está registrado.'
          });
        }

        return res.status(409).json({
          ok: false,
          mensaje: 'El correo electrónico ya está registrado.'
        });
      }

      // Encriptar contraseña
      const passwordHash = await bcrypt.hash(password, 10);

      const [result] = await pool.execute(
        `
        INSERT INTO usuario
        (
          nombre,
          apellido,
          correo,
          usuario,
          password,
          id_rol,
          estado
        )
        VALUES (?, ?, ?, ?, ?, ?, 1)
        `,
        [
          nombre.trim(),
          apellido.trim(),
          correo.trim(),
          usuario.trim(),
          passwordHash,
          id_rol
        ]
      );

      return res.status(201).json({
        ok: true,
        mensaje: 'Usuario creado correctamente.',
        data: {
          id_usuario: result.insertId
        }
      });
    } catch (error) {
      console.error('Error al crear usuario:', error);

      return res.status(500).json({
        ok: false,
        mensaje: 'No fue posible crear el usuario.'
      });
    }
  }
);

/**
 * =========================================================
 * PATCH /api/v1/usuarios/:id/estado
 * Activar / desactivar usuario
 * =========================================================
 */
router.patch(
  '/:id/estado',
  authenticateToken,
  requireRole('Administrador RH'),
  async (req, res) => {
    try {
      const { id } = req.params;
      const { estado } = req.body;

      if (estado !== 0 && estado !== 1) {
        return res.status(400).json({
          ok: false,
          mensaje: 'El estado debe ser 0 o 1.'
        });
      }

      // Evitar que el administrador se desactive a sí mismo
      if (Number(id) === Number(req.user.id_usuario)) {
        return res.status(400).json({
          ok: false,
          mensaje: 'No puede cambiar el estado de su propio usuario.'
        });
      }

      const [result] = await pool.execute(
        `
        UPDATE usuario
        SET estado = ?
        WHERE id_usuario = ?
        `,
        [estado, id]
      );

      if (result.affectedRows === 0) {
        return res.status(404).json({
          ok: false,
          mensaje: 'Usuario no encontrado.'
        });
      }

      return res.json({
        ok: true,
        mensaje:
          estado === 1
            ? 'Usuario activado correctamente.'
            : 'Usuario desactivado correctamente.'
      });
    } catch (error) {
      console.error('Error al cambiar estado del usuario:', error);

      return res.status(500).json({
        ok: false,
        mensaje: 'No fue posible actualizar el estado del usuario.'
      });
    }
  }
);

export default router;