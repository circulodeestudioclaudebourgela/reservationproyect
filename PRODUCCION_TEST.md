# 🚀 MODO PRODUCCIÓN - CONFIGURACIÓN ACTUALIZADA

## ✅ CONFIGURACIÓN ACTUAL

**Status**: Precios configurados a **S/ 250.00** (Early Bird) con 5% de comisión en ambos métodos

### Credenciales MercadoPago - PRODUCCIÓN

```
Public Key:  APP_USR-1acd9d04-b14d-45a1-bf8a-15ac7a09f27e
Access Token: APP_USR-6164578251720462-021723-c50b47f999318698a9edf34490574014-277863686
Client ID: 6164578251720462
Client Secret: WXxJlMOUC6ZY9qkV6Mu3fRKP02ItETR4
```

### Precios Actuales (17 Feb 2026)

✅ **Yape**: S/ 250.00 + 5% comisión = **S/ 262.50**
✅ **Tarjeta**: S/ 250.00 + 5% comisión = **S/ 262.50**

**Nota**: Ambos métodos de pago ahora cobran 5% de comisión por uso de plataforma y procesamiento de pagos a través de MercadoPago.

### Cambios realizados

✅ Credenciales de producción actualizadas en `.env`
✅ Precios revertidos a S/ 250.00 (Early Bird) / S/ 350.00 (Regular)
✅ Comisión del 5% aplicada a ambos métodos (Yape y Tarjeta)
✅ UI actualizada para mostrar desglose de comisiones en ambos métodos

### Archivos con configuración de precios:

Los siguientes archivos tienen los precios configurados (todos en S/ 250.00 / S/ 350.00):

1. `app/actions/payment.ts` - Validación de precios con comisión del 5% para ambos métodos
2. `app/actions/register.ts` - Precio base para emails
3. `app/actions/email.ts` - Precio base para templates
4. `app/api/webhooks/mercadopago/route.ts` - Precio base para webhooks
5. `components/modals/checkout-modal.tsx` - Precios y comisiones en UI
6. `components/forms/registration-form.tsx` - Precio mostrado en formulario
7. `components/admin/admin-dashboard.tsx` - Precio en dashboard admin
8. `components/admin/attendee-details-modal.tsx` - Precio en modal de detalles

### 🔄 Para cambiar precios en el futuro

Buscar las constantes en cada archivo:
```typescript
const EARLY_BIRD_PRICE = 250.00
const REGULAR_PRICE = 350.00
const EARLY_BIRD_DEADLINE = new Date('2026-05-01T00:00:00')
```

### Checklist de prueba en producción

- [ ] Registrar un asistente real
- [ ] Probar pago con tarjeta real (S/ 262.50 con comisión incluida)
- [ ] Probar pago con Yape (S/ 262.50 con comisión incluida)
- [ ] Verificar que el pago aparece en MercadoPago producción
- [ ] Verificar que se actualiza en la BD
- [ ] Verificar que llega el email de confirmación
- [ ] Verificar webhook funciona correctamente
- [ ] Reembolsar los pagos de prueba desde panel de MP (si se hicieron pruebas a precios bajos)

### URLs importantes

- Panel MercadoPago: https://www.mercadopago.com.pe/developers/panel/app
- Webhook URL: https://v0-veterinary-symposium-registratio.vercel.app/api/webhooks/mercadopago

### Notas de seguridad

⚠️ **NO OLVIDAR**: Después de la prueba exitosa, volver a los precios reales antes del lanzamiento oficial.
Las credenciales de producción están en el `.env` y deben estar actualizadas en las variables de entorno de Vercel.

### Estructura de comisiones

**MercadoPago cobra 5% por todos los pagos procesados**:
- **Yape**: 5% de comisión
- **Tarjeta de crédito/débito**: 5% de comisión

El precio final que paga el usuario incluye:
- Precio base del evento: S/ 250.00 (Early Bird) o S/ 350.00 (Regular)
- Comisión de procesamiento (5%): S/ 12.50 o S/ 17.50
- **Total**: S/ 262.50 o S/ 367.50