import {Router} from 'express';
import DetallePedidoVendedorControlador from '../controlador/DetallePedidoVendedorControlador.js';

const router = Router();

// CRUD con la misma estructura que promociones
router.get('/', DetallePedidoVendedorControlador.listarDetalles);
router.get('/:id', DetallePedidoVendedorControlador.buscarDetalleId);
router.post('/crear', DetallePedidoVendedorControlador.crearDetalle);
router.put('/:id', DetallePedidoVendedorControlador.actualizarDetalle);
router.delete('/:id', DetallePedidoVendedorControlador.eliminarDetalle);

export default router;
