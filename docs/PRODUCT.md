# Produto e escopo do MVP

## Proposta

O Chavora Flow é uma assistência comercial para corretores de imóveis autônomos. Seu objetivo é reduzir o trabalho disperso entre planilhas, WhatsApp, agenda e galerias de fotos, sem assumir o peso de um CRM para imobiliárias.

## Perfis

### Corretor

É o usuário principal. Visualiza exclusivamente os dados de sua conta e pode:

- organizar oportunidades no pipeline;
- atender conversas conectadas ao WhatsApp;
- criar tarefas e acompanhar a agenda;
- cadastrar imóveis e fotos;
- configurar modelos, automações e preferências;
- exercer rotinas de privacidade permitidas ao administrador da conta.

### Administrador da plataforma

É o operador do Chavora Flow. Usa autenticação e cookie separados para:

- criar contas de corretores;
- definir período de teste e status da conta;
- suspender, reativar ou cancelar acesso;
- revogar sessões;
- acompanhar indicadores agregados da plataforma.

O painel administrativo não representa uma imobiliária e não deve compartilhar dados comerciais entre corretores.

## Jornada principal

1. O administrador cria a conta e entrega um acesso temporário ao corretor.
2. O corretor entra, conecta seu WhatsApp e configura o funil.
3. Conversas e leads passam a ser organizados no pipeline.
4. Próximos contatos são registrados como tarefas na agenda.
5. Imóveis relevantes são cadastrados com dados essenciais e fotos.
6. Notificações e automações ajudam a manter o acompanhamento.

## Módulos e estado atual

| Módulo | Escopo atual | Estado |
| --- | --- | --- |
| Autenticação | Login, logout, recuperação e redefinição de senha | MVP funcional |
| Administração | Criação e controle de contas | MVP funcional |
| Dashboard | Indicadores, pipeline resumido e conversas recentes | MVP funcional, com ações decorativas a remover/conectar |
| Pipeline | Kanban, etapas, lead, movimentação e detalhes | MVP funcional |
| Conversas | Lista, mensagens, leitura, envio e status | MVP funcional |
| WhatsApp | Conta por corretor via Evolution API | MVP funcional |
| Tarefas | Agenda visual, prioridades e status | MVP funcional |
| Automações | Regras e modelos de WhatsApp | MVP funcional; execução deve ser validada por regra |
| Imóveis | CRUD, filtros, fotos e capa | MVP funcional |
| Perfil e configurações | Dados pessoais, senha, organização e preferência visual | MVP funcional |
| Privacidade | Consentimento, exportação, retenção, exclusão e auditoria | Base técnica funcional |
| E-mail | Recuperação de senha via Resend | Em espera até validar domínio/remetente operacional |

## Fora do MVP

- contas de imobiliárias e equipes;
- múltiplos corretores dentro da mesma conta;
- cobrança e assinatura automática;
- portal público de imóveis;
- aplicativos móveis nativos;
- automação por e-mail;
- distribuição automática de leads;
- relatórios avançados e BI;
- integrações com portais imobiliários.

## Métricas sugeridas para a validação

- corretores que concluem a conexão do WhatsApp;
- leads criados por semana;
- percentual de leads com próxima tarefa;
- conversas respondidas no mesmo dia;
- oportunidades movidas no pipeline;
- usuários ativos semanalmente;
- falhas de envio e webhooks reprocessados;
- feedback qualitativo por fluxo.

## Critérios para encerrar o beta privado

- nenhum vazamento entre contas em testes automatizados e E2E;
- criação e primeiro acesso sem intervenção técnica;
- vencimento do trial efetivamente aplicado;
- webhook idempotente para mensagem e contador de não lidas;
- backup e restauração do banco testados;
- política de privacidade e termos disponíveis publicamente;
- monitoramento de erros e alertas operacionais;
- fluxos críticos utilizáveis por teclado e celular.

## Glossário

- **Conta:** limite de isolamento dos dados de um corretor; tecnicamente é uma `Organization`.
- **Lead:** oportunidade comercial associada a um contato.
- **Etapa:** coluna do funil onde um lead se encontra.
- **Conversa:** atendimento vinculado a um contato e a uma conta WhatsApp.
- **Conta WhatsApp:** instância isolada na Evolution API pertencente a uma conta do Chavora Flow.
- **Administrador da plataforma:** operador global, separado do usuário corretor.
