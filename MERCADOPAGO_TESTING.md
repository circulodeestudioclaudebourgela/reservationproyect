# Verificación de Pagos MercadoPago

## 🧪 Modo TEST (Actual)

### Características:
- ✅ Pagos procesados con tarjetas de prueba
- ✅ Guardados en tu base de datos
- ❌ **NO aparecen en tu cuenta MercadoPago real**
- ❌ **NO generan dinero real**

### Cómo verificar pagos TEST:

#### 1. Panel de Desarrolladores MercadoPago
```
URL: https://www.mercadopago.com.pe/developers/panel/app
Pasos:
1. Inicia sesión en MercadoPago
2. Ve a "Tus integraciones" → Selecciona tu app
3. Menú lateral → "Test" → "Pagos de prueba"
4. Verás todos los pagos TEST procesados
```

#### 2. Base de Datos Supabase
```
URL: https://supabase.com/dashboard/project/iizphxxgwtcojdlbycvg/editor
1. Ve al SQL Editor
2. Ejecuta el script: scripts/check-test-payments.sql
3. Verás todos los attendees con status 'paid'
```

#### 3. Admin Dashboard de tu app
```
URL: https://v0-veterinary-symposium-registratio.vercel.app/admin
- Usa las credenciales ADMIN_EMAILS del .env
- Verás todos los asistentes registrados y pagados
```

---

## 🚀 Cambiar a Modo PRODUCCIÓN

### Cuándo hacerlo:
- ✅ Has probado todo el flujo (Yape + Tarjetas)
- ✅ Webhooks funcionan correctamente  
- ✅ Emails de confirmación llegan
- ✅ Admin dashboard muestra datos correctos

### Pasos para activar producción:

#### 1. Obtener credenciales de producción
```bash
# Ve a: https://www.mercadopago.com.pe/developers/panel/app
# En tu aplicación:
# - Clic en "Credenciales de producción"
# - Copia: Public Key (PK) y Access Token (AT)
```

#### 2. Actualizar .env.local (local) y Vercel (producción)

**Reemplazar en `.env.local`:**
```bash
# ANTES (TEST):
NEXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY="TEST-d27073c2-6ddb-4f3b-9081-c341dea40cb4"
MERCADOPAGO_ACCESS_TOKEN="TEST-1282558106379202-021621-89c2178555c943554ec144525ad2547f-1848213391"

# DESPUÉS (PRODUCCIÓN):
NEXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY="APP_USR-xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
MERCADOPAGO_ACCESS_TOKEN="APP_USR-1234567890123456-xxxxxx-xxxxxxxxxxxxxxxxxxxxxxxx-1234567890"
```

**Actualizar en Vercel:**
```bash
# Ve a: https://vercel.com/tu-cuenta/veterinary-symposium/settings/environment-variables
# Edita:
# - NEXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY
# - MERCADOPAGO_ACCESS_TOKEN
# Redeploy la aplicación
```

#### 3. Actualizar webhook en MercadoPago
```bash
# En el panel de MercadoPago:
# Webhooks → Editar/Crear → URL:
https://v0-veterinary-symposium-registratio.vercel.app/api/webhooks/mercadopago

# Eventos a suscribir:
# ✅ payment
# Secret: (usa MERCADOPAGO_WEBHOOK_SECRET del .env)
```

#### 4. Probar con tarjeta real (pago pequeño)
```
1. Registra un asistente de prueba
2. Paga con tu tarjeta real (monto: S/ 1.00 para probar)
3. Verifica que:
   - El pago aparece en tu cuenta MercadoPago
   - Se actualiza en la BD
   - Llega el email de confirmación
4. Reembolsa el pago de prueba desde el panel de MP
```

---

## 🔍 Tarjetas de Prueba (Modo TEST)

### Tarjetas que APRUEBAN:
```
Mastercard:
- Número: 5254 1336 7440 3564
- CVV: 123
- Fecha: 11/25
- Nombre: APRO

Visa:
- Número: 4509 9535 6623 3704
- CVV: 123
- Fecha: 11/25
- Nombre: APRO
```

### Tarjetas que RECHAZAN (para probar errores):
```
# Fondos insuficientes:
- 4013 5406 8274 6260

# Rechazada:
- 5031 4332 1540 6351
```

Más tarjetas: https://www.mercadopago.com.pe/developers/es/docs/checkout-api/integration-test/test-cards

---

## 📊 Monitoreo de Pagos en Producción

### Dashboard Admin:
```
URL: /admin/dashboard
- Filtra por status = 'paid'
- Exporta a Excel para contabilidad
- Verifica payment_order_id en MercadoPago
```

### Consultas SQL útiles:
```sql
-- Total recaudado por método de pago
SELECT 
  payment_method,
  COUNT(*) as cantidad,
  SUM(CASE 
    WHEN payment_method = 'yape' THEN 250 
    ELSE 250 * 1.05 
  END) as total_soles
FROM attendees
WHERE status = 'paid'
GROUP BY payment_method;

-- Pagos de las últimas 24 horas
SELECT * FROM attendees
WHERE status = 'paid' 
  AND created_at > NOW() - INTERVAL '1 day'
ORDER BY created_at DESC;
```

---

## ⚠️ Importante

- **Modo TEST**: Usa tarjetas de prueba, no cobres dinero real
- **Modo PRODUCCIÓN**: Solo con credenciales reales, cobra dinero real
- **NUNCA** compartas tus Access Tokens de producción
- **Webhook secret** debe ser el mismo en .env y panel MP

---

## 🆘 Troubleshooting

### "No veo el pago en MI cuenta MP"
→ Estás en modo TEST. Los pagos TEST no aparecen en cuentas reales.

### "El pago fue aprobado pero no actualiza la BD"
→ Verifica webhooks: `/api/webhooks/mercadopago` debe estar configurado en MP.

### "Error 401 en el backend"
→ Verifica que MERCADOPAGO_ACCESS_TOKEN esté en las variables de entorno de Vercel.

### "CardForm no carga"
→ Verifica NEXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY (debe empezar con TEST- o APP_USR-).
