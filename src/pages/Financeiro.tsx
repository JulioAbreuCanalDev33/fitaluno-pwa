import { dateBR, money } from "../format";
import type { AppData } from "../types";

export default function Financeiro({ data }: { data: AppData }) {
  const assinatura = data.assinatura;

  return (
    <div className="page">
      <header className="page-header">
        <span className="eyebrow">Seu plano</span>
        <h1>Financeiro</h1>
        <p>Assinatura e histórico de pagamentos.</p>
      </header>

      <section className="section">
        <div className="card assinatura-card">
          <div className="assinatura-top">
            <div>
              <span className="label">Plano atual</span>
              <h2>{assinatura?.planos?.nome ?? "Sem plano"}</h2>
            </div>
            <span className={assinatura?.status === "ativa" ? "badge ok" : "badge"}>
              {assinatura?.status ?? "—"}
            </span>
          </div>

          <div className="valor-linha">
            <strong>{money(assinatura?.valor)}</strong>
            <span>/{assinatura?.planos?.periodicidade ?? "—"}</span>
          </div>

          <div className="divider" />

          <div className="info-row">
            <span>Próxima cobrança</span>
            <strong>{dateBR(assinatura?.proxima_cobranca)}</strong>
          </div>
          <div className="info-row">
            <span>Forma de pagamento</span>
            <strong>{data.pagamentos[0]?.metodo ?? "—"}</strong>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="section-head">
          <h2>Histórico</h2>
          <span className="muted">Últimos {data.pagamentos.length} lançamentos</span>
        </div>

        {data.pagamentos.length === 0 ? (
          <div className="empty-card">
            <span>🧾</span>
            <strong>Nenhum pagamento registrado</strong>
          </div>
        ) : (
          <div className="card-list">
            {data.pagamentos.map((p) => (
              <article className="pagamento-card" key={p.id}>
                <span className="pagamento-icon">R$</span>
                <div className="pagamento-info">
                  <strong>{p.descricao}</strong>
                  <small>
                    {dateBR(p.data)} · {p.metodo ?? "—"}
                  </small>
                </div>
                <div className="pagamento-valor">
                  <strong>{money(p.valor)}</strong>
                  <span className="badge ok">{p.status}</span>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      <p className="aviso">
        Esta versão exibe os lançamentos registrados no Supabase. Não há cobrança automática:
        integrar PIX/cartão exige um gateway de pagamento.
      </p>
    </div>
  );
}
