# ✅ CHECKLIST DE CORREÇÕES - SISTEMA DDM

**Data de Início:** **_ / _** / 2025  
**Responsável:** **\*\*\*\***\_\_\_**\*\*\*\***  
**Tempo Estimado Total:** 7-9 horas

---

## 🔥 FASE 1: CRÍTICO (META: HOJE)

**⏰ Tempo Total:** 2 horas  
**🎯 Objetivo:** Corrigir bugs que impedem funcionamento

### 1.1 Corrigir Cloud Function ⏱️ 30 min

**Arquivo:** `functions/src/budgets/onBudgetApproved.ts`

- [ ] Abrir arquivo no editor
- [ ] Localizar função `onBudgetApproved` (linha ~20)
- [ ] Adicionar verificação de mudança de status:
  ```typescript
  if (before.status !== "approved" && after.status === "approved") {
    await convertBudgetToClientBookOrder(budgetId);
  }
  ```
- [ ] Salvar arquivo
- [ ] Verificar sintaxe (TypeScript)
- [ ] Commit: `fix: add status change verification to onBudgetApproved`

**Deploy:**

- [ ] `cd functions`
- [ ] `npm run build` (verificar erros)
- [ ] `npm run deploy`
- [ ] Aguardar deploy completo
- [ ] Verificar logs no Firebase Console

**✅ Concluído em:** **_ : _** (HH:MM)  
**❌ Problemas encontrados:** ******\*\*******\_\_\_\_******\*\*******

---

### 1.2 Corrigir Hook useBudgets ⏱️ 15 min

**Arquivo:** `src/hooks/comercial/useBudgets.ts`

- [ ] Abrir arquivo no editor
- [ ] Adicionar import:
  ```typescript
  import { approveBudget as approveBudgetLib } from "@/lib/firebase/budgets/approveBudget";
  ```
- [ ] Localizar função `approveBudget` (linha ~80-90)
- [ ] Substituir implementação:
  ```typescript
  const approveBudget = async (id: string) => {
    if (!user) throw new Error("Not authenticated");
    const result = await approveBudgetLib(id, user.uid);
    await loadBudgets();
    return result;
  };
  ```
- [ ] Salvar arquivo
- [ ] Verificar tipos TypeScript
- [ ] Commit: `fix: use lib approveBudget in useBudgets hook`

**✅ Concluído em:** **_ : _** (HH:MM)  
**❌ Problemas encontrados:** ******\*\*******\_\_\_\_******\*\*******

---

### 1.3 Remover Credenciais Firebase 🔐 15 min

**Arquivo:** `Plano_Mestre_DDM.md`

- [ ] Abrir `Plano_Mestre_DDM.md`
- [ ] Localizar linhas 1174-1179
- [ ] Substituir credenciais por placeholders:

  ```markdown
  NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here
  NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com

  # etc...
  ```

- [ ] Adicionar aviso de segurança
- [ ] Salvar arquivo
- [ ] Verificar se credenciais foram commitadas no Git:
  ```bash
  git log -S "your_api_key_here"
  ```
- [ ] Se encontrado no histórico, considerar rotação de chaves
- [ ] Commit: `docs: remove exposed Firebase credentials`

**✅ Concluído em:** **_ : _** (HH:MM)  
**⚠️ Credenciais no Git?** [ ] Sim / [ ] Não  
**⚠️ Rotação necessária?** [ ] Sim / [ ] Não

---

### 1.4 Testar Fluxo Completo End-to-End ⏱️ 1 hora

#### Setup do Teste

- [ ] Abrir Firebase Console
- [ ] Abrir aplicação no navegador
- [ ] Preparar console do navegador (F12)
- [ ] Preparar Firebase Functions logs

#### Passo 1: Criar Lead

- [ ] Navegar para `/crm/leads`
- [ ] Clicar em "Novo Lead"
- [ ] Preencher dados:
  - Nome: "Teste Aprovação"
  - Email: "teste@aprovacao.com"
  - Telefone: "(11) 99999-9999"
  - Título do livro: "Livro de Teste"
  - Stage: "negociação"
- [ ] Salvar Lead
- [ ] Anotar ID do Lead: `________________________`

#### Passo 2: Criar Budget

- [ ] Navegar para `/budgets`
- [ ] Clicar em "Novo Orçamento"
- [ ] Preencher:
  - Lead: Selecionar lead criado
  - Título: "Orçamento de Teste"
  - Descrição: "Teste de aprovação automática"

**Itens do Budget:**

- [ ] Adicionar Serviço Editorial:
  - Tipo: Revisão
  - Quantidade: 300 páginas
  - Preço unitário: R$ 5,00
  - Total: R$ 1.500,00

- [ ] Adicionar Impressão:
  - Tiragem: 500 exemplares
  - Preço unitário: R$ 10,00
  - Total: R$ 5.000,00

- [ ] Verificar total: R$ 6.500,00
- [ ] Status: "draft"
- [ ] Salvar Budget
- [ ] Anotar ID do Budget: `________________________`

#### Passo 3: Aprovar Budget

- [ ] Localizar budget criado na lista
- [ ] Clicar em "Aprovar"
- [ ] Confirmar aprovação
- [ ] Aguardar processamento (5-10 segundos)
- [ ] Verificar feedback visual (toast/mensagem)

#### Passo 4: Verificar Criações Automáticas

**Cliente Criado:**

- [ ] Navegar para `/crm/clients` ou Firestore Console
- [ ] Verificar cliente criado
- [ ] Client Number gerado? Ex: `CLI0001`
- [ ] Dados do Lead copiados corretamente?
- [ ] Anotar Client ID: `________________________`

**Book Criado:**

- [ ] Navegar para coleção `books` no Firestore
- [ ] Verificar book criado
- [ ] Catalog Code gerado? Ex: `DDML0001`
- [ ] Especificações do Budget copiadas?
- [ ] Anotar Book ID: `________________________`

**Order Criado:**

- [ ] Navegar para coleção `orders` no Firestore
- [ ] Verificar order criado
- [ ] Order Number gerado? Ex: `ORD0001`
- [ ] Itens do Budget copiados?
- [ ] Status: "pending"?
- [ ] Anotar Order ID: `________________________`

**Production Project Criado:**

- [ ] Navegar para coleção `productionProjects` no Firestore
- [ ] Verificar production project criado
- [ ] Vinculado ao Book?
- [ ] Status: "queued"?
- [ ] Anotar Production ID: `________________________`

#### Passo 5: Verificar Budget Atualizado

- [ ] Recarregar página do budget
- [ ] Status mudou para "approved"?
- [ ] Campo `clientId` preenchido?
- [ ] Campo `bookId` preenchido?
- [ ] Campo `orderId` preenchido?
- [ ] Campo `productionProjectId` preenchido?
- [ ] Campo `approvedAt` com timestamp?
- [ ] Campo `approvedBy` com user ID?

#### Passo 6: Verificar Logs

**Console do Navegador:**

- [ ] Sem erros (red)
- [ ] Logs de sucesso presentes

**Firebase Functions Logs:**

- [ ] Abrir Firebase Console → Functions → Logs
- [ ] Procurar por budget ID
- [ ] Log "Budget approved - starting conversion"
- [ ] Log "Budget converted successfully"
- [ ] Sem erros de execução

#### Resultado do Teste

```
┌─────────────────────────────────────────┐
│  RESULTADO: [ ] ✅ SUCESSO / [ ] ❌ FALHA │
├─────────────────────────────────────────┤
│                                         │
│  IDs Criados:                           │
│  • Lead:       ___________________      │
│  • Budget:     ___________________      │
│  • Cliente:    ___________________      │
│  • Book:       ___________________      │
│  • Order:      ___________________      │
│  • Production: ___________________      │
│                                         │
│  Números Gerados:                       │
│  • Client Number:  ___________          │
│  • Catalog Code:   ___________          │
│  • Order Number:   ___________          │
│                                         │
│  Tempo Total: _____ minutos             │
│                                         │
└─────────────────────────────────────────┘
```

