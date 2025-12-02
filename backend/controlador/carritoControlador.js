import CarritoModelo from '../modelo/carritoModelo.js';

class CarritoControlador {

  // agregar producto
  static async agregar(req, res) {
    try {
      const { usuario_id, producto_id, cantidad } = req.body;

      if (!usuario_id || !producto_id || !cantidad) {
        return res.status(400).json({ error: 'Faltan datos' });
      }

      const carrito = await CarritoModelo.obtenerOCrearCarrito(usuario_id);

      await CarritoModelo.agregarProducto(carrito.id, producto_id, cantidad);

      res.json({ mensaje: 'Producto agregado al carrito' });

    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  }

  // obtener productos
  static async obtener(req, res) {
    try {
      const { usuario_id } = req.params;

      const carrito = await CarritoModelo.obtenerOCrearCarrito(usuario_id);
      const productos = await CarritoModelo.obtenerProductos(carrito.id);

      res.json(productos);

    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  }

  // eliminar 1 producto
  static async eliminar(req, res) {
    try {
      const { usuario_id, producto_id } = req.body;

      const carrito = await CarritoModelo.obtenerOCrearCarrito(usuario_id);

      await CarritoModelo.eliminarProducto(carrito.id, producto_id);

      res.json({ mensaje: 'Producto eliminado del carrito' });

    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  }

  // vaciar todo el carrito
  static async vaciar(req, res) {
    try {
      const { usuario_id } = req.body;

      const carrito = await CarritoModelo.obtenerOCrearCarrito(usuario_id);

      await CarritoModelo.vaciar(carrito.id);

      res.json({ mensaje: 'Carrito vaciado' });

    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  }
}

export default CarritoControlador;