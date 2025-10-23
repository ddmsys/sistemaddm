# 🔍 RELATÓRIO DE INCONSISTÊNCIAS - DOCUMENTAÇÃO vs CÓDIGO REAL

**Data:** 18 de outubro de 2025  
**Versão:** 1.0  
**Status:** 🔴 CRÍTICO - 12 inconsistências graves identificadas

---

## 📋 ÍNDICE

1. [Resumo Executivo](#-resumo-executivo)
2. [Inconsistências Críticas](#-inconsistências-críticas)
3. [Inconsistências de Estrutura](#-inconsistências-de-estrutura)
4. [Inconsistências de Nomenclatura](#-inconsistências-de-nomenclatura)
5. [Inconsistências de Status](#-inconsistências-de-status)
6. [Componentes Documentados vs Existentes](#-componentes-documentados-vs-existentes)
7. [Cloud Functions](#-cloud-functions)
8. [Plano de Correção](#-plano-de-correção)
9. [Ações Imediatas](#-ações-imediatas)

---

## 🎯 RESUMO EXECUTIVO

### Documentos Analisados

1. ✅ `Plano_Mestre_DDM.md` (14/out/2025)
2. ✅ `PLANO-MESTRE-INTEGRADO-COMPLETO.md` (18/out/2025)
3. ✅ `ROADMAP-COMPLETO-SISTEMA-DDM.md` (18/out/2025)
4. ✅ `ANALISE-DETALHADA-ESTRUTURA-2025-10-18.md` (CÓDIGO REAL)

### Estatísticas

| Categoria                        | Quantidade | Severidade |
| -------------------------------- | ---------- | ---------- |
| **Inconsistências Críticas**     | 5          | 🔴 ALTA    |
| **Inconsistências Estrutura**    | 4          | 🟠 MÉDIA   |
| **Inconsistências Nomenclatura** | 3          | 🟡 BAIXA   |
| **TOTAL**                        | **12**     | -          |

### Impacto no Desenvolvimento

- 🔴 **2 bugs críticos** impedem funcionamento do sistema
- 🟠 **4 inconsistências** causam confusão no desenvolvimento
- 🟡 **6 diferenças** entre docs são apenas documentais

---

## 🔴 INCONSISTÊNCIAS CRÍTICAS

### 1. CLOUD FUNCTION NÃO VERIFICA STATUS ⚠️ BLOQUEIA SISTEMA

**Descrição:** A função `onBudgetApproved` executa em QUALQUER atualização do budget, não apenas quando o status muda para "approved".

**Documentação diz:**

```typescript
// PLANO-MESTRE-INTEGRADO-COMPLETO.md linha 99
"✅ onBudgetSigned - Trigger de aprovação"
"Cria Cliente automaticamente"
```

**Código real:**

```typescript
// functions/src/budgets/onBudgetApproved.ts:30
export const onBudgetApproved = onDocumentUpdated(
  { document: "budgets/{budgetId}" },
  async (event) => {
    const before = event.data?.before?.data();
    const after = event.data?.after?.data();

    if (!before || !after) return;
    // ❌ PROBLEMA: Não verifica mudança de status!
    // Lógica executada em TODA atualização
  }
);
```

**Impacto:** 🔴 CRÍTICO

- Sistema nunca cria Cliente, Book, Order automaticamente
- Conversão de Budget → Projeto NUNCA acontece
- Fluxo principal do sistema está quebrado

**Correção:**

```typescript
// ✅ SOLUÇÃO
if (!before || !after) return;

// Verifica mudança de status
if (before.status !== "approved" && after.status === "approved") {
  const budgetId = event.params.budgetId;
  await convertBudgetToClientBookOrder(budgetId);
}
```

**Tempo de correção:** 30 minutos  
**Prioridade:** 🔴 P0 (URGENTÍSSIMO)

---

### 2. HOOK NÃO USA FUNÇÃO DA LIB ⚠️ BLOQUEIA CONVERSÃO

**Descrição:** O hook `useBudgets.approveBudget()` apenas muda o status, mas NÃO executa a conversão completa que está implementada em `lib/firebase/budgets/approveBudget.ts`.

**Documentação diz:**

```
// PLANO-MESTRE-INTEGRADO-COMPLETO.md linha 196-205
"6. Verificar criação automática:
   - Cliente (se não existia)
   - Book com catalogCode
   - Order com número
   - ProductionProject"
```

**Código real:**

```typescript
// ❌ Hook atual (src/hooks/comercial/useBudgets.ts)
const approveBudget = async (id: string): Promise<void> => {
  await updateDoc(doc(db, "budgets", id), {
    status: "approved",
  });
  // ❌ Só muda status, não faz conversão!
};
```

**Código correto existe mas não é usado:**

```typescript
// ✅ Função completa existe em lib/firebase/budgets/approveBudget.ts
export async function approveBudget(
  budgetId: string,
  userId: string,
): Promise<ApproveBudgetResult> {
  // 1. Cria Client ✅
  // 2. Cria Book ✅
  // 3. Cria Order ✅
  // 4. Cria ProductionProject ✅
  // 5. Atualiza Budget ✅
}
```

**Impacto:** 🔴 CRÍTICO

- Hook não faz a conversão completa
- Função correta existe mas nunca é chamada
- Sistema tem 2 lógicas diferentes para a mesma ação

**Correção:**

```typescript
// ✅ SOLUÇÃO (useBudgets.ts)
import { approveBudget as approveBudgetLib } from "@/lib/firebase/budgets/approveBudget";

const approveBudget = async (id: string): Promise<void> => {
  if (!user) throw new Error("Not authenticated");

  // Chama função completa da lib
  const result = await approveBudgetLib(id, user.uid);

  return result;
};
```

**Tempo de correção:** 15 minutos  
**Prioridade:** 🔴 P0 (URGENTÍSSIMO)

---

### 3. NOME DA FUNÇÃO: "onBudgetApproved" vs "onBudgetSigned"

**Descrição:** Documentação usa "onBudgetSigned" mas código real usa "onBudgetApproved".

**Documentação:**

```
// PLANO-MESTRE-INTEGRADO-COMPLETO.md linha 99
"✅ onBudgetSigned - Trigger de aprovação"

// ROADMAP linha 261
"Nome Correto da Função: onBudgetApproved (não onBudgetSigned)"
```

**Código real:**

```typescript
// functions/src/budgets/onBudgetApproved.ts
export const onBudgetApproved = functions.firestore...
```

**Impacto:** 🟡 BAIXO (apenas documentação)

- Código está correto usando "onBudgetApproved"
- Documentos estão misturados

**Decisão:** Padronizar documentação para "onBudgetApproved"  
**Prioridade:** 🟢 P2

---

### 4. STATUS: "approved" vs "signed"

**Descrição:** Documentação quer "signed" mas código usa "approved" em todo lugar.

**Documentação diz:**

```
// PLANO-MESTRE-INTEGRADO-COMPLETO.md linha 112
"❌ Status approved vs signed (doc não bate com código)"

// PLANO-MESTRE-INTEGRADO-COMPLETO.md linha 144
"- [ ] Padronizar status para 'signed' (documentação oficial)"
```

**Código real:**

```typescript
// CÓDIGO USA "approved" CONSISTENTEMENTE:

// src/lib/types/budgets.ts
export type BudgetStatus = "draft" | "sent" | "approved" | "rejected";

// src/hooks/comercial/useBudgets.ts
await updateDoc(doc(db, "budgets", id), {
  status: "approved",  // ✅ "approved"
});

// functions/src/budgets/onBudgetApproved.ts
// Trigger: onBudgetApproved (nome da função)
```

**Impacto:** 🔴 CRÍTICO (decisão necessária)

- **Código inteiro usa "approved"** ✅
- **Documentação pede "signed"** ❌

**Recomendação:**

- **MANTER "approved"** no código (já implementado)
- **ATUALIZAR** documentação para "approved"
- **MOTIVO:** Mudar código causaria retrabalho massivo

**Prioridade:** 🔴 P0 (decisão urgente)

---

### 5. CREDENCIAIS FIREBASE EXPOSTAS NA DOCUMENTAÇÃO 🔐

**Descrição:** Plano_Mestre_DDM.md contém credenciais reais do Firebase.

**Código exposto:**

```typescript
// Plano_Mestre_DDM.md linhas 1174-1179
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=sistemaddm-dev.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=sistemaddm-dev
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=sistemaddm-dev.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=825537655768
NEXT_PUBLIC_FIREBASE_APP_ID=1:825537655768:web:bcfc023a6bb872cd8ef8ad
```

**Impacto:** 🔴 SEGURANÇA CRÍTICA

- Credenciais públicas na documentação
- Pode permitir acesso não autorizado
- Violação de boas práticas

**Ação:**

1. ✅ Remover credenciais da documentação
2. ✅ Substituir por placeholders
3. ⚠️ Rotacionar chaves se doc foi compartilhada

**Prioridade:** 🔴 P0 (URGENTÍSSIMO)

---

## 🏗️ INCONSISTÊNCIAS DE ESTRUTURA

### 6. LOCALIZAÇÃO DA PASTA BUDGETS

**Documentação diz:**

```
// Plano_Mestre_DDM.md linha 53
├── crm/
│   ├── budgets/  # ❌ Budgets dentro de CRM

// PLANO-MESTRE-INTEGRADO-COMPLETO.md linha 975
│   ├── (authenticated)/
│   │   ├── crm/
│   │   │   ├── budgets/  # ❌ Dentro de CRM
```

**Código real:**

```
// ANALISE-DETALHADA linha 45
src/app/(authenticated)/
├── budgets/          # ✅ DIRETAMENTE em (authenticated)
│   └── page.tsx
├── crm/              # ✅ CRM separado
│   ├── leads/
│   └── projects/
```

**Impacto:** 🟠 MÉDIO

- Documentação está ERRADA
- Código está CORRETO
- Pode confundir desenvolvedores

**Correção:** Atualizar documentação para refletir estrutura real  
**Prioridade:** 🟠 P1

---

### 7. ROUTE GROUP (authenticated)

**Documentação:**

- Plano_Mestre_DDM.md: **NÃO menciona** route group
- PLANO-MESTRE-INTEGRADO: **MENCIONA** route group
- ROADMAP: **MENCIONA** route group

**Código real:**

```
✅ USA route group: src/app/(authenticated)/
```

**Impacto:** 🟡 BAIXO

- Plano original desatualizado
- Outros docs corretos

**Correção:** Atualizar Plano_Mestre_DDM.md  
**Prioridade:** 🟢 P2

---

### 8. BOOKMODAL COM TYPO NO NOME DO ARQUIVO

**Código real:**

```
// ANALISE-DETALHADA linha 94
src/components/comercial/modals/BookModal.tsx  # ❌ "Bookt" com "t"
```

**Problema:**

- Nome do arquivo tem typo: `BookModal.tsx`
- Deveria ser: `BookModal.tsx`
- Export está correto: `export default function BookModal`

**Impacto:** 🟡 BAIXO

- Não quebra código (export correto)
- Confuso para manutenção

**Correção:** Renomear arquivo  
**Prioridade:** 🟢 P2

---

### 9. PÁGINAS FALTANTES LISTADAS COMO EXISTENTES

**Documentação lista como criadas:**

```
// PLANO-MESTRE-INTEGRADO linha 87
"- ✅ //budgets/[id] - Detalhes do Budget"
```

**Código real:**

```
// ANALISE-DETALHADA linha 746
"- /budgets/[id] não existe ❌"
"- /crm/clients não existe ❌"
"- /crm/books não existe ❌"
```

**Impacto:** 🟠 MÉDIO

- Documentação superestima progresso
- Páginas importantes faltando

**Correção:**

1. Criar páginas faltantes
2. OU atualizar docs como "A CRIAR"

**Prioridade:** 🟠 P1

---

## 📝 INCONSISTÊNCIAS DE NOMENCLATURA

### 10. PROP "onSave" vs "onSubmit"

**Documentação sugere:**

```
// PLANO-MESTRE-INTEGRADO linha 143
"- [ ] Trocar onSave por onSubmit em todos os modais"
```

**Código real:**

```typescript
// ANALISE-DETALHADA linha 130
interface BudgetModalProps {
  onSave: (data: BudgetFormData) => Promise<void>;  // ✅ "onSave"
}
```

**Impacto:** 🟡 BAIXO

- Código usa "onSave" consistentemente
- Documentação sugere mudança desnecessária
- **RECOMENDAÇÃO:** MANTER "onSave" (já funciona)

**Prioridade:** 🟢 P3 (não mudar)

---

### 11. TIPOS DUPLICADOS

**Problema:** Tipos definidos em 2 lugares diferentes

**Arquivos:**

```
src/lib/types/comercial.ts   # ⚠️ ANTIGO (duplicado)
src/lib/types/budgets.ts     # ✅ NOVO (específico)
src/lib/types/clients.ts     # ✅ NOVO (específico)
src/lib/types/leads.ts       # ✅ NOVO (específico)
```

**Tipos duplicados:**

- `Budget` (em comercial.ts e budgets.ts)
- `BudgetStatus` (em comercial.ts e budgets.ts)
- `Client` (em comercial.ts e clients.ts)
- `Lead` (em comercial.ts e leads.ts)

**Impacto:** 🟡 MÉDIO

- Pode causar imports errados
- Dificulta manutenção

**Correção:**

```typescript
// src/lib/types/comercial.ts
// ⚠️ DEPRECATED: Use arquivos específicos
// - budgets.ts
// - clients.ts
// - leads.ts
// Este arquivo será removido em breve

export * from './budgets';
export * from './clients';
export * from './leads';
```

**Prioridade:** 🟡 P1

---

### 12. DATAS DE ATUALIZAÇÃO DESALINHADAS

**Documentos:**

- Plano_Mestre_DDM.md: **14 de outubro de 2025**
- PLANO-MESTRE-INTEGRADO: **18 de outubro de 2025**
- ROADMAP: **18 de outubro de 2025**

**Impacto:** 🟢 BAIXO (apenas organizacional)

**Correção:** Atualizar data do Plano_Mestre_DDM.md  
**Prioridade:** 🟢 P3

---

## 🎯 COMPONENTES DOCUMENTADOS vs EXISTENTES

### Componentes que EXISTEM ✅

| Componente   | Documentado | Existe | Caminho                                                |
| ------------ | ----------- | ------ | ------------------------------------------------------ |
| BudgetModal  | ✅          | ✅     | `src/components/comercial/modals/BudgetModal.tsx`      |
| LeadModal    | ✅          | ✅     | `src/components/comercial/modals/LeadModal.tsx`        |
| ClientModal  | ✅          | ✅     | `src/components/comercial/modals/ClientModal.tsx`      |
| ProjectModal | ✅          | ✅     | `src/components/comercial/modals/ProjectModal.tsx`     |
| BookModal    | ✅          | ✅     | `src/components/comercial/modals/BookModal.tsx` (typo) |
| BudgetCard   | ✅          | ✅     | `src/components/comercial/cards/BudgetCard.tsx`        |
| LeadCard     | ✅          | ✅     | `src/components/comercial/cards/LeadCard.tsx`          |
| ProjectCard  | ✅          | ✅     | `src/components/comercial/cards/ProjectCard.tsx`       |
| BudgetsList  | ✅          | ✅     | `src/components/comercial/budgets/BudgetsList.tsx`     |

### Componentes DOCUMENTADOS mas NÃO EXISTEM ❌

| Componente      | Mencionado em | Status        |
| --------------- | ------------- | ------------- |
| OrderModal      | Docs          | ❌ Não existe |
| BudgetItemsList | Docs          | ❌ Não existe |
| BudgetSummary   | Docs          | ❌ Não existe |

---

## ☁️ CLOUD FUNCTIONS

### Functions Documentadas vs Reais

| Função             | Docs          | Código Real   | Status         |
| ------------------ | ------------- | ------------- | -------------- |
| onBudgetSigned     | ✅ Mencionada | ❌ Não existe | Docs errado    |
| onBudgetApproved   | ⚠️ Conflito   | ✅ Existe     | Usar este nome |
| assignBudgetNumber | ✅            | ✅            | OK             |
| createBudgetPdf    | ✅            | ⚠️ Comentado  | Não usado      |
| assignClientNumber | ✅            | ✅            | OK             |

---

## 🔧 PLANO DE CORREÇÃO

### Fase 1: URGENTE (Hoje) - 1 hora

#### 1.1 Corrigir Cloud Function (30 min) 🔴 P0

```typescript
// functions/src/budgets/onBudgetApproved.ts

export const onBudgetApproved = onDocumentUpdated(
  { document: "budgets/{budgetId}", region: "southamerica-east1" },
  async (event) => {
    const before = event.data?.before?.data() as Budget;
    const after = event.data?.after?.data() as Budget;

    if (!before || !after) return;

    // ✅ ADICIONAR ESTA VERIFICAÇÃO
    if (before.status !== "approved" && after.status === "approved") {
      const budgetId = event.params.budgetId;

      try {
        // Executar conversão completa
        await convertBudgetToClientBookOrder(budgetId);

        console.log(`Budget ${budgetId} converted successfully`);
      } catch (error) {
        console.error(`Error converting budget ${budgetId}:`, error);
        throw error;
      }
    }
  }
);
```

#### 1.2 Corrigir Hook useBudgets (15 min) 🔴 P0

```typescript
// src/hooks/comercial/useBudgets.ts

import { approveBudget as approveBudgetLib } from "@/lib/firebase/budgets/approveBudget";

const approveBudget = async (id: string): Promise<void> => {
  if (!user) throw new Error("Not authenticated");

  try {
    // ✅ Usar função completa da lib
    const result = await approveBudgetLib(id, user.uid);

    console.log("Budget approved successfully:", {
      clientId: result.clientId,
      bookId: result.bookId,
      orderId: result.orderId,
      productionProjectId: result.productionProjectId,
    });

    // Refresh local cache se necessário
    await loadBudgets();

  } catch (error) {
    console.error("Error approving budget:", error);
    throw error;
  }
};
```

#### 1.3 Remover Credenciais (15 min) 🔴 P0

````markdown
<!-- Plano_Mestre_DDM.md -->

### 9.4 `src/lib/env.ts`

```typescript
// EXEMPLO - Use suas próprias credenciais
const schema = z.object({
  NEXT_PUBLIC_FIREBASE_API_KEY: z.string(),
  NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: z.string(),
  NEXT_PUBLIC_FIREBASE_PROJECT_ID: z.string(),
  // ... outros campos
})

export const ENV = schema.parse({
  NEXT_PUBLIC_FIREBASE_API_KEY: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  // ... outros campos
})
```
````

**⚠️ Configure suas credenciais em `.env.local`**

````

---

### Fase 2: IMPORTANTE (Esta Semana) - 3 horas

#### 2.1 Atualizar Documentação - Estrutura (1h) 🟠 P1
- [ ] Corrigir localização de `/budgets` em todos os docs
- [ ] Adicionar route group `(authenticated)` no Plano_Mestre_DDM.md
- [ ] Marcar páginas faltantes como "A CRIAR"

#### 2.2 Padronizar Nomenclatura (1h) 🟠 P1
- [ ] Decidir: manter "approved" ou mudar para "signed"
- [ ] Atualizar TODOS os documentos com decisão
- [ ] Criar glossário de termos

#### 2.3 Deprecar comercial.ts (1h) 🟠 P1
```typescript
// src/lib/types/comercial.ts
/**
 * @deprecated Use arquivos específicos:
 * - import { Budget } from './budgets'
 * - import { Client } from './clients'
 * - import { Lead } from './leads'
 *
 * Este arquivo será removido na v2.0
 */

// Re-export para compatibilidade
export * from './budgets';
export * from './clients';
export * from './leads';
````

---

### Fase 3: DESEJÁVEL (Próxima Semana) - 2 horas

#### 3.1 Renomear BookModal.tsx (10 min) 🟢 P2

```bash
# Renomear arquivo
mv src/components/comercial/modals/BookModal.tsx \
   src/components/comercial/modals/BookModal.tsx

# Atualizar imports (se necessário)
```

#### 3.2 Sincronizar Datas (10 min) 🟢 P2

- [ ] Atualizar data do Plano_Mestre_DDM.md para 18/10/2025
- [ ] Adicionar "Última revisão" em todos os docs

#### 3.3 Criar Documento Master Index (30 min) 🟢 P2

```markdown
# 00-MASTER-INDEX.md

## Documentação do Sistema DDM

### Documentos Atualizados (18/10/2025)

- ✅ PLANO-MESTRE-INTEGRADO-COMPLETO.md
- ✅ ROADMAP-COMPLETO-SISTEMA-DDM.md
- ✅ ANALISE-DETALHADA-ESTRUTURA-2025-10-18.md

### Documentos Desatualizados

- ⚠️ Plano_Mestre_DDM.md (última atualização: 14/10/2025)

### Onde Encontrar

- **Estrutura de Pastas:** ANALISE-DETALHADA-ESTRUTURA
- **Tipos TypeScript:** 01-TYPES-COMPLETE.md
- **Cloud Functions:** ANALISE-DETALHADA (seção 4)
- **Roadmap:** ROADMAP-COMPLETO-SISTEMA-DDM.md
```

---

## ⚡ AÇÕES IMEDIATAS

### 🔴 FAZER AGORA (Próximas 2 horas)

1. **Corrigir Cloud Function** (30 min)
   - Arquivo: `functions/src/budgets/onBudgetApproved.ts`
   - Adicionar verificação de mudança de status
   - Testar com budget real

2. **Corrigir Hook** (15 min)
   - Arquivo: `src/hooks/comercial/useBudgets.ts`
   - Importar e usar função da lib
   - Testar aprovação de budget

3. **Remover Credenciais** (15 min)
   - Arquivo: `Plano_Mestre_DDM.md`
   - Substituir por placeholders
   - Verificar se foram commitadas no Git

4. **Testar Fluxo Completo** (1 hora)
   ```
   1. Criar novo Budget
   2. Aprovar Budget (status → "approved")
   3. Verificar criação automática:
      - Cliente criado? ✅
      - Book criado com catalogCode? ✅
      - Order criado com número? ✅
      - ProductionProject criado? ✅
   4. Documentar resultado
   ```

---

### 🟠 FAZER ESTA SEMANA (6 horas)

5. **Atualizar Todos os Documentos** (3h)
   - Corrigir estrutura de pastas
   - Padronizar nomenclatura (approved vs signed)
   - Marcar páginas como "A CRIAR"

6. **Deprecar comercial.ts** (1h)
   - Adicionar warnings
   - Re-exportar tipos
   - Atualizar imports onde necessário

7. **Criar Página de Detalhes** (2h)
   - `/budgets/[id]/page.tsx`
   - Exibir todos os dados
   - Botões de ação

---

## ✅ CHECKLIST DE VERIFICAÇÃO

### Antes de Continuar Desenvolvimento

- [ ] Cloud Function verifica mudança de status
- [ ] Hook usa função completa da lib
- [ ] Fluxo Budget → Cliente testado e funcionando
- [ ] Credenciais removidas da documentação
- [ ] Documentação sincronizada com código real
- [ ] Glossário de termos definido (approved vs signed)
- [ ] Tipos organizados (sem duplicação)
- [ ] Páginas faltantes identificadas

---

## 📊 MÉTRICAS DE QUALIDADE

| Métrica                | Antes | Depois | Meta |
| ---------------------- | ----- | ------ | ---- |
| Bugs Críticos          | 2     | 0      | 0    |
| Docs Desatualizados    | 3     | 0      | 0    |
| Tipos Duplicados       | 4     | 0      | 0    |
| Credenciais Expostas   | 1     | 0      | 0    |
| Inconsistências Totais | 12    | 0      | 0    |

---

## 🎯 CONCLUSÃO

### Situação Atual

- ✅ Código base é **sólido e bem estruturado**
- 🔴 **2 bugs críticos** impedem funcionamento
- 🟠 Documentação **desatualizada** em vários pontos
- 🟡 Alguns **typos e duplicações** menores

### Próximos Passos

1. ⚡ Corrigir bugs críticos (1-2 horas)
2. 📝 Sincronizar documentação (3 horas)
3. 🧹 Limpar código (2 horas)
4. ✅ Testar tudo (1 hora)

**Tempo total estimado:** 7-9 horas

### Risco

- 🟢 **BAIXO** - Problemas bem definidos e correções diretas
- 🔧 Mudanças pontuais, sem refatoração massiva

---

**📅 Relatório gerado:** 18 de outubro de 2025  
**👤 Autor:** Análise comparativa (Documentação vs Código Real)  
**✅ Status:** Pronto para correção  
**🎯 Próxima ação:** Corrigir Cloud Function (P0)
