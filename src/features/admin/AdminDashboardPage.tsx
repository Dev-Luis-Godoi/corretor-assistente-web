import { useCallback, useEffect, useState, type FormEvent } from "react";
import {
  Activity,
  BriefcaseBusiness,
  Building2,
  Clock3,
  LogOut,
  MessageCircle,
  Power,
  RefreshCw,
  Search,
  ShieldCheck,
  UserRound,
  Wifi,
} from "lucide-react";
import { BrandLogo } from "@/components/BrandLogo";
import { ApiError } from "@/shared/api/apiClient";
import { adminApi } from "./adminApi";
import type { AccountStatus, AdminOverview, PlatformAccount } from "./types";
import { useAdminAuth } from "./useAdminAuth";
import "./admin.css";

const statusLabels: Record<AccountStatus, string> = {
  TRIAL: "Em teste",
  ACTIVE: "Ativa",
  SUSPENDED: "Suspensa",
  CANCELED: "Cancelada",
};
const actionLabels: Record<string, string> = {
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
              <span>
                {accounts.length} resultado{accounts.length === 1 ? "" : "s"}
              </span>
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
    </div>
  );
}