**✅ Teste concluído em:** **_ : _** (HH:MM)  
**❌ Problemas encontrados:**

---

---

---

---

## ✅ FASE 1 CONCLUÍDA

- [ ] Todos os itens da Fase 1 marcados
- [ ] Teste passou sem erros
- [ ] Sistema funcionando corretamente
- [ ] Commits realizados

**📸 Evidência:** Tirar screenshot do Firestore mostrando documentos criados

**⏰ Tempo Total Fase 1:** **\_** horas (meta: 2h)

---

## 📝 FASE 2: IMPORTANTE (META: ESTA SEMANA)

**⏰ Tempo Total:** 3 horas  
**🎯 Objetivo:** Atualizar documentação e organizar tipos

### 2.1 Atualizar Documentação ⏱️ 1 hora

#### Plano_Mestre_DDM.md

- [ ] Atualizar data: "18 de outubro de 2025"
- [ ] Corrigir estrutura de pastas:
  ```
  src/app/
  ├── (authenticated)/
  │   ├── budgets/
  │   ├── crm/
  ```
- [ ] Adicionar menção ao route group
- [ ] Salvar e commitar

#### PLANO-MESTRE-INTEGRADO-COMPLETO.md

- [ ] Marcar BudgetModal como completo (se aplicável)
- [ ] Atualizar status de páginas:
  - `/budgets/[id]` → "A CRIAR"
  - `/crm/clients` → verificar se existe
  - `/crm/books` → "A CRIAR"
- [ ] Salvar e commitar

#### ROADMAP-COMPLETO-SISTEMA-DDM.md

- [ ] Confirmar nomenclatura padrão:
  - Status: "approved" ✅
  - Function: onBudgetApproved ✅
- [ ] Atualizar seção de Cloud Functions
- [ ] Salvar e commitar

**✅ Concluído em:** **_ : _** (HH:MM)

---

### 2.2 Criar Glossário ⏱️ 1 hora

**Arquivo:** `docs/GLOSSARIO.md`

- [ ] Criar arquivo novo
- [ ] Copiar template do PLANO-DE-ACAO-EXECUTIVO.md
- [ ] Definir termos oficiais:
  - [ ] Status do Budget: "approved"
  - [ ] Cloud Function: onBudgetApproved
  - [ ] Props: onSave (não onSubmit)
- [ ] Adicionar estrutura de pastas oficial
- [ ] Adicionar convenções de nomenclatura
- [ ] Salvar e commitar: `docs: add terminology glossary`

**✅ Concluído em:** **_ : _** (HH:MM)

---

### 2.3 Deprecar comercial.ts ⏱️ 1 hora

**Arquivo:** `src/lib/types/comercial.ts`

- [ ] Abrir arquivo
- [ ] Adicionar comentário de deprecação no topo
- [ ] Adicionar console.warn
- [ ] Re-exportar tipos dos arquivos específicos
- [ ] Salvar arquivo

**Atualizar imports (opcional - pode ser gradual):**

- [ ] Buscar por imports de comercial.ts: `git grep "from.*comercial"`
- [ ] Lista de arquivos encontrados: ****\*\*****\_\_****\*\*****
- [ ] Atualizar imports prioritários (componentes principais)
- [ ] Deixar resto para atualização gradual

**Commitar:**

- [ ] `git add src/lib/types/comercial.ts`
- [ ] `git commit -m "refactor: deprecate comercial.ts in favor of specific type files"`

**✅ Concluído em:** **_ : _** (HH:MM)

---

## ✅ FASE 2 CONCLUÍDA

- [ ] Todos os itens da Fase 2 marcados
- [ ] Documentação atualizada
- [ ] Glossário criado
- [ ] Tipos organizados

**⏰ Tempo Total Fase 2:** **\_** horas (meta: 3h)

---

