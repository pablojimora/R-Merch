# R-Merch 🛍️

Tienda virtual para productos oficiales de RIWI.

## 🚀 Tecnologías

- **Next.js 16** (App Router)
- **React 19**
- **TypeScript**
- **Tailwind CSS v4**
- **MongoDB + Mongoose**
- **Cloudinary** (almacenamiento de imágenes)

## 📋 Requisitos Previos

- Node.js 18+
- MongoDB (local o Atlas)
- Cuenta de Cloudinary

## ⚙️ Configuración

1. **Clonar el repositorio**
```bash
git clone <repository-url>
cd R-Merch
```

2. **Instalar dependencias**
```bash
npm install
```

3. **Configurar variables de entorno**

Crea un archivo `.env.local` en la raíz del proyecto con las siguientes variables:

```env
# MongoDB
MONGODB_URI=mongodb://localhost:27017/rmerch

# Cloudinary
CLOUDINARY_CLOUD_NAME=tu_cloud_name
CLOUDINARY_API_KEY=tu_api_key
CLOUDINARY_API_SECRET=tu_api_secret
```

**Para obtener las credenciales de Cloudinary:**
- Regístrate en [Cloudinary](https://cloudinary.com/)
- Ve al Dashboard
- Copia `Cloud Name`, `API Key` y `API Secret`

4. **Ejecutar el servidor de desarrollo**
```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

## 👤 Usuarios de Prueba

El sistema incluye usuarios hardcodeados para pruebas:

| Usuario | Email | Contraseña | Rol |
|---------|-------|------------|-----|
| Pablo | pablo@riwi.io | pablo123 | Usuario |
| Duque | duque@riwi.io | duque123 | Admin |

## 🎨 Paleta de Colores

- **Primary:** `#615CF2` (Púrpura)
- **Dark:** `#161C40` (Azul oscuro)
- **Accent 1:** `#62D9AD` (Verde agua)
- **Accent 2:** `#2BD968` (Verde)
- **Danger:** `#F25D50` (Rojo)

## 📁 Estructura del Proyecto

```
src/
├── app/
│   ├── api/              # Endpoints del backend
│   │   ├── products/     # CRUD de productos
│   │   ├── orders/       # Gestión de órdenes
│   │   └── upload/       # Subida de imágenes a Cloudinary
│   ├── admin/            # Panel de administración
│   │   └── products/     # Gestión de productos (CRUD)
│   ├── shop/             # Catálogo de productos
│   ├── products/[id]/    # Detalle de producto
│   ├── login/            # Inicio de sesión
│   └── register/         # Registro
├── components/           # Componentes reutilizables
├── context/              # Contextos de React (Auth)
├── lib/                  # Utilidades (dbConnection)
└── models/               # Modelos de Mongoose
```

## 🔑 Características Principales

### Usuario Normal
- ✅ Ver catálogo de productos
- ✅ Buscar y filtrar productos
- ✅ Ver detalle de productos
- 🔄 Agregar al carrito (en desarrollo)
- 🔄 Realizar pedidos (en desarrollo)

### Administrador
- ✅ Panel de administración
- ✅ **CRUD completo de productos:**
  - ✅ Crear productos con subida de imágenes
  - ✅ Editar información de productos
  - ✅ Eliminar productos
  - ✅ Ver listado con búsqueda
- ✅ Ver estadísticas del sistema

## 📸 Subida de Imágenes

El sistema utiliza **Cloudinary** para el almacenamiento de imágenes:

1. El usuario selecciona una o más imágenes desde el formulario
2. Las imágenes se suben automáticamente a Cloudinary
3. Se obtiene la URL de Cloudinary
4. La URL se guarda en MongoDB junto con el producto

**Validaciones:**
- Formatos permitidos: JPG, JPEG, PNG, WEBP
- Tamaño máximo: 5MB por imagen
- Las imágenes se optimizan automáticamente

## 🛣️ Rutas API

### Productos
- `GET /api/products` - Listar productos (con paginación y búsqueda)
- `POST /api/products` - Crear producto
- `GET /api/products/[id]` - Obtener producto por ID
- `PUT /api/products/[id]` - Actualizar producto
- `DELETE /api/products/[id]` - Eliminar producto

### Órdenes
- `GET /api/orders` - Listar órdenes
- `POST /api/orders` - Crear orden
- `GET /api/orders/[id]` - Obtener orden por ID
- `PUT /api/orders/[id]` - Actualizar orden

### Upload
- `POST /api/upload` - Subir imagen a Cloudinary
- `DELETE /api/upload?publicId=...` - Eliminar imagen de Cloudinary

## 🔒 Protección de Rutas

Las rutas de administración están protegidas con el componente `ProtectedRoute`:
- Verifica autenticación del usuario
- Valida rol de administrador (cuando `requireAdmin={true}`)
- Redirige a login si no está autenticado
- Muestra mensaje de acceso denegado si no tiene permisos

## 🚧 En Desarrollo

- [ ] Implementación del carrito de compras
- [ ] Página de checkout
- [ ] Procesamiento de pagos
- [ ] Gestión de órdenes para usuarios
- [ ] Panel de órdenes para admin
- [ ] Notificaciones por email

## 📝 Scripts Disponibles

```bash
npm run dev      # Servidor de desarrollo
npm run build    # Build para producción
npm run start    # Iniciar servidor de producción
npm run lint     # Ejecutar ESLint
```

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama (`git checkout -b feature/nueva-funcionalidad`)
3. Commit tus cambios (`git commit -m 'Agregar nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto es parte de RIWI.
