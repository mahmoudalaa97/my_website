'use client'

import { ExternalLink, Github } from 'lucide-react'
import { motion } from 'motion/react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import type { Project } from '@/lib/api'

const defaultProjects = [
    {
        title: 'E-Commerce Platform',
        description: 'A full-featured online store with inventory management, payment processing, and analytics dashboard.',
        tags: ['Next.js', 'Node.js', 'PostgreSQL', 'Stripe'],
        liveUrl: '#',
        githubUrl: '#',
        isFeatured: true,
    },
    {
        title: 'Healthcare Management System',
        description: "Digital transformation of a clinic's operations including appointments, patient records, and billing.",
        tags: ['React', 'Express', 'MongoDB', 'AWS'],
        liveUrl: '#',
        githubUrl: '#',
        isFeatured: true,
    },
    {
        title: 'Inventory Tracking App',
        description: 'Mobile application for real-time inventory management with barcode scanning and alerts.',
        tags: ['React Native', 'Firebase', 'Node.js'],
        liveUrl: '#',
        githubUrl: '#',
        isFeatured: false,
    },
    {
        title: 'Restaurant POS System',
        description: 'Complete point-of-sale solution with order management, kitchen display, and reporting.',
        tags: ['Vue.js', 'Python', 'PostgreSQL'],
        liveUrl: '#',
        githubUrl: '#',
        isFeatured: false,
    },
    {
        title: 'Real Estate Portal',
        description: 'Property listing platform with advanced search, virtual tours, and CRM integration.',
        tags: ['Next.js', 'Prisma', 'Tailwind CSS'],
        liveUrl: '#',
        githubUrl: '#',
        isFeatured: false,
    },
    {
        title: 'Fleet Management Dashboard',
        description: 'GPS tracking and fleet analytics platform for logistics companies.',
        tags: ['React', 'Node.js', 'Socket.io', 'Maps API'],
        liveUrl: '#',
        githubUrl: '#',
        isFeatured: false,
    },
]

interface PortfolioSectionProps {
    projects?: Project[] | null
}

export default function PortfolioSection({ projects }: PortfolioSectionProps) {
    const displayProjects = projects?.length ? projects : defaultProjects

    return (
        <section id="portfolio" className="relative py-24 md:py-32 bg-card/30">
            {/* Background */}
            <div className="absolute inset-0 -z-10">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-border to-transparent" />
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-border to-transparent" />
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
                    <span className="text-primary font-medium">Portfolio</span>
                    <h2 className="mt-4 text-3xl font-bold tracking-tight md:text-4xl lg:text-5xl">
                        Projects That Make
                        <span className="text-gradient"> An Impact</span>
                    </h2>
                    <p className="mt-6 text-lg text-muted-foreground">
                        A showcase of solutions I&apos;ve built for clients across various industries.
                        Each project represents a unique challenge transformed into success.
                    </p>
                </motion.div>

                {/* Projects Grid */}
                <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                    {displayProjects.map((project, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            className={`group relative rounded-2xl border border-border bg-card overflow-hidden ${project.isFeatured ? 'md:col-span-2 lg:col-span-1' : ''
                                }`}
                        >
                            {/* Project Image Placeholder */}
                            <div className="aspect-video bg-gradient-to-br from-primary/20 via-purple-500/10 to-background relative overflow-hidden">
                                {/* {project.imageUrl? (
                                    <img 
                                        src={project.imageUrl} 
                                        alt={project.title}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <div className="text-6xl font-bold text-primary/20">
                                            {project.title.charAt(0)}
                                        </div>
                                    </div>
                                )} */}
                                {/* Hover overlay */}
                                <div className="absolute inset-0 bg-background/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-4">
                                    {project.liveUrl && (
                                        <Link
                                            href={project.liveUrl}
                                            target="_blank"
                                            className="p-3 rounded-full bg-primary text-primary-foreground hover:scale-110 transition-transform"
                                        >
                                            <ExternalLink className="size-5" />
                                        </Link>
                                    )}
                                    {project.githubUrl && (
                                        <Link
                                            href={project.githubUrl}
                                            target="_blank"
                                            className="p-3 rounded-full bg-secondary text-secondary-foreground hover:scale-110 transition-transform"
                                        >
                                            <Github className="size-5" />
                                        </Link>
                                    )}
                                </div>
                                {/* Featured badge */}
                                {project.isFeatured && (
                                    <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-primary/90 text-primary-foreground text-xs font-medium">
                                        Featured
                                    </div>
                                )}
                            </div>

                            {/* Content */}
                            <div className="p-6">
                                <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
                                    {project.title}
                                </h3>
                                <p className="text-muted-foreground text-sm mb-4">
                                    {project.description}
                                </p>
                                {/* Tags */}
                                <div className="flex flex-wrap gap-2">
                                    {project.tags.map((tag, i) => (
                                        <span
                                            key={i}
                                            className="px-2.5 py-1 rounded-full bg-secondary text-secondary-foreground text-xs"
                                        >
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            </div>
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
                        Interested in seeing more or discussing a similar project?
                    </p>
                    <Button asChild size="lg" className="rounded-full px-8">
                        <Link href="#contact">
                            Let&apos;s Talk About Your Project
                        </Link>
                    </Button>
                </motion.div>
            </div>
        </section>
    )
}
