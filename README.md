# FitAluno — PWA do aluno (estilo Next Fit)

App do aluno instalável no iPhone, com **treinos/exercícios** e **financeiro/planos**, usando **Supabase Cloud (free)** como backend.

> Projeto original inspirado nas funcionalidades do Next Fit. Não afiliado à Next Fit.

## O que já funciona na v1

- Login/cadastro por e-mail e senha (Supabase Auth)
- Perfil do aluno criado automaticamente no cadastro
- Início com resumo do plano, treinos e próxima cobrança
- Lista de treinos atribuídos ao aluno + detalhe com séries, repetições, carga e vídeo
- Botão **Marcar como concluído** (salvo no banco)
- Financeiro: assinatura ativa, plano, valor, próxima cobrança e histórico de pagamentos
- PWA: instalação na tela inicial do iPhone, ícone próprio e funcionamento offline da interface

## 1. Configurar o Supabase

1. Crie o projeto em https://supabase.com/dashboard/new (plano free).
2. No **SQL Editor**, cole e execute o conteúdo de [`supabase/schema.sql`](supabase/schema.sql).
3. Em **Project Settings → API**, copie a **Project URL** e a **publishable key**.

## 2. Rodar localmente

```bash
cp .env.example .env.local
# edite .env.local com a URL e a chave do seu projeto
npm install
npm run dev
```

Abra `http://localhost:5173`.

### Testar sem Supabase

Em `.env.local`, use `VITE_DEMO=true`. A interface abre com dados de exemplo e não exige login nem banco.

## 3. Publicar (necessário para instalar no iPhone)

O PWA precisa de HTTPS. A forma mais simples é Vercel ou Netlify (plano free):

```bash
npm run build      # gera a pasta dist
```

- **Vercel**: importe o repositório, framework `Vite`, build `npm run build`, output `dist`.
- Defina as variáveis de ambiente `VITE_SUPABASE_URL` e `VITE_SUPABASE_PUBLISHABLE_KEY` no painel da plataforma.
- **Netlify**: mesmo build, diretório `dist`.

### Instalar no iPhone

1. Abra o link publicado no **Safari**.
2. Toque em **Compartilhar** → **Adicionar à Tela de Início**.
3. Abra o ícone: o app entra em modo standalone (sem barra do Safari).

> No Chrome/iOS a instalação de PWA é limitada; use o Safari.

## 4. Estrutura

```
src/
  App.tsx              shell, autenticação e carregamento dos dados
  supabase.ts          cliente Supabase
  demo.ts              dados de exemplo (VITE_DEMO=true)
  types.ts             tipos TypeScript
  components/
    Login.tsx          entrar / criar conta / magic link
    BottomNav.tsx      navegação inferior
  pages/
    Home.tsx           resumo
    Treinos.tsx        lista e detalhe dos treinos
    Financeiro.tsx     assinatura e pagamentos
    Perfil.tsx         conta e sair
  styles.css           visual mobile-first
supabase/schema.sql    tabelas, RLS, dados iniciais e trigger
public/                manifest, service worker e ícones
```

## 5. Limites desta versão

- **Pagamentos**: o histórico e o plano são exibidos, mas **não há cobrança real**. PIX/boleto exigem integração com um gateway (ex.: Stripe, Mercado Pago, PSP brasileiro) e um webhook/Edge Function.
- Treinos e planos são cadastrados via SQL/dashboard do Supabase; ainda não existe painel do instrutor/gestor.
- Sem push notifications por enquanto.

## Próximos passos possíveis

- Painel do instrutor para criar treinos e atribuir alunos
- Evolução de carga e avaliações físicas
- Agendamento de aulas
- Checkout com PIX e webhook de confirmação
- Notificações push
