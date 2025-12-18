const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'tu_clave_secreta_muy_segura';

const authMiddleware = (req, res, next) => {
  try {
    // Obtener el token del header
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Token no proporcionado' });
    }

    const token = authHeader.substring(7); // Remover "Bearer "

    // Verificar el token
    const decoded = jwt.verify(token, JWT_SECRET);
    
    // Agregar el userId al request para uso posterior
    req.userId = decoded.userId;
    req.userRole = decoded.rol;
    
    next();
  } catch (error) {
    console.error('Error en autenticación:', error);
    return res.status(401).json({ error: 'Token inválido o expirado' });
  }
};

module.exports = authMiddleware;
