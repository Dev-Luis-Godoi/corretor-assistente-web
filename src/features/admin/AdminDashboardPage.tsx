import { useCallback, useEffect, useState, type FormEvent } from "react";
import {
  Activity,
  BriefcaseBusiness,
  Building2,
  Check,
  Clock3,
  Copy,
  LogOut,
  MessageCircle,
  Power,
  Plus,
  RefreshCw,
  Search,
  ShieldCheck,
  UserRound,
  Wifi,
  X,
} from "lucide-react";
import { BrandLogo } from "@/components/BrandLogo";
import { ApiError } from "@/shared/api/apiClient";
import { adminApi } from "./adminApi";
import type {
  AccountStatus,
  AdminOverview,
  BrokerCredentials,
  CreatePlatformAccountInput,
  PlatformAccount,
} from "./types";
import { useAdminAuth } from "./useAdminAuth";
import "./admin.css";

const statusLabels: Record<AccountStatus, string> = {
  TRIAL: "Em teste",
  ACTIVE: "Ativa",
  SUSPENDED: "Suspensa",
  CANCELED: "Cancelada",
};
const actionLabels: Record<string, string> = {
  ACCOUNT_CREATED: "Conta de corretor criada",
  PLATFORM_ADMIN_LOGIN: "Acesso administrativo",
  ACCOUNT_STATUS_UPDATED: "Status da conta alterado",
  ACCOUNT_SESSIONS_REVOKED: "Sessões encerradas",
};
const dateTime = new Intl.DateTimeFormat("pt-BR", {
  dateStyle: "short",
  timeStyle: "short",
});

