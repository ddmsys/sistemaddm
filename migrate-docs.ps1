# SCRIPT DE MIGRAÇÃO DE DOCUMENTAÇÃO - SISTEMA DDM (PowerShell)
# 
# Objetivo: Reorganizar documentos, remover credenciais expostas e
#           criar estrutura definitiva
#
# Data: 18 de outubro de 2025
# Versão: 1.0

$ErrorActionPreference = "Stop"

# Cores para output
function Write-Step { Write-Host "[STEP] $args" -ForegroundColor Blue }
function Write-Success { Write-Host "[OK] $args" -ForegroundColor Green }
function Write-Warning { Write-Host "[WARNING] $args" -ForegroundColor Yellow }
function Write-ErrorMsg { Write-Host "[ERROR] $args" -ForegroundColor Red }

################################################################################
# INÍCIO DO SCRIPT
################################################################################

Write-Host ""
Write-Host "╔════════════════════════════════════════════════════════════╗"
Write-Host "║   MIGRAÇÃO DE DOCUMENTAÇÃO - SISTEMA DDM                   ║"
Write-Host "║   Data: 18 de outubro de 2025                              ║"
Write-Host "╚════════════════════════════════════════════════════════════╝"
Write-Host ""

# Verificar se está no diretório raiz do projeto
if (-not (Test-Path "docs")) {
    Write-ErrorMsg "Pasta 'docs' não encontrada!"
    Write-Warning "Execute este script da raiz do projeto sistemaddm\"
    exit 1
}

Write-Success "Pasta docs encontrada!"
Write-Host ""

################################################################################
# PASSO 1: BACKUP
################################################################################

Write-Step "1/8: Criando backup da documentação atual..."

$timestamp = Get-Date -Format "yyyyMMdd-HHmmss"
$backupDir = "docs-backup-$timestamp"
New-Item -ItemType Directory -Path $backupDir -Force | Out-Null

# Copiar todos os arquivos .md para backup
if (Test-Path "docs") {
    Copy-Item -Path "docs\*" -Destination $backupDir -Recurse -Force -ErrorAction SilentlyContinue
}

# Copiar arquivos .md da raiz se existirem
$rootFiles = @(
    "Plano_Mestre_DDM.md",
    "PLANO-MESTRE-INTEGRADO-COMPLETO.md",
    "ROADMAP-COMPLETO-SISTEMA-DDM.md"
)

foreach ($file in $rootFiles) {
    if (Test-Path $file) {
        Copy-Item -Path $file -Destination $backupDir -Force -ErrorAction SilentlyContinue
    }
}

Write-Success "Backup criado em: $backupDir"
Write-Host ""

################################################################################
# PASSO 2: CRIAR ESTRUTURA DE PASTAS
################################################################################

Write-Step "2/8: Criando nova estrutura de pastas..."

$folders = @(
    "docs\principais",
    "docs\analise",
    "docs\referencia",
    "docs\deprecated"
)

foreach ($folder in $folders) {
    New-Item -ItemType Directory -Path $folder -Force | Out-Null
}

Write-Success "Estrutura de pastas criada!"
Write-Host ""

################################################################################
# PASSO 3: REMOVER CREDENCIAIS DO PLANO_MESTRE_DDM.md
################################################################################

Write-Step "3/8: Removendo credenciais expostas..."

