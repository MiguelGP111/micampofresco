import { Router } from 'express';
import VendorPerfilControlador from '../controlador/PerfilVendedorControlador.js';
import { verificarToken } from '../middleware/verificarToken.js';
import { verificarVendedor } from '../middleware/AuthVendedor.js';

const router = Router();

router.get('/', verificarToken, verificarVendedor, VendorPerfilControlador.verPerfil);
router.put('/ediperfil/:id', verificarToken, verificarVendedor, VendorPerfilControlador.actualizarPerfil);

export default router;
