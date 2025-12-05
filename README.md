# micampofresco
Integración, programación y despliegue del proyecto formativo MiCampoFresco.


MiCampoFresco es una aplicación que conecta directamente a los agricultores con los usuarios en la ciudad, ofreciendo productos frescos del campo a domicilio.
El sistema integra tres tipos de actores principales:
👨‍💻 Administrador (Miguel)
🧑‍🌾 Vendedor/Agricultor (Javier)
👤 Usuario/Cliente final (Samuel)
El objetivo del proyecto es construir una aplicación modular, escalable y mantenible bajo una arquitectura Modelo - Vista - Controlador (MVC) con separación clara entre frontend y backend.

MiCampoFresco/
│
├── backend/
│   ├── admin/              # Módulos del administrador
│   ├── vendedor/           # Módulos del vendedor/agricultor
│   ├── usuario/            # Módulos del usuario final
│   ├── config/             # Configuración general (DB, entorno, etc.)
│   ├── controllers/        # Controladores de las rutas
│   ├── models/             # Modelos de la base de datos
│   ├── routes/             # Rutas de la API
│   ├── middlewares/        # Autenticación, validaciones, etc.
│   ├── app.js              # Archivo principal del backend
│   └── package.json
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── views/
│   │   │   ├── Admin/
│   │   │   ├── Vendedor/
│   │   │   └── Usuario/
│   │   ├── hooks/
│   │   ├── services/
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── package.json
│
└── README.md

backend/
├── usuario/
│   ├── controllers/
│   │   └── usuarioController.js
│   ├── models/
│   │   └── usuarioModel.js
│   ├── routes/
│   │   └── usuarioRoutes.js
│   └── views/
│       └── login.html


🚀 Objetivo del Desarrollo

Cada integrante desarrollará su módulo de backend (según su rol) para luego integrarlos mediante merge en una rama principal estable.
El frontend será construido de forma uniforme, reutilizando componentes visuales con el mismo estilo y diseño.


🔧 Metodología de Trabajo

Usaremos una metodología tipo merge controlado, donde cada miembro trabaja en su rama, desarrolla sus funciones, y luego se integran al repositorio principal mediante Pull Requests.

| Integrante | Rol           | Rama               |
| ---------- | ------------- | ------------------ |
| Miguel     | Administrador | `feature/admin`    |
| Javier     | Vendedor      | `feature/vendedor` |
| Samuel     | Usuario       | `feature/usuario`  |


⚙️ Flujo de Trabajo

1. Clonar el repositorio:

git clone https://github.com/TU_USUARIO_DE_GITHUB/micampofresco.git
cd micampofresco


2. Cambiarse a su rama de trabajo:
   
git checkout feature/nombre_rama
# Ejemplo:
git checkout feature/usuario

3. Desarrollar su módulo (backend y/o frontend según el rol).
   

4. Guardar los cambios y subirlos:

git add .
git commit -m "Descripción clara del cambio realizado"
git push origin feature/nombre_rama

5. Crear un Pull Request (PR) hacia main

Entrar a GitHub → pestaña “Pull Requests” → “New Pull Request”.
Seleccionar:
Base: main
Compare: feature/nombre_rama
Esperar revisión y aprobación del líder antes del merge.

💡 Buenas Prácticas

✅ 1. Ramas bien definidas

Nadie debe trabajar directamente sobre main.
Cada módulo o función nueva debe desarrollarse en su propia rama.

✅ 2. Commits claros y frecuentes

Usa mensajes descriptivos:
✅ Agrega validación de login para usuario
❌ Cambios varios

✅ 3. Código limpio

Usa nombres de variables y funciones descriptivos.
No dejes código comentado o sin usar.

Verifica antes de hacer push.

✅ 4. Estandarización
Todos deben seguir la arquitectura MVC.

Mantener los mismos estilos visuales en el frontend.
Los controladores deben manejar errores de forma uniforme.

✅ 5. Seguridad

No subir contraseñas, tokens ni claves en el repositorio.
Usa archivos .env para credenciales (no los subas a GitHub).

✅ 6. Revisar antes de mergear

Ejecutar y probar localmente antes de enviar Pull Request.
Resolver conflictos de merge localmente, nunca directo en main.

✅ 7. Documentar
Cada módulo debe tener un README.md interno que explique sus endpoints o componentes.



| Rol                        | Responsabilidad Principal                                                         |
| -------------------------- | --------------------------------------------------------------------------------- |
| **Administrador (Miguel)** | Supervisar merges, revisar PRs, mantener la estructura y estándares del proyecto. |
| **Vendedor (Javier)**      | Desarrollar el backend y vistas relacionadas con los agricultores/vendedores.     |
| **Usuario (Samuel)**       | Desarrollar las funciones y vistas relacionadas con el cliente final.             |


🔐 Control de Acceso por Roles

Cada usuario solo verá las interfaces que le correspondan:
Usuarios → Vistas de compra, carrito, historial.
Vendedores → Inventario, ventas, estadísticas.
Administrador → Panel de control, usuarios, productos, entregas.
Esto se maneja mediante:
Middlewares en el backend para verificar el rol del usuario autenticado.
Rutas protegidas en el frontend (React Router o simila

🤝 Normas de Colaboración

Respetar las ramas y roles definidos.
Avisar antes de modificar archivos compartidos.
Probar antes de hacer merge.
Mantener comunicación constante.

🏁 Próximos Pasos

Implementar el módulo Login + Validaciones (MVC)
Configurar la base de datos y probar la conexión.
Desarrollar rutas, controladores y modelos para cada rol.
Crear vistas iniciales de cada actor.
Integrar todo mediante merges controlados.
