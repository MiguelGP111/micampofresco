import db from './db/config.js';

class CarritoModelo {

  // crear carrito si no existe
  static async obtenerOCrearCarrito(usuarioId) {
    let sql = 'SELECT * FROM carrito WHERE usuario_id = $1';
    let { rows } = await db.query(sql, [usuarioId]);

    if (rows.length > 0) return rows[0];

    // si no existe, crearlo
    sql = 'INSERT INTO carrito (usuario_id) VALUES ($1) RETURNING *';
    ({ rows } = await db.query(sql, [usuarioId]));
    return rows[0];
  }

  // agregar un producto
  static async agregarProducto(carritoId, productoId, cantidad) {
    // revisar si el producto ya está en el carrito
    const check = `
      SELECT * FROM carrito_detalle 
      WHERE carrito_id = $1 AND producto_id = $2
    `;
    let { rows } = await db.query(check, [carritoId, productoId]);

    if (rows.length > 0) {
      // si existe, sumar cantidad
      const sql = `
        UPDATE carrito_detalle
        SET cantidad = cantidad + $3
        WHERE carrito_id = $1 AND producto_id = $2
      `;
      await db.query(sql, [carritoId, productoId, cantidad]);
      return;
    }

    // si no existe, insertar
    const sqlInsert = `
      INSERT INTO carrito_detalle (carrito_id, producto_id, cantidad)
      VALUES ($1, $2, $3)
    `;
    await db.query(sqlInsert, [carritoId, productoId, cantidad]);
  }

  // obtener productos del carrito
  static async obtenerProductos(carritoId) {
    const sql = `
      SELECT cd.id, p.nombre, p.precio, cd.cantidad
      FROM carrito_detalle cd
      INNER JOIN productos p ON p.id = cd.producto_id
      WHERE cd.carrito_id = $1
    `;
    const { rows } = await db.query(sql, [carritoId]);
    return rows;
  }

  // borrar un producto del carrito
  static async eliminarProducto(carritoId, productoId) {
    const sql = `
      DELETE FROM carrito_detalle
      WHERE carrito_id = $1 AND producto_id = $2
    `;
    await db.query(sql, [carritoId, productoId]);
  }

  // vaciar carrito
  static async vaciar(carritoId) {
    const sql = `
      DELETE FROM carrito_detalle
      WHERE carrito_id = $1
    `;
    await db.query(sql, [carritoId]);
  }
}

export default CarritoModelo;
