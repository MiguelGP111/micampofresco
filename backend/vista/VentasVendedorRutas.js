import {Router} from 'express';
import { VentasVendedorControlador } from '../controlador/VentasVendedorControlador.js';
const router = Router();

router.get('/', VentasVendedorControlador.listarVentas);
router.get('/:id', VentasVendedorControlador.buscarVentaId);
router.post('/crear', VentasVendedorControlador.crearVenta);
router.put('/:id', VentasVendedorControlador.actualizarVenta);
router.delete('/:id', VentasVendedorControlador.eliminarVenta);

export default router;
