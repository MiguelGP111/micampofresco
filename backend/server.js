import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { probarConexion } from './admin/configuracion/db.js';

// Cargar variables de entorno
dotenv.config();

// Importar rutas
import usuarioRoutes from './admin/vista/usuarioRoutes.js';
import adminRoutes from './admin/vista/adminRoutes.js';

// Crear aplicación Express
const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Middleware para logging de requests
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
    next();
});

// Rutas principales
app.get('/', (req, res) => {
    res.json({
        mensaje: 'API MiCampoFresco Admin - Sistema de gestión de usuarios',
        version: '1.0.0',
        endpoints: {
            loginAdmin: '/api/login-admin',
            loginUsuario: '/api/usuarios/login-usuario',
            usuarios: '/api/usuarios',
            perfil: '/api/admin/perfil'
        }
    });
});

// Rutas de la API
console.log('🔗 Registrando rutas de administrador...');
app.use('/api', adminRoutes); // Rutas de administrador (login-admin, perfil)
console.log('🔗 Registrando rutas de usuarios...');
app.use('/api/usuarios', usuarioRoutes);

// Middleware para manejo de rutas no encontradas
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
    console.log(`🚀 Servidor ejecutándose en puerto ${PORT}`);
    console.log(`📊 API disponible en: http://localhost:${PORT}`);
    console.log(`🔐 Login admin: http://localhost:${PORT}/api/login-admin`);
    console.log(`👤 Login usuario: http://localhost:${PORT}/api/usuarios/login-usuario`);
    console.log(`👤 Perfil admin: http://localhost:${PORT}/api/admin/perfil`);
    console.log(`📋 Usuarios: http://localhost:${PORT}/api/usuarios`);
    console.log(`🌍 Entorno: ${process.env.NODE_ENV || 'development'}`);
    
    // Probar conexión a la base de datos
    await probarConexion();
});

export default app;