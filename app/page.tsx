'use client'

import { useState } from 'react'
import HeroSection from '@/components/sections/hero-section'
import InfoSections from '@/components/sections/info-sections'
import RegistrationForm from '@/components/forms/registration-form'
import Footer from '@/components/sections/footer'
import CheckoutModal from '@/components/modals/checkout-modal'
import type { RegistrationForm as RegistrationFormType } from '@/lib/validations'

export default function Page() {
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
    <main className="min-h-screen bg-background">
      <HeroSection />
      <InfoSections />
      <RegistrationForm onSuccess={handleRegistrationSuccess} />
      <Footer />
      
      {showCheckout && formData && (
        <CheckoutModal
          formData={formData}
          onClose={handleCheckoutClose}
        />
      )}

      {/* WhatsApp Floating Button */}
      <a
        href="https://wa.me/51984522438?text=Hola%2C%20tengo%20una%20consulta%20sobre%20el%20II%20Simposio%20Veterinario%202026"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-40 bg-[#25D366] hover:bg-[#20BD5A] text-white p-4 rounded-full shadow-2xl hover:scale-110 transition-all duration-200 flex items-center justify-center group"
        aria-label="Contactar por WhatsApp"
      >
        <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
        </svg>
        <span className="absolute right-full mr-3 bg-white text-gray-800 px-3 py-2 rounded-lg text-sm font-medium whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity shadow-lg pointer-events-none">
          ¿Necesitas ayuda?
        </span>
      </a>

      {/* Mobile Floating CTA - only shows on mobile when scrolled past hero */}
      <div className="fixed bottom-6 left-6 z-40 sm:hidden">
        <button
          onClick={() => {
            document.getElementById('registration-form')?.scrollIntoView({ behavior: 'smooth' })
          }}
          className="bg-secondary hover:bg-secondary/90 text-white px-5 py-3 rounded-full shadow-2xl font-semibold text-sm flex items-center gap-2 transition-all"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 5.25a3 3 0 013 3m3 0a6 6 0 01-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1121.75 8.25z" />
          </svg>
          Inscríbete
        </button>
      </div>
    </main>
  )
}
