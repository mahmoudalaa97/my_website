'use client'

import {
    Globe,
    Smartphone,
    Workflow,
    Database,
    MessageSquare,
    Wrench,
    ArrowRight,
    Code,
    Zap,
    ShoppingCart,
    MapPin,
    LifeBuoy,
    LucideIcon
} from 'lucide-react'
import { motion } from 'motion/react'
import Link from 'next/link'
import type { Service } from '@/lib/api'

const iconMap: Record<string, LucideIcon> = {
    Globe,
    Smartphone,
    Workflow,
    Database,
    MessageSquare,
    Wrench,
    Code,
    Zap,
    ShoppingCart,
    MapPin,
    LifeBuoy,
}

const defaultServices = [
    {
        icon: 'Globe',
        title: 'Business Websites',
        description: 'Fast, modern websites built to attract customers and convert. Mobile‑friendly, SEO‑ready, and easy to update.',
        features: ['Custom design', 'Mobile‑first', 'SEO optimized'],
    },
    {
        icon: 'Smartphone',
        title: 'Mobile Apps',
        description: 'iOS and Android apps that let your customers order, book, and connect with your business from their phone.',
        features: ['iOS & Android', 'App Store & Play Store', 'Push notifications'],
    },
    {
        icon: 'MapPin',
        title: 'Google Maps & Local Presence',
        description: 'Get listed on Google Maps, verified, and optimized so nearby customers actually find you in search.',
        features: ['Google Business Profile', 'Local SEO', 'Reviews & photos'],
    },
    {
        icon: 'ShoppingCart',
        title: 'E‑commerce & Online Ordering',
        description: 'Sell products or accept orders online. Payments, inventory, delivery — all in one place.',
        features: ['Online store', 'Payments integrated', 'Order management'],
    },
    {
        icon: 'Workflow',
        title: 'Automation That Saves Time',
        description: 'Automate bookings, invoices, follow‑ups and daily tasks so you can focus on your customers, not paperwork.',
        features: ['Bookings & invoices', 'Email/WhatsApp automation', 'Simple dashboards'],
    },
    {
        icon: 'LifeBuoy',
        title: 'Ongoing Support & Growth',
        description: 'I stick around after launch — updates, fixes, new features, and help growing your online presence as you scale.',
        features: ['Monthly updates', 'Priority support', 'Growth advice'],
    },
]

interface ServicesSectionProps {
    services?: Service[] | null
}

export default function ServicesSection({ services }: ServicesSectionProps) {
    const displayServices = services?.length ? services : defaultServices

    return (
        <section id="services" className="relative py-24 md:py-32">
            {/* Background */}
            <div className="absolute inset-0 -z-10">
                <div className="absolute top-1/4 right-0 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl" />
                <div className="absolute bottom-0 left-1/4 w-80 h-80 bg-primary/5 rounded-full blur-3xl" />
            </div>

            <div className="mx-auto max-w-7xl px-6">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-center max-w-3xl mx-auto"
                >
                    <span className="text-primary font-medium">Services</span>
                    <h2 className="mt-4 text-3xl font-bold tracking-tight md:text-4xl lg:text-5xl">
                        Everything You Need To
                        <span className="text-gradient"> Grow Online</span>
                    </h2>
                    <p className="mt-6 text-lg text-muted-foreground">
                        Websites, mobile apps, Google Maps presence, and automation — built together
                        so your business gets found, gets customers, and keeps growing.
                    </p>
                </motion.div>

                {/* Services Grid */}
                <div className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {displayServices.map((service, index) => {
                        const Icon = iconMap[service.icon] || Code
                        return (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                className="group relative rounded-2xl border border-border bg-card/50 p-6 transition-all duration-300 hover:border-primary/50 hover:bg-card"
                            >
                                {/* Icon */}
                                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-5 group-hover:bg-primary/20 transition-colors">
                                    <Icon className="size-6 text-primary" />
                                </div>

                                {/* Content */}
                                <h3 className="text-xl font-semibold mb-3">{service.title}</h3>
                                <p className="text-muted-foreground mb-5">{service.description}</p>

                                {/* Features */}
                                <ul className="space-y-2 mb-6">
                                    {service.features.map((feature, i) => (
                                        <li key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                                            <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                                            {feature}
                                        </li>
                                    ))}
                                </ul>

                                {/* Hover effect line */}
                                <div className="absolute bottom-0 left-0 h-0.5 w-0 bg-gradient-to-r from-primary to-purple-500 transition-all duration-300 group-hover:w-full rounded-b-2xl" />
                            </motion.div>
                        )
                    })}
                </div>

                {/* CTA */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                    className="mt-16 text-center"
                >
                    <p className="text-muted-foreground mb-6">
                        Have a specific requirement? Let&apos;s discuss your project.
                    </p>
                    <Link 
                        href="#contact"
                        className="inline-flex items-center gap-2 text-primary hover:gap-3 transition-all font-medium"
                    >
                        <span>Get a Custom Quote</span>
                        <ArrowRight className="size-4" />
                    </Link>
                </motion.div>
            </div>
        </section>
    )
}
