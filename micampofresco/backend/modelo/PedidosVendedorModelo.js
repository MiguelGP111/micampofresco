// backend/modelo/PedidosModelo.js
import { ejecutarConsulta } from '../configuracion/db.js';

const PedidosModelo = {

  async listarPedidos() {
    try {
      const result = await ejecutarConsulta('SELECT * FROM pedidos');
      return result.rows; // ← CORREGIDO
    } catch (error) {
      console.error('Error al listar pedidos:', error);
      throw new Error('No se pudieron obtener los pedidos');
    }
  },

  async buscarPedidoId(id) {
    if (!id || isNaN(Number(id))) throw new Error('idpedido inválido');

    try {
      const result = await ejecutarConsulta(
        'SELECT * FROM pedidos WHERE idpedido = $1',
        [id]
      );

      if (!result.rows[0]) throw new Error('Pedido no encontrado'); // ← CORREGIDO
      return result.rows[0];
    } catch (error) {
      console.error('Error al buscar pedido por ID:', error);
      throw new Error('No se pudo buscar el pedido');
    }
  },

  async crearPedido(data) {
    const { idproducto, idusuario, idvendedor, estado, fecha_pedido } = data;

    if (!idproducto || isNaN(Number(idproducto))) throw new Error('idproducto inválido');
    if (!idusuario || isNaN(Number(idusuario))) throw new Error('idusuario inválido');
    if (!idvendedor || isNaN(Number(idvendedor))) throw new Error('idvendedor inválido');
    if (!estado) throw new Error('estado obligatorio');
    if (!fecha_pedido || isNaN(Date.parse(fecha_pedido))) throw new Error('fecha_pedido inválida');

    try {
      const result = await ejecutarConsulta(
        `INSERT INTO pedidos (idproducto, idusuario, idvendedor, estado, fecha_pedido)
         VALUES ($1,$2,$3,$4,$5)
         RETURNING *`,
        [idproducto, idusuario, idvendedor, estado, fecha_pedido]
      );

      return result.rows[0]; // ← CORREGIDO
    } catch (error) {
      console.error('Error al crear pedido:', error);
      throw new Error('No se pudo crear el pedido');
    }
  },

  async actualizarPedido(id, data) {
    const { idproducto, idusuario, idvendedor, estado, fecha_pedido } = data;

    if (!id || isNaN(Number(id))) throw new Error('idpedido inválido');

    try {
      const result = await ejecutarConsulta(
        `UPDATE pedidos
         SET idproducto=$1,
             idusuario=$2,
             idvendedor=$3,
             estado=$4,
             fecha_pedido=$5
         WHERE idpedido=$6
         RETURNING *`,
        [idproducto, idusuario, idvendedor, estado, fecha_pedido, id]
      );

      if (!result.rows[0]) throw new Error('Pedido no encontrado'); // ← CORREGIDO
      return result.rows[0];
    } catch (error) {
      console.error('Error al actualizar pedido:', error);
      throw new Error('No se pudo actualizar el pedido');
    }
  },

  async eliminarPedido(id) {
    if (!id || isNaN(Number(id))) throw new Error('idpedido inválido');

    try {
      const result = await ejecutarConsulta(
        'DELETE FROM pedidos WHERE idpedido=$1 RETURNING *',
        [id]
      );

      if (!result.rows[0]) throw new Error('Pedido no encontrado'); // ← CORREGIDO
      return result.rows[0];
    } catch (error) {
      console.error('Error al eliminar pedido:', error);
      throw new Error('No se pudo eliminar el pedido');
    }
  }
};

export default PedidosModelo;

