// src/modelo/productomodelo/CrearProductoModelo.js
import {ejecutarConsulta} from '../configuracion/db.js';

class CrearProductosModelo {
  constructor({
    idvendedor = null,
    nombre = '',
    descripcion = '',
    categoria = '',
    tipo_producto = '',
    unidad_medida = '',
    cantidad_por_unidad = 0,
    precio = 0,
    descuento = 0,
    stock = 0,
    disponible = true,
    fecha_cosecha = null,
    fecha_expiracion = null,
    origen = '',
    metodo_produccion = '',
    certificacion = '',
    imagen_principal = null,
    imagen_galeria = []
  } = {}) { // valor por defecto = {} evita el error de undefined
    this.idvendedor = idvendedor;
    this.nombre = nombre;
    this.descripcion = descripcion;
    this.categoria = categoria;
    this.tipo_producto = tipo_producto;
    this.unidad_medida = unidad_medida;
    this.cantidad_por_unidad = cantidad_por_unidad;
    this.precio = precio;
    this.descuento = descuento;
    this.stock = stock;
    this.disponible = disponible;
    this.fecha_cosecha = fecha_cosecha;
    this.fecha_expiracion = fecha_expiracion;
    this.origen = origen;
    this.metodo_produccion = metodo_produccion;
    this.certificacion = certificacion;
    this.imagen_principal = imagen_principal;
    this.imagen_galeria = imagen_galeria;
    this.fecha_creacion = new Date();
    this.fecha_actualizacion = new Date();
  }

  // Mostrar todos los productos
  async mostrarTodos() {
    try {
      const result = await ejecutarConsulta('SELECT * FROM productos ORDER BY idproducto DESC');
      return resultrows;
    } catch (error) {
      console.error('Error al obtener los productos:', error);
      throw error;
    }
  }

  // Buscar producto por ID
  async buscarProId(id) {
    try {
      const result = await ejecutarConsulta(
        'SELECT * FROM productos WHERE idproducto = $1',
        [id]
      );
      return result;
    } catch (error) {
      console.error('Error al obtener producto por ID:', error);
      throw error;
    }
  }

  // Guardar producto
  async guardarProducto() {
    const query = `
      INSERT INTO productos (
        idvendedor, nombre, descripcion, categoria, tipo_producto,
        unidad_medida, cantidad_por_unidad, precio, descuento, stock,
        disponible, fecha_cosecha, fecha_expiracion, origen, metodo_produccion,
        certificacion, imagen_principal, imagen_galeria, fecha_creacion, fecha_actualizacion
      ) VALUES (
        $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,
        $11,$12,$13,$14,$15,$16,$17,$18,$19,$20
      ) RETURNING id_producto
    `;
    const values = [
      this.idvendedor,
      this.nombre,
      this.descripcion,
      this.categoria,
      this.tipo_producto,
      this.unidad_medida,
      this.cantidad_por_unidad,
      this.precio,
      this.descuento,
      this.stock,
      this.disponible,
      this.fecha_cosecha,
      this.fecha_expiracion,
      this.origen,
      this.metodo_produccion,
      this.certificacion,
      this.imagen_principal,
      JSON.stringify(this.imagen_galeria), // almacenar array como JSON
      this.fecha_creacion,
      this.fecha_actualizacion
    ];

    try {
      const result = await ejecutarConsulta(query, values);
      this.idproducto = result.idproducto;
      return this;
    } catch (error) {
      console.error('Error al guardar producto:', error);
      throw error;
    }
  }

  // Editar producto
  async editarProducto(id, datos) {
    const fields = Object.keys(datos);
    const values = Object.values(datos);

    if (fields.length === 0) throw new Error('No se proporcionaron datos para actualizar');

    const setClause = fields.map((f, i) => `${f} = $${i + 1}`).join(', ');
    const query = `UPDATE productos SET ${setClause}, fecha_actualizacion = NOW() WHERE idproducto = $${fields.length + 1}`;
    values.push(id);

    try {
      await ejecutarConsulta(query, values);
      return { message: 'Producto actualizado correctamente' };
    } catch (error) {
      console.error('Error al actualizar producto:', error);
      throw error;
    }
  }

  // Eliminar producto
  async eliminarProducto(id) {
    try {
      const result = await ejecutarConsulta('DELETE FROM productos WHERE idproducto = $1', [id]);
      return result.rowCount > 0;
    } catch (error) {
      console.error('Error al eliminar producto:', error);
      throw error;
    }
  }
}

export default CrearProductosModelo;
