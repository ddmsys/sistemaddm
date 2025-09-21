echo " Guia Básico Git e Branch para Projetos

## O que é Git?

Git é um sistema de controle de versão que permite salvar diferentes versões do seu código e trabalhar com segurança em equipe.

---

## Conceitos essenciais

- **Commit:** Salvar mudanças locais no seu repositório com uma mensagem.
- **Branch (ramo):** Linha paralela para desenvolver funcionalidades sem afetar o código principal.
- **Merge:** Integrar o código de uma branch no código principal.
- **Push:** Enviar suas alterações para o repositório remoto (ex: GitHub).
- **Pull:** Baixar as últimas alterações do repositório remoto para seu código local.

---

## Comandos básicos

### Criar e trocar de branch

\`\`\`
git checkout -b nome-da-branch
\`\`\`

### Fazer commit das alterações

\`\`\`
git add .
git commit -m \"Descrição clara do que foi feito\"
\`\`\`

### Enviar para o GitHub

\`\`\`
git push origin nome-da-branch
\`\`\`

### Trazer atualizações do remoto para main

\`\`\`
git checkout main
git pull origin main
\`\`\`

### Fazer merge da branch no main

\`\`\`
git checkout main
git merge nome-da-branch
git push origin main
\`\`\`

---

## Boas práticas

- Faça commits pequenos e frequentes.
- Use branches para cada nova funcionalidade.
- Teste bastante antes de integrar.
- Documente suas mudanças com mensagens claras.

---

## Erros comuns e como evitar

- Não fazer pull antes de começar a trabalhar.
- Esquecer de criar branches e trabalhar direto no main.
- Não testar antes de fazer o merge.
- Mensagens de commit vagas.

---

# Script para facilitar comandos Git

### Confirma branch atual
echo "Branch atual:"
git branch --show-current

### Passo 1: adicionar mudanças ao stage
git add .

### Passo 2: commit com mensagem
read -p "Digite a mensagem do commit: " msg
git commit -m "$msg"

### Passo 3: enviar para servidor remoto a branch atual
branch_name=$(git branch --show-current)
git push origin "$branch_name"

### Passo 4: se quiser, muda para main e atualiza
read -p "Quer atualizar main? (s/n) " atualizar
if [ "$atualizar" = "s" ]; then
  git checkout main
  git pull origin main
fi

### Passo 5: quer mesclar a branch na main?
read -p "Quer fazer merge da branch atual no main? (s/n) " mergear
if [ "$mergear" = "s" ]; then
  git merge "$branch_name"
  git push origin main
fi



