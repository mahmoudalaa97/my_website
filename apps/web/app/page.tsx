import { HeroHeader } from '@/components/header'
import HeroSection from '@/components/hero-section'
import AboutSection from '@/components/about-section'
import ServicesSection from '@/components/services-section'
import PortfolioSection from '@/components/portfolio-section'
import PricingSection from '@/components/pricing-section'
import ContactSection from '@/components/contact-section'
import Footer from '@/components/footer'
import { api } from '@/lib/api'

export const revalidate = 60 // Revalidate every 60 seconds

export default async function Home() {
  // Fetch all data in parallel
  const [settings, services, packages, projects] = await Promise.all([
    api.getSettings(),
    api.getServices(),
    api.getPackages(),
    api.getProjects(),
  ])

  return (
    <>
      <HeroHeader settings={settings} />
      <main>
        <HeroSection settings={settings} />
        <AboutSection settings={settings} />
        <ServicesSection services={services} />
        <PortfolioSection projects={projects} />
        <PricingSection packages={packages} />
        <ContactSection settings={settings} />
      </main>
      <Footer settings={settings} />
    </>
  )
}
