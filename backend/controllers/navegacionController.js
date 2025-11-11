import {
  getCategorias,
  getProductos,
  getPromociones
} from '../models/navegacionModel.js';

/**
 * Controlador para listar todas las categorías
 */
export const listarCategorias = async (req, res) => {
  try {
    const categorias = await getCategorias();

    if (!categorias || categorias.length === 0) {
      console.warn('listarCategorias: no se encontraron categorías');
      return res.status(404).json({
        error: 'Categorías no disponibles'
      });
    }

    console.log(`listarCategorias: ${categorias.length} categorías encontradas`);
    res.json({
      success: true,
      message: 'Categorías cargadas correctamente',
      data: categorias
    });
  } catch (error) {
    console.error('Error en listarCategorias:', error);
    res.status(500).json({
      error: 'Error en la navegación'
    });
  }
};

/**
 * Controlador para listar todos los productos
 */
export const listarProductos = async (req, res) => {
  try {
    const productos = await getProductos();

    if (!productos || productos.length === 0) {
      console.warn('listarProductos: no se encontraron productos');
      return res.status(404).json({
        error: 'No hay productos disponibles'
      });
    }

    console.log(`listarProductos: ${productos.length} productos encontrados`);
    res.json({
      success: true,
      message: 'Productos cargados correctamente',
      data: productos
    });
  } catch (error) {
    console.error('Error en listarProductos:', error);
    res.status(500).json({
      error: 'Error en la navegación'
    });
  }
};

/**
 * Controlador para listar promociones activas
 */
export const listarPromociones = async (req, res) => {
  try {
    const promociones = await getPromociones();

    if (!promociones || promociones.length === 0) {
      console.warn('listarPromociones: no se encontraron promociones activas');
      return res.status(404).json({
        error: 'No hay promociones activas'
      });
    }

    console.log(`listarPromociones: ${promociones.length} promociones activas`);
    res.json({
      success: true,
      message: 'Promociones cargadas correctamente',
      data: promociones
    });
  } catch (error) {
    console.error('Error en listarPromociones:', error);
    res.status(500).json({
      error: 'Error en la navegación'
    });
  }
};
