# 🚀 MODO PRODUCCIÓN - PRUEBA ACTIVA

## ⚠️ IMPORTANTE: CONFIGURACIÓN TEMPORAL

**Status**: Los precios están configurados a **S/ 2.00** para prueba inicial de producción

### Credenciales MercadoPago - PRODUCCIÓN

```
Public Key:  APP_USR-1acd9d04-b14d-45a1-bf8a-15ac7a09f27e
Access Token: APP_USR-6164578251720462-021723-c50b47f999318698a9edf34490574014-277863686
Client ID: 6164578251720462
Client Secret: WXxJlMOUC6ZY9qkV6Mu3fRKP02ItETR4
```

### Cambios realizados (17 Feb 2026)

✅ Credenciales actualizadas en `.env`
✅ Precios cambiados temporalmente de S/ 250.00 → **S/ 2.00**

### Archivos modificados con precios de prueba:

1. `app/actions/payment.ts` - Líneas 29, 129
2. `app/actions/register.ts` - Línea 243
3. `app/actions/email.ts` - Líneas 12-13
4. `app/api/webhooks/mercadopago/route.ts` - Línea 73
5. `components/modals/checkout-modal.tsx` - Líneas 69-70
6. `components/forms/registration-form.tsx` - Líneas 25-26
7. `components/admin/admin-dashboard.tsx` - Líneas 31-32
8. `components/admin/attendee-details-modal.tsx` - Líneas 23-24

### 🔄 Para volver a precios reales (S/ 250.00 / S/ 350.00)

Buscar en todos los archivos: `// TEMPORAL: Precio de prueba producción`

Y reemplazar:
```typescript
// DE:
const basePrice = new Date() < EARLY_BIRD_DEADLINE ? 2.00 : 2.00  // TEMPORAL: Precio de prueba producción

// A:
const basePrice = new Date() < EARLY_BIRD_DEADLINE ? 250.00 : 350.00
```

### Checklist de prueba en producción

- [ ] Registrar un asistente real
- [ ] Probar pago con tarjeta real (S/ 2.10 con comisión)
- [ ] Probar pago con Yape (S/ 2.00 sin comisión)
- [ ] Verificar que el pago aparece en MercadoPago producción
- [ ] Verificar que se actualiza en la BD
- [ ] Verificar que llega el email de confirmación
- [ ] Verificar webhook funciona correctamente
- [ ] Reembolsar los pagos de prueba desde panel de MP
- [ ] **RESTAURAR PRECIOS REALES** después de pruebas exitosas

### URLs importantes

- Panel MercadoPago: https://www.mercadopago.com.pe/developers/panel/app
- Webhook URL: https://v0-veterinary-symposium-registratio.vercel.app/api/webhooks/mercadopago

### Notas de seguridad

⚠️ **NO OLVIDAR**: Después de la prueba exitosa, volver a los precios reales antes del lanzamiento oficial.

⚠️ Las credenciales de producción están en el `.env` y en las variables de entorno de Vercel.
