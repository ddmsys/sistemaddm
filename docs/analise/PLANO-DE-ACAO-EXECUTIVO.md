# ⚡ PLANO DE AÇÃO EXECUTIVO - SISTEMA DDM

**Data:** 18 de outubro de 2025  
**Objetivo:** Corrigir inconsistências e estabilizar sistema  
**Prazo:** 7-9 horas de trabalho

---

## 🎯 DECISÕES ESTRATÉGICAS NECESSÁRIAS

### Decisão #1: Status do Budget - "approved" ou "signed"?

**Situação Atual:**

- ✅ **Código usa:** "approved" (100% consistente)
- ❌ **Docs pedem:** "signed"

**Opções:**

#### Opção A: MANTER "approved" (RECOMENDADO) ✅

**Prós:**

- ✅ Já implementado em todo o código
- ✅ Zero retrabalho
- ✅ Sem risco de quebrar funcionalidades
- ✅ Termo claro em inglês técnico

**Contras:**

- ⚠️ Precisa atualizar documentação

**Tempo:** 30 minutos (só docs)

#### Opção B: MUDAR para "signed"

**Prós:**

- ✅ Mais próximo do termo comercial brasileiro

**Contras:**

- ❌ Retrabalho massivo no código
- ❌ Mudar 20+ arquivos
- ❌ Risco de bugs
- ❌ Atualizar Cloud Functions
- ❌ Redeployar tudo

**Tempo:** 4-6 horas + risco de bugs

**📌 RECOMENDAÇÃO:** **Opção A - MANTER "approved"**

---

### Decisão #2: Nome da Cloud Function

**Situação Atual:**

- ✅ **Código tem:** `onBudgetApproved`
- ❌ **Docs mencionam:** `onBudgetSigned`

**Decisão:** MANTER `onBudgetApproved` (consistente com status "approved")

---

### Decisão #3: Estrutura de Types

**Situação Atual:**

- Tipos duplicados em `comercial.ts` e arquivos específicos

**Decisão:**

1. ✅ Deprecar `comercial.ts`
2. ✅ Usar arquivos específicos (`budgets.ts`, `clients.ts`, etc)
3. ✅ Re-exportar para compatibilidade temporária

---

## 🔴 FASE 1: CRÍTICO (HOJE - 2 horas)

### ⏰ 1.1 Corrigir Cloud Function (30 min)

**Arquivo:** `functions/src/budgets/onBudgetApproved.ts`

**Problema:** Trigger executa em TODA atualização, não só quando status muda

**Correção:**

```typescript
import * as functions from "firebase-functions/v2";
import { onDocumentUpdated } from "firebase-functions/v2/firestore";
import { Budget } from "./types"; // ajustar caminho

export const onBudgetApproved = onDocumentUpdated(
  {
    region: "southamerica-east1",
    document: "budgets/{budgetId}",
  },
  async (event) => {
    const before = event.data?.before?.data() as Budget;
    const after = event.data?.after?.data() as Budget;

    // Validar dados
    if (!before || !after) {
      console.log("Invalid event data");
      return;
    }

    // ✅ ADICIONAR ESTA VERIFICAÇÃO
    if (before.status !== "approved" && after.status === "approved") {
      const budgetId = event.params.budgetId;

      console.log(`Budget ${budgetId} approved - starting conversion`);

      try {
        // Chamar função de conversão
        await convertBudgetToClientBookOrder(budgetId, after);

        console.log(`Budget ${budgetId} converted successfully`);
      } catch (error) {
        console.error(`Error converting budget ${budgetId}:`, error);
        throw error;
      }
    } else {
      console.log(`Budget status change not relevant: ${before.status} -> ${after.status}`);
    }
  }
);

// Função auxiliar de conversão
async function convertBudgetToClientBookOrder(
  budgetId: string,
  budget: Budget
): Promise<void> {
  // TODO: Implementar lógica completa
  // 1. Criar/atualizar Cliente
  // 2. Criar Book com catalogCode
  // 3. Criar Order
  // 4. Criar ProductionProject
  // 5. Atualizar Budget com IDs criados
}
```

