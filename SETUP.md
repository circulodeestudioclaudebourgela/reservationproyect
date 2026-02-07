# Setup Guide - Simposio Veterinario 2026

## Initial Setup

### 1. Environment Variables

Create a `.env.local` file in the root directory:

```env
# Supabase Configuration (Optional for demo)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

For now, the app works with mock data. To integrate Supabase:

### 2. Supabase Setup (Optional)

If you want to use a real database:

1. Create a Supabase project at https://supabase.com
2. Run the migration script from `scripts/setup-database.sql`:
   - Copy the SQL from the file
   - Go to Supabase → SQL Editor → New Query
   - Paste and execute the SQL
3. Copy your project URL and anon key from Supabase settings
4. Update `.env.local` with your credentials

### 3. Database Schema

The application expects these tables:

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
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### Production Build
```bash
npm run build
npm start
```

## Testing

### Public Landing Page
1. Navigate to `/`
2. Browse hero section, about, agenda, and location
3. Fill out registration form
4. Proceed to payment modal
5. Complete mock payment
6. View success screen with mock QR code

### Admin Dashboard
1. Navigate to `/admin/login`
2. Use demo credentials:
   - Email: `admin@simposio.pe`
   - Password: `admin123`
3. View statistics and attendee table
4. Search registrations
5. View attendee details
6. Mark registrations as paid
7. Delete registrations

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

### Culqi Payment Gateway
1. Get Culqi API keys from https://culqi.com
2. Create server action for payment processing
3. Replace mock payment in `/components/modals/checkout-modal.tsx`

### Email Notifications
1. Set up Resend (https://resend.com) or another provider
2. Create email templates
3. Send emails on successful registration

### QR Code Generation
1. Install QR code library: `npm install qrcode.react`
2. Generate QR codes in checkout modal
3. Update QR code placeholder in success screen

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

- [ ] Implement proper authentication (don't use localStorage in production)
- [ ] Use HTTPS for all communications
- [ ] Validate all inputs server-side
- [ ] Implement CSRF protection
- [ ] Use environment variables for sensitive data
- [ ] Enable Row Level Security (RLS) in Supabase
- [ ] Rate limit registration endpoint
- [ ] Sanitize database queries
- [ ] Implement proper error handling
- [ ] Add logging for security events
- [ ] Regular security audits

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
