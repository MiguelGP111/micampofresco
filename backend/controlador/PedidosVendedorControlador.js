import PedidosVendedorModelo from '../modelo/PedidosVendedorModelo.js';

const PedidosVendedorControlador = {

    // Listar todos los pedidos
    async listarPedidos(req, res) {
        try {
            const pedidos = await PedidosVendedorModelo.listarPedidos();
            console.log('Pedidos listados:', pedidos);
            res.json({
                mensaje: 'Pedidos obtenidos correctamente',
                pedidos
            });
        } catch (error) {
            console.error('Error al listar pedidos:', error.message);
            res.status(500).json({
                mensaje: 'Error al obtener pedidos',
                error: error.message
            });
        }
    },

    // Buscar pedido por ID
    async buscarPedidoId(req, res) {
        try {
            const { id } = req.params;
            const pedido = await PedidosVendedorModelo.buscarPedidoId(id);
            console.log('Pedido encontrado:', pedido);
            res.json({
                mensaje: 'Pedido encontrado correctamente',
                pedido
            });
        } catch (error) {
            console.error('Error al buscar pedido:', error.message);
            res.status(404).json({
                mensaje: 'Error al buscar pedido',
                error: error.message
            });
        }
    },

    // Crear un pedido
    async crearPedido(req, res) {
        try {
            const pedido = await PedidosVendedorModelo.crearPedido(req.body);
            console.log('Pedido creado:', pedido);
            res.status(201).json({
                mensaje: 'Pedido creado correctamente',
                pedido
            });
        } catch (error) {
            console.error('Error al crear pedido:', error.message);
            res.status(400).json({
                mensaje: 'Error al crear pedido',
                error: error.message
            });
        }
    },

    // Actualizar pedido
    async actualizarPedido(req, res) {
        try {
            const { id } = req.params;
            const pedido = await PedidosVendedorModelo.actualizarPedido(id, req.body);
            console.log('Pedido actualizado:', pedido);
            res.json({
                mensaje: 'Pedido actualizado correctamente',
                pedido
            });
        } catch (error) {
            console.error('Error al actualizar pedido:', error.message);
            res.status(400).json({
                mensaje: 'Error al actualizar pedido',
                error: error.message
            });
        }
    },

    // Eliminar pedido
    async eliminarPedido(req, res) {
        try {
            const { id } = req.params;
            const pedido = await PedidosVendedorModelo.eliminarPedido(id);
            console.log('Pedido eliminado:', pedido);
            res.json({
                mensaje: 'Pedido eliminado correctamente',
                pedido
            });
        } catch (error) {
            console.error('Error al eliminar pedido:', error.message);
            res.status(400).json({
                mensaje: 'Error al eliminar pedido',
                error: error.message
            });
        }
    }
};

export default PedidosVendedorControlador;
