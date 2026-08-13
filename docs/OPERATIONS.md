# Operação e produção

## Topologia atual

| Serviço | Responsabilidade | Persistência |
| --- | --- | --- |
| Web | Nginx, SPA React e proxy `/api` | imagem imutável |
| API | Fastify, Prisma e integrações | sem estado local |
| PostgreSQL | dados do Chavora Flow | volume gerenciado |
| Evolution API | sessão e transporte do WhatsApp | banco/volume próprios |
| Redis | cache e estado auxiliar da Evolution | volume gerenciado |
| Object Storage | fotos privadas de imóveis | bucket S3 compatível |
| Resend | e-mail transacional | externo |

O domínio oficial é `https://www.chavoraflow.com.br`. A URL antiga do serviço web redireciona para o domínio oficial. O domínio sem `www` não deve ser divulgado até estar configurado para redirecionamento.

## Health checks e limites HTTP

- Web: `GET /healthz` retorna `200 ok`.
- API: `GET /health` retorna status e timestamp.
- Railway aguarda até 120 segundos pelo health check do deploy.
- Nginx: 10 s para conectar à API e 90 s para leitura da resposta.
- Corpo no proxy: até 8 MiB.
- Webhook Evolution: até 256 KiB.
- Envio de mídia em conversa: até aproximadamente 8 MB no corpo da API.

O cliente web não possui timeout próprio; chamadas lentas permanecem abertas até o proxy, navegador ou rede encerrar.

## Deploy seguro

### Web

1. Rode lint, tipos, testes e build.
2. Confirme `VITE_API_URL=/api` no build de produção.
3. Faça deploy do commit aprovado.
4. Verifique `/healthz`, `/login`, recuperação de senha e uma rota SPA acessada diretamente.
5. Verifique uma chamada `/api/health` pelo mesmo domínio.

### API

1. Faça backup antes de migrations destrutivas.
2. Rode lint, tipos, testes e build.
3. Revise migrations pendentes.
4. Aplique `prisma migrate deploy` uma única vez no processo de release.
5. Faça deploy e verifique `/health`.
6. Teste login, leitura multi-tenant, webhook, envio e storage.

Não use `prisma migrate dev` em produção.

## Variáveis e segredos

- Configure valores no Railway, nunca na imagem ou no Git.
- Use valores diferentes por ambiente e por finalidade.
- Restrinja a leitura das variáveis aos operadores necessários.
- Rotacione imediatamente um segredo exposto em terminal, screenshot, log ou commit.
- Depois de trocar JWT, sessões existentes deixam de funcionar; planeje a comunicação.
- Ao trocar o segredo do webhook, atualize a Evolution API e a API de forma coordenada.

Checklist mínimo:

- `NODE_ENV=production`;
- `APP_URL=https://www.chavoraflow.com.br`;
- CORS apenas para origens oficiais;
- dois segredos JWT distintos com alta entropia;
- banco e Redis acessíveis apenas pela rede privada;
- bucket privado e CORS restrito ao domínio web;
- remetente do Resend verificado;
- Evolution sem telemetria e sem exposição de chave na listagem de instâncias.

## Banco, backup e restauração

O banco é o ativo mais crítico. Antes de ampliar o beta:

1. Ative backups automáticos no provedor.
2. Defina retenção diária e mensal compatível com o plano e a LGPD.
3. Faça uma restauração em banco separado pelo menos mensalmente.
4. Registre tempo de restauração e ponto recuperável.
5. Exporte também a configuração do serviço e inventário de migrations.

Backup não testado não é considerado recuperável. Fotos devem ter versionamento ou política de recuperação no bucket quando o provedor permitir.

## Monitoramento e alertas

Métricas mínimas:

- disponibilidade e latência p50/p95/p99;
- respostas 4xx, 5xx e 429 por rota;
- uso de CPU, memória, volume e conexões do banco;
- falhas do Resend e da Evolution API;
- idade desde o último webhook por conta conectada;
- duplicidades e mensagens sem conversa;
- crescimento de mensagens, fotos e logs de auditoria;
- logins falhos e suspensões.

Alertas mínimos:

- health check falhando por dois minutos;
- volume ou banco acima de 80%;
- sequência de erros 5xx;
- webhook sem tráfego inesperadamente;
- falha de backup;
- storage indisponível.

Logs devem carregar IDs técnicos e correlação, não senha, token, chave, conteúdo completo de mensagem ou arquivo em base64.

## Capacidade do MVP

Para o beta inicial com poucos corretores, uma instância de cada serviço é adequada. Os limites funcionais atuais exigem atenção antes de crescer:

- pipeline carrega somente os primeiros 100 leads;
- conversas carregam 50 itens e a conversa aberta, 100 mensagens;
- tarefas não têm paginação no frontend;
- polling de cada navegador gera chamadas frequentes;
- rate limit em memória perde estado no redeploy e não coordena réplicas;
- mídia de conversa em base64 aumenta uso de memória e tráfego.

Não há um número universal de usuários suportados: volume de mensagens e fotos pesa mais que quantidade de cadastros. Faça teste de carga com perfil real antes de passar de beta privado para divulgação.

## Incidentes

### Suspeita de vazamento

1. Preserve evidências e restrinja acesso.
2. Rotacione credenciais afetadas e revogue sessões.
3. Identifique organizações, dados e período envolvidos.
4. Acione responsável de privacidade/jurídico para avaliar comunicação e ANPD.
5. Corrija, teste isolamento e documente a causa.

### Evolution desconectada

1. Verifique saúde de Evolution, Redis e banco.
2. Não apague instância ou volume como primeira ação.
3. Confirme webhook e chave sem registrá-los em log.
4. Solicite novo QR apenas quando a sessão realmente não for recuperável.

### Deploy com regressão

1. Interrompa novos deploys.
2. Reverta a aplicação para imagem anterior quando o schema for compatível.
3. Não reverta migration destrutiva sem plano de dados.
4. Faça smoke test e registre o incidente.

## Rotina operacional

### Diária

- saúde dos serviços, erros, storage e integrações;
- contas WhatsApp desconectadas;
- falhas de e-mail e recuperação de senha.

### Semanal

- custos, crescimento do banco/bucket e dependências com alerta de segurança;
- contas em trial próximas do vencimento;
- revisão de acessos administrativos.

### Mensal

- teste de restauração;
- rotação planejada de chaves quando aplicável;
- aplicação da política de retenção;
- revisão de auditoria, termos e documentação.
