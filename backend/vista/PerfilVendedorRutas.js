import { Router } from 'express';
import VendorPerfilControlador from '../controlador/PerfilVendedorControlador.js';
import {verificarToken} from '../configuracion/AuthMiddleware.js';

const router = Router();

router.get('/', verificarToken, VendorPerfilControlador.verPerfil);
router.put('/ediperfil/:id', verificarToken, VendorPerfilControlador.actualizarPerfil);

export default router;
