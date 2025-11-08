import express from 'express';
import UsuarioController from '../controlador/usuarioController.js';
import { verificarToken, verificarAdmin } from '../middleware/verificarToken.js';

const router = express.Router();

/**
 * POST /login-usuario
 * Endpoint público para autenticación de usuarios
 * No requiere autenticación previa
 */
router.post('/login-usuario', UsuarioController.login);
console.log('✅ Ruta registrada: POST /api/usuarios/login-usuario (pública)');

// Rutas CRUD para usuarios (requieren autenticación y permisos de admin)
// GET /usuarios - Obtener todos los usuarios
router.get('/', verificarToken, verificarAdmin, UsuarioController.obtenerTodos);
console.log('✅ Ruta registrada: GET /api/usuarios (protegida - admin)');

// GET /usuarios/:id - Obtener usuario por ID
router.get('/:id', verificarToken, verificarAdmin, UsuarioController.obtenerPorId);
console.log('✅ Ruta registrada: GET /api/usuarios/:id (protegida - admin)');

// POST /usuarios - Crear nuevo usuario
router.post('/', verificarToken, verificarAdmin, UsuarioController.crear);
console.log('✅ Ruta registrada: POST /api/usuarios (protegida - admin)');

// PUT /usuarios/:id - Actualizar usuario
router.put('/:id', verificarToken, verificarAdmin, UsuarioController.actualizar);
console.log('✅ Ruta registrada: PUT /api/usuarios/:id (protegida - admin)');

// DELETE /usuarios/:id - Eliminar usuario
router.delete('/:id', verificarToken, verificarAdmin, UsuarioController.eliminar);
console.log('✅ Ruta registrada: DELETE /api/usuarios/:id (protegida - admin)');

export default router;