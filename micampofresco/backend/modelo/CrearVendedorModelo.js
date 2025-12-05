// src/modelo/vendedormodelo/CrearVendedorModelo.js
import { ejecutarConsulta } from '../configuracion/db.js';

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
    const vendedores = await ejecutarConsulta(
      'SELECT * FROM vendedores ORDER BY idvendedor DESC'
    );
    return vendedores;
  } catch (error) {
    console.error('Error al obtener los vendedores:', error);
    throw error;
  }
}

  async buscarVendedorId(id) {
    try {
      const result = await ejecutarConsulta('SELECT * FROM vendedores');
      return result;
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
      const result = await ejecutarConsulta(query, values);
      this.idvendedor = result.idvendedor;
      return this;
    } catch (error) {
      console.error('Error al guardar vendedor:', error);
      throw error;
    }
  }

  // ✅ Estos métodos deben ser estáticos
static async buscarPorDocumento(documento) {
  const query = `SELECT * FROM vendedores WHERE documento = $1`;
  const result = await ejecutarConsulta(query, [documento]);

  // Manejo seguro: result siempre será un objeto con rows
  if (!result || !result.rows) return null;

  return result.rows[0] || null;
}

static async buscarPorEmail(email) {
  const query = `SELECT * FROM vendedores WHERE email = $1`;
  const result = await ejecutarConsulta(query, [email]);

  if (!result || !result.rows) return null;

  return result.rows[0] || null;
}

static async buscarPorTelefono(telefono) {
  const query = `SELECT * FROM vendedores WHERE telefono = $1`;
  const result = await ejecutarConsulta(query, [telefono]);

  if (!result || !result.rows) return null;

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
      const result = await ejecutarConsulta(query, values);
      return result;
    } catch (error) {
      console.error('Error al actualizar vendedor:', error);
      throw error;
    }
  }

  async eliminarVendedor(id) {
    try {
      const result = await ejecutarConsulta('DELETE FROM vendedores WHERE idvendedor = $1 RETURNING *', [id]);
      return result;
    } catch (error) {
      console.error('Error al eliminar vendedor:', error);
      throw error;
    }
  }
}

export default CrearVendedorModelo;
