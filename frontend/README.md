# Frontend - Sistema de Reserva de Equipamento Escolar

Frontend do sistema de reserva de equipamentos escolares desenvolvido com Next.js 13.

## 🚀 Tecnologias

- **Next.js 13.5.1** - Framework React com App Router
- **TypeScript** - Tipagem estática
- **TailwindCSS** - Estilização
- **Lucide React** - Ícones

## 📋 Pré-requisitos

- Node.js 18+
- npm ou yarn
- Backend rodando (veja instruções no diretório `/backend`)

## ⚙️ Configuração

### 1. Instalar dependências

```bash
npm install
```

### 2. Configurar variáveis de ambiente

Copie o arquivo `.env.example` para `.env.local`:

```bash
cp .env.example .env.local
```

Edite o arquivo `.env.local` e configure a URL da API:

```env
# URL base da API do backend
NEXT_PUBLIC_API_URL=http://localhost:5555/api/v1
```

**Importante:**

- A variável deve começar com `NEXT_PUBLIC_` para ser acessível no client-side
- Inclua `/api/v1` no final da URL
- Para produção, altere para a URL do seu servidor

### 3. Iniciar o servidor de desenvolvimento

```bash
npm run dev
```

O frontend estará disponível em `http://localhost:3000`

## 🏗️ Estrutura do Projeto

```
frontend/
├── app/                      # App Router (Next.js 13+)
│   ├── (private)/           # Rotas protegidas (requerem autenticação)
│   │   ├── dashboard/       # Dashboard com estatísticas
│   │   ├── equipment/       # Gerenciamento de equipamentos
│   │   ├── scheduling/      # Agendamentos
│   │   └── users/           # Gerenciamento de usuários
│   ├── (public)/            # Rotas públicas
│   │   └── auth/            # Login
│   └── layout.tsx           # Layout principal
├── components/              # Componentes reutilizáveis
│   ├── layout/             # Componentes de layout (Sidebar, Footer)
│   └── ui/                 # Componentes de UI (Buttons, Cards, etc)
├── hooks/                  # Custom hooks
│   ├── useAuth.ts          # Hook de autenticação
│   ├── useAuthContext.tsx  # Context de autenticação
│   └── use-toast.ts        # Hook de notificações
├── lib/                    # Utilitários e serviços
│   ├── services/           # Serviços de API
│   │   ├── api-client.ts   # Cliente HTTP base
│   │   ├── auth.service.ts # Serviço de autenticação
│   │   ├── dashboard.service.ts
│   │   ├── equipments.service.ts
│   │   ├── schedulings.service.ts
│   │   └── users.service.ts
│   └── utils.ts            # Funções utilitárias
└── .env.local              # Variáveis de ambiente (não comitar!)
```

## 🔐 Autenticação

O sistema usa JWT (JSON Web Tokens) para autenticação:

1. Usuário faz login com email e senha
2. Backend retorna um token JWT
3. Token é armazenado no localStorage
4. Token é incluído automaticamente em todas as requisições via `api-client.ts`
5. Se o token expirar (401), usuário é redirecionado para login

## 👥 Roles e Permissões

### ADMIN (Administrador/Coordenador)

- ✅ Acesso completo ao sistema
- ✅ Gerencia equipamentos (criar, editar, deletar, mudar status)
- ✅ Gerencia usuários (criar, editar, deletar)
- ✅ Gerencia agendamentos (criar, editar, confirmar, cancelar)
- ✅ Visualiza dashboard completo

### STAFF (Secretária)

- ✅ Visualiza todos equipamentos e agendamentos
- ✅ Confirma e cancela agendamentos
- ✅ Cria agendamentos
- ❌ Não gerencia equipamentos
- ❌ Não gerencia usuários

### TEACHER (Professor)

- ✅ Visualiza equipamentos e agendamentos
- ✅ Cria agendamentos
- ✅ Edita e deleta próprios agendamentos
- ❌ Não confirma/cancela agendamentos de outros
- ❌ Não gerencia equipamentos ou usuários

## 🎨 Componentes UI

O projeto utiliza componentes customizados baseados em **shadcn/ui**:

### Componentes de Layout

- **MainLayout** - Layout principal com sidebar e footer
- **Sidebar** - Menu de navegação lateral responsivo
- **Footer** - Rodapé com informações do sistema

### Componentes de Interface

- **Button** - Botões com variantes (default, primary, danger, etc.)
- **Card** - Cards para exibição de conteúdo
- **Modal/Dialog** - Modais para formulários e confirmações
- **Alert** - Alertas de sucesso, erro, aviso
- **Badge** - Tags de status coloridas
- **DataTable** - Tabelas com paginação e ordenação
- **Form** - Formulários com validação
- **Input** - Campos de texto, número, email, etc.
- **Select** - Dropdowns customizados
- **Calendar** - Seletor de datas
- **Toast** - Notificações temporárias (sucesso/erro)
- **Tooltip** - Dicas contextuais
- **Tabs** - Navegação por abas
- **ApiStatusChecker** - Botão flutuante para testar conexão com API

### Ícones

- **Lucide React** - Biblioteca completa de ícones SVG
- Exemplos: Home, Settings, Users, Calendar, Package, etc.

## 📝 Scripts Disponíveis

```bash
# Desenvolvimento
npm run dev

# Build para produção
npm run build

# Iniciar servidor de produção
npm run start

# Linting
npm run lint
```

## 🌐 Variáveis de Ambiente

| Variável              | Descrição               | Exemplo                        |
| --------------------- | ----------------------- | ------------------------------ |
| `NEXT_PUBLIC_API_URL` | URL base da API backend | `http://localhost:5555/api/v1` |

## 🚀 Deploy

### Vercel (Recomendado)

1. Faça push do código para o GitHub
2. Conecte o repositório na Vercel
3. Configure a variável de ambiente `NEXT_PUBLIC_API_URL`
4. Deploy automático!

### Outras plataformas

1. Build do projeto: `npm run build`
2. Configure a variável `NEXT_PUBLIC_API_URL`
3. Inicie o servidor: `npm start`

## 📱 Páginas e Funcionalidades

### 🏠 Dashboard (`/dashboard`)

**Acesso:** Todos os usuários autenticados

**Recursos:**

- 📊 Cards com estatísticas em tempo real:
  - Total de equipamentos e status (disponível, em uso, manutenção)
  - Total de agendamentos por status (agendados, confirmados, concluídos, cancelados)
  - Total de usuários ativos
  - Taxa de uso do sistema
- 📋 Listagem de agendamentos recentes
- 🔄 Atualização automática dos dados
- 📱 Layout responsivo com grid adaptativo

### 💻 Equipamentos (`/equipment`)

**Acesso:** Visualização (todos) | Gerenciamento (ADMIN apenas)

**Recursos:**

- 📋 Tabela com listagem de todos equipamentos
- 🔍 Busca por nome ou tipo
- 🎯 Filtros por status (Disponível, Em Manutenção, Inativo)
- ➕ Cadastro de novos equipamentos (ADMIN)
  - Nome, descrição, tipo, quantidade, status
  - Validação de campos obrigatórios
- ✏️ Edição de equipamentos (ADMIN)
- 🗑️ Inativação de equipamentos (ADMIN)
- 🔧 Mudança de status:
  - Marcar como "Em Manutenção"
  - Marcar como "Disponível"
- 🏷️ Badges coloridas por status:
  - Verde: Disponível
  - Amarelo: Em Manutenção
  - Cinza: Inativo
- 📱 Responsivo com cards em mobile

**Tipos de Equipamento:**

- 💻 Notebook
- 📱 Tablet
- 📽️ Projetor
- 📷 Câmera
- 🎤 Microfone
- 🔊 Caixa de Som
- 🔌 Cabos e Adaptadores
- 📦 Outros

### 📅 Agendamentos (`/scheduling`)

**Acesso:** Todos (criar) | STAFF/ADMIN (confirmar/cancelar)

**Recursos:**

- 📋 Listagem completa de agendamentos
- 🔍 Busca e filtros por status
- ➕ Criar novo agendamento:
  - Seleção de equipamento com **validação de disponibilidade**
  - Data e hora de início e fim (com **bloqueio de datas passadas**)
  - Quantidade (limitada à disponibilidade real)
  - Observações opcionais
- ✏️ Editar agendamento (próprio ou se ADMIN)
- 🗑️ Deletar agendamento (próprio ou se ADMIN)
- ✅ Confirmar agendamento (STAFF/ADMIN)
- ❌ Cancelar agendamento (STAFF/ADMIN)
- 🏷️ Badges de status:
  - Azul: Agendado (aguardando confirmação)
  - Verde: Confirmado
  - Cinza: Concluído
  - Vermelho: Cancelado
- 📊 Informações detalhadas:
  - Nome do equipamento e quantidade
  - Data/hora início e fim
  - Status do agendamento
  - Nome do solicitante
  - Observações

**Sistema de Validação Inteligente:**

1. 🕐 Ao selecionar datas → Consulta disponibilidade em tempo real
2. 📋 Dropdown filtra equipamentos disponíveis
3. 🔢 Campo quantidade limitado ao máximo disponível
4. ⚠️ Mensagem clara: "Máximo disponível: X unidades"
5. 🚫 Botão salvar desabilitado se exceder quantidade
6. ✅ Backend valida novamente (segurança dupla)

### 👥 Usuários (`/users`)

**Acesso:** ADMIN apenas

**Recursos:**

- 📋 Listagem de todos usuários do sistema
- 🔍 Busca por nome ou email
- 🎯 Filtros por role (ADMIN, STAFF, TEACHER)
- ➕ Cadastrar novo usuário:
  - Nome completo
  - Email (único)
  - Telefone
  - Role (papel no sistema)
  - Senha
- ✏️ Editar dados do usuário
- 🗑️ Inativar usuário (soft delete)
- 🏷️ Badges coloridas por role:
  - Roxo: ADMIN
  - Azul: STAFF
  - Verde: TEACHER
- 📊 Informações exibidas:
  - Nome, email, telefone
  - Role e status (ativo/inativo)
  - Data de criação

### 🔐 Login (`/auth`)

**Acesso:** Público

**Recursos:**

- 📧 Login com email e senha
- 🔒 Validação de credenciais
- 🎫 Geração de token JWT
- 🔄 Redirecionamento automático para dashboard
- ⚠️ Mensagens de erro claras
- 🎨 Design clean e responsivo

## 🛡️ Sistema de Validação de Disponibilidade

O sistema implementa validação em tempo real para prevenir conflitos de agendamento:

### Como funciona:

1. **Usuário seleciona datas** → Frontend consulta disponibilidade da API
2. **Dropdown mostra equipamentos disponíveis** → Filtra equipamentos com quantidade disponível
3. **Campo quantidade é limitado** → Máximo = quantidade disponível
4. **Backend valida novamente** → Segurança dupla ao salvar
5. **Feedback visual** → Toast notifications para erros/sucessos

### Exemplo:

**Equipamento:** Projetor (Quantidade: 2)
**Agendamentos existentes:**

- 10h-12h: 1 projetor
- 14h-16h: 2 projetores

**Novo agendamento 11h-15h:**

- Sistema detecta conflito no período 14h-15h (2 ocupados)
- **Disponível: 0 projetores**
- ❌ Equipamento não aparece no dropdown

## �️ Rotas da Aplicação

### Rotas Públicas

```
/auth          → Página de login
```

### Rotas Protegidas (requer autenticação)

```
/dashboard     → Dashboard com estatísticas
/equipment     → Gerenciamento de equipamentos
/scheduling    → Gerenciamento de agendamentos
/users         → Gerenciamento de usuários (ADMIN only)
```

### Redirecionamentos Automáticos

- `/` → Redireciona para `/auth` (se não logado) ou `/dashboard` (se logado)
- Qualquer rota protegida → `/auth` (se token inválido ou expirado)

## 🔄 Fluxo de Navegação

```
Login (/auth)
    ↓
[Autenticado]
    ↓
Dashboard (/dashboard)
    ├─→ Equipamentos (/equipment)
    ├─→ Agendamentos (/scheduling)
    └─→ Usuários (/users) [ADMIN only]
```

## 🎨 Tema e Estilização

### Paleta de Cores

```css
/* Cores principais */
--primary: #1e293b      /* Slate 900 - Azul escuro */
--secondary: #64748b    /* Slate 500 - Azul médio */
--accent: #3b82f6       /* Blue 500 - Azul vibrante */

/* Status */
--success: #10b981      /* Green 500 */
--warning: #f59e0b      /* Amber 500 */
--error: #ef4444        /* Red 500 */
--info: #3b82f6         /* Blue 500 */

/* Backgrounds */
--background: #f8fafc   /* Slate 50 */
--card: #ffffff         /* White */
```

### Tipografia

- **Fonte:** Inter (via Google Fonts)
- **Tamanhos:** text-xs a text-4xl
- **Pesos:** font-normal, font-medium, font-semibold, font-bold

### Responsividade

```css
/* Breakpoints TailwindCSS */
sm:  640px   /* Mobile landscape */
md:  768px   /* Tablet */
lg:  1024px  /* Desktop */
xl:  1280px  /* Large desktop */
2xl: 1536px  /* Extra large */
```

## 🔐 Segurança

### Proteção de Rotas

- Middleware verifica token JWT em todas rotas protegidas
- Redirecionamento automático para login se não autenticado
- Token armazenado em `localStorage` (renovável por 7 dias)

### Validação de Permissões

- Componentes renderizam condicionalmente baseado no role
- Sidebar esconde opções não permitidas
- API retorna 403 se usuário tentar ação não autorizada

### Boas Práticas Implementadas

- ✅ Senhas hasheadas no backend (bcrypt)
- ✅ Tokens JWT com expiração
- ✅ Validação de dados no frontend e backend
- ✅ Sanitização de inputs
- ✅ CORS configurado corretamente
- ✅ Mensagens de erro genéricas (não expõem detalhes)

## 🧪 Estrutura de Serviços

### ApiClient (`lib/services/api-client.ts`)

Cliente HTTP base que:

- Injeta token JWT automaticamente
- Trata erros 401 (redireciona para login)
- Fornece métodos: GET, POST, PUT, PATCH, DELETE
- Centraliza lógica de requisições

### Serviços Específicos

#### AuthService (`auth.service.ts`)

```typescript
login(email, password); // Autenticar usuário
getProfile(token); // Buscar perfil
saveToken(token); // Salvar token
getToken(); // Recuperar token
removeToken(); // Remover token
clearAuth(); // Limpar autenticação
```

#### EquipmentsService (`equipments.service.ts`)

```typescript
list(); // Listar equipamentos
create(data); // Criar equipamento
update(id, data); // Atualizar equipamento
inactivate(id); // Inativar equipamento
markAsMaintenance(id); // Marcar em manutenção
markAsAvailable(id); // Marcar como disponível
checkAvailability(start, end); // Verificar disponibilidade
```

#### SchedulingsService (`schedulings.service.ts`)

```typescript
list(); // Listar agendamentos
create(data); // Criar agendamento
update(id, data); // Atualizar agendamento
delete id; // Deletar agendamento
confirm(id); // Confirmar agendamento
cancel(id); // Cancelar agendamento
```

#### UsersService (`users.service.ts`)

```typescript
list(); // Listar usuários
create(data); // Criar usuário
update(id, data); // Atualizar usuário
delete id; // Deletar usuário
```

#### DashboardService (`dashboard.service.ts`)

```typescript
getStats(); // Buscar estatísticas
```

## 🧰 Hooks Customizados

### useAuth

Hook para gerenciar autenticação:

```typescript
const { user, login, logout, isLoading } = useAuth();
```

### useToast

Hook para exibir notificações:

```typescript
const { toast } = useToast();

toast({
  title: "Sucesso!",
  description: "Operação concluída",
  variant: "success",
});
```

## 🔧 Troubleshooting

### Erro "Failed to fetch"

**Problema:** Frontend não consegue conectar ao backend

**Soluções:**

1. Verifique se o backend está rodando: `http://localhost:5555`
2. Confirme a URL em `.env.local`: `NEXT_PUBLIC_API_URL=http://localhost:5555/api/v1`
3. Verifique CORS no backend (deve permitir `http://localhost:3000`)
4. Teste a API diretamente: `curl http://localhost:5555/api/v1/health`

### Token expirado

**Problema:** Erro 401 ao fazer requisições

**Soluções:**

- Faça login novamente
- Token JWT expira em 7 dias
- Verifique `localStorage` → chave `accessToken`

### Página em branco após login

**Problema:** Não redireciona para dashboard

**Soluções:**

1. Verifique console do navegador (F12)
2. Limpe localStorage: `localStorage.clear()`
3. Limpe cache do navegador
4. Reinicie o servidor: `npm run dev`

### Componentes não renderizam

**Problema:** Tela branca ou erro de hidratação

**Soluções:**

```bash
# Limpar cache Next.js
rm -rf .next

# Reinstalar dependências
rm -rf node_modules package-lock.json
npm install

# Rebuild
npm run build
```

### Erro de CORS

**Problema:** Blocked by CORS policy

**Solução no Backend:**

```typescript
// main.ts
app.enableCors({
  origin: "http://localhost:3000",
  credentials: true,
});
```

### Imagens/Assets não carregam

**Problema:** 404 em arquivos estáticos

**Solução:**

- Assets devem estar em `/public`
- Referenciar como: `/image.png` (não `./public/image.png`)

### Hot Reload não funciona

**Problema:** Alterações não refletem automaticamente

**Soluções:**

```bash
# Reiniciar servidor
# Ctrl+C e depois
npm run dev

# Ou limpar cache
rm -rf .next
npm run dev
```

## 📚 Recursos e Referências

### Documentação Oficial

- [Next.js 13 Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [TailwindCSS Documentation](https://tailwindcss.com/docs)

### Bibliotecas Utilizadas

- [Lucide Icons](https://lucide.dev/) - Ícones SVG
- [shadcn/ui](https://ui.shadcn.com/) - Componentes UI
- [date-fns](https://date-fns.org/) - Manipulação de datas

### Tutoriais Úteis

- [Next.js App Router](https://nextjs.org/docs/app)
- [JWT Authentication](https://jwt.io/introduction)
- [TailwindCSS Best Practices](https://tailwindcss.com/docs/reusing-styles)

## 🚀 Performance

### Otimizações Implementadas

- ✅ Server Components (Next.js 13+)
- ✅ Lazy loading de componentes pesados
- ✅ Imagens otimizadas (Next/Image)
- ✅ CSS modular (TailwindCSS)
- ✅ Code splitting automático
- ✅ Caching de requisições

### Métricas Esperadas

- **First Contentful Paint:** < 1.5s
- **Time to Interactive:** < 3.0s
- **Lighthouse Score:** > 90

## 📄 Licença

Este projeto foi desenvolvido para fins acadêmicos - A3 de Usabilidade, Desenvolvimento Web, Mobile e Jogos.

## 👨‍💻 Desenvolvimento

Desenvolvido com 💙 para facilitar o gerenciamento de equipamentos escolares.
