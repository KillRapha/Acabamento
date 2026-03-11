# JeansFlow Mobile

Sistema web mobile-first para controle operacional de acabamento de jeans, com foco em:

- entrada de lotes
- cliente e prazo de entrega
- apontamento da tiradeira de linha
- apontamento da passadeira
- controle de saída/entrega
- visão rápida do andamento da produção

## Stack

- Next.js 16 (App Router)
- React 19
- TypeScript
- Tailwind CSS 4
- Prisma ORM
- PostgreSQL

## Principais telas

- **Início**: indicadores operacionais e visão rápida dos lotes críticos
- **Lotes**: acompanhamento da entrada e do progresso por etapa
- **Novo lote**: cadastro rápido do pedido
- **Produção**: apontamento por etapa com controle por colaboradora
- **Entregas**: conclusão dos lotes prontos para saída
- **Equipe**: cadastro de clientes e colaboradoras

## Estrutura do projeto

```bash
app/
  api/
    batches/
    clients/
    employees/
    production-entries/
  entregas/
  equipe/
  lotes/
  producao/
components/
  dashboard/
  forms/
  layout/
  navigation/
  ui/
lib/
  batch-status.ts
  constants.ts
  prisma.ts
  queries.ts
  utils.ts
  validators.ts
prisma/
  schema.prisma
  seed.ts
```

## Como rodar localmente

### 1) Pré-requisitos

- Node.js **20.19+** ou **22.12+**
- Docker Desktop ou Docker Engine
- npm

### 2) Suba o banco PostgreSQL

```bash
docker compose up -d
```

### 3) Configure o ambiente

Copie o arquivo `.env.example` para `.env`:

```bash
cp .env.example .env
```

No Windows PowerShell:

```powershell
Copy-Item .env.example .env
```

### 4) Instale as dependências

```bash
npm install
```

### 5) Gere o client do Prisma e rode a migration

```bash
npm run db:generate
npm run db:migrate -- --name init
```

### 6) Popule o banco com dados de exemplo

```bash
npm run db:seed
```

### 7) Rode o projeto

```bash
npm run dev
```

Acesse:

```bash
http://localhost:3000
```

## Fluxo principal da aplicação

1. cadastrar clientes e colaboradoras
2. registrar um novo lote com quantidade e prazo
3. lançar produção na tiradeira de linha
4. após concluir a tiradeira, lançar produção na passadeira
5. ao concluir a passadeira, o lote fica pronto para entrega
6. marcar a entrega quando a saída for realizada

## Regras de negócio implementadas

- cada lote nasce com duas etapas fixas: tiradeira de linha e passadeira
- a passadeira só recebe apontamento após a tiradeira concluir o lote
- o progresso não passa da quantidade total do lote
- ao concluir a passadeira, o lote muda automaticamente para **Pronto para entrega**
- ao marcar a entrega, o lote passa para **Entregue**

## Melhorias recomendadas para a próxima versão

- autenticação e perfis de acesso
- filtros avançados por cliente, prazo e status
- relatório por colaboradora e produtividade diária
- upload de comprovantes/fotos do lote
- notificações de atraso e vencimento
- modo tablet para produção no chão de fábrica
- dashboard gerencial com KPIs por período
- impressão de etiqueta por lote

## Observações técnicas

- o projeto está preparado para rodar com PostgreSQL usando Prisma
- a UI foi desenhada em modelo mobile-first, mas se adapta em telas maiores
- os componentes são reutilizáveis e organizados para evolução do produto
