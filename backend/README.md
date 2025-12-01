# Backend - Sistema de Reserva de Equipamento Escolar

API REST desenvolvida com NestJS para gerenciar reservas de equipamentos escolares.

## 🚀 Tecnologias

- **NestJS 10.x** - Framework Node.js progressivo
- **TypeScript** - Tipagem estática
- **Prisma ORM** - ORM moderno para Node.js
- **PostgreSQL** - Banco de dados relacional
- **JWT** - Autenticação via tokens
- **bcryptjs** - Hash de senhas
- **Vitest** - Framework de testes
- **Docker** - Containerização (opcional)

## 📋 Pré-requisitos

- **Node.js** 18+
- **npm** ou **yarn**
- **PostgreSQL** 14+ (ou Docker)

## ⚙️ Configuração

### 1. Instalar dependências

```bash
npm install
```

### 2. Configurar variáveis de ambiente

Copie o arquivo `.env.example` para `.env`:

```bash
cp .env.example .env
```

Configure as variáveis no arquivo `.env`:

```env
# Banco de Dados
DATABASE_URL="postgresql://user:password@localhost:5432/escola_db?schema=public"

# JWT
JWT_SECRET="sua-chave-secreta-super-segura-aqui"
JWT_EXPIRES_IN="7d"

# Aplicação
PORT=5555
NODE_ENV="development"
```

### 3. Subir o banco de dados (com Docker)

```bash
docker-compose up -d
```

Ou configure seu PostgreSQL local manualmente.

### 4. Executar migrations

```bash
npx prisma migrate dev
```

### 5. Popular o banco de dados (Seed)

```bash
npm run seed
```

Isso criará:

- **5 usuários** (1 ADMIN, 1 STAFF, 3 TEACHERS)
- **8 tipos de equipamentos** (Notebooks, Tablets, Projetores, Câmeras, etc.)
- **12 agendamentos** (passados e futuros com diferentes status)

**Credenciais criadas:**

```
📧 admin@escola.com       - ADMIN    🔑 senha123
📧 staff@escola.com       - STAFF    🔑 senha123
📧 professor@escola.com   - TEACHER  🔑 senha123
📧 ana.costa@escola.com   - TEACHER  🔑 senha123
📧 pedro.alves@escola.com - TEACHER  🔑 senha123
```

### 6. Iniciar o servidor

```bash
# Desenvolvimento
npm run dev

# Produção
npm run build
npm run start:prod
```

A API estará disponível em: `http://localhost:5555`

## 🏗️ Arquitetura

O projeto segue os princípios de **Clean Architecture** e **Domain-Driven Design (DDD)**:

```
backend/
├── prisma/                      # Configuração do Prisma ORM
│   ├── schema.prisma           # Schema do banco de dados
│   ├── migrations/             # Histórico de migrations
│   └── seed/                   # Scripts de seed
│       └── seed.ts
│
├── src/
│   ├── main.ts                 # Ponto de entrada da aplicação
│   │
│   ├── core/                   # Núcleo da aplicação (reutilizável)
│   │   ├── entities/          # Entidades base
│   │   ├── value-objects/     # Value Objects
│   │   ├── errors/            # Erros customizados
│   │   ├── events/            # Sistema de eventos
│   │   ├── types/             # Tipos compartilhados
│   │   ├── providers/         # Providers abstratos
│   │   └── cryptography/      # Interfaces de criptografia
│   │
│   ├── domain/                # Camada de domínio (regras de negócio)
│   │   ├── user/
│   │   │   ├── entities/      # User, UserRole
│   │   │   ├── repositories/  # UserRepository (interface)
│   │   │   └── use-cases/     # Casos de uso (CreateUser, GetUser, etc.)
│   │   │
│   │   ├── equipment/
│   │   │   ├── entities/      # Equipment, EquipmentType, EquipmentStatus
│   │   │   ├── repositories/  # EquipmentRepository (interface)
│   │   │   └── use-cases/     # CRUD de equipamentos
│   │   │
│   │   ├── scheduling/
│   │   │   ├── entities/      # Scheduling, SchedulingStatus
│   │   │   ├── repositories/  # SchedulingRepository (interface)
│   │   │   └── use-cases/     # CRUD de agendamentos + validações
│   │   │
│   │   └── dashboard/
│   │       └── use-cases/     # GetDashboardStats
│   │
│   └── infra/                 # Camada de infraestrutura
│       ├── app.module.ts      # Módulo principal
│       │
│       ├── auth/              # Autenticação e autorização
│       │   ├── guards/        # JwtAuthGuard, RolesGuard
│       │   ├── decorators/    # @CurrentUser, @Roles
│       │   └── strategies/    # JWT Strategy
│       │
│       ├── database/          # Implementação do Prisma
│       │   ├── prisma.service.ts
│       │   └── repositories/  # Implementações dos repositories
│       │       ├── prisma-user.repository.ts
│       │       ├── prisma-equipment.repository.ts
│       │       └── prisma-scheduling.repository.ts
│       │
│       ├── http/              # Controllers e DTOs
│       │   ├── http.module.ts
│       │   ├── controllers/   # Controllers REST
│       │   │   ├── auth.controller.ts
│       │   │   ├── user.controller.ts
│       │   │   ├── equipment.controller.ts
│       │   │   ├── scheduling.controller.ts
│       │   │   └── dashboard.controller.ts
│       │   └── dtos/          # Data Transfer Objects
│       │
│       ├── cryptography/      # Implementação de criptografia
│       │   ├── bcrypt-hasher.ts
│       │   └── jwt-encrypter.ts
│       │
│       ├── email/             # Serviço de email (futuro)
│       ├── logger/            # Serviço de logs
│       ├── filters/           # Exception filters
│       ├── env/               # Validação de env vars
│       └── docs/              # Documentação Swagger
│
└── test/                      # Testes
    ├── setup-e2e.ts
    ├── factories/             # Factories para testes
    ├── repositories/          # Repositories in-memory
    └── controllers/           # Testes E2E
```

## 📡 API - Endpoints

Base URL: `http://localhost:5555/api/v1`

### 🔐 Autenticação

| Método | Rota        | Descrição                | Auth |
| ------ | ----------- | ------------------------ | ---- |
| POST   | `/login`    | Login do usuário         | Não  |
| GET    | `/users/me` | Perfil do usuário logado | Sim  |

**Exemplo de Login:**

```bash
curl -X POST http://localhost:5555/api/v1/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@escola.com",
    "password": "senha123"
  }'
```

**Resposta:**

```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "role": "ADMIN"
}
```

### 👥 Usuários

| Método | Rota         | Descrição             | Roles Permitidas |
| ------ | ------------ | --------------------- | ---------------- |
| GET    | `/users`     | Listar todos usuários | ADMIN            |
| POST   | `/users`     | Criar novo usuário    | ADMIN            |
| PUT    | `/users/:id` | Atualizar usuário     | ADMIN            |
| DELETE | `/users/:id` | Deletar usuário       | ADMIN            |
| GET    | `/users/me`  | Buscar perfil próprio | Todos            |

**Criar Usuário:**

```bash
curl -X POST http://localhost:5555/api/v1/users \
  -H "Authorization: Bearer SEU_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "João Silva",
    "email": "joao@escola.com",
    "phone": "11999999999",
    "role": "TEACHER",
    "password": "senha123"
  }'
```

### 💻 Equipamentos

| Método | Rota                          | Descrição                 | Roles Permitidas |
| ------ | ----------------------------- | ------------------------- | ---------------- |
| GET    | `/equipments`                 | Listar equipamentos       | Todos            |
| GET    | `/equipments/:id`             | Buscar equipamento        | Todos            |
| POST   | `/equipments`                 | Criar equipamento         | ADMIN            |
| PUT    | `/equipments/:id`             | Atualizar equipamento     | ADMIN            |
| DELETE | `/equipments/:id`             | Deletar equipamento       | ADMIN            |
| PATCH  | `/equipments/:id/inactivate`  | Inativar equipamento      | ADMIN            |
| PATCH  | `/equipments/:id/maintenance` | Marcar em manutenção      | ADMIN            |
| PATCH  | `/equipments/:id/available`   | Marcar como disponível    | ADMIN            |
| GET    | `/equipments/availability`    | Verificar disponibilidade | Todos            |