## 🎨 FASE 3: DESEJÁVEL (META: PRÓXIMA SEMANA)

**⏰ Tempo Total:** 40 minutos  
**🎯 Objetivo:** Refinamentos e organização final

### 3.1 Renomear BookModal.tsx ⏱️ 10 min

- [ ] Abrir terminal
- [ ] Navegar: `cd src/components/comercial/modals`
- [ ] Renomear: `git mv BookModal.tsx BookModal.tsx`
- [ ] Verificar imports: `git grep "BookModal"`
- [ ] Atualizar imports encontrados (se houver)
- [ ] Testar compilação: `npm run build`
- [ ] Commit: `fix: rename BookModal to BookModal (typo fix)`

**✅ Concluído em:** **_ : _** (HH:MM)

---

### 3.2 Criar Master Index ⏱️ 30 min

**Arquivo:** `docs/00-MASTER-INDEX.md`

- [ ] Criar arquivo novo
- [ ] Copiar template do PLANO-DE-ACAO-EXECUTIVO.md
- [ ] Listar todos os documentos principais
- [ ] Adicionar ordem de leitura recomendada
- [ ] Adicionar índice por tema
- [ ] Adicionar status de atualização dos docs
- [ ] Adicionar seção "Como Encontrar Informações"
- [ ] Salvar e commitar: `docs: add master documentation index`

**✅ Concluído em:** **_ : _** (HH:MM)

---

## ✅ FASE 3 CONCLUÍDA

- [ ] Todos os itens da Fase 3 marcados
- [ ] Arquivo renomeado
- [ ] Master Index criado

**⏰ Tempo Total Fase 3:** **\_** horas (meta: 0.7h)

---

## 🎉 PROJETO CONCLUÍDO

### ✅ Checklist Final

- [ ] Fase 1 completa (Crítico)
- [ ] Fase 2 completa (Importante)
- [ ] Fase 3 completa (Desejável)
- [ ] Todos os commits realizados
- [ ] Código deployado
- [ ] Teste end-to-end passou
- [ ] Documentação atualizada
- [ ] Glossário criado
- [ ] Master Index criado

### 📊 Estatísticas

```
┌─────────────────────────────────────────┐
│  TEMPO TOTAL: _____ horas               │
│  META: 7-9 horas                        │
│  DIFERENÇA: _____ horas                 │
│                                         │
│  BUGS CORRIGIDOS: 2/2 ✅                │
│  DOCS ATUALIZADOS: ___/3                │
│  ARQUIVOS CRIADOS: ___/2                │
│                                         │
│  STATUS FINAL: ________________         │
└─────────────────────────────────────────┘
```

### 🎯 Resultado

**Sistema está:**

- [ ] ✅ 100% funcional
- [ ] ✅ Documentação sincronizada
- [ ] ✅ Código organizado
- [ ] ✅ Pronto para desenvolvimento contínuo

### 📝 Observações Finais

---

---

---

---

### 📸 Evidências

- [ ] Screenshot Firestore (documentos criados)
- [ ] Screenshot Firebase Functions (logs)
- [ ] Screenshot aplicação (budget aprovado)
- [ ] Logs salvos em arquivo

---

## 📞 PRÓXIMOS PASSOS

Após completar este checklist:

1. [ ] Continuar com FASE 2 do ROADMAP (Completar Módulo Comercial)
2. [ ] Criar páginas faltantes:
   - [ ] `/budgets/[id]/page.tsx`
   - [ ] `/crm/books/page.tsx`
   - [ ] `/crm/orders/page.tsx`
3. [ ] Implementar Dashboard Comercial completo
4. [ ] Começar Módulo de Produção

---

**📅 Iniciado em:** **_ / _** / 2025  
**✅ Concluído em:** **_ / _** / 2025  
**⏰ Tempo Total:** **\_** horas  
**👤 Responsável:** **\*\*\*\***\_\_\_**\*\*\*\***  
**🎯 Status:** [ ] Completo / [ ] Em Andamento
