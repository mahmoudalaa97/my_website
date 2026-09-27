import { HeroHeader } from '@/components/header'
import HeroSection from '@/components/hero-section'
import AboutSection from '@/components/about-section'
import ServicesSection from '@/components/services-section'
import GooglePresenceSection from '@/components/google-presence-section'
import PortfolioSection from '@/components/portfolio-section'
import PricingSection from '@/components/pricing-section'
import ContactSection from '@/components/contact-section'
import Footer from '@/components/footer'
import { MaintenanceScreen } from '@/components/maintenance-screen'
import { api } from '@/lib/api'

export const dynamic = 'force-dynamic'

export default async function Home() {
  const health = await api.getHealth()
  if (!health.ok) {
    return <MaintenanceScreen />
  }

  const [settings, services, packages, projects] = await Promise.all([
    api.getSettings(),
    api.getServices(),
    api.getPackages(),
    api.getProjects(),
  ])

  if (!settings || settings.maintenanceMode || !services || !packages || !projects) {
    return <MaintenanceScreen />
  }

  return (
    <>
      <HeroHeader settings={settings} />
      <main>
        <HeroSection settings={settings} />
        <AboutSection settings={settings} />
        <ServicesSection services={services} />
        <GooglePresenceSection  />
        <PortfolioSection projects={projects} />
        <PricingSection packages={packages} />
        <ContactSection settings={settings} />
      </main>
      <Footer settings={settings} />
    </>
  )
}
