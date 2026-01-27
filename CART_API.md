# 🛒 API de Carrito de Compras - R-Merch

Documentación completa de los endpoints del carrito de compras.

## 📋 Tabla de Contenidos
- [Modelo de Datos](#modelo-de-datos)
- [Endpoints](#endpoints)
  - [Obtener Carrito](#get-apicart)
  - [Añadir Producto](#post-apicart)
  - [Actualizar Cantidad](#put-apicart)
  - [Eliminar Producto](#delete-apicart)
  - [Calcular Total](#post-apicartcalculate)
  - [Checkout](#post-apicartcheckout)

---

## 🗂️ Modelo de Datos

### CartItem
```typescript
{
  productId: ObjectId,      // Referencia al producto
  name: string,             // Nombre del producto
  price: number,            // Precio unitario
  quantity: number,         // Cantidad (mínimo 1)
  subtotal: number,         // price * quantity
  image: string            // URL de la imagen principal
}
```

### Cart
```typescript
{
  userId: string,           // Identificador del usuario
  items: CartItem[],        // Array de productos en el carrito
  total: number,            // Total del carrito
  expiresAt: Date,         // Fecha de expiración (30 días)
  createdAt: Date,
  updatedAt: Date
}
```

---

## 🔌 Endpoints

### GET /api/cart
Obtiene el carrito del usuario con el total calculado.

**Query Parameters:**
- `userId` (string, requerido): Identificador del usuario

**Respuesta Exitosa (200):**
```json
{
  "success": true,
  "data": {
    "userId": "user123",
    "items": [
      {
        "_id": "item_id",
        "productId": {
          "_id": "product_id",
          "name": "Camiseta Riwi",
          "images": ["url"],
          "price": 25.99,
          "stock": 10
        },
        "name": "Camiseta Riwi",
        "price": 25.99,
        "quantity": 2,
        "subtotal": 51.98,
        "image": "url"
      }
    ],
    "total": 51.98,
    "itemCount": 1
  }
}
```

**Ejemplo de uso:**
```javascript
// Fetch API
const response = await fetch('/api/cart?userId=user123');
const data = await response.json();

// Axios
const { data } = await axios.get('/api/cart', {
  params: { userId: 'user123' }
});
```

---

### POST /api/cart
Añade un producto al carrito. Si el producto ya existe, incrementa la cantidad.

**Body:**
```json
{
  "userId": "user123",
  "productId": "product_id",
  "quantity": 1
}
```

**Respuesta Exitosa (200):**
```json
{
  "success": true,
  "message": "Producto añadido al carrito",
  "data": {
    "userId": "user123",
    "items": [...],
    "total": 51.98,
    "itemCount": 1
  }
}
```

**Errores Posibles:**
- `400`: userId o productId faltantes, cantidad inválida
- `404`: Producto no encontrado
- `400`: Stock insuficiente

**Ejemplo de uso:**
```javascript
// Fetch API
const response = await fetch('/api/cart', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    userId: 'user123',
    productId: '507f1f77bcf86cd799439011',
    quantity: 2
  })
});

// Axios
const { data } = await axios.post('/api/cart', {
  userId: 'user123',
  productId: '507f1f77bcf86cd799439011',
  quantity: 2
});
```

---

### PUT /api/cart
Actualiza la cantidad de un producto en el carrito. Si quantity es 0, elimina el producto.

**Body:**
```json
{
  "userId": "user123",
  "productId": "product_id",
  "quantity": 3
}
```

**Respuesta Exitosa (200):**
```json
{
  "success": true,
  "message": "Carrito actualizado",
  "data": {
    "userId": "user123",
    "items": [...],
    "total": 77.97,
    "itemCount": 1
  }
}
```

**Errores Posibles:**
- `400`: Parámetros faltantes o cantidad negativa
- `404`: Carrito o producto no encontrado
- `400`: Stock insuficiente

**Ejemplo de uso:**
```javascript
// Actualizar cantidad
const { data } = await axios.put('/api/cart', {
  userId: 'user123',
  productId: '507f1f77bcf86cd799439011',
  quantity: 3
});

// Eliminar producto (quantity = 0)
const { data } = await axios.put('/api/cart', {
  userId: 'user123',
  productId: '507f1f77bcf86cd799439011',
  quantity: 0
});
```

---

### DELETE /api/cart
Elimina un producto específico o vacía todo el carrito.

**Query Parameters:**
- `userId` (string, requerido): Identificador del usuario
- `productId` (string, opcional): ID del producto a eliminar. Si no se especifica, vacía el carrito completo.

**Respuesta Exitosa (200):**
```json
{
  "success": true,
  "message": "Producto eliminado del carrito",
  "data": {
    "userId": "user123",
    "items": [],
    "total": 0,
    "itemCount": 0
  }
}
```

**Ejemplo de uso:**
```javascript
// Eliminar un producto específico
const response = await fetch('/api/cart?userId=user123&productId=product_id', {
  method: 'DELETE'
});

// Vaciar todo el carrito
const response = await fetch('/api/cart?userId=user123', {
  method: 'DELETE'
});

// Axios
await axios.delete('/api/cart', {
  params: { 
    userId: 'user123',
    productId: 'product_id' // Opcional
  }
});
```

---

### POST /api/cart/calculate
Calcula el total del carrito incluyendo costos de envío y descuentos.

**Body:**
```json
{
  "userId": "user123",
  "shippingCost": 10.00,
  "discount": 5.00,
  "couponCode": "DESCUENTO10"
}
```

**Respuesta Exitosa (200):**
```json
{
  "success": true,
  "data": {
    "userId": "user123",
    "items": [...],
    "itemCount": 2,
    "subtotal": 51.98,
    "shippingCost": 10.00,
    "discount": 5.20,
    "total": 56.78,
    "couponCode": "DESCUENTO10",
    "breakdown": {
      "itemsTotal": 51.98,
      "shipping": 10.00,
      "discount": 5.20,
      "finalTotal": 56.78
    }
  }
}
```

**Cupones de Ejemplo:**
- `DESCUENTO10`: 10% de descuento sobre el subtotal
- `ENVIOGRATIS`: Envío gratuito (puedes personalizar)

**Ejemplo de uso:**
```javascript
const { data } = await axios.post('/api/cart/calculate', {
  userId: 'user123',
  shippingCost: 10,
  couponCode: 'DESCUENTO10'
});

console.log('Total final:', data.data.total);
console.log('Desglose:', data.data.breakdown);
```

---

### POST /api/cart/checkout
Crea una orden desde el carrito (proceso de checkout). Reduce el stock de productos y vacía el carrito.

**Body:**
```json
{
  "userId": "user123",
  "customer": {
    "name": "Juan Pérez",
    "email": "juan@example.com",
    "phone": "+52 123 456 7890",
    "address": {
      "street": "Calle Principal 123",
      "city": "Ciudad de México",
      "state": "CDMX",
      "zipCode": "01000",
      "country": "México"
    }
  },
  "paymentMethod": "tarjeta",
  "notes": "Entregar por la tarde",
  "shippingInfo": {
    "shippingCost": 10.00,
    "estimatedDelivery": "2025-12-20"
  }
}
```

**Respuesta Exitosa (201):**
```json
{
  "success": true,
  "message": "Orden creada exitosamente desde el carrito",
  "data": {
    "_id": "order_id",
    "orderNumber": "ORD-20251212-0001",
    "userId": "user123",
    "items": [...],
    "customer": {...},
    "total": 61.98,
    "status": "pendiente",
    "paymentStatus": "pendiente",
    "paymentMethod": "tarjeta",
    "createdAt": "2025-12-12T10:30:00.000Z"
  }
}
```

**Validaciones:**
- ✅ Usuario debe estar especificado
- ✅ Carrito no debe estar vacío
- ✅ Datos del cliente completos (nombre, email, teléfono)
- ✅ Dirección de envío completa
- ✅ Método de pago válido
- ✅ Stock disponible para todos los productos
- ✅ Transacción atómica (todo o nada)

**Métodos de Pago Válidos:**
- `efectivo`
- `tarjeta`
- `transferencia`
- `paypal`
- `mercado_pago`

**Ejemplo de uso:**
```javascript
const { data } = await axios.post('/api/cart/checkout', {
  userId: 'user123',
  customer: {
    name: 'Juan Pérez',
    email: 'juan@example.com',
    phone: '+52 123 456 7890',
    address: {
      street: 'Calle Principal 123',
      city: 'Ciudad de México',
      state: 'CDMX',
      zipCode: '01000',
      country: 'México'
    }
  },
  paymentMethod: 'tarjeta',
  shippingInfo: {
    shippingCost: 10
  }
});

console.log('Orden creada:', data.data.orderNumber);
```

---

## 🔄 Flujo Completo de Compra

```javascript
// 1. Añadir productos al carrito
await axios.post('/api/cart', {
  userId: 'user123',
  productId: 'prod1',
  quantity: 2
});

await axios.post('/api/cart', {
  userId: 'user123',
  productId: 'prod2',
  quantity: 1
});

// 2. Obtener carrito actual
const cart = await axios.get('/api/cart?userId=user123');
console.log('Items:', cart.data.data.items);

// 3. Actualizar cantidad (si es necesario)
await axios.put('/api/cart', {
  userId: 'user123',
  productId: 'prod1',
  quantity: 3
});

// 4. Calcular total con envío
const calculation = await axios.post('/api/cart/calculate', {
  userId: 'user123',
  shippingCost: 10,
  couponCode: 'DESCUENTO10'
});
console.log('Total final:', calculation.data.data.total);

// 5. Realizar checkout
const order = await axios.post('/api/cart/checkout', {
  userId: 'user123',
  customer: {
    name: 'Juan Pérez',
    email: 'juan@example.com',
    phone: '+52 123 456 7890',
    address: {
      street: 'Calle Principal 123',
      city: 'Ciudad de México',
      state: 'CDMX',
      zipCode: '01000',
      country: 'México'
    }
  },
  paymentMethod: 'tarjeta',
  shippingInfo: {
    shippingCost: 10
  }
});

console.log('¡Orden creada!', order.data.data.orderNumber);
```

---

## 🛡️ Manejo de Errores

Todos los endpoints responden con el siguiente formato en caso de error:

```json
{
  "success": false,
  "message": "Descripción del error",
  "error": "Detalles técnicos del error (solo en desarrollo)"
}
```

### Códigos de Estado HTTP
- `200`: Operación exitosa
- `201`: Recurso creado exitosamente
- `400`: Error de validación o datos inválidos
- `404`: Recurso no encontrado
- `500`: Error del servidor

---

## 💡 Notas Importantes

1. **userId**: Es el identificador único del usuario. Puede ser:
   - Email del usuario
   - ID de la sesión
   - Token de usuario autenticado

2. **Stock**: Se valida en tiempo real antes de añadir/actualizar productos

3. **Expiración**: Los carritos se eliminan automáticamente después de 30 días de inactividad

4. **Transacciones**: El checkout utiliza transacciones de MongoDB para garantizar consistencia

5. **Precios**: Se obtienen del producto en tiempo real para evitar discrepancias

6. **Carrito vacío**: Después del checkout, el carrito se vacía automáticamente

---

## 🔧 Variables de Entorno

Asegúrate de tener configurada la variable de entorno:

```env
MONGODB_URI=tu_conexion_mongodb
```

---

## 📦 Dependencias

- `next`: Framework de React
- `mongoose`: ODM para MongoDB
- Base de datos: MongoDB

---

## 🚀 Próximas Mejoras

- [ ] Sistema de cupones en base de datos
- [ ] Límite de tiempo para reserva de stock
- [ ] Notificaciones por email
- [ ] Integración con pasarelas de pago
- [ ] Historial de carritos abandonados
- [ ] Recomendaciones de productos relacionados

---

**Creado para R-Merch** 🛍️
