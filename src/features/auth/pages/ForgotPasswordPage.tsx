import { useState, type FormEvent } from "react";
import { ArrowLeft, KeyRound, MailCheck } from "lucide-react";
import { Link } from "react-router-dom";

import { authApi } from "../api/authApi";

export function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setLoading(true);

    try {
      await authApi.forgotPassword(email);
      setSent(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="auth-simple-page">
      <section>
        <Link className="auth-back" to="/login">
          <ArrowLeft size={15} /> Voltar ao login
        </Link>
        <div className="auth-form-card">
          {sent ? (
            <>
              <span className="login-lock"><MailCheck size={20} /></span>
              <h1>Confira suas instruções</h1>
              <p>Se o e-mail estiver cadastrado, você receberá um link seguro para redefinir a senha.</p>
            </>
          ) : (
            <>
              <span className="login-lock"><KeyRound size={20} /></span>
              <h1>Recuperar acesso</h1>
              <p>Informe seu e-mail para receber um link seguro válido por 30 minutos.</p>
              <form onSubmit={submit}>
                <label>
                  E-mail
                  <input
                    autoFocus
                    required
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder="voce@imobiliaria.com"
                  />
                </label>
                <button className="login-submit" disabled={loading}>
                  {loading ? "Enviando..." : "Enviar instruções"}
                </button>
              </form>
            </>
          )}
        </div>
      </section>
    </main>
  );
}
