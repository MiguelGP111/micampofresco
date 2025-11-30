// src/routes/devolucionRoutes.js
import { Router } from 'express';
import DevolucionVendedorControlador from '../controlador/DevolucionVendedorControlador.js';

const router = Router();

// Listar devoluciones por usuario
router.get('/', DevolucionVendedorControlador.listarDevoluciones);
// Obtener devolución por ID
router.get('/:id', DevolucionVendedorControlador.obtenerDevolucionId);
// Crear devolución
router.post('/crear', DevolucionVendedorControlador.crearDevolucion);
// Actualizar devolución
router.put('/:id', DevolucionVendedorControlador.actualizarDevolucion);
// Eliminar devolución
router.delete('/:id', DevolucionVendedorControlador.eliminarDevolucion);

export default router;
