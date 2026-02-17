# Setup Guide - Simposio Veterinario 2026

## Initial Setup

### 1. Environment Variables

Create a `.env.local` file in the root directory:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# MercadoPago Configuration
NEXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY=your_mp_public_key
MERCADOPAGO_ACCESS_TOKEN=your_mp_access_token
MERCADOPAGO_WEBHOOK_SECRET=your_mp_webhook_secret

# SMTP Email Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASSWORD=your_app_password
EMAIL_FROM="Simposio Veterinario <noreply@tudominio.com>"

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 2. Supabase Setup

1. Crea un proyecto en https://supabase.com
2. Ejecuta el script `scripts/setup-database.sql`:
   - Copia el SQL del archivo
   - Ve a Supabase → SQL Editor → New Query
   - Pega y ejecuta el SQL
3. Copia tu URL y anon key desde Supabase Settings → API
4. Actualiza `.env.local` con tus credenciales

> **Migración desde versión anterior:** Si ya tienes una base de datos existente con `culqi_order_id`,
> ejecuta `scripts/migrate-payment-column.sql` para renombrar la columna a `payment_order_id`
> y agregar la columna `payment_method`.

### 3. MercadoPago Setup

1. Crea una cuenta en https://www.mercadopago.com.pe/developers
2. Ve a **Tus integraciones** → Crea una nueva aplicación
3. Copia las credenciales:
   - **Public Key** → `NEXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY`
   - **Access Token** → `MERCADOPAGO_ACCESS_TOKEN`
4. Configura el webhook:
   - URL: `https://tu-dominio.com/api/webhooks/mercadopago`
   - Eventos: `payment` (Pagos)
   - Copia el secret → `MERCADOPAGO_WEBHOOK_SECRET`

#### Tarjetas de prueba (Sandbox)

| Tarjeta | Número | CVV | Vencimiento | Resultado |
|---------|--------|-----|-------------|-----------|
| Mastercard | 5031 7557 3453 0604 | 123 | 11/25 | Aprobado |
| Visa | 4509 9535 6623 3704 | 123 | 11/25 | Aprobado |
| Mastercard | 5031 7557 3453 0604 | 456 | 11/25 | Rechazado |

DNI de prueba: `12345678`

#### Métodos de pago habilitados
- **Yape**: Pago con código OTP + número de teléfono
- **Tarjetas de crédito/débito**: Visa, Mastercard, etc.

### 4. Email Setup (Gmail)

1. Ve a tu cuenta de Google → Seguridad → Verificación en dos pasos (activar)
2. Genera una **Contraseña de aplicación**:
   - En Google Account → Seguridad → Contraseñas de aplicaciones
   - Selecciona "Otro" → Nombre: "Simposio"
   - Copia la contraseña generada → `SMTP_PASSWORD`
3. Usa tu email → `SMTP_USER`

### 5. Database Schema

La aplicación usa estas tablas:

#### attendees
```sql
- id: UUID (primary key)
- nombre: TEXT (required)
- dni: TEXT (unique, 8 digits)
- email: TEXT (unique)
- telefono: TEXT (9 digits)
- rol: ENUM (Veterinario, Estudiante, Investigador, Otro)
- estado: ENUM (pending, paid, cancelled) - default: pending
- monto_pago: DECIMAL (default: 0)
- numero_referencia: TEXT (optional)
- payment_order_id: TEXT (optional) - ID de transacción MercadoPago
- payment_method: TEXT (yape, card, manual) - Método de pago usado
- qr_code: TEXT (optional)
- created_at: TIMESTAMP
- updated_at: TIMESTAMP
- paid_at: TIMESTAMP (optional)
```

#### admin_users
```sql
- id: UUID (primary key)
- email: TEXT (unique)
- password_hash: TEXT
- is_active: BOOLEAN (default: true)
- created_at: TIMESTAMP
- last_login: TIMESTAMP (optional)
```

## Running the Application

