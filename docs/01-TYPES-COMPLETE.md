# Sistema DDM - Tipos e Interfaces Completas

> **⚠️ DOCUMENTO CRÍTICO:** Sempre consultar antes de gerar código!  
> **📅 Última Atualização:** 14 de outubro de 2025  
> **🔄 MIGRAÇÃO:** Budget foi renomeado para Budget. Ver seção [BUDGETS](#budgets)

## 🎯 Importância

Este documento contém **TODOS os tipos TypeScript atualizados** do sistema. Qualquer código gerado deve ser 100% compatível com estes tipos.

## ⚠️ AVISOS IMPORTANTES

## 📚 ÍNDICE

1. [LEADS](#leads)
2. [CLIENTS](#clients)
3. [BOOKS (Livros/Catálogo)](#books)
4. [BUDGETS (Orçamentos)](#budgets) ✅ **ATUAL**
5. [ORDERS (Pedidos)](#orders)
6. [PRODUCTION PROJECTS (Produção)](#production-projects)
7. [PROJECTS (Gerenciamento CRM)](#projects)
8. [~~QUOTES~~](#budgets-deprecado) ⚠️ **DEPRECADO** - Usar BUDGETS
9. [MÉTRICAS](#metricas)
10. [LIVROS (Projetos Editoriais)](#livros)
11. [ORÇAMENTOS](#orcamentos)
12. [PEDIDOS](#pedidos)
13. [PROJETOS (Produção)](#projetos-producao)
14. [PROJECTS (Gerenciamento)](#projects)
15. [QUOTES (Legado)](#budgets)
16. [PRODUTOS](#produtos)
17. [MÉTRICAS](#metricas)

---

## 📊 LEADS

### Interface Principal

```typescript
// src/lib/types/leads.ts

import { Timestamp } from 'firebase/firestore';

export interface Lead {
  id?: string;
  name: string;
  email?: string;
  phone?: string;
  company?: string;
  source: LeadSource;
  status: LeadStatus;
  indication?: string;
  value?: number;
  probability?: number;
  ownerId: string;
  ownerName: string;
  notes?: string;
  tags?: string[];

  // Novos campos - conversão
  clienteId?: string;        // Preenchido quando converter
  convertidoEm?: Timestamp;  // Data da conversão
  orcamentos?: string[];     // IDs dos orçamentos vinculados

  createdAt: Timestamp;
  updatedAt: Timestamp;
}
```

### Enums

```typescript
export type LeadStatus =
  | 'primeiro_contato'
  | 'qualificado'
  | 'proposta_enviada'
  | 'negociacao'
  | 'fechado_ganho'
  | 'fechado_perdido'
  | 'convertido';  // ← NOVO

export type LeadSource =
  | 'website'
  | 'socialmedia'
  | 'referral'
  | 'advertising'
  | 'email'
  | 'phone'
  | 'coldcall'
  | 'event'
  | 'other';
```

### Tipos de Formulário

```typescript
export interface LeadFormData {
  name: string;
  email?: string;
  phone?: string;
  company?: string;
  source: LeadSource;
  status: LeadStatus;
  indication?: string;
  value?: number;
  probability?: number;
  notes?: string;
  tags?: string[];
}
```

---

## 👥 CLIENTS

### Interface Principal

```typescript
// src/lib/types/clients.ts

import { Timestamp } from 'firebase/firestore';

export interface Client {
  id?: string;
  type: 'individual' | 'company';
  name: string;
  email?: string;
  phone?: string;
  document: string; // CPF ou CNPJ
  status: ClientStatus;

  // Catálogo DDM
  numeroCatalogo: number;      // Ex: 456 (vira "0456" no código)
  totalTrabalhos: number;       // Contador de livros/projetos

  // Origem
  origemLeadId?: string;        // ID do lead que originou

  address?: ClientAddress;
  tags?: string[];
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface ClientAddress {
  street: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;
  zipCode: string;
}

export type ClientStatus = 'active' | 'inactive';
```

---

## 📚 LIVROS (Projetos Editoriais)

### Enums de Especificações Técnicas

```typescript
// src/lib/types/livros.ts

export enum TipoProjetoCatalogo {
  LIVRO = 'L',
  EBOOK = 'E',
  KINDLE = 'K',
  CD = 'C',
  DVD = 'D',
  GRAFICA = 'G',
  PLATAFORMA = 'P',
  SINGLE = 'S',
  LIVRO_TERCEIROS = 'X',
  ARTE_DESIGN = 'A',
  CUSTOM = 'CUSTOM'
}

export enum FormatoLivro {
  F_140x210 = '140x210mm',
  F_160x230 = '160x230mm',
  F_A4 = 'A4 (210x297mm)',
  PERSONALIZADO = 'Personalizado'
}

export enum PapelMiolo {
  AVENA_80G = 'Avena 80g',
  POLEN_SOFT_80G = 'Pólen Soft 80g',
  POLEN_BOLD_90G = 'Pólen Bold 90g',
  COUCHE_115G = 'Couché 115g',
  COUCHE_150G = 'Couché 150g',
  OFFSET_90G = 'Offset 90g',
  PERSONALIZADO = 'Personalizado'
}

export enum PapelCapa {
  TRILEX_330G = 'Trilex 330g',
  SUPREMO_250G = 'Supremo 250g',
  SUPREMO_350G = 'Supremo 350g',
  COUCHE_250G = 'Couché 250g',
  PERSONALIZADO = 'Personalizado'
}

export enum CorMiolo {
  C_1x1 = '1x1 cor',
  C_2x2 = '2x2 cores',
  C_4x4 = '4x4 cores',
  PERSONALIZADO = 'Personalizado'
}

export enum CorCapa {
  C_4x0 = '4x0 cor',
  C_4x1 = '4x1 cor',
  C_4x4 = '4x4 cores',
  PERSONALIZADO = 'Personalizado'
}

export enum TipoEncadernacao {
  BROCHURA = 'Brochura',
  CAPA_DURA = 'Capa dura',
  GRAMPO_CANOA = 'Grampo canoa',
  COSTURA = 'Costura',
  PERSONALIZADO = 'Personalizado'
}

export enum TipoAcabamento {
  LAMINACAO_FOSCA = 'Laminação Fosca',
  LAMINACAO_FOSCA_VERNIZ = 'Laminação Fosca + Verniz com Reserva',
  LAMINACAO_BRILHO = 'Laminação Brilho',
  VERNIZ = 'Verniz',
  VERNIZ_RESERVA = 'Verniz com Reserva',
  HOT_STAMPING = 'Hot Stamping',
  PERSONALIZADO = 'Personalizado'
}
```

### Interface de Especificações

```typescript
export interface EspecificacoesLivro {
  // Formato
  formato: FormatoLivro;
  formatoPersonalizado?: string;

  // Capa
  capa: {
    papel: PapelCapa;
    papelPersonalizado?: string;
    cor: CorCapa;
    corPersonalizada?: string;
    acabamento: TipoAcabamento;
    acabamentoPersonalizado?: string;
    temOrelha: boolean;
  };

  // Miolo
  miolo: {
    numeroPaginas: number;
    papel: PapelMiolo;
    papelPersonalizado?: string;
    cor: CorMiolo;
    corPersonalizada?: string;
  };

  // Encadernação
  encadernacao: TipoEncadernacao;
  encadernacaoPersonalizada?: string;

  // Acabamento final
  temShrink: boolean;

  // Observações
  observacoes?: string;
}
```

### Interface Principal do Livro

```typescript
export interface Livro {
  id: string;
  clienteId: string;

  // Catálogo DDM
  codigoCatalogo: string;  // Ex: "DDML0456" ou "DDML0456.1"
  catalogoMetadata: {
    prefixo: 'DDM';
    tipo: TipoProjetoCatalogo;
    numeroCliente: number;    // 456
    numeroTrabalho: number;   // 1, 2, 3...
  };

  // Dados do livro
  titulo: string;
  subtitulo?: string;
  autor: string;
  isbn?: string;

  // Especificações técnicas
  especificacoes: EspecificacoesLivro;

  // Arquivos
  arquivosReferencia?: {
    nome: string;
    url: string;
    tipo: 'pdf' | 'boneco' | 'arte' | 'outro';
    uploadedAt: Timestamp;
  }[];

  // Observações
  observacoes?: string;

  createdAt: Timestamp;
  updatedAt: Timestamp;
  createdBy: string;
}
```

---

## 💰 BUDGETS (Orçamentos)

> ✅ **ATUAL** - Substitui Budgets a partir de 14/10/2025

### Enums de Serviços

```typescript
// src/lib/types/budgets.ts

export enum EditorialServiceType {
  REVISION = 'Revisão',
  PREPARATION = 'Preparação',
  COPYEDIT = 'Copidesque',
  GRAPHIC_DESIGN = 'Criação do projeto gráfico',
  LAYOUT = 'Diagramação',
  COVER = 'Capa',
  EBOOK_FORMAT = 'Formatação eBook',
  KINDLE_CONVERSION = 'Conversão Kindle',
  ISBN = 'ISBN',
  CATALOG_CARD = 'Ficha Catalográfica',
  PRINTING = 'Impressão',
  SOCIAL_MEDIA = 'Divulgação Rede Sociais',
  MARKETING_CAMPAIGN = 'Campanha de Marketing',
  CUSTOM = 'Personalizado',
}

export enum ExtraType {
  PROOFS = 'Provas',
  SHIPPING = 'Frete',
  CUSTOM = 'Personalizado',
}

export type BudgetStatus = 'draft' | 'sent' | 'approved' | 'rejected' | 'expired';
```

### Itens do Orçamento

```typescript
export interface BudgetItemBase {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  notes?: string;
}

export interface EditorialServiceItem extends BudgetItemBase {
  type: 'editorial_service';
  service: EditorialServiceType;
  customService?: string;
  estimatedDays?: number;
}

export interface PrintingItem extends BudgetItemBase {
  type: 'printing';
  printRun: number; // tiragem
  useBookSpecs: boolean;
  customSpecs?: Partial<BookSpecifications>;
  productionDays?: number;
}

export interface ExtraItem extends BudgetItemBase {
  type: 'extra';
  extraType: ExtraType;
  customExtra?: string;
}

export type BudgetItem = EditorialServiceItem | PrintingItem | ExtraItem;
```

### Dados Temporários do Projeto

```typescript
export interface ProjectData {
  title: string;
  subtitle?: string;
  author?: string;
  specifications?: BookSpecifications; // Se for livro
}
```

### Interface Principal do Budget

```typescript
export interface Budget {
  id?: string;
  number: string; // v5_1310.1435
  version: number;

  // RELACIONAMENTOS OPCIONAIS (flexível para Lead ou Cliente)
  leadId?: string; // Lead que originou (orçamento novo)
  clientId?: string; // Cliente existente (reimpressão)
  bookId?: string; // Livro existente (reimpressão)

  // TIPO DO PROJETO
  projectType?: ProjectCatalogType; // L, E, K, C, etc

  // DADOS TEMPORÁRIOS DO PROJETO (se não tiver bookId)
  projectData?: ProjectData;

  // ITENS
  items: BudgetItem[];

  // VALORES
  subtotal: number;
  discount?: number;
  discountPercentage?: number;
  total: number;

  // CONDIÇÕES COMERCIAIS
  paymentMethods: string[];
  validityDays: number;
  productionDays?: number; // manual
  clientProvidedMaterial: boolean;
  materialDescription?: string;
  notes?: string;

  // STATUS
  status: BudgetStatus;

  // DATAS
  issueDate: Timestamp;
  expiryDate: Timestamp;
  approvalDate?: Timestamp;

  createdAt: Timestamp;
  updatedAt: Timestamp;
  createdBy: string;
}
```

### Funções Auxiliares

```typescript
// Gera número: v5_1310.1435
export function generateBudgetNumber(): string {
  const now = new Date();
  const year = now.getFullYear();
  const versionYear = `v${year - 2020}`;

  const day = now.getDate().toString().padStart(2, '0');
  const month = (now.getMonth() + 1).toString().padStart(2, '0');
  const hour = now.getHours().toString().padStart(2, '0');
  const minute = now.getMinutes().toString().padStart(2, '0');

  return `${versionYear}_${day}${month}.${hour}${minute}`;
}

export function calculateSubtotal(items: BudgetItem[]): number {
  return items.reduce((sum, item) => sum + item.totalPrice, 0);
}

export function calculateTotal(
  subtotal: number,
  discount?: number,
  discountPercentage?: number,
): number {
  let total = subtotal;

  if (discountPercentage) {
    total -= (subtotal * discountPercentage) / 100;
  }

  if (discount) {
    total -= discount;
  }

  return Math.max(0, total);
}
```

---

## 📋 ORDERS (Pedidos)

```typescript
// src/lib/types/pedidos.ts

export enum StatusPedido {
  AGUARDANDO_CONFIRMACAO = 'aguardando_confirmacao',
  CONFIRMADO = 'confirmado',
  EM_PRODUCAO = 'em_producao',
  CONCLUIDO = 'concluido',
  CANCELADO = 'cancelado'
}

export interface Pedido {
  id: string;
  numero: string;  // Ex: "PED-2025-001"

  // Relacionamentos
  clienteId: string;
  livroId: string;
  orcamentoId: string;  // Orçamento que originou

  // Snapshot dos dados (no momento da aprovação)
  dadosCliente: {
    nome: string;
    email: string;
    telefone: string;
    documento: string;
    endereco?: string;
  };

  dadosLivro: {
    titulo: string;
    autor: string;
    codigoCatalogo: string;
    especificacoes: EspecificacoesLivro;
  };

  // Itens confirmados (snapshot do orçamento)
  itens: OrcamentoItem[];

  // Valores
  valorTotal: number;

  // Status e datas
  status: StatusPedido;
  dataEmissao: Timestamp;
  dataConfirmacao?: Timestamp;
  dataConclusao?: Timestamp;

  // Condições aprovadas
  condicoesComerciais: Orcamento['condicoesComerciais'];

  // Pagamentos
  pagamentos?: {
    id: string;
    data: Timestamp;
    valor: number;
    formaPagamento: string;
    comprovante?: string;
    status: 'pendente' | 'confirmado' | 'cancelado';
  }[];

  // Observações
  observacoes?: string;

  createdAt: Timestamp;
  updatedAt: Timestamp;
  createdBy: string;
}
```

---

## 🎬 PROJETOS (Produção)

```typescript
// src/lib/types/projetos-producao.ts

export enum StatusProjeto {
  NAO_INICIADO = 'nao_iniciado',
  EM_ANDAMENTO = 'em_andamento',
  PAUSADO = 'pausado',
  CONCLUIDO = 'concluido',
  CANCELADO = 'cancelado'
}

export enum StatusEtapa {
  PENDENTE = 'pendente',
  EM_ANDAMENTO = 'em_andamento',
  AGUARDANDO_APROVACAO = 'aguardando_aprovacao',
  APROVADO = 'aprovado',
  CONCLUIDO = 'concluido',
  CANCELADO = 'cancelado'
}

export enum TipoEtapaProjeto {
  PREPARACAO_TEXTO = 'preparacao_texto',
  REVISAO = 'revisao',
  DIAGRAMACAO = 'diagramacao',
  CRIACAO_CAPA = 'criacao_capa',
  CRIACAO_ISBN = 'criacao_isbn',
  APROVACAO_CLIENTE = 'aprovacao_cliente',
  IMPRESSAO = 'impressao',
  ACABAMENTO = 'acabamento',
  ENTREGA = 'entrega',
  OUTRO = 'outro'
}

export interface EtapaProjeto {
  id: string;
  tipo: TipoEtapaProjeto;
  nome: string;
  descricao?: string;

  // Status e datas
  status: StatusEtapa;
  dataInicio?: Timestamp;
  dataPrevisao?: Timestamp;
  dataConclusao?: Timestamp;

  // Responsável
  responsavelId?: string;
  responsavelNome?: string;

  // Arquivos e entregas
  arquivos?: {
    nome: string;
    url: string;
    tipo: 'entrega' | 'aprovacao' | 'referencia';
    uploadedAt: Timestamp;
  }[];

  // Observações
  observacoes?: string;

  // Vínculo com item do pedido
  itemPedidoId?: string;
}

export interface ProjetoProducao {
  id: string;
  numero: string;  // Ex: "PROJ-2025-001"

  // Relacionamentos
  clienteId: string;
  livroId: string;
  pedidoId: string;

  // Dados básicos
  titulo: string;
  descricao?: string;

  // Status e datas
  status: StatusProjeto;
  dataInicio?: Timestamp;
  dataPrevisaoConclusao?: Timestamp;
  dataConclusao?: Timestamp;

  // Etapas
  etapas: EtapaProjeto[];

  // Equipe
  equipe?: {
    userId: string;
    userName: string;
    papel: string;  // Ex: "Revisor", "Diagramador", "Gerente"
  }[];

  // Timeline e atualizações
  atualizacoes?: {
    id: string;
    data: Timestamp;
    userId: string;
    userName: string;
    tipo: 'observacao' | 'etapa_concluida' | 'arquivo_adicionado' | 'mudanca_status';
    descricao: string;
  }[];

  // Observações
  observacoes?: string;
  observacoesInternas?: string;

  createdAt: Timestamp;
  updatedAt: Timestamp;
  createdBy: string;
}
```

---

## 📁 PROJECTS (Gerenciamento - Legado)

```typescript
// src/lib/types/projects.ts
// Mantido para compatibilidade com sistema existente

export interface Project {
  id?: string;
  name: string;
  description?: string;
  clientId: string;
  clientName: string;
  status: ProjectStatus;
  priority: ProjectPriority;
  startDate: Timestamp;
  endDate?: Timestamp;
  budget?: number;
  actualCost?: number;
  progress: number;
  teamMembers: ProjectMember[];
  tags?: string[];
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export type ProjectStatus =
  | 'planning'
  | 'in_progress'
  | 'on_hold'
  | 'completed'
  | 'cancelled';

export type ProjectPriority =
  | 'low'
  | 'medium'
  | 'high'
  | 'urgent';

export interface ProjectMember {
  userId: string;
  userName: string;
  role: string;
}
```

---

## ~~💵 QUOTES~~ (DEPRECADO)

> ⚠️ **DEPRECADO desde 14/10/2025**  
> **Use:** [BUDGETS](#budgets) ao invés de Budgets  
> **Motivo:** Renomeação para padronização (Budget → Budget)  
> **Migração:** Ver [Documento 08](Progress/08-DOCUMENTO%20DE%20MIGRAÇÃO%20E%20PADRONIZAÇÃO.md)

### ❌ Não Use Mais

```typescript
// ❌ DEPRECADO - NÃO USAR
// src/lib/types/budgets.ts

export interface Budget {
  id?: string;
  budgetNumber: string;           // ← Agora é "number" em Budget
  status: BudgetStatus;            // ← Agora é "BudgetStatus"
  // ...
}

export type BudgetStatus =
  | 'draft'
  | 'sent'
  | 'viewed'      // ← REMOVIDO (não existe em Budget)
  | 'signed'      // ← Agora é 'approved' em Budget
  | 'rejected'
  | 'expired';
```

### ✅ Use Budget

Ver seção [BUDGETS](#budgets) para a interface atual.

**Principais mudanças:**

- `Budget` → `Budget`
- `budgetNumber` → `number`
- `BudgetStatus.signed` → `BudgetStatus.approved`
- `BudgetStatus.viewed` → removido
- `totals.total` → `total` (simplificado)
- `projectTitle` → `projectData.title` (estruturado)

---

## 📦 PRODUTOS

```typescript
// src/lib/types/products.ts

export interface Product {
  id?: string;
  name: string;
  description?: string;
  category: ProductCategory;
  price: number;
  cost?: number;
  stock?: number;
  unit: string;
  active: boolean;
  tags?: string[];
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export type ProductCategory =
  | 'service'
  | 'material'
  | 'equipment'
  | 'other';
```

---

## 📊 MÉTRICAS

```typescript
// src/hooks/comercial/useCommercialMetrics.ts

export interface CommercialMetrics {
  monthlyRevenue: number;
  activeLeads: number;
  totalBudgets: number;
  conversionRate: number;
  revenueData: RevenueData[];
  funnelData: FunnelData[];
  leadsBySource: SourceData[];
  budgetsByStatus: StatusData[];
  criticalProjects: Project[];
}

export interface RevenueData {
  period: string;
  revenue: number;
  expenses: number;
  profit: number;
}

export interface FunnelData {
  status: LeadStatus;
  count: number;
  value: number;
  percentage: number;
}

export interface SourceData {
  source: LeadSource;
  count: number;
  percentage: number;
  label: string;
}

export interface StatusData {
  status: BudgetStatus;
  count: number;
  value: number;
  percentage: number;
  label: string;
}
```

---

## 🔑 FUNÇÕES AUXILIARES

### Geração de Números

```typescript
// Número do orçamento: v5_1310.1435
export function gerarNumeroOrcamento(): string {
  const agora = new Date();
  const versaoAno = `v${agora.getFullYear() - 2020}`;
  const dia = agora.getDate().toString().padStart(2, '0');
  const mes = (agora.getMonth() + 1).toString().padStart(2, '0');
  const hora = agora.getHours().toString().padStart(2, '0');
  const minuto = agora.getMinutes().toString().padStart(2, '0');

  return `${versaoAno}_${dia}${mes}.${hora}${minuto}`;
}

// Código do catálogo: DDML0456, DDML0456.1
export function gerarCodigoCatalogo(
  tipo: TipoProjetoCatalogo,
  numeroCliente: number,
  numeroTrabalho: number
): string {
  const clienteFormatado = numeroCliente.toString().padStart(4, '0');
  const base = `DDM${tipo}${clienteFormatado}`;

  if (numeroTrabalho === 1) {
    return base;  // DDML0456
  }

  return `${base}.${numeroTrabalho - 1}`;  // DDML0456.1
}
```

---

## ⚠️ CAMPOS OBRIGATÓRIOS (Checklist)

### Lead

- ✅ `name: string`
- ✅ `source: LeadSource`
- ✅ `status: LeadStatus`
- ✅ `ownerId: string`
- ✅ `ownerName: string`

### Client

- ✅ `type: 'individual' | 'company'`
- ✅ `name: string`
- ✅ `document: string`
- ✅ `status: ClientStatus`
- ✅ `numeroCatalogo: number`
- ✅ `totalTrabalhos: number`

### Livro

- ✅ `clienteId: string`
- ✅ `codigoCatalogo: string`
- ✅ `catalogoMetadata: {...}`
- ✅ `titulo: string`
- ✅ `autor: string`
- ✅ `especificacoes: EspecificacoesLivro`

### Budget (Orçamento)

- ✅ `number: string` (formato v5_1310.1435)
- ✅ `projectType?: ProjectCatalogType`
- ✅ `projectData?: ProjectData`
- ✅ `items: BudgetItem[]`
- ✅ `total: number`
- ✅ `status: BudgetStatus`
- ✅ `validityDays: number`

### Order (Pedido)

- ✅ `number: string`
- ✅ `clientId: string`
- ✅ `bookId: string`
- ✅ `budgetId: string`
- ✅ `status: OrderStatus`
- ✅ `total: number`

### Projeto Produção

- ✅ `numero: string`
- ✅ `pedidoId: string`
- ✅ `titulo: string`
- ✅ `status: StatusProjeto`
- ✅ `etapas: EtapaProjeto[]`

---

## 🚫 CAMPOS QUE NÃO EXISTEM

````typescript
// ❌ NUNCA usar estes campos:

// Lead
lead.leadNumber      // Não existe!
lead.stage           // Usar 'status'
lead.lastContactAt   // Não existe!

// Client
client.clientCode    // Usar 'numeroCatalogo'

// Book
book.projectCode     // Usar 'catalogCode'

// Budget (Orçamento)
budget.budgetNumber   // ❌ Era Budget - Usar 'number'
budget.totals.total  // ❌ Simplificado - Usar 'total'
budget.projectTitle  // ❌ Mudou - Usar 'projectData.title'

// Budget
budget.*              // ❌ DEPRECADO - Usar Budget
```amento.budgetNumber // Usar 'numero'
````

---

## 💡 REGRAS IMPORTANTES

### 1. Timestamps

```typescript
// ✅ CORRETO
import { Timestamp } from 'firebase/firestore';
createdAt: Timestamp.now()

// ❌ ERRADO
createdAt: new Date()
```

### 2. Enums

```typescript
// ✅ CORRETO
status: 'primeiro_contato'
tipo: TipoProjetoCatalogo.LIVRO

// ❌ ERRADO
status: 'new'
tipo: 'book'
```

### 3. Campos Opcionais

```typescript
// Sempre verificar se existe antes de usar
if (lead.email) {
  sendEmail(lead.email);
}
```

---

> **📝 NOTA:** Ao gerar código, SEMPRE copie os tipos exatos deste documento!
> **🔄 ATUALIZAÇÃO:** Este documento é atualizado constantemente. Verifique a data no topo.
