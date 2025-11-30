import { Router } from 'express';
import CrearProductosVendedorControlador from '../controlador/CrearProductosVendedorControlador.js'


const router = Router();

router.get('/', CrearProductosVendedorControlador.obtenerProductos);
router.get('/:id', CrearProductosVendedorControlador.obtenerProId);
router.post('/crear', CrearProductosVendedorControlador.crearProductos);
router.put('/:id', CrearProductosVendedorControlador.actualizarProductos);
router.delete('/:id', CrearProductosVendedorControlador.eliminarProductos);

export default router;