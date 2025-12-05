import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { probarConexion } from './configuracion/db.js';


// Cargar variables de entorno
dotenv.config();

// - - - - - - - - - - - Importar RUTAS de ADMIN - - - - - - - - - - - - //
import usuarioRoutes from './vista/usuarioRoutes.js';
import adminRoutes from './vista/adminRoutes.js';
// Módulo temporal - RF18: Estimación de costo de envío (pendiente de integración final)
//Requerimientos pendientes de admin
// - - - - - - - - - - - Importar RUTAS de VENDEDOR - - - - - - - - - - - - //
import LoginVendedorRutas from './vista/LoginVendedorRutas.js';
import CrearVendedorRutas from './vista/CrearVendedorRutas.js';
import CrearProductosRutas from './vista/CrearProductosVendedorRutas.js'
import InventarioRutas from './vista/InventarioVendedorRutas.js'
import DetalleProduRutas from './vista/DetalleProduVendedorRutas.js'
import PedidosRutas from './vista/PedidosVendedorRutas.js'
import PromocionesRutas from './vista/PromocionesVendedorRutas.js'
import ReporVentasRutas from './vista/ReporVentasVendedorRutas.js'
import VentasRutas from './vista/VentasVendedorRutas.js'
import PerfilVendedorRutas from './vista/PerfilVendedorRutas.js'
import DetallePedidoRutas from './vista/DetallePedidoVendedorRutas.js'
import DevolucionRutas from './vista/DevolucionVendedorRutas.js'
import VariantesControlador from './vista/VariantesVendedorRutas.js';

// Crear aplicación Express
const app = express();
const PORT = process.env.PORT || 3000;

// - - - - - - - - - - - - -Middlewares- - - - - - - - - - - - -//
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Middleware para logging de requests
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
    next();
});

// Rutas principales
app.get('/', (req, res) =>{
    res.json({
        mensaje: 'API MiCampoFresco',
        version: '1,0,0',
        modulos: ['Admin', 'Usuarios', 'Vendedor']
    });
});

// - - - - - - - - - -RUTAS ADMIN- - - - - - - - - -
console.log('🔗 Registrando rutas de administrador...');
app.use('/api', adminRoutes); // Rutas de administrador (login-admin, perfil)
console.log('🔗 Registrando rutas de usuarios...');
app.use('/api/usuarios', usuarioRoutes);
// - - - - - - - - - -TEMPORAL- - - - - - - - - -
//Requerimientos faltantes de admin

// - - - - - - - - - -RUTAS VENDEDOR- - - - - - - - - -
app.use('/api/login', LoginVendedorRutas); // todas las rutas de login quedarán en /api/login
app.use('/api/vendedor', CrearVendedorRutas); // todas las rutas del agricultores quedaran en /api/agricultores
app.use('/api/productos', CrearProductosRutas); // todas las rutas de productos en /api/productos
app.use('/api/inventarios', InventarioRutas); // todas las rutas de inventario en /api/inventario
app.use('/api/detalleproduc', DetalleProduRutas ), // todas las rutas de detalle_producto queda en 
app.use('/api/promociones', PromocionesRutas); // todas las rutas de promociones queda en  /api/promociones
app.use('/', ReporVentasRutas); // todas las rutas de reportes de ventas queda en '/'
app.use('/api/pedidos', PedidosRutas); // todas las rutas de pedidos queda en /api/pedidos
app.use('/api/ventas', VentasRutas); // todas las rutas de ventas queda en /api/ventas
app.use('/api/perfil', PerfilVendedorRutas ), // todas las rutas de perfil queda en /api/perfil
app.use('/api/detallepedi', DetallePedidoRutas); // todas las rutas de detalle_pedido queda en /api/detallepedi
app.use('/api/devolucion', DevolucionRutas);
app.use('/api/variantes', VariantesControlador);

// - - - - -Middleware para manejo de rutas no encontradas- - - - -
app.use((req, res) => {
    res.status(404).json({
        error: 'Ruta no encontrada',
        mensaje: 'El endpoint solicitado no existe'
    });
});

// Middleware para manejo de errores
app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(500).json({
        error: 'Error interno del servidor',
        mensaje: 'Ha ocurrido un error inesperado'
    });
});


// Iniciar servidor
app.listen(PORT, async () => {
    console.log(` Servidor ejecutándose en http://localhost:${PORT}`);

    // Probar conexión a la base de datos
    await probarConexion();
});

export default app;