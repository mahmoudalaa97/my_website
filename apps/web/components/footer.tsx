'use client'

import Link from 'next/link'
import { Code2, Heart, ArrowUp } from 'lucide-react'
import type { SiteSettings } from '@/lib/api'

interface FooterProps {
    settings?: SiteSettings | null
}

export default function Footer({ settings }: FooterProps) {
    const siteName = settings?.siteName || 'YourName'
    const email = settings?.email || 'hello@yourname.com'
    
    const footerLinks = [
        {
            title: 'Navigation',
            links: [
                { name: 'Home', href: '#home' },
                { name: 'About', href: '#about' },
                { name: 'Services', href: '#services' },
                { name: 'Portfolio', href: '#portfolio' },
                { name: 'Pricing', href: '#pricing' },
                { name: 'Contact', href: '#contact' },
            ],
        },
        {
            title: 'Services',
            links: [
                { name: 'Web Development', href: '#services' },
                { name: 'Mobile Apps', href: '#services' },
                { name: 'Digitization', href: '#services' },
                { name: 'Consulting', href: '#services' },
            ],
        },
        {
            title: 'Connect',
            links: [
                settings?.socialLinks?.linkedin && { name: 'LinkedIn', href: settings.socialLinks.linkedin },
                settings?.socialLinks?.github && { name: 'GitHub', href: settings.socialLinks.github },
                settings?.socialLinks?.twitter && { name: 'Twitter', href: settings.socialLinks.twitter },
                { name: 'Email', href: `mailto:${email}` },
            ].filter(Boolean) as { name: string; href: string }[],
        },
    ]

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }

    return (
        <footer className="relative border-t border-border bg-card/30">
            <div className="mx-auto max-w-7xl px-6 py-16">
                <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
                    {/* Brand */}
                    <div className="lg:col-span-1">
                        <Link href="#home" className="flex items-center gap-2">
                            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                                <Code2 className="size-5 text-primary" />
                            </div>
                            <span className="text-xl font-bold">{siteName}</span>
                        </Link>
                        <p className="mt-4 text-sm text-muted-foreground leading-relaxed">
                            {settings?.description || "Helping businesses transform through technology. From idea to implementation, let's build something amazing."}
                        </p>
                    </div>

                    {/* Links */}
                    {footerLinks.map((section, index) => (
                        <div key={index}>
                            <h4 className="font-semibold mb-4">{section.title}</h4>
                            <ul className="space-y-3">
                                {section.links.map((link, i) => (
                                    <li key={i}>
                                        <Link
                                            href={link.href}
                                            className="text-sm text-muted-foreground hover:text-primary transition-colors"
                                            target={link.href.startsWith('http') ? '_blank' : undefined}
                                        >
                                            {link.name}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                {/* Bottom */}
                <div className="mt-16 pt-8 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4">
                    <p className="text-sm text-muted-foreground flex items-center gap-1">
                        © {new Date().getFullYear()} {siteName}. Made with 
                        <Heart className="size-4 text-red-500 fill-red-500" /> 
                        and code.
                    </p>
                    <button
                        onClick={scrollToTop}
                        className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
                    >
                        <span>Back to top</span>
                        <div className="w-8 h-8 rounded-full border border-border flex items-center justify-center hover:border-primary transition-colors">
                            <ArrowUp className="size-4" />
                        </div>
                    </button>
                </div>
            </div>
        </footer>
    )
}
