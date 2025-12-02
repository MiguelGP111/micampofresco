import express from 'express';
import UsuarioControlador from '../controlador/UsuarioEditControlador.js';

const router = express.Router();

// Actualizar cuenta (correo, celular, contraseña)
router.put('/actualizar', UsuarioControlador.actualizarCuenta);

// Eliminar cuenta
router.delete('/eliminar', UsuarioControlador.eliminarCuenta);

export default router;