// src/routes/inventoryRoutes.js
import { Router } from 'express';
import InventarioVendedorControlador from '../controlador/InventarioVendedorControlador.js';
import { verificarToken } from '../configuracion/AuthMiddleware.js'; // ✅ Middleware de JWT

const router = Router();

// 🔹 Todas las rutas protegidas con JWT
router.get('/', verificarToken, InventarioVendedorControlador.listarInventario);
router.get('/:id', verificarToken, InventarioVendedorControlador.obtenerInventarId);
router.post('/crear', verificarToken, InventarioVendedorControlador.crearInventario);
router.put('/:id', verificarToken, InventarioVendedorControlador.actualizarInventario);
router.delete('/:id', verificarToken, InventarioVendedorControlador.eliminarInventario);

export default router;
