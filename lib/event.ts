// Estado de la edición en curso.
// Las inscripciones se muestran hasta REGISTRATION_CLOSES_AT. Pasada esa fecha la
// parte pública cambia a "edición realizada": sin cuenta regresiva, sin formulario
// ni botones de inscripción. Para reabrir en una futura edición basta con mover
// esta fecha (y actualizar fechas y programa del evento).
export const REGISTRATION_CLOSES_AT = new Date('2026-06-05T08:00:00-05:00')

export const EVENT_START = new Date('2026-06-05T08:00:00-05:00')

export function isRegistrationOpen(now: Date = new Date()) {
  return now < REGISTRATION_CLOSES_AT
}

// Contacto del Círculo de Estudios (el mismo que figura en el flyer y el footer)
export const CONTACT = {
  email: 'circulodeestudiosclaudebourgela@gmail.com',
  phones: [
    { label: '+51 920 211 630', tel: '+51920211630' },
    { label: '+51 940 668 619', tel: '+51940668619' },
  ],
  whatsapp: '51920211630',
}

export function whatsappLink(message: string) {
  return `https://wa.me/${CONTACT.whatsapp}?text=${encodeURIComponent(message)}`
}
