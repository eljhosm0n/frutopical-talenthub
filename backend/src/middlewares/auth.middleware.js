import jwt from 'jsonwebtoken';

/**
 * Middleware para verificar el token JWT.
 *
 * El token debe enviarse en el encabezado:
 * Authorization: Bearer <token>
 */
export function authenticateToken(req, res, next) {
  try {
    const authorization = req.headers.authorization;

    // Verificar que exista el encabezado Authorization
    if (!authorization) {
      return res.status(401).json({
        ok: false,
        mensaje: 'Acceso no autorizado. Debe iniciar sesión.'
      });
    }

    // Verificar formato "Bearer token"
    const [type, token] = authorization.split(' ');

    if (type !== 'Bearer' || !token) {
      return res.status(401).json({
        ok: false,
        mensaje: 'Formato de autorización inválido.'
      });
    }

    // Verificar y decodificar el token
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    // Guardamos la información del usuario
    // para que las siguientes rutas puedan utilizarla.
    req.user = decoded;

    next();
  } catch (error) {
    console.error('Error de autenticación:', error.message);

    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        ok: false,
        mensaje: 'La sesión ha expirado. Inicie sesión nuevamente.'
      });
    }

    return res.status(401).json({
      ok: false,
      mensaje: 'Token inválido o no autorizado.'
    });
  }
}

/**
 * Middleware para restringir el acceso según el rol.
 *
 * Ejemplo:
 * requireRole('Administrador RH')
 */
export function requireRole(...rolesPermitidos) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        ok: false,
        mensaje: 'Debe iniciar sesión para acceder a este recurso.'
      });
    }

    if (!rolesPermitidos.includes(req.user.rol)) {
      return res.status(403).json({
        ok: false,
        mensaje: 'No tiene permisos para realizar esta acción.'
      });
    }

    next();
  };
}