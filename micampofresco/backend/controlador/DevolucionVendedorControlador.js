// src/controlador/DevolucionControlador.js
import DevolucionVendedorModelo from '../modelo/DevolucionVendedorModelo.js';

export const DevolucionVendedorControlador = {

  // GET /devoluciones/:idusuario
  async listarDevoluciones(req, res) {
    try {
      const { idusuario }  = req.query;
      const devoluciones = await DevolucionVendedorModelo.obtenerDevoluciones(idusuario);
      console.log("Listado de Devolucion:", devoluciones);
      res.status(200).json({ mensaje: 'Devoluciones listadas correctamente', devoluciones: devoluciones });
    } catch (error) {
      console.error('Error al listar devoluciones:', error);
      res.status(500).json({ mensaje: 'Error al listar devoluciones', detalle: error.message });
    }
  },

  // GET /devolucion/:idevolucion
  async obtenerDevolucionId(req, res) {
    try {
      const { id } = req.params;
      const devolucion = await DevolucionVendedorModelo.obtenerDevolucionPorId(id);
      if (!devolucion) {
        return res.status(404).json({ mensaje: 'Devolucion  no encontrada' });
      }
      console.log(' Devolucion encontrada:', devolucion);
      res.status(200).json({ mensaje: 'Devolución encontrada correctamente', devolucion: devolucion });
    } catch (error) {
      console.error('Error al obtener devolución:', error);
      res.status(500).json({ mensaje: 'Error al obtener devolución', detalle: error.message });
    }
  },

  // POST /devolucion
  // POST /devolucion
async crearDevolucion(req, res) {
  try {
    const {  idpedido, idvendedor, motivo, estado } = req.body;

    // Validación de campos obligatorios
    if ( !idpedido || !idvendedor || !motivo || !estado) {
      return res.status(400).json({ mensaje: 'Todos los campos son obligatorios' });
    }

    // Normalizar estado a minúsculas para cumplir con la restricción CHECK
    const estadoNormalizado = estado.toLowerCase();

    const nuevaDevolucion = await DevolucionVendedorModelo.crearDevolucion({
      idpedido,
      idvendedor,
      motivo,
      estado: estadoNormalizado
    });

    console.log('Devolución creada:', nuevaDevolucion);
    res.status(201).json({
      mensaje: 'Devolución creada correctamente',
      devolucion: nuevaDevolucion
    });
  } catch (error) {
    console.error('Error al crear devolución:', error);
    res.status(500).json({ mensaje: 'No se pudo crear la devolución', detalle: error.message });
  }
}
,

  // PUT /devolucion/:idevolucion
  async actualizarDevolucion(req, res) {
  try {
    const { id } = req.params;
    const data = req.body;

    if (isNaN(Number(id))) {
      return res.status(400).json({ mensaje: 'ID de devolución inválido' });
    }

    if (!data || Object.keys(data).length === 0) {
      return res.status(400).json({ mensaje: 'No hay datos para actualizar' });
    }
    const actualizado = await DevolucionVendedorModelo.actualizarDevolucion(id, data);
    if (!actualizado) {
      return res.status(404).json({ mensaje: 'Devolución no encontrada' });
    }
 
    console.log({
      mensaje: 'Devolución actualizada correctamente',
      devolucion: actualizado });
    res.status(200).json({
      mensaje: 'Devolución actualizada correctamente',
      devolucion: actualizado
    });
  } catch (error) {
    console.error('Error al actualizar devolución:', error);
    res.status(500).json({
      mensaje: 'Error al actualizar devolución',
      detalle: error.message
    });
  }
},

  // DELETE /devolucion/:idevolucion
  async eliminarDevolucion(req, res) {
    try {
      const { id } = req.params;
      if (isNaN(Number(id))) return res.status(400).json({ mensaje: 'ID inválido' });

      const eliminado = await DevolucionVendedorModelo.eliminarDevolucion(id);
      if (!eliminado) return res.status(404).json({ mensaje: 'Devolución no encontrada' });

      res.status(200).json({ mensaje: 'Devolución eliminada correctamente', devolucion: eliminado });
    } catch (error) {
      console.error('Error al eliminar devolución:', error);
      res.status(500).json({ mensaje: 'Error al eliminar devolución', detalle: error.message });
    }
  }
};

export default DevolucionVendedorControlador;
