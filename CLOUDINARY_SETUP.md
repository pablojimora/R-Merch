# Configuración de Cloudinary para R-Merch

## 📸 ¿Qué es Cloudinary?

Cloudinary es un servicio de almacenamiento en la nube especializado en imágenes y videos. R-Merch lo utiliza para almacenar las imágenes de los productos.

## 🔧 Configuración Paso a Paso

### 1. Crear una cuenta en Cloudinary

1. Ve a [https://cloudinary.com/users/register_free](https://cloudinary.com/users/register_free)
2. Regístrate con tu email o GitHub
3. Completa la información básica de tu cuenta

### 2. Obtener credenciales

Una vez dentro del Dashboard de Cloudinary:

1. Ve a **Dashboard** (página principal)
2. Encontrarás una sección llamada **Account Details**
3. Copia los siguientes datos:
   - **Cloud Name** (nombre de tu nube)
   - **API Key** (clave pública)
   - **API Secret** (clave secreta - haz clic en el ícono del ojo para verla)

### 3. Configurar variables de entorno

Crea un archivo `.env.local` en la raíz del proyecto R-Merch:

```env
# MongoDB
MONGODB_URI=mongodb://localhost:27017/rmerch

# Cloudinary
CLOUDINARY_CLOUD_NAME=tu_cloud_name_aqui
CLOUDINARY_API_KEY=tu_api_key_aqui
CLOUDINARY_API_SECRET=tu_api_secret_aqui
```

**⚠️ IMPORTANTE:** 
- Reemplaza `tu_cloud_name_aqui`, `tu_api_key_aqui` y `tu_api_secret_aqui` con tus datos reales
- **NUNCA** compartas tu `API_SECRET` públicamente
- Asegúrate de que `.env.local` esté en el `.gitignore`

### 4. Verificar configuración

1. Reinicia el servidor de desarrollo:
   ```bash
   npm run dev
   ```

2. Inicia sesión como administrador:
   - Email: `duque@riwi.io`
   - Contraseña: `duque123`

3. Ve a **Admin Panel** → **Gestionar Productos** → **Crear Producto**

4. Intenta subir una imagen de prueba

5. Si todo está configurado correctamente:
   - Verás un spinner de "Subiendo..."
   - La imagen aparecerá en la vista previa
   - Podrás crear el producto exitosamente

## 📁 Estructura en Cloudinary

Las imágenes se organizan automáticamente en la carpeta:
```
rmerch/products/
```

Cada imagen subida se optimiza automáticamente:
- Tamaño máximo: 1000x1000px
- Calidad: automática
- Formato: automático (WebP cuando sea posible)

## 🔍 Solución de Problemas

### Error: "No se proporcionó ningún archivo"
- Verifica que estás seleccionando un archivo válido
- Formatos permitidos: JPG, JPEG, PNG, WEBP

### Error: "Error al subir imagen"
- Verifica que tus credenciales de Cloudinary sean correctas
- Asegúrate de que el archivo `.env.local` esté en la raíz del proyecto
- Reinicia el servidor después de agregar las variables de entorno

### Error: "El archivo es demasiado grande"
- El tamaño máximo permitido es 5MB por imagen
- Comprime la imagen antes de subirla

### Las imágenes no se muestran
- Verifica que `res.cloudinary.com` esté en `remotePatterns` de `next.config.ts`
- Limpia el caché del navegador
- Verifica que la URL de la imagen sea válida

## 🎯 Límites del Plan Gratuito

Cloudinary ofrece un plan gratuito generoso:
- ✅ 25 GB de almacenamiento
- ✅ 25 GB de transferencia mensual
- ✅ Transformaciones ilimitadas

Esto es suficiente para desarrollo y proyectos pequeños.

## 🔒 Seguridad

**Buenas prácticas:**

1. ✅ Usa variables de entorno para credenciales
2. ✅ Nunca hagas commit de `.env.local`
3. ✅ Limita los tipos de archivos permitidos
4. ✅ Establece límites de tamaño de archivo
5. ✅ Usa carpetas organizadas (`rmerch/products/`)

## 📞 Soporte

Si necesitas ayuda adicional:
- [Documentación de Cloudinary](https://cloudinary.com/documentation)
- [Soporte de Cloudinary](https://support.cloudinary.com/)
- [Next.js + Cloudinary Guide](https://cloudinary.com/documentation/next_integration)

## ✅ Checklist de Configuración

- [ ] Cuenta de Cloudinary creada
- [ ] Credenciales copiadas del Dashboard
- [ ] Archivo `.env.local` creado con las 3 variables
- [ ] Servidor reiniciado
- [ ] Prueba de subida exitosa
- [ ] Imágenes visibles en el frontend