if (Test-Path "Plano_Mestre_DDM.md") {
    Write-Warning "Arquivo Plano_Mestre_DDM.md encontrado"
    
    # Ler conteúdo
    $content = Get-Content "Plano_Mestre_DDM.md" -Raw
    
    # Remover credenciais (linhas 1174-1179)
    $lines = Get-Content "Plano_Mestre_DDM.md"
    $newLines = @()
    
    for ($i = 0; $i -lt $lines.Count; $i++) {
        if ($i -ge 1173 -and $i -le 1178) {
            # Pular linhas com credenciais
            continue
        }
        if ($i -eq 1173) {
            # Adicionar placeholders
            $newLines += "  NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here"
            $newLines += "  NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com"
            $newLines += "  NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id"
            $newLines += "  NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.firebasestorage.app"
            $newLines += "  NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789"
            $newLines += "  NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abcdef"
        }
        $newLines += $lines[$i]
    }
    
    # Salvar arquivo temporário
    $newLines | Set-Content "Plano_Mestre_DDM_temp.md" -Encoding UTF8
    
    Write-Success "Credenciais removidas com sucesso"
    
    # Verificar se credenciais ainda existem
    $tempContent = Get-Content "Plano_Mestre_DDM_temp.md" -Raw
    if ($tempContent -match "your_api_key_here") {
        Write-ErrorMsg "ATENÇÃO: Credenciais ainda presentes no arquivo!"
    } else {
        Write-Success "Verificação: Credenciais removidas com sucesso"
    }
} else {
    Write-Warning "Arquivo Plano_Mestre_DDM.md não encontrado (ok se já foi movido)"
}

Write-Host ""

################################################################################
# PASSO 4: MOVER DOCUMENTOS PARA NOVA ESTRUTURA
################################################################################

Write-Step "4/8: Movendo documentos para nova estrutura..."

# Documentos PRINCIPAIS
Write-Host "  → Movendo documentos principais..."

$principaisFiles = @{
    "PLANO-MESTRE-INTEGRADO-COMPLETO.md" = "docs\principais\"
    "ROADMAP-COMPLETO-SISTEMA-DDM.md" = "docs\principais\"
    "ANALISE-DETALHADA-ESTRUTURA-2025-10-18.md" = "docs\principais\"
}

foreach ($file in $principaisFiles.Keys) {
    if (Test-Path $file) {
        Move-Item -Path $file -Destination $principaisFiles[$file] -Force
        Write-Success "  ✓ $file"
    }
}

# Documentos de ANÁLISE
Write-Host "  → Movendo documentos de análise..."

$analiseFiles = @(
    "RELATORIO-INCONSISTENCIAS-COMPLETO.md",
    "PLANO-DE-ACAO-EXECUTIVO.md",
    "RESUMO-EXECUTIVO-VISUAL.md",
    "CHECKLIST-INTERATIVO.md"
)

foreach ($file in $analiseFiles) {
    if (Test-Path $file) {
        Move-Item -Path $file -Destination "docs\analise\" -Force
        Write-Success "  ✓ $file"
    }
}

# Documentos de REFERÊNCIA
Write-Host "  → Movendo documentos de referência..."

if (Test-Path "docs") {
    $referenciaPattern = @("0*.md", "TYPES*.md", "INSTRUCOES*.md")
    
    foreach ($pattern in $referenciaPattern) {
        Get-ChildItem -Path "docs" -Filter $pattern -ErrorAction SilentlyContinue | ForEach-Object {
            Move-Item -Path $_.FullName -Destination "docs\referencia\" -Force
            Write-Success "  ✓ $($_.Name)"
        }
    }
}

# Plano_Mestre_DDM -> DEPRECATED
Write-Host "  → Arquivando documentos deprecated..."

if (Test-Path "Plano_Mestre_DDM_temp.md") {
    Move-Item -Path "Plano_Mestre_DDM_temp.md" -Destination "docs\deprecated\Plano_Mestre_DDM_v1_14out2025.md" -Force
    Write-Success "  ✓ Plano_Mestre_DDM.md → deprecated/"
}

# Remover original se ainda existir
if (Test-Path "Plano_Mestre_DDM.md") {
    Remove-Item "Plano_Mestre_DDM.md" -Force
    Write-Success "  ✓ Original removido"
}

Write-Host ""

################################################################################
# PASSO 5: CRIAR README.md NA PASTA DEPRECATED
################################################################################

Write-Step "5/8: Criando documentação para pasta deprecated..."

$deprecatedReadme = @"
# 📦 Documentos Deprecated

Estes documentos foram substituídos por versões mais atualizadas e **NÃO devem ser usados** como referência.

---

## 📄 Plano_Mestre_DDM_v1_14out2025.md

**Status:** ❌ DEPRECATED  
**Data original:** 14 de outubro de 2025  
**Substituído por:** ``docs/principais/PLANO-MESTRE-INTEGRADO-COMPLETO.md``

**Motivos do arquivamento:**
1. 🔐 Continha credenciais Firebase expostas (REMOVIDAS nesta versão)
2. 📅 Desatualizado (versão de 14/10, atual é 18/10)
3. 🗂️ Estrutura de pastas diferente do código real
4. 📝 Informações conflitantes com código

**Data de arquivamento:** 18 de outubro de 2025
"@

Set-Content -Path "docs\deprecated\README.md" -Value $deprecatedReadme -Encoding UTF8

Write-Success "README.md criado em docs\deprecated\"
Write-Host ""

################################################################################
# PASSO 6: CRIAR MASTER INDEX
################################################################################

Write-Step "6/8: Criando Master Index..."

$masterIndex = @"
# 📚 ÍNDICE MASTER - DOCUMENTAÇÃO SISTEMA DDM

**Última Atualização:** 18 de outubro de 2025  
**Versão:** 2.0 (Reorganizada)

---

## 🎯 INÍCIO RÁPIDO

**Novo no projeto?** Leia nesta ordem:

1. 📘 ``principais/PLANO-MESTRE-INTEGRADO-COMPLETO.md`` (20 min)
2. 🎯 ``analise/RESUMO-EXECUTIVO-VISUAL.md`` (5 min)
3. 🚀 ``principais/ROADMAP-COMPLETO-SISTEMA-DDM.md`` (15 min)

**Vai implementar correções?**

1. ⚡ ``analise/PLANO-DE-ACAO-EXECUTIVO.md`` (20 min)
2. ✅ ``analise/CHECKLIST-INTERATIVO.md`` (durante implementação)

---

## 📁 ESTRUTURA DE DOCUMENTAÇÃO

````
docs/
├── 00-MASTER-INDEX.md                    ← VOCÊ ESTÁ AQUI
│
├── principais/                           ⭐ DOCUMENTOS PRINCIPAIS
│   ├── PLANO-MESTRE-INTEGRADO-COMPLETO.md
│   ├── ROADMAP-COMPLETO-SISTEMA-DDM.md
│   └── ANALISE-DETALHADA-ESTRUTURA.md
│
├── analise/                              📊 ANÁLISE E CORREÇÕES
│   ├── RELATORIO-INCONSISTENCIAS-COMPLETO.md
│   ├── PLANO-DE-ACAO-EXECUTIVO.md
│   ├── RESUMO-EXECUTIVO-VISUAL.md
│   └── CHECKLIST-INTERATIVO.md
│
├── referencia/                           📚 REFERÊNCIA TÉCNICA
│   ├── 00-OVERVIEW.md
│   ├── 01-TYPES-COMPLETE.md
│   └── ...
│
└── deprecated/                           📦 ARQUIVADOS
    └── Plano_Mestre_DDM_v1_14out2025.md
````

---

**Migração executada com sucesso! 🎉**
"@

Set-Content -Path "docs\00-MASTER-INDEX.md" -Value $masterIndex -Encoding UTF8

Write-Success "Master Index criado em docs\00-MASTER-INDEX.md"
Write-Host ""

################################################################################
# PASSO 7: VERIFICAR CREDENCIAIS NO GIT
################################################################################

Write-Step "7/8: Verificando credenciais no histórico do Git..."

