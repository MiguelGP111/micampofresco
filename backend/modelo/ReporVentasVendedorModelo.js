// models/ReporteModel.js
import { ejecutarConsulta } from '../configuracion/db.js';


export async function obtenerVentas() {
  const result = await ejecutarConsulta(`
    SELECT v.idventa, p.nombre, v.cantidad, v.fecha
    FROM ventas v
    JOIN productos p ON v.idproducto = p.idproducto
    ORDER BY v.fecha DESC
  `);
  return result;
}

export async function productosMasVendidos(limit = 5) {
  const result = await ejecutarConsulta(`
    SELECT p.nombre, SUM(v.cantidad) AS total_vendido
    FROM ventas v
    JOIN productos p ON v.idproducto = p.idproducto
    GROUP BY p.idproducto, p.nombre
    ORDER BY total_vendido DESC
    LIMIT $1
  `, [limit]);
  return result;
}
