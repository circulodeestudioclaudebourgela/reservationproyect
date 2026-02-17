# 🔍 Cómo Ver Pagos TEST en MercadoPago

## ✅ Los pagos TEST SÍ se pueden ver en MercadoPago

**Pero NO en tu cuenta normal** → Están en el **Panel de Desarrolladores**

---

## 📍 Método 1: Panel Web de Desarrolladores (Recomendado)

### Paso 1: Acceder al Panel
```
URL: https://www.mercadopago.com.pe/developers/panel
```

### Paso 2: Iniciar Sesión
- Usa el **mismo email y contraseña** de tu cuenta MercadoPago normal
- Es la misma cuenta, solo que accedes a una sección diferente

### Paso 3: Ir a Pagos de Prueba
```
Ruta de navegación:
1. Panel → Tus integraciones
2. Selecciona tu aplicación (o "Default Application")
3. Menú lateral izquierdo → "Test"
4. Clic en "Pagos de prueba" o "Test payments"
```

### Paso 4: Ver los Pagos
Verás una tabla con:
- ✅ **ID del pago**
- ✅ **Estado** (approved/pending/rejected)
- ✅ **Monto**
- ✅ **Método de pago** (visa, master, yape)
- ✅ **Fecha y hora**
- ✅ **Email del pagador**

### URL Directa:
```
https://www.mercadopago.com.pe/developers/panel/test/payments
```

---

## 🖥️ Método 2: Script de Consulta (Más rápido)

### Paso 1: Ejecutar el script
```bash
cd C:\Bytecore\01_CLIENTES\pancho\simposio
node scripts/check-mp-payments.js
```

### Paso 2: Ver resultado en consola
El script te mostrará:
```
✅ Encontrados 3 pagos

📋 Pago #1
   ID: 1234567890
   Estado: ✅ APPROVED
   Método: visa
   Monto: PEN 262.50
   Email: test@example.com
   Descripción: II Simposio Veterinario...
   Fecha: 17/2/2026 10:30:45
   Ver en MP: https://www.mercadopago.com.pe/developers/panel/test/payments/1234567890
```

---

## 🔍 Método 3: API REST (Para Desarrolladores)

### Usando cURL:
```bash
curl -X GET \
  "https://api.mercadopago.com/v1/payments/search?sort=date_created&criteria=desc" \
  -H "Authorization: Bearer TEST-1282558106379202-021621-89c2178555c943554ec144525ad2547f-1848213391"
```

### Usando Postman:
```
URL: GET https://api.mercadopago.com/v1/payments/search?sort=date_created&criteria=desc
Headers:
  Authorization: Bearer TEST-1282558106379202-021621-89c2178555c943554ec144525ad2547f-1848213391
  Content-Type: application/json
```

---

## 📊 ¿Qué pasa si NO ves pagos?

### Posibles causas:

#### 1. El pago falló silenciosamente
**Verificar en:**
- Consola del navegador (F12) → Tab "Console"
- Busca errores en rojo con "payment" o "MercadoPago"

**Solución:**
```bash
# Ver logs del servidor (Vercel)
https://vercel.com/tu-cuenta/veterinary-symposium/logs
```

#### 2. Estás mirando el panel de PRODUCCIÓN
**Verifica:**
- URL debe ser `/test/payments` NO `/payments`
- Debe decir "Modo Test" o "Test Mode" en la esquina superior

#### 3. El pago se registró pero no en MercadoPago
**Verificar en Supabase:**
```sql
SELECT 
  ticket_code,
  full_name,
  email,
  status,
  payment_order_id,
  payment_method,
  created_at
FROM attendees 
WHERE status = 'paid' 
  AND created_at > NOW() - INTERVAL '1 hour'
ORDER BY created_at DESC;
```

Si `payment_order_id` es NULL → El pago NO llegó a MercadoPago  
Si `payment_order_id` tiene valor → Busca ese ID en el panel de MP

---

## 🆘 Troubleshooting

### "No puedo acceder al panel de desarrolladores"
```
Solución:
1. Ve a: https://www.mercadopago.com.pe
2. Inicia sesión normalmente
3. Luego ve a: https://www.mercadopago.com.pe/developers/panel
4. Si te pide verificación de cuenta, completa el proceso
```

### "Dice que no tengo aplicaciones"
```
Solución:
1. Ir a: https://www.mercadopago.com.pe/developers/panel/app
2. Clic en "Crear aplicación"
3. Nombre: "Simposio Veterinario"
4. Copiar las nuevas credenciales TEST
5. Actualizar .env con las nuevas credenciales
```

### "Los pagos aparecen como 'pending' no 'approved'"
```
Causas comunes:
- ❌ Usaste una tarjeta de rechazo por error
- ❌ El webhook no se ejecutó (verificar /api/webhooks/mercadopago)
- ❌ Falta configurar el webhook en el panel de MP

Tarjetas que APRUEBAN:
✅ 5254 1336 7440 3564 (Mastercard)
✅ 4509 9535 6623 3704 (Visa)
```

---

## 📱 Acceso Mobile

Si estás en celular:
```
1. Abre: https://www.mercadopago.com.pe/developers/panel
2. Si te lleva a la app, ábrelo en navegador web
3. Navega hasta Test → Pagos de prueba
4. En mobile puede verse limitado, usa desktop si es posible
```

---

## 🎯 Resumen Rápido

| ¿Dónde ver? | URL |
|-------------|-----|
| **Panel Web** | https://www.mercadopago.com.pe/developers/panel/test/payments |
| **Script Node** | `node scripts/check-mp-payments.js` |
| **API REST** | GET /v1/payments/search con token TEST |
| **Supabase** | `SELECT * FROM attendees WHERE status='paid'` |

---

## ⚠️ Importante

- 🧪 **Modo TEST**: Los pagos SOLO aparecen en Panel de Desarrolladores
- 🚀 **Modo PRODUCCIÓN**: Los pagos aparecen en tu cuenta normal de MercadoPago
- 🔄 **Ambos modos**: Usan credenciales diferentes (TEST- vs APP_USR-)

---

## 💡 Próximo Paso

Una vez que veas tus pagos TEST y compruebes que todo funciona:
1. ✅ Cambia a credenciales de PRODUCCIÓN
2. ✅ Configura webhooks de producción
3. ✅ Prueba con un pago real pequeño (S/ 1.00)
4. ✅ Los pagos reales SÍ aparecerán en tu cuenta normal
