import { useEffect, useState, type FormEvent } from "react";
import {
  CheckCircle2,
  Plus,
  QrCode,
  RefreshCw,
  ShieldCheck,
  Smartphone,
  Unplug,
  Wifi,
  WifiOff,
} from "lucide-react";
import { AppSidebar } from "@/components/AppSidebar";
import { ApiError } from "@/shared/api/apiClient";
import { whatsappAccountsApi } from "../api/whatsappAccountsApi";
import type { WhatsAppAccount, WhatsAppQrCode } from "../types";
import "../whatsapp-integration.css";
import "../whatsapp-integration-actions.css";

const emptyQrCode: WhatsAppQrCode = {
  base64: null,
  pairingCode: null,
  count: null,
};

export function WhatsAppIntegrationPage({
  onLogout,
}: {
  onLogout: () => void;
}) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenu, setUserMenu] = useState(false);
  const [accounts, setAccounts] = useState<WhatsAppAccount[]>([]);
  const [qrCodes, setQrCodes] = useState<Record<string, WhatsAppQrCode>>({});
  const [activeAccountId, setActiveAccountId] = useState<string | null>(null);
  const [name, setName] = useState("WhatsApp principal");
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [refreshingId, setRefreshingId] = useState<string | null>(null);
  const [disconnectingId, setDisconnectingId] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const activeAccountConnected = accounts.find(
    (item) => item.id === activeAccountId,
  )?.isConnected;

  useEffect(() => {
    let active = true;
    whatsappAccountsApi
      .list()
      .then(({ accounts: items }) => {
        if (active) {
          setAccounts(items);
          setError("");
        }
      })
      .catch((caught) => {
        if (active)
          setError(
            caught instanceof ApiError
              ? caught.message
              : "Não foi possível carregar as integrações.",
          );
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (!activeAccountId) return;
    if (activeAccountConnected !== false) return;
    let mounted = true;
    let checking = false;
    const check = async () => {
      if (checking) return;
      checking = true;
      try {
        const status = await whatsappAccountsApi.status(activeAccountId);
        if (!mounted) return;
        setAccounts((items) =>
          items.map((item) =>
            item.id === activeAccountId
              ? {
                  ...item,
                  isConnected: status.connected,
                  phoneNumber: status.phoneNumber ?? item.phoneNumber,
                }
              : item,
          ),
        );
        if (status.connected) {
          setActiveAccountId(null);
          setQrCodes((current) => ({
            ...current,
            [activeAccountId]: emptyQrCode,
          }));
        }
      } catch {
        if (mounted)
          setError(
            "A conexão está demorando. Atualize o QR Code e tente novamente.",
          );
      } finally {
        checking = false;
      }
    };
    const timer = window.setInterval(() => void check(), 4000);
    void check();
    return () => {
      mounted = false;
      window.clearInterval(timer);
    };
  }, [activeAccountId, activeAccountConnected]);

  const createAccount = async (event: FormEvent) => {
    event.preventDefault();
    const cleanName = name.trim();
    if (cleanName.length < 2) return;
    setCreating(true);
    setError("");
    try {
      const result = await whatsappAccountsApi.create(cleanName);
      setAccounts((items) => [...items, result.account]);
      setQrCodes((current) => ({
        ...current,
        [result.account.id]: result.qrCode,
      }));
      setActiveAccountId(result.account.id);
      setName("WhatsApp principal");
    } catch (caught) {
      setError(
        caught instanceof ApiError
          ? caught.message
          : "Não foi possível criar a conexão.",
      );
    } finally {
      setCreating(false);
    }
  };
  const requestQrCode = async (accountId: string) => {
    setRefreshingId(accountId);
    setError("");
    try {
      const result = await whatsappAccountsApi.connect(accountId);
      setQrCodes((current) => ({ ...current, [accountId]: result.qrCode }));
      setActiveAccountId(accountId);
    } catch (caught) {
      setError(
        caught instanceof ApiError
          ? caught.message
          : "Não foi possível gerar o QR Code.",
      );
    } finally {
      setRefreshingId(null);
    }
  };
  const checkStatus = async (accountId: string) => {
    setRefreshingId(accountId);
    setError("");
    try {
      const status = await whatsappAccountsApi.status(accountId);
      setAccounts((items) =>
        items.map((item) =>
          item.id === accountId
            ? {
                ...item,
                isConnected: status.connected,
                phoneNumber: status.phoneNumber ?? item.phoneNumber,
              }
            : item,
        ),
      );
      if (!status.connected) await requestQrCode(accountId);
    } catch (caught) {
      setError(
        caught instanceof ApiError
          ? caught.message
          : "Não foi possível consultar a conexão.",
      );
    } finally {
      setRefreshingId(null);
    }
  };
  const disconnectAccount = async (account: WhatsAppAccount) => {
    const confirmed = window.confirm(
      `Remover a conexão “${account.name}”? O atendimento será interrompido, mas conversas, contatos e leads permanecerão salvos. Você poderá reconectar depois.`,
    );
    if (!confirmed) return;
    setDisconnectingId(account.id);
    setError("");
    setNotice("");
    try {
      await whatsappAccountsApi.disconnect(account.id);
      setAccounts((items) =>
        items.map((item) =>
          item.id === account.id ? { ...item, isConnected: false } : item,
        ),
      );
      setActiveAccountId((current) =>
        current === account.id ? null : current,
      );
      setQrCodes((current) =>
        Object.fromEntries(
          Object.entries(current).filter(([id]) => id !== account.id),
        ),
      );
      setNotice(
        `Conexão “${account.name}” removida. O histórico foi preservado.`,
      );
    } catch (caught) {
      setError(
        caught instanceof ApiError
          ? caught.message
          : "Não foi possível remover a conexão.",
      );
    } finally {
      setDisconnectingId(null);
    }
  };

  return (
    <div
      className={`app-shell integrations-page ${collapsed ? "sidebar-collapsed" : ""}`}
    >
      <AppSidebar
        collapsed={collapsed}
        mobileOpen={mobileOpen}
        onCollapse={() => setCollapsed((value) => !value)}
        onMobileClose={() => setMobileOpen((value) => !value)}
        onUserMenu={() => setUserMenu((value) => !value)}
        userMenuOpen={userMenu}
        onLogout={onLogout}
      />
      <main>
        <header className="page-header">
          <div>
            <span className="eyebrow">CANAIS DE ATENDIMENTO</span>
            <h1>Integrações</h1>
            <p>Conecte o WhatsApp usado nas conversas com seus clientes.</p>
          </div>
          <span className="integration-provider">
            <Wifi size={15} />
            Evolution API
          </span>
        </header>
        <div className="integrations-content">
          {error && (
            <div className="integration-error" role="alert">
              {error}
              <button onClick={() => setError("")} aria-label="Fechar aviso">
                ×
              </button>
            </div>
          )}
          {notice && (
            <div className="integration-success" role="status">
              <CheckCircle2 size={16} />
              {notice}
              <button onClick={() => setNotice("")} aria-label="Fechar aviso">
                ×
              </button>
            </div>
          )}
          <section className="integration-intro">
            <span>
              <Smartphone size={21} />
            </span>
            <div>
              <h2>WhatsApp</h2>
              <p>
                Leia o QR Code pelo aplicativo para começar a receber e enviar
                mensagens.
              </p>
            </div>
            <div className="privacy-chip">
              <ShieldCheck size={15} />
              <span>
                <strong>Conexão protegida</strong>
                <small>Credenciais restritas ao servidor</small>
              </span>
            </div>
          </section>
          <div className="integration-layout">
            <section className="account-list-panel">
              <header>
                <div>
                  <h2>Contas conectadas</h2>
                  <p>Você pode usar mais de um número.</p>
                </div>
                <b>{accounts.length}</b>
              </header>
              {loading ? (
                <div className="integration-loading">
                  <span />
                  Carregando contas...
                </div>
              ) : accounts.length === 0 ? (
                <div className="integration-empty">
                  <WifiOff size={24} />
                  <strong>Nenhuma conta ainda</strong>
                  <p>Crie a primeira conexão ao lado.</p>
                </div>
              ) : (
                <div className="account-list">
                  {accounts.map((account) => (
                    <article
                      className={
                        activeAccountId === account.id ? "selected" : ""
                      }
                      key={account.id}
                    >
                      <span
                        className={`account-icon ${account.isConnected ? "connected" : ""}`}
                      >
                        {account.isConnected ? (
                          <CheckCircle2 size={18} />
                        ) : (
                          <Smartphone size={18} />
                        )}
                      </span>
                      <div>
                        <strong>{account.name}</strong>
                        <small>
                          {account.phoneNumber
                            ? `+${account.phoneNumber}`
                            : account.isConnected
                              ? "Número conectado"
                              : "Aguardando leitura do QR Code"}
                        </small>
                      </div>
                      <span
                        className={`account-status ${account.isConnected ? "connected" : ""}`}
                      >
                        {account.isConnected ? "Conectado" : "Desconectado"}
                      </span>
                      <div className="account-actions">
                        <button
                          onClick={() => void checkStatus(account.id)}
                          disabled={
                            refreshingId === account.id ||
                            disconnectingId === account.id
                          }
                        >
                          {refreshingId === account.id ? (
                            <RefreshCw className="spinning" size={14} />
                          ) : account.isConnected ? (
                            "Verificar"
                          ) : (
                            "Conectar"
                          )}
                        </button>
                        {account.isConnected && (
                          <button
                            className="disconnect-button"
                            onClick={() => void disconnectAccount(account)}
                            disabled={disconnectingId === account.id}
                          >
                            {disconnectingId === account.id ? (
                              <RefreshCw className="spinning" size={14} />
                            ) : (
                              <Unplug size={14} />
                            )}
                            Remover conexão
                          </button>
                        )}
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </section>
            <section className="connection-panel">
              {activeAccountId &&
              accounts.some(
                (account) =>
                  account.id === activeAccountId && !account.isConnected,
              ) ? (
                <QrCodePanel
                  qrCode={qrCodes[activeAccountId] ?? emptyQrCode}
                  refreshing={refreshingId === activeAccountId}
                  onRefresh={() => void requestQrCode(activeAccountId)}
                />
              ) : (
                <form className="create-account-form" onSubmit={createAccount}>
                  <span className="create-icon">
                    <Plus size={22} />
                  </span>
                  <h2>Adicionar WhatsApp</h2>
                  <p>
                    Dê um nome interno para identificar esta conta. O número
                    aparecerá após a leitura.
                  </p>
                  <label>
                    Nome da conta
                    <input
                      value={name}
                      onChange={(event) => setName(event.target.value)}
                      minLength={2}
                      maxLength={80}
                      placeholder="Ex.: WhatsApp principal"
                    />
                  </label>
                  <button
                    className="primary-button"
                    disabled={creating || name.trim().length < 2}
                  >
                    {creating ? (
                      <>
                        <RefreshCw className="spinning" size={16} />
                        Criando conexão...
                      </>
                    ) : (
                      <>
                        <QrCode size={16} />
                        Gerar QR Code
                      </>
                    )}
                  </button>
                  <small>
                    <ShieldCheck size={13} />A chave da Evolution API nunca é
                    enviada ao navegador.
                  </small>
                </form>
              )}
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}

function QrCodePanel({
  qrCode,
  refreshing,
  onRefresh,
}: {
  qrCode: WhatsAppQrCode;
  refreshing: boolean;
  onRefresh: () => void;
}) {
  return (
    <div className="qr-panel">
      <span className="qr-label">CONEXÃO EM ANDAMENTO</span>
      <h2>Leia o QR Code</h2>
      <ol>
        <li>Abra o WhatsApp no celular.</li>
        <li>
          Acesse <strong>Aparelhos conectados</strong>.
        </li>
        <li>
          Toque em <strong>Conectar um aparelho</strong> e leia o código.
        </li>
      </ol>
      <div className="qr-frame">
        {qrCode.base64 ? (
          <img src={qrCode.base64} alt="QR Code para conectar o WhatsApp" />
        ) : (
          <div>
            <QrCode size={42} />
            <span>QR Code indisponível</span>
          </div>
        )}
      </div>
      {qrCode.pairingCode && (
        <p className="pairing-code">
          Código de pareamento: <strong>{qrCode.pairingCode}</strong>
        </p>
      )}
      <button
        className="secondary-button"
        onClick={onRefresh}
        disabled={refreshing}
      >
        {refreshing ? (
          <RefreshCw className="spinning" size={15} />
        ) : (
          <RefreshCw size={15} />
        )}
        Atualizar QR Code
      </button>
      <small>
        O status é verificado automaticamente enquanto esta tela estiver aberta.
      </small>
    </div>
  );
}
