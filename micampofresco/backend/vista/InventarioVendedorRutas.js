// src/routes/inventoryRoutes.js
import { Router } from 'express';
import InventarioVendedorControlador from '../controlador/InventarioVendedorControlador.js';
import { verificarToken } from '../middleware/verificarToken.js'; //  Middleware de JWT
import { verificarVendedor } from '../middleware/AuthVendedor.js';

const router = Router();

//  Todas las rutas protegidas con JWT
router.get('/', verificarToken, verificarVendedor, InventarioVendedorControlador.listarInventario);
router.get('/:id', verificarToken, verificarVendedor, InventarioVendedorControlador.obtenerInventarId);
router.post('/crear', verificarToken, verificarVendedor, InventarioVendedorControlador.crearInventario);
router.put('/:id', verificarToken, verificarVendedor, InventarioVendedorControlador.actualizarInventario);
router.delete('/:id', verificarToken, verificarVendedor, InventarioVendedorControlador.eliminarInventario);

export default router;
