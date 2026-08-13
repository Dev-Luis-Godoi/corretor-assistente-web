# Segurança e LGPD

## Objetivo

Este documento descreve controles técnicos existentes e ações necessárias. Não constitui parecer jurídico nem promessa de conformidade absoluta.

## Dados tratados

- dados do corretor: nome, e-mail, credencial, preferências e eventos de sessão;
- dados de contatos: nome, telefone, e-mail e consentimento;
- dados comerciais: leads, interesses, valores, notas, atividades e tarefas;
- comunicações: conteúdo, mídia, metadados e status de mensagens;
- imóveis: endereço, descrição, preço e fotos;
- dados operacionais: logs de auditoria, IP técnico e identificadores externos.

Antes da operação comercial, defina controlador, operador, encarregado/canal de contato, bases legais, finalidades, prazos e procedimento de atendimento ao titular.

## Controles implementados

### Identidade

- senhas com bcrypt;
- JWTs distintos para corretor e administrador;
- cookies HttpOnly, Secure em produção e SameSite Lax;
- revogação por `sessionVersion`;
- redefinição por token aleatório, hash SHA-256 no banco, validade de 30 minutos e uso único;
- resposta neutra na solicitação de senha para evitar enumeração;
- rate limit em login, senha e ações sensíveis.

### Isolamento e autorização

- consultas comerciais filtradas por `organizationId`;
- papéis para proprietário/administrador da conta e administrador da plataforma;
- status suspenso/cancelado revoga sessões;
- credencial administrativa isolada da credencial de corretor.

### Integrações

- segredo no webhook Evolution com comparação segura;
- limites de taxa e corpo;
- API Evolution não deve expor chave na listagem;
- bucket privado com URLs pré-assinadas de curta validade;
- restrição de tipo, tamanho e quantidade de fotos.

### Governança de dados

- registro de auditoria para operações de privacidade;
- exportação da conta e do contato;
- consentimento do contato;
- exclusão relacionada ao contato;
- política de retenção configurável, com padrão de 730 dias;
- rotina manual para aplicar retenção.

## Lacunas prioritárias

| Prioridade | Lacuna | Ação recomendada |
| --- | --- | --- |
| Alta | Trial vencido não bloqueia acesso | Validar `trialEndsAt` no login e em toda sessão autenticada. |
| Alta | Senha temporária não exige troca | Usar convite de uso único ou `mustChangePassword`. |
| Alta | Não há páginas públicas de privacidade e termos | Publicar documentos versionados, contato e data de vigência. |
| Alta | Backup/restauração não está demonstrado no código | Ativar, testar e registrar o procedimento no provedor. |
| Média | Rate limit em memória | Migrar para storage compartilhado antes de múltiplas réplicas. |
| Média | Sem proteção CSRF explícita | Validar Origin em mutações ou adotar token CSRF conforme arquitetura. |
| Média | Sem CSP no Nginx | Definir Content-Security-Policy compatível e testá-la em report-only. |
| Média | Retenção depende de ação manual | Agendar execução, alertar falhas e auditar resultados. |
| Média | Conteúdo de mídia WhatsApp pode ficar como data URL | Evitar persistir base64; armazenar privado e aplicar retenção. |
| Média | Sem plataforma de erros/alertas | Adotar observabilidade com sanitização de PII. |

## Direitos do titular

O módulo de privacidade oferece base técnica para acesso/exportação, correção indireta, consentimento e eliminação. O processo operacional também precisa:

1. validar a identidade do solicitante;
2. registrar pedido, base legal, decisão e prazo;
3. abranger banco, storage, backups e fornecedores;
4. impedir exclusão indevida quando houver obrigação legal de retenção;
5. fornecer resposta em formato compreensível;
6. registrar exceções sem expor dados em logs.

## Fornecedores

Mantenha inventário e contrato/termos aplicáveis para Railway, Evolution API, Resend, provedor de object storage, domínio e qualquer observabilidade futura. Registre região dos dados, suboperadores, retenção e canal de incidente.

## Checklist antes de convidar usuários

- [ ] Política de privacidade e termos públicos e aceitos.
- [ ] Canal do titular e procedimento interno definidos.
- [ ] Trial e primeiro acesso corrigidos.
- [ ] Segredos únicos, fortes e fora do Git.
- [ ] Banco, Redis e Evolution apenas em rede privada.
- [ ] CORS e bucket limitados aos domínios necessários.
- [ ] Backups automáticos e restauração testada.
- [ ] Logs sem PII desnecessária, tokens ou mídia.
- [ ] Teste automatizado de isolamento entre organizações.
- [ ] Plano e responsáveis por incidente definidos.
- [ ] Retenção executada e auditada automaticamente.
- [ ] Acessos administrativos revisados.

## Resposta a incidente de dados

Ao detectar incidente, não apague evidências. Contenha o acesso, preserve logs, determine alcance e risco, rotacione credenciais e acione avaliação jurídica sobre comunicações a titulares e ANPD. Registre decisões, horários e responsáveis.
