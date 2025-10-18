# 📘 PLANO MESTRE (VERSÃO SIMPLIFICADA PARA IA)

## **1. Estrutura do Sistema**

```plaintext
sistemaddm/
├── docs/                  # Documentação
├── functions/             # Cloud Functions
│   ├── clients/           # Funções de clientes
│   ├── budgets/           # Funções de orçamentos
│   ├── projects/          # Funções de projetos
│   ├── pdfs/              # Geração de PDFs
│   ├── notifications/     # Notificações
│   └── index.ts           # Export central
├── src/                   # Frontend (Next.js)
│   ├── app/               # App Router
│   ├── components/        # Componentes reutilizáveis
│   ├── hooks/             # Custom hooks
│   ├── context/           # Context providers
│   ├── lib/               # Utilitários e tipos
│   └── pages/             # API Routes (legacy)
├── config/                # Configurações Firebase
├── .env.local             # Variáveis de ambiente
├── firebase.json          # Config Firebase
├── package.json           # Dependências
└── tsconfig.json          # Config TypeScript
```

---

## **2. Módulos Principais**

### **2.1. Comercial**

- **Descrição:** Gerenciamento de leads, clientes, orçamentos e projetos.
- **Principais Componentes:**
  - `LeadsTable.tsx`: Lista de leads.
  - `BudgetForm.tsx`: Formulário de orçamentos.
  - `CommercialDashboard.tsx`: Dashboard comercial.
- **Hooks:**
  - `useLeads.ts`: CRUD de leads.
  - `useBudgets.ts`: CRUD de orçamentos.

### **2.2. Produção**

- **Descrição:** Gerenciamento de fila de produção, provas e qualidade.
- **Principais Componentes:**
  - `ProductionDashboard.tsx`: Dashboard de produção.
  - `QueueManagement.tsx`: Gerenciamento de fila.
- **Hooks:**
  - `useProductionQueue.ts`: Fila de produção.
  - `useProofs.ts`: Provas e revisões.

### **2.3. Financeiro**

- **Descrição:** Controle de faturas e métricas financeiras.
- **Principais Componentes:**
  - `FinanceDashboard.tsx`: Dashboard financeiro.
- **Hooks:**
  - `useInvoices.ts`: Gerenciamento de faturas.

---

## **3. Design System**

### **3.1. Paleta de Cores**

- **Primary:** `#1e293b` (slate-800)
- **Secondary:** `#626c71` (slate-500)
- **Accent:** `#32b8c6` (blue-500)

### **3.2. Tipografia**

- **Fonte:** `Inter, sans-serif`
- **Tamanhos:** xs(11px), sm(12px), base(14px), lg(16px)

### **3.3. Componentes**

- **Botões:** `rounded-lg px-4 py-2 font-medium`
- **Cards:** `rounded-lg shadow-sm border p-6`

---

## **4. Cloud Functions**

### **4.1. Funções de Clientes**

- `assignClientNumber.ts`: Atribui número sequencial ao cliente.

### **4.2. Funções de Orçamentos**

- `createBudgetPdf.ts`: Gera PDF de orçamento.
- `onBudgetApproved.ts`: Trigger ao aprovar orçamento.

### **4.3. Funções de Projetos**

- `assignProjectCatalogCode.ts`: Atribui código ao projeto.

---

## **5. Dashboards**

### **5.1. Comercial**

- **Métricas:**
  - Funil de leads.
  - Receita ganha vs perdida.
  - Taxa de conversão.
- **Visualizações:**
  - Gráfico de funil.
  - Tabela de projetos críticos.

### **5.2. Produção**

- **Métricas:**
  - Fila de produção.
  - Projetos por status.
- **Visualizações:**
  - Kanban de projetos.
  - Calendário de prazos.

---

## **6. Regras e Padrões**

### **6.1. Região Firebase**

- **Região:** `southamerica-east1` (São Paulo, Brasil).

### **6.2. Estrutura de Tipos**

- **Local:** `src/lib/types/`
- **Principais Arquivos:**
  - `comercial.ts`: Tipos do módulo comercial.
  - `production.ts`: Tipos do módulo de produção.

### **6.3. Validações**

- **Local:** `src/lib/validations.ts`
- **Descrição:** Schemas para validação de dados.

---

## **7. Referências**

- [Guia de Deploy](docs/Progress/GUIA-DEPLOY-BUDGETS.md)
- [Auditoria de Tipos](docs/Progress/AUDITORIA-TYPES-2025-10-14.md)
- [Plano de Ação](docs/Progress/PLANO-ACAO-IMEDIATO-2025-10-14.md)

---

## 🎯 COMO USAR ESTA VERSÃO

- **Claude:** Use este documento para entender a estrutura e gerar código consistente.
- **Desenvolvedores:** Consulte para decisões rápidas sobre arquitetura e padrões.
