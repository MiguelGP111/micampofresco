// backend/modelo/InventarioModelo.js
import { ejecutarConsulta } from '../configuracion/db.js';


export const InventarioModelo = {

  // Obtener todos los inventarios de un vendedor
 async obtenerInventario() {
    try {
      const result = await ejecutarConsulta( `SELECT * FROM inventarios `);
      return result;
    } catch (error) {
      console.error('Error al obtener inventario:', error);
      throw new Error('No se pudo obtener el inventario');
    }
},
  // Obtener inventario por ID
  async obtenerInventarioId(idinventario) {
    try {
      const result = await ejecutarConsulta(
        `SELECT * FROM inventarios WHERE idinventario = $1`,
        [idinventario]
      );
      return result;
    } catch (error) {
      console.error('Error al obtener inventario:', error);
      throw new Error('No se pudo obtener el inventario');
    }
  },

  // Crear inventario
  async crearInventario(data) {
    try {
      const { idproducto, idvendedor, cantidad_disponible, precio, stock_minimo, stock_maximo, estado, ultimo_ingreso, ultimo_salida } = data;

      const result = await ejecutarConsulta(
        `INSERT INTO inventarios (
           idvendedor, idproducto, cantidad_disponible, precio, stock_minimo, stock_maximo, estado, ultimo_ingreso, ultimo_salida, created_at, updated_at
         )
         VALUES (
           ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW()
         )
         RETURNING *;`,
        [idvendedor, idproducto, cantidad_disponible, precio, stock_minimo, stock_maximo, estado || 'activo', ultimo_ingreso || new Date(), ultimo_salida || null]
      );

      return result[0];
    } catch (error) {
      console.error('Error al crear inventario:', error);
      throw new Error('No se pudo crear el inventario');
    }
  },

  // Actualizar inventario
  async actualizarInventario(idinventario, data) {
    try {
      const { cantidad_disponible, precio, stock_minimo, stock_maximo, estado, ultimo_ingreso, ultimo_salida } = data;
      const result = await ejecutarConsulta(
        `UPDATE inventarios
         SET cantidad_disponible=$1, precio=$2, stock_minimo=$3, stock_maximo=$4, estado=$5, ultimo_ingreso=$6, ultimo_salida=$7, updated_at=NOW()
         WHERE idinventario=$8 RETURNING *`,
        [cantidad_disponible, precio, stock_minimo, stock_maximo, estado, ultimo_ingreso, ultimo_salida, idinventario]
      );
      return result[0];
    } catch (error) {
      console.error('Error al actualizar inventario:', error);
      throw new Error('No se pudo actualizar el inventario');
    }
  },

  // Eliminar inventario
  async eliminarInventario(id) {
    try {
      const result = await ejecutarConsulta(
        `DELETE FROM inventarios WHERE idinventario=$1 RETURNING *`,
        [id]
      );
      return result[0];
    } catch (error) {
      console.error('Error al eliminar inventario:', error);
      throw new Error('No se pudo eliminar el inventario');
    }
  }
};

export default InventarioModelo;
