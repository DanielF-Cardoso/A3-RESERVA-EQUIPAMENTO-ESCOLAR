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

- **ADMIN**: Acesso completo ao sistema
- **STAFF**: Pode confirmar/cancelar agendamentos
- **TEACHER**: Pode criar agendamentos
- **STUDENT**: Pode criar agendamentos

## 🎨 Componentes UI

O projeto utiliza componentes customizados baseados em shadcn/ui:

- Buttons, Cards, Modals, Alerts
- Forms com validação
- Data Tables
- Calendário
- Toast notifications
- E muito mais...

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

| Variável | Descrição | Exemplo |
|----------|-----------|---------|
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

## 📱 Funcionalidades

### Dashboard
- Estatísticas em tempo real
- Total de equipamentos ativos
- Agendamentos pendentes
- Agendamentos confirmados

### Equipamentos
- Listagem com filtros e busca
- Cadastro de novos equipamentos
- Edição e remoção
- Gerenciamento de status (Disponível, Em manutenção, Inativo)
- **Validação de disponibilidade** para prevenir agendamentos conflitantes

### Agendamentos
- Criação de agendamentos
- Validação de datas (não permite datas passadas)
- **Sistema de validação de quantidade disponível**
- Confirmação e cancelamento (STAFF/ADMIN)
- Filtros por status
- Visualização detalhada

### Usuários (ADMIN apenas)
- Listagem de usuários
- Cadastro e edição
- Gerenciamento de roles
- Busca e filtros

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

## 🔧 Troubleshooting

### Erro "Failed to fetch"

- Verifique se o backend está rodando
- Confirme a URL em `.env.local`
- Verifique problemas de CORS no backend

### Token expirado

- Faça login novamente
- O token tem validade de 7 dias

### Build errors

```bash
# Limpar cache e reinstalar
rm -rf .next node_modules
npm install
npm run build
```

## 📄 Licença

Este projeto foi desenvolvido para fins acadêmicos.
