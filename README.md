# 📘 Sistema DDM

**Sistema de gestão comercial e produção editorial.**  
Gerencie leads, clientes, orçamentos, projetos e produção editorial em um único lugar.

---

## 🚀 Funcionalidades Principais

- **Comercial:**
  - Gestão de leads, clientes e orçamentos.
  - Dashboards com métricas de conversão e receita.

- **Produção:**
  - Fila de produção e controle de qualidade.
  - Provas e revisões.

- **Financeiro:**
  - Controle de faturas e métricas financeiras.

---

## 📂 Estrutura do Projeto

```plaintext
sistemaddm/
├── docs/                  # Documentação
├── functions/             # Cloud Functions (Firebase)
├── src/                   # Frontend (Next.js)
├── config/                # Configurações Firebase
├── .env.local             # Variáveis de ambiente
├── firebase.json          # Config Firebase
├── package.json           # Dependências
└── tsconfig.json          # Config TypeScript
```

---

## 🛠️ Como Rodar o Projeto

1. **Clone o repositório:**

   ```bash
   git clone https://github.com/ddmsys/sistemaddm.git
   cd sistemaddm
   ```

2. **Instale as dependências:**

   ```bash
   npm install
   ```

3. **Configure as variáveis de ambiente:**
   - Crie um arquivo `.env.local` com as seguintes variáveis:
     ```env
     NEXT_PUBLIC_API_URL=https://sua-api.com
     FIREBASE_API_KEY=...
     ```

4. **Inicie o servidor de desenvolvimento:**

   ```bash
   npm run dev
   ```

5. **Acesse no navegador:**
   - [http://localhost:3000](http://localhost:3000)

---

## 🚀 Deploy

1. **Deploy do Frontend:**
   - Use o [Vercel](https://vercel.com) para deploy contínuo.

2. **Deploy das Cloud Functions:**
   - Certifique-se de estar na região `southamerica-east1`:
     ```bash
     firebase deploy --only functions
     ```

---

## 🤝 Contribuição

1. Faça um fork do repositório.
2. Crie uma branch para sua feature:
   ```bash
   git checkout -b minha-feature
   ```
3. Envie um pull request.

---

## 📚 Links Úteis

- [Documentação do Sistema](docs/README.md)
- [Guia de Deploy](docs/Progress/GUIA-DEPLOY-BUDGETS.md)
- [Auditoria de Tipos](docs/Progress/AUDITORIA-TYPES-2025-10-14.md)

---

**Desenvolvido por:** [Sua Equipe/Empresa]  
**Licença:** MIT
