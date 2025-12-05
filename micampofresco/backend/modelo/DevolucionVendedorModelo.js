// backend/modelo/DevolucionModelo.js
import { ejecutarConsulta } from '../configuracion/db.js';

export const DevolucionModelo = {

  //  Obtener todas las devoluciones
  async obtenerDevoluciones() {
    try {
      const result = await ejecutarConsulta('SELECT * FROM devolucion ORDER BY idevolucion DESC');
      return result.rows;
    } catch (error) {
      console.error('Error al obtener devoluciones:', error);
      throw new Error('No se pudieron obtener las devoluciones');
    }
  },

  //  Obtener devolución por ID
  async obtenerDevolucionPorId(idevolucion) {
    try {
      const query = 'SELECT * FROM devolucion WHERE idevolucion = $1';
      const result = await ejecutarConsulta(query, [idevolucion]);
      return result.rows[0];
    } catch (error) {
      console.error('Error al obtener devolución:', error);
      throw new Error('No se pudo obtener la devolución');
    }
  },

  //  Crear devolución
  async crearDevolucion(data) {
    try {
      const { idpedido, idvendedor, motivo, estado } = data;

      const query = `
        INSERT INTO devolucion (
          idpedido, idvendedor, motivo, estado, 
          fecha_solicitud, created_at, updated_at
        )
        VALUES (
          $1, $2, $3, $4,
          NOW(), NOW(), NOW()
        )
        RETURNING *;
      `;

      const values = [idpedido, idvendedor, motivo, estado];
      const result = await ejecutarConsulta(query, values);

      return result.rows[0];
    } catch (error) {
      console.error('Error al crear devolución:', error);
      throw new Error('No se pudo crear la devolución');
    }
  },

  //  Actualizar devolución
  async actualizarDevolucion(idevolucion, data) {
    try {
      const { motivo, estado } = data;

      const query = `
        UPDATE devolucion
        SET 
          motivo = $1,
          estado = $2,
          updated_at = NOW()
        WHERE idevolucion = $3
        RETURNING *;
      `;

      const values = [motivo, estado, idevolucion];
      const result = await ejecutarConsulta(query, values);

      return result.rows[0];
    } catch (error) {
      console.error('Error al actualizar devolución:', error);
      throw new Error('No se pudo actualizar la devolución');
    }
  },

  //  Eliminar devolución
  async eliminarDevolucion(idevolucion) {
    try {
      const query = `DELETE FROM devolucion WHERE idevolucion = $1 RETURNING *`;
      const result = await ejecutarConsulta(query, [idevolucion]);

      return result.rows[0];
    } catch (error) {
      console.error('Error al eliminar devolución:', error);
      throw new Error('No se pudo eliminar la devolución');
    }
  }

};

export default DevolucionModelo;
