'use client'

import Link from 'next/link'
import { ArrowRight, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { TextEffect } from '@/components/ui/text-effect'
import { AnimatedGroup } from '@/components/ui/animated-group'
import type { SiteSettings } from '@/lib/api'

const transitionVariants = {
    item: {
        hidden: {
            opacity: 0,
            filter: 'blur(12px)',
            y: 12,
        },
        visible: {
            opacity: 1,
            filter: 'blur(0px)',
            y: 0,
            transition: {
                type: 'spring' as const,
                bounce: 0.3,
                duration: 1.5,
            },
        },
    },
}

const defaultStats = [
    { value: '5+', label: 'Years Building' },
    { value: '50+', label: 'Businesses Online' },
    { value: '30+', label: 'On Google Maps' },
    { value: '100%', label: 'Owner Approved' },
]

interface HeroSectionProps {
    settings?: SiteSettings | null
}

export default function HeroSection({ settings }: HeroSectionProps) {
    const heroTitle = settings?.heroTitle || 'Grow Your Business Online'
    const heroSubtitle = settings?.heroSubtitle || "I build websites and mobile apps for startups and small business owners — and get you on Google Maps so customers actually find you. Launch fast, spend less, grow more."
    const tagline = settings?.tagline || 'Software partner for startups & small business owners'
    const stats = settings?.stats?.length ? settings.stats : defaultStats


    return (
        <section id="home" className="relative min-h-screen overflow-hidden">
            {/* Background Effects */}
            <div
                aria-hidden
                className="absolute inset-0 -z-10">
                {/* Gradient orbs */}
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-pulse" />
                <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
                {/* Grid pattern */}
                <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:100px_100px]" />
            </div>

            <div className="relative pt-32 md:pt-40 pb-20">
                <div className="mx-auto max-w-7xl px-6">
                    <div className="text-center">


                        {/* Main Headline */}
                        <div className="mx-auto max-w-5xl">
                            <TextEffect
                                preset="fade-in-blur"
                                speedSegment={0.3}
                                as="h1"
                                className="text-balance text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
                                {heroTitle}
                            </TextEffect>
                        
                        </div>

                        {/* Subheadline */}
                        <TextEffect
                            per="line"
                            preset="fade-in-blur"
                            speedSegment={0.3}
                            delay={0.5}
                            as="p"
                            className="mx-auto mt-8 max-w-2xl text-balance text-lg text-muted-foreground md:text-xl">
                            {heroSubtitle}
                        </TextEffect>

                        {/* CTA Buttons */}
                        <AnimatedGroup
                            variants={{
                                container: {
                                    visible: {
                                        transition: {
                                            staggerChildren: 0.05,
                                            delayChildren: 0.75,
                                        },
                                    },
                                },
                                ...transitionVariants,
                            }}
                            className="mt-12 flex flex-col items-center justify-center gap-4 sm:flex-row">
                            <Button
                                asChild
                                size="lg"
                                className="rounded-full px-8 text-base glow group">
                                <Link href="#contact">
                                    <span>Start Growing</span>
                                    <ArrowRight className="ml-2 size-4 transition-transform group-hover:translate-x-1" />
                                </Link>
                            </Button>
                            <Button
                                asChild
                                size="lg"
                                variant="outline"
                                className="rounded-full px-8 text-base border-primary/30 hover:bg-primary/10">
                                <Link href="#portfolio">
                                    <span>See What I Build</span>
                                </Link>
                            </Button>
                        </AnimatedGroup>

                        {/* Stats */}
                        {/* <AnimatedGroup
                            variants={{
                                container: {
                                    visible: {
                                        transition: {
                                            staggerChildren: 0.1,
                                            delayChildren: 1,
                                        },
                                    },
                                },
                                ...transitionVariants,
                            }}
                            className="mt-20 grid grid-cols-2 gap-8 md:grid-cols-4 md:gap-12">
                            {stats.map((stat, index) => (
                                <div key={index} className="text-center">
                                    <div className="text-3xl font-bold text-gradient md:text-4xl">{stat.value}</div>
                                    <div className="mt-1 text-sm text-muted-foreground">{stat.label}</div>
                                </div>
                            ))}
                        </AnimatedGroup> */}
                    </div>
                </div>
            </div>
        </section>
    )
}
