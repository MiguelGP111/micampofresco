import {Router} from 'express';
import { VentasVendedorControlador } from '../controlador/VentasVendedorControlador.js';
const router = Router();

router.post('/crear', VentasVendedorControlador.crearVenta);
router.get('/', VentasVendedorControlador.listarVentas);
router.get('/:id', VentasVendedorControlador.buscarVentaId);
router.put('/:id', VentasVendedorControlador.actualizarVenta);
router.delete('/:id', VentasVendedorControlador.eliminarVenta);
export default router;
