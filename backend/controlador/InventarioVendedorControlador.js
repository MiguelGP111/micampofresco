// src/controlador/InventarioControlador.js
import InventarioVendedorModelo from '../modelo/InventarioVendedorModelo.js';

export const InventarioVendedorControlador = {

    // GET /inventario
    async listarInventario(req, res) {
        try {
            const idvendedor = req.user?.id;
            if (!idvendedor) return res.status(400).json({ mensaje: 'ID de usuario inválido' });

            const inventario = await InventarioVendedorModelo.obtenerInventario(idvendedor) || [];;

            console.log('📦 Resultado de la búsqueda:');
            console.log('📦  listado de inventarios:', inventario, )
            return res.status(200).json({
                mensaje: 'Inventario listado correctamente',
                inventario: inventario
            });

        } catch (error) {
            console.error('Error al listar inventario:', error);
            res.status(500).json({ mensaje: 'Error al listar inventario', detalle: error.message });
        }
    },

    // GET /inventario/:id
    async obtenerInventarId(req, res) {
        try {
            const { id } = req.params;
            if (isNaN(Number(id))) return res.status(400).json({ mensaje: 'ID inválido' });

            const inventario = await InventarioVendedorModelo.obtenerInventarioId(id); // obtenemos el inventario

            if (!inventario || inventario.length === 0) {
                return res.status(404).json({ mensaje: 'Inventario no encontrado' });
            }

            console.log('📦 Resultado de la búsqueda:', inventario);

            res.status(200).json({
                mensaje: 'Inventario encontrado correctamente',
                inventarios: inventario
            });
        } catch (error) {
            console.error('Error al obtener inventario:', error);
            res.status(500).json({ mensaje: 'Error al obtener inventario', detalle: error.message });
        }
    },

    // POST /inventario
    async crearInventario(req, res) {
        try {
            const { idproducto, cantidad_disponible, precio, stock_minimo, stock_maximo, estado, ultimo_ingreso, ultimo_salida } = req.body;
            const idvendedor = req.user.id; // obtener del token

            if (!idproducto || !idvendedor) {
                return res.status(400).json({ mensaje: 'idproducto e idusuario son obligatorios' });
            }

            const nuevoInventario = await InventarioVendedorModelo.crearInventario({
                idproducto,
                idvendedor,
                cantidad_disponible,
                precio,
                stock_minimo,
                stock_maximo,
                estado,
                ultimo_ingreso,
                ultimo_salida
            });
            console.log('Inventario creado correctamente', nuevoInventario)
            res.status(201).json({
                mensaje: 'Inventario creado correctamente',
                inventario: nuevoInventario
            });
        } catch (error) {
            console.error('Error al crear inventario:', error);
            res.status(500).json({
                mensaje: 'No se pudo crear el inventario', detalle: error.message
            });
        }
    },

    // PUT /inventario/:id
    async actualizarInventario(req, res) {
        try {
            const { id } = req.params;
            const data = req.body;

            if (isNaN(Number(id))) return res.status(400).json({ mensaje: 'ID inválido' });
            if (!data || Object.keys(data).length === 0) return res.status(400).json({ mensaje: 'No hay datos para actualizar' });

            const actualizado = await InventarioVendedorModelo.actualizarInventario(id, data);
            if (!actualizado) return res.status(404).json({ mensaje: 'Inventario no encontrado' });

            res.status(200).json({
                mensaje: 'Inventario actualizado correctamente',
                inventario: actualizado
            });
        } catch (error) {
            console.error('Error al actualizar inventario:', error);
            res.status(500).json({ mensaje: 'Error al actualizar inventario', detalle: error.message });
        }
    },

    // DELETE /inventario/:id
    async eliminarInventario(req, res) {
        try {
            const { id } = req.params;

            if (isNaN(Number(id))) return res.status(400).json({ mensaje: 'ID inválido' });

            const eliminado = await InventarioVendedorModelo.eliminarInventario(id);
            if (!eliminado) return res.status(404).json({ mensaje: 'Inventario no encontrado' });

            res.status(200).json({
                mensaje: 'Inventario eliminado correctamente',
                inventario: eliminado
            });
        } catch (error) {
            console.error('Error al eliminar inventario:', error);
            res.status(500).json({ mensaje: 'Error al eliminar inventario', detalle: error.message });
        }
    }
};

export default InventarioVendedorControlador;
