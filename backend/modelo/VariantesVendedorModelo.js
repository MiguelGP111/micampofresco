// backend/modelo/VariantesModelo.js
import db from '../modelo/db/Conexion.js'; // Asegúrate que la ruta sea correcta

export const VariantesModelo = {

  // Obtener todas las variantes de un producto
  async obtenerVariantes() {
    try {
      const result = await db.query('SELECT * FROM variantes');
      return result.rows;
    } catch (error) {
      console.error('Error al obtener variantes:', error);
      throw new Error('No se pudieron obtener las variantes');
    }
  },

  // Obtener variante por ID
  async obtenerVarianteId(id) {
    try {
      const result = await db.query(
        `SELECT * FROM variantes WHERE idvariante = $1`,
        [id]
      );
      return result.rows[0];
    } catch (error) {
      console.error('Error al obtener variante:', error);
      throw new Error('No se pudo obtener la variante');
    }
  },

  // Crear variante
  async crearVariante(data) {
    try {
      const { idproducto, nombre, precio, stock, stock_minimo, stock_maximo, unidad_medida, peso, fecha_caducidad, ingredientes, estado, impuestos } = data;

      const result = await db.query(
        `INSERT INTO variantes (
           idproducto, nombre, precio, stock, stock_minimo, stock_maximo, unidad_medida, peso, fecha_caducidad, ingredientes, estado, impuestos, created_at, updated_at
         )
         VALUES (
           $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,NOW(),NOW()
         )
         RETURNING *`,
        [idproducto, nombre, precio, stock, stock_minimo, stock_maximo, unidad_medida, peso, fecha_caducidad, ingredientes, estado || 'activo', impuestos]
      );

      return result.rows[0];
    } catch (error) {
      console.error('Error al crear variante:', error);
      throw new Error('No se pudo crear la variante');
    }
  },

  // Actualizar variante
  async actualizarVariante(idvariante, data) {
    try {
      const { nombre, precio, stock, stock_minimo, stock_maximo, unidad_medida, peso, fecha_caducidad, ingredientes, estado, impuestos } = data;

      const result = await db.query(
        `UPDATE variantes
         SET nombre=$1, precio=$2, stock=$3, stock_minimo=$4, stock_maximo=$5, unidad_medida=$6, peso=$7, fecha_caducidad=$8, ingredientes=$9, estado=$10, impuestos=$11, updated_at=NOW()
         WHERE idvariante=$12
         RETURNING *`,
        [nombre, precio, stock, stock_minimo, stock_maximo, unidad_medida, peso, fecha_caducidad, ingredientes, estado, impuestos, idvariante]
      );

      return result.rows[0];
    } catch (error) {
      console.error('Error al actualizar variante:', error);
      throw new Error('No se pudo actualizar la variante');
    }
  },

  // Eliminar variante
  async eliminarVariante(id) {
    try {
      const result = await db.query(
        `DELETE FROM variantes WHERE idvariante=$1 RETURNING *`,
        [id]
      );
      return result.rows[0];
    } catch (error) {
      console.error('Error al eliminar variante:', error);
      throw new Error('No se pudo eliminar la variante');
    }
  }

};

export default VariantesModelo;
