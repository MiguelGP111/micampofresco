import { ejecutarConsulta } from "../configuracion/db.js";

export const PromocionesModelo = {

  // 🔹 Obtener todas las promociones (opcionalmente por producto)
  async obtenerPromociones(idproducto = null) {
    try {
      let query = "SELECT * FROM promociones";
      const params = [];

      if (idproducto) {
        query += " WHERE idproducto = $1";
        params.push(idproducto);
      }

      const result = await ejecutarConsulta(query, params);
      return result.rows || [];
    } catch (error) {
      console.error("Error al obtener promociones:", error);
      throw new Error("No se pudo obtener las promociones");
    }
  },

  // 🔹 Buscar promoción por ID o nombre
  async buscarPromocId(id = null, nombre = null) {
    try {
      let query = "SELECT * FROM promociones";
      const params = [];
      const condiciones = [];

      if (id !== null && !isNaN(Number(id))) {
        params.push(Number(id));
        condiciones.push(`idpromocion = $${params.length}`);
      }

      if (nombre) {
        params.push(`%${nombre}%`);
        condiciones.push(`nombre ILIKE $${params.length}`);
      }

      if (condiciones.length > 0) {
        query += " WHERE " + condiciones.join(" AND ");
      }

      const result = await ejecutarConsulta(query, params);
      return result.rows || [];
    } catch (error) {
      console.error("Error al obtener la promoción:", error);
      throw new Error("No se pudo obtener la promoción");
    }
  },

  // 🔹 Crear promoción
  async crearPromocion(data) {
    try {
      const { idproducto, nombre, descripcion, fecha_inicio, fecha_fin, tipo, valor } = data;

      const result = await ejecutarConsulta(
        `
          INSERT INTO promociones (
            idpromocion, idproducto, nombre, descripcion, fecha_inicio, fecha_fin, tipo, valor
          )
          VALUES (
            (SELECT COALESCE(MAX(idpromocion) + 1, 1) FROM promociones),
            $1, $2, $3, $4, $5, $6, $7
          )
          RETURNING *;
        `,
        [idproducto, nombre, descripcion, fecha_inicio, fecha_fin, tipo, valor]
      );

      return result.rows?.[0] || null;
    } catch (error) {
      console.error("Error al crear promoción:", error);
      throw new Error("No se pudo crear la promoción");
    }
  },

  // 🔹 Actualizar promoción
  async actualizarPromocion(id, data) {
    try {
      const { nombre, descripcion, fecha_inicio, fecha_fin, tipo, valor } = data;

      const result = await ejecutarConsulta(
        `
          UPDATE promociones
          SET nombre = $1,
              descripcion = $2,
              fecha_inicio = $3,
              fecha_fin = $4,
              tipo = $5,
              valor = $6
          WHERE idpromocion = $7
          RETURNING *;
        `,
        [nombre, descripcion, fecha_inicio, fecha_fin, tipo, valor, id]
      );

      return result.rows?.[0] || null;
    } catch (error) {
      console.error("Error al actualizar promoción:", error);
      throw new Error("No se pudo actualizar la promoción");
    }
  },

  // 🔹 Eliminar promoción
  async eliminarPromocion(id) {
    try {
      const result = await ejecutarConsulta(
        `DELETE FROM promociones WHERE idpromocion = $1 RETURNING *`,
        [id]
      );

      return result.rows?.[0] || null;
    } catch (error) {
      console.error("Error al eliminar promoción:", error);
      throw new Error("No se pudo eliminar la promoción");
    }
  }

};

export default PromocionesModelo;

