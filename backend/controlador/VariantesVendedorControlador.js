// backend/controlador/VariantesControlador.js
import VariantesVendedorModelo from '../modelo/VariantesVendedorModelo.js';

export const VariantesVendedorControlador = {

    // Obtener todas las variantes de un producto
 async obtenerVariantes(req, res) {
  try {
    const variantes = await VariantesVendedorModelo.obtenerVariantes();
    console.log('variantes obtenidas:', variantes);

    res.json({ mensaje: 'variantes obtenidas correctamente', variantes: variantes });
  } catch (error) {
    console.error('Error en obtenerVariantes:', error);
    return res.status(500).json({ error: error.message });
  }
},

  // Obtener variante por ID
  async obtenerVarianteId(req, res) {
    try {
      const { id } = req.params;
      console.log(`Buscando variante con id = ${id}`);

      const variante = await VariantesVendedorModelo.obtenerVarianteId(id);

      if (!variante) {
        console.warn(`Variante no encontrada con id = ${id}`);
        return res.status(404).json({ error: 'Variante no encontrada' });
      }

      console.log('Variante encontrada:', variante);
       res.json({ mensaje: 'variante obtenida correctamente', variantes: variante });
    } catch (error) {
      console.error('Error en obtenerVarianteId:', error);
      res.status(500).json({ error: error.message });
    }
  },

  // Crear una nueva variante
  async crearVariante(req, res) {
    try {
      const data = req.body;
      console.log('Creando variante con datos:', data);

      const nuevaVariante = await VariantesVendedorModelo.crearVariante(data);
      console.log('Variante creada correctamente:', nuevaVariante);

     res.json({ mensaje: 'variante Creada correctamente', variantes: nuevaVariante });
    } catch (error) {
      console.error('Error en crearVariante:', error);
      res.status(500).json({ error: error.message });
    }
  },

  // Actualizar variante
  async actualizarVariante(req, res) {
    try {
      const { id } = req.params;
      const data = req.body;
      console.log(`Actualizando variante ${id} con datos:`, data);

      const varianteActualizada = await VariantesVendedorModelo.actualizarVariante(id, data);

      if (!varianteActualizada) {
        console.warn(`Variante no encontrada para actualizar con id=${id}`);
        return res.status(404).json({ error: 'Variante no encontrada' });
      }

      console.log('Variante actualizada correctamente:', varianteActualizada);
       res.json({ mensaje: 'Variante actualizada correctamente', variantes: varianteActualizada });
    } catch (error) {
      console.error('Error en actualizarVariante:', error);
      res.status(500).json({ error: error.message });
    }
  },

  // Eliminar variante
  async eliminarVariante(req, res) {
    try {
      const { id } = req.params;
      console.log(`Eliminando variante con id=${id}`);

      const varianteEliminada = await VariantesVendedorModelo.eliminarVariante(id);

      if (!varianteEliminada) {
        console.warn(`Variante no encontrada para eliminar con id=${id}`);
        return res.status(404).json({ error: 'Variante no encontrada' });
      }

      console.log('Variante eliminada correctamente:', varianteEliminada);
       res.json({ mensaje: 'variante Creada correctamente', varianteEliminada: varianteEliminada });
    } catch (error) {
      console.error('Error en eliminarVariante:', error);
      res.status(500).json({ error: error.message });
    }
  }

};

export default VariantesVendedorControlador;
