// src/vista/agricultorRuta/CrearAgricultorRuta.js
import { Router } from 'express';
import CrearVendedorControlador from '../controlador/CrearVendedorControlador.js';

const router = Router();

router.get('/', CrearVendedorControlador.listar);
router.get('/:id', CrearVendedorControlador.obtenerVendedorId);
router.post('/crear', CrearVendedorControlador.crear);
router.put('/:id', CrearVendedorControlador.actualizar);
router.delete('/:id', CrearVendedorControlador.eliminar);

export default router;