### Development Mode
```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000)

### Production Build
```bash
pnpm build
pnpm start
```

## Testing

### Public Landing Page
1. Navega a `/`
2. Explora hero section, about, agenda y ubicación
3. Llena el formulario de registro
4. Procede al modal de pago
5. Selecciona Yape o Tarjeta
6. Completa el pago con MercadoPago (usa tarjetas de prueba en sandbox)
7. Verifica email de confirmación

### Admin Dashboard
1. Navega a `/admin/login`
2. Usa credenciales demo:
   - Email: `admin@simposio.pe`
   - Password: `admin123`
3. Ve estadísticas y tabla de asistentes
4. Busca registros
5. Ve detalles del asistente (incluye ID de transacción y método de pago)
6. Marca registros como pagados (envía email de confirmación)
7. Elimina registros
8. Exporta datos a Excel/CSV

## Customization Guide

### Change Event Name
Update in:
- `/app/layout.tsx` - metadata title and description
- `/components/sections/hero-section.tsx` - event name and date
- `/components/sections/info-sections.tsx` - sections and location
- `/README.md`

### Change Colors
Edit CSS variables in `/app/globals.css`:

**Light Mode:**
```css
--primary: 200 30% 12%;        /* Deep Navy */
--secondary: 180 55% 45%;      /* Medical Teal */
--background: 0 0% 100%;       /* White */
--foreground: 0 0% 3.9%;       /* Near Black */
```

**Dark Mode:**
```css
/* Update .dark selector */
--primary: 180 55% 50%;
--secondary: 200 30% 12%;
--background: 200 30% 8%;
--foreground: 0 0% 95%;
```

### Change Fonts
1. Edit `/app/layout.tsx`:
   ```tsx
   import { NewFont } from 'next/font/google'
   const newFont = NewFont({ subsets: ['latin'], variable: '--font-new' })
   ```

2. Update `/tailwind.config.ts`:
   ```ts
   fontFamily: {
     sans: ['var(--font-new)', 'sans-serif'],
   }
   ```

### Change Pricing
1. Update in `/components/forms/registration-form.tsx`:
   ```tsx
   const price = 299.00  // Change this value
   const currency = 'S/' // Change currency
   ```

2. Update in `/components/modals/checkout-modal.tsx`:
   ```tsx
   const price = 299.00  // Same value here
   ```

### Modify Registration Form Fields
1. Edit `/lib/validations.ts` - Update Zod schema
2. Edit `/components/forms/registration-form.tsx` - Update form fields
3. Update database schema if using Supabase

## Integration with Real Services

### MercadoPago Payment Gateway
Ya integrado. Soporta:
- **Yape**: Token generado con SDK JS MP → OTP + teléfono → pago server-side
- **Tarjetas**: Tokenización via MP API → pago server-side
- **Webhooks**: Endpoint `/api/webhooks/mercadopago` para notificaciones IPN
- **Verificación**: Validación HMAC de firma del webhook

### Email Notifications
Ya integrado con Nodemailer:
- Email de confirmación al completar pago
- Email de confirmación al marcar como pagado desde admin
- Plantillas HTML responsivas

### Webhook Configuration
En tu panel de MercadoPago Developers:
1. Ve a Webhooks
2. URL de producción: `https://tu-dominio.com/api/webhooks/mercadopago`
3. Selecciona evento: `payment`
4. El webhook actualiza automáticamente el estado del asistente

## Deployment

### Vercel Deployment
1. Connect GitHub repository to Vercel
2. Add environment variables in Vercel settings
3. Deploy with one click

### Self-Hosted
1. Build the project: `npm run build`
2. Deploy the `.next` folder
3. Set environment variables on your server

## Security Checklist

- [x] Pagos procesados server-side (tokens, no datos de tarjeta)
- [x] Variables de entorno para datos sensibles
- [x] Validación de webhook con HMAC signature
- [x] Validación de inputs server-side con Zod
- [ ] Implementar autenticación real (no usar localStorage en producción)
- [ ] Usar HTTPS para todas las comunicaciones
- [ ] Implementar protección CSRF
- [ ] Habilitar Row Level Security (RLS) en Supabase
- [ ] Rate limit en endpoint de registro
- [ ] Sanitizar queries a base de datos
- [ ] Agregar logging para eventos de seguridad
- [ ] Auditorías de seguridad regulares

## Troubleshooting

### Components Not Found
- Ensure all UI components are in `/components/ui/`
- Check import paths in created components

### Database Connection Issues
- Verify Supabase URL and API key in `.env.local`
- Check Supabase project is active
- Verify tables exist in database

### Form Validation Not Working
- Check Zod schema in `/lib/validations.ts`
- Ensure React Hook Form is properly imported
- Verify form field names match schema

### Admin Login Issues
- In demo mode, credentials are hardcoded: `admin@simposio.pe` / `admin123`
- Session is stored in localStorage
- Clear localStorage and try again if stuck

## Support

For issues or questions, refer to:
- README.md for feature overview
- Component comments for implementation details
- Supabase documentation for database setup
- Next.js documentation for framework features
