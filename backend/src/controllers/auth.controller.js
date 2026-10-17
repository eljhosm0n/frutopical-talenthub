import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { pool } from '../config/database.js';

export async function login(req, res) {
  try {
    const { usuario, password } = req.body;

    if (!usuario || !password) {
      return res.status(400).json({
        ok: false,
        mensaje: 'Usuario y contraseña son obligatorios.'
      });
    }

    const [rows] = await pool.execute(
      `
      SELECT
        u.id_usuario,
        u.nombre,
        u.apellido,
        u.usuario,
        u.password,
        u.estado,
        r.id_rol,
        r.nombre AS rol
      FROM usuario u
      INNER JOIN rol r ON u.id_rol = r.id_rol
      WHERE u.usuario = ?
      LIMIT 1
      `,
      [usuario]
    );

    if (rows.length === 0) {
      return res.status(401).json({
        ok: false,
        mensaje: 'Usuario o contraseña incorrectos.'
      });
    }

    const user = rows[0];

    if (!user.estado) {
      return res.status(403).json({
        ok: false,
        mensaje: 'El usuario se encuentra inactivo.'
      });
    }

    const passwordCorrecta = await bcrypt.compare(
      password,
      user.password
    );

    if (!passwordCorrecta) {
      return res.status(401).json({
        ok: false,
        mensaje: 'Usuario o contraseña incorrectos.'
      });
    }

    const token = jwt.sign(
      {
        id_usuario: user.id_usuario,
        usuario: user.usuario,
        rol: user.rol
      },
      process.env.JWT_SECRET,
      { expiresIn: '2h' }
    );

    return res.json({
      ok: true,
      mensaje: 'Inicio de sesión exitoso.',
      token,
      usuario: {
        id_usuario: user.id_usuario,
        nombre: user.nombre,
        apellido: user.apellido,
        usuario: user.usuario,
        rol: user.rol
      }
    });
  } catch (error) {
    console.error('Error en login:', error);

    return res.status(500).json({
      ok: false,
      mensaje: 'Error interno del servidor.'
    });
  }
}