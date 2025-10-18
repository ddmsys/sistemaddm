# 🚀 GUIA DE DEPLOY - Migração Budget → Budget

**Data:** 14 de outubro de 2025  
**Branch:** fix/comercial-layout  
**Região:** southamerica-east1 (São Paulo, Brasil)  
**Objetivo:** Deploy seguro das Cloud Functions renomeadas

---

## 🌎 CONFIGURAÇÃO DE REGIÃO

**⚠️ IMPORTANTE:** Todas as Cloud Functions deste projeto estão configuradas para a região **`southamerica-east1`** (São Paulo, Brasil).

### Por que São Paulo?

1. **Latência Menor** - Usuários no Brasil têm resposta mais rápida
2. **Compliance** - Dados permanecem no território brasileiro
3. **Custos** - Menor transferência de dados entre serviços

### Verificar Região nas Functions

```typescript
// ✅ CORRETO - Todas as functions usam:
export const createBudgetPdf = functions.https.onCall(
  { region: 'southamerica-east1' },  // ← São Paulo
  async (request) => { ... }
);
```

```bash
# Verificar região deployada
firebase functions:list

# Deve mostrar:
# createBudgetPdf(southamerica-east1)
# assignBudgetNumber(southamerica-east1)
# onBudgetApproved(southamerica-east1)
```

---

## 📋 PRÉ-REQUISITOS

### Verificações Antes do Deploy

```bash
# 1. Verificar que está na branch correta
git branch
# Deve mostrar: * fix/comercial-layout

# 2. Verificar arquivos modificados
git status

# 3. Verificar se há erros de TypeScript
cd functions
npm run build

# 4. Verificar se o Firebase CLI está instalado
firebase --version
```

---

## 🔧 ETAPA 1: BUILD E TESTES LOCAIS

### 1.1 Build das Functions

```bash
cd functions
npm run build
```

**Esperado:** Build sem erros

### 1.2 Testes Locais (Emulador)

````bash
# Iniciar emuladores
firebase emulators:start

# Em outro terminal, testar as functions
# Região: southamerica-east1 (São Paulo)
curl -X POST http://localhost:5001/[PROJECT_ID]/southamerica-east1/createBudgetPdf \
  -H "Content-Type: application/json" \
  -d '{"data": "test-budget-id"}'
```d '{"data": "test-budget-id"}'
````

### 1.3 Verificar Logs

```bash
# Verificar logs do emulador
# Deve mostrar execução sem erros
```

---

## 📤 ETAPA 2: DEPLOY DAS FUNCTIONS

### 2.1 Deploy Individual (Recomendado)

```bash
# Deploy apenas das novas functions
firebase deploy --only functions:assignBudgetNumber,functions:createBudgetPdf,functions:onBudgetApproved

# Ou deploy de toda a pasta budgets
firebase deploy --only functions:budgets
```

### 2.2 Verificar Deploy

```bash
# Listar functions deployadas
firebase functions:list

# Verificar logs após deploy
firebase functions:log --only assignBudgetNumber
```

### 2.3 Testar Functions em Produção

```bash
# Testar via Firebase Console
# 1. Ir para Firebase Console > Functions
# 2. Selecionar a function
# 3. Aba "Testing"
# 4. Executar teste
```

---

## ⚠️ ETAPA 3: DEPRECAR FUNCTIONS ANTIGAS (GRADUAL)

### 3.1 NÃO Deletar Imediatamente

As functions antigas (`budgets/*`) ainda podem ter dados em produção.

### 3.2 Estratégia de Deprecação

```typescript
// functions/src/budgets/createBudgetPdf.ts (DEPRECADO)
export const createBudgetPdf = functions.https.onCall(async (request) => {
  console.warn('⚠️ DEPRECATION WARNING: Use createBudgetPdf instead');

  // Redirecionar para a nova function
  throw new functions.https.HttpsError(
    'failed-precondition',
    'Esta function foi deprecada. Use createBudgetPdf ao invés.'
  );
});
```

### 3.3 Timeline de Deprecação

```
Semana 1-2: Deploy novas functions + avisos nas antigas
Semana 3-4: Migrar código frontend para usar novas functions
Semana 5-6: Monitorar uso das antigas (devem estar zeradas)
Semana 7+: Deletar functions antigas
```

---

## 🔄 ETAPA 4: MIGRAÇÃO DE DADOS

### 4.1 Verificar Dados Existentes

```bash
# Contar documentos na collection budgets
firebase firestore:count budgets

# Listar alguns documentos
firebase firestore:get budgets --limit 5
```

### 4.2 Script de Migração (Se Necessário)

```typescript
// scripts/migrate-budgets-to-budgets.ts
import admin from 'firebase-admin';

admin.initializeApp();
const db = admin.firestore();

async function migrateBudgetsToBudgets() {
  const budgetsSnapshot = await db.collection('budgets').get();

  const batch = db.batch();
  let count = 0;

  for (const budgetDoc of budgetsSnapshot.docs) {
    const budgetData = budgetDoc.data();

    // Converter Budget para Budget
    const budgetData = {
      number: budgetData.budgetNumber || budgetData.number,
      status: budgetData.status === 'signed' ? 'approved' : budgetData.status,
      // ... resto dos campos
    };

    const budgetRef = db.collection('budgets').doc(budgetDoc.id);
    batch.set(budgetRef, budgetData);

    count++;

    // Commit a cada 500 documentos
    if (count % 500 === 0) {
      await batch.commit();
      console.log(`Migrated ${count} documents...`);
    }
  }

  await batch.commit();
  console.log(`✅ Migration complete! Total: ${count} documents`);
}

migrateBudgetsToBudgets().catch(console.error);
```

### 4.3 Executar Migração

```bash
# Backup primeiro!
firebase firestore:export gs://[BUCKET]/backups/budgets-$(date +%Y%m%d)

# Executar script
ts-node scripts/migrate-budgets-to-budgets.ts

# Verificar
firebase firestore:count budgets
```

---

## 🔍 ETAPA 5: VALIDAÇÃO PÓS-DEPLOY

### 5.1 Checklist de Validação

```bash
# 1. Functions deployadas
firebase functions:list | grep budget

# 2. Logs sem erros
firebase functions:log --limit 50

# 3. Testar criação de budget
# Via frontend ou Postman

# 4. Verificar PDF gerado
# Abrir URL retornada

# 5. Testar trigger onBudgetApproved
# Mudar status de um budget para 'approved'
# Verificar se criou client, project, order
```

### 5.2 Métricas a Monitorar

- ✅ Taxa de sucesso das functions (> 95%)
- ✅ Tempo de execução (< 5s para PDFs)
- ✅ Erros de timeout (0)
- ✅ Custos (comparar com anterior)

---

## 🐛 TROUBLESHOOTING

### Erro: "Function not found"

```bash
# Verificar se a function foi deployada
firebase functions:list

# Re-deploy se necessário
firebase deploy --only functions:assignBudgetNumber --force
```

### Erro: "Permission denied"

```bash
# Verificar Firestore Rules
firebase firestore:rules:get

# Atualizar rules se necessário
firebase deploy --only firestore:rules
```

### Erro: "Module not found"

```bash
# Reinstalar dependências
cd functions
rm -rf node_modules package-lock.json
npm install
npm run build
```

### PDF não sendo gerado

```bash
# Verificar logs
firebase functions:log --only createBudgetPdf

# Verificar Storage permissions
# Firebase Console > Storage > Rules

# Testar manualmente
firebase functions:shell
> createBudgetPdf({data: 'test-id'})
```

### Erro: "Function region mismatch"

```bash
# ⚠️ IMPORTANTE: Todas as functions devem estar em southamerica-east1

# Verificar região atual
firebase functions:list

# Se alguma function estiver em us-central1 ou outra região:
# 1. Deletar a function antiga
firebase functions:delete createBudgetPdf --region us-central1

# 2. Re-deploy na região correta
firebase deploy --only functions:createBudgetPdf

# 3. Verificar
firebase functions:list | grep southamerica-east1
```

### Erro: "CORS" ao chamar function

```bash
# Verificar se frontend está usando região correta

# ❌ ERRADO:
const functions = getFunctions(app);
const createPdf = httpsCallable(functions, 'createBudgetPdf');

# ✅ CORRETO:
const functions = getFunctions(app, 'southamerica-east1');
const createPdf = httpsCallable(functions, 'createBudgetPdf');
```

---

## 📊 ROLLBACK (Se Necessário)

### Se algo der errado:

```bash
# 1. Voltar para versão anterior das functions
git log --oneline
git checkout [COMMIT_ANTERIOR]

# 2. Re-deploy functions antigas
cd functions
npm run build
firebase deploy --only functions:budgets

# 3. Investigar e corrigir
# 4. Re-tentar deploy
```

---

## ✅ CHECKLIST FINAL

- [ ] Build sem erros
- [ ] Testes locais passando
- [ ] Functions deployadas com sucesso
- [ ] Logs sem erros
- [ ] PDFs sendo gerados corretamente
- [ ] Triggers funcionando (onBudgetApproved)
- [ ] Frontend atualizado (se necessário)
- [ ] Dados migrados (se necessário)
- [ ] Documentação atualizada ✅
- [ ] Equipe notificada

---

## 📞 CONTATOS DE EMERGÊNCIA

- **Firebase Console:** https://console.firebase.google.com
- **Logs:** `firebase functions:log`
- **Status:** https://status.firebase.google.com
- **Suporte:** Firebase Support (via Console)

---

## 📚 REFERÊNCIAS

- [Firebase Functions Docs](https://firebase.google.com/docs/functions)
- [Documento 08 - Migração](08-DOCUMENTO%20DE%20MIGRAÇÃO%20E%20PADRONIZAÇÃO.md)
- [SESSION-2025-10-14.md](SESSION-2025-10-14.md)
- [AUDITORIA-DOCUMENTACAO-DDM.md](AUDITORIA-DOCUMENTACAO-DDM.md)

---

**Criado em:** 14 de outubro de 2025  
**Última atualização:** 14 de outubro de 2025 (região corrigida para southamerica-east1)  
**Status:** ✅ Pronto para uso
