# 🛠️ MVPs Detalhados — Sistema Interno DDM (Atualizado 2025)

---

## ✅ MVP-1 — Base Funcional (já entregue)
**Objetivo:** Garantir login seguro e cadastros básicos para começar o uso do sistema.

### Funcionalidades
- Login (Firebase Auth) → acesso restrito por usuário.
- Clientes (/clients)
  - CRUD completo PF/PJ
  - `clientNumber` automático (Cloud Function)
  - Máscaras: CPF, CNPJ, telefone, CEP, email
- Projetos (/projects)
  - Vinculados a cliente
  - `catalogCode` automático (DDML0459, DDML0459.1…)
  - Tarefas padrão: Revisão, Capa, Diagramação, ISBN
- Faturas (/invoices)
  - Criar/listar faturas simples (valor R$, vencimento, status)

### Infraestrutura
- Next.js (app router) no `src/`
- Firestore com coleções: `clients`, `projects`, `invoices`
- Cloud Functions: `assignClientNumber`, `assignProjectCatalogCode`

---

## 🔄 MVP-2 — CRM + Financeiro (em andamento)
**Objetivo:** Transformar Leads em Clientes e automatizar pedidos/ordens de serviço.

### Funcionalidades
- CRM (/crm/leads, /crm/quotes)
  - Leads com indicação, redes sociais e origem
  - Funil Kanban (Contato → Qualificação → Negociação → Orçamento → Ganho/Perdido)
  - Orçamentos (quotes) em PDF com branding da empresa
  - Orçamento assinado → cria automaticamente:
    - Cliente (se não existir)
    - Projeto vinculado
    - Pedido (Financeiro)
    - OS com tarefas padrão
- Financeiro (/finance/orders)
  - Pedidos a partir de orçamentos aprovados
  - Controle de pagamentos: entrada + parcelas ou à vista
  - Status automático: parcial/pago/atrasado
- Produção
  - OS com tarefas padrão, painel Kanban
- Relatórios (/reports)
  - Projetos em andamento
  - Faturas pendentes
  - Alertas de prazo

### Infraestrutura
- Cloud Functions principais:
  - `onQuoteSigned` (gera Cliente + Projeto + Pedido)
  - `createQuotePdf` e `createInvoicePdf` (PDFs via Storage + URL assinada)
  - `assignClientNumber`, `assignProjectCatalogCode`, `backfillCatalogCodes`
  - `onProjectReadyForPrint` (gera compras)
- Masks adicionais: valores sempre em R$
- Fonts empacotadas (`Inter-Regular`, `Inter-Bold`)
- PDFs com componentes reutilizáveis (header, footer, tabelas, totais, rodapé com paginação)

### Problemas resolvidos
- Erro `admin.storage is not a function` → corrigido com `getStorage().bucket()`
- PDFs girados/em branco → resolvido com `autoFirstPage: false` + retrato explícito
- Fontes não encontradas (`ENOENT`) → corrigido copiando fonts no build
- Bucket inexistente → corrigido para `ddmsistema.firebasestorage.app`

### Pendências
- Ajustar templates de PDF (logo com fallback, cabeçalho, tabela de itens, totais, rodapé)
- `/invoices/[id]/page.tsx`: remover export default duplicado
- Lista `/invoices`: implementar botão “Nova fatura”
- Corrigir botão “Abrir orçamento” nos leads (abrir existentes em vez de criar novo)
- Regras Firestore/Storage finais: escrita autenticada, PDFs só via Signed URL
- Atualizar `firebase-functions` para versão >= 5.1.0

---

## 🚀 MVP-3 — Compras, Logística, Marketing, Dashboards (próximo)
**Objetivo:** Integrar a cadeia de produção até entrega e gestão de resultados.

### Funcionalidades
- Compras (/purchases)
  - Solicitações automáticas (“Pronto p/ Gráfica” → gera purchase)
  - Cadastro de fornecedores e cotações
  - Custos aprovados enviados ao Financeiro
- Logística (/logistics)
  - Cadastro de gráficas/transportadoras
  - Registro de envio: transportadora, rastreio, status
  - Notificação automática ao cliente com link de rastreio
  - Alerta ao Financeiro para emissão de NF-e
- Marketing (/marketing)
  - Leads de campanhas entram no CRM
  - Gestão de lançamentos: calendário por livro/projeto
  - ROI por canal (origem do lead)
  - Biblioteca de assets de mídia
- Dashboards executivos (/dashboards)
  - Receita total, fluxo de caixa, inadimplência
  - Origem de leads e taxa de conversão
  - % de tarefas concluídas, gargalos de produção
  - ROI de campanhas

### Infraestrutura
- Cloud Functions: `onProjectApproved`, integração logística → Financeiro
- Storage: upload e histórico de arquivos (capa, miolo, contratos)

---

## 🌐 MVP-4 — Integrações Externas (futuro)
**Objetivo:** Expandir automação e escalabilidade.

### Funcionalidades
- Pagamentos online (Stripe/Mercado Pago) → checkout de faturas
- Assinatura digital (Clicksign/D4Sign) → orçamentos e contratos
- WhatsApp API → notificações automáticas (pedido aprovado, fatura, rastreio)
- IA integrada → relatórios executivos, geração de textos de marketing, sugestões de capa

---

## 📌 Linha do tempo sugerida
1. MVP-1 (✅ entregue)
2. MVP-2 (🔄 em andamento, 2 a 3 sprints restantes)
3. MVP-3 (⏭️ próximo, 3 a 4 sprints)
4. MVP-4 (🚀 futuro, após estabilização do sistema)

