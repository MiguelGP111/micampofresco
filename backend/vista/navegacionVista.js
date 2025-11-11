import express from 'express';
import {
  listarCategorias,
  listarProductos,
  listarPromociones
} from '../controllers/navegacionController.js';

const router = express.Router();

// GET /navegacion/categorias
router.get('/categorias', listarCategorias);

// GET /navegacion/productos
router.get('/productos', listarProductos);

// GET /navegacion/promociones
router.get('/promociones', listarPromociones);

export default router;

