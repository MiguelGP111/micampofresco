import { ejecutarConsulta } from '../configuracion/db.js';

const PerfilVendedorModelo = {

  //  OBTENER PERFIL
  async obtenerPerfil(idvendedor) {
    try {
      const query = `
        SELECT idvendedor, tipodoc, documento, edad, nombre_completo, telefono,
               direccion, email, horario, rol, fecha_ingreso, estado
        FROM vendedores
        WHERE idvendedor = $1
      `;
      const result = await ejecutarConsulta(query, [idvendedor]);
      return result.rows?.[0] || null;
    } catch (error) {
      console.error("Error al obtener perfil:", error);
      throw new Error("No se pudo obtener el perfil del vendedor");
    }
  },

  //  BUSCAR POR EMAIL
  async buscarPorEmail(email) {
    try {
      const query = `SELECT * FROM vendedores WHERE email = $1`;
      const result = await ejecutarConsulta(query, [email]);
      return result.rows?.[0] || null;
    } catch (error) {
      console.error("Error al buscar por email:", error);
      throw new Error("Error al buscar vendedor por email");
    }
  },

  //  ACTUALIZAR PERFIL
  async actualizarPerfil(idvendedor, datos = {}) {

    let {
      tipodoc,
      documento,
      edad,
      nombre_completo,
      telefono,
      direccion,
      email,
      horario,
      estado
    } = datos;

    try {

      // Conversión de tipos sin alterar tu estructura
      edad = edad !== undefined ? parseInt(edad, 10) : null;
      estado = estado !== undefined ? String(estado) : null;
      horario = horario !== undefined ? JSON.stringify(horario) : null;

      const query = `
        UPDATE vendedores
        SET tipodoc = COALESCE($1, tipodoc),
            documento = COALESCE($2, documento),
            edad = COALESCE($3, edad),
            nombre_completo = COALESCE($4, nombre_completo),
            telefono = COALESCE($5, telefono),
            direccion = COALESCE($6, direccion),
            email = COALESCE($7, email),
            horario = COALESCE($8, horario),
            estado = COALESCE($9, estado)
        WHERE idvendedor = $10
        RETURNING *
      `;

      const params = [
        tipodoc,
        documento,
        edad,
        nombre_completo,
        telefono,
        direccion,
        email,
        horario,
        estado,
        idvendedor
      ];

      const result = await ejecutarConsulta(query, params);
      return result.rows?.[0] || null;

    } catch (error) {
      console.error("Error al actualizar perfil:", error);

      // Manejo especial: email + UNIQUE
      if (error.message?.includes("duplicate key")) {
        throw new Error("El email ya está registrado por otro vendedor");
      }

      throw new Error("No se pudo actualizar el perfil del vendedor");
    }
  }
};

export default PerfilVendedorModelo;