**Tipos de Equipamento:**

- `NOTEBOOK`
- `TABLET`
- `PROJECTOR`
- `CAMERA`
- `MICROPHONE`
- `SOUND_BOX`
- `CABLES_ADAPTERS`
- `OTHER`

**Status de Equipamento:**

- `AVAILABLE` - Disponível para reserva
- `IN_USE` - Em uso
- `MAINTENANCE` - Em manutenção

**Verificar Disponibilidade:**

```bash
curl -X GET "http://localhost:5555/api/v1/equipments/availability?startDate=2025-12-05T08:00:00.000Z&endDate=2025-12-05T12:00:00.000Z" \
  -H "Authorization: Bearer SEU_TOKEN"
```

**Resposta:**

```json
{
  "equipments": [
    {
      "equipmentId": "uuid",
      "name": "Notebook Dell",
      "type": "NOTEBOOK",
      "totalQuantity": 5,
      "availableQuantity": 3,
      "isAvailable": true
    }
  ]
}
```

### 📅 Agendamentos

| Método | Rota                       | Descrição             | Roles Permitidas       |
| ------ | -------------------------- | --------------------- | ---------------------- |
| GET    | `/schedulings`             | Listar agendamentos   | Todos                  |
| GET    | `/schedulings/:id`         | Buscar agendamento    | Todos                  |
| POST   | `/schedulings`             | Criar agendamento     | Todos                  |
| PUT    | `/schedulings/:id`         | Atualizar agendamento | Criador do agendamento |
| DELETE | `/schedulings/:id`         | Deletar agendamento   | Criador do agendamento |
| PATCH  | `/schedulings/:id/confirm` | Confirmar agendamento | STAFF, ADMIN           |
| PATCH  | `/schedulings/:id/cancel`  | Cancelar agendamento  | STAFF, ADMIN           |

**Status de Agendamento:**

- `SCHEDULED` - Agendamento criado (aguardando confirmação)
- `CONFIRMED` - Confirmado pela administração
- `COMPLETED` - Concluído (equipamento devolvido)
- `CANCELLED` - Cancelado

**Criar Agendamento:**

```bash
curl -X POST http://localhost:5555/api/v1/schedulings \
  -H "Authorization: Bearer SEU_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "equipmentId": "uuid-do-equipamento",
    "startDate": "2025-12-10T08:00:00.000Z",
    "endDate": "2025-12-10T12:00:00.000Z",
    "quantity": 2,
    "notes": "Aula prática de programação"
  }'
```

**Validações Automáticas:**

- ✅ Não permite datas passadas
- ✅ Valida quantidade disponível (previne conflitos)
- ✅ Data final deve ser maior que inicial
- ✅ Equipamento deve estar ativo

### 📊 Dashboard

| Método | Rota               | Descrição           | Roles Permitidas |
| ------ | ------------------ | ------------------- | ---------------- |
| GET    | `/dashboard/stats` | Estatísticas gerais | Todos            |

**Resposta:**

```json
{
  "stats": {
    "totalEquipment": 34,
    "availableEquipment": 32,
    "equipmentInUse": 0,
    "equipmentInMaintenance": 2,
    "totalSchedulings": 12,
    "activeSchedulings": 8,
    "completedSchedulings": 3,
    "cancelledSchedulings": 1,
    "totalUsers": 5,
    "activeUsers": 5,
    "usageRate": 66.67
  },
  "recentSchedulings": [...]
}
```

### 🏥 Health Check

| Método | Rota      | Descrição     | Auth |
| ------ | --------- | ------------- | ---- |
| GET    | `/health` | Status da API | Não  |

## 🔐 Autenticação e Autorização

### JWT Token

Todos os endpoints (exceto `/login` e `/health`) requerem autenticação via Bearer Token:

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Roles (Papéis)

O sistema possui 3 níveis de acesso:

**ADMIN (Administrador/Coordenador)**

