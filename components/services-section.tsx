'use client'

import { 
    Globe, 
    Smartphone, 
    Workflow, 
    Database, 
    MessageSquare, 
    Wrench,
    ArrowRight
} from 'lucide-react'
import { motion } from 'motion/react'
import Link from 'next/link'

const services = [
    {
        icon: Globe,
        title: 'Web Application Development',
        description: 'Custom web applications built with modern technologies. From simple websites to complex enterprise solutions.',
        features: ['React / Next.js', 'Responsive Design', 'SEO Optimized'],
    },
    {
        icon: Smartphone,
        title: 'Mobile App Development',
        description: 'Native and cross-platform mobile applications that deliver exceptional user experiences.',
        features: ['iOS & Android', 'React Native / Flutter', 'App Store Ready'],
    },
    {
        icon: Workflow,
        title: 'Business Process Digitization',
        description: 'Transform manual workflows into automated digital systems. Increase efficiency and reduce errors.',
        features: ['Workflow Automation', 'Custom Dashboards', 'Real-time Analytics'],
    },
    {
        icon: Database,
        title: 'System Integration',
        description: 'Connect disparate systems and create unified data flows. API development and third-party integrations.',
        features: ['API Development', 'Data Migration', 'Cloud Integration'],
    },
    {
        icon: MessageSquare,
        title: 'Technical Consulting',
        description: 'Expert guidance on technology decisions, architecture planning, and digital strategy.',
        features: ['Tech Stack Selection', 'Architecture Review', 'Best Practices'],
    },
    {
        icon: Wrench,
        title: 'Custom Software Solutions',
        description: 'Tailored software built specifically for your unique business requirements and challenges.',
        features: ['Bespoke Development', 'Scalable Solutions', 'Ongoing Support'],
    },
]

export default function ServicesSection() {
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
                        Solutions That Drive
                        <span className="text-gradient"> Your Success</span>
                    </h2>
                    <p className="mt-6 text-lg text-muted-foreground">
                        From concept to deployment, I offer comprehensive services to help you 
                        leverage technology for business growth and operational excellence.
                    </p>
                </motion.div>

                {/* Services Grid */}
                <div className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {services.map((service, index) => (
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
                                <service.icon className="size-6 text-primary" />
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
                    ))}
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