**Testar:**

```bash
# 1. Deploy
cd functions
npm run deploy

# 2. Testar localmente
npm run serve

# 3. Criar budget de teste no Firestore
# 4. Mudar status para "approved"
# 5. Verificar logs
```

---

### ⏰ 1.2 Corrigir Hook useBudgets (15 min)

**Arquivo:** `src/hooks/comercial/useBudgets.ts`

**Problema:** Hook só muda status, não faz conversão completa

**Correção:**

```typescript
import { approveBudget as approveBudgetLib } from "@/lib/firebase/budgets/approveBudget";
import type { ApproveBudgetResult } from "@/lib/firebase/budgets/approveBudget";

// Dentro do hook
const approveBudget = async (id: string): Promise<ApproveBudgetResult> => {
  if (!user) {
    throw new Error("User not authenticated");
  }

  try {
    // ✅ Usar função completa da lib
    const result = await approveBudgetLib(id, user.uid);

    console.log("Budget approved successfully:", {
      budgetId: id,
      clientId: result.clientId,
      bookId: result.bookId,
      catalogCode: result.catalogCode,
      orderId: result.orderId,
      productionProjectId: result.productionProjectId,
    });

    // Atualizar lista local (opcional)
    await loadBudgets();

    return result;
  } catch (error) {
    console.error("Error approving budget:", error);
    throw error;
  }
};
```

**Testar:**

```typescript
// No componente BudgetsList
const handleApprove = async (budgetId: string) => {
  try {
    const result = await approveBudget(budgetId);

    alert(`Budget aprovado!
Cliente: ${result.clientId}
Book: ${result.catalogCode}
Order: ${result.orderId}`);
  } catch (error) {
    alert("Erro ao aprovar budget");
  }
};
```

---

### ⏰ 1.3 Remover Credenciais Firebase (15 min)

**Arquivo:** `Plano_Mestre_DDM.md`

**Linhas 1174-1179:** REMOVER credenciais reais

**Substituir por:**

````markdown
### 9.4 Configuração de Ambiente

**Arquivo:** `.env.local` (não commitado)

```bash
# Firebase Configuration (ambiente de desenvolvimento)
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abcdef
```
````

**⚠️ IMPORTANTE:**

- Nunca commitar credenciais no Git
- Usar variáveis de ambiente
- Rotacionar chaves se foram expostas

````

**Verificar Git:**
```bash
# Verificar se credenciais foram commitadas
git log --all --full-history -- "*env*"
git log -S "your_api_key_here"

# Se encontrar, remover do histórico
git filter-branch --force --index-filter \
  "git rm --cached --ignore-unmatch Plano_Mestre_DDM.md" \
  --prune-empty --tag-name-filter cat -- --all
````

---

### ⏰ 1.4 Testar Fluxo Completo (1 hora)

**Cenário de Teste:**

```
SETUP:
1. Criar Lead de teste
   - Nome: "Autor Teste"
   - Email: "teste@email.com"
   - Título do livro: "Livro Teste"

2. Criar Budget de teste
   - Vincular ao Lead
   - Adicionar itens:
     * Serviço Editorial: Revisão (R$ 2.000)
     * Impressão: 500 exemplares (R$ 5.000)
   - Total: R$ 7.000
   - Status: "draft"

TESTE:
3. Aprovar Budget (status → "approved")
   - Clicar em botão "Aprovar"
   - Aguardar processamento

4. Verificar criações automáticas:
   ✅ Cliente criado em /clients
      - clientNumber gerado (ex: CLI0001)
      - Dados do Lead copiados

   ✅ Book criado em /books
      - catalogCode gerado (ex: DDML0001)
      - Especificações do Budget copiadas

   ✅ Order criado em /orders
      - orderNumber gerado (ex: ORD0001)
      - Itens do Budget copiados
      - Status: "pending"

   ✅ ProductionProject criado em /productionProjects
      - Vinculado ao Book
      - Status: "queued"

