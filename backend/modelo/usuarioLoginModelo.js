import db from './db/Config.js';

class UsuarioModelo {

  static async buscarPorEmail(email) {
    const sql = 'SELECT * FROM usuario WHERE email = $1';
    const { rows } = await db.query(sql, [email]);
    return rows[0];
  }

  // código temporal de recuperación
  static async guardarCodigo(email, codigo) {
    const sql = `
      UPDATE usuario 
      SET codigo_recuperacion = $1, codigo_expira = NOW() + INTERVAL '10 minutes'
      WHERE email = $2
      RETURNING *`;
    const { rows } = await db.query(sql, [codigo, email]);
    return rows[0];
  }

  // Verificar código
  static async verificarCodigo(email, codigo) {
    const sql = `
      SELECT * FROM usuario 
      WHERE email = $1 
      AND codigo_recuperacion = $2
      AND codigo_expira > NOW()`;
    const { rows } = await db.query(sql, [email, codigo]);
    return rows[0];
  }

  // Cambiar contraseña
  static async actualizarContrasena(id, nuevaPass) {
  const sql = `UPDATE usuario SET contrasena = $1 WHERE id = $2`;
  await db.query(sql, [nuevaPass, id]);
}

}

export default UsuarioModelo;