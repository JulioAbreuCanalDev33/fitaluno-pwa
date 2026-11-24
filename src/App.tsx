import { useCallback, useEffect, useState } from "react";
import type { Session } from "@supabase/supabase-js";
import { supabase, DEMO, isConfigured } from "./supabase";
import { demoData, demoSession } from "./demo";
import { firstName } from "./format";
import type { AppData, Exercicio, Plano, Tab, Treino } from "./types";
import Login from "./components/Login";
import BottomNav from "./components/BottomNav";
import Home from "./pages/Home";
import Treinos from "./pages/Treinos";
import Financeiro from "./pages/Financeiro";
import Perfil from "./pages/Perfil";

const emptyData: AppData = {
  aluno: null,
  treinos: [],
  assinatura: null,
  pagamentos: [],
  conclusoes: [],
};

export default function App() {
  const [session, setSession] = useState<Session | null>(null);
  const [data, setData] = useState<AppData>(emptyData);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<Tab>("inicio");
  const [error, setError] = useState<string | null>(null);

  const loadData = useCallback(async (userId: string) => {
    const { data: aluno, error: e1 } = await supabase
      .from("alunos")
      .select("*")
      .eq("id", userId)
      .maybeSingle();
    if (e1) throw new Error(e1.message);

    const { data: vinculos, error: e2 } = await supabase
      .from("aluno_treinos")
      .select("treino_id")
      .eq("aluno_id", userId);
    if (e2) throw new Error(e2.message);

    const ids = (vinculos ?? []).map((v: { treino_id: string }) => v.treino_id);
    let treinos: Treino[] = [];
    let exercicios: Exercicio[] = [];

    if (ids.length > 0) {
      const [{ data: t, error: e3 }, { data: ex, error: e4 }] = await Promise.all([
        supabase.from("treinos").select("*").in("id", ids).order("titulo"),
        supabase.from("treino_exercicios").select("*").in("treino_id", ids).order("ordem"),
      ]);
      if (e3) throw new Error(e3.message);
      if (e4) throw new Error(e4.message);
      treinos = (t ?? []) as Treino[];
      exercicios = (ex ?? []) as Exercicio[];
    }

    const [{ data: assinatura, error: e5 }, { data: pagamentos, error: e6 }, { data: conclusoes, error: e7 }] =
      await Promise.all([
        supabase
          .from("assinaturas")
          .select("*, planos (nome, periodicidade)")
          .eq("aluno_id", userId)
          .order("criado_em", { ascending: false })
          .limit(1)
          .maybeSingle(),
        supabase
          .from("pagamentos")
          .select("*")
          .eq("aluno_id", userId)
          .order("data", { ascending: false })
          .limit(12),
        supabase.from("treino_conclusoes").select("treino_id").eq("aluno_id", userId),
      ]);
    if (e5) throw new Error(e5.message);
    if (e6) throw new Error(e6.message);
    if (e7) throw new Error(e7.message);

    const rawPlano = assinatura?.planos;
    const plano: Plano | null = Array.isArray(rawPlano) ? rawPlano[0] ?? null : rawPlano ?? null;

    setData({
      aluno: aluno as AppData["aluno"],
      treinos: treinos.map((treino) => ({
        ...treino,
        exercicios: exercicios.filter((e) => e.treino_id === treino.id),
      })),
      assinatura: assinatura ? ({ ...assinatura, planos: plano } as AppData["assinatura"]) : null,
      pagamentos: (pagamentos ?? []) as AppData["pagamentos"],
      conclusoes: (conclusoes ?? []).map((c: { treino_id: string }) => c.treino_id),
    });
  }, []);

  useEffect(() => {
    if (DEMO) {
      setSession(demoSession);
      setData(demoData);
      setLoading(false);
      return;
    }

    let ativo = true;
    supabase.auth.getSession().then(({ data: { session: s } }) => {
      if (!ativo) return;
      setSession(s);
      if (s) {
        loadData(s.user.id)
          .catch((err: Error) => setError(err.message))
          .finally(() => setLoading(false));
      } else {
        setLoading(false);
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, s) => {
      if (!ativo) return;
      setSession(s);
      setError(null);
      if (s) {
        setLoading(true);
        loadData(s.user.id)
          .catch((err: Error) => setError(err.message))
          .finally(() => setLoading(false));
      } else {
        setData(emptyData);
        setLoading(false);
      }
    });

    return () => {
      ativo = false;
      subscription.unsubscribe();
    };
  }, [loadData]);

  const toggleConclusao = useCallback(
    async (treinoId: string) => {
      if (!session) return;
      const jaConcluido = data.conclusoes.includes(treinoId);

      setData((prev) => ({
        ...prev,
        conclusoes: jaConcluido
          ? prev.conclusoes.filter((id) => id !== treinoId)
          : [...prev.conclusoes, treinoId],
      }));

      if (DEMO) return;

      const { error: err } = jaConcluido
        ? await supabase
            .from("treino_conclusoes")
            .delete()
            .eq("aluno_id", session.user.id)
            .eq("treino_id", treinoId)
        : await supabase
            .from("treino_conclusoes")
            .insert({ aluno_id: session.user.id, treino_id: treinoId });

      if (err) {
        setData((prev) => ({
          ...prev,
          conclusoes: jaConcluido
            ? [...prev.conclusoes, treinoId]
            : prev.conclusoes.filter((id) => id !== treinoId),
        }));
        setError(err.message);
      }
    },
    [session, data.conclusoes]
  );

  const entrarDemo = () => {
    setSession(demoSession);
    setData(demoData);
    setError(null);
  };

  const sair = async () => {
    if (DEMO) {
      setSession(null);
      setData(emptyData);
      return;
    }
    await supabase.auth.signOut();
  };

  if (loading) {
    return (
      <div className="splash">
        <div className="splash-logo">F</div>
        <div className="spinner" />
        <p>Carregando seu treino...</p>
      </div>
    );
  }

  if (!session) {
    return (
      <>
        {!isConfigured && !DEMO && (
          <div className="setup-banner" role="alert">
            <strong>Configure o Supabase</strong>
            <span>
              Copie <code>.env.example</code> para <code>.env.local</code> e preencha a URL e a
              publishable key do seu projeto.
            </span>
          </div>
        )}
        <Login demo={DEMO} onDemo={entrarDemo} configured={isConfigured} />
      </>
    );
  }

  return (
    <div className="app-shell">
      <main className="app-main">
        <header className="topbar">
          <div className="brand">
            <span className="brand-mark">F</span>
            <span>Fit<span className="brand-accent">Aluno</span></span>
          </div>
          <button className="avatar-button" onClick={() => setTab("perfil")} aria-label="Abrir perfil">
            {firstName(data.aluno?.nome).charAt(0).toUpperCase()}
          </button>
        </header>

        {error && (
          <div className="alert" role="alert">
            <span>{error}</span>
            <button onClick={() => setError(null)} aria-label="Fechar aviso">
              ×
            </button>
          </div>
        )}

        {tab === "inicio" && <Home data={data} onNavigate={setTab} />}
        {tab === "treinos" && <Treinos data={data} onToggle={toggleConclusao} />}
        {tab === "financeiro" && <Financeiro data={data} />}
        {tab === "perfil" && (
          <Perfil data={data} email={session.user.email ?? "—"} onSignOut={sair} />
        )}
      </main>

      <BottomNav active={tab} onChange={setTab} />
    </div>
  );
}
