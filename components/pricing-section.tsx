'use client'

import { Check, ArrowRight, Sparkles } from 'lucide-react'
import { motion } from 'motion/react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

const plans = [
    {
        name: 'Starter',
        description: 'Perfect for small projects and landing pages',
        price: '$500',
        priceNote: 'Starting from',
        features: [
            'Single page website or landing page',
            'Responsive design',
            'Basic SEO optimization',
            'Contact form integration',
            '1 round of revisions',
            '2 weeks delivery',
        ],
        cta: 'Get Started',
        popular: false,
    },
    {
        name: 'Professional',
        description: 'For full applications and complex systems',
        price: '$2,500',
        priceNote: 'Starting from',
        features: [
            'Multi-page web application',
            'Custom functionality & features',
            'Database integration',
            'User authentication',
            'Admin dashboard',
            'API development',
            '3 rounds of revisions',
            '4-8 weeks delivery',
            '30 days support',
        ],
        cta: 'Get Started',
        popular: true,
    },
    {
        name: 'Enterprise',
        description: 'Large-scale transformations & ongoing support',
        price: 'Custom',
        priceNote: 'Tailored to your needs',
        features: [
            'Everything in Professional',
            'Complex system architecture',
            'Third-party integrations',
            'Performance optimization',
            'Security hardening',
            'Team training & documentation',
            'Unlimited revisions',
            'Priority support',
            'Ongoing maintenance available',
        ],
        cta: 'Contact Me',
        popular: false,
    },
]

export default function PricingSection() {
    return (
        <section id="pricing" className="relative py-24 md:py-32">
            {/* Background */}
            <div className="absolute inset-0 -z-10">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl" />
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
                    <span className="text-primary font-medium">Pricing</span>
                    <h2 className="mt-4 text-3xl font-bold tracking-tight md:text-4xl lg:text-5xl">
                        Transparent Pricing,
                        <span className="text-gradient"> No Surprises</span>
                    </h2>
                    <p className="mt-6 text-lg text-muted-foreground">
                        Choose a package that fits your needs or get a custom quote 
                        for your unique requirements. All prices are starting points — 
                        let&apos;s discuss your specific project.
                    </p>
                </motion.div>

                {/* Pricing Grid */}
                <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                    {plans.map((plan, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            className={`relative rounded-2xl border p-8 ${
                                plan.popular 
                                    ? 'border-primary bg-card glow' 
                                    : 'border-border bg-card/50'
                            }`}
                        >
                            {/* Popular badge */}
                            {plan.popular && (
                                <div className="absolute -top-4 left-1/2 -translate-x-1/2 flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-primary text-primary-foreground text-sm font-medium">
                                    <Sparkles className="size-4" />
                                    Most Popular
                                </div>
                            )}

                            {/* Plan header */}
                            <div className="text-center mb-8">
                                <h3 className="text-xl font-semibold">{plan.name}</h3>
                                <p className="mt-2 text-sm text-muted-foreground">{plan.description}</p>
                                <div className="mt-6">
                                    <span className="text-4xl font-bold">{plan.price}</span>
                                    {plan.price !== 'Custom' && <span className="text-muted-foreground ml-1">USD</span>}
                                </div>
                                <p className="text-sm text-muted-foreground">{plan.priceNote}</p>
                            </div>

                            {/* Features */}
                            <ul className="space-y-4 mb-8">
                                {plan.features.map((feature, i) => (
                                    <li key={i} className="flex items-start gap-3">
                                        <div className="flex-shrink-0 w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center mt-0.5">
                                            <Check className="size-3 text-primary" />
                                        </div>
                                        <span className="text-sm text-muted-foreground">{feature}</span>
                                    </li>
                                ))}
                            </ul>

                            {/* CTA */}
                            <Button 
                                asChild 
                                className={`w-full rounded-full ${
                                    plan.popular ? '' : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                                }`}
                                size="lg"
                            >
                                <Link href="#contact">
                                    {plan.cta}
                                    <ArrowRight className="ml-2 size-4" />
                                </Link>
                            </Button>
                        </motion.div>
                    ))}
                </div>

                {/* Custom Quote CTA */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                    className="mt-16 text-center"
                >
                    <div className="inline-flex flex-col sm:flex-row items-center gap-4 p-6 rounded-2xl border border-border bg-card/50">
                        <p className="text-muted-foreground">
                            Have a unique project in mind?
                        </p>
                        <Link 
                            href="#contact"
                            className="inline-flex items-center gap-2 text-primary hover:gap-3 transition-all font-medium"
                        >
                            <span>Request a Custom Quote</span>
                            <ArrowRight className="size-4" />
                        </Link>
                    </div>
                </motion.div>
            </div>
        </section>
    )
}

