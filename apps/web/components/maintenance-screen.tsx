'use client'

import { RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function MaintenanceScreen() {
    return (
        <main className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6 py-16">
            <div aria-hidden className="absolute inset-0 -z-10">
                <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:96px_96px]" />
                <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
            </div>

            <p className="text-sm font-medium tracking-[0.18em] text-primary uppercase">
                Mahmoud Alaa
            </p>
            <h1 className="mt-6 max-w-xl text-center text-4xl font-bold tracking-tight text-balance sm:text-5xl">
                Back in a moment
            </h1>
            <p className="mt-5 max-w-md text-center text-lg leading-relaxed text-muted-foreground">
                This site is temporarily unavailable. Please try again in a few minutes.
            </p>
            <Button
                size="lg"
                className="mt-10"
                onClick={() => window.location.reload()}
            >
                <RefreshCw className="size-4" />
                Try again
            </Button>
        </main>
    )
}
