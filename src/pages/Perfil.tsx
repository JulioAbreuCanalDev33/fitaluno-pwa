import { dateBR, firstName } from "../format";
import type { AppData } from "../types";

export default function Perfil({
  data,
  email,
  onSignOut,
}: {
  data: AppData;
  email: string;
  onSignOut: () => void;
}) {
  return (
    <div className="page">
      <header className="page-header">
        <span className="eyebrow">Sua conta</span>
        <h1>Perfil</h1>
      </header>

      <section className="card perfil-card">
        <div className="perfil-avatar">
          {firstName(data.aluno?.nome).charAt(0).toUpperCase()}
        </div>
        <h2>{data.aluno?.nome ?? "Aluno"}</h2>
        <p>{email}</p>
        <span className="badge ok">Aluno ativo</span>
      </section>

      <section className="section">
        <div className="section-head">
          <h2>Dados da conta</h2>
        </div>
        <div className="card info-list">
          <div className="info-row">
            <span>Nome</span>
            <strong>{data.aluno?.nome ?? "—"}</strong>
          </div>
          <div className="info-row">
            <span>Telefone</span>
            <strong>{data.aluno?.telefone ?? "Não informado"}</strong>
          </div>
          <div className="info-row">
            <span>Aluno desde</span>
            <strong>{dateBR(data.aluno?.criado_em)}</strong>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="section-head">
          <h2>Instalar no iPhone</h2>
        </div>
        <div className="card info-list passo-list">
          <div className="info-row"><span>1.</span><strong>Abra este link no Safari</strong></div>
          <div className="info-row"><span>2.</span><strong>Toque em Compartilhar</strong></div>
          <div className="info-row"><span>3.</span><strong>Adicionar à Tela de Início</strong></div>
          <div className="info-row"><span>4.</span><strong>Abra o ícone FitAluno</strong></div>
        </div>
      </section>

      <button className="btn-secondary btn-block sair-button" onClick={onSignOut}>
        Sair da conta
      </button>

      <p className="aviso centered">FitAluno · Inspirado em apps de gestão de academias. Não afiliado à Next Fit.</p>
    </div>
  );
}
