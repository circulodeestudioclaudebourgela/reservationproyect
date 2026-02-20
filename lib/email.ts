import nodemailer from 'nodemailer'

// Configuración del servidor de correo
// Actualiza esstas variables en tu .env
const EMAIL_CONFIG = {
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER || '',
    pass: process.env.SMTP_PASS || '',
  },
  // Timeouts para evitar que se quede colgado
  connectionTimeout: 15000, // 15 segundos para conectar
  greetingTimeout: 10000,   // 10 segundos para greeting
  socketTimeout: 30000,     // 30 segundos para operaciones
}

const FROM_EMAIL = process.env.EMAIL_FROM || 'circulodeestudiosclaudebourgela@gmail.com'
const FROM_NAME = 'II Simposio Veterinario Internacional 2026'

// Crear transporter
export const transporter = nodemailer.createTransport(EMAIL_CONFIG)

// Verificar conexión (opcional, para debugging)
export async function verifyEmailConnection(): Promise<boolean> {
  try {
    await transporter.verify()
    console.log('[Email] SMTP connection verified')
    return true
  } catch (error) {
    console.error('[Email] SMTP connection failed:', error)
    return false
  }
}

// Template base para emails (Compatible con dark/light mode)
const baseTemplate = (content: string) => `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="color-scheme" content="light dark">
  <meta name="supported-color-schemes" content="light dark">
  <title>Simposio Veterinario 2026</title>
  <style>
    :root {
      color-scheme: light dark;
      supported-color-schemes: light dark;
    }
    
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Helvetica', 'Arial', sans-serif;
      line-height: 1.6;
      margin: 0;
      padding: 0;
      background-color: #f5f5f5;
    }
    
    .container {
      max-width: 600px;
      margin: 0 auto;
      background-color: #ffffff;
    }
    
    .header {
      background: linear-gradient(135deg, #1e40af 0%, #3b82f6 100%);
      padding: 40px 24px;
      text-align: center;
      color: #ffffff;
    }
    
    .header h1 {
      color: #ffffff !important;
      font-size: 24px;
      margin: 0 0 8px 0;
      font-weight: 600;
    }
    
    .header p {
      color: rgba(255,255,255,0.9) !important;
      margin: 0;
      font-size: 14px;
      font-weight: 400;
    }
    
    .content {
      padding: 32px 24px;
      background-color: #ffffff;
    }
    
    .ticket-card {
      background-color: #f8fafc;
      border: 2px solid #e2e8f0;
      border-radius: 12px;
      padding: 24px;
      margin: 24px 0;
    }
    
    .ticket-card h3 {
      margin: 0 0 20px 0;
      font-size: 18px;
      font-weight: 600;
      color: #1e293b;
      border-bottom: 1px solid #e2e8f0;
      padding-bottom: 12px;
    }
    
    .ticket-info {
      display: flex;
      justify-content: space-between;
      margin-bottom: 12px;
      font-size: 14px;
      padding: 8px 0;
    }
    
    .ticket-info span:first-child {
      color: #64748b;
      font-weight: 500;
    }
    
    .ticket-info span:last-child {
      color: #0f172a;
      font-weight: 600;
      text-align: right;
    }
    
    .ticket-code {
      background: #ffffff;
      border: 2px dashed #cbd5e1;
      padding: 20px;
      border-radius: 8px;
      text-align: center;
      margin-top: 20px;
    }
    .ticket-code p {
      margin: 0 0 8px 0;
      font-size: 11px;
      color: #64748b;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      font-weight: 600;
    }
    .ticket-code code {
      font-family: 'Courier New', monospace;
      font-size: 16px;
      font-weight: 700;
      color: #1e40af;
      letter-spacing: 2px;
      word-break: break-all;
      display: block;
    }
    
    .btn {
      display: inline-block;
      background-color: #1e40af;
      color: #ffffff !important;
      padding: 14px 32px;
      text-decoration: none;
      border-radius: 8px;
      font-weight: 600;
      margin-top: 20px;
      transition: background-color 0.2s;
    }
    
    .btn:hover {
      background-color: #1e3a8a;
    }
    
    .info-box {
      background-color: #f0f9ff;
      border-left: 4px solid #3b82f6;
      border-radius: 4px;
      padding: 16px;
      margin: 24px 0;
    }
    
    .info-box h4 {
      color: #1e40af;
      margin: 0 0 8px 0;
      font-size: 14px;
      font-weight: 600;
    }
    
    .info-box p {
      margin: 0;
      font-size: 14px;
      color: #334155;
      line-height: 1.5;
    }
    
    .success-box {
      background-color: #f0fdf4;
      border-left: 4px solid #22c55e;
      border-radius: 4px;
      padding: 16px;
      margin: 24px 0;
    }
    
    .success-box h4 {
      color: #16a34a;
      margin: 0 0 8px 0;
      font-size: 14px;
      font-weight: 600;
    }
    
    .warning-box {
      background-color: #fffbeb;
      border-left: 4px solid #f59e0b;
      border-radius: 4px;
      padding: 16px;
      margin: 24px 0;
    }
    
    .warning-box h4 {
      color: #d97706;
      margin: 0 0 8px 0;
      font-size: 14px;
      font-weight: 600;
    }
    
    .warning-box p {
      margin: 0;
      font-size: 14px;
      color: #78350f;
    }
    
    .error-box {
      background-color: #fef2f2;
      border-left: 4px solid #ef4444;
      border-radius: 4px;
      padding: 16px;
      margin: 24px 0;
    }
    
    .error-box h4 {
      color: #dc2626;
      margin: 0 0 8px 0;
      font-size: 14px;
      font-weight: 600;
    }
    
    .error-box p {
      margin: 0;
      font-size: 14px;
      color: #7f1d1d;
    }
    
    .footer {
      background-color: #f8fafc;
      padding: 24px;
      text-align: center;
      font-size: 12px;
      color: #64748b;
      border-top: 1px solid #e2e8f0;
    }
    
    .footer strong {
      color: #334155;
    }
    
    .footer a {
      color: #1e40af;
      text-decoration: none;
    }
    
    ul {
      padding-left: 20px;
      margin: 16px 0;
    }
    
    li {
      margin-bottom: 8px;
      color: #334155;
    }
    
    h2 {
      color: #0f172a;
      font-size: 20px;
      margin: 0 0 8px 0;
      font-weight: 600;
    }
    
    p {
      color: #475569;
      margin: 12px 0;
    }
    
    /* Dark mode support */
    @media (prefers-color-scheme: dark) {
      body {
        background-color: #0f172a !important;
      }
      .container {
        background-color: #1e293b !important;
      }
      .content {
        background-color: #1e293b !important;
      }
      .ticket-card {
        background-color: #0f172a !important;
        border-color: #334155 !important;
      }
      .ticket-card h3 {
        color: #e2e8f0 !important;
        border-bottom-color: #334155 !important;
      }
      .ticket-info span:first-child {
        color: #94a3b8 !important;
      }
      .ticket-info span:last-child {
        color: #f1f5f9 !important;
      }
      .ticket-code {
        background-color: #1e293b !important;
        border-color: #475569 !important;
      }
      .ticket-code code {
        color: #60a5fa !important;
      }
      .footer {
        background-color: #0f172a !important;
        border-top-color: #334155 !important;
      }
      h2 {
        color: #f1f5f9 !important;
      }
      p {
        color: #cbd5e1 !important;
      }
      li {
        color: #cbd5e1 !important;
      }
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>II Simposio Veterinario Internacional</h1>
      <p>Círculo de Estudios Claude Bourgelat • 2026</p>
    </div>
    <div class="content">
      ${content}
    </div>
    <div class="footer">
      <p>
        <strong>II Simposio Veterinario Internacional 2026</strong><br>
        05 y 06 de Junio, 2026 • Hotel Costa del Sol - Av. Los Cocoteros 505, El Golf, Trujillo
      </p>
      <p style="margin-top: 16px;">
        <a href="mailto:circulodeestudiosclaudebourgela@gmail.com">circulodeestudiosclaudebourgela@gmail.com</a>
      </p>
      <p style="margin-top: 16px; font-size: 11px; color: #94a3b8;">
        Este correo fue enviado por el sistema de registro del Simposio Veterinario.<br>
        © ${new Date().getFullYear()} Círculo de Estudios Claude Bourgelat. Todos los derechos reservados.
      </p>
    </div>
  </div>
</body>
</html>
`

// Tipos para los emails
export interface RegistrationEmailData {
  fullName: string
  email: string
  dni: string
  phone: string
  role: 'student' | 'professional'
  organization?: string
  ticketCode: string
  amount: number
}

// Email de confirmación de pago exitoso
export function generatePaymentConfirmationEmail(data: RegistrationEmailData): string {
  const roleLabel = data.role === 'professional' ? 'Profesional Veterinario' : 'Estudiante'
  
  return baseTemplate(`
    <div class="success-box">
      <h4>✓ Pago confirmado</h4>
      <p>Tu registro ha sido procesado exitosamente.</p>
    </div>
    
    <h2>Hola, ${data.fullName.split(' ')[0]}</h2>
    <p>Gracias por tu inscripción al II Simposio Veterinario Internacional 2026.</p>
    
    <div class="ticket-card">
      <h3>Ticket Digital</h3>
      <div class="ticket-info">
        <span>Participante:</span>
        <span>${data.fullName}</span>
      </div>
      <div class="ticket-info">
        <span>DNI:</span>
        <span>${data.dni}</span>
      </div>
      <div class="ticket-info">
        <span>Categoría:</span>
        <span>${roleLabel}</span>
      </div>
      <div class="ticket-info">
        <span>Fecha del evento:</span>
        <span>05-06 de Junio, 2026</span>
      </div>
      <div class="ticket-info">
        <span>Monto pagado:</span>
        <span>S/ ${data.amount.toFixed(2)}</span>
      </div>
      <div class="ticket-code">
        <p>CÓDIGO DE TICKET</p>
        <code>${data.ticketCode}</code>
      </div>
    </div>
    
    <div class="info-box">
      <h4>Ubicación del evento</h4>
      <p>
        <strong>Hotel Costa del Sol</strong><br>
        Av. Los Cocoteros 505, Urb. El Golf, Trujillo
      </p>
    </div>
    
    <h3 style="font-size: 16px; margin-top: 28px; color: #1e293b;">Tu registro incluye:</h3>
    <ul>
      <li>Acceso a todas las ponencias y paneles</li>
      <li>Participación en talleres especializados</li>
      <li>Coffee breaks y material del evento</li>
      <li>Certificado de participación</li>
    </ul>
    
    <div class="info-box">
      <h4>El día del evento</h4>
      <p>
        Presenta este correo o tu código de ticket junto con tu DNI en el registro.
        Te recomendamos llegar 30 minutos antes para la acreditación.
      </p>
    </div>
    
    <p style="color: #64748b; font-size: 14px; margin-top: 24px;">
      Si tienes alguna pregunta, no dudes en contactarnos.
    </p>
  `)
}