5. Verificar Budget atualizado:
   ✅ Status: "approved"
   ✅ Tem clientId
   ✅ Tem bookId
   ✅ Tem orderId
   ✅ Tem productionProjectId

RESULTADO ESPERADO:
- Todas as verificações ✅
- Nenhum erro no console
- Logs de sucesso nas Cloud Functions
```

**Documentar resultado:**

```markdown
# Teste de Aprovação de Budget - [DATA]

## Resultado: ✅ SUCESSO / ❌ FALHA

### Dados Criados

- Cliente: CLI0001
- Book: DDML0001
- Order: ORD0001
- Production: PROD0001

### Logs

[colar logs relevantes]

### Problemas Encontrados

[listar se houver]

### Tempo Total

[tempo decorrido]
```

---

## 🟠 FASE 2: IMPORTANTE (ESTA SEMANA - 3 horas)

### 2.1 Atualizar Documentação (1h)

**Arquivos a atualizar:**

#### `Plano_Mestre_DDM.md`

```diff
- **📅 Última Atualização:** 14 de outubro de 2025
+ **📅 Última Atualização:** 18 de outubro de 2025

- ├── src/app/
-     ├── crm/
-         ├── budgets/
+ ├── src/app/
+     ├── (authenticated)/
+         ├── budgets/
+         ├── crm/
```

#### `PLANO-MESTRE-INTEGRADO-COMPLETO.md`

```diff
- **🟡 Componentes Incompletos:**
- - 🟡 BudgetModal - Falta itens de serviço/impressão
- - 🟡 Dashboard Comercial - Apenas estrutura básica
- - ❌ Detalhes do Budget (//budgets/[id])
+ **🟡 Componentes Incompletos:**
+ - ✅ BudgetModal - Completo
+ - 🟡 Dashboard Comercial - Estrutura básica
+ - ❌ Detalhes do Budget (/budgets/[id]) - A CRIAR
```

#### `ROADMAP-COMPLETO-SISTEMA-DDM.md`

```diff
- **Nome Correto da Função:** onBudgetApproved (não onBudgetSigned)
+ **✅ Status Padronizado:**
+ - Budget status: "approved" (definido)
+ - Cloud Function: onBudgetApproved
+ - Hook: approveBudget
```

---

### 2.2 Padronizar Nomenclatura (1h)

**Criar:** `docs/GLOSSARIO.md`

```markdown
# 📖 Glossário de Termos - Sistema DDM

## Status do Budget

| Termo        | Uso           | Descrição                    |
| ------------ | ------------- | ---------------------------- |
| **approved** | ✅ OFICIAL    | Budget aprovado pelo cliente |
| ~~signed~~   | ❌ DEPRECATED | Termo antigo, não usar       |

## Cloud Functions

| Nome                 | Trigger      | Ação                                  |
| -------------------- | ------------ | ------------------------------------- |
| **onBudgetApproved** | budgets/{id} | Conversão Budget → Cliente/Book/Order |

## Nomenclatura de Props

| Componente  | Prop       | Tipo     | Uso                          |
| ----------- | ---------- | -------- | ---------------------------- |
| BudgetModal | **onSave** | callback | Salvar budget (criar/editar) |
| BudgetModal | onClose    | callback | Fechar modal                 |

## Estrutura de Pastas
```

src/app/
├── (authenticated)/ # ✅ Route group de páginas autenticadas
│ ├── budgets/ # ✅ Gestão de orçamentos
│ ├── crm/ # ✅ Módulo comercial
│ └── production/ # ✅ Módulo de produção
├── login/ # ✅ Página pública
└── register/ # ✅ Página pública

```

## Nomenclatura de Arquivos

✅ **Correto:**
- `BudgetModal.tsx`
- `useLeads.ts`
- `budgets.ts`

❌ **Evitar:**
- `BookModal.tsx` (typo)
- `comercial.ts` (deprecated)
```

---

### 2.3 Deprecar comercial.ts (1h)

**Arquivo:** `src/lib/types/comercial.ts`

```typescript
/**
 * @deprecated Este arquivo está deprecated desde 18/10/2025
 *
 * Use os arquivos específicos:
 * - import { Budget, BudgetStatus } from './budgets'
 * - import { Client, ClientType } from './clients'
 * - import { Lead, LeadStatus } from './leads'
 * - import { Project, ProjectStatus } from './projects'
 *
 * Este arquivo será removido na versão 2.0
 */

// Re-exports para compatibilidade temporária
export * from './budgets';
export * from './clients';
export * from './leads';
export * from './projects';

console.warn(
  '[DEPRECATED] src/lib/types/comercial.ts está deprecated. ' +
  'Use arquivos específicos (budgets.ts, clients.ts, etc.)'
);
```

**Atualizar imports gradualmente:**

```typescript
// ❌ Antigo (deprecated)
import { Budget, Client, Lead } from '@/lib/types/comercial';

// ✅ Novo (recomendado)
import { Budget } from '@/lib/types/budgets';
import { Client } from '@/lib/types/clients';
import { Lead } from '@/lib/types/leads';
```

---

## 🟢 FASE 3: DESEJÁVEL (PRÓXIMA SEMANA - 2 horas)

### 3.1 Renomear BookModal.tsx (10 min)

```bash
# Terminal
cd src/components/comercial/modals

# Renomear arquivo
git mv BookModal.tsx BookModal.tsx

# Verificar imports
git grep "BookModal" -l | xargs sed -i 's/BookModal/BookModal/g'

# Commit
git add .
git commit -m "fix: rename BookModal to BookModal"
```

---

### 3.2 Criar Master Index (30 min)

**Arquivo:** `docs/00-MASTER-INDEX.md`

```markdown
# 📚 ÍNDICE MASTER - DOCUMENTAÇÃO SISTEMA DDM

**Última Atualização:** 18 de outubro de 2025

---

## 🎯 Documentos Principais (ORDEM DE LEITURA)

### 1. VISÃO GERAL

- **PLANO-MESTRE-INTEGRADO-COMPLETO.md** ⭐ PRINCIPAL
  - Visão 360° do projeto
  - Status atual detalhado
  - Roadmap completo

### 2. ANÁLISE TÉCNICA

- **ANALISE-DETALHADA-ESTRUTURA-2025-10-18.md** ⭐ CÓDIGO REAL
  - Estrutura de pastas REAL
  - Componentes existentes
  - Status de implementação

### 3. PLANEJAMENTO

- **ROADMAP-COMPLETO-SISTEMA-DDM.md**
  - Cronograma detalhado
  - Tarefas granulares
  - Estimativas de tempo

### 4. REFERÊNCIAS

- **Plano_Mestre_DDM.md** (referência histórica)
- **GLOSSARIO.md** (terminologia)
- **RELATORIO-INCONSISTENCIAS-COMPLETO.md** (problemas identificados)

---

## 🗂️ Documentação por Tema

### Arquitetura

- ANALISE-DETALHADA: Seção 1 (Estrutura de Pastas)
- PLANO-MESTRE: Seção "Estrutura Final Definitiva"

### Tipos TypeScript

- ANALISE-DETALHADA: Seção 5 (Tipos TypeScript)
- 01-TYPES-COMPLETE.md

### Cloud Functions

- ANALISE-DETALHADA: Seção 4 (Cloud Functions)
- RELATORIO-INCONSISTENCIAS: Seção "Cloud Functions"

### Componentes

- ANALISE-DETALHADA: Seção 2 (Status dos Componentes)
- 04-COMPONENTS-GUIDE.md

---

## 📊 Status dos Documentos

| Documento                          | Status           | Última Atualização |
| ---------------------------------- | ---------------- | ------------------ |
| PLANO-MESTRE-INTEGRADO-COMPLETO.md | ✅ Atualizado    | 18/10/2025         |
| ROADMAP-COMPLETO-SISTEMA-DDM.md    | ✅ Atualizado    | 18/10/2025         |
| ANALISE-DETALHADA-ESTRUTURA.md     | ✅ Atualizado    | 18/10/2025         |
| RELATORIO-INCONSISTENCIAS.md       | ✅ Atualizado    | 18/10/2025         |
| Plano_Mestre_DDM.md                | ⚠️ Desatualizado | 14/10/2025         |

---

## 🔍 Como Encontrar Informações

### "Onde está a pasta X?"

→ ANALISE-DETALHADA: Seção 1

### "Como funciona o Budget?"

→ PLANO-MESTRE: Seção "Módulo Comercial"

### "Quais componentes existem?"

→ ANALISE-DETALHADA: Seção 2

### "O que fazer esta semana?"

→ ROADMAP: Seção "Próximos Passos"

### "Que problemas temos?"

→ RELATORIO-INCONSISTENCIAS

---

## 📞 Suporte

- **Dúvidas técnicas:** Consultar ANALISE-DETALHADA
- **Planejamento:** Consultar ROADMAP
- **Termos:** Consultar GLOSSARIO
```

---

## ✅ CHECKLIST FINAL

### Antes de Considerar Completo

**Fase 1: CRÍTICO**

- [ ] Cloud Function corrigida e deployada
- [ ] Hook atualizado para usar função da lib
- [ ] Credenciais removidas da documentação
- [ ] Fluxo completo testado e funcionando
- [ ] Resultado do teste documentado

**Fase 2: IMPORTANTE**

- [ ] Plano_Mestre_DDM.md atualizado
- [ ] PLANO-MESTRE-INTEGRADO atualizado
- [ ] ROADMAP atualizado
- [ ] Glossário criado
- [ ] comercial.ts deprecado

**Fase 3: DESEJÁVEL**

- [ ] BookModal.tsx renomeado
- [ ] Master Index criado
- [ ] Datas sincronizadas

---

## 📊 TRACKING DE PROGRESSO

```markdown
## Status Geral: 🟡 EM ANDAMENTO

### Fase 1: CRÍTICO (Meta: Hoje)

- [ ] 1.1 Cloud Function (30 min)
- [ ] 1.2 Hook useBudgets (15 min)
- [ ] 1.3 Credenciais (15 min)
- [ ] 1.4 Teste Completo (1h)

**Progress: 0/4** | **Tempo: 0h/2h**

### Fase 2: IMPORTANTE (Meta: Esta Semana)

- [ ] 2.1 Docs (1h)
- [ ] 2.2 Nomenclatura (1h)
- [ ] 2.3 Deprecar tipos (1h)

**Progress: 0/3** | **Tempo: 0h/3h**

### Fase 3: DESEJÁVEL (Meta: Próxima Semana)

- [ ] 3.1 Renomear arquivo (10 min)
- [ ] 3.2 Master Index (30 min)

**Progress: 0/2** | **Tempo: 0h/0.7h**

---

**TOTAL: 0/9 tarefas** | **0h/5.7h concluídas**
```

---

## 🎯 PRÓXIMA AÇÃO

**AGORA:** Corrigir Cloud Function (30 min)

**Arquivo:** `functions/src/budgets/onBudgetApproved.ts`

**Adicionar verificação:**

```typescript
if (before.status !== "approved" && after.status === "approved") {
  // Lógica de conversão aqui
}
```

**Depois:** Deploy e teste

---

**📅 Criado:** 18 de outubro de 2025  
**⏰ Estimativa Total:** 7-9 horas  
**🎯 Status:** Pronto para execução  
**📍 Começar por:** Fase 1.1 (Cloud Function)
