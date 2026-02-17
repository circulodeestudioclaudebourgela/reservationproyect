# Audit de Handlers y Edge Cases

## ✅ Casos Actualmente Manejados

### 1. **Registros Duplicados**
- ✅ **Email duplicado**: "Ya existe un registro con este correo electrónico"
  - Validación en `registerAttendee()` antes de insertar
  - Previene intentos de re-registro con mismo email
  
- ✅ **DNI duplicado**: "Ya existe un registro con este DNI"
  - Validación en `registerAttendee()` antes de insertar
  - Previene fraude/múltiples registros misma persona

### 2. **Estados de Pago**
- ✅ **Pago aprobado**: Status `approved`
  - Actualiza DB a `status='paid'`
  - Envía email de confirmación con ticket
  - Genera payment_order_id único
  
- ✅ **Pago rechazado**: Status `rejected`/`cancelled`
  - Envía email con razón específica del rechazo
  - Botón para reintentar
  - No actualiza status (queda en `pending`)
  
- ✅ **Pago pendiente**: Status `pending`/`in_process`
  - Log del webhook (no envía email duplicado)
  - Frontend muestra mensaje de espera

### 3. **Webhooks**
- ✅ **Webhook duplicado de MercadoPago**
  - Check: `if (attendee.status !== 'paid')`
  - Skip si ya está pagado
  - Previene emails duplicados
  
- ✅ **Validación HMAC x-signature**
  - Previene webhooks falsos
  - Solo procesa webhooks legítimos de MP

### 4. **Emails**
- ✅ **Timeout de 10s**: No bloquea el flujo si email demora
- ✅ **Error de SMTP**: Log pero no falla el pago
- ✅ **Emails duplicados**: Webhook solo envía si `status !== 'paid'`

### 5. **Frontend**
- ✅ **Validación de formulario**: Zod schema con mensajes claros
- ✅ **Estados del modal**: summary → payment-select → [yape/card]-form → processing → success/error
- ✅ **Retry button**: En caso de error, volver a intentar pago

---

## ⚠️ Casos NO Manejados (Recomendaciones)

### 1. **Re-registro con Status Pending** ❌
**Problema**: Usuario abandona checkout y vuelve a registrarse
- Ya existe registro en DB con `status='pending'`
- Validación rechaza: "Ya existe un registro con este correo"
- Usuario no puede completar su pago

**Solución recomendada**:
```typescript
// Si existe con status='pending', permitir continuar al pago
if (existingByEmail && existingByEmail.status === 'pending') {
  return { 
    success: true, 
    data: existingByEmail,
    message: 'Continúa con tu pago pendiente'
  }
}
```

### 2. **Re-registro con Status Paid** ❌
**Problema**: Usuario ya pagó e intenta registrarse de nuevo
- Mensaje actual: "Ya existe un registro con este correo"
- No es claro que ya tiene un ticket válido

**Solución recomendada**:
```typescript
if (existingByEmail && existingByEmail.status === 'paid') {
  return { 
    success: false, 
    error: '¡Ya estás registrado! Revisa tu correo para ver tu ticket. Si no lo encuentras, contáctanos.',
    ticketCode: existingByEmail.ticket_code // Mostrar en UI
  }
}
```

### 3. **Cambio de Precio Durante Checkout** ❌
**Problema**: Early bird expira mientras usuario llena el form
- Frontend calcula precio en mount
- Puede diferir del precio en el momento del pago

**Solución recomendada**:
```typescript
// En payment actions, recalcular precio
const DEADLINE = new Date('2026-05-01T00:00:00')
const currentPrice = new Date() < DEADLINE ? 250.00 : 350.00

if (Math.abs(amount - currentPrice) > 0.01) {
  return { 
    success: false, 
    error: `El precio cambió a S/ ${currentPrice.toFixed(2)}. Actualiza la página.` 
  }
}
```

### 4. **MercadoPago SDK No Carga** ❌
**Problema**: Script bloqueado, AdBlocker, conexión lenta
- Usuario ve botones de pago pero no funcionan
- Error: "MercadoPago SDK no disponible"

**Solución recomendada**:
- Mostrar mensaje antes del checkout si SDK no carga
- Botón "Recargar" para retry
- Fallback: Pago manual (enviar comprobante)

### 5. **Timeout de Pago (>10s)** ⚠️ Parcial
**Problema**: Email timeout funciona, pero pago puede colgar
- processCardPayment o processYapePayment sin timeout específico
- MP API puede demorar >30s en aprobar

