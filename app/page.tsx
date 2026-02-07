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
    </main>
  )
}
