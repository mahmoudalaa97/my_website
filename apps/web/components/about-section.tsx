'use client'

import { Code2, Lightbulb, Rocket, Users } from 'lucide-react'
import { motion } from 'motion/react'
import type { SiteSettings } from '@/lib/api'

const highlights = [
    {
        icon: Code2,
        title: 'Technical Excellence',
        description: 'Expert in modern web technologies, mobile development, and cloud solutions.',
    },
    {
        icon: Lightbulb,
        title: 'Problem Solver',
        description: 'I analyze complex challenges and design efficient, scalable solutions.',
    },
    {
        icon: Rocket,
        title: 'Digital Transformation',
        description: 'Helping businesses transition from traditional to digital-first operations.',
    },
    {
        icon: Users,
        title: 'Client Focused',
        description: 'Your success is my priority. I work closely with you at every step.',
    },
]

interface AboutSectionProps {
    settings?: SiteSettings | null
}

export default function AboutSection({ settings }: AboutSectionProps) {
    const siteName = settings?.siteName || 'Your Name'
    const aboutTitle = settings?.aboutTitle || 'Turning Ideas Into Digital Reality'
    const aboutDescription = settings?.aboutDescription || `I'm a passionate software developer dedicated to helping businesses embrace technology. With expertise in web and mobile development, I transform complex challenges into elegant, efficient solutions.\n\nMy approach combines technical excellence with a deep understanding of business needs. Whether you're looking to digitize operations, build a new product, or modernize existing systems — I'm here to help you succeed in the digital age.`
    
    const descriptionParts = aboutDescription.split('\n\n')
    const yearsExperience = settings?.stats?.find(s => s.label.toLowerCase().includes('experience'))?.value || '5+'

    return (
        <section id="about" className="relative py-24 md:py-32">
            {/* Background */}
            <div className="absolute inset-0 -z-10">
                <div className="absolute top-1/2 left-0 w-72 h-72 bg-primary/5 rounded-full blur-3xl" />
            </div>

            <div className="mx-auto max-w-7xl px-6">
                <div className="grid gap-16 lg:grid-cols-2 lg:gap-20 items-center">
                    {/* Left: Image/Visual */}
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="relative"
                    >
                        <div className="aspect-square max-w-md mx-auto lg:max-w-none">
                            {/* Abstract visual representation */}
                            <div className="relative w-full h-full rounded-3xl bg-gradient-to-br from-card to-background border border-border overflow-hidden">
                                {/* Code-like decoration */}
                                <div className="absolute inset-0 p-8">
                                    <div className="space-y-3 font-mono text-sm">
                                        <div className="text-muted-foreground">
                                            <span className="text-purple-400">const</span>{' '}
                                            <span className="text-primary">developer</span> = {'{'}
                                        </div>
                                        <div className="pl-4 text-muted-foreground">
                                            <span className="text-green-400">name</span>:{' '}
                                            <span className="text-amber-400">&quot;{siteName}&quot;</span>,
                                        </div>
                                        <div className="pl-4 text-muted-foreground">
                                            <span className="text-green-400">role</span>:{' '}
                                            <span className="text-amber-400">&quot;Full-Stack Developer&quot;</span>,
                                        </div>
                                        <div className="pl-4 text-muted-foreground">
                                            <span className="text-green-400">mission</span>:{' '}
                                            <span className="text-amber-400">&quot;Digital Transformation&quot;</span>,
                                        </div>
                                        <div className="pl-4 text-muted-foreground">
                                            <span className="text-green-400">passion</span>:{' '}
                                            <span className="text-amber-400">&quot;Solving Problems&quot;</span>,
                                        </div>
                                        <div className="text-muted-foreground">{'}'}</div>
                                    </div>
                                </div>
                                {/* Glow effect */}
                                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3/4 h-1/2 bg-primary/20 blur-3xl" />
                            </div>
                        </div>
                        {/* Floating badge */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: 0.3 }}
                            className="absolute -bottom-6 -right-6 lg:bottom-8 lg:-right-8 bg-card border border-border rounded-2xl p-4 shadow-xl glow-sm"
                        >
                            <div className="text-2xl font-bold text-gradient">{yearsExperience}</div>
                            <div className="text-sm text-muted-foreground">Years of Experience</div>
                        </motion.div>
                    </motion.div>

                    {/* Right: Content */}
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                    >
                        <span className="text-primary font-medium">About Me</span>
                        <h2 className="mt-4 text-3xl font-bold tracking-tight md:text-4xl lg:text-5xl">
                            {aboutTitle.split(' ').slice(0, -2).join(' ')}
                            <span className="text-gradient"> {aboutTitle.split(' ').slice(-2).join(' ')}</span>
                        </h2>
                        {descriptionParts.map((part, index) => (
                            <p key={index} className="mt-6 text-lg text-muted-foreground leading-relaxed">
                                {part}
                            </p>
                        ))}

                        {/* Highlights Grid */}
                        <div className="mt-10 grid gap-6 sm:grid-cols-2">
                            {highlights.map((item, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.5, delay: index * 0.1 }}
                                    className="flex gap-4"
                                >
                                    <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                                        <item.icon className="size-5 text-primary" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold">{item.title}</h3>
                                        <p className="mt-1 text-sm text-muted-foreground">{item.description}</p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    )
}