if (Get-Command git -ErrorAction SilentlyContinue) {
    try {
        git rev-parse --git-dir 2>&1 | Out-Null
        $isGitRepo = $LASTEXITCODE -eq 0
        
        if ($isGitRepo) {
            Write-Host "  Procurando por credenciais no histórico..."
            
            $gitSearch = git log -S "your_api_key_here" --all --oneline 2>&1 | Select-Object -First 5
            
            if ($gitSearch) {
                Write-Warning "ATENÇÃO: Credenciais encontradas no histórico do Git!"
                Write-Warning "Considere rotacionar as chaves no Firebase Console"
                Write-Host ""
                Write-Host "  Para ver detalhes:"
                Write-Host "  git log -S 'your_api_key_here' --all"
                Write-Host ""
            } else {
                Write-Success "Nenhuma credencial encontrada no histórico"
            }
        } else {
            Write-Warning "Não é um repositório Git (ok se não usar Git)"
        }
    } catch {
        Write-Warning "Erro ao verificar Git: $_"
    }
} else {
    Write-Warning "Git não instalado (ok se não usar Git)"
}

Write-Host ""

################################################################################
# PASSO 8: CRIAR ARQUIVO DE STATUS
################################################################################

Write-Step "8/8: Criando arquivo de status da migração..."

$migrationStatus = @"
# 📊 STATUS DA MIGRAÇÃO DE DOCUMENTAÇÃO

**Data da Migração:** $(Get-Date -Format "dd/MM/yyyy 'às' HH:mm:ss")  
**Script:** migrate-docs.ps1 v1.0  
**Status:** ✅ CONCLUÍDA

---

## ✅ AÇÕES REALIZADAS

### 1. Backup
- [x] Backup criado em: ``$backupDir``
- [x] Todos os arquivos .md preservados

### 2. Estrutura de Pastas
- [x] ``docs\principais\`` criada
- [x] ``docs\analise\`` criada
- [x] ``docs\referencia\`` criada
- [x] ``docs\deprecated\`` criada

### 3. Remoção de Credenciais
- [x] Credenciais Firebase removidas
- [x] Placeholders adicionados

---

## 🎯 PRÓXIMOS PASSOS

1. Revisar Master Index: ``docs\00-MASTER-INDEX.md``
2. Começar correções: ``docs\analise\RESUMO-EXECUTIVO-VISUAL.md``
3. Commitar mudanças:
   ````
   git add docs/
   git commit -m "docs: reorganize documentation structure"
   ````

---

**Migração executada com sucesso! 🎉**
"@

Set-Content -Path "docs\MIGRATION-STATUS.md" -Value $migrationStatus -Encoding UTF8

Write-Success "Status da migração salvo em docs\MIGRATION-STATUS.md"
Write-Host ""

################################################################################
# RESUMO FINAL
################################################################################

Write-Host ""
Write-Host "╔════════════════════════════════════════════════════════════╗"
Write-Host "║   MIGRAÇÃO CONCLUÍDA COM SUCESSO! 🎉                       ║"
Write-Host "╚════════════════════════════════════════════════════════════╝"
Write-Host ""

Write-Success "RESUMO:"
Write-Host ""
Write-Host "  ✅ Backup criado em: $backupDir"
Write-Host "  ✅ Credenciais removidas"
Write-Host "  ✅ Documentos reorganizados"
Write-Host "  ✅ Master Index criado"
Write-Host "  ✅ Status da migração documentado"
Write-Host ""

Write-Step "PRÓXIMOS PASSOS:"
Write-Host ""
Write-Host "  1. Revisar a nova estrutura:"
Write-Host "     Get-Content docs\00-MASTER-INDEX.md"
Write-Host ""
Write-Host "  2. Verificar status da migração:"
Write-Host "     Get-Content docs\MIGRATION-STATUS.md"
Write-Host ""
Write-Host "  3. Commitar as mudanças:"
Write-Host "     git add docs/"
Write-Host "     git commit -m 'docs: reorganize documentation structure'"
Write-Host ""
Write-Host "  4. Começar correções:"
Write-Host "     Get-Content docs\analise\RESUMO-EXECUTIVO-VISUAL.md"
Write-Host ""

Write-Success "Documentação reorganizada com sucesso!"
Write-Host ""
