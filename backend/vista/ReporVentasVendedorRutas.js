// routes/reporteRoutes.js
import { Router } from 'express';
import { mostrarReporte } from '../controlador/ReporVentasVendedorControlador.js';
import { obtenerVentas, productosMasVendidos } from '../modelo/ReporVentasVendedorModelo.js';

const router = Router();

// Ruta original para EJS
router.get('/reporte', mostrarReporte);

// Ruta temporal solo para pruebas en Postman
router.get('/api/reporte', async (req, res) => {
  try {
    const ventas = await obtenerVentas();
    const topProductos = await productosMasVendidos(5);
    res.json({ ventas, topProductos });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al generar el reporte' });
  }
});

export default router;
