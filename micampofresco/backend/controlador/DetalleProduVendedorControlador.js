import DetalleProduVendedorModelo from '../modelo/DetalleProduVendedorModelo.js';

export const DetalleProduVendedorControlador = {

  // GET /detalles
  async listar(req, res) {
    try {
      const idvendedor = req.user?.id;

      if (!idvendedor)
        return res.status(400).json({ mensaje: "ID del vendedor inválido" });

      const detalles = await DetalleProduVendedorModelo.obtenerDetalles(idvendedor);

      res.status(200).json({
        mensaje: "Detalles obtenidos correctamente",
        detalles
      });
    } catch (error) {
      res.status(500).json({
        mensaje: "Error al obtener los detalles",
        error: error.message
      });
    }
  },

  // GET /detalles/:id
  async obtenerPorId(req, res) {
    try {
      const { id } = req.params;

      if (isNaN(Number(id)))
        return res.status(400).json({ mensaje: "ID inválido" });

      const detalle = await DetalleProduVendedorModelo.obtenerDetalleId(id);

      if (!detalle)
        return res.status(404).json({ mensaje: "Detalle no encontrado" });

      res.status(200).json({
        mensaje: "Detalle encontrado correctamente",
        detalle
      });
    } catch (error) {
      res.status(500).json({
        mensaje: "Error al obtener detalle",
        error: error.message
      });
    }
  },

  // POST /detalles
  async crear(req, res) {
    try {
      const idvendedor = req.user?.id;
      const data = { ...req.body, idvendedor };

      if (!data.idproducto)
        return res.status(400).json({ mensaje: "idproducto es obligatorio" });

      const detalle = await DetalleProduVendedorModelo.crearDetalle(data);

      res.status(201).json({
        mensaje: "Detalle creado correctamente",
        detalle
      });
    } catch (error) {
      res.status(500).json({
        mensaje: "Error al crear detalle",
        error: error.message
      });
    }
  },

  // PUT /detalles/:id
  async actualizar(req, res) {
    try {
      const { id } = req.params;
      const data = req.body;

      if (isNaN(Number(id)))
        return res.status(400).json({ mensaje: "ID inválido" });

      const actualizado = await DetalleProduVendedorModelo.actualizarDetalle(id, data);

      if (!actualizado)
        return res.status(404).json({ mensaje: "Detalle no encontrado" });

      res.status(200).json({
        mensaje: "Detalle actualizado correctamente",
        detalle: actualizado
      });

    } catch (error) {
      res.status(500).json({
        mensaje: "Error al actualizar detalle",
        error: error.message
      });
    }
  },

  // DELETE /detalles/:id
  async eliminar(req, res) {
    try {
      const { id } = req.params;

      if (isNaN(Number(id)))
        return res.status(400).json({ mensaje: "ID inválido" });

      const eliminado = await DetalleProduVendedorModelo.eliminarDetalle(id);

      if (!eliminado)
        return res.status(404).json({ mensaje: "Detalle no encontrado" });

      res.status(200).json({
        mensaje: "Detalle eliminado correctamente",
        detalle: eliminado
      });

    } catch (error) {
      res.status(500).json({
        mensaje: "Error al eliminar detalle",
        error: error.message
      });
    }
  }

};

export default DetalleProduVendedorControlador;
