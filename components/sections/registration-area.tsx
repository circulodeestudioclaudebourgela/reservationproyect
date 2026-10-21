'use client'

import { useState } from 'react'
import RegistrationForm from '@/components/forms/registration-form'
import CheckoutModal from '@/components/modals/checkout-modal'
import type { RegistrationForm as RegistrationFormType } from '@/lib/validations'

// Formulario de inscripción + checkout de MercadoPago. Solo se monta mientras
// las inscripciones están abiertas (ver lib/event.ts).
export default function RegistrationArea() {
  const [showCheckout, setShowCheckout] = useState(false)
  const [formData, setFormData] = useState<RegistrationFormType | null>(null)

  const handleRegistrationSuccess = (data: RegistrationFormType) => {
    setFormData(data)
    setShowCheckout(true)
  }

  const handleCheckoutClose = () => {
    setShowCheckout(false)
    setFormData(null)
  }

  return (
    <>
      <RegistrationForm onSuccess={handleRegistrationSuccess} />

      {showCheckout && formData && (
        <CheckoutModal
          formData={formData}
          onClose={handleCheckoutClose}
        />
      )}

      {/* Mobile Floating CTA */}
      <div className="fixed bottom-4 left-4 z-40 sm:hidden">
        <button
          onClick={() => {
            document.getElementById('registration-form')?.scrollIntoView({ behavior: 'smooth' })
          }}
          className="bg-secondary hover:bg-secondary/90 text-white px-5 py-3 rounded-full shadow-2xl font-semibold text-sm flex items-center gap-2 transition-all"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2} aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 5.25a3 3 0 013 3m3 0a6 6 0 01-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1121.75 8.25z" />
          </svg>
          Inscríbete
        </button>
      </div>
    </>
  )
}
