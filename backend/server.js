import { probarConexion } from './configuracion/db.js';
import express from 'express';
import LoginVendedorRutas from './vista/LoginVendedorRutas.js';
import CrearVendedorRutas from './vista/CrearVendedorRutas.js'
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


const app = express();

// Para poder leer JSON en req.body
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rutas de la API
app.use('/api/login', LoginVendedorRutas); // todas las rutas de login quedarán en /api/login
app.use('/api/vendedor', CrearVendedorRutas); // todas las rutas del agricultores quedaran en /api/agricultores
app.use('/api/productos', CrearProductosRutas); // todas las rutas de productos en /api/productos
app.use('/api/inventarios', InventarioRutas); // todas las rutas de inventario en /api/inventario
app.use('/api/detalleproduc', DetalleProduRutas ) // todas las rutas de detalle_producto queda en 
app.use('/api/promociones', PromocionesRutas) // todas las rutas de promociones queda en  /api/promociones
app.use('/', ReporVentasRutas) // todas las rutas de reportes de ventas queda en '/'
app.use('/api/pedidos', PedidosRutas) // todas las rutas de pedidos queda en /api/pedidos
app.use('/api/ventas', VentasRutas) // todas las rutas de ventas queda en /api/ventas
app.use('/api/perfil', PerfilVendedorRutas ) // todas las rutas de perfil queda en /api/perfil
app.use('/api/detallepedi', DetallePedidoRutas) // todas las rutas de detalle_pedido queda en /api/detallepedi
app.use('/api/devolucion', DevolucionRutas)
app.use('/api/variantes', VariantesControlador)


// Puerto
const PORT = process.env.PORT || 9696;

// Levantar servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});

probarConexion();