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

// Template base para emails
const baseTemplate = (content: string) => `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Simposio Veterinario 2026</title>
  <style>
    body {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      line-height: 1.6;
      color: #0f172a;
      margin: 0;
      padding: 0;
      background-color: #f8fafc;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      background-color: #ffffff;
    }
    .header {
      background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
      padding: 32px 24px;
      text-align: center;
    }
    .header h1 {
      color: #ffffff;
      font-size: 24px;
      margin: 0 0 8px 0;
      font-weight: 700;
    }
    .header p {
      color: rgba(255,255,255,0.8);
      margin: 0;
      font-size: 14px;
    }
    .content {
      padding: 32px 24px;
    }
    .ticket-card {
      background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
      border-radius: 16px;
      padding: 24px;
      color: white;
      margin: 24px 0;
    }
    .ticket-card h3 {
      margin: 0 0 16px 0;
      font-size: 18px;
    }
    .ticket-info {
      display: flex;
      justify-content: space-between;
      margin-bottom: 12px;
      font-size: 14px;
    }
    .ticket-info span:first-child {
      color: rgba(255,255,255,0.7);
    }
    .ticket-code {
      background: white;
      color: #0f172a;
      padding: 16px;
      border-radius: 8px;
      text-align: center;
      margin-top: 16px;
    }
    .ticket-code p {
      margin: 0 0 8px 0;
      font-size: 12px;
      color: #64748b;
    }
    .ticket-code code {
      font-family: monospace;
      font-size: 14px;
      word-break: break-all;
    }
    .btn {
      display: inline-block;
      background-color: #0d9488;
      color: white;
      padding: 14px 32px;
      text-decoration: none;
      border-radius: 8px;
      font-weight: 600;
      margin-top: 24px;
    }
    .info-box {
      background-color: #f0fdfa;
      border: 1px solid #99f6e4;
      border-radius: 8px;
      padding: 16px;
      margin: 24px 0;
    }
    .info-box h4 {
      color: #0d9488;
      margin: 0 0 8px 0;
      font-size: 14px;
    }
    .info-box p {
      margin: 0;
      font-size: 14px;
      color: #0f172a;
    }
    .warning-box {
      background-color: #fffbeb;
      border: 1px solid #fcd34d;
      border-radius: 8px;
      padding: 16px;
      margin: 24px 0;
    }
    .warning-box h4 {
      color: #d97706;
      margin: 0 0 8px 0;
      font-size: 14px;
    }
    .footer {
      background-color: #f8fafc;
      padding: 24px;
      text-align: center;
      font-size: 12px;
      color: #64748b;
    }
    .footer a {
      color: #0d9488;
      text-decoration: none;
    }
    .social-links {
      margin-top: 16px;
    }
    .social-links a {
      display: inline-block;
      margin: 0 8px;
    }
    ul {
      padding-left: 20px;
    }
    li {
      margin-bottom: 8px;
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
        12 y 13 de Junio, 2026<br>
        Hotel Costa del Sol - El Golf, Trujillo
      </p>
      <p style="margin-top: 16px;">
        <a href="mailto:circulodeestudiosclaudebourgela@gmail.com">circulodeestudiosclaudebourgela@gmail.com</a><br>
        +51 999 888 777
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
    <h2 style="color: #0f172a; margin-bottom: 8px;">¡Felicitaciones, ${data.fullName.split(' ')[0]}!</h2>
    <p style="color: #64748b; margin-top: 0;">Tu registro ha sido confirmado exitosamente.</p>
    
    <div class="ticket-card">
      <h3>🎫 Tu Ticket Digital</h3>
      <div class="ticket-info">
        <span>Participante:</span>
        <span>${data.fullName}</span>
      </div>
      <div class="ticket-info">
        <span>DNI:</span>
        <span>${data.dni}</span>
      </div>
      <div class="ticket-info">
        <span>Tipo:</span>
        <span>${roleLabel}</span>
      </div>
      <div class="ticket-info">
        <span>Fecha:</span>
        <span>12-13 de Junio, 2026</span>
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
      <h4>📍 Ubicación del Evento</h4>
      <p>
        Hotel Costa del Sol - El Golf<br>
        Av. El Golf 580, Trujillo, La Libertad
      </p>
    </div>
    
    <h3 style="font-size: 16px; margin-top: 32px;">Tu registro incluye:</h3>
    <ul>
      <li>✅ Acceso a todas las ponencias y paneles</li>
      <li>✅ Participación en talleres especializados</li>
      <li>✅ Coffee breaks y material digital</li>
      <li>✅ Certificado de participación</li>
    </ul>
    
    <div class="info-box">
      <h4>📋 El día del evento</h4>
      <p>
        Presenta este correo o tu código de ticket junto con tu DNI en el registro.
        Te recomendamos llegar 30 minutos antes para la acreditación.
      </p>
    </div>
    
    <p style="text-align: center;">
      <a href="https://simposio.claudebourgelat.org" class="btn">Ver Agenda Completa</a>
    </p>
  `)
}

// Email de pago pendiente (Yape/Plin)
export function generatePendingPaymentEmail(data: RegistrationEmailData, paymentMethod: 'yape' | 'plin'): string {
  const methodName = paymentMethod === 'yape' ? 'Yape' : 'Plin'
  
  return baseTemplate(`
    <h2 style="color: #0f172a; margin-bottom: 8px;">¡Hola, ${data.fullName.split(' ')[0]}!</h2>
    <p style="color: #64748b; margin-top: 0;">Hemos recibido tu solicitud de inscripción.</p>
    
    <div class="warning-box">
      <h4>⏳ Pago pendiente de verificación</h4>
      <p>
        Tu pago por <strong>${methodName}</strong> está siendo verificado.<br>
        Este proceso puede tomar hasta 24 horas hábiles.
      </p>
    </div>
    
    <div style="background: #f8fafc; border-radius: 8px; padding: 16px; margin: 24px 0;">
      <p style="margin: 0 0 8px 0; font-size: 12px; color: #64748b;">Código de registro:</p>
      <code style="font-family: monospace; font-size: 14px; color: #0f172a; word-break: break-all;">
        ${data.ticketCode}
      </code>
    </div>
    
    <h3 style="font-size: 16px;">Datos de tu registro:</h3>
    <table style="width: 100%; font-size: 14px; border-collapse: collapse;">
      <tr>
        <td style="padding: 8px 0; color: #64748b;">Nombre:</td>
        <td style="padding: 8px 0; text-align: right;">${data.fullName}</td>
      </tr>
      <tr>
        <td style="padding: 8px 0; color: #64748b;">DNI:</td>
        <td style="padding: 8px 0; text-align: right;">${data.dni}</td>
      </tr>
      <tr>
        <td style="padding: 8px 0; color: #64748b;">Monto:</td>
        <td style="padding: 8px 0; text-align: right;">S/ ${data.amount.toFixed(2)}</td>
      </tr>
      <tr>
        <td style="padding: 8px 0; color: #64748b;">Método:</td>
        <td style="padding: 8px 0; text-align: right;">${methodName}</td>
      </tr>
    </table>
    
    <div class="info-box">
      <h4>✅ ¿Qué sigue?</h4>
      <p>
        Una vez verificado tu pago, recibirás otro correo con tu ticket digital y 
        todos los detalles para el día del evento.
      </p>
    </div>
    
    <p style="font-size: 14px; color: #64748b;">
      Si tienes alguna pregunta o no realizaste esta inscripción, contáctanos a 
      <a href="mailto:circulodeestudiosclaudebourgela@gmail.com" style="color: #0d9488;">circulodeestudiosclaudebourgela@gmail.com</a>
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
        <span>12-13 de Junio, 2026</span>
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
        Hotel Costa del Sol - El Golf<br>
        Av. El Golf 580, Trujillo<br>
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
    await transporter.sendMail({
      from: `"${FROM_NAME}" <${FROM_EMAIL}>`,
      to,
      subject,
      html: htmlContent,
    })
    
    console.log(`[Email] Sent to ${to}: ${subject}`)
    return { success: true }
  } catch (error) {
    console.error('[Email] Failed to send:', error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Error al enviar el correo' 
    }
  }
}
