# ✅ CHECKLIST DE INSTALAÇÃO - HOOKS CORRIGIDOS

> Use este checklist para garantir que tudo foi instalado corretamente!

---

## 📋 PRÉ-REQUISITOS

Antes de copiar os hooks, certifique-se de que você tem:

### 1. Pacotes Instalados
```bash
# Verificar se o Firebase está instalado
npm list firebase

# Se não estiver, instalar:
npm install firebase
```

### 2. Types Criados
- [ ] `src/lib/types/books.ts` existe
- [ ] `src/lib/types/budgets.ts` existe
- [ ] `src/lib/types/orders.ts` existe
- [ ] `src/lib/types/production-projects.ts` existe

### 3. Firebase Configurado
- [ ] `src/lib/firebase.ts` existe e está configurado
- [ ] Variáveis de ambiente no `.env.local`:
  ```
  NEXT_PUBLIC_FIREBASE_API_KEY=...
  NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
  NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
  NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=...
  NEXT_PUBLIC_FIREBASE_APP_ID=...
  NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
  ```

### 4. useAuth Hook
- [ ] `src/hooks/useAuth.ts` existe
- [ ] Retorna: `{ user, loading, signIn, signUp, signOut }`
- [ ] `user` é do tipo `User | null` (Firebase Auth)

---

## 📁 ESTRUTURA DE PASTAS

### Criar todas as pastas necessárias:

```bash
mkdir -p src/hooks/books
mkdir -p src/hooks/budgets
mkdir -p src/hooks/orders
mkdir -p src/hooks/production
```

**Verificação:**
- [ ] Pasta `src/hooks/books` criada
- [ ] Pasta `src/hooks/budgets` criada
- [ ] Pasta `src/hooks/orders` criada
- [ ] Pasta `src/hooks/production` criada

---

## 📝 COPIAR ARQUIVOS

### 1. useBooks Hook

**Arquivo de origem:** `/home/claude/useBooks-CORRECTED.ts`  
**Destino:** `src/hooks/books/useBooks.ts`

```bash
# Comando para copiar
cp /home/claude/useBooks-CORRECTED.ts src/hooks/books/useBooks.ts
```

**Verificação:**
- [ ] Arquivo `src/hooks/books/useBooks.ts` existe
- [ ] Tem ~290 linhas
- [ ] Imports corretos no topo
- [ ] Exporta função `useBooks`

---

### 2. useBudgets Hook

**Arquivo de origem:** `/home/claude/useBudgets-CORRECTED.ts`  
**Destino:** `src/hooks/budgets/useBudgets.ts`

```bash
# Comando para copiar
cp /home/claude/useBudgets-CORRECTED.ts src/hooks/budgets/useBudgets.ts
```

**Verificação:**
- [ ] Arquivo `src/hooks/budgets/useBudgets.ts` existe
- [ ] Tem ~350 linhas
- [ ] Imports corretos no topo
- [ ] Exporta função `useBudgets`

---

### 3. useOrders Hook

**Arquivo de origem:** `/home/claude/useOrders-CORRECTED.ts`  
**Destino:** `src/hooks/orders/useOrders.ts`

```bash
# Comando para copiar
cp /home/claude/useOrders-CORRECTED.ts src/hooks/orders/useOrders.ts
```

**Verificação:**
- [ ] Arquivo `src/hooks/orders/useOrders.ts` existe
- [ ] Tem ~340 linhas
- [ ] Imports corretos no topo
- [ ] Exporta função `useOrders`

---

### 4. useProductionProjects Hook

**Arquivo de origem:** `/home/claude/useProductionProjects-CORRECTED.ts`  
**Destino:** `src/hooks/production/useProductionProjects.ts`

```bash
# Comando para copiar
cp /home/claude/useProductionProjects-CORRECTED.ts src/hooks/production/useProductionProjects.ts
```

**Verificação:**
- [ ] Arquivo `src/hooks/production/useProductionProjects.ts` existe
- [ ] Tem ~490 linhas
- [ ] Imports corretos no topo
- [ ] Exporta função `useProductionProjects`

---

## 🔍 VERIFICAÇÃO DE COMPILAÇÃO

### 1. Verificar erros de TypeScript

```bash
npx tsc --noEmit
```

**Se houver erros, verifique:**
- [ ] Todos os types estão instalados
- [ ] Firebase está configurado
- [ ] useAuth existe e retorna tipos corretos
- [ ] Paths do tsconfig.json estão corretos (`@/lib`, `@/hooks`)

---

### 2. Verificar imports

Abra cada arquivo e verifique se todos os imports estão corretos:

#### useBooks.ts
```typescript
import { db } from '@/lib/firebase'; // ✅
import { useAuth } from '@/hooks/useAuth'; // ✅
import { Book, ... } from '@/lib/types/books'; // ✅
```

#### useBudgets.ts
```typescript
import { db } from '@/lib/firebase'; // ✅
import { useAuth } from '@/hooks/useAuth'; // ✅
import { Budget, ... } from '@/lib/types/budgets'; // ✅
```

#### useOrders.ts
```typescript
import { db } from '@/lib/firebase'; // ✅
import { useAuth } from '@/hooks/useAuth'; // ✅
import { Order, ... } from '@/lib/types/orders'; // ✅
import { Budget } from '@/lib/types/budgets'; // ✅
```

#### useProductionProjects.ts
```typescript
import { db } from '@/lib/firebase'; // ✅
import { useAuth } from '@/hooks/useAuth'; // ✅
import { ProductionProject, ... } from '@/lib/types/production-projects'; // ✅
import { Order } from '@/lib/types/orders'; // ✅
```

---

## 🧪 TESTE BÁSICO

### 1. Criar página de teste

Crie `src/app/test-hooks/page.tsx`:

```tsx
'use client';

import { useBooks } from '@/hooks/books/useBooks';
import { useBudgets } from '@/hooks/budgets/useBudgets';
import { useOrders } from '@/hooks/orders/useOrders';
import { useProductionProjects } from '@/hooks/production/useProductionProjects';

export default function TestHooksPage() {
  const { books, loading: booksLoading } = useBooks();
  const { budgets, loading: budgetsLoading } = useBudgets();
  const { orders, loading: ordersLoading } = useOrders();
  const { projects, loading: projectsLoading } = useProductionProjects();

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Hooks Test</h1>
      
      <div className="space-y-4">
        <div>
          <h2 className="font-bold">Books:</h2>
          {booksLoading ? 'Loading...' : `${books.length} books found`}
        </div>

        <div>
          <h2 className="font-bold">Budgets:</h2>
          {budgetsLoading ? 'Loading...' : `${budgets.length} budgets found`}
        </div>

        <div>
          <h2 className="font-bold">Orders:</h2>
          {ordersLoading ? 'Loading...' : `${orders.length} orders found`}
        </div>

        <div>
          <h2 className="font-bold">Production Projects:</h2>
          {projectsLoading ? 'Loading...' : `${projects.length} projects found`}
        </div>
      </div>
    </div>
  );
}
```

### 2. Verificar funcionamento

```bash
npm run dev
```

Abra: `http://localhost:3000/test-hooks`

**Verificação:**
- [ ] Página carrega sem erros
- [ ] Hooks não geram erros no console
- [ ] "Loading..." aparece e depois mostra contadores
- [ ] Não há erros de TypeScript

---

## ✅ CHECKLIST FINAL

Marque todos os itens:

### Pré-requisitos
- [ ] Firebase instalado
- [ ] Types criados
- [ ] Firebase configurado
- [ ] useAuth implementado

### Estrutura
- [ ] Pastas criadas
- [ ] 4 arquivos de hooks copiados

### Verificação
- [ ] TypeScript compila sem erros
- [ ] Imports corretos
- [ ] Página de teste funciona

---

## 🚨 TROUBLESHOOTING

### Erro: "Cannot find module '@/lib/firebase'"

**Solução:** Verifique `tsconfig.json`:

```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

---

### Erro: "Property 'uid' does not exist on type 'User'"

**Solução:** Certifique-se de importar o User correto:

```typescript
import { User } from 'firebase/auth'; // ✅ Correto
// NÃO: import { User } from '@/lib/types/users'; // ❌ Errado
```

---

### Erro: "Timestamp.fromDate() expects Date"

**Solução:** Isso JÁ está corrigido nos arquivos `-CORRECTED.ts`. Se ainda aparecer, verifique se copiou os arquivos corretos.

---

### Erro: "useAuth is not defined"

**Solução:** Implemente o hook `useAuth`:

```typescript
// src/hooks/useAuth.ts
import { useContext } from 'react';
import { AuthContext } from '@/context/AuthContext';

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
```

---

## 🎉 SUCESSO!

Se todos os checkboxes estão marcados, seus hooks estão **100% funcionais**!

Próximos passos:
1. ✅ Criar componentes de UI (Modals, Forms, Cards)
2. ✅ Criar páginas do sistema
3. ✅ Implementar Cloud Functions

---

**📅 Data de instalação:** _____________

**✅ Instalado por:** _____________

**🎯 Status:** [ ] Em andamento [ ] Completo
