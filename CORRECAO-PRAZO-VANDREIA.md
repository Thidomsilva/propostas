# 🔧 CORREÇÃO: PRAZO NO PAINEL + DADOS DA EMPRESA

## ❌ Problemas Identificados

### 1. **Campo Prazo Não Aparece no Painel**
- ✅ Frontend estava correto (formulário enviando prazo)
- ✅ CSS estava correto (duas colunas de data)
- ❓ Possível problema: Backend não salvando campo prazo corretamente

### 2. **Faltando Vandreia na Lista de Solicitantes**
- ❌ Lista não incluía Vandreia
- ✅ Necessário adicionar na ordem alfabética

---

## ✅ Correções Implementadas

### 1. **Adicionado Vandreia à Lista de Solicitantes**

**Arquivo:** `index.html` (linhas 103-113)

**Lista Atualizada (ordem alfabética):**
- Da Silva
- Edson
- Marcos
- Matoso
- Milena
- Thiago
- **Vandreia** ← ADICIONADO
- Victor
- William
- Outros (especificar)

### 2. **Debug e Correção do Campo Prazo**

**Criados Arquivos de Debug:**
- `teste-prazo-debug.html` - Teste específico para verificar envio/recepção do prazo
- `backend-correcao-prazo.gs` - Versão melhorada do backend com logs detalhados

**Funções de Debug Criadas:**
```javascript
verificarEstruturaPlanilha()  // Verifica se headers estão corretos
debugDadosPlanilha()         // Lista dados da planilha para debug
criarSolicitacaoCorrigida()  // Versão com logs detalhados
```

---

## 🧪 Como Testar

### 1. **Teste de Envio com Prazo**
```
1. Abrir: teste-prazo-debug.html
2. Preencher formulário incluindo data no campo "Prazo"
3. Clicar "🧪 Testar Envio"
4. Verificar no debug se o prazo foi enviado
5. Clicar "📋 Testar Listagem"
6. Verificar se o prazo aparece nos dados retornados
```

### 2. **Teste do Painel Principal**
```
1. Abrir: index.html
2. Ir para "📝 Nova Solicitação"
3. Preencher formulário com:
   - Cliente: Teste
   - Projeto: Consultoria
   - Solicitante: Vandreia (verificar se aparece)
   - Prazo: Data futura
4. Enviar solicitação
5. Ir para "📋 Painel de Acompanhamento"
6. Clicar "🔄 Atualizar Lista"
7. Verificar se aparece:
   ✅ Vandreia como solicitante
   ✅ Data de solicitação preenchida
   ✅ Prazo preenchido
```

---

## 🔍 Investigação do Problema do Prazo

### Possíveis Causas:
1. **Backend não recebendo campo prazo**
2. **Planilha Google Sheets sem coluna prazo**
3. **Frontend não enviando prazo corretamente**
4. **Problema na função formatDate**

### Método de Debug:
1. **Arquivo teste-prazo-debug.html** mostra:
   - Dados que estão sendo enviados
   - Resposta do backend
   - Dados que retornam da listagem
   - Se o prazo está presente em cada etapa

### Se o Problema Persistir:
1. **Verificar Google Apps Script:**
   - Logs do backend
   - Estrutura da planilha
   - Cabeçalhos das colunas

2. **Atualizar Backend (se necessário):**
   - Copiar código de `backend-correcao-prazo.gs`
   - Substituir função `criarSolicitacao` no Apps Script
   - Adicionar funções de debug

---

## 📊 Estrutura Correta da Planilha

**Cabeçalhos Esperados:**
```
id | cliente | servico | solicitante | descricao | prazo | observacoes | status | data
```

**Ordem das Colunas no Painel:**
```
ID | Cliente | Projeto | Solicitante | Status | Data Solicitação | Prazo | Ações
```

---

## 🎯 Status das Correções

### ✅ Concluído
- [x] Vandreia adicionada à lista de solicitantes
- [x] Arquivos de debug criados
- [x] Estrutura do painel corrigida (colunas e CSS)

### 🔍 Em Investigação
- [ ] Verificar se prazo está sendo salvo no backend
- [ ] Confirmar estrutura da planilha Google Sheets
- [ ] Testar envio e listagem completos

### 📋 Próximos Passos
1. Executar teste com `teste-prazo-debug.html`
2. Verificar logs do Google Apps Script
3. Atualizar backend se necessário
4. Confirmar funcionamento completo

---

**Data:** 11/07/2025  
**Arquivos Modificados:**
- `index.html` (adicionado Vandreia)
- `teste-prazo-debug.html` (novo)
- `backend-correcao-prazo.gs` (novo)
- `CORRECAO-PRAZO-VANDREIA.md` (este arquivo)
