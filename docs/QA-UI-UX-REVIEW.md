# Revisão de QA e UI/UX

**Data:** 13 de agosto de 2026

**Escopo:** frontend completo, contratos consumidos, backend e schema do repositório irmão, configuração de deploy e experiência pública em produção.

**Natureza:** auditoria; nenhuma regra de negócio foi alterada nesta revisão.

## Resumo executivo

A base do MVP é coerente, o visual público está consistente com a identidade azul do Chavora Flow e as verificações estáticas passam. O beta deve permanecer pequeno até corrigir quatro riscos altos: cadastro público quebrado, trial sem bloqueio, senha temporária permanente e contador não lido não idempotente.

Também são prioritários o limite invisível de 100 leads no pipeline, ações que aparentam funcionar no dashboard, tipografia excessivamente pequena e ausência de páginas legais públicas.

## Método

- inventário de 97 arquivos TypeScript/TSX/CSS do frontend e 110 arquivos da API/schema;
- inspeção das rotas, APIs frontend, serviços, middleware, schema e deploy;
- busca por limites fixos, polling, erros silenciados, diálogos nativos e fontes pequenas;
- lint, TypeScript, testes e build nos dois projetos;
- inspeção da produção em 1440 × 900 e 390 × 844;
- validação pública de login, recuperação e redefinição de senha.

Não havia sessão autenticada disponível no navegador de QA. Por isso, telas autenticadas foram revisadas por código, CSS e contratos, mas precisam de uma rodada E2E visual com conta descartável.

## Resultado automatizado

| Projeto | Verificação | Resultado |
| --- | --- | --- |
| Web | ESLint | aprovado |
| Web | TypeScript | aprovado |
| Web | Vitest | 5/5 testes aprovados em 2 arquivos |
| Web | Build Vite | aprovado; JS principal ~377 kB, 111 kB gzip |
| API | ESLint | aprovado |
| API | TypeScript | aprovado |
| API | Build | aprovado |
| API | Vitest | 47 testes aprovados em 15 arquivos |
| API | `app.spec.ts` | não carregou por módulo transitivo ausente do AWS SDK na instalação local |

A falha do `app.spec.ts` não foi uma asserção funcional. A árvore local do pnpm não continha um arquivo de `@smithy/core` exigido pelo AWS SDK. É necessário reinstalar com lockfile e reexecutar a suíte completa antes do release.

## Achados prioritários

### Q01 — Alta — “Solicitar acesso” termina em endpoint inexistente

**Evidência:** `LoginPage.tsx` navega para `/register`; `RegisterPage.tsx` chama `POST /auth/register`; `src/modules/auth/routes.ts` da API registra login, logout, recuperação, redefinição e sessão, mas não cadastro.

**Impacto:** o principal CTA para um novo corretor falha depois do preenchimento. Isso contradiz o modelo atual, em que o administrador cria a conta.

**Recomendação:** para o MVP, trocar o CTA por solicitação/contato ou tela explicativa. Se houver autoatendimento futuro, criar um fluxo de convite/aprovação explícito, não apenas reabrir cadastro livre.

### Q02 — Alta — Período de teste não é aplicado

**Evidência:** `trialEndsAt` é gravado na criação da conta, porém `AuthService.assertAccountAvailable` e `authMiddleware` só bloqueiam `SUSPENDED` e `CANCELED`.

**Impacto:** uma conta `TRIAL` continua ativa após a data, salvo intervenção manual.

**Recomendação:** aplicar a data no login e em cada verificação de sessão; retornar código de erro específico e tela de expiração; testar fronteiras de horário e sessões já abertas.

### Q03 — Alta — Senha temporária pode virar senha permanente

**Evidência:** a administração gera `temporaryPassword`, mas `User` não possui indicador de troca obrigatória e o login não redireciona para definição de senha.

**Impacto:** credencial compartilhada pelo administrador pode continuar válida indefinidamente.

**Recomendação:** preferir convite de uso único para definir senha. Alternativamente, adicionar `mustChangePassword`, bloquear o restante da aplicação e revogar outras sessões após a troca.

### Q04 — Alta — Reentrega do webhook pode duplicar não lidas

**Evidência:** a conversa incrementa `unreadCount` em todo evento inbound antes de `message.upsert` deduplicar pelo `externalId`.

**Impacto:** retry legítimo da Evolution pode aumentar o contador sem criar nova mensagem, reproduzindo o sintoma de conversa já lida ainda marcada.

**Recomendação:** primeiro detectar/criar a mensagem e incrementar apenas quando ela for realmente nova, na mesma transação. Adicionar teste de duas entregas idênticas.

### Q05 — Alta — Pipeline esconde leads acima de 100

**Evidência:** `PipelinePage` busca apenas `page: 1, limit: 100`; não há paginação ou carregamento incremental.

**Impacto:** como a tela de leads foi incorporada ao pipeline, oportunidades acima do limite ficam invisíveis.

**Recomendação:** endpoint agregado por etapa ou paginação por coluna/infinite scroll. Exibir total real e aviso enquanto houver itens não carregados.

### Q06 — Média — Cobertura insuficiente para os fluxos críticos

O frontend tem cinco testes utilitários e nenhum teste de componente, integração, acessibilidade ou E2E. A API possui boa cobertura unitária de módulos, mas o teste central não carregou localmente.

**Recomendação:** priorizar E2E de login/recuperação, conta expirada, isolamento, criar/mover lead, webhook duplicado, ler/responder conversa, tarefa e upload de foto.

### Q07 — Média — Dashboard contém controles decorativos

**Evidência:** a busca apenas atualiza estado local, o atalho exibido `⌘ K` não é implementado e botões como “Esta semana”, “Abrir pipeline completo” e “Abrir conversas” não executam ação.

**Impacto:** reduz confiança e cria falsa affordance.

**Recomendação:** conectar as ações ou renderizar texto sem aparência clicável. Implementar `Ctrl/⌘ K` apenas quando a busca global existir.

### Q08 — Média — Tipografia autenticada está abaixo do confortável

Foram encontradas 118 declarações CSS explícitas entre 7 e 10 px, incluindo perfil, privacidade, administração, imóveis, tarefas e pipeline.

**Impacto:** leitura difícil, acessibilidade reduzida e aparência comprimida, sobretudo em telas densas.

**Recomendação:** estabelecer escala mínima: 12 px para metadados secundários, 14 px para corpo/controles e 16 px para inputs mobile. Usar cor e espaçamento, não apenas tamanho, para hierarquia.

### Q09 — Média — Targets pequenos no login mobile

Em 390 px, “Esqueci minha senha” e “Solicitar acesso” têm cerca de 15 px de altura; o botão de mostrar senha mede aproximadamente 43 × 46 px.

**Recomendação:** garantir área interativa mínima de 44 × 44 px, mesmo que o texto visual permaneça compacto.

### Q10 — Média — Privacidade e termos não são links públicos

O rodapé do login mostra os nomes como texto. A área de privacidade existente exige autenticação.

**Impacto:** o visitante não consegue avaliar tratamento de dados e condições antes de usar o produto.

**Recomendação:** criar rotas públicas versionadas para política e termos, com contato, controlador, vigência e histórico.

### Q11 — Média — Recuperação de senha não apresenta falha de rede

`ForgotPasswordPage` usa `try/finally` sem `catch`; uma rejeição deixa o usuário na mesma tela sem explicação. O input também não declara `autocomplete="email"`.

**Recomendação:** exibir mensagem segura e opção de tentar novamente, preservando resposta neutra quanto à existência do e-mail.

### Q12 — Média — “Lembrar de mim” é cosmético

O checkbox inicia marcado, mas seu valor não é lido; o backend sempre emite cookie de sete dias.

**Recomendação:** remover o controle no MVP ou implementar duração de sessão coerente e explicar seu efeito.

### Q13 — Média — Listagens administrativas e tarefas têm limites silenciosos

- A administração não usa `meta` nem oferece paginação; a API aplica seu limite padrão.
- O seletor de leads da tarefa busca apenas os primeiros 100.
- A API de tarefas limita a consulta a 200 sem paginação exposta no frontend.

**Recomendação:** padronizar paginação, totais e busca remota nos seletores.

### Q14 — Média — Acessibilidade de modais e Kanban

Há suporte parcial a `role="dialog"`, `aria-modal` e Escape, mas sem foco inicial, armadilha/restauração de foco consistentes. Mover lead por drag and drop depende do mouse. Renomear/excluir usa `window.prompt` e `window.confirm`.

**Recomendação:** criar um componente de diálogo acessível; oferecer menu/teclado para mover cartões; substituir prompts nativos por formulários consistentes.

### Q15 — Média — Erros importantes são silenciados

Dashboard e polling de notificações/conversas ignoram algumas falhas. Um indicador pode permanecer em `—` sem explicar ou oferecer retry.

**Recomendação:** distinguir falha transitória de estado vazio, mostrar status de conexão e registrar erro sanitizado para operação.

### Q16 — Média — Polling e rate limit limitam a escala

Cada navegador consulta conversas a cada 5 s, conversa aberta a cada 3 s e notificações a cada 15 s. O rate limit da API usa `Map` local.

**Recomendação:** manter uma instância no beta; antes de escalar, usar SSE/WebSocket e rate limit compartilhado no Redis.

### Q17 — Baixa — Dependências frontend usam `latest`

O lockfile fixa a instalação atual, mas quase todas as dependências do `package.json` usam `latest`.

**Recomendação:** declarar versões/ranges revisados e atualizar com PRs controlados.

### Q18 — Baixa — Código de demonstração permanece no dashboard

Componentes e mocks antigos existem sem uso (`AssistantCard`, `TodaySchedule`, `AttentionLeadList` e `mockData.ts`).

**Recomendação:** remover depois de confirmar que não fazem parte do roadmap ou movê-los para Storybook/protótipos.

## Avaliação visual

### Pontos fortes

- marca, ícone e paleta azul consistentes no login;
- bom uso de contraste e espaço no layout público desktop;
- adaptação mobile sem overflow horizontal;
- formulário de login e recuperação com estados claros;
- cartões, sombras e superfícies seguem linguagem visual coesa;
- inputs críticos têm foco visível e labels persistentes.

### Sistema visual recomendado

- limitar a duas superfícies principais por tela;
- usar 14 px como corpo padrão e 12 px apenas para metadados;
- controles com pelo menos 40 px desktop e 44 px mobile;
- raios de 10–14 px e uma escala única de sombras;
- azul para ação/seleção, vermelho para destruição e neutros para informação;
- skeleton apenas durante primeira carga; atualização em segundo plano não deve piscar;
- todas as ações destrutivas em diálogo com objeto, consequência e confirmação.

## Plano sugerido

### Antes dos próximos usuários

1. Corrigir Q01–Q05.
2. Reinstalar dependências da API e obter suíte integral verde.
3. Executar E2E autenticado em desktop e mobile.
4. Publicar privacidade e termos.
5. Testar backup/restauração e alertas básicos.

### Durante o beta

1. Corrigir feedback de erros, paginação e ações decorativas.
2. Normalizar tipografia, targets e diálogos.
3. Adicionar E2E e acessibilidade automatizada.
4. Medir polling, webhook e crescimento do banco/bucket.

### Antes de escalar

1. SSE/WebSocket para conversas e notificações.
2. Rate limit compartilhado e fila para trabalhos externos.
3. Observabilidade, SLOs e teste de carga.
4. Retenção automática e processo LGPD operacional.

## Checklist de regressão

- [ ] Login, logout e expiração de sessão.
- [ ] Recuperação com e-mail existente, inexistente, link inválido e link usado.
- [ ] Primeiro acesso e trial expirado.
- [ ] Conta suspensa/cancelada e revogação de sessão.
- [ ] Isolamento entre duas contas em todos os módulos.
- [ ] Criar, editar e mover lead; mais de 100 leads.
- [ ] Webhook duplicado; leitura e resposta sem contador residual.
- [ ] Conectar e remover WhatsApp.
- [ ] Criar/concluir/excluir tarefa em agenda mobile.
- [ ] Criar imóvel, formatar valor, enviar, ordenar e remover fotos.
- [ ] Exportar/excluir contato e aplicar retenção.
- [ ] Navegação completa por teclado, foco de modal e 200% de zoom.
- [ ] 390 px, tablet, 1440 px e ausência de overflow.
