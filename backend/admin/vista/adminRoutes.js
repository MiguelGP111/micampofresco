import express from 'express';
import AdminController from '../controlador/adminController.js';
import { verificarToken, verificarAdmin } from '../middleware/verificarToken.js';

const router = express.Router();

/**
 * POST /login-admin
 * Endpoint público para autenticación de administradores
 * No requiere autenticación previa
 */
router.post('/login-admin', AdminController.login);
console.log('✅ Ruta registrada: POST /api/login-admin (pública)');

/**
 * GET /admin/perfil
 * Obtener perfil del administrador autenticado
 * Requiere token JWT válido y rol de admin
 */
router.get('/admin/perfil', verificarToken, verificarAdmin, AdminController.obtenerPerfil);
console.log('✅ Ruta registrada: GET /api/admin/perfil (protegida - admin)');

export default router;