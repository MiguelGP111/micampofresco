import PedidosVendedorModelo from '../modelo/PedidosVendedorModelo.js';

const PedidosVendedorControlador = {

    // Listar todos los pedidos
    async listarPedidos(req, res) {
        try {
            const pedidos = await PedidosVendedorModelo.listarPedidos();
            res.json({
                mensaje: 'Lista de pedidos obtenida exitosamente.',
                pedidos
            });
        } catch (error) {
            res.status(500).json({
                mensaje: 'No se pudieron obtener los pedidos. Intente nuevamente.',
                error: error.message
            });
        }
    },

    // Buscar pedido por ID
    async buscarPedidoId(req, res) {
        try {
            const { id } = req.params;

            // Validación de ID
            if (!id || isNaN(Number(id))) {
                return res.status(400).json({
                    mensaje: 'El ID enviado no es válido. Por favor, verifique y vuelva a intentarlo.'
                });
            }

            const pedido = await PedidosVendedorModelo.buscarPedidoId(id);

            if (!pedido) {
                return res.status(404).json({
                    mensaje: 'No se encontró ningún pedido con el ID proporcionado.'
                });
            }

            res.json({
                mensaje: 'Pedido encontrado exitosamente.',
                pedido
            });

        } catch (error) {
            res.status(500).json({
                mensaje: 'perdido con ese ID no encontrado.',
                error: error.message
            });
        }
    },

    // Crear pedido
    async crearPedido(req, res) {
        try {
            const pedido = await PedidosVendedorModelo.crearPedido(req.body);

            if (!pedido) {
                return res.status(400).json({
                    mensaje: 'No se pudo crear el pedido. Verifique los datos e intente nuevamente.'
                });
            }

            res.status(201).json({
                mensaje: 'Pedido creado exitosamente.',
                pedido
            });

        } catch (error) {
            res.status(400).json({
                mensaje: 'Hubo un problema al crear el pedido. Revise los datos enviados.',
                error: error.message
            });
        }
    },

    // Actualizar pedido
    async actualizarPedido(req, res) {
        try {
            const { id } = req.params;

            // Validación de ID
            if (!id || isNaN(Number(id))) {
                return res.status(400).json({
                    mensaje: 'El ID enviado no es válido. Por favor, verifique y vuelva a intentarlo.'
                });
            }

            const pedido = await PedidosVendedorModelo.actualizarPedido(id, req.body);

            if (!pedido) {
                return res.status(404).json({
                    mensaje: 'No se encontró ningún pedido con ese ID para actualizar.'
                });
            }

            res.json({
                mensaje: 'Pedido actualizado exitosamente.',
                pedido
            });

        } catch (error) {
            res.status(500).json({
                mensaje: 'perdido con ese ID no encontrado.',
                error: error.message
            });
        }
    },

    // Eliminar pedido
    async eliminarPedido(req, res) {
        try {
            const { id } = req.params;

            // Validación de ID
            if (!id || isNaN(Number(id))) {
                return res.status(400).json({
                    mensaje: 'El ID enviado no es válido. Por favor, verifique y vuelva a intentarlo.'
                });
            }

            const pedido = await PedidosVendedorModelo.eliminarPedido(id);

            if (!pedido) {
                return res.status(404).json({
                    mensaje: 'No se encontró ningún pedido con ese ID para eliminar.'
                });
            }

            res.json({
                mensaje: 'Pedido eliminado exitosamente.',
                pedido
            });

        } catch (error) {
            res.status(500).json({
                mensaje: 'perdido con ese ID no encontrado.',
                error: error.message
            });
        }
    }

};

export default PedidosVendedorControlador;
