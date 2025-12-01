import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Middleware simplificado - a proteção de rotas é feita client-side nos layouts
// Isso foi necessário porque o projeto estava configurado com output: 'export'
// A proteção de rotas é feita em:
// - app/(private)/layout.tsx: verifica autenticação antes de renderizar páginas privadas
// - app/(public)/auth/page.tsx: redireciona usuários autenticados para dashboard

export function middleware(request: NextRequest) {
  // Apenas permite que todas as requisições passem
  // A proteção real é feita nos layouts client-side
  return NextResponse.next()
}

// Configura o matcher para aplicar o middleware em todas as rotas
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}
