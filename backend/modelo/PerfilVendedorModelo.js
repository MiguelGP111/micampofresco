import pool from '../modelo/db/Conexion.js';

const PerfilVendedorModelo = {

    async obtenerPerfil(idvendedor) {
        const query = `
      SELECT idvendedor, tipodoc, documento, edad, nombre_completo, telefono,
             direccion, email, horario, rol, fecha_ingreso, estado
      FROM vendedores
      WHERE idvendedor = $1
    `;
        const result = await pool.query(query, [idvendedor]);
        return result.rows[0];
    },

    async buscarPorEmail(email) {
        const query = `SELECT * FROM vendedores WHERE email = $1`;
        const result = await pool.query(query, [email]);
        return result.rows[0];
    },

    async actualizarPerfil(idvendedor, datos = {}) {  // <-- default vacío
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

        // Convertir tipos
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

        const result = await pool.query(query, params);
        return result.rows[0];
    }
}
export default PerfilVendedorModelo;
