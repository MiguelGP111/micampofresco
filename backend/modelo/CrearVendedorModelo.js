// src/modelo/vendedormodelo/CrearVendedorModelo.js
import db from './db/Conexion.js';

class CrearVendedorModelo {
  constructor(
    tipoDoc,
    documento,
    edad,
    nombre_completo,
    telefono,
    direccion,
    email,
    contrasena,
    horario,
    rol = "vendedor",
    fecha_ingreso = new Date(),
    estado = true

  ) {
    this.tipoDoc = tipoDoc;
    this.documento = documento;
    this.edad = edad;
    this.nombre_completo = nombre_completo;
    this.telefono = telefono;
    this.direccion = direccion;
    this.email = email;
    this.contrasena = contrasena; // ya hasheada desde el controlador;
    this.horario = horario;
    this.rol = rol;
    this.fecha_ingreso = fecha_ingreso;
    this.estado = estado;
  }

  async mostrarTodos() {
    try {
      const result = await db.query('SELECT * FROM vendedores ORDER BY idvendedor DESC');
      return result.rows;
    } catch (error) {
      console.error('Error al obtener los vendedores:', error);
      throw error;
    }
  }

  async buscarVendedorId(id) {
    try {
      const result = await db.query('SELECT * FROM vendedores WHERE idvendedor = $1', [id]);
      return result.rows[0];
    } catch (error) {
      console.error('Error al obtener vendedor por ID:', error);
      throw error;
    }
  }

    // Guardar vendedor
  async guardarVendedor() {
    const query = `
      INSERT INTO vendedores
        (tipoDoc, documento, edad, nombre_completo, telefono, direccion, email, contrasena, horario, rol, fecha_ingreso, estado)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)
      RETURNING idvendedor
    `;
    const values = [
      this.tipoDoc,
      this.documento,
      this.edad,
      this.nombre_completo,
      this.telefono,
      this.direccion,
      this.email,
      this.contrasena,
      this.horario,
      this.rol,
      this.fecha_ingreso,
      this.estado
    ];

    try {
      const result = await db.query(query, values);
      this.idvendedor = result.rows[0].idvendedor;
      return this;
    } catch (error) {
      console.error('Error al guardar vendedor:', error);
      throw error;
    }
  }

  // ✅ Estos métodos deben ser estáticos
  static async buscarPorDocumento(documento) {
    const query = `SELECT * FROM vendedores WHERE documento = $1`;
    const result = await db.query(query, [documento]);
    return result.rows[0] || null;
  }

  static async buscarPorEmail(email) {
    const query = `SELECT * FROM vendedores WHERE email = $1`;
    const result = await db.query(query, [email]);
    return result.rows[0] || null;
  }

  static async buscarPorTelefono(telefono) {
    const query = `SELECT * FROM vendedores WHERE telefono = $1`;
    const result = await db.query(query, [telefono]);
    return result.rows[0] || null;
  }



  async editarVendedor(id, datos) {
    const fields = Object.keys(datos);
    const values = Object.values(datos);

    if (fields.length === 0) throw new Error('No se proporcionaron datos para actualizar');

    const setClause = fields.map((f, i) => `${f} = $${i + 1}`).join(', ');
    const query = `UPDATE vendedores SET ${setClause} WHERE idvendedor = $${fields.length + 1} RETURNING *`;

    values.push(id);

    try {
      const result = await db.query(query, values);
      return result.rows[0];
    } catch (error) {
      console.error('Error al actualizar vendedor:', error);
      throw error;
    }
  }

  async eliminarVendedor(id) {
    try {
      const result = await db.query('DELETE FROM vendedores WHERE idvendedor = $1 RETURNING *', [id]);
      return result.rows[0];
    } catch (error) {
      console.error('Error al eliminar vendedor:', error);
      throw error;
    }
  }
}

export default CrearVendedorModelo;
