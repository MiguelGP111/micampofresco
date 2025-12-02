import pool from './db/Config.js';

class UsuarioModelo {

  static async buscarPorId(id) {
    const sql = 'SELECT * FROM usuario WHERE id = $1';
    const { rows } = await pool.query(sql, [id]);
    return rows[0];
  }

  static async actualizarUsuario(id, datos) {
    const fields = [];
    const values = [];
    let i = 1;

    if (datos.email) {
      fields.push(`email = $${i++}`);
      values.push(datos.email);
    }
    if (datos.celular) {
      fields.push(`celular = $${i++}`);
      values.push(datos.celular);
    }
    if (datos.contrasena) {
      fields.push(`contrasena = $${i++}`);
      values.push(datos.contrasena);
    }

    if (fields.length === 0) return null;

    const sql = `UPDATE usuario SET ${fields.join(', ')} WHERE id = $${i} RETURNING *`;
    values.push(id);

    const { rows } = await pool.query(sql, values);
    return rows[0];
  }

  static async eliminarUsuario(id) {
    const sql = 'DELETE FROM usuario WHERE id = $1 RETURNING *';
    const { rows } = await pool.query(sql, [id]);
    return rows[0];
  }

}

export default UsuarioModelo;