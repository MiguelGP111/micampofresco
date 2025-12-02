import pool from '../modelo/db/Conexion.js';

class CrearUsuarioModelo {

  constructor(tipoDoc, documento, edad, nombre_completo, telefono, direccion, email, contrasena) {
    this.tipoDoc = tipoDoc;
    this.documento = documento;
    this.edad = edad;
    this.nombre_completo = nombre_completo;
    this.telefono = telefono;
    this.direccion = direccion;
    this.email = email;
    this.contrasena = contrasena;
  }

  async mostrarTodos() {
    const query = 'SELECT * FROM usuario ORDER BY id ASC';
    const { rows } = await pool.query(query);
    return rows;
  }

  async buscarUsuarioId(id) {
    const query = 'SELECT * FROM usuario WHERE id = $1';
    const { rows } = await pool.query(query, [id]);
    return rows[0];
  }

  async guardarUsuario() {
    const query = `
      INSERT INTO usuario (tipo_doc, documento, edad, nombre_completo, telefono, direccion, email, contrasena)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
      RETURNING *`;
    const values = [this.tipoDoc, this.documento, this.edad, this.nombre_completo, this.telefono, this.direccion, this.email, this.contrasena];

    const { rows } = await pool.query(query, values);
    return rows[0];
  }

  async editarUsuario(id, datos) {
    const campos = [];
    const valores = [];
    let contador = 1;

    for (const key in datos) {
      campos.push(`${key} = $${contador}`);
      valores.push(datos[key]);
      contador++;
    }

    valores.push(id);
    const query = `UPDATE usuario SET ${campos.join(', ')} WHERE id = $${contador} RETURNING *`;

    const { rows } = await pool.query(query, valores);
    return rows[0];
  }

  async eliminarUsuario(id) {
    const query = 'DELETE FROM usuario WHERE id = $1 RETURNING *';
    const { rows } = await pool.query(query, [id]);
    return rows[0];
  }
}

export default CrearUsuarioModelo;