export function AdminDashboardPage() {
  const { admin, logout } = useAdminAuth();
  const [overview, setOverview] = useState<AdminOverview | null>(null);
  const [accounts, setAccounts] = useState<PlatformAccount[]>([]);
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<AccountStatus | "">("");
  const [loading, setLoading] = useState(true);
  const [actionId, setActionId] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [showCreateAccount, setShowCreateAccount] = useState(false);
  const [creatingAccount, setCreatingAccount] = useState(false);
  const [createdCredentials, setCreatedCredentials] =
    useState<BrokerCredentials | null>(null);
  const [credentialsCopied, setCredentialsCopied] = useState(false);
  const [createInput, setCreateInput] = useState<CreatePlatformAccountInput>({
    name: "",
    email: "",
    status: "TRIAL",
    trialDays: 14,
  });
  const load = useCallback(() => {
    Promise.all([
      adminApi.overview(),
      adminApi.accounts({
        search: search || undefined,
        status: status || undefined,
      }),
    ])
      .then(([summary, result]) => {
        setOverview(summary);
        setAccounts(result.data);
        setError("");
      })
      .catch((caught) =>
        setError(
          caught instanceof ApiError
            ? caught.message
            : "Não foi possível carregar a administração.",
        ),
      )
      .finally(() => setLoading(false));
  }, [search, status]);
  useEffect(() => {
    void load();
  }, [load]);
  const submit = (event: FormEvent) => {
    event.preventDefault();
    setSearch(searchInput.trim());
  };
  const changeStatus = async (
    account: PlatformAccount,
    next: AccountStatus,
  ) => {
    const verb = next === "SUSPENDED" ? "suspender" : "reativar";
    if (
      !window.confirm(
        `Deseja ${verb} o acesso de ${account.broker?.name ?? "este corretor"}?`,
      )
    )
      return;
    setActionId(account.id);
    setMessage("");
    try {
      await adminApi.updateStatus(account.id, next);
      setMessage(
        next === "SUSPENDED"
          ? "Acesso suspenso e sessões encerradas."
          : "Conta reativada com sucesso.",
      );
      load();
    } catch (caught) {
      setError(
        caught instanceof ApiError
          ? caught.message
          : "Não foi possível alterar a conta.",
      );
    } finally {
      setActionId("");
    }
  };
  const revoke = async (account: PlatformAccount) => {
    if (
      !window.confirm(
        `Encerrar todas as sessões de ${account.broker?.name ?? "este corretor"}?`,
      )
    )
      return;
    setActionId(account.id);
    setMessage("");
    try {
      await adminApi.revokeSessions(account.id);
      setMessage("Sessões encerradas. O corretor precisará entrar novamente.");
    } catch (caught) {
      setError(
        caught instanceof ApiError
          ? caught.message
          : "Não foi possível encerrar as sessões.",
      );
    } finally {
      setActionId("");
    }
  };
  const createAccount = async (event: FormEvent) => {
    event.preventDefault();
    setCreatingAccount(true);
    setError("");
    try {
      const result = await adminApi.createAccount(createInput);
      setCreatedCredentials(result.credentials);
      setShowCreateAccount(false);
      setCreateInput({ name: "", email: "", status: "TRIAL", trialDays: 14 });
      setMessage("Corretor criado. Copie e envie as credenciais por um canal seguro.");
      load();
    } catch (caught) {
      setError(
        caught instanceof ApiError
          ? caught.message
          : "Não foi possível criar o corretor.",
      );
    } finally {
      setCreatingAccount(false);
    }
  };
  const copyCredentials = async () => {
    if (!createdCredentials) return;
    await navigator.clipboard.writeText(
      `E-mail: ${createdCredentials.email}\nSenha temporária: ${createdCredentials.temporaryPassword}`,
    );
    setCredentialsCopied(true);
  };
  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <BrandLogo inverse />
        <div>
          <span>ADMINISTRAÇÃO</span>
          <strong>Operação</strong>
          <small>Controle interno da Chavora</small>
        </div>
        <nav>
          <a className="active" href="#overview">
            <Activity size={16} />
            Visão geral
          </a>
          <a href="#accounts">
            <UserRound size={16} />
            Corretores
          </a>
        </nav>
        <footer>
          <span>{admin?.name.slice(0, 2).toUpperCase()}</span>
          <div>
            <strong>{admin?.name}</strong>
            <small>{admin?.email}</small>
          </div>
          <button
            onClick={() => void logout()}
            aria-label="Sair da administração"
          >
            <LogOut size={16} />
          </button>
        </footer>
      </aside>
      <main className="admin-main">
        <header>
          <div>
            <span className="admin-kicker">
              <ShieldCheck size={14} />
              AMBIENTE RESTRITO
            </span>
            <h1>Administração da plataforma</h1>
            <p>Contas, acessos e saúde operacional da Chavora Flow.</p>
          </div>
          <button className="admin-refresh" onClick={load}>
            <RefreshCw size={15} />
            Atualizar
          </button>
        </header>
        <div className="admin-content">
          {error && (
            <p className="admin-feedback error" role="alert">
              {error}
              <button onClick={() => setError("")}>×</button>
            </p>
          )}
          {message && (
            <p className="admin-feedback success" role="status">
              {message}
              <button onClick={() => setMessage("")}>×</button>
            </p>
          )}
          <section className="admin-stats" id="overview">
            <article>
              <span>
                <Building2 size={18} />
              </span>
              <div>
                <strong>{overview?.accounts.total ?? "—"}</strong>
                <small>Contas cadastradas</small>
              </div>
              <em>{overview?.accounts.trial ?? 0} em teste</em>
            </article>
            <article>
              <span>
                <UserRound size={18} />
              </span>
              <div>
                <strong>{overview?.brokers ?? "—"}</strong>
                <small>Corretores</small>
              </div>
              <em>{overview?.accounts.active ?? 0} ativos</em>
            </article>
            <article>
              <span>
                <BriefcaseBusiness size={18} />
              </span>
              <div>
                <strong>{overview?.leads ?? "—"}</strong>
                <small>Leads gerenciados</small>
              </div>
              <em>Dados agregados</em>
            </article>
            <article>
              <span>
                <Wifi size={18} />
              </span>
              <div>
                <strong>{overview?.connectedWhatsapp ?? "—"}</strong>
                <small>WhatsApps conectados</small>
              </div>
              <em>{overview?.conversations ?? 0} conversas</em>
            </article>
          </section>
          <section className="admin-panel" id="accounts">
            <header>
              <div>
                <h2>Corretores e acessos</h2>
                <p>
                  Identidade e métricas operacionais, sem acesso ao conteúdo dos
                  clientes.
                </p>
              </div>
              <div className="admin-panel-actions">
                <span>
                  {accounts.length} resultado{accounts.length === 1 ? "" : "s"}
                </span>
                <button type="button" onClick={() => setShowCreateAccount(true)}>
                  <Plus size={14} /> Novo corretor
                </button>
              </div>
            </header>
            <form className="admin-filters" onSubmit={submit}>
              <label>
                <Search size={15} />
                <input
                  value={searchInput}
                  onChange={(event) => setSearchInput(event.target.value)}
                  placeholder="Buscar por nome ou e-mail..."
                />
              </label>
              <select
                aria-label="Status da conta"
                value={status}
                onChange={(event) =>
                  setStatus(event.target.value as AccountStatus | "")
                }
              >
                <option value="">Todos os status</option>
                <option value="TRIAL">Em teste</option>
                <option value="ACTIVE">Ativas</option>
                <option value="SUSPENDED">Suspensas</option>
                <option value="CANCELED">Canceladas</option>
              </select>
              <button>Buscar</button>
            </form>
            <div className="admin-account-list">
              <div className="admin-account-head">
                <span>Corretor</span>
                <span>Status</span>
                <span>Uso do espaço</span>
                <span>Integração</span>
                <span>Último acesso</span>
                <span>Ações</span>
              </div>
              {loading ? (
                <div className="admin-list-empty">Carregando contas...</div>
              ) : accounts.length === 0 ? (
                <div className="admin-list-empty">
                  Nenhuma conta encontrada.
                </div>
              ) : (
                accounts.map((account) => (
                  <article key={account.id}>
                    <div className="admin-broker">
                      <span>
                        {(account.broker?.name ?? "--")
                          .slice(0, 2)
                          .toUpperCase()}
                      </span>
                      <div>
                        <strong>
                          {account.broker?.name ?? "Sem corretor"}
                        </strong>
                        <small>{account.broker?.email ?? account.name}</small>
                      </div>
                    </div>
                    <div>
                      <span
                        className={`admin-status ${account.status.toLowerCase()}`}
                      >
                        {statusLabels[account.status]}
                      </span>
                      {account.status === "TRIAL" && account.trialEndsAt && (
                        <small>
                          até{" "}
                          {new Date(account.trialEndsAt).toLocaleDateString(
                            "pt-BR",
                          )}
                        </small>
                      )}
                    </div>
                    <div className="admin-usage">
                      <span>
                        <BriefcaseBusiness size={13} />
                        {account._count.leads} leads
                      </span>
                      <span>
                        <MessageCircle size={13} />
                        {account._count.conversations} conversas
                      </span>
                    </div>
                    <div className="admin-integration">
                      {account.whatsappAccounts.some(
                        (item) => item.isConnected,
                      ) ? (
                        <>
                          <Wifi size={14} />
                          <span>Conectado</span>
                        </>
                      ) : (
                        <>
                          <Power size={14} />
                          <span>Desconectado</span>
                        </>
                      )}
                    </div>
                    <div className="admin-last-access">
                      <Clock3 size={13} />
                      {account.broker?.lastLoginAt
                        ? dateTime.format(new Date(account.broker.lastLoginAt))
                        : "Nunca acessou"}
                    </div>
                    <div className="admin-actions">
                      <button
                        disabled={actionId === account.id}
                        onClick={() => void revoke(account)}
                        title="Encerrar sessões"
                      >
                        <RefreshCw size={14} />
                      </button>
                      {account.status === "SUSPENDED" ? (
                        <button
                          className="activate"
                          disabled={actionId === account.id}
                          onClick={() => void changeStatus(account, "ACTIVE")}
                        >
                          Reativar
                        </button>
                      ) : (
                        account.status !== "CANCELED" && (
                          <button
                            className="suspend"
                            disabled={actionId === account.id}
                            onClick={() =>
                              void changeStatus(account, "SUSPENDED")
                            }
                          >
                            Suspender
                          </button>
                        )
                      )}
                    </div>
                  </article>
                ))
              )}
            </div>
          </section>
          <section className="admin-panel admin-audit">
            <header>
              <div>
                <h2>Atividade administrativa</h2>
                <p>
                  Ações recentes registradas para segurança e rastreabilidade.
                </p>
              </div>
            </header>
            <div>
              {overview?.recentActivity.length ? (
                overview.recentActivity.map((item) => (
                  <article key={item.id}>
                    <span />
                    <div>
                      <strong>
                        {actionLabels[item.action] ?? item.action}
                      </strong>
                      <small>
                        {item.admin.name}
                        {item.targetOrganization
                          ? ` · ${item.targetOrganization.name}`
                          : ""}
                      </small>
                    </div>
                    <time>{dateTime.format(new Date(item.createdAt))}</time>
                  </article>
                ))
              ) : (
                <p>Nenhuma atividade administrativa registrada.</p>
              )}
            </div>
          </section>
        </div>
      </main>
      {showCreateAccount && (
        <div className="admin-modal-backdrop">
          <section className="admin-modal" role="dialog" aria-modal="true" aria-labelledby="create-account-title">
            <header>
              <div><span><UserRound size={15} /></span><div><h2 id="create-account-title">Novo corretor</h2><p>Crie um espaço individual com pipeline pronto para uso.</p></div></div>
              <button type="button" aria-label="Fechar" onClick={() => setShowCreateAccount(false)}><X size={17} /></button>
            </header>
            <form onSubmit={createAccount}>
              <label>Nome completo<input autoFocus required minLength={2} maxLength={120} value={createInput.name} onChange={(event) => setCreateInput((current) => ({ ...current, name: event.target.value }))} placeholder="Nome do corretor" /></label>
              <label>E-mail de acesso<input required type="email" value={createInput.email} onChange={(event) => setCreateInput((current) => ({ ...current, email: event.target.value }))} placeholder="corretor@email.com" /></label>
              <div className="admin-modal-grid">
                <label>Tipo de acesso<select value={createInput.status} onChange={(event) => setCreateInput((current) => ({ ...current, status: event.target.value as "TRIAL" | "ACTIVE" }))}><option value="TRIAL">Período de teste</option><option value="ACTIVE">Conta ativa</option></select></label>
                {createInput.status === "TRIAL" && <label>Dias de teste<input required type="number" min={1} max={90} value={createInput.trialDays} onChange={(event) => setCreateInput((current) => ({ ...current, trialDays: Number(event.target.value) }))} /></label>}
              </div>
              <p className="admin-modal-note">A senha será gerada automaticamente e exibida uma única vez após a criação.</p>
              <footer><button type="button" onClick={() => setShowCreateAccount(false)}>Cancelar</button><button type="submit" className="primary" disabled={creatingAccount}>{creatingAccount ? "Criando..." : "Criar corretor"}</button></footer>
            </form>
          </section>
        </div>
      )}
      {createdCredentials && (
        <div className="admin-modal-backdrop">
          <section className="admin-modal admin-credentials" role="dialog" aria-modal="true" aria-labelledby="credentials-title">
            <header><div><span><Check size={16} /></span><div><h2 id="credentials-title">Corretor criado</h2><p>Estas credenciais não serão exibidas novamente.</p></div></div></header>
            <div className="admin-credentials-box"><label>E-mail</label><strong>{createdCredentials.email}</strong><label>Senha temporária</label><code>{createdCredentials.temporaryPassword}</code></div>
            <p className="admin-modal-note">Envie por um canal seguro e oriente o corretor a alterar a senha pelo fluxo “Esqueci minha senha”.</p>
            <footer><button type="button" className="primary" onClick={() => void copyCredentials()}>{credentialsCopied ? <Check size={14} /> : <Copy size={14} />}{credentialsCopied ? "Copiado" : "Copiar credenciais"}</button><button type="button" onClick={() => { setCreatedCredentials(null); setCredentialsCopied(false); }}>Concluir</button></footer>
          </section>
        </div>
      )}
    </div>
  );
}
