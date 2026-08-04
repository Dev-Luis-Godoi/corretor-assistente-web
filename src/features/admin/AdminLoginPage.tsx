import { useState, type FormEvent } from "react";
import { ArrowLeft, ArrowRight, LockKeyhole, ShieldCheck } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { BrandLogo } from "@/components/BrandLogo";
import { ApiError } from "@/shared/api/apiClient";
import { useAdminAuth } from "./useAdminAuth";
import "./admin.css";

export function AdminLoginPage() {
  const { login } = useAdminAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError("");
    try {
      await login(email, password);
      navigate("/admin", { replace: true });
    } catch (caught) {
      setError(
        caught instanceof ApiError && caught.status === 401
          ? "Credenciais administrativas inválidas."
          : caught instanceof ApiError
            ? caught.message
            : "Não foi possível acessar a administração.",
      );
    } finally {
      setLoading(false);
    }
  };
  return (
    <main className="admin-login-page">
      <section className="admin-login-intro">
        <BrandLogo inverse />
        <div>
          <span className="admin-kicker">
            <ShieldCheck size={15} />
            OPERAÇÃO CHAVORA
          </span>
          <h1>Controle seguro da plataforma.</h1>
          <p>
            Acompanhe contas, acessos e indicadores sem expor os dados
            comerciais dos corretores.
          </p>
        </div>
        <small>Ambiente administrativo separado e auditado.</small>
      </section>
      <section className="admin-login-form">
        <div>
          <Link to="/login">
            <ArrowLeft size={14} />
            Voltar para a Chavora Flow
          </Link>
          <span className="admin-login-icon">
            <LockKeyhole size={21} />
          </span>
          <h2>Área administrativa</h2>
          <p>Use exclusivamente suas credenciais de operador.</p>
          <form onSubmit={submit}>
            <label>
              E-mail administrativo
              <input
                required
                type="email"
                autoComplete="username"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="admin@chavora.com.br"
              />
            </label>
            <label>
              Senha
              <input
                required
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Sua senha administrativa"
              />
            </label>
            {error && (
              <p className="admin-form-error" role="alert">
                {error}
              </p>
            )}
            <button disabled={loading}>
              {loading ? (
                "Validando acesso..."
              ) : (
                <>
                  Entrar na administração
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>
          <small>
            <ShieldCheck size={13} />
            Sessão isolada do acesso dos corretores
          </small>
        </div>
      </section>
    </main>
  );
}
