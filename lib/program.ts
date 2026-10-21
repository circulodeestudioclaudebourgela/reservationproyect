// Programa académico de la edición 2026 (tal como se publicó).
// Cada título lleva el ponente al final, separado por " — ".

export type ProgramItemType = 'ponencia' | 'taller' | 'panel' | 'ceremonia' | 'break'

export interface ProgramItem {
  time?: string
  title: string
  type: ProgramItemType
}

export interface ProgramDay {
  id: string
  label: string
  weekday: string
  day: string
  month: string
  items: ProgramItem[]
}

const agendaDay1: ProgramItem[] = [
  { time: '08:30 - 09:00', title: 'Apertura del evento', type: 'ceremonia' },
  { time: '09:00 - 09:45', title: 'FLUTD complejo y casos refractarios — Dra. Camila Sánchez-Carrión', type: 'ponencia' },
  { time: '09:45 - 10:30', title: 'Actualización en el manejo anestésico: Transición integral del modelo convencional al sistema balanceado y monitoreado — MV. Alexander Sánchez', type: 'ponencia' },
  { time: '10:30 - 10:50', title: 'Receso', type: 'break' },
  { time: '10:50 - 11:35', title: 'Monitorización gasométrica en el paciente crítico — Dr. Sebastian Vélez', type: 'ponencia' },
  { time: '11:35 - 12:20', title: 'Ultrasonografía aplicada a la Ginecología y Obstetricia Veterinaria — Dr. Liev Tamariz', type: 'ponencia' },
  { time: '12:20 - 14:30', title: 'Almuerzo', type: 'break' },
  { time: '14:30 - 15:15', title: 'Biomarcadores y mecanismos fisiopatológicos del daño renal agudo en felinos domésticos — Dra. Camila Sánchez-Carrión', type: 'ponencia' },
  { time: '15:15 - 16:00', title: 'Hipotermia perioperatoria: mecanismos, prevención y consecuencias — MV. Alexander Sánchez', type: 'ponencia' },
  { time: '16:00 - 16:20', title: 'Receso', type: 'break' },
  { time: '16:20 - 17:05', title: 'Tips and Tricks de Cirugía Abdominal — Dr. Maykel Povea', type: 'ponencia' },
  { time: '17:05 - 17:50', title: 'Charla comercial', type: 'panel' },
  { time: '17:50 - 18:10', title: 'Receso', type: 'break' },
  { time: '18:10 - 18:55', title: 'Manejo Quirúrgico de las Anomalías de Anillo Vascular en pequeños animales: Enfoques y Estrategias Avanzadas — Dr. Maykel Povea', type: 'ponencia' },
]

const agendaDay2: ProgramItem[] = [
  { time: '09:00 - 09:45', title: 'Valoración de la vía aérea previo a la inducción — MV. Alexander Sánchez', type: 'ponencia' },
  { time: '09:45 - 10:30', title: 'Introducción a la interpretación de electrolitos y desórdenes ácido-base — Dr. Sebastian Vélez', type: 'ponencia' },
  { time: '10:30 - 10:50', title: 'Receso', type: 'break' },
  { time: '10:50 - 11:35', title: 'Criterios terapéuticos para la selección de derivados sanguíneos — Dr. Sebastian Vélez', type: 'ponencia' },
  { time: '11:35 - 12:20', title: 'Endoscopia Digestiva: Del Diagnóstico a la Terapéutica — Dr. Luis Lam', type: 'ponencia' },
  { time: '12:20 - 14:30', title: 'Almuerzo', type: 'break' },
  { time: '14:30 - 15:15', title: 'Estrategias multimodales frente al paradigma de los opioides: Análisis crítico de la anestesia libre de opioides (OFA) en veterinaria — MV. Alexander Sánchez', type: 'ponencia' },
  { time: '15:15 - 16:00', title: 'Avances recientes en Colecistectomía Laparoscópica (Estado del Arte) — Dr. Maykel Povea', type: 'ponencia' },
  { time: '16:00 - 16:20', title: 'Receso', type: 'break' },
  { time: '16:20 - 17:05', title: 'Temas avanzados en Cirugía Oncológica: Resolución Quirúrgica de Casos Clínicos Complejos — Dr. Maykel Povea', type: 'ponencia' },
  { time: '17:05 - 17:50', title: 'Charla comercial', type: 'panel' },
  { time: '17:50 - 18:10', title: 'Receso', type: 'break' },
  { time: '18:10 - 18:55', title: 'Clausura', type: 'ceremonia' },
]

const workshopsPre: ProgramItem[] = [
  { title: 'Ecografía Gestacional — Dr. Liev Tamariz', type: 'taller' },
  { title: 'Endoscopia Veterinaria — Dr. Luis Lam', type: 'taller' },
]

const workshopsPost: ProgramItem[] = [
  { title: 'Tips and Tricks en Cirugía Veterinaria — Dr. Maykel Povea', type: 'taller' },
  { title: 'Anestesia Veterinaria — MV. Alexander Sánchez', type: 'taller' },
  { title: 'Ecografía Veterinaria A-FAST — Dr. Liev Tamariz', type: 'taller' },
]

export const conferenceDays: ProgramDay[] = [
  { id: 'dia-1', label: 'Día 1', weekday: 'Viernes', day: '05', month: 'Jun', items: agendaDay1 },
  { id: 'dia-2', label: 'Día 2', weekday: 'Sábado', day: '06', month: 'Jun', items: agendaDay2 },
]

export const workshopDays: ProgramDay[] = [
  { id: 'pre', label: 'Pre-congreso', weekday: 'Jueves', day: '04', month: 'Jun', items: workshopsPre },
  { id: 'post', label: 'Post-congreso', weekday: 'Domingo', day: '07', month: 'Jun', items: workshopsPost },
]

// "Título — Ponente" → { title, speaker }
export function splitTitle(raw: string) {
  const [title, speaker] = raw.split(' — ')
  return { title, speaker: speaker ?? null }
}

export interface Speaker {
  name: string
  talks: string[]
  workshops: string[]
}

// Ponentes en orden de aparición, con sus ponencias y talleres
export const speakers: Speaker[] = (() => {
  const map = new Map<string, Speaker>()
  const add = (items: ProgramItem[], key: 'talks' | 'workshops') => {
    for (const item of items) {
      const { title, speaker } = splitTitle(item.title)
      if (!speaker) continue
      if (!map.has(speaker)) map.set(speaker, { name: speaker, talks: [], workshops: [] })
      map.get(speaker)![key].push(title)
    }
  }
  conferenceDays.forEach((d) => add(d.items, 'talks'))
  workshopDays.forEach((d) => add(d.items, 'workshops'))
  return [...map.values()]
})()

export const programStats = {
  talks: conferenceDays.reduce((n, d) => n + d.items.filter((i) => i.type === 'ponencia').length, 0),
  workshops: workshopDays.reduce((n, d) => n + d.items.length, 0),
}
