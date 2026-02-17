/**
 * Script para consultar pagos TEST directamente desde la API de MercadoPago
 * 
 * Uso:
 *   node scripts/check-mp-payments.js
 * 
 * Este script consulta los últimos 50 pagos registrados en tu cuenta TEST
 */

const ACCESS_TOKEN = 'TEST-1282558106379202-021621-89c2178555c943554ec144525ad2547f-1848213391'

async function getPayments() {
  try {
    console.log('🔍 Consultando pagos en MercadoPago (modo TEST)...\n')

    // Consultar últimos pagos
    const response = await fetch(
      'https://api.mercadopago.com/v1/payments/search?sort=date_created&criteria=desc&range=date_created&begin_date=NOW-30DAYS&end_date=NOW',
      {
        headers: {
          'Authorization': `Bearer ${ACCESS_TOKEN}`,
          'Content-Type': 'application/json'
        }
      }
    )

    if (!response.ok) {
      throw new Error(`Error HTTP: ${response.status} - ${response.statusText}`)
    }

    const data = await response.json()

    if (!data.results || data.results.length === 0) {
      console.log('❌ No se encontraron pagos en los últimos 30 días.\n')
      console.log('💡 Esto es normal si recién hiciste el primer pago de prueba.')
      return
    }

    console.log(`✅ Encontrados ${data.results.length} pagos\n`)
    console.log('═══════════════════════════════════════════════════════════════\n')

    data.results.forEach((payment, index) => {
      console.log(`📋 Pago #${index + 1}`)
      console.log(`   ID: ${payment.id}`)
      console.log(`   Estado: ${getStatusEmoji(payment.status)} ${payment.status.toUpperCase()}`)
      console.log(`   Método: ${payment.payment_method_id || 'N/A'}`)
      console.log(`   Monto: ${payment.currency_id} ${payment.transaction_amount}`)
      console.log(`   Email: ${payment.payer?.email || 'N/A'}`)
      console.log(`   Descripción: ${payment.description || 'N/A'}`)
      console.log(`   Fecha: ${new Date(payment.date_created).toLocaleString('es-PE')}`)
      console.log(`   Cuotas: ${payment.installments}`)
      
      if (payment.status_detail) {
        console.log(`   Detalle: ${payment.status_detail}`)
      }
      
      if (payment.card) {
        console.log(`   Tarjeta: ${payment.card.first_six_digits}...${payment.card.last_four_digits}`)
      }
      
      console.log(`   Ver en MP: https://www.mercadopago.com.pe/developers/panel/test/payments/${payment.id}`)
      console.log('───────────────────────────────────────────────────────────────\n')
    })

    // Estadísticas
    const approved = data.results.filter(p => p.status === 'approved').length
    const pending = data.results.filter(p => p.status === 'pending').length
    const rejected = data.results.filter(p => p.status === 'rejected').length
    const total = data.results.reduce((sum, p) => sum + (p.status === 'approved' ? p.transaction_amount : 0), 0)

    console.log('═══════════════════════════════════════════════════════════════')
    console.log('📊 RESUMEN')
    console.log(`   Total pagos: ${data.results.length}`)
    console.log(`   ✅ Aprobados: ${approved}`)
    console.log(`   ⏳ Pendientes: ${pending}`)
    console.log(`   ❌ Rechazados: ${rejected}`)
    console.log(`   💰 Total aprobado: S/ ${total.toFixed(2)}`)
    console.log('═══════════════════════════════════════════════════════════════\n')

    console.log('💡 ACCESO WEB:')
    console.log('   Panel TEST: https://www.mercadopago.com.pe/developers/panel/test/payments')
    console.log('   Tus aplicaciones: https://www.mercadopago.com.pe/developers/panel/app\n')

  } catch (error) {
    console.error('❌ Error al consultar pagos:', error.message)
    console.log('\n💡 Verifica que:')
    console.log('   1. El ACCESS_TOKEN sea correcto')
    console.log('   2. Tengas conexión a internet')
    console.log('   3. La cuenta de MP esté activa\n')
  }
}

function getStatusEmoji(status) {
  const emojis = {
    'approved': '✅',
    'pending': '⏳',
    'rejected': '❌',
    'cancelled': '🚫',
    'refunded': '↩️',
    'charged_back': '⚠️'
  }
  return emojis[status] || '❓'
}

// Ejecutar
getPayments()
