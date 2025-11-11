# Navegación Web - Campofresco (RF39)

Sistema de navegación web para explorar categorías de productos, precios y promociones. Implementado siguiendo la arquitectura Modelo-Vista-Controlador (MVC).

## 📋 Requisitos

- Node.js (v14 o superior)
- PostgreSQL (v12 o superior)
- npm o yarn

## 🚀 Instalación

1. **Instalar dependencias:**
   ```bash
   npm install
   ```

2. **Configurar variables de entorno:**
   - Copia el archivo `.env.example` y renómbralo a `.env`
   - Configura las variables de conexión a PostgreSQL:
     ```
     DB_HOST=localhost
     DB_PORT=5432
     DB_NAME=campofresco
     DB_USER=postgres
     DB_PASSWORD=tu_password
     PORT=3000
     ```

3. **Inicializar la base de datos:**
   ```bash
   npm run init-db
   ```
   Este script creará las tablas necesarias e insertará datos de ejemplo.

4. **Iniciar el servidor:**
   ```bash
   npm start
   ```
   O en modo desarrollo:
   ```bash
   npm run dev
   ```

## 📁 Estructura del Proyecto

```
NavegacionWebCampofresco/
├── config/
│   └── db.js                # Configuración de PostgreSQL
├── controllers/
│   └── navegacionController.js  # Lógica de negocio
├── models/
│   └── navegacionModel.js       # Consultas SQL y seed de datos
├── vista/
│   └── navegacionVista.js       # Definición de rutas REST
├── scripts/
│   └── initDatabase.js          # Script de inicialización
├── app.js                       # Aplicación principal
├── package.json
└── README.md
```

## 🔌 Endpoints API

### GET /navegacion/categorias
Obtiene todas las categorías de productos.

**Respuesta exitosa:**
```json
{
  "success": true,
  "message": "Categorías obtenidas exitosamente",
  "data": [
    {
      "id": 1,
      "nombre": "Frutas",
      "descripcion": "Frutas frescas y de temporada"
    }
  ]
}
```

**Respuesta de error:**
```json
{
  "success": false,
  "message": "Categorías no disponibles",
  "data": []
}
```

### GET /navegacion/productos
Obtiene todos los productos disponibles con su información.

**Respuesta exitosa:**
```json
{
  "success": true,
  "message": "Productos obtenidos exitosamente",
  "data": [
    {
      "id": 1,
      "nombre": "Manzana Roja",
      "precio": "2500.00",
      "id_categoria": 1,
      "en_promocion": false,
      "descuento": "0.00",
      "categoria_nombre": "Frutas"
    }
  ]
}
```

**Respuesta de error:**
```json
{
  "success": false,
  "message": "No hay productos disponibles",
  "data": []
}
```

### GET /navegacion/promociones
Obtiene todas las promociones activas.

**Respuesta exitosa:**
```json
{
  "success": true,
  "message": "Promociones obtenidas exitosamente",
  "data": [
    {
      "id": 2,
      "nombre": "Banano",
      "precio": "1800.00",
      "descuento": "15.00",
      "id_categoria": 1,
      "categoria_nombre": "Frutas",
      "precio_descuento": "1530.00"
    }
  ]
}
```

**Respuesta de error:**
```json
{
  "success": false,
  "message": "No hay promociones disponibles",
  "data": []
}
```

## 🗄️ Estructura de Base de Datos

### Tabla: categorias
- `id` (SERIAL PRIMARY KEY)
- `nombre` (VARCHAR(100) NOT NULL UNIQUE)
- `descripcion` (TEXT)

### Tabla: productos
- `id` (SERIAL PRIMARY KEY)
- `nombre` (VARCHAR(200) NOT NULL)
- `precio` (DECIMAL(10, 2) NOT NULL)
- `id_categoria` (INTEGER REFERENCES categorias(id))
- `en_promocion` (BOOLEAN DEFAULT FALSE)
- `descuento` (DECIMAL(5, 2) DEFAULT 0)

