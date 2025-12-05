import {ejecutarConsulta} from "../configuracion/db.js";

const DetallePedidoModelo = {

  async listarDetalles(idpedido) {
    try {
      let query = 'SELECT * FROM detalle_pedido';
      const values = [];

      if (idpedido) {
        query += ' WHERE idpedido = $1';
        values.push(idpedido);
      }

      query += ' ORDER BY idetallep ASC';

      const result = await ejecutarConsulta(query, values);
      const rows = result?.rows ?? result;
      return rows;
    } catch (error) {
      console.error(' Error en listarDetalles:', error.message);
      throw error;
    }
  },

  async buscarDetallePorId(idetallep) {
    try {
      const query = 'SELECT * FROM detalle_pedido WHERE idpedido = $1';
      const result = await ejecutarConsulta(query, [idetallep]);
      const rows = result?.rows ?? result;
      return rows[0];
    } catch (error) {
      console.error(' Error en buscarDetallePorId:', error.message);
      throw error;
    }
  },

  async crearDetalle({ idpedido, idproducto, cantidad, precio_unitario, descuento, impuesto, subtotal, iva, total }) {
    try {
      const query = `
        INSERT INTO detalle_pedido
        (idpedido, idproducto, cantidad, precio_unitario, descuento, impuesto, subtotal, iva, total)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
        RETURNING idetallep, idpedido, idproducto, cantidad, precio_unitario, descuento, impuesto, subtotal, iva, total;
      `;
      const values = [idpedido, idproducto, cantidad, precio_unitario, descuento, impuesto, subtotal, iva, total];
      const result = await ejecutarConsulta(query, values);
      const rows = result?.rows ?? result;
      return rows[0];
    } catch (error) {
      console.error(' Error en crearDetalle:', error.message);
      throw error;
    }
  },

  async actualizarDetalle(idetallep, { cantidad, precio_unitario, descuento, impuesto, subtotal, iva, total }) {
    try {
      const query = `
        UPDATE detalle_pedido
        SET cantidad = $1,
            precio_unitario = $2,
            descuento = $3,
            impuesto = $4,
            subtotal = $5,
            iva = $6,
            total = $7
        WHERE idetallep = $8
        RETURNING *;
      `;
      const values = [cantidad, precio_unitario, descuento, impuesto, subtotal, iva, total, idetallep];
      const result = await ejecutarConsulta(query, values);
      const rows = result?.rows ?? result;
      return rows[0];
    } catch (error) {
      console.error(' Error en actualizarDetalle:', error.message);
      throw error;
    }
  },

  async eliminarDetalle(idetallep) {
    try {
      const query = 'DELETE FROM detalle_pedido WHERE idetallep = $1 RETURNING *';
      const result = await ejecutarConsulta(query, [idetallep]);
      const rows = result?.rows ?? result;
      return rows[0];
    } catch (error) {
      console.error(' Error en eliminarDetalle:', error.message);
      throw error;
    }
  }
};

export default DetallePedidoModelo;
