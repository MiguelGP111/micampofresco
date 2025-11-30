// controllers/VentasControlador.js
import VentasVendedorModelo from '../modelo/VentasVendedorModelo.js';

export const VentasVendedorControlador = {

  // Listar todas las ventas o por producto
  async listarVentas(req, res) {
    try {
      const { idproducto } = req.query; // opcional: filtrar por producto
      const ventas = await VentasVendedorModelo.obtenerVentas(idproducto);
      console.log('Ventas obtenidas:', ventas);
      res.json({ mensaje: 'Ventas obtenidas correctamente', data: ventas });
    } catch (error) {
      console.error(error);
      res.status(500).json({ mensaje: 'Error al obtener las ventas', error: error.message });
    }
  },

  // Buscar venta por ID
  async buscarVentaId(req, res) {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ mensaje: 'Debe proporcionar el ID de la venta' });
    }

    try {
      const venta = await VentasVendedorModelo.buscarVentaId(id);

      if (!venta) {
        return res.status(404).json({ mensaje: 'Venta no encontrada' });
      }

      console.log('Venta obtenida:', venta);
      res.json({ mensaje: 'Venta obtenida correctamente', data: venta });
    } catch (error) {
      console.error(error);
      res.status(500).json({ mensaje: 'Error al obtener la venta', error: error.message });
    }
  },

  // Crear una nueva venta
  async crearVenta(req, res) {
    try {
      const { idproducto, cantidad, precio_unitario,fecha } = req.body;

      // Validaciones básicas
      if (!idproducto || cantidad == null ||!precio_unitario || !fecha) {
        return res.status(400).json({ mensaje: 'Faltan campos obligatorios' });
      }

      const nuevaVenta = await VentasVendedorModelo.crearVenta(req.body);
      console.log('Venta creada:', nuevaVenta);
      res.status(201).json({
        mensaje: 'Venta creada correctamente',
        data: nuevaVenta
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ mensaje: 'Error al crear la venta', error: error.message });
    }
  },

  // Actualizar una venta existente
  async actualizarVenta(req, res) {
    try {
      const { id } = req.params;
      const { idproducto, cantidad, precio_unitario, fecha } = req.body || {};

      if (!idproducto && cantidad == null && !precio_unitario && !fecha) {
        return res.status(400).json({ mensaje: 'Debe enviar al menos un campo para actualizar' });
      }

      const ventaActualizada = await VentasVendedorModelo.actualizarVenta(id, req.body);
      if (!ventaActualizada) {
        return res.status(404).json({ mensaje: 'Venta no encontrada' });
      }

      console.log('Venta actualizada:', ventaActualizada);
      res.json({ mensaje: 'Venta actualizada correctamente', data: ventaActualizada });
    } catch (error) {
      console.error(error);
      res.status(500).json({ mensaje: 'Error al actualizar la venta', error: error.message });
    }
  },

  // Eliminar una venta
  async eliminarVenta(req, res) {
    try {
      const { id } = req.params;
      const ventaEliminada = await VentasVendedorModelo.eliminarVenta(id);

      if (!ventaEliminada) {
        return res.status(404).json({ mensaje: 'Venta no encontrada' });
      }

      console.log('Venta eliminada:', ventaEliminada);
      res.json({ mensaje: 'Venta eliminada correctamente', data: ventaEliminada });
    } catch (error) {
      console.error(error);
      res.status(500).json({ mensaje: 'Error al eliminar la venta', error: error.message });
    }
  }

};

export default VentasVendedorControlador;