## 🔧 Tecnologías Utilizadas

- **Express.js** - Framework web
- **PostgreSQL** - Base de datos
- **pg** - Cliente PostgreSQL para Node.js
- **CORS** - Habilitación de CORS
- **dotenv** - Gestión de variables de entorno
- **bcrypt** - Encriptación (disponible para futuras funcionalidades)
- **jsonwebtoken** - Autenticación JWT (disponible para futuras funcionalidades)

## 📝 Caso de Uso (CU39)

**Actor:** Usuario

**Flujo Principal:**
1. Ver categorías de productos
2. Ver precios
3. Ver promociones
4. El usuario ha navegado exitosamente por las categorías de productos

**Flujos Alternos:**
- Categorías no disponibles
- Error en la navegación
- Precios incorrectos

## 🐛 Manejo de Errores

El sistema maneja los siguientes errores:
- Categorías no disponibles → HTTP 404
- No hay productos disponibles → HTTP 404
- No hay promociones disponibles → HTTP 404
- Error en la navegación → HTTP 500

Todos los errores devuelven respuestas JSON con el formato:
```json
{
  "success": false,
  "message": "Mensaje de error descriptivo",
  "data": []
}
```

## 🧪 Pruebas en Postman - RF39 Navegación Web

Este módulo permite navegar por categorías, productos y promociones de la tienda Campofresco mediante la API REST `http://localhost:3000/navegacion`. No requiere autenticación.

### Pasos para probar en Postman

1. Asegúrate de tener el servidor corriendo:
   ```bash
   npm run watch
   ```
2. Abre Postman y crea una nueva petición `GET`.
3. Usa una de las siguientes URLs por petición y presiona **Send**:
   - `http://localhost:3000/navegacion/categorias`
   - `http://localhost:3000/navegacion/productos`
   - `http://localhost:3000/navegacion/promociones`
4. Headers: no se requiere ningún header adicional (Postman enviará `Accept: application/json` por defecto).
5. Verifica que la consola del servidor muestre logs informativos (cantidad de registros) y que la respuesta sea un JSON válido similar a los ejemplos.

### Ejemplos de respuesta esperada

- Categorías
  ```json
  {
    "success": true,
    "message": "Categorías cargadas correctamente",
    "data": [
      { "id": 1, "nombre": "Frutas" },
      { "id": 2, "nombre": "Verduras" }
    ]
  }
  ```
- Productos
  ```json
  {
    "success": true,
    "message": "Productos cargados correctamente",
    "data": [
      {
        "id": 1,
        "nombre": "Manzana Roja",
        "precio": "2500.00",
        "id_categoria": 1,
        "en_promocion": false,
        "descuento": "0.00",
        "categoria": "Frutas"
      }
    ]
  }
  ```
- Promociones
  ```json
  {
    "success": true,
    "message": "Promociones cargadas correctamente",
    "data": [
      {
        "id": 4,
        "nombre": "Tomate",
        "precio": "3000.00",
        "descuento": "15.00",
        "id_categoria": 2,
        "categoria": "Verduras",
        "precio_descuento": "2550.00"
      }
    ]
  }
  ```

### Tabla de endpoints

| Endpoint                    | Método | Descripción                    | Ejemplo de respuesta                                |
|-----------------------------|--------|--------------------------------|-----------------------------------------------------|
| `/navegacion/categorias`    | GET    | Obtiene todas las categorías   | `[{ "id": 1, "nombre": "Frutas" }]`              |
| `/navegacion/productos`     | GET    | Lista todos los productos      | `[{ "id": 1, "nombre": "Manzana Roja" }]`       |
| `/navegacion/promociones`   | GET    | Muestra productos en promoción | `[{ "id": 2, "nombre": "Banano", "descuento": 15 }]` |

## 📄 Licencia

ISC

