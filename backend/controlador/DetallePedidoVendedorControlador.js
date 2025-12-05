
import { ejecutarConsulta } from '../configuracion/db.js';
import DetallePedidoVendedorModelo from '../modelo/DetallePedidoVendedorModelo.js';

export const DetallePedidoVendedorControlador = {

  //  Listar todos los detalles o por idpedido
  async listarDetalles(req, res) {
    try {
      const { idpedido } = req.query;
      const detalles = await DetallePedidoVendedorModelo.listarDetalles(idpedido);
      console.log(' Detalles obtenidos:', detalles);

      res.json({ mensaje: 'Detalles obtenidos correctamente', Detalle_del_pedido: detalles });
    } catch (error) {
      console.error(error);
      res.status(500).json({ mensaje: 'Error al obtener los detalles', error: error.message });
    }
  },

  //  Buscar por iddetallep
  async buscarDetalleId(req, res) {
    try {
      const { id } = req.params;

      if (!id) {
        return res.status(400).json({ mensaje: 'Debe proporcionar el ID del detalle' });
      }
      const detalle = await DetallePedidoVendedorModelo.buscarDetallePorId(id);
      if (!detalle) {
        return res.status(404).json({ mensaje: 'Detalle no encontrado' });
      }
      console.log(' Detalle encontrado:', detalle);
      res.json({ mensaje: 'Detalle obtenido correctamente', Detalle_del_pedido: detalle });
    } catch (error) {
      console.error(error);
      res.status(500).json({ mensaje: 'Error al buscar el detalle', error: error.message });
    }
  },

  //  Crear nuevo detalle
  async crearDetalle(req, res) {
    try {
      const { idpedido, idproducto, cantidad, precio_unitario, descuento, impuesto } = req.body || {};

      // Validaciones básicas
      if (!idpedido || !idproducto || !cantidad || !precio_unitario || descuento === undefined || impuesto === undefined) {
        return res.status(400).json({ mensaje: 'Faltan campos obligatorios' });
      }
      if (isNaN(cantidad) || cantidad <= 0 || isNaN(precio_unitario) || precio_unitario <= 0 || isNaN(descuento) || descuento < 0 || isNaN(impuesto) || impuesto < 0) {
        return res.status(400).json({ mensaje: 'Cantidad, precio, descuento e impuesto deben ser números válidos' });
      }

      // Verificar pedido
      const pedidoExiste = await ejecutarConsulta('SELECT idpedido FROM pedidos WHERE idpedido = $1', [idpedido]);
      if (pedidoExiste.rowCount === 0) {
        return res.status(404).json({ mensaje: 'El pedido no existe' });
      }

      // Verificar producto
      const productoExiste = await ejecutarConsulta('SELECT idproducto FROM productos WHERE idproducto = $1', [idproducto]);
      if (productoExiste.rowCount === 0) {
        return res.status(404).json({ mensaje: 'El producto no existe' });
      }

      //  CÁLCULOS
      const subtotal = cantidad * precio_unitario;                // subtotal sin descuento
      const subtotalConDescuento = subtotal - descuento;         // subtotal después del descuento
      const ivaMonto = subtotalConDescuento * (impuesto / 100);  // calcular IVA
      const total = subtotalConDescuento + ivaMonto;             // total final

      // Guardar todos los valores en la tabla
      const nuevoDetalle = await DetallePedidoVendedorModelo.crearDetalle({
        idpedido,
        idproducto,
        cantidad,
        precio_unitario,
        descuento,              // se guarda tal cual
        impuesto,               // se guarda tal cual
        subtotal: subtotalConDescuento,
        iva: ivaMonto,
        total
      });

      console.log(' Detalle creado:', nuevoDetalle);
      res.status(201).json({ mensaje: 'Detalle creado correctamente', Detalle_del_pedido: nuevoDetalle });
    } catch (error) {
      console.error(error);
      res.status(500).json({ mensaje: 'Error al crear el detalle', error: error.message });
    }
  },

  //  Actualizar detalle
  async actualizarDetalle(req, res) {
    try {
      const { id } = req.params;
      const { cantidad, precio_unitario, descuento, impuesto } = req.body;

      if (!cantidad || !precio_unitario || descuento === undefined || impuesto === undefined) {
        return res.status(400).json({ mensaje: 'Debe proporcionar cantidad, precio_unitario, descuento e impuesto' });
      }

      if (isNaN(cantidad) || cantidad <= 0 || isNaN(precio_unitario) || precio_unitario <= 0 || isNaN(descuento) || descuento < 0 || isNaN(impuesto) || impuesto < 0) {
        return res.status(400).json({ mensaje: 'Los valores deben ser números válidos y positivos' });
      }

      //  CÁLCULOS
      const subtotal = cantidad * precio_unitario;                // subtotal sin descuento
      const subtotalConDescuento = subtotal - descuento;         // subtotal después del descuento
      const ivaMonto = subtotalConDescuento * (impuesto / 100);  // calcular IVA
      const total = subtotalConDescuento + ivaMonto;             // total final

      // Actualizar detalle incluyendo descuento e impuesto
      const detalleActualizado = await DetallePedidoVendedorModelo.actualizarDetalle(id, {
        cantidad,
        precio_unitario,
        descuento,
        impuesto,
        subtotal: subtotalConDescuento,
        iva: ivaMonto,
        total
      });

      if (!detalleActualizado) {
        return res.status(404).json({ mensaje: 'Detalle no encontrado' });
      }

      console.log(' Detalle actualizado:', detalleActualizado);
      res.json({ mensaje: 'Detalle actualizado correctamente', Detalle_del_pedido: detalleActualizado });
    } catch (error) {
      console.error(error);
      res.status(500).json({ mensaje: 'Error al actualizar el detalle', error: error.message });
    }
  },

  //  Eliminar detalle
  async eliminarDetalle(req, res) {
    try {
      const { id } = req.params;
      const detalleEliminado = await DetallePedidoVendedorModelo.eliminarDetalle(id);

      if (!detalleEliminado) {
        return res.status(404).json({ mensaje: 'Detalle no encontrado' });
      }

      console.log(' Detalle eliminado:', detalleEliminado);
      res.json({ mensaje: 'Detalle eliminado correctamente', Detalle_del_pedido: detalleEliminado });
    } catch (error) {
      console.error(error);
      res.status(500).json({ mensaje: 'Error al eliminar el detalle', error: error.message });
    }
  }
};

export default DetallePedidoVendedorControlador;
