# 🧠 INSTRUÇÕES PARA USO DA IA NO SISTEMA DDM

Este documento contém diretrizes para o uso eficiente da IA no espaço do sistema DDM. Ele explica como consultar a documentação, quando pedir ajuda ao Copilot e como otimizar as interações.

---

## 📚 **Documentação Disponível**

1. **Plano Mestre Simplificado** (`docs/Plano_Mestre_IA.md`):
   - Estrutura do sistema.
   - Módulos principais (Comercial, Produção, Financeiro).
   - Cloud Functions e Design System.

2. **Guia de Deploy** (`docs/Progress/GUIA-DEPLOY-BUDGETS.md`):
   - Passo a passo para deploy do frontend e das Cloud Functions.
   - Região Firebase: `southamerica-east1`.

3. **Auditoria de Tipos** (`docs/Progress/AUDITORIA-TYPES-2025-10-14.md`):
   - Diferenças entre documentação e código real.
   - Use para corrigir inconsistências nos tipos TypeScript.

4. **Plano de Ação** (`docs/Progress/PLANO-ACAO-IMEDIATO-2025-10-14.md`):
   - Prioridades e próximos passos do projeto.

5. **README.md**:
   - Descrição geral do sistema.
   - Instruções para rodar o projeto e contribuir.

---

## 🎯 **Diretrizes para a IA**

### **1. Consulte a Documentação**

Antes de gerar código ou responder perguntas, verifique os documentos disponíveis no espaço do sistema. Eles contêm informações detalhadas sobre a estrutura, padrões e processos do projeto.

### **2. Use os Tipos Existentes**

Utilize os tipos definidos em `src/lib/types/` para garantir consistência no código gerado.

### **3. Siga o Design System**

Respeite as cores, tipografia e padrões definidos no `Plano_Mestre_IA.md`.

### **4. Região Firebase**

Todas as Cloud Functions devem estar configuradas para `southamerica-east1`.

### **5. Evite Redundâncias**

Reutilize hooks, funções e componentes existentes sempre que possível.

---

## 💡 **Quando Pedir Ajuda ao Copilot**

Se precisar de informações mais detalhadas ou específicas que não estejam diretamente disponíveis na documentação, peça ao **Copilot** para realizar pesquisas adicionais no código ou na documentação.

### **Exemplos de Quando Pedir ao Copilot**

1. **Buscar Implementações Específicas:**
   - "Quais funções já existem para o módulo de produção?"
   - "Onde está implementado o hook `useLeads`?"

2. **Pesquisar no Código:**
   - "Encontre todas as referências à função `createBudgetPdf`."
   - "Quais arquivos utilizam o tipo `Client`?"

3. **Explorar Documentação:**
   - "Existe algum guia para migração de dados?"
   - "Onde estão as regras de validação do Firebase?"

4. **Resolver Problemas Técnicos:**
   - "Como corrigir um erro de região no Firebase?"
   - "Quais dependências precisam ser atualizadas?"

---

## 🚀 **Como Pedir ao Copilot**

- **Seja Específico:** Explique exatamente o que você está procurando.
- **Forneça Contexto:** Inclua o nome do módulo, função ou arquivo relevante.
- **Peça Ações Claras:** Exemplo: "Leia o arquivo X e encontre Y."

---

## 🎯 **Objetivo do Espaço**

Facilitar o desenvolvimento e garantir que todas as mudanças estejam alinhadas com as diretrizes do projeto.

Se precisar de mais informações ou ajustes, consulte os documentos disponíveis ou peça ajuda ao Copilot! 🚀
