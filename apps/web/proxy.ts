import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getApiHealth } from '@/lib/api'

export async function proxy(request: NextRequest) {
    const { pathname } = request.nextUrl
    const health = await getApiHealth()

    if (health.ok) {
        if (pathname === '/maintenance') {
            return NextResponse.redirect(new URL('/', request.url))
        }
        return NextResponse.next()
    }

    if (pathname === '/maintenance') {
        return NextResponse.next()
    }

    const maintenanceUrl = request.nextUrl.clone()
    maintenanceUrl.pathname = '/maintenance'
    maintenanceUrl.search = ''

    const response = NextResponse.rewrite(maintenanceUrl, { status: 503 })
    response.headers.set('Retry-After', '60')
    return response
}

export const config = {
    matcher: [
        '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)',
    ],
}
