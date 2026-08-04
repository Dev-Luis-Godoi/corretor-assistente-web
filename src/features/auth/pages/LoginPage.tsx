import { useState, type FormEvent } from "react";
import {
  ArrowRight,
  CheckCircle2,
  Eye,
  EyeOff,
  LockKeyhole,
  MessageCircleMore,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { ApiError } from "@/shared/api/apiClient";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { BrandLogo } from "@/components/BrandLogo";

export function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    if (!email.includes("@") || password.length < 6) {
      setError(
        "Confira seu e-mail e use uma senha com pelo menos 6 caracteres.",
      );
      return;
    }
    setLoading(true);
    try {
      await login({ email, password });
    } catch (caught) {
      setError(
        caught instanceof ApiError && caught.status === 401
          ? "E-mail ou senha incorretos."
          : caught instanceof Error
            ? caught.message
            : "Não foi possível entrar.",
      );
      setLoading(false);
    }
  };

  return (
    <main className="login-page">
      <section
        className="login-showcase"
        aria-label="Benefícios da Chavora Flow"
      >
        <BrandLogo inverse className="login-brand" />
        <div className="showcase-copy">
          <span className="showcase-pill">
            <Sparkles size={13} />
            Seu dia, mais organizado
          </span>
          <h1>
            Transforme conversas em <em>oportunidades reais.</em>
          </h1>
          <p>
            Tenha clareza sobre cada lead, mantenha seus follow-ups em dia e
            feche mais negócios.
          </p>
          <ul>
            <li>
              <CheckCircle2 size={17} />
              <span>
                <strong>Prioridades claras</strong>Saiba quem precisa da sua
                atenção agora.
              </span>
            </li>
            <li>
              <MessageCircleMore size={17} />
              <span>
                <strong>Conversas organizadas</strong>Centralize seus contatos
                em um só lugar.
              </span>
            </li>
            <li>
              <ShieldCheck size={17} />
              <span>
                <strong>Dados protegidos</strong>Suas informações sempre
                seguras.
              </span>
            </li>
          </ul>
        </div>
        <div className="showcase-quote">
          <p>“Agora começo o dia sabendo exatamente com quem preciso falar.”</p>
          <div>
            <span>LG</span>
            <small>
              <strong>Luis Godoi</strong>Corretor de imóveis
            </small>
          </div>
        </div>
        <div className="showcase-orbit orbit-one" />
        <div className="showcase-orbit orbit-two" />
      </section>
      <section className="login-form-side">
        <BrandLogo className="login-mobile-brand" />
        <div className="login-card">
          <div className="login-heading">
            <span className="login-lock">
              <LockKeyhole size={19} />
            </span>
            <h2>Que bom ter você de volta</h2>
            <p>Entre na sua conta para continuar.</p>
          </div>
          <form onSubmit={submit} noValidate>
            <label htmlFor="login-email">E-mail</label>
            <div className="login-input">
              <input
                id="login-email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu@email.com"
                aria-invalid={Boolean(error)}
                required
              />
            </div>
            <div className="password-label">
              <label htmlFor="login-password">Senha</label>
              <button
                type="button"
                onClick={() => navigate("/forgot-password")}
              >
                Esqueci minha senha
              </button>
            </div>
            <div className="login-input password-input">
              <input
                id="login-password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Digite sua senha"
                aria-invalid={Boolean(error)}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword((value) => !value)}
                aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            <label className="remember-option">
              <input type="checkbox" defaultChecked />
              <span>Lembrar meu acesso neste dispositivo</span>
            </label>
            {error && (
              <p className="login-error" role="alert">
                {error}
              </p>
            )}
            <button className="login-submit" disabled={loading}>
              {loading ? (
                <>
                  <span className="login-spinner" />
                  Entrando...
                </>
              ) : (
                <>
                  Entrar na plataforma <ArrowRight size={17} />
                </>
              )}
            </button>
          </form>
          <div className="demo-access">
            <span>ACESSO SEGURO</span>
            <p>
              Use o e-mail e a senha cadastrados na sua organização.
            </p>
          </div>
          <p className="signup-copy">
            Ainda não tem uma conta?{" "}
            <button
              onClick={() => navigate("/register")}
            >
              Solicitar acesso
            </button>
          </p>
        </div>
        <footer>
          © 2026 Chavora Flow <span /> Privacidade <span /> Termos de uso
        </footer>
      </section>
    </main>
  );
}