**Solución recomendada**:
```typescript
// Wrapper con timeout para pagos
const paymentWithTimeout = Promise.race([
  processCardPayment(...),
  new Promise((_, reject) => 
    setTimeout(() => reject(new Error('Timeout: Verifica el estado en "Mis Registros"')), 30000)
  )
])
```

### 6. **Rate Limiting** ❌
**Problema**: Usuario hace clic múltiple en "Pagar"
- Múltiples requests a MP API
- Posibles pagos duplicados

**Solución recomendada**:
```typescript
// En checkout modal
const [isProcessing, setIsProcessing] = useState(false)

if (isProcessing) {
  return // Ignorar clics adicionales
}
setIsProcessing(true)
```

### 7. **Datos Inválidos en Tiempo Real** ❌
**Problema**: Validación solo al submit
- Usuario puede escribir DNI con letras, etc.

**Solución recomendada**:
```typescript
// Validación en onChange
<Input
  onChange={(e) => {
    const onlyNumbers = e.target.value.replace(/\D/g, '')
    setValue('dni', onlyNumbers.slice(0, 8))
  }}
/>
```

### 8. **Payment Method No Seleccionado** ❌
**Problema**: Si usuario clickea atrás y adelante
- paymentMethod puede quedar en estado inconsistente

**Solución recomendada**:
```typescript
// Reset al volver
const handleBack = () => {
  if (step === 'yape-form' || step === 'card-form') {
    setPaymentMethod(null)
    setYapePhone('')
    setYapeOtp('')
  }
  // ...
}
```

### 9. **Modal Cerrado Durante Pago** ❌
**Problema**: Usuario cierra modal mientras procesa
- Pago puede completarse pero usuario no ve resultado
- No sabe si pagó o no

**Solución recomendada**:
```typescript
// Prevenir cierre durante processing
const handleClose = () => {
  if (step === 'processing') {
    alert('Espera a que termine el procesamiento')
    return
  }
  onClose()
}
```

### 10. **Test vs Production Mixup** ❌
**Problema**: Credenciales TEST en producción
- Pagos reales no funcionan

**Solución recomendada**:
- Variable `NEXT_PUBLIC_MP_ENV` (TEST | PROD)
- Warning visible en dev: "⚠️ Modo TEST activo"
- Prevenir deploy a prod con keys TEST

### 11. **Webhook Payload Malformado** ⚠️ Parcial
**Problema**: MP envía data incompleta o diferente
- `data.id` puede ser undefined

**Solución recomendada**:
```typescript
const paymentId = req.body?.data?.id
if (!paymentId || typeof paymentId !== 'string') {
  return NextResponse.json({ error: 'Invalid payload' }, { status: 400 })
}
```

### 12. **DNI con Caracteres Especiales** ❌
**Problema**: Usuario pega DNI con espacios, guiones
- "1234-5678" vs "12345678"

**Solución recomendada**:
```typescript
// Normalizar antes de validar duplicados
const normalizedDni = validatedData.dni.replace(/\D/g, '')
```

---

## 🎯 Prioridad de Implementación

### Alta Prioridad (Crítico)
1. ✅ **Re-registro con status=pending** → Permitir completar pago
2. ✅ **Mensaje claro para status=paid** → "Ya estás registrado"
3. ✅ **Prevenir cierre de modal durante processing**
4. ✅ **Rate limiting en botones de pago**

### Media Prioridad (Importante)
5. ⚠️ **Cambio de precio durante checkout** → Validar en backend
6. ⚠️ **SDK no carga** → Fallback/recarga
7. ⚠️ **Timeout de pago MP API** → 30s límite

### Baja Prioridad (Nice to have)
8. ℹ️ **Validación en tiempo real** → UX mejorada
9. ℹ️ **Warning modo TEST** → Prevenir errores deploy
10. ℹ️ **DNI normalizado** → Evitar duplicados técnicos

---

## 📋 Checklist de Testing

Antes de producción, probar:

- [ ] Registro nuevo (happy path)
- [ ] Registro con email duplicado
- [ ] Registro con DNI duplicado  
- [ ] Pago con Yape exitoso
- [ ] Pago con tarjeta exitoso
- [ ] Pago rechazado (tarjeta test)
- [ ] Abandonar checkout y reintentar
- [ ] Cerrar modal y abrir de nuevo
- [ ] Verificar email de confirmación
- [ ] Verificar email de rechazo
- [ ] Webhook duplicado (enviar 2 veces)
- [ ] Cambio de precio (modificar fecha sistema)
- [ ] Timeout de email (desconectar SMTP)
- [ ] Re-registro con mismo email (pending)
- [ ] Re-registro con mismo email (paid)

---

**Fecha de auditoría**: 2026-02-17  
**Versión**: 1.0  
**Status**: Listo para mejoras críticas
