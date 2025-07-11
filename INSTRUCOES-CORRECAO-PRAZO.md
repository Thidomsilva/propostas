# 🚨 CORREÇÃO URGENTE - CAMPO PRAZO

## ❌ **PROBLEMA CONFIRMADO**

O teste revelou que o **backend do Google Apps Script não está salvando o campo `prazo`**.

### 🔍 **Evidências:**
- ✅ Frontend envia: `"prazo": "2025-07-25"`
- ❌ Backend não salva nem retorna o campo `prazo`
- ❌ Nenhuma solicitação na planilha tem campo `prazo`
- ❌ Campos disponíveis: `id, data, cliente, servico, solicitante, descricao, status, observacoes, data_atualizacao`

---

## 🔧 **SOLUÇÃO**

### **PASSO 1: Atualizar Google Apps Script**

1. **Abrir Apps Script:**
   ```
   https://script.google.com
   ```

2. **Encontrar o Projeto Sagacy**
   - Procurar pelo projeto com ID: `12TDtLrXg4NM6H4kc6_x8gjsQCdKl76fkuqFCRc4-QRo`

3. **Substituir Funções:**
   - Abrir arquivo `CORRECAO-BACKEND-PRAZO.gs`
   - Copiar e substituir as funções `criarSolicitacao` e `listarSolicitacoes`

4. **Salvar e Publicar:**
   - Ctrl+S para salvar
   - Implantar > Nova implantação
   - Publicar nova versão

### **PASSO 2: Testar Correção**

1. **Teste Rápido:**
   ```
   1. Abrir: teste-prazo-debug.html
   2. Preencher formulário com prazo
   3. Clicar "🧪 Testar Envio"
   4. Verificar se prazo aparece na resposta
   5. Clicar "📋 Testar Listagem"
   6. Verificar se prazo aparece nos dados
   ```

2. **Teste Completo:**
   ```
   1. Abrir: index.html
   2. Criar nova solicitação com prazo
   3. Ir ao Painel de Acompanhamento
   4. Verificar se as duas colunas de data aparecem
   ```

---

## 📋 **O QUE A CORREÇÃO FAZ**

### ✅ **Correções Implementadas:**

1. **Verificação de Headers:**
   - Verifica se coluna `prazo` existe na planilha
   - Adiciona automaticamente se não existir

2. **Salvamento Correto:**
   - Garante que campo `prazo` seja salvo
   - Logs detalhados para debug

3. **Resposta Completa:**
   - Inclui campo `prazo` na resposta
   - Retorna todos os campos salvos

4. **Listagem Corrigida:**
   - Garante que `prazo` apareça na listagem
   - Logs para identificar problemas

### 🔍 **Logs de Debug:**
A nova versão inclui logs detalhados que mostram:
- Se campo prazo foi recebido
- Se foi salvo corretamente
- Se aparece na verificação
- Se está sendo retornado

---

## 🎯 **RESULTADO ESPERADO**

### **Antes da Correção:**
```json
{
  "solicitacao": {
    "cliente": "Empresa Teste",
    "servico": "Consultoria",
    "data": "11/07/2025"
    // ❌ Prazo ausente
  }
}
```

### **Depois da Correção:**
```json
{
  "solicitacao": {
    "cliente": "Empresa Teste", 
    "servico": "Consultoria",
    "data": "11/07/2025",
    "prazo": "2025-07-25"  // ✅ Prazo presente
  }
}
```

### **Painel de Acompanhamento:**
```
| ID | Cliente | Projeto | Solicitante | Status | Data Solicitação | Prazo      | Ações |
|----|---------|---------|-------------|--------|------------------|------------|-------|
| 1  | Teste   | Consul. | Thiago      | Pend.  | 11/07/2025      | 25/07/2025 | [▼]   |
```

---

## 🚨 **PRIORIDADE ALTA**

Esta correção é **CRÍTICA** porque:
- ❌ Funcionalidade principal não está funcionando
- ❌ Dados de prazo estão sendo perdidos
- ❌ Painel não mostra informações completas
- ❌ Usuários não conseguem gerenciar prazos

**Execute a correção AGORA** para restaurar a funcionalidade completa!

---

**Arquivos:**
- `CORRECAO-BACKEND-PRAZO.gs` - Código corrigido para Apps Script
- `teste-prazo-debug.html` - Teste para validar correção
