import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import authRoutes from './Vista/vista.js';

// Cargar variables de entorno
dotenv.config();

// Crear aplicación Express
const app = express();



// Puerto del servidor
const PORT = process.env.PORT || 3000;

// Configurar __dirname para ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware para parsear JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Ruta raíz - sirve HTML si es navegador, JSON si es API
app.get('/', (req, res) => {
  const acceptHeader = req.headers.accept || '';
  // Si el cliente acepta HTML (navegador), servir el HTML
  if (acceptHeader.includes('text/html')) {
    return res.sendFile(path.join(__dirname, 'public', 'index.html'));
  }
  // De lo contrario, servir JSON (API)
  res.json({
    message: 'API de Autenticación - Mi Campo Fresco',
    version: '1.0.0',
    casosDeUso: {
      'CU40 - RF40': 'Registro de usuarios (correo o teléfono)',
      'CU38 - RF38': 'Recuperación de contraseña (correo o teléfono)'
    },
    endpoints: {
      registro: {
        method: 'POST',
        path: '/auth/registro',
        description: 'Registrar nuevo usuario (correo o teléfono)',
        tiposRegistro: ['correo', 'telefono'],
        roles: ['usuario (predeterminado)', 'administrador', 'agricultor'],
        nota: 'Si no se especifica un rol, se asignará "usuario" automáticamente'
      },
      login: {
        method: 'POST',
        path: '/auth/login',
        description: 'Iniciar sesión con correo y contraseña'
      },
      logout: {
        method: 'POST',
        path: '/auth/logout',
        description: 'Cerrar sesión (requiere autenticación JWT)'
      },
      recuperar: {
        method: 'POST',
        path: '/auth/recuperar',
        description: 'Solicitar recuperación de contraseña (correo o teléfono)'
      },
      restablecer: {
        method: 'POST',
        path: '/auth/restablecer',
        description: 'Restablecer contraseña con código de recuperación'
      },
      listarUsuarios: {
        method: 'GET',
        path: '/auth/usuarios',
        description: 'Listar usuarios (para pruebas, requiere autenticación JWT)'
      }
    },
    instrucciones: 'Usa Postman para probar los endpoints. Todos los datos se almacenan en memoria.',
    estructura: 'MVC (Modelo-Vista-Controlador)',
    interfazWeb: 'Visita http://localhost:' + PORT + '/ para usar la interfaz web de prueba'
  });
});

// Middleware para servir archivos estáticos desde la carpeta public
app.use(express.static(path.join(__dirname, 'public')));

// Rutas de autenticación
app.use('/auth', authRoutes);

// Manejo de rutas no encontradas
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Ruta no encontrada'
  });
});

// Manejo de errores
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({
    success: false,
    message: 'Error interno del servidor',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log('========================================');
  console.log('🚀 Servidor iniciado');
  console.log(`📍 Puerto: ${PORT}`);
  console.log(`🌐 URL: http://localhost:${PORT}`);
  console.log('========================================');
  console.log('\n📋 Endpoints disponibles:');
  console.log('  POST /auth/registro');
  console.log('  POST /auth/login');
  console.log('  POST /auth/logout');
  console.log('  POST /auth/recuperar');
  console.log('  POST /auth/restablecer');
  console.log('  GET  /auth/usuarios (para pruebas)');
  console.log('\n💡 Interfaz web disponible en: http://localhost:' + PORT);
  console.log('💡 También puedes usar Postman para probar los endpoints');
  console.log('========================================\n');
});

export default app;