- Acesso completo ao sistema
- Gerencia usuários
- Gerencia equipamentos
- Confirma e cancela agendamentos

**STAFF (Secretária)**

- Confirma e cancela agendamentos
- Visualiza tudo
- Não pode gerenciar usuários/equipamentos

**TEACHER (Professor)**

- Cria agendamentos
- Edita e deleta próprios agendamentos
- Visualiza equipamentos e agendamentos

## 🎯 Regras de Negócio

### Equipamentos

1. **Quantidade:** Cada equipamento possui quantidade definida
2. **Status:** AVAILABLE, IN_USE ou MAINTENANCE
3. **Soft Delete:** Equipamentos são inativados, não deletados
4. **Validação:** Apenas ADMIN pode criar/editar/deletar

### Agendamentos

1. **Validação de Data:** Não permite agendamentos no passado
2. **Validação de Quantidade:** Verifica disponibilidade real
3. **Conflitos:** Sistema previne double-booking
4. **Cálculo de Disponibilidade:**
   - `Disponível = Quantidade Total - Soma de Agendamentos Conflitantes`
5. **Workflow:**
   - Criado → `SCHEDULED`
   - Staff/Admin confirma → `CONFIRMED`
   - Após uso → `COMPLETED`
   - Se cancelado → `CANCELLED`

### Usuários

1. **Senha:** Hash com bcrypt (8 rounds)
2. **Email:** Único no sistema
3. **Soft Delete:** Usuários são inativados via flag `isActive`
4. **Roles:** Apenas ADMIN pode alterar roles

## 🧪 Testes

```bash
# Testes unitários
npm run test

# Testes E2E
npm run test:e2e

# Coverage
npm run test:cov
```

## 📝 Scripts Disponíveis

```bash
# Desenvolvimento
npm run dev              # Inicia servidor em modo watch
npm run start           # Inicia servidor normal

# Build
npm run build           # Compila TypeScript
npm run start:prod      # Inicia servidor em produção

# Database
npm run prisma:studio   # Abre Prisma Studio (GUI)
npm run seed            # Popula banco com dados de exemplo
npx prisma migrate dev  # Cria nova migration

# Testes
npm run test            # Testes unitários
npm run test:e2e        # Testes end-to-end
npm run test:cov        # Cobertura de testes

# Linting
npm run lint            # Verifica código
npm run format          # Formata código
```

## 🐳 Docker

O projeto inclui `docker-compose.yml` para facilitar o desenvolvimento:

```bash
# Subir PostgreSQL
docker-compose up -d

# Ver logs
docker-compose logs -f

# Parar
docker-compose down

# Limpar volumes (CUIDADO!)
docker-compose down -v
```

## 🚀 Deploy

### Preparação

1. Configure as variáveis de ambiente no servidor
2. Garanta que o PostgreSQL está acessível
3. Execute as migrations: `npx prisma migrate deploy`
4. Build da aplicação: `npm run build`

### Plataformas Recomendadas

- **Heroku**: Suporta PostgreSQL e Node.js nativamente
- **Railway**: Deploy simples com Prisma
- **DigitalOcean App Platform**: Escalável
- **AWS/GCP/Azure**: Para aplicações enterprise

### Variáveis de Ambiente em Produção

```env
DATABASE_URL="postgresql://..."
JWT_SECRET="chave-super-segura-256-bits"
JWT_EXPIRES_IN="7d"
PORT=5555
NODE_ENV="production"
```

## 🔧 Troubleshooting

### Erro de conexão com banco

```bash
# Verifique se o PostgreSQL está rodando
docker-compose ps

# Teste a conexão
npx prisma db pull
```

### Erro nas migrations

```bash
# Reset do banco (CUIDADO - APAGA TUDO!)
npx prisma migrate reset

# Aplicar migrations manualmente
npx prisma migrate deploy
```

### Prisma Client desatualizado

```bash
# Regenerar cliente
npx prisma generate
```

## 📚 Recursos Adicionais

- [NestJS Documentation](https://docs.nestjs.com/)
- [Prisma Documentation](https://www.prisma.io/docs/)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [JWT.io](https://jwt.io/)
