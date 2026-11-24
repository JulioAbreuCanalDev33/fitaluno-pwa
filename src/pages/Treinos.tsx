import { useState } from "react";
import type { AppData } from "../types";

export default function Treinos({
  data,
  onToggle,
}: {
  data: AppData;
  onToggle: (treinoId: string) => void;
}) {
  const [selecionado, setSelecionado] = useState<string | null>(null);
  const treino = data.treinos.find((t) => t.id === selecionado);

  if (treino) {
    const concluido = data.conclusoes.includes(treino.id);
    return (
      <div className="page">
        <button className="back-button" onClick={() => setSelecionado(null)}>
          ← Voltar aos treinos
        </button>

        <section className="detail-hero">
          <span className="eyebrow">{treino.nivel ?? "livre"}</span>
          <h1>{treino.titulo}</h1>
          <p>{treino.descricao}</p>
          <div className="chips">
            <span className="chip">⏱ {treino.duracao_min ?? "—"} min</span>
            <span className="chip">🏋 {treino.exercicios.length} exercícios</span>
            {concluido && <span className="chip chip-ok">✓ Concluído</span>}
          </div>
        </section>

        <section className="section">
          <div className="section-head">
            <h2>Exercícios</h2>
            <span className="muted">Série × repetição</span>
          </div>

          {treino.exercicios.length === 0 ? (
            <div className="empty-card">
              <span>📋</span>
              <strong>Nenhum exercício cadastrado</strong>
            </div>
          ) : (
            <div className="card-list">
              {treino.exercicios.map((ex, index) => (
                <article className="exercicio-card" key={ex.id}>
                  <div className="exercicio-head">
                    <span className="exercicio-num">{String(index + 1).padStart(2, "0")}</span>
                    <strong>{ex.nome}</strong>
                  </div>
                  <div className="exercicio-meta">
                    <span className="chip">
                      {ex.series ?? "—"} × {ex.repeticoes ?? "—"}
                    </span>
                    {ex.carga_sugerida && <span className="chip">Carga: {ex.carga_sugerida}</span>}
                  </div>
                  {ex.video_url && (
                    <a className="video-link" href={ex.video_url} target="_blank" rel="noopener noreferrer">
                      ▶ Ver vídeo de execução
                    </a>
                  )}
                </article>
              ))}
            </div>
          )}
        </section>

        <button
          className={concluido ? "btn-secondary btn-block" : "btn-primary btn-block"}
          onClick={() => onToggle(treino.id)}
        >
          {concluido ? "Desmarcar conclusão" : "Marcar treino como concluído ✓"}
        </button>
      </div>
    );
  }

  return (
    <div className="page">
      <header className="page-header">
        <span className="eyebrow">Sua rotina</span>
        <h1>Meus treinos</h1>
        <p>Toque em um treino para ver os exercícios.</p>
      </header>

      {data.treinos.length === 0 ? (
        <div className="empty-card">
          <span>🏋️</span>
          <strong>Nenhum treino atribuído</strong>
          <p>Quando seu instrutor liberar um treino, ele aparece aqui.</p>
        </div>
      ) : (
        <div className="card-list">
          {data.treinos.map((t) => {
            const concluido = data.conclusoes.includes(t.id);
            return (
              <button className="treino-card" key={t.id} onClick={() => setSelecionado(t.id)}>
                <div className="treino-card-top">
                  <span className="treino-icon">💪</span>
                  <div className="treino-title">
                    <strong>{t.titulo}</strong>
                    <small>{t.descricao}</small>
                  </div>
                  {concluido && <span className="badge ok">✓</span>}
                </div>
                <div className="chips">
                  <span className="chip">{t.exercicios.length} exercícios</span>
                  <span className="chip">{t.duracao_min ?? "—"} min</span>
                  <span className="chip">{t.nivel ?? "livre"}</span>
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
