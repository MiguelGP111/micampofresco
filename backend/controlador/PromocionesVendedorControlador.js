import PromocionesVendedorModelo from '../modelo/PromocionesVendedorModelo.js';


export const PromocionesVendedorControlador = {

  async listarPromociones(req, res) {
    try {
      const { idproducto } = req.query;
      const promociones = await PromocionesVendedorModelo.obtenerPromociones(idproducto);
      console.log('Promociones obtenidas:', promociones);
      res.json({ mensaje: 'Promociones obtenidas correctamente', data: promociones });
    } catch (error) {
      console.error(error);
      res.status(500).json({ mensaje: 'Error al obtener las promociones', error: error.message });
    }
  },

 async buscarPromocId(req, res) {
  const { id } = req.params;
  const { nombre } = req.query; // nombre opcional por query

  if (id) {
    console.log(' ID recibido:', id);
  } else if (nombre) {
    console.log('Nombre recibido:', nombre);
  }

  try {
    // No usamos "new", el modelo es un objeto
    const promociones = await PromocionesVendedorModelo.buscarPromocId(id, nombre);

    if (!promociones || promociones.length === 0) {
      return res.status(404).json({ mensaje: 'No se encontraron promociones' });
    }

    console.log('Promociones obtenidas:', promociones);
    res.json({ mensaje: 'Promociones obtenidas correctamente', promociones });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al obtener las promociones', error: error.message });
  }
},


  async crearPromocion(req, res) {
    try {
      const { idproducto, nombre, descripcion, fecha_inicio, fecha_fin, tipo, valor } = req.body;

      // Validaciones
      if (!idproducto || !nombre || !descripcion || !fecha_inicio || !fecha_fin || !tipo || valor == null) {
        return res.status(400).json({ mensaje: 'Faltan campos obligatorios' });
      }

      const nuevaPromocion = await PromocionesVendedorModelo.crearPromocion(req.body);
      console.log('Promoción creada:', nuevaPromocion);
      res.status(201).json({
        mensaje: 'Promoción creada correctamente',
        Promocion: nuevaPromocion
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ mensaje: 'Error al crear la promoción', error: error.message });
    }
  },

  async actualizarPromocion(req, res) {
    try {
      const { id } = req.params;
      const { nombre, descripcion, fecha_inicio, fecha_fin, tipo, valor } = req.body || {};

      // Validaciones
      if (!nombre && !descripcion && !fecha_inicio && !fecha_fin && !tipo && valor == null) {
        return res.status(400).json({ mensaje: 'Debe enviar al menos un campo para actualizar' });
      }

      const promocionActualizada = await PromocionesVendedorModelo.actualizarPromocion(id, req.body);
      if (!promocionActualizada) {
        return res.status(404).json({ mensaje: 'Promoción no encontrada' });
      }

      console.log('Promoción actualizada:', promocionActualizada);
      res.json({ mensaje: 'Promoción actualizada correctamente', data: promocionActualizada });
    } catch (error) {
      console.error(error);
      res.status(500).json({ mensaje: 'Error al actualizar la promoción', error: error.message });
    }
  },

  async eliminarPromocion(req, res) {
    try {
      const { id } = req.params;
      const promocionEliminada = await PromocionesVendedorModelo.eliminarPromocion(id);

      if (!promocionEliminada) {
        return res.status(404).json({ mensaje: 'Promoción no encontrada' });
      }

      console.log('Promoción eliminada:', promocionEliminada);
      res.json({ mensaje: 'Promoción eliminada correctamente', data: promocionEliminada });
    } catch (error) {
      console.error(error);
      res.status(500).json({ mensaje: 'Error al eliminar la promoción', error: error.message });
    }
  }
};

export default PromocionesVendedorControlador;
