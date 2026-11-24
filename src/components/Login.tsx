import { useState, type FormEvent } from "react";
import { supabase } from "../supabase";

type Props = {
  demo: boolean;
  onDemo: () => void;
  configured: boolean;
};

type Mode = "login" | "cadastro";
type Msg = { tipo: "erro" | "ok"; texto: string };

function traduzirErro(err: unknown): string {
  const texto = err instanceof Error ? err.message : String(err);
  if (/invalid login credentials/i.test(texto)) return "E-mail ou senha incorretos.";
  if (/already registered|user already exists/i.test(texto))
    return "Este e-mail já está cadastrado. Vá em Entrar.";
  if (/password should be at least/i.test(texto)) return "A senha precisa ter pelo menos 6 caracteres.";
  if (/email not confirmed/i.test(texto)) return "Confirme seu e-mail antes de entrar.";
  if (/rate limit|too many requests/i.test(texto))
    return "Muitas tentativas. Aguarde um minuto e tente novamente.";
  if (/failed to fetch|network|placeholder/i.test(texto))
    return "Não foi possível conectar ao Supabase. Confira a URL e a chave no .env.local.";
  return texto;
}

export default function Login({ demo, onDemo, configured }: Props) {
  const [mode, setMode] = useState<Mode>("login");
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<Msg | null>(null);

  async function submit(e: FormEvent) {
    e.preventDefault();
    setMsg(null);

    if (demo) {
      onDemo();
      return;
    }
    if (!email.trim() || !senha || (mode === "cadastro" && !nome.trim())) {
      setMsg({ tipo: "erro", texto: "Preencha todos os campos." });
      return;
    }

    setLoading(true);
    try {
      if (mode === "cadastro") {
        const { data, error } = await supabase.auth.signUp({
          email: email.trim(),
          password: senha,
          options: { data: { nome: nome.trim() } },
        });
        if (error) throw error;
        if (!data.session) {
          setMsg({
            tipo: "ok",
            texto: "Conta criada! Confirme o e-mail e depois entre com sua senha.",
          });
        }
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password: senha,
        });
        if (error) throw error;
      }
    } catch (err) {
      setMsg({ tipo: "erro", texto: traduzirErro(err) });
    } finally {
      setLoading(false);
    }
  }

  async function enviarLink() {
    setMsg(null);
    if (!email.trim()) {
      setMsg({ tipo: "erro", texto: "Digite seu e-mail para receber o link." });
      return;
    }
    setLoading(true);
    const { error } = await supabase.auth.signInWithOtp({
      email: email.trim(),
      options: { emailRedirectTo: window.location.origin },
    });
    setLoading(false);
    setMsg(
      error
        ? { tipo: "erro", texto: traduzirErro(error) }
        : { tipo: "ok", texto: "Link enviado! Abra o e-mail no mesmo aparelho." }
    );
  }

  return (
    <div className="login-page">
      <div className="login-glow" />
      <div className="login-card">
        <div className="login-brand">
          <span className="brand-mark brand-mark-lg">F</span>
          <span className="brand brand-lg">
            Fit<span className="brand-accent">Aluno</span>
          </span>
        </div>

        <h1>Seu treino e seu plano na palma da mão.</h1>
        <p className="login-sub">
          Acompanhe exercícios, marque treinos concluídos e veja sua assinatura em um só lugar.
        </p>

        {demo && (
          <div className="demo-card">
            <strong>Modo demonstração</strong>
            <span>Explore o app com dados de exemplo, sem precisar de conta.</span>
          </div>
        )}

        <div className="segmented" role="tablist" aria-label="Entrar ou criar conta">
          <button
            role="tab"
            aria-selected={mode === "login"}
            className={mode === "login" ? "ativo" : ""}
            onClick={() => {
              setMode("login");
              setMsg(null);
            }}
          >
            Entrar
          </button>
          <button
            role="tab"
            aria-selected={mode === "cadastro"}
            className={mode === "cadastro" ? "ativo" : ""}
            onClick={() => {
              setMode("cadastro");
              setMsg(null);
            }}
          >
            Criar conta
          </button>
        </div>

        <form onSubmit={submit} className="form">
          {mode === "cadastro" && (
            <label>
              <span>Nome</span>
              <input
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                placeholder="Como podemos te chamar?"
                autoComplete="name"
              />
            </label>
          )}
          <label>
            <span>E-mail</span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="voce@email.com"
              autoComplete="email"
              inputMode="email"
            />
          </label>
          <label>
            <span>Senha</span>
            <input
              type="password"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              placeholder="Mínimo de 6 caracteres"
              autoComplete={mode === "login" ? "current-password" : "new-password"}
            />
          </label>

          {msg && <div className={`form-msg ${msg.tipo}`}>{msg.texto}</div>}

          <button className="btn-primary" type="submit" disabled={loading}>
            {loading ? "Aguarde..." : demo ? "Entrar na demonstração" : mode === "login" ? "Entrar" : "Criar conta"}
          </button>
        </form>

        {!demo && configured && (
          <button className="btn-link" onClick={enviarLink} disabled={loading}>
            Entrar com link por e-mail (sem senha)
          </button>
        )}

        <div className="login-footer">
          <span>Problemas para acessar?</span>
          <a href="mailto:suporte@exemplo.com">Fale com o suporte</a>
        </div>
      </div>
    </div>
  );
}
