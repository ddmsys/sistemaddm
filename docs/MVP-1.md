# DDM MVP-1 — Guia Técnico (Código e Comandos)

> Documento de apoio rápido. Só blocos de código e comandos essenciais para copiar e colar.

---

## 1) Rodar o projeto

```bash
npm run dev
```

Acessar: [http://localhost:3000](http://localhost:3000)

---

## 2) Formulário de Clientes (src/components/ClientForm.tsx)

```tsx
'use client'
import { useState } from 'react'
import { db } from '@/lib/firebase'
import { addDoc, collection, serverTimestamp } from 'firebase/firestore'

export default function ClientForm() {
  const [nome, setNome] = useState('')
  const [email, setEmail] = useState('')
  const [telefone, setTelefone] = useState('')

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    await addDoc(collection(db, 'clients'), {
      nome, email, telefone,
      createdAt: serverTimestamp(),
    })
    setNome(''); setEmail(''); setTelefone('')
  }

  return (
    <form onSubmit={onSubmit} className="flex gap-2 flex-wrap">
      <input placeholder="Nome" value={nome} onChange={e=>setNome(e.target.value)} className="border rounded p-2" />
      <input placeholder="E-mail" value={email} onChange={e=>setEmail(e.target.value)} className="border rounded p-2" />
      <input placeholder="Telefone" value={telefone} onChange={e=>setTelefone(e.target.value)} className="border rounded p-2" />
      <button className="border rounded px-3">Adicionar</button>
    </form>
  )
}
```

---

## 3) Página de Clientes (src/app/(app)/clients/page.tsx)

```tsx
'use client'
import { useEffect, useState } from 'react'
import { db } from '@/lib/firebase'
import { collection, onSnapshot, orderBy, query, deleteDoc, doc } from 'firebase/firestore'
import ClientForm from '@/components/ClientForm'

export default function ClientsPage() {
  const [rows, setRows] = useState<any[]>([])

  useEffect(() => {
    const q = query(collection(db, 'clients'), orderBy('createdAt', 'desc'))
    const unsub = onSnapshot(q, snap => setRows(snap.docs.map(d => ({ id: d.id, ...d.data() }))))
    return () => unsub()
  }, [])

  async function remove(id: string) {
    await deleteDoc(doc(db, 'clients', id))
  }

  return (
    <section className="space-y-4">
      <h1 className="text-xl font-semibold">Clientes</h1>
      <ClientForm />
      <ul>
        {rows.map(r => (
          <li key={r.id} className="flex justify-between border p-2 rounded">
            <span>{r.nome} · {r.email} · {r.telefone}</span>
            <button onClick={() => remove(r.id)} className="text-red-600">Excluir</button>
          </li>
        ))}
      </ul>
    </section>
  )
}
```

---

## 4) Formulário de Projetos (src/components/ProjectForm.tsx)

```tsx
'use client'
import { useEffect, useState } from 'react'
import { db } from '@/lib/firebase'
import { addDoc, collection, getDocs, orderBy, query, serverTimestamp } from 'firebase/firestore'

export default function ProjectForm() {
  const [title, setTitle] = useState('')
  const [clientId, setClientId] = useState('')
  const [clients, setClients] = useState<any[]>([])

  useEffect(() => {
    (async () => {
      const q = query(collection(db, 'clients'), orderBy('createdAt', 'desc'))
      const snap = await getDocs(q)
      setClients(snap.docs.map(d => ({ id: d.id, ...d.data() })))
    })()
  }, [])

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    await addDoc(collection(db, 'projects'), {
      title, clientId, status: 'Novo', createdAt: serverTimestamp()
    })
    setTitle(''); setClientId('')
  }

  return (
    <form onSubmit={onSubmit} className="flex gap-2 flex-wrap">
      <input placeholder="Título" value={title} onChange={e=>setTitle(e.target.value)} className="border rounded p-2" />
      <select value={clientId} onChange={e=>setClientId(e.target.value)} className="border rounded p-2">
        <option value="">Selecione um cliente</option>
        {clients.map(c => <option key={c.id} value={c.id}>{c.nome}</option>)}
      </select>
      <button className="border rounded px-3">Criar</button>
    </form>
  )
}
```

---

## 5) Página de Projetos (src/app/(app)/projects/page.tsx)

```tsx
'use client'
import { useEffect, useState } from 'react'
import { db } from '@/lib/firebase'
import { collection, onSnapshot, orderBy, query } from 'firebase/firestore'
import ProjectForm from '@/components/ProjectForm'

export default function ProjectsPage() {
  const [rows, setRows] = useState<any[]>([])

  useEffect(() => {
    const q = query(collection(db, 'projects'), orderBy('createdAt', 'desc'))
    const unsub = onSnapshot(q, snap => setRows(snap.docs.map(d => ({ id: d.id, ...d.data() }))))
    return () => unsub()
  }, [])

  return (
    <section className="space-y-4">
      <h1 className="text-xl font-semibold">Projetos</h1>
      <ProjectForm />
      <ul>
        {rows.map(r => (
          <li key={r.id} className="border p-2 rounded">
            {r.title} — Cliente: {r.clientId}
          </li>
        ))}
      </ul>
    </section>
  )
}
```

---

## 6) Cloud Function (functions/src/index.ts)

```ts
import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'

admin.initializeApp()
const db = admin.firestore()

export const onProjectCreate = functions.firestore
  .document('projects/{projectId}')
  .onCreate(async (snap, context) => {
    const projectId = context.params.projectId
    const defaultTasks = [
      { title: 'Revisão', status: 'Aberta' },
      { title: 'Diagramação', status: 'Pendente' },
      { title: 'Capa', status: 'Pendente' },
      { title: 'ISBN', status: 'Pendente' },
    ]

    const batch = db.batch()
    const tasksCol = db.collection('projects').doc(projectId).collection('tasks')
    for (const t of defaultTasks) {
      const ref = tasksCol.doc()
      batch.set(ref, { ...t, createdAt: admin.firestore.FieldValue.serverTimestamp() })
    }
    await batch.commit()
  })
```

Deploy:

```bash
cd functions
npm i
npm run build
firebase deploy --only functions
```

---

## 7) Testar fluxo

1. `npm run dev` → abrir [http://localhost:3000/login](http://localhost:3000/login)
2. Criar cliente em `/clients`
3. Criar projeto em `/projects`
4. Conferir no Firestore → `projects/{id}/tasks`

---
# DDM MVP‑1 — Setup & Código (Next.js + Firebase)

> Objetivo: **Clientes + Projetos/Pedidos + Tarefas automáticas** ao criar um projeto. Stack: **Next.js/React** (App Router) + **Firebase** (Auth, Firestore, Functions, Hosting, Storage) + TypeScript.

---

## 0) Pré‑requisitos (uma vez)

- **Node.js LTS** (≥ 18): `node -v`
- **Git**: `git --version`
- **VS Code**
- **Conta Firebase** (console.firebase.google.com)
- **Conta Vercel** (opcional para deploy do front)

---

## 1) Estrutura atual (já feita)

- ✅ Projeto Next.js criado e rodando (`create-next-app`).
- ✅ Firebase configurado com `.env.local` (Auth + Firestore + Storage).
- ✅ Login funcionando com Firebase Auth.
- ✅ Área interna protegida por `AuthGuard`.
- ✅ **Clientes** com formulário (Nome, E-mail, Telefone, Origem) + lista em tempo real + excluir.
- ✅ Header simples com navegação e botão Sair.
- ✅ Tailwind ativo (UI básica).

---

## 2) Próxima entrega — **Projetos/Pedidos**

### A) Página /projects

- Formulário para cadastrar projeto:
  - `title` (título do projeto)
  - `clientId` (cliente vinculado)
  - `dueDate` (prazo)
  - `budget` (orçamento)
- Gravar em **Firestore → projects**.
- Listagem em tempo real.

### B) Cloud Function — tarefas padrão

- Ao criar um projeto, a Function cria 4 tarefas iniciais:
  - Revisão (Aberta)
  - Diagramação (Pendente)
  - Capa (Pendente)
  - ISBN (Pendente)
- Salvas em **projects/{projectId}/tasks**.

### C) Estrutura Firestore

```
clients
  id, nome, email, telefone, origem, createdAt

projects
  id, title, clientId, status, dueDate, budget, createdAt

projects/{projectId}/tasks
  id, title, status, assigneeId?, dueDate?, createdAt
```

---

## 3) Código — Projetos

### src/components/ProjectForm.tsx

```tsx
'use client'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { addDoc, collection, serverTimestamp } from 'firebase/firestore'
import { db } from '@/lib/firebase'

const schema = z.object({
  title: z.string().min(2),
  clientId: z.string().min(1),
  dueDate: z.string().optional(),
  budget: z.coerce.number().optional(),
})

type FormData = z.infer<typeof schema>

export default function ProjectForm() {
  const { register, handleSubmit, reset, formState: { isSubmitting } } = useForm<FormData>({ resolver: zodResolver(schema) })

  const onSubmit = async (data: FormData) => {
    await addDoc(collection(db, 'projects'), { ...data, status: 'Novo', createdAt: serverTimestamp() })
    reset()
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex gap-2 flex-wrap">
      <input placeholder="Título do projeto" className="border rounded p-2" {...register('title')} />
      <input placeholder="ID do cliente" className="border rounded p-2" {...register('clientId')} />
      <input placeholder="Prazo (YYYY-MM-DD)" className="border rounded p-2" {...register('dueDate')} />
      <input placeholder="Orçamento (R$)" className="border rounded p-2" {...register('budget')} />
      <button disabled={isSubmitting} className="border rounded px-3">Criar projeto</button>
    </form>
  )
}
```

### src/app/(app)/projects/page.tsx

```tsx
'use client'
import { collection, onSnapshot, orderBy, query } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { useEffect, useState } from 'react'
import ProjectForm from '@/components/ProjectForm'

export default function ProjectsPage() {
  const [rows, setRows] = useState<any[]>([])

  useEffect(() => {
    const q = query(collection(db, 'projects'), orderBy('createdAt', 'desc'))
    const unsub = onSnapshot(q, snap => setRows(snap.docs.map(d => ({ id: d.id, ...d.data() }))))
    return () => unsub()
  }, [])

  return (
    <section className="space-y-4">
      <h1 className="text-xl font-semibold">Projetos</h1>
      <ProjectForm />
      <ul className="space-y-2">
        {rows.map(r => (
          <li key={r.id} className="border rounded p-3">
            <div className="font-medium">{r.title}</div>
            <div className="text-sm text-gray-600">Cliente: {r.clientId} · Status: {r.status} · Prazo: {r.dueDate || '—'}</div>
          </li>
        ))}
      </ul>
    </section>
  )
}
```

---

## 4) Cloud Function — gerar tarefas padrão

### functions/src/index.ts

```ts
import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'

admin.initializeApp()
const db = admin.firestore()

export const onProjectCreate = functions.firestore
  .document('projects/{projectId}')
  .onCreate(async (snap, context) => {
    const projectId = context.params.projectId as string
    const defaultTasks = [
      { title: 'Revisão', status: 'Aberta' },
      { title: 'Diagramação', status: 'Pendente' },
      { title: 'Capa', status: 'Pendente' },
      { title: 'ISBN', status: 'Pendente' },
    ]

    const batch = db.batch()
    const tasksCol = db.collection('projects').doc(projectId).collection('tasks')
    for (const t of defaultTasks) {
      const ref = tasksCol.doc()
      batch.set(ref, { ...t, createdAt: admin.firestore.FieldValue.serverTimestamp() })
    }
    await batch.commit()
  })
```

Deploy:

```bash
cd functions
npm i
npm run build
firebase deploy --only functions
```

---

## 5) Teste

1. `npm run dev` no front.
2. Acesse `/login`, entre com usuário.
3. Vá para `/clients`, crie um cliente.
4. Vá para `/projects`, crie um projeto.
5. No Firestore, confira: `projects/{id}` e subcoleção `tasks` com 4 tarefas.

---

## 6) Próximos passos

- Substituir `clientId` por **dropdown real** de clientes.
- Criar página `/projects/[id]` para ver/editar tarefas.
- Refinar layout (cards, botões, ícones).
- Adicionar perfis de acesso (claims).



---

## 11) Módulo **Projects/Pedidos** (com tarefas automáticas)

> Copiar e colar. Versão simples, sem libs extras. Usa apenas `useState`, `useEffect` e Firestore.

### 11.1 Formulário de Projeto (com **dropdown de clientes**)

**Arquivo:** `src/components/ProjectForm.tsx`

```tsx
'use client'
import { useEffect, useState } from 'react'
import { db } from '@/lib/firebase'
import { addDoc, collection, getDocs, orderBy, query, serverTimestamp } from 'firebase/firestore'

export default function ProjectForm() {
  const [title, setTitle] = useState('')
  const [clientId, setClientId] = useState('')
  const [dueDate, setDueDate] = useState('')
  const [budget, setBudget] = useState('')
  const [clients, setClients] = useState<{ id: string; nome?: string }[]>([])
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    (async () => {
      const q = query(collection(db, 'clients'), orderBy('createdAt', 'desc'))
      const snap = await getDocs(q)
      setClients(snap.docs.map(d => ({ id: d.id, ...(d.data() as any) })))
    })()
  }, [])

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    if (!title.trim()) return setError('Título é obrigatório')
    if (!clientId) return setError('Selecione um cliente')
    try {
      setSaving(true)
      await addDoc(collection(db, 'projects'), {
        title: title.trim(),
        clientId,
        dueDate: dueDate || null,
        budget: budget ? Number(budget) : null,
        status: 'Novo',
        createdAt: serverTimestamp(),
      })
      setTitle(''); setClientId(''); setDueDate(''); setBudget('')
    } catch (err) {
      setError('Não foi possível criar o projeto. Tente novamente.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-wrap gap-2">
      <input className="border rounded p-2" placeholder="Título do projeto *" value={title} onChange={e=>setTitle(e.target.value)} />
      <select className="border rounded p-2" value={clientId} onChange={e=>setClientId(e.target.value)}>
        <option value="">Selecione um cliente *</option>
        {clients.map(c => (
          <option key={c.id} value={c.id}>{c.nome || c.id}</option>
        ))}
      </select>
      <input className="border rounded p-2" placeholder="Prazo (YYYY-MM-DD)" value={dueDate} onChange={e=>setDueDate(e.target.value)} />
      <input className="border rounded p-2" placeholder="Orçamento (R$)" value={budget} onChange={e=>setBudget(e.target.value)} />
      <button disabled={saving} className="border rounded px-3 py-2 disabled:opacity-50">{saving ? 'Criando…' : 'Criar projeto'}</button>
      {error && <div className="w-full text-sm text-red-600">{error}</div>}
    </form>
  )
}
```

### 11.2 Página de Projetos (lista em tempo real)

**Arquivo:** `src/app/(app)/projects/page.tsx`

```tsx
'use client'
import { useEffect, useState } from 'react'
import { db } from '@/lib/firebase'
import { collection, onSnapshot, orderBy, query } from 'firebase/firestore'
import ProjectForm from '@/components/ProjectForm'

export default function ProjectsPage() {
  const [rows, setRows] = useState<any[]>([])

  useEffect(() => {
    const q = query(collection(db, 'projects'), orderBy('createdAt', 'desc'))
    const unsub = onSnapshot(q, snap => setRows(snap.docs.map(d => ({ id: d.id, ...(d.data() as any) }))))
    return () => unsub()
  }, [])

  return (
    <section className="space-y-6">
      <h1 className="text-2xl font-semibold">Projetos</h1>
      <ProjectForm />
      <ul className="space-y-2">
        {rows.map(r => (
          <li key={r.id} className="border rounded-2xl p-3 bg-white">
            <div className="font-medium">{r.title}</div>
            <div className="text-sm text-gray-600">Cliente: {r.clientId} · Status: {r.status} · Prazo: {r.dueDate || '—'} · Orçamento: {r.budget ?? '—'}</div>
          </li>
        ))}
      </ul>
    </section>
  )
}
```

> Navegação: adicione um link no `Header` (opcional) para `/projects`.

### 11.3 Cloud Function: gerar tarefas padrão ao criar projeto

> Uma vez configurado o Firebase CLI no repositório.

1. **Instalar/entrar nas Functions** (na raiz do projeto):

```bash
npm i -g firebase-tools
firebase login
firebase init functions firestore
# escolha TypeScript nas Functions; associe ao seu projeto existente
```

2. **Código da Function** **Arquivo:** `functions/src/index.ts`

```ts
import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'

admin.initializeApp()
const db = admin.firestore()

export const onProjectCreate = functions.firestore
  .document('projects/{projectId}')
  .onCreate(async (snap, context) => {
    const projectId = context.params.projectId as string
    const defaultTasks = [
      { title: 'Revisão', status: 'Aberta' },
      { title: 'Diagramação', status: 'Pendente' },
      { title: 'Capa', status: 'Pendente' },
      { title: 'ISBN', status: 'Pendente' },
    ]

    const batch = db.batch()
    const tasksCol = db.collection('projects').doc(projectId).collection('tasks')
    for (const t of defaultTasks) {
      const ref = tasksCol.doc()
      batch.set(ref, { ...t, createdAt: admin.firestore.FieldValue.serverTimestamp() })
    }
    await batch.commit()
  })
```

3. **Deploy**

```bash
cd functions
npm i
npm run build
firebase deploy --only functions
```

> Teste: crie um projeto em `/projects`. No Firestore, veja `projects/{id}/tasks` com as 4 tarefas.

### 11.4 Regras (lembrar)

- **Firestore rules** do MVP já permitem (se logada) ler/escrever.
- Depois vamos refinar permissões por coleção e papéis.

### 11.5 Problemas comuns

- **Function não dispara** → ver **Console Firebase → Functions → Logs**.
- **Permissão negada** → confira `firestore.rules` e se está logada.
- **Dropdown vazio** → ver se há clientes na coleção `clients`.

---

## 12) Checklist atualizado (MVP‑1)

- ✅ Login + área interna
- ✅ Clientes: CRUD básico
- ✅ Projetos: formulário + lista
- ✅ Function: cria tarefas padrão


