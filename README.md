# Simposio Veterinario 2026 - Event Registration Platform

A professional event registration platform for the International Veterinary Symposium 2026 in Lima, Peru.

## Features

### Public Landing Page
- **Hero Section**: Eye-catching event introduction with key statistics
- **Info Sections**: About the event, preliminary schedule, and venue location
- **Registration Form**: Comprehensive form with validation for:
  - Full name (3-100 characters)
  - 8-digit national ID (DNI)
  - 9-digit phone number
  - Valid email
  - Professional role (Veterinarian, Student, Researcher, Other)

### Checkout Experience
- **Payment Modal**: Summary of registration with price display
- **Mock Culqi Integration**: Simulated payment processing with 2-second delay
- **Success Screen**: Virtual ticket generation with mock QR code and reference number
- **Email Confirmation**: Detailed breakdown of what attendees receive

### Admin Dashboard
- **Authentication**: Email/password login with session management
- **Statistics**: Real-time stats for total registrations, paid, pending, and revenue
- **Attendee Table**: Search, filter, and manage registrations
- **Row Actions**:
  - View detailed attendee information
  - Mark registrations as paid
  - Delete registrations
- **Detailed Attendee View**: Full information including registration and payment details

## Tech Stack

- **Framework**: Next.js 16 with TypeScript
- **Styling**: Tailwind CSS with custom design tokens
- **UI Components**: shadcn/ui
- **Form Handling**: React Hook Form + Zod validation
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Custom session-based auth (demo)

## Color Scheme

- **Primary**: Deep Navy (#0f172a)
- **Secondary**: Medical Teal (#0d9488)
- **Neutrals**: White, light grays, off-white
- **Accent**: Teal highlights

## Fonts

- **Headings**: Playfair Display (serif)
- **Body**: Inter (sans-serif)

## Project Structure

```
/app
  /admin
    /login          - Admin login page
    /dashboard      - Main admin dashboard
  /page.tsx         - Public landing page
  /layout.tsx       - Root layout with fonts
  /globals.css      - Global styles and design tokens

/components
  /sections
    /hero-section.tsx      - Hero section with event info
    /info-sections.tsx     - About, agenda, location sections
  /forms
    /registration-form.tsx - Registration form with validation
  /modals
    /checkout-modal.tsx    - Payment and confirmation modal
  /admin
    /admin-dashboard.tsx        - Main dashboard component
    /attendee-details-modal.tsx - Attendee details view
  /ui                      - shadcn/ui components

/lib
  /supabase.ts       - Supabase client and types
  /validations.ts    - Zod schemas for forms
```

## Getting Started

### Prerequisites
- Node.js 18+
- Supabase project (optional for demo)

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   ```bash
   # .env.local
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000)

## Demo Credentials

**Admin Panel**: `/admin/login`
- Email: `admin@simposio.pe`
- Password: `admin123`

## Features in Detail

### Registration Flow
1. User fills out registration form with validation
2. Form data is submitted and checkout modal appears
3. User reviews registration details and price
4. User completes payment (simulated)
5. Success screen shows confirmation and QR code placeholder
6. Email confirmation details are displayed

### Admin Dashboard
1. Login with demo credentials
2. View statistics dashboard with key metrics
3. Search registrations by name, email, or DNI
4. View detailed attendee information
5. Mark pending registrations as paid
6. Delete registrations (with confirmation)
7. Session persists in localStorage (demo implementation)

## Customization

### Colors
Edit the CSS variables in `app/globals.css`:
```css
--primary: 200 30% 12%;
--secondary: 180 55% 45%;
```

### Fonts
Update font imports in `app/layout.tsx` and font configuration in `tailwind.config.ts`

### Event Details
Update copy and event details in:
- `components/sections/hero-section.tsx`
- `components/sections/info-sections.tsx`
- `components/forms/registration-form.tsx`

## Security Notes

This is a demo implementation. For production use:
- Implement proper authentication with Auth.js or Supabase Auth
- Use real payment processing (Culqi, Stripe, etc.)
- Enable Row Level Security (RLS) on Supabase tables
- Store sensitive data securely
- Implement proper session management with HTTP-only cookies
- Add CSRF protection
- Validate all inputs on the server side

## Future Enhancements

- Real Culqi/Stripe integration
- QR code generation (QR code library)
- Email notifications (Resend or similar)
- CSV export of attendee data
- Advanced filtering and reporting
- Multi-language support
- Dark mode toggle
- Responsive table improvements for mobile

## License

Created for Simposio Veterinario 2026. All rights reserved.
