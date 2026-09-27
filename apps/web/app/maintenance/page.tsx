import type { Metadata } from 'next'
import { MaintenanceScreen } from '@/components/maintenance-screen'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
    title: "We'll be back shortly",
    robots: { index: false, follow: false },
}

export default function MaintenancePage() {
    return <MaintenanceScreen />
}
