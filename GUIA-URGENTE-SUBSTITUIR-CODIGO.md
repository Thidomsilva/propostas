# 🚨 GUIA URGENTE - Substituir Código no Google Apps Script

## ❌ **ERRO ATUAL:**
```
TypeError: ContentService.createTextOutput(...).setMimeType(...).setHeaders is not a function
```

## 🎯 **CAUSA:**
Você ainda tem o código **ANTIGO** no Google Apps Script que contém o método `setHeaders()` que não existe.

## ✅ **SOLUÇÃO PASSO A PASSO:**

### 1. **Abrir Google Apps Script**
- Vá para: https://script.google.com
- Faça login com sua conta Google
- Abra o projeto da Sagacy

### 2. **Localizar o Arquivo Principal**
- Na lateral esquerda, procure por:
  - `📄 Código.gs` OU
  - `📄 main.gs` OU
  - `📄 Code.gs`
- **Clique no arquivo**

### 3. **LIMPAR TODO O CÓDIGO**
- **Selecione TUDO**: Ctrl + A
- **Delete TUDO**: Delete
- A tela deve ficar **completamente vazia**

### 4. **COLAR O CÓDIGO CORRETO**
- Abra o arquivo: `codigo-google-script-CORRIGIDO.js`
- **Selecione todo o código**: Ctrl + A
- **Copie**: Ctrl + C
- **Volte para o Google Apps Script**
- **Cole**: Ctrl + V

### 5. **SALVAR E TESTAR**
- **Salve**: Ctrl + S
- **Execute**: função `inicializarPlanilha()`
- **Verifique**: se não há erros

---

## 🔍 **VERIFICAÇÃO:**

### ✅ **Código CORRETO (deve começar assim):**
```javascript
// =============================================
// CÓDIGO CORRIGIDO - GOOGLE APPS SCRIPT
// =============================================

var SAGACY_CONFIG = {
  SPREADSHEET_ID: '12TDtLrXg4NM6H4kc6_x8gjsQCdKl76fkuqFCRc4-QRo',
  // ... resto do código
};

function doGet(e) {
  return handleRequest(e);
}
```

### ❌ **Código ERRADO (se tiver isto, delete tudo):**
```javascript
document.addEventListener('DOMContentLoaded', function() {
  // ❌ Este código não deve estar no Google Apps Script
});

const API_CONFIG = {
  // ❌ Este código não deve estar no Google Apps Script
};
```

---

## 🚀 **RESULTADO ESPERADO:**
- ✅ Sem erros de `setHeaders`
- ✅ Função `inicializarPlanilha()` funciona
- ✅ API pronta para usar

**IMPORTANTE:** Você deve substituir **TODO** o código, não apenas adicionar!
