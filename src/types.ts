export interface Aluno {
  id: string;
  nome: string;
  telefone: string | null;
  avatar_url: string | null;
  criado_em: string;
}

export interface Exercicio {
  id: string;
  treino_id: string;
  nome: string;
  series: number | null;
  repeticoes: string | null;
  carga_sugerida: string | null;
  video_url: string | null;
  ordem: number | null;
}

export interface Treino {
  id: string;
  titulo: string;
  descricao: string | null;
  nivel: string | null;
  duracao_min: number | null;
  exercicios: Exercicio[];
}

export interface Plano {
  nome: string;
  periodicidade: string;
}

export interface Assinatura {
  id: string;
  status: string;
  valor: number;
  proxima_cobranca: string | null;
  planos: Plano | null;
}

export interface Pagamento {
  id: string;
  descricao: string;
  valor: number;
  status: string;
  metodo: string | null;
  data: string;
}

export interface AppData {
  aluno: Aluno | null;
  treinos: Treino[];
  assinatura: Assinatura | null;
  pagamentos: Pagamento[];
  conclusoes: string[];
}

export type Tab = "inicio" | "treinos" | "financeiro" | "perfil";