// Email de pago pendiente
export function generatePendingPaymentEmail(data: RegistrationEmailData, paymentMethod: string): string {
  return baseTemplate(`
    <div class="warning-box">
      <h4>⏳ Pago pendiente de verificación</h4>
      <p>Tu pago está siendo procesado. Te notificaremos una vez confirmado.</p>
    </div>
    
    <h2>Hola, ${data.fullName.split(' ')[0]}</h2>
    <p>Hemos recibido tu solicitud de inscripción al II Simposio Veterinario Internacional 2026.</p>
    
    <div class="ticket-card">
      <h3>Datos de tu registro</h3>
      <div class="ticket-info">
        <span>Nombre:</span>
        <span>${data.fullName}</span>
      </div>
      <div class="ticket-info">
        <span>DNI:</span>
        <span>${data.dni}</span>
      </div>
      <div class="ticket-info">
        <span>Monto:</span>
        <span>S/ ${data.amount.toFixed(2)}</span>
      </div>
      <div class="ticket-info">
        <span>Método de pago:</span>
        <span>${paymentMethod}</span>
      </div>
      <div class="ticket-code">
        <p>CÓDIGO DE REGISTRO</p>
        <code>${data.ticketCode}</code>
      </div>
    </div>
    
    <div class="info-box">
      <h4>Próximos pasos</h4>
      <p>
        Una vez verificado tu pago, recibirás otro correo con tu ticket digital confirmado
        y todos los detalles para el día del evento.
      </p>
    </div>
    
    <p style="font-size: 14px; color: #64748b;">
      Si tienes alguna pregunta, contáctanos a 
      <a href="mailto:circulodeestudiosclaudebourgela@gmail.com" style="color: #1e40af;">circulodeestudiosclaudebourgela@gmail.com</a>
    </p>
  `)
}

