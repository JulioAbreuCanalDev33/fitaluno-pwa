import type { AppData } from "./types";

export const demoSession = {
  user: {
    id: "demo-user",
    email: "aluno@exemplo.com",
    user_metadata: { nome: "Aluno Demo" },
  },
} as never;

export const demoData: AppData = {
  aluno: {
    id: "demo-user",
    nome: "Aluno Demo",
    telefone: null,
    avatar_url: null,
    criado_em: new Date().toISOString(),
  },
  treinos: [
    {
      id: "demo-t1",
      titulo: "Treino A - Força",
      descricao: "Peito, pernas e costas com foco em força.",
      nivel: "iniciante",
      duracao_min: 50,
      exercicios: [
        { id: "e1", treino_id: "demo-t1", nome: "Supino reto", series: 4, repeticoes: "8-10", carga_sugerida: "40 kg", video_url: "https://www.youtube.com/results?search_query=supino+reto+execu%C3%A7%C3%A3o", ordem: 1 },
        { id: "e2", treino_id: "demo-t1", nome: "Agachamento livre", series: 4, repeticoes: "10-12", carga_sugerida: "60 kg", video_url: null, ordem: 2 },
        { id: "e3", treino_id: "demo-t1", nome: "Remada sentada", series: 3, repeticoes: "12", carga_sugerida: "50 kg", video_url: null, ordem: 3 },
      ],
    },
    {
      id: "demo-t2",
      titulo: "Treino B - Cardio e Core",
      descricao: "Condicionamento e musculatura abdominal.",
      nivel: "intermediário",
      duracao_min: 35,
      exercicios: [
        { id: "e4", treino_id: "demo-t2", nome: "Esteira ergométrica", series: 1, repeticoes: "20 min", carga_sugerida: null, video_url: null, ordem: 1 },
        { id: "e5", treino_id: "demo-t2", nome: "Prancha isométrica", series: 3, repeticoes: "45 seg", carga_sugerida: null, video_url: null, ordem: 2 },
        { id: "e6", treino_id: "demo-t2", nome: "Abdominal crunch", series: 3, repeticoes: "20", carga_sugerida: null, video_url: null, ordem: 3 },
      ],
    },
    {
      id: "demo-t3",
      titulo: "Treino C - Full Body",
      descricao: "Circuito completo para o corpo todo.",
      nivel: "intermediário",
      duracao_min: 45,
      exercicios: [
        { id: "e7", treino_id: "demo-t3", nome: "Levantamento terra", series: 3, repeticoes: "6-8", carga_sugerida: "80 kg", video_url: null, ordem: 1 },
        { id: "e8", treino_id: "demo-t3", nome: "Flexão de braço", series: 3, repeticoes: "15", carga_sugerida: null, video_url: null, ordem: 2 },
        { id: "e9", treino_id: "demo-t3", nome: "Bike ergométrica", series: 1, repeticoes: "15 min", carga_sugerida: null, video_url: null, ordem: 3 },
      ],
    },
  ],
  assinatura: {
    id: "demo-a1",
    status: "ativa",
    valor: 99.9,
    proxima_cobranca: new Date(Date.now() + 12 * 86400000).toISOString().slice(0, 10),
    planos: { nome: "Plano Mensal", periodicidade: "mensal" },
  },
  pagamentos: [
    { id: "p1", descricao: "Mensalidade - Plano Mensal", valor: 99.9, status: "pago", metodo: "PIX", data: new Date().toISOString().slice(0, 10) },
    { id: "p2", descricao: "Mensalidade - Plano Mensal", valor: 99.9, status: "pago", metodo: "PIX", data: new Date(Date.now() - 30 * 86400000).toISOString().slice(0, 10) },
  ],
  conclusoes: [],
};
