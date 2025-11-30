import {Router} from 'express';
import PromocionesVendedorControlador from '../controlador/PromocionesVendedorControlador.js';

const router = Router();

router.get('/', PromocionesVendedorControlador.listarPromociones);
router.get('/:id', PromocionesVendedorControlador.buscarPromocId);
router.post('/crear', PromocionesVendedorControlador.crearPromocion);
router.put('/:id', PromocionesVendedorControlador.actualizarPromocion);
router.delete('/:id', PromocionesVendedorControlador.eliminarPromocion);

export default router;

