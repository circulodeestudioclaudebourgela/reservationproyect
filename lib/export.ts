import type { Attendee } from '@/lib/supabase'

/**
 * Utilidades para exportar datos a diferentes formatos
 */

// Mapeo de campos para exportación
const FIELD_LABELS: Record<keyof Attendee, string> = {
  id: 'ID',
  created_at: 'Fecha de Registro',
  full_name: 'Nombre Completo',
  dni: 'DNI',
  email: 'Correo Electrónico',
  phone: 'Teléfono',
  role: 'Tipo',
  organization: 'Institución',
  status: 'Estado de Pago',
  payment_order_id: 'ID de Transacción',
  payment_method: 'Método de Pago',
  ticket_code: 'Código de Ticket',
}

// Campos a incluir en la exportación (en orden)
const EXPORT_FIELDS: (keyof Attendee)[] = [
  'full_name',
  'dni',
  'email',
  'phone',
  'role',
  'organization',
  'status',
  'payment_method',
  'ticket_code',
  'created_at',
  'payment_order_id',
]

/**
 * Formatea un valor para exportación
 */
function formatValue(value: unknown, field: keyof Attendee): string {
  if (value === null || value === undefined) return ''
  
  if (field === 'created_at') {
    return new Date(value as string).toLocaleDateString('es-PE', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    })
  }
  
  if (field === 'role') {
    return value === 'professional' ? 'Profesional' : 'Estudiante'
  }
  
  if (field === 'status') {
    return value === 'paid' ? 'Pagado' : 'Pendiente'
  }

  if (field === 'payment_method') {
    const methods: Record<string, string> = { yape: 'Yape', card: 'Tarjeta', manual: 'Manual' }
    return methods[value as string] || String(value || '')
  }
  
  return String(value)
}

/**
 * Escapa un valor para CSV (maneja comas y comillas)
 */
function escapeCSV(value: string): string {
  if (value.includes(',') || value.includes('"') || value.includes('\n')) {
    return `"${value.replace(/"/g, '""')}"`
  }
  return value
}

/**
 * Genera contenido CSV a partir de los asistentes
 */
export function generateCSV(attendees: Attendee[]): string {
  // Header row
  const headers = EXPORT_FIELDS.map(field => FIELD_LABELS[field])
  
  // Data rows
  const rows = attendees.map(attendee =>
    EXPORT_FIELDS.map(field => escapeCSV(formatValue(attendee[field], field)))
  )
  
  // Combine with newlines
  return [headers.join(','), ...rows.map(row => row.join(','))].join('\n')
}

/**
 * Genera datos para Excel (array de objetos)
 */
export function generateExcelData(attendees: Attendee[]): Record<string, string>[] {
  return attendees.map(attendee => {
    const row: Record<string, string> = {}
    EXPORT_FIELDS.forEach(field => {
      row[FIELD_LABELS[field]] = formatValue(attendee[field], field)
    })
    return row
  })
}

/**
 * Descarga un archivo en el navegador
 */
export function downloadFile(content: string | Blob, filename: string, mimeType: string) {
  const blob = content instanceof Blob ? content : new Blob([content], { type: mimeType })
  const url = URL.createObjectURL(blob)
  
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  
  URL.revokeObjectURL(url)
}

/**
 * Exporta asistentes a CSV y descarga el archivo
 */
export function exportToCSV(attendees: Attendee[], filename = 'participantes') {
  const csv = generateCSV(attendees)
  const timestamp = new Date().toISOString().split('T')[0]
  downloadFile(csv, `${filename}_${timestamp}.csv`, 'text/csv;charset=utf-8;')
}

/**
 * Exporta asistentes a Excel (XLSX) y descarga el archivo
 * Requiere la librería 'xlsx' instalada
 */
export async function exportToExcel(attendees: Attendee[], filename = 'participantes') {
  try {
    // Importación dinámica de xlsx
    const XLSX = await import('xlsx')
    
    const data = generateExcelData(attendees)
    
    // Crear workbook y worksheet
    const worksheet = XLSX.utils.json_to_sheet(data)
    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Participantes')
    
    // Ajustar ancho de columnas
    const colWidths = EXPORT_FIELDS.map(field => ({
      wch: Math.max(
        FIELD_LABELS[field].length,
        ...attendees.map(a => formatValue(a[field], field).length)
      ) + 2
    }))
    worksheet['!cols'] = colWidths
    
    // Generar archivo
    const timestamp = new Date().toISOString().split('T')[0]
    XLSX.writeFile(workbook, `${filename}_${timestamp}.xlsx`)
    
    return { success: true }
  } catch (error) {
    console.error('[Export] Error exporting to Excel:', error)
    return { 
      success: false, 
      error: 'Error al exportar. Asegúrate de tener la librería xlsx instalada.' 
    }
  }
}

/**
 * Estadísticas de los asistentes
 */
export function getAttendeesStats(attendees: Attendee[]) {
  const total = attendees.length
  const paid = attendees.filter(a => a.status === 'paid').length
  const pending = total - paid
  const professionals = attendees.filter(a => a.role === 'professional').length
  const students = total - professionals
  
  return {
    total,
    paid,
    pending,
    professionals,
    students,
    revenue: paid * 150.00,
    expectedRevenue: total * 150.00,
  }
}
