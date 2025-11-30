import pool from './db/Conexion.js';

const VentasVendedorModelo = {

  async obtenerVentas(idproducto) {
    let query = `
      SELECT v.idventa, p.nombre, v.cantidad, v.precio_unitario v.fecha
      FROM ventas v
      JOIN productos p ON v.idproducto = p.idproducto
    `;
    const params = [];
    if (idproducto) {
      query += ' WHERE v.idproducto = $1';
      params.push(idproducto);
    }
    query += ' ORDER BY v.fecha DESC';
    const result = await pool.query(query, params);
    return result.rows;
  },

  async buscarVentaId(id) {
    const result = await pool.query(`
      SELECT v.idventa, p.nombre, v.cantidad, v.precio_unitario, v.fecha
      FROM ventas v
      JOIN productos p ON v.idproducto = p.idproducto
      WHERE v.idventa = $1
    `, [id]);
    return result.rows[0];
  },

  async crearVenta({ idproducto, cantidad, precio_unitario, fecha }) {
    const result = await pool.query(`
      INSERT INTO ventas (idproducto, cantidad,precio_unitario, fecha)
      VALUES ($1, $2, $3, $4) RETURNING *
    `, [idproducto, cantidad, precio_unitario,fecha]);
    return result.rows[0];
  },

  async actualizarVenta(id, { idproducto, cantidad, precio_unitario, fecha }) {
    const result = await pool.query(`
      UPDATE ventas
      SET idproducto = COALESCE($1, idproducto),
          cantidad = COALESCE($2, cantidad),
          precio_unitario = COALESCE($3, precio_unitario),
          fecha = COALESCE($4, fecha)
      WHERE idventa = $5
      RETURNING *
    `, [idproducto, cantidad, precio_unitario, fecha, id]);
    return result.rows[0];
  },

  async eliminarVenta(id) {
    const result = await pool.query(`
      DELETE FROM ventas WHERE idventa = $1 RETURNING *
    `, [id]);
    return result.rows[0];
  }

};

export default VentasVendedorModelo;
