import { ejecutarConsulta } from '../configuracion/db.js';

export const DetalleProduModelo = {

  //  Obtener todos los detalles de un vendedor
  async obtenerDetalles(idvendedor) {
    try {
      const result = await ejecutarConsulta(
        `SELECT * FROM detalle_producto WHERE idvendedor = $1 ORDER BY idetalle DESC`,
        [idvendedor]
      );

      return result.rows;  // siempre tendrá rows
    } catch (error) {
      console.error('Error al obtener detalles de productos:', error);
      throw new Error('No se pudo obtener los detalles');
    }
  },

  //  Obtener detalle por ID
  async obtenerDetalleId(iddetalle) {
    try {
      const result = await ejecutarConsulta(
        `SELECT * FROM detalle_producto WHERE idetalle = $1`,
        [iddetalle]
      );

      return result.rows[0];
    } catch (error) {
      console.error('Error al obtener detalle:', error);
      throw new Error('No se pudo obtener el detalle');
    }
  },

  //  Crear detalle
  async crearDetalle(data) {
    try {
      const {
        idproducto,
        idvendedor,
        descripcion,
        precio,
        descuento,
        stock,
        disponible,
        fecha_expiracion,
        origen,
        metodo_produccion,
        certificacion,
        imagen_principal,
        imagen_galeria
      } = data;

      // Asegúrate de que el nombre sea correcto: detalle_producto
      const result = await ejecutarConsulta(
        `INSERT INTO detalle_producto (
          idproducto, idvendedor, descripcion, precio, descuento, stock,
          disponible, fecha_expiracion, origen, metodo_produccion,
          certificacion, imagen_principal, imagen_galeria, fecha_creacion, fecha_actualizacion
        ) VALUES (
          $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13, NOW(), NOW()
        )
        RETURNING *`,
        [
          idproducto, idvendedor, descripcion, precio, descuento, stock,
          disponible, fecha_expiracion, origen, metodo_produccion,
          certificacion, imagen_principal, imagen_galeria
        ]
      );

      return result.rows[0];
    } catch (error) {
      console.error('Error al crear detalle:', error);
      throw new Error('No se pudo crear el detalle del producto');
    }
  },

  //  Actualizar detalle
  async actualizarDetalle(id, data) {
    try {
      const fields = Object.keys(data);
      const values = Object.values(data);

      if (fields.length === 0) throw new Error('No hay datos para actualizar');

      const setClause = fields
        .map((campo, index) => `${campo} = $${index + 1}`)
        .join(', ');

      const query = `
        UPDATE detalle_producto
        SET ${setClause}, fecha_actualizacion = NOW()
        WHERE idetalle = $${fields.length + 1}
        RETURNING *;
      `;

      values.push(id);

      const result = await ejecutarConsulta(query, values);
      return result.rows[0];

    } catch (error) {
      console.error('Error al actualizar detalle:', error);
      throw new Error('No se pudo actualizar el detalle de producto');
    }
  },

  //  Eliminar detalle
  async eliminarDetalle(id) {
    try {
      const result = await ejecutarConsulta(
        `DELETE FROM detalle_producto WHERE idetalle = $1 RETURNING *`,
        [id]
      );

      return result.rows[0];
    } catch (error) {
      console.error('Error al eliminar detalle:', error);
      throw new Error('No se pudo eliminar el detalle');
    }
  }

};

export default DetalleProduModelo;

