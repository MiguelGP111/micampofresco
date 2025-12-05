import { ejecutarConsulta } from '../configuracion/db.js';


const PerfilVendedorModelo = {

    async obtenerPerfil(idvendedor) {
        const query = `
      SELECT idvendedor, tipodoc, documento, edad, nombre_completo, telefono,
             direccion, email, horario, rol, fecha_ingreso, estado
      FROM vendedores
      WHERE idvendedor = $1
    `;
        const result = await ejecutarConsulta(query, [idvendedor]);
        return result[0];
    },

    async buscarPorEmail(email) {
        const query = `SELECT * FROM vendedores WHERE email = $1`;
        const result = await ejecutarConsulta(query, [email]);
        return result[0];
    },

    async actualizarPerfil(idvendedor, datos = {}) {

        // Extraer valores enviados desde el frontend
        const {
            t1, // tipodoc
            t2, // documento
            t3, // edad
            t4, // nombre_completo
            t5, // telefono
            t6, // email
            t7, // direccion
            t8, // password (si lo usas)
            t9, // horario (objeto)
            t10 // estado
        } = datos;

        // Conversión de tipos
        const edad = t3 !== undefined ? parseInt(t3, 10) : undefined;
        const horario = t9 !== undefined ? JSON.stringify(t9) : undefined;
        const estado = t10 !== undefined ? String(t10) : undefined;

        const query = `
            UPDATE vendedores
            SET tipodoc = COALESCE($1, tipodoc),
                documento = COALESCE($2, documento),
                edad = COALESCE($3, edad),
                nombre_completo = COALESCE($4, nombre_completo),
                telefono = COALESCE($5, telefono),
                email = COALESCE($6, email),
                direccion = COALESCE($7, direccion),
                horario = COALESCE($8, horario),
                estado = COALESCE($9, estado)
            WHERE idvendedor = $10
            RETURNING *;
        `;

        const params = [
            t1,
            t2,
            edad,
            t4,
            t5,
            t6,
            t7,
            horario,
            estado,
            idvendedor
        ];

        const result = await ejecutarConsulta(query, params);
        return result[0];
    }
}
export default PerfilVendedorModelo;
