// CrearProductosControlador.js
import Producto from '../modelo/CrearProductosVendedorModelo.js'
import pool from '../modelo/db/Conexion.js';


export const CrearProductosVendedorControlador = {
    // Obtener todos los productos
    async obtenerProductos(req, res) {
        try {
            const result = await pool.query('SELECT * FROM productos');
            console.log('📦 Resultado de la búsqueda:', result.rows);

            return res.status(200).json({
                mensaje: 'Productos obtenidos correctamente',
                agricultor: result.rows
            });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Error al obtener los productos' });
        }
    },

    async obtenerProId(req, res) {
        const { id } = req.params;
        console.log('🆔 ID recibido:', id);

        if (isNaN(Number(id))) {
            return res.status(400).json({ mensaje: 'ID inválido' });
        }

        try {
            const model = new Producto();
            const producto = await model.buscarProId(id);

            if (!producto) {
                return res.status(404).json({ mensaje: 'Producto no encontrado' });
            }

            return res.status(200).json({
                mensaje: "producto encontrado correctamente",
                producto: producto
            });
        } catch (error) {
            console.error('❌ Error al obtener producto por ID:', error);
            return res.status(500).json({ mensaje: 'Error al obtener el producto' });
        }
    },


    // Crear producto
    async crearProductos(req, res) {
        try {
            const {
                idvendedor,
                nombre,
                descripcion,
                categoria,
                tipo_producto,
                unidad_medida,
                cantidad_por_unidad,
                precio,
                stock,
                disponible,
                fecha_cosecha,
                fecha_expiracion,
                origen,
                metodo_produccion,
                certificacion,
                imagen_principal,
                imagen_galeria
            } = req.body;

            // Campos obligatorios
            const camposObligatorios = {
                idvendedor,
                nombre,
                descripcion,
                categoria,
                tipo_producto,
                unidad_medida,
                cantidad_por_unidad,
                precio,
                stock,
                disponible,
                fecha_cosecha,
                fecha_expiracion,
                origen,
                metodo_produccion,
                certificacion,
                imagen_principal,
                imagen_galeria
            };

            // Verificar si falta algún campo
            const camposFaltantes = Object.entries(camposObligatorios)
                .filter(([key, value]) => value === undefined || value === null || value === '')
                .map(([key]) => key);

            if (camposFaltantes.length > 0) {
                return res.status(400).json({
                    message: 'Faltan campos obligatorios',
                    camposFaltantes
                });
            }

            // Inserción en la base de datos
            const result = await pool.query(
                `INSERT INTO productos (
                idvendedor, nombre, descripcion, categoria, tipo_producto,
                unidad_medida, cantidad_por_unidad, precio, descuento, stock,
                disponible, fecha_cosecha, fecha_expiracion, origen, metodo_produccion,
                certificacion, imagen_principal, imagen_galeria
            ) VALUES (
                $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18
            ) RETURNING *`,
                [
                    idvendedor, nombre, descripcion, categoria, tipo_producto,
                    unidad_medida, cantidad_por_unidad, precio, req.body.descuento, stock,
                    disponible, fecha_cosecha, fecha_expiracion, origen, metodo_produccion,
                    certificacion, imagen_principal, imagen_galeria
                ]
            );

            res.status(201).json({
                mensaje: 'Producto creado correctamente',
                vendedor: (result.rows[0])
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Error al crear el producto' });
        }
    },


    // Actualizar producto
    async actualizarProductos(req, res) {
        try {
            const { id } = req.params;
            const {
                nombre,
                descripcion,
                categoria,
                tipo_producto,
                precio,
                descuento,
                stock,
                disponible
            } = req.body || {};

            const result = await pool.query(
                `UPDATE productos SET 
        nombre=$1,
        descripcion=$2,
        categoria=$3,
        tipo_producto=$4,
        precio=$5,
        descuento=$6,
        stock=$7,
        disponible=$8,
        fecha_actualizacion=NOW()
       WHERE idproducto=$9 RETURNING *`,
                [nombre, descripcion, categoria, tipo_producto, precio, descuento, stock, disponible, id]
            );


            res.json(result.rows[0]);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Error al actualizar el producto' });
        }

    },
    // Eliminar producto
    async eliminarProductos(req, res) {
        try {
            const { id } = req.params;
            // Obtener el producto antes de eliminarlo
            const result = await pool.query('SELECT * FROM productos WHERE idproducto = $1', [id]);
            if (result.rows.length === 0) {
                return res.status(404).json({ message: 'Producto no encontrado' });
            }
            const productoEliminado = result.rows[0];
            // Eliminar el producto
            await pool.query('DELETE FROM productos WHERE idproducto = $1', [id]);
            // Retornar el producto eliminado
            res.json({
                message: 'Producto eliminado correctamente',
                producto: productoEliminado
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Error al eliminar el producto' });
        }
    }
}

export default CrearProductosVendedorControlador