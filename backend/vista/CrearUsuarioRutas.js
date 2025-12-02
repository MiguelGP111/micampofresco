import { Router } from 'express';
import CrearUsuarioControlador from '../controlador/CrearUsuarioControlador.js';

const router = Router();

router.get('/', CrearUsuarioControlador.listar);
router.get('/:id', CrearUsuarioControlador.obtenerUsuarioId);
router.post('/crear', CrearUsuarioControlador.crear);
router.put('/:id', CrearUsuarioControlador.actualizar);
router.delete('/:id', CrearUsuarioControlador.eliminar);

export default router;