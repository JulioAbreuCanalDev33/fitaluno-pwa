-- FitAluno - schema para o Supabase
-- Execute este arquivo completo no SQL Editor do seu projeto Supabase (plano free).

create extension if not exists pgcrypto;

-- ---------------------------------------------------------------------------
-- Tabelas
-- ---------------------------------------------------------------------------

create table if not exists public.planos (
  id uuid primary key default gen_random_uuid(),
  nome text not null unique,
  descricao text,
  valor numeric(10,2) not null,
  periodicidade text not null default 'mensal',
  criado_em timestamptz not null default now()
);

create table if not exists public.alunos (
  id uuid primary key references auth.users(id) on delete cascade,
  nome text not null default 'Aluno',
  telefone text,
  avatar_url text,
  criado_em timestamptz not null default now()
);

create table if not exists public.treinos (
  id uuid primary key default gen_random_uuid(),
  titulo text not null,
  descricao text,
  nivel text not null default 'iniciante',
  duracao_min integer,
  criado_em timestamptz not null default now()
);

create table if not exists public.treino_exercicios (
  id uuid primary key default gen_random_uuid(),
  treino_id uuid not null references public.treinos(id) on delete cascade,
  nome text not null,
  series integer default 3,
  repeticoes text default '10-12',
  carga_sugerida text,
  video_url text,
  ordem integer default 0
);

create table if not exists public.aluno_treinos (
  id uuid primary key default gen_random_uuid(),
  aluno_id uuid not null references public.alunos(id) on delete cascade,
  treino_id uuid not null references public.treinos(id) on delete cascade,
  atribuido_em timestamptz not null default now(),
  unique (aluno_id, treino_id)
);

create table if not exists public.treino_conclusoes (
  id uuid primary key default gen_random_uuid(),
  aluno_id uuid not null references public.alunos(id) on delete cascade,
  treino_id uuid not null references public.treinos(id) on delete cascade,
  concluido_em timestamptz not null default now(),
  unique (aluno_id, treino_id)
);

create table if not exists public.assinaturas (
  id uuid primary key default gen_random_uuid(),
  aluno_id uuid not null references public.alunos(id) on delete cascade,
  plano_id uuid not null references public.planos(id),
  status text not null default 'ativa',
  valor numeric(10,2) not null,
  proxima_cobranca date,
  criado_em timestamptz not null default now()
);

create table if not exists public.pagamentos (
  id uuid primary key default gen_random_uuid(),
  aluno_id uuid not null references public.alunos(id) on delete cascade,
  descricao text not null,
  valor numeric(10,2) not null,
  status text not null default 'pago',
  metodo text,
  data date not null default current_date
);

create index if not exists idx_aluno_treinos_aluno on public.aluno_treinos(aluno_id);
create index if not exists idx_exercicios_treino on public.treino_exercicios(treino_id);
create index if not exists idx_pagamentos_aluno on public.pagamentos(aluno_id);
create index if not exists idx_assinaturas_aluno on public.assinaturas(aluno_id);

-- ---------------------------------------------------------------------------
-- Row Level Security: cada aluno vê somente os próprios dados
-- ---------------------------------------------------------------------------

alter table public.alunos enable row level security;
alter table public.planos enable row level security;
alter table public.treinos enable row level security;
alter table public.treino_exercicios enable row level security;
alter table public.aluno_treinos enable row level security;
alter table public.treino_conclusoes enable row level security;
alter table public.assinaturas enable row level security;
alter table public.pagamentos enable row level security;

drop policy if exists "aluno le proprio perfil" on public.alunos;
create policy "aluno le proprio perfil" on public.alunos
  for select using (auth.uid() = id);

drop policy if exists "aluno edita proprio perfil" on public.alunos;
create policy "aluno edita proprio perfil" on public.alunos
  for update using (auth.uid() = id);

drop policy if exists "planos legiveis" on public.planos;
create policy "planos legiveis" on public.planos
  for select using (auth.role() = 'authenticated');

drop policy if exists "treinos legiveis" on public.treinos;
create policy "treinos legiveis" on public.treinos
  for select using (auth.role() = 'authenticated');

drop policy if exists "exercicios legiveis" on public.treino_exercicios;
create policy "exercicios legiveis" on public.treino_exercicios
  for select using (auth.role() = 'authenticated');

drop policy if exists "aluno le seus treinos" on public.aluno_treinos;
create policy "aluno le seus treinos" on public.aluno_treinos
  for select using (auth.uid() = aluno_id);

drop policy if exists "aluno le suas conclusoes" on public.treino_conclusoes;
create policy "aluno le suas conclusoes" on public.treino_conclusoes
  for select using (auth.uid() = aluno_id);

drop policy if exists "aluno conclui treino" on public.treino_conclusoes;
create policy "aluno conclui treino" on public.treino_conclusoes
  for insert with check (auth.uid() = aluno_id);

drop policy if exists "aluno desfaz conclusao" on public.treino_conclusoes;
create policy "aluno desfaz conclusao" on public.treino_conclusoes
  for delete using (auth.uid() = aluno_id);

drop policy if exists "aluno le sua assinatura" on public.assinaturas;
create policy "aluno le sua assinatura" on public.assinaturas
  for select using (auth.uid() = aluno_id);

drop policy if exists "aluno le seus pagamentos" on public.pagamentos;
create policy "aluno le seus pagamentos" on public.pagamentos
  for select using (auth.uid() = aluno_id);

-- ---------------------------------------------------------------------------
-- Dados iniciais
-- ---------------------------------------------------------------------------

insert into public.planos (id, nome, descricao, valor, periodicidade) values
  ('a0000000-0000-4000-8000-000000000001', 'Plano Mensal', 'Acesso ilimitado a treinos e avaliações', 99.90, 'mensal'),
  ('a0000000-0000-4000-8000-000000000002', 'Plano Anual', '12 meses com desconto e prioridade na agenda', 999.00, 'anual')
on conflict (id) do nothing;

insert into public.treinos (id, titulo, descricao, nivel, duracao_min) values
  ('b0000000-0000-4000-8000-000000000001', 'Treino A - Força', 'Peito, pernas e costas com foco em força.', 'iniciante', 50),
  ('b0000000-0000-4000-8000-000000000002', 'Treino B - Cardio e Core', 'Condicionamento e musculatura abdominal.', 'intermediário', 35),
  ('b0000000-0000-4000-8000-000000000003', 'Treino C - Full Body', 'Circuito completo para o corpo todo.', 'intermediário', 45)
on conflict (id) do nothing;

insert into public.treino_exercicios (id, treino_id, nome, series, repeticoes, carga_sugerida, video_url, ordem) values
  ('c0000000-0000-4000-8000-000000000001', 'b0000000-0000-4000-8000-000000000001', 'Supino reto', 4, '8-10', '40 kg', 'https://www.youtube.com/results?search_query=supino+reto+execu%C3%A7%C3%A3o', 1),
  ('c0000000-0000-4000-8000-000000000002', 'b0000000-0000-4000-8000-000000000001', 'Agachamento livre', 4, '10-12', '60 kg', 'https://www.youtube.com/results?search_query=agachamento+livre+execu%C3%A7%C3%A3o', 2),
  ('c0000000-0000-4000-8000-000000000003', 'b0000000-0000-4000-8000-000000000001', 'Remada sentada', 3, '12', '50 kg', null, 3),
  ('c0000000-0000-4000-8000-000000000004', 'b0000000-0000-4000-8000-000000000002', 'Esteira ergométrica', 1, '20 min', null, null, 1),
  ('c0000000-0000-4000-8000-000000000005', 'b0000000-0000-4000-8000-000000000002', 'Prancha isométrica', 3, '45 seg', null, null, 2),
  ('c0000000-0000-4000-8000-000000000006', 'b0000000-0000-4000-8000-000000000002', 'Abdominal crunch', 3, '20', null, null, 3),
  ('c0000000-0000-4000-8000-000000000007', 'b0000000-0000-4000-8000-000000000003', 'Levantamento terra', 3, '6-8', '80 kg', null, 1),
  ('c0000000-0000-4000-8000-000000000008', 'b0000000-0000-4000-8000-000000000003', 'Flexão de braço', 3, '15', null, null, 2),
  ('c0000000-0000-4000-8000-000000000009', 'b0000000-0000-4000-8000-000000000003', 'Bike ergométrica', 1, '15 min', null, null, 3)
on conflict (id) do nothing;

-- ---------------------------------------------------------------------------
-- Novo usuário: cria perfil, assinatura e atribui os treinos
-- ---------------------------------------------------------------------------

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.alunos (id, nome)
  values (new.id, coalesce(new.raw_user_meta_data->>'nome', split_part(coalesce(new.email, 'aluno'), '@', 1)))
  on conflict (id) do nothing;

  insert into public.assinaturas (aluno_id, plano_id, status, valor, proxima_cobranca)
  select new.id, p.id, 'ativa', p.valor, (current_date + interval '30 days')::date
  from public.planos p
  where p.nome = 'Plano Mensal'
  limit 1;

  insert into public.pagamentos (aluno_id, descricao, valor, status, metodo, data)
  select new.id, 'Mensalidade - Plano Mensal', p.valor, 'pago', 'PIX', current_date
  from public.planos p
  where p.nome = 'Plano Mensal'
  limit 1;

  insert into public.aluno_treinos (aluno_id, treino_id)
  select new.id, t.id from public.treinos t
  on conflict do nothing;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
