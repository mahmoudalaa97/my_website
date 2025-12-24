'use client'

import { Mail, Phone, MapPin, Send, MessageCircle, Linkedin, Github, Twitter } from 'lucide-react'
import { motion } from 'motion/react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { useState } from 'react'

const contactInfo = [
    {
        icon: Mail,
        label: 'Email',
        value: 'hello@yourname.com',
        href: 'mailto:hello@yourname.com',
    },
    {
        icon: Phone,
        label: 'WhatsApp',
        value: '+1 (234) 567-8900',
        href: 'https://wa.me/12345678900',
    },
    {
        icon: MapPin,
        label: 'Location',
        value: 'Available Worldwide',
        href: null,
    },
]

const socialLinks = [
    { icon: Linkedin, href: 'https://linkedin.com/in/yourprofile', label: 'LinkedIn' },
    { icon: Github, href: 'https://github.com/yourprofile', label: 'GitHub' },
    { icon: Twitter, href: 'https://twitter.com/yourprofile', label: 'Twitter' },
]

export default function ContactSection() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        projectType: '',
        message: '',
    })

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        // Handle form submission - could integrate with email service
        console.log('Form submitted:', formData)
        alert('Thank you for your message! I\'ll get back to you soon.')
    }

    return (
        <section id="contact" className="relative py-24 md:py-32 bg-card/30">
            {/* Background */}
            <div className="absolute inset-0 -z-10">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-border to-transparent" />
                <div className="absolute bottom-1/4 right-0 w-80 h-80 bg-primary/5 rounded-full blur-3xl" />
                <div className="absolute top-1/4 left-0 w-60 h-60 bg-purple-500/5 rounded-full blur-3xl" />
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
                    <span className="text-primary font-medium">Contact</span>
                    <h2 className="mt-4 text-3xl font-bold tracking-tight md:text-4xl lg:text-5xl">
                        Let&apos;s Build Something
                        <span className="text-gradient"> Amazing Together</span>
                    </h2>
                    <p className="mt-6 text-lg text-muted-foreground">
                        Ready to transform your ideas into reality? Get in touch and let&apos;s 
                        discuss how I can help you achieve your goals.
                    </p>
                </motion.div>

                <div className="mt-16 grid gap-12 lg:grid-cols-2">
                    {/* Contact Form */}
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                    >
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid gap-6 sm:grid-cols-2">
                                <div>
                                    <label htmlFor="name" className="block text-sm font-medium mb-2">
                                        Your Name
                                    </label>
                                    <input
                                        type="text"
                                        id="name"
                                        required
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="w-full px-4 py-3 rounded-xl bg-background border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors"
                                        placeholder="John Doe"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium mb-2">
                                        Email Address
                                    </label>
                                    <input
                                        type="email"
                                        id="email"
                                        required
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        className="w-full px-4 py-3 rounded-xl bg-background border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors"
                                        placeholder="john@example.com"
                                    />
                                </div>
                            </div>

                            <div>
                                <label htmlFor="projectType" className="block text-sm font-medium mb-2">
                                    Project Type
                                </label>
                                <select
                                    id="projectType"
                                    value={formData.projectType}
                                    onChange={(e) => setFormData({ ...formData, projectType: e.target.value })}
                                    className="w-full px-4 py-3 rounded-xl bg-background border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors"
                                >
                                    <option value="">Select a project type</option>
                                    <option value="web">Web Application</option>
                                    <option value="mobile">Mobile App</option>
                                    <option value="digitization">Business Digitization</option>
                                    <option value="consulting">Technical Consulting</option>
                                    <option value="other">Other</option>
                                </select>
                            </div>

                            <div>
                                <label htmlFor="message" className="block text-sm font-medium mb-2">
                                    Tell Me About Your Project
                                </label>
                                <textarea
                                    id="message"
                                    required
                                    rows={5}
                                    value={formData.message}
                                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                    className="w-full px-4 py-3 rounded-xl bg-background border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors resize-none"
                                    placeholder="Describe your project, goals, and any specific requirements..."
                                />
                            </div>

                            <Button type="submit" size="lg" className="w-full rounded-xl glow">
                                <Send className="mr-2 size-4" />
                                Send Message
                            </Button>
                        </form>
                    </motion.div>

                    {/* Contact Info */}
                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="lg:pl-8"
                    >
                        {/* Quick Contact */}
                        <div className="space-y-6">
                            <h3 className="text-xl font-semibold">Get In Touch Directly</h3>
                            
                            <div className="space-y-4">
                                {contactInfo.map((item, index) => (
                                    <div 
                                        key={index}
                                        className="flex items-center gap-4 p-4 rounded-xl border border-border bg-card/50 hover:border-primary/50 transition-colors"
                                    >
                                        <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                                            <item.icon className="size-5 text-primary" />
                                        </div>
                                        <div>
                                            <p className="text-sm text-muted-foreground">{item.label}</p>
                                            {item.href ? (
                                                <Link 
                                                    href={item.href}
                                                    className="font-medium hover:text-primary transition-colors"
                                                    target={item.href.startsWith('http') ? '_blank' : undefined}
                                                >
                                                    {item.value}
                                                </Link>
                                            ) : (
                                                <p className="font-medium">{item.value}</p>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* WhatsApp CTA */}
                        <div className="mt-8 p-6 rounded-2xl border border-green-500/30 bg-green-500/5">
                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 rounded-xl bg-green-500/20 flex items-center justify-center flex-shrink-0">
                                    <MessageCircle className="size-5 text-green-500" />
                                </div>
                                <div>
                                    <h4 className="font-semibold text-green-400">Prefer WhatsApp?</h4>
                                    <p className="mt-1 text-sm text-muted-foreground">
                                        Click below for a quick chat. I usually respond within a few hours.
                                    </p>
                                    <Button 
                                        asChild 
                                        className="mt-4 bg-green-600 hover:bg-green-700 text-white rounded-full"
                                    >
                                        <Link href="https://wa.me/12345678900" target="_blank">
                                            <MessageCircle className="mr-2 size-4" />
                                            Chat on WhatsApp
                                        </Link>
                                    </Button>
                                </div>
                            </div>
                        </div>

                        {/* Social Links */}
                        <div className="mt-8">
                            <h4 className="text-sm text-muted-foreground mb-4">Connect with me</h4>
                            <div className="flex gap-3">
                                {socialLinks.map((social, index) => (
                                    <Link
                                        key={index}
                                        href={social.href}
                                        target="_blank"
                                        className="w-12 h-12 rounded-xl border border-border bg-card/50 flex items-center justify-center hover:border-primary hover:bg-primary/10 transition-colors"
                                        aria-label={social.label}
                                    >
                                        <social.icon className="size-5" />
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    )
}

