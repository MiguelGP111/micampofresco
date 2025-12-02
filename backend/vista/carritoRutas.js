import express from 'express';
import CarritoControlador from '../controlador/carritoControlador.js';

const router = express.Router();

router.post('/carrito/agregar', CarritoControlador.agregar);
router.get('/carrito/:usuario_id', CarritoControlador.obtener);
router.delete('/carrito/eliminar', CarritoControlador.eliminar);
router.delete('/carrito/vaciar', CarritoControlador.vaciar);

export default router;
