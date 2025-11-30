// backend/modelo/DevolucionModelo.js
import db from '../modelo/db/Conexion.js';

export const DevolucionModelo = {

  // Obtener devoluciones por usuario
  async obtenerDevoluciones() {
    try {
      const result = await db.query('SELECT * FROM devolucion');
      return result.rows;
    } catch (error) {
      console.error('Error al obtener devoluciones:', error);
      throw new Error('No se pudieron obtener las devoluciones');
    }
  },

  // Obtener devolucion por ID
  async obtenerDevolucionPorId(idevolucion) {
    try {
      const query = 'SELECT * FROM devolucion WHERE idevolucion = $1';
      const { rows } = await db.query(query, [idevolucion]);
      return rows[0];
    } catch (error) {
      console.error('Error al obtener devolución:', error);
      throw new Error('No se pudo obtener la devolución');
    }
  },

  // Crear devolución
  async crearDevolucion(data) {
    try {
      const { idpedido, idvendedor, motivo, estado } = data;
      const result = await db.query(
        `INSERT INTO devolucion (
         idpedido, idvendedor, motivo, estado, fecha_solicitud, created_at, updated_at
      )
      VALUES ($1, $2, $3, $4,  NOW(), NOW(), NOW())
      RETURNING *`,
        [ idpedido, idvendedor, motivo, estado]
      );
      return result.rows[0];
    } catch (error) {
      console.error('Error al crear devolución:', error);
      throw new Error('No se pudo crear la devolución');
    }
  },


  // Actualizar devolución
 async actualizarDevolucion(idevolucion, data) {
  try {
    const { motivo, estado } = data;
    const result = await db.query(
      `UPDATE devolucion
       SET motivo = $1, estado = $2, updated_at = NOW()
       WHERE idevolucion = $3
       RETURNING *`,
      [motivo, estado, idevolucion] // ✅ se agregó el idevolucion faltante
    );

    return result.rows[0];
  } catch (error) {
    console.error('Error al actualizar devolución:', error);
    throw new Error('No se pudo actualizar la devolución');
  }
},

  // Eliminar devolución
  async eliminarDevolucion(idevolucion) {
    try {
      const result = await db.query(
        `DELETE FROM devolucion WHERE idevolucion=$1 RETURNING *`,
        [idevolucion]
      );
      return result.rows[0];
    } catch (error) {
      console.error('Error al eliminar devolución:', error);
      throw new Error('No se pudo eliminar la devolución');
    }
  }
};

export default DevolucionModelo;
