import { Router } from 'express';
import LoginVendedorControlador from '../controlador/LoginVendedorControlador.js';

const router = Router();

// 🔹 Login
router.post('/login', LoginVendedorControlador.login);
// 🔹 Solicitar recuperación de contraseña
router.post('/recuperar', LoginVendedorControlador.solicitarRecuperacion);
// 🔹 Cambiar contraseña
router.post('/cambiar', LoginVendedorControlador.cambiarContrasena);

export default router;
