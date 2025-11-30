import {Router} from 'express';
import PedidosVendedorControlador from '../controlador/PedidosVendedorControlador.js';

const router = Router();

router.get('/', PedidosVendedorControlador.listarPedidos);
router.get('/:id', PedidosVendedorControlador.buscarPedidoId);
router.post('/crear', PedidosVendedorControlador.crearPedido);
router.put('/:id', PedidosVendedorControlador.actualizarPedido);
router.delete('/:id', PedidosVendedorControlador.eliminarPedido);

export default router;
