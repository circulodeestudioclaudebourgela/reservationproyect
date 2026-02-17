import { MercadoPagoConfig, Payment } from 'mercadopago'

// Configurar cliente de MercadoPago (server-side only)
const accessToken = process.env.MERCADOPAGO_ACCESS_TOKEN

if (!accessToken) {
  console.warn('[MercadoPago] MERCADOPAGO_ACCESS_TOKEN no configurado')
}

const client = new MercadoPagoConfig({ 
  accessToken: accessToken || '',
  options: { timeout: 10000 }
})

export const paymentClient = new Payment(client)

// ============================================
// Tipos
// ============================================

export interface CreateYapePaymentParams {
  token: string
  transactionAmount: number
  description: string
  payerEmail: string
  idempotencyKey: string
}

export interface CreateCardPaymentParams {
  token: string
  transactionAmount: number
  description: string
  payerEmail: string
  installments: number
  paymentMethodId: string
  issuerId: string
  idempotencyKey: string
}

export interface MPPaymentResult {
  success: boolean
  paymentId?: string
  status?: string
  statusDetail?: string
  error?: string
}

// ============================================
// Crear pago con Yape
// ============================================

export async function createYapePayment(params: CreateYapePaymentParams): Promise<MPPaymentResult> {
  try {
    const response = await paymentClient.create({
      body: {
        token: params.token,
        transaction_amount: params.transactionAmount,
        description: params.description,
        installments: 1,
        payment_method_id: 'yape',
        payer: {
          email: params.payerEmail,
        },
      },
      requestOptions: {
        idempotencyKey: params.idempotencyKey,
      },
    })

    console.log('[MercadoPago] Yape payment response:', {
      id: response.id,
      status: response.status,
      status_detail: response.status_detail,
    })

    return {
      success: response.status === 'approved',
      paymentId: response.id?.toString(),
      status: response.status ?? undefined,
      statusDetail: response.status_detail ?? undefined,
    }
  } catch (error) {
    console.error('[MercadoPago] Yape payment error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Error al procesar pago con Yape',
    }
  }
}

// ============================================
// Crear pago con Tarjeta
// ============================================

export async function createCardPayment(params: CreateCardPaymentParams): Promise<MPPaymentResult> {
  try {
    const response = await paymentClient.create({
      body: {
        token: params.token,
        transaction_amount: params.transactionAmount,
        description: params.description,
        installments: params.installments,
        payment_method_id: params.paymentMethodId,
        issuer_id: parseInt(params.issuerId),
        payer: {
          email: params.payerEmail,
        },
      },
      requestOptions: {
        idempotencyKey: params.idempotencyKey,
      },
    })

    console.log('[MercadoPago] Card payment response:', {
      id: response.id,
      status: response.status,
      status_detail: response.status_detail,
    })

    return {
      success: response.status === 'approved',
      paymentId: response.id?.toString(),
      status: response.status ?? undefined,
      statusDetail: response.status_detail ?? undefined,
    }
  } catch (error) {
    console.error('[MercadoPago] Card payment error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Error al procesar pago con tarjeta',
    }
  }
}

// ============================================
// Consultar estado de pago
// ============================================

export async function getPaymentStatus(paymentId: string): Promise<MPPaymentResult> {
  try {
    const response = await paymentClient.get({ id: paymentId })

    return {
      success: response.status === 'approved',
      paymentId: response.id?.toString(),
      status: response.status ?? undefined,
      statusDetail: response.status_detail ?? undefined,
    }
  } catch (error) {
    console.error('[MercadoPago] Get payment status error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Error al consultar estado del pago',
    }
  }
}
