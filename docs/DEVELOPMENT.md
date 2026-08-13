# Desenvolvimento

## Pré-requisitos

- Windows, macOS ou Linux.
- Node.js 22+ e Corepack.
- pnpm 10.17.1.
- Docker com Compose.
- Git.

Estrutura recomendada:

```text
corretor-assistente/
├── corretor-assistente-web/
└── corretor-assistente-api/
```

## Preparação

### Web

```powershell
cd corretor-assistente-web
corepack enable
pnpm install --frozen-lockfile
Copy-Item .env.example .env
pnpm dev
```

`.env` local:

```env
VITE_API_URL=/api
```

### API e serviços

```powershell
cd ..\corretor-assistente-api
Copy-Item .env.example .env
docker compose up -d
pnpm install --frozen-lockfile
pnpm prisma:generate
pnpm prisma:deploy
pnpm dev
```

O Compose local inicia PostgreSQL da aplicação, PostgreSQL da Evolution, Redis e Evolution API. As portas de dados ficam vinculadas a `127.0.0.1`.

## Segredos locais

Gere valores diferentes para cada finalidade. Exemplo em PowerShell:

```powershell
$bytes = New-Object byte[] 32
[Security.Cryptography.RandomNumberGenerator]::Fill($bytes)
[Convert]::ToHexString($bytes).ToLowerInvariant()
```

Nunca reutilize JWT, senha do banco, chave da Evolution ou segredo de webhook.

## Variáveis da API

| Grupo | Variáveis |
| --- | --- |
| Processo | `NODE_ENV`, `HOST`, `PORT`, `LOG_LEVEL` |
| Aplicação | `APP_URL`, `PUBLIC_API_URL`, `CORS_ORIGIN` |
| Banco | `APP_DATABASE_PASSWORD`, `DATABASE_URL` |
| Autenticação | `JWT_SECRET`, `ADMIN_JWT_SECRET` |
| Evolution | `EVOLUTION_API_URL`, `EVOLUTION_API_KEY`, `EVOLUTION_WEBHOOK_SECRET`, `EVOLUTION_DATABASE_PASSWORD` |
| Resend | `RESEND_API_KEY`, `RESEND_FROM_EMAIL` |
| Storage S3 | `OBJECT_STORAGE_ENDPOINT`, `OBJECT_STORAGE_REGION`, `OBJECT_STORAGE_ACCESS_KEY_ID`, `OBJECT_STORAGE_SECRET_ACCESS_KEY`, `OBJECT_STORAGE_BUCKET`, `OBJECT_STORAGE_FORCE_PATH_STYLE`, `OBJECT_STORAGE_PUBLIC_BASE_URL` |
| R2 legado | `R2_ACCOUNT_ID`, `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY`, `R2_BUCKET`, `R2_PUBLIC_BASE_URL` |

As configurações de object storage e R2 são alternativas. Se uma configuração parcial for fornecida, a API falha no startup deliberadamente.

## Banco e migrations

Em desenvolvimento, depois de alterar `prisma/schema.prisma`:

```powershell
pnpm prisma:format
pnpm prisma:migrate
pnpm prisma:generate
```

Em produção:

```powershell
pnpm prisma:deploy
```

Não edite migrations já aplicadas. Crie uma nova migration e teste tanto atualização de uma base existente quanto criação de uma base vazia.

Para inspeção local:

```powershell
pnpm prisma:studio
```

O banco de produção não deve publicar a porta nem compartilhar senha com o navegador. A inspeção deve ocorrer por túnel autenticado ou ferramenta do provedor.

## Contas administrativas

A API possui o script:

```powershell
pnpm platform-admin:create
```

Use-o apenas em ambiente controlado. Não guarde a senha no histórico do shell, no código ou na documentação.

## Qualidade

### Frontend

```powershell
pnpm type-check
pnpm lint
pnpm test
pnpm build
```

### API

```powershell
pnpm typecheck
pnpm lint
pnpm format:check
pnpm test
pnpm build
```

Todo fluxo crítico deve ter, no mínimo:

- teste de sucesso e falha;
- teste de autorização e isolamento entre contas;
- estado de carregamento, erro e vazio no frontend;
- verificação mobile e por teclado;
- teste para reentrega quando houver webhook.

## Convenções

- Código e nomes técnicos em inglês; interface e documentação do produto em português.
- Componentes e páginas em PascalCase; hooks com prefixo `use`.
- API frontend por módulo em arquivo `*Api.ts`.
- Controllers não acessam Prisma diretamente.
- Não aceite `organizationId` enviado pelo cliente como autorização.
- Use transações quando a mudança envolver mais de uma entidade.
- Preserve mensagens de erro compreensíveis sem expor detalhes internos.

## Diagnóstico comum

### Vite abre em outra porta

Se `5173` estiver ocupada, encerre a instância anterior antes de iniciar outra. O CORS e os links locais assumem `5173`.

### API não conecta no banco

Confira `docker compose ps`, a saúde do PostgreSQL e se a senha em `DATABASE_URL` é idêntica a `APP_DATABASE_PASSWORD`.

### Evolution não conecta

Confira a saúde do PostgreSQL e Redis da Evolution, `EVOLUTION_API_URL`, a chave e o webhook configurado. Não exponha `8080` publicamente em produção sem proteção.

### Testes falham ao importar AWS SDK

Na revisão de 13/08/2026, um arquivo de testes não carregou por módulo transitivo ausente em `@smithy/core`, embora lint, tipos, build e 47 testes tenham passado. Faça uma instalação limpa com o lockfile, aprove os build scripts necessários do pnpm e reexecute a suíte completa antes de atribuir a falha ao código.

### Fotos não enviam

Valide as credenciais S3, CORS do bucket, limite de 6 MiB, MIME permitido e relógio do sistema. Use `pnpm storage:cors` na API quando apropriado.

## Antes de abrir um pull request

1. Atualize documentação e `.env.example` se o contrato mudou.
2. Rode todas as verificações dos dois repositórios afetados.
3. Verifique desktop, 390 px e teclado nos fluxos alterados.
4. Confirme que nenhum segredo entrou no diff.
5. Inclua migration quando houver mudança de schema.
6. Descreva plano de rollback para alterações de infraestrutura ou dados.
