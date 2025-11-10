import { Router } from 'express';
import LoginAgricultorControlador from '../controlador/LoginAgricultorControlador.js';

const router = Router();

// 🔹 Login
router.post('/login', LoginAgricultorControlador.login);
// 🔹 Solicitar recuperación de contraseña
router.post('/recuperar', LoginAgricultorControlador.solicitarRecuperacion);
// 🔹 Cambiar contraseña
router.post('/cambiar', LoginAgricultorControlador.cambiarContrasena);

export default router;
