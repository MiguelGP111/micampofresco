// models/ReporteModel.js
import { ejecutarConsulta } from '../configuracion/db.js';

export async function obtenerVentas() {
  try {
    const result = await ejecutarConsulta(`
      SELECT v.idventa, p.nombre, v.cantidad, v.fecha
      FROM ventas v
      JOIN productos p ON v.idproducto = p.idproducto
      ORDER BY v.fecha DESC
    `);

    return result.rows || [];
  } catch (error) {
    console.error("Error al obtener ventas:", error);
    throw new Error("No se pudieron obtener las ventas");
  }
}

export async function productosMasVendidos(limit = 5) {
  try {
    const result = await ejecutarConsulta(
      `
      SELECT p.nombre, SUM(v.cantidad) AS total_vendido
      FROM ventas v
      JOIN productos p ON v.idproducto = p.idproducto
      GROUP BY p.idproducto, p.nombre
      ORDER BY total_vendido DESC
      LIMIT $1
      `,
      [limit]
    );

    return result.rows || [];
  } catch (error) {
    console.error("Error al obtener productos más vendidos:", error);
    throw new Error("No se pudieron obtener los productos más vendidos");
  }
}
