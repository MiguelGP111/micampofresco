import { Router } from 'express';
import DetalleProduVendedorControlador from '../controlador/DetalleProduVendedorControlador.js';
import {verificarToken}  from '../middleware/VerificarToken.js';

const router = Router();

//  Todas las rutas requieren token del vendedor
router.use(verificarToken);
//  LISTAR todos los detalles del vendedor
router.get('/', DetalleProduVendedorControlador.listar);
//  OBTENER detalle por ID
router.get('/:id', DetalleProduVendedorControlador.obtenerPorId);
//  CREAR detalle de producto
router.post('/crear', DetalleProduVendedorControlador.crear);
//  ACTUALIZAR detalle
router.put('/:id', DetalleProduVendedorControlador.actualizar);
//  ELIMINAR detalle
router.delete('/:id', DetalleProduVendedorControlador.eliminar);

export default router;
