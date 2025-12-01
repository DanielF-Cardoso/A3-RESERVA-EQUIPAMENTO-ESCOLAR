// Middleware removido - proteção de rotas implementada via layouts client-side
// Isso foi necessário porque o projeto estava configurado com output: 'export'
// A proteção de rotas agora é feita em:
// - app/(private)/layout.tsx: verifica autenticação antes de renderizar páginas privadas
// - app/(public)/auth/page.tsx: redireciona usuários autenticados para dashboard
