import { dateBR, firstName, money } from "../format";
import type { AppData, Tab } from "../types";

export default function Home({ data, onNavigate }: { data: AppData; onNavigate: (tab: Tab) => void }) {
  const total = data.treinos.length;
  const concluidos = data.conclusoes.length;
  const pendentes = data.treinos.filter((t) => !data.conclusoes.includes(t.id));
  const plano = data.assinatura?.planos?.nome ?? "Sem plano ativo";
  const cobranca = data.assinatura?.proxima_cobranca;

  return (
    <div className="page">
      <section className="hero">
        <span className="eyebrow">Bem-vindo de volta 👋</span>
        <h1>Olá, {firstName(data.aluno?.nome)}!</h1>
        <p>{total > 0 ? "Bora treinar? Seus exercícios estão prontos." : "Seu treino será atribuído em breve."}</p>
        <button className="btn-primary" onClick={() => onNavigate("treinos")}>
          Ver meus treinos <span aria-hidden>→</span>
        </button>
      </section>

      <div className="stats-grid">
        <div className="stat-card">
          <span className="stat-num">{total}</span>
          <span className="stat-label">Treinos</span>
        </div>
        <div className="stat-card">
          <span className="stat-num">{concluidos}</span>
          <span className="stat-label">Concluídos</span>
        </div>
        <div className="stat-card">
          <span className="stat-num">{data.pagamentos.length}</span>
          <span className="stat-label">Pagamentos</span>
        </div>
      </div>

      <section className="section">
        <div className="section-head">
          <h2>Próximos treinos</h2>
          <button className="btn-text" onClick={() => onNavigate("treinos")}>
            Ver todos
          </button>
        </div>
        {pendentes.length === 0 ? (
          <div className="empty-card">
            <span>🎉</span>
            <strong>Tudo concluído por aqui!</strong>
            <p>Nenhum treino pendente no momento.</p>
          </div>
        ) : (
          <div className="card-list">
            {pendentes.slice(0, 2).map((treino) => (
              <button key={treino.id} className="treino-mini" onClick={() => onNavigate("treinos")}>
                <span className="treino-minio-icon">💪</span>
                <span className="treino-mini-info">
                  <strong>{treino.titulo}</strong>
                  <small>
                    {treino.exercicios.length} exercícios · {treino.duracao_min ?? "—"} min
                  </small>
                </span>
                <span className="chevron">›</span>
              </button>
            ))}
          </div>
        )}
      </section>

      <section className="section">
        <div className="section-head">
          <h2>Meu plano</h2>
          <button className="btn-text" onClick={() => onNavigate("financeiro")}>
            Detalhes
          </button>
        </div>
        <div className="card plano-resumo">
          <div className="plano-top">
            <div>
              <span className="label">Assinatura</span>
              <strong>{plano}</strong>
            </div>
            <span className={data.assinatura?.status === "ativa" ? "badge ok" : "badge"}>
              {data.assinatura?.status ?? "—"}
            </span>
          </div>
          <div className="plano-bottom">
            <div>
              <span className="label">Mensalidade</span>
              <strong>{money(data.assinatura?.valor)}</strong>
            </div>
            <div>
              <span className="label">Próxima cobrança</span>
              <strong>{dateBR(cobranca)}</strong>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
