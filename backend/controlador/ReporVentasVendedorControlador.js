import { obtenerVentas, productosMasVendidos } from '../modelo/ReporVentasVendedorModelo.js';

export async function mostrarReporte(req, res) {
  try {
    const ventas = await obtenerVentas();
    const topProductos = await productosMasVendidos(5);

    console.log('Reporte de ventas y productos top:',    ventas, topProductos );
    res.status(201).json({ mensaje: 'Reporte de ventas y productos top', data: ventas });

    res.render('reporte', { ventas, topProductos }); // 'reporte' es la vista
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al generar el reporte');
  }
}