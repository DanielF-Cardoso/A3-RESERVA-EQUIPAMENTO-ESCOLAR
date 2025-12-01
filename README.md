# 🎓 Sistema de Reserva de Equipamento Escolar

Sistema completo para gerenciamento de reservas de equipamentos escolares, desenvolvido como trabalho acadêmico (A3).

## 📋 Sobre o Projeto

Sistema full-stack que permite:

- 👥 Gerenciamento de usuários com diferentes níveis de acesso
- 💻 Cadastro e controle de equipamentos escolares
- 📅 Agendamento de equipamentos com validação de disponibilidade
- 📊 Dashboard com estatísticas em tempo real
- 🛡️ Sistema inteligente anti-conflito de agendamentos

## 🏗️ Arquitetura

```
A3-RESERVA-EQUIPAMENTO-ESCOLAR/
├── backend/                    # API REST (NestJS)
│   ├── src/
│   │   ├── core/              # Entidades e lógica reutilizável
│   │   ├── domain/            # Regras de negócio
│   │   └── infra/             # Implementação (Prisma, HTTP, Auth)
│   ├── prisma/
│   │   ├── schema.prisma      # Schema do banco
│   │   ├── migrations/        # Histórico de migrations
│   │   └── seed/              # Dados de exemplo
│   └── test/                  # Testes unitários e E2E
│
└── frontend/                   # Interface Web (Next.js 13)
    ├── app/
    │   ├── (public)/          # Páginas públicas (login)
    │   └── (private)/         # Páginas protegidas
    ├── components/            # Componentes reutilizáveis
    ├── lib/
    │   └── services/          # Serviços de API
    └── hooks/                 # React hooks customizados
```

## 🚀 Tecnologias

### Backend

- **NestJS 10** - Framework Node.js
- **Prisma ORM** - Database toolkit
- **PostgreSQL** - Banco de dados
- **JWT** - Autenticação
- **TypeScript** - Tipagem estática
- **Vitest** - Testes

### Frontend

- **Next.js 13.5** - Framework React
- **TypeScript** - Tipagem estática
- **TailwindCSS** - Estilização
- **Lucide React** - Ícones
- **shadcn/ui** - Componentes

## 📦 Instalação Rápida

### Pré-requisitos

- Node.js 18+
- PostgreSQL 14+
- npm ou yarn

### 1. Clone o repositório

```bash
git clone https://github.com/DanielF-Cardoso/A3-RESERVA-EQUIPAMENTO-ESCOLAR.git
cd A3-RESERVA-EQUIPAMENTO-ESCOLAR
```

### 2. Configure o Backend

```bash
cd backend

# Instalar dependências
npm install

# Configurar variáveis de ambiente
cp .env.example .env
# Edite o .env com suas credenciais do PostgreSQL

# Executar migrations
npx prisma migrate dev

# Popular banco com dados de exemplo
npm run seed

# Iniciar servidor
npm run dev
```

Backend rodando em: `http://localhost:5555`

### 3. Configure o Frontend

```bash
cd ../frontend

# Instalar dependências
npm install

# Configurar variáveis de ambiente
cp .env.example .env.local
# A URL padrão já está configurada: http://localhost:5555/api/v1

# Iniciar servidor
npm run dev
```

Frontend rodando em: `http://localhost:3000`

## 🎯 Como Usar

### 1. Acesse o sistema

Abra o navegador em `http://localhost:3000`

### 2. Faça login

Use uma das credenciais criadas pelo seed:

**Administrador (acesso total):**

```
Email: admin@escola.com
Senha: senha123
```

**Secretária (gerencia agendamentos):**

```
Email: staff@escola.com
Senha: senha123
```

**Professor (cria agendamentos):**

```
Email: professor@escola.com
Senha: senha123
```

### 3. Explore as funcionalidades

#### Dashboard

- Visualize estatísticas em tempo real
- Veja resumo de equipamentos e agendamentos

#### Equipamentos (ADMIN apenas)

- Cadastre novos equipamentos
- Gerencie status (Disponível, Manutenção, Inativo)
- Visualize quantidade disponível

#### Agendamentos (Todos)

- Crie reservas de equipamentos
- Sistema valida automaticamente:
  - ❌ Não permite datas passadas
  - ❌ Não permite quantidade acima do disponível
  - ✅ Mostra apenas equipamentos disponíveis
  - ✅ Previne conflitos de agendamento

#### Usuários (ADMIN apenas)

- Cadastre professores e funcionários
- Defina roles (ADMIN, STAFF, TEACHER)
- Gerencie permissões

## 🎨 Demonstração

### Tela de Login

![Login](docs/screenshots/login.png)

### Dashboard

![Dashboard](docs/screenshots/dashboard.png)

### Gerenciamento de Equipamentos

![Equipamentos](docs/screenshots/equipment.png)

### Sistema de Agendamentos

![Agendamentos](docs/screenshots/scheduling.png)

## 🔐 Roles e Permissões

| Funcionalidade               | ADMIN | STAFF | TEACHER |
| ---------------------------- | ----- | ----- | ------- |
| Ver Dashboard                | ✅    | ✅    | ✅      |
| Ver Equipamentos             | ✅    | ✅    | ✅      |
| Gerenciar Equipamentos       | ✅    | ❌    | ❌      |
| Ver Agendamentos             | ✅    | ✅    | ✅      |
| Criar Agendamentos           | ✅    | ✅    | ✅      |
| Editar Próprios Agendamentos | ✅    | ✅    | ✅      |
| Confirmar Agendamentos       | ✅    | ✅    | ❌      |
| Cancelar Agendamentos        | ✅    | ✅    | ❌      |
| Gerenciar Usuários           | ✅    | ❌    | ❌      |

## 🛡️ Sistema Anti-Conflito

O sistema implementa validação inteligente em **múltiplas camadas**:

### Camada 1: Frontend (UX)

- Consulta disponibilidade em tempo real ao selecionar datas
- Mostra apenas equipamentos com quantidade disponível
- Limita campo de quantidade ao máximo disponível
- Desabilita botão salvar se quantidade inválida

### Camada 2: Backend (Segurança)

- Valida quantidade disponível antes de criar/atualizar
- Calcula: `Disponível = Total - Soma(Agendamentos Conflitantes)`
- Retorna erro detalhado se insuficiente
- Impede double-booking no banco de dados

### Exemplo Prático

**Cenário:** 5 Notebooks disponíveis

**Agendamentos existentes em 10/12/2025:**

- 08h-12h: 2 notebooks agendados
- 10h-14h: Tentativa de agendar 4 notebooks

**Resultado:**

- Sistema detecta conflito entre 10h-12h
- Apenas 3 notebooks disponíveis nesse período (5 - 2)
- ❌ Bloqueio automático: "Quantidade insuficiente. Disponível: 3, Solicitado: 4"

## 📊 Dados do Seed

O comando `npm run seed` cria:

### 5 Usuários

- 1 ADMIN: admin@escola.com
- 1 STAFF: staff@escola.com
- 3 TEACHERS: professor@escola.com, ana.costa@escola.com, pedro.alves@escola.com

### 8 Tipos de Equipamentos (34 unidades totais)

- 5 Notebooks Dell
- 8 Tablets Samsung
- 3 Projetores Epson
- 2 Câmeras Canon
- 4 Microfones Shure
- 2 Caixas de Som JBL
- 10 Kits de Cabos
- 2 Notebooks em Manutenção

### 12 Agendamentos

- 3 Concluídos (passados)
- 1 Cancelado (passado)
- 5 Agendados (futuros)
- 3 Confirmados (futuros)

## 🧪 Testes

### Backend

```bash
cd backend

# Testes unitários
npm run test

# Testes E2E
npm run test:e2e

# Coverage
npm run test:cov
```

### Frontend

```bash
cd frontend

# Linting
npm run lint
```

## 📡 API Documentation

A documentação completa da API está disponível em:

```
http://localhost:5555/api/docs
```

Principais endpoints:

### Autenticação

- `POST /api/v1/login` - Login
- `GET /api/v1/users/me` - Perfil

### Equipamentos

- `GET /api/v1/equipments` - Listar
- `POST /api/v1/equipments` - Criar
- `PUT /api/v1/equipments/:id` - Atualizar
- `GET /api/v1/equipments/availability` - Verificar disponibilidade

### Agendamentos

- `GET /api/v1/schedulings` - Listar
- `POST /api/v1/schedulings` - Criar
- `PUT /api/v1/schedulings/:id` - Atualizar
- `PATCH /api/v1/schedulings/:id/confirm` - Confirmar
- `PATCH /api/v1/schedulings/:id/cancel` - Cancelar

### Usuários

- `GET /api/v1/users` - Listar
- `POST /api/v1/users` - Criar
- `PUT /api/v1/users/:id` - Atualizar

### Dashboard

- `GET /api/v1/dashboard/stats` - Estatísticas

## 🚀 Deploy

### Backend

**Opção 1: Heroku**

```bash
heroku create app-backend
heroku addons:create heroku-postgresql
git push heroku main
```

**Opção 2: Railway**

1. Conecte o repositório
2. Configure variáveis de ambiente
3. Deploy automático

### Frontend

**Vercel (Recomendado)**

1. Conecte repositório no GitHub
2. Configure `NEXT_PUBLIC_API_URL`
3. Deploy automático

**Netlify**

1. Build command: `npm run build`
2. Publish directory: `.next`
3. Configure variável de ambiente

## 📁 Estrutura de Pastas Detalhada

```
.
├── backend/
│   ├── prisma/
│   │   ├── schema.prisma           # Definição do schema
│   │   ├── migrations/             # Versionamento do DB
│   │   └── seed/
│   │       └── seed.ts             # Dados iniciais
│   ├── src/
│   │   ├── main.ts                 # Entry point
│   │   ├── core/                   # Camada core (reutilizável)
│   │   │   ├── entities/
│   │   │   ├── value-objects/
│   │   │   ├── errors/
│   │   │   └── types/
│   │   ├── domain/                 # Camada de domínio
│   │   │   ├── user/
│   │   │   ├── equipment/
│   │   │   ├── scheduling/
│   │   │   └── dashboard/
│   │   └── infra/                  # Camada de infraestrutura
│   │       ├── app.module.ts
│   │       ├── auth/               # JWT, Guards, Strategies
│   │       ├── database/           # Prisma, Repositories
│   │       ├── http/               # Controllers, DTOs
│   │       ├── cryptography/       # Bcrypt, JWT
│   │       └── logger/             # Winston Logger
│   └── test/
│       ├── factories/              # Test factories
│       ├── repositories/           # In-memory repos
│       └── controllers/            # E2E tests
│
├── frontend/
│   ├── app/
│   │   ├── (public)/
│   │   │   └── auth/               # Login page
│   │   ├── (private)/
│   │   │   ├── dashboard/          # Dashboard
│   │   │   ├── equipment/          # Equipamentos
│   │   │   ├── scheduling/         # Agendamentos
│   │   │   └── users/              # Usuários
│   │   ├── layout.tsx              # Root layout
│   │   └── globals.css             # Global styles
│   ├── components/
│   │   ├── layout/
│   │   │   ├── main-layout.tsx     # Layout principal
│   │   │   ├── sidebar.tsx         # Sidebar
│   │   │   └── footer.tsx          # Footer
│   │   └── ui/                     # UI components
│   ├── hooks/
│   │   ├── useAuth.ts              # Auth hook
│   │   └── use-toast.ts            # Toast notifications
│   └── lib/
│       ├── services/
│       │   ├── api-client.ts       # Base HTTP client
│       │   ├── auth.service.ts
│       │   ├── equipments.service.ts
│       │   ├── schedulings.service.ts
│       │   ├── users.service.ts
│       │   └── dashboard.service.ts
│       └── utils.ts                # Helper functions
│
└── docs/
    ├── screenshots/                # Capturas de tela
    ├── architecture.md             # Documentação arquitetura
    └── api.md                      # Documentação API
```

## 🔧 Troubleshooting

### Backend não inicia

```bash
# Verifique se o PostgreSQL está rodando
docker-compose ps

# Regenere o Prisma Client
npx prisma generate

# Execute migrations novamente
npx prisma migrate dev
```

### Frontend não conecta na API

```bash
# Verifique variável de ambiente
cat frontend/.env.local

# Deve conter:
# NEXT_PUBLIC_API_URL=http://localhost:5555/api/v1

# Teste a API diretamente
curl http://localhost:5555/api/v1/health
```

### Erro de CORS

Adicione no `backend/src/main.ts`:

```typescript
app.enableCors({
  origin: "http://localhost:3000",
  credentials: true,
});
```

## 📚 Documentação Adicional

- [Backend README](./backend/README.md) - Documentação completa do backend
- [Frontend README](./frontend/README.md) - Documentação completa do frontend
- [API Documentation](http://localhost:5555/api/docs) - Swagger UI (quando backend rodando)

## 🤝 Contribuindo

Este é um projeto acadêmico, mas sugestões são bem-vindas:

1. Fork o projeto
2. Crie uma branch (`git checkout -b feature/nova-funcionalidade`)
3. Commit suas mudanças (`git commit -m 'Add: nova funcionalidade'`)
4. Push para a branch (`git push origin feature/nova-funcionalidade`)
5. Abra um Pull Request

## 📝 Licença

Este projeto foi desenvolvido para fins acadêmicos - A3 de Usabilidade, Desenvolvimento Web, Mobile e Jogos.

## 👨‍💻 Autores

Desenvolvido com 💙 por estudantes comprometidos com a qualidade.

---

⭐ Se este projeto te ajudou, considere dar uma estrela no repositório!