// Email de pago rechazado
export function generatePaymentRejectedEmail(
  data: RegistrationEmailData, 
  reason: string
): string {
  return baseTemplate(`
    <div class="error-box">
      <h4>✗ Pago no procesado</h4>
      <p>No pudimos procesar tu pago. Por favor, intenta nuevamente.</p>
    </div>
    
    <h2>Hola, ${data.fullName.split(' ')[0]}</h2>
    <p>Intentaste registrarte al II Simposio Veterinario Internacional 2026, pero tu pago no pudo ser procesado.</p>
    
    <div class="ticket-card">
      <h3>Detalles del intento</h3>
      <div class="ticket-info">
        <span>Nombre:</span>
        <span>${data.fullName}</span>
      </div>
      <div class="ticket-info">
        <span>DNI:</span>
        <span>${data.dni}</span>
      </div>
      <div class="ticket-info">
        <span>Monto:</span>
        <span>S/ ${data.amount.toFixed(2)}</span>
      </div>
      <div class="info-box" style="margin-top: 16px; background-color: #fef2f2; border-left-color: #ef4444;">
        <h4 style="color: #dc2626;">Motivo del rechazo</h4>
        <p style="color: #7f1d1d;">${reason}</p>
      </div>
    </div>
    
    <div class="info-box">
      <h4>¿Qué puedes hacer?</h4>
      <p>
        • Verifica que tu tarjeta tenga fondos suficientes<br>
        • Intenta con otro método de pago<br>
        • Contacta con tu banco si el problema persiste<br>
        • Vuelve a intentar tu registro en nuestra web
      </p>
    </div>
    
    <p style="text-align: center; margin-top: 24px;">
      <a href="${process.env.NEXT_PUBLIC_APP_URL || 'https://v0-veterinary-symposium-registratio.vercel.app'}" class="btn">Intentar Nuevamente</a>
    </p>
    
    <p style="font-size: 14px; color: #64748b; margin-top: 24px;">
      Si necesitas ayuda, contáctanos a 
      <a href="mailto:circulodeestudiosclaudebourgela@gmail.com" style="color: #1e40af;">circulodeestudiosclaudebourgela@gmail.com</a>
    </p>
  `)
}

// Email de recordatorio del evento
export function generateEventReminderEmail(data: RegistrationEmailData, daysUntilEvent: number): string {
  const dayText = daysUntilEvent === 1 ? '¡Mañana es el gran día!' : `¡Faltan solo ${daysUntilEvent} días!`
  
  return baseTemplate(`
    <h2 style="color: #0f172a; margin-bottom: 8px;">${dayText}</h2>
    <p style="color: #64748b; margin-top: 0;">
      ${data.fullName.split(' ')[0]}, el II Simposio Veterinario Internacional te espera.
    </p>
    
    <div class="ticket-card">
      <div class="ticket-info">
        <span>📅 Fecha:</span>
        <span>05-06 de Junio, 2026</span>
      </div>
      <div class="ticket-info">
        <span>📍 Lugar:</span>
        <span>Hotel Costa del Sol - El Golf</span>
      </div>
      <div class="ticket-info">
        <span>⏰ Registro:</span>
        <span>8:00 AM</span>
      </div>
      <div class="ticket-code">
        <p>TU CÓDIGO DE TICKET</p>
        <code>${data.ticketCode}</code>
      </div>
    </div>
    
    <h3 style="font-size: 16px;">No olvides traer:</h3>
    <ul>
      <li>📱 Este correo o captura del código de ticket</li>
      <li>🎫 Tu DNI (${data.dni})</li>
      <li>📓 Bloc de notas para los talleres</li>
    </ul>
    
    <div class="info-box">
      <h4>📍 Cómo llegar</h4>
      <p>
        Hotel Costa del Sol — Urb. El Golf<br>
        Av. Los Cocoteros 505, Trujillo<br>
        <a href="https://maps.google.com/?q=Hotel+Costa+del+Sol+El+Golf+Trujillo" style="color: #0d9488;">
          Ver en Google Maps →
        </a>
      </p>
    </div>
    
    <p style="text-align: center;">
      <a href="https://simposio.claudebourgelat.org/agenda" class="btn">Ver Agenda del Evento</a>
    </p>
  `)
}

// Función para enviar email
export async function sendEmail(
  to: string,
  subject: string,
  htmlContent: string
): Promise<{ success: boolean; error?: string }> {
  try {
    console.log(`[Email] Attempting to send to ${to}...`)
    
    const info = await transporter.sendMail({
      from: `"${FROM_NAME}" <${FROM_EMAIL}>`,
      to,
      subject,
      html: htmlContent,
    })
    
    console.log(`[Email] ✓ Successfully sent to ${to}:`, {
      subject,
      messageId: info.messageId,
      response: info.response,
    })
    
    return { success: true }
  } catch (error) {
    console.error('[Email] ✗ Failed to send:', {
      to,
      subject,
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
    })
    
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Error al enviar el correo' 
    }
  }
}
