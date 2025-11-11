import express from 'express';
import * as authController from '../Controlador/authController.js';
import { authMiddleware } from '../Middleware/authMiddleware.js';

const router = express.Router();

/**
 * Rutas de Autenticación
 * Todas las rutas están prefijadas con /auth
 */

// Rutas públicas (no requieren autenticación)
// POST /auth/registro - Registrar nuevo usuario
router.post('/registro', authController.registrar);

// POST /auth/login - Iniciar sesión
router.post('/login', authController.login);

// POST /auth/recuperar - Solicitar recuperación de contraseña
router.post('/recuperar', authController.recuperarPassword);

// POST /auth/restablecer - Restablecer contraseña
router.post('/restablecer', authController.restablecerPassword);

// Rutas protegidas (requieren autenticación JWT)
// POST /auth/logout - Cerrar sesión
router.post('/logout', authMiddleware, authController.logout);

// GET /auth/usuarios - Listar usuarios (para pruebas en Postman)
router.get('/usuarios', authMiddleware, authController.listarUsuarios);

export default router;



