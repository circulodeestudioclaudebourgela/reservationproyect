import HeroSection from '@/components/sections/hero-section'
import InfoSections from '@/components/sections/info-sections'
import RegistrationArea from '@/components/sections/registration-area'
import RegistrationClosed from '@/components/sections/registration-closed'
import WhatsAppButton from '@/components/sections/whatsapp-button'
import Footer from '@/components/sections/footer'
import { isRegistrationOpen } from '@/lib/event'

// Se vuelve a generar cada hora para que el cambio a "inscripciones cerradas"
// (o una reapertura) se aplique solo al pasar REGISTRATION_CLOSES_AT.
export const revalidate = 3600

export default function Page() {
  const registrationOpen = isRegistrationOpen()

  return (
    <main className="public-site min-h-screen bg-background">
      <HeroSection registrationOpen={registrationOpen} />
      <InfoSections registrationOpen={registrationOpen} />
      {registrationOpen ? <RegistrationArea /> : <RegistrationClosed />}
      <Footer />
      <WhatsAppButton />
    </main>
  )
}
