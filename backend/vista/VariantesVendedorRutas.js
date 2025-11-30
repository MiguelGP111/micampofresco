import { Router } from "express";
import VariantesVendedorControlador   from "../controlador/VariantesVendedorControlador.js";

const router = Router();
     
router.get('/', VariantesVendedorControlador.obtenerVariantes);
router.get('/:id', VariantesVendedorControlador.obtenerVarianteId);
router.post('/crear', VariantesVendedorControlador.crearVariante);
router.put('/:id', VariantesVendedorControlador.actualizarVariante);
router.delete('/:id', VariantesVendedorControlador.eliminarVariante);
 

export default router;


