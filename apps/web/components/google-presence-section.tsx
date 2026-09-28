'use client'

import { MapPin, Search, Star, Camera, Phone, CheckCircle2, ArrowRight } from 'lucide-react'
import { motion } from 'motion/react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

const features = [
    {
        icon: MapPin,
        title: 'Google Business Profile setup',
        description: 'Full profile creation and ownership verification so your business appears on Google Search and Maps.',
    },
    {
        icon: Search,
        title: 'Show up in "near me" searches',
        description: 'Local SEO optimization so customers nearby find you before your competitors.',
    },
    {
        icon: Camera,
        title: 'Photos, hours & categories',
        description: 'Professional listing with the right categories, business hours, service areas, and photos that convert.',
    },
    {
        icon: Star,
        title: 'Reviews that build trust',
        description: 'A simple system to collect real customer reviews and reply to them — the #1 ranking factor for local search.',
    },
    {
        icon: Phone,
        title: 'Direct calls & directions',
        description: 'Customers tap once to call, get directions, or message you — turning searches into real business.',
    },
    {
        icon: CheckCircle2,
        title: 'Connected to your website',
        description: 'Your Google listing, website, and social profiles all point to each other for stronger ranking and trust.',
    },
]

export default function GooglePresenceSection() {
    return (
        <section id="google-maps" className="relative py-24 md:py-32 bg-gradient-to-b from-background to-primary/10">
            {/* Background */}
            <div className="absolute inset-0 -z-10">
                <div className="absolute top-1/3 left-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
                <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-emerald-500/5 rounded-full blur-3xl" />
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
                    <span className="text-primary font-medium">Get Found on Google</span>
                    <h2 className="mt-4 text-3xl font-bold tracking-tight md:text-4xl lg:text-5xl">
                        Put Your Business On
                        <span className="text-gradient"> Google Maps</span>
                    </h2>
                    <p className="mt-6 text-lg text-muted-foreground">
                        A great website is only half the story. I get your business listed and verified on
                        Google Maps so nearby customers can find you, call you, and choose you.
                    </p>
                </motion.div>

                <div className="mt-16 grid gap-10 lg:grid-cols-2 lg:gap-16 items-center">
                    {/* Left: Map mockup */}
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.7 }}
                        className="relative"
                    >
                        <div className="relative aspect-square max-w-md mx-auto lg:max-w-none rounded-3xl overflow-hidden border border-border bg-card">
                            {/* Faux map grid */}
                            <div
                                aria-hidden
                                className="absolute inset-0 bg-[linear-gradient(rgba(120,180,255,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(120,180,255,0.08)_1px,transparent_1px)] bg-[size:32px_32px]"
                            />
                            {/* Faux roads */}
                            <div aria-hidden className="absolute inset-0">
                                <div className="absolute top-1/3 left-0 right-0 h-1 bg-white/[0.06]" />
                                <div className="absolute top-2/3 left-0 right-0 h-0.5 bg-white/[0.05]" />
                                <div className="absolute left-1/4 top-0 bottom-0 w-1 bg-white/[0.06]" />
                                <div className="absolute left-3/4 top-0 bottom-0 w-0.5 bg-white/[0.05]" />
                            </div>
                            {/* Green area */}
                            <div aria-hidden className="absolute top-6 right-6 w-24 h-20 rounded-2xl bg-emerald-500/10" />
                            <div aria-hidden className="absolute bottom-10 left-8 w-20 h-16 rounded-xl bg-blue-500/10" />

                            {/* Pulsing pin */}
                            <motion.div
                                initial={{ scale: 0.8, opacity: 0 }}
                                whileInView={{ scale: 1, opacity: 1 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6, delay: 0.3 }}
                                className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-full"
                            >
                                <div className="relative">
                                    <div className="absolute inset-0 -m-4 rounded-full bg-primary/30 blur-xl animate-pulse" />
                                    <div className="relative w-14 h-14 rounded-full bg-primary flex items-center justify-center shadow-2xl glow">
                                        <MapPin className="size-7 text-primary-foreground" fill="currentColor" />
                                    </div>
                                </div>
                            </motion.div>

                            {/* Business card popup */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6, delay: 0.6 }}
                                className="absolute bottom-6 left-6 right-6 rounded-2xl border border-border bg-background/95 backdrop-blur p-4 shadow-xl"
                            >
                                <div className="flex items-start gap-3">
                                    <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                                        <MapPin className="size-6 text-primary" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2">
                                            <p className="font-semibold truncate">Your Business</p>
                                            <span className="flex-shrink-0 inline-flex items-center gap-1 text-xs text-emerald-400">
                                                <CheckCircle2 className="size-3" fill="currentColor" />
                                                Verified
                                            </span>
                                        </div>
                                        <div className="mt-1 flex items-center gap-1 text-sm text-muted-foreground">
                                            <div className="flex text-amber-400">
                                                {[...Array(5)].map((_, i) => (
                                                    <Star key={i} className="size-3" fill="currentColor" />
                                                ))}
                                            </div>
                                            <span className="ml-1">4.9 · Open now</span>
                                        </div>
                                        <p className="mt-1 text-xs text-muted-foreground">Ranks in "near me" search</p>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    </motion.div>

                    {/* Right: Features */}
                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.7 }}
                    >
                        <div className="grid gap-5 sm:grid-cols-2">
                            {features.map((item, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.5, delay: index * 0.08 }}
                                    className="flex gap-3"
                                >
                                    <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                                        <item.icon className="size-5 text-primary" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-sm">{item.title}</h3>
                                        <p className="mt-1 text-sm text-muted-foreground leading-relaxed">
                                            {item.description}
                                        </p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>

                        <div className="mt-10 flex flex-col sm:flex-row gap-4">
                            <Button asChild size="lg" className="rounded-full px-8 glow group">
                                <Link href="#contact">
                                    <span>Get My Business On Google</span>
                                    <ArrowRight className="ml-2 size-4 transition-transform group-hover:translate-x-1" />
                                </Link>
                            </Button>
                            <Button
                                asChild
                                size="lg"
                                variant="outline"
                                className="rounded-full px-8 border-primary/30 hover:bg-primary/10"
                            >
                                <Link href="#services">See all services</Link>
                            </Button>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    )
}
