# 📋 GUIA VISUAL - Qual Código Usar Onde

## 🌐 **GOOGLE APPS SCRIPT** (Backend)

### ✅ **Código Correto:**
```javascript
// Este é o INÍCIO do código correto para o Google Apps Script:

// =============================================
// CÓDIGO CORRIGIDO - GOOGLE APPS SCRIPT
// =============================================

var SAGACY_CONFIG = {
  SPREADSHEET_ID: '12TDtLrXg4NM6H4kc6_x8gjsQCdKl76fkuqFCRc4-QRo',
  SHEET_NAME: 'propostasacompanhamento',
  // ... resto das configurações
};

function doGet(e) {
  return handleRequest(e);
}

function doPost(e) {
  return handleRequest(e);
}
// ... resto das funções
```

### ❌ **Código ERRADO (não use):**
```javascript
// Este código NÃO deve ir no Google Apps Script:

document.addEventListener('DOMContentLoaded', function() {
  // ❌ ERRO: "document" não existe no Google Apps Script
});

const API_CONFIG = {
  // ❌ ERRO: Este é código do navegador
};
```

---

## 🌐 **NAVEGADOR** (Frontend)

### ✅ **Arquivos Corretos:**
- `index.html` - Página principal
- `js/main.js` - Código JavaScript do navegador
- `js/api.js` - Comunicação com API
- `css/style.css` - Estilos

### ❌ **Arquivos ERRADOS (não abra no navegador):**
- `codigo-google-script-CORRIGIDO.js` - Só para Google Apps Script

---

## 🎯 **ONDE USAR CADA CÓDIGO:**

### Google Apps Script (https://script.google.com):
```
📁 codigo-google-script-CORRIGIDO.js → Cole aqui
```

### Navegador (arquivo local):
```
📁 index.html → Abra no navegador
📁 teste-api.html → Abra no navegador
```

---

## 🚀 **PASSOS CORRETOS:**

1. **Google Apps Script**:
   - Limpe tudo
   - Cole: `codigo-google-script-CORRIGIDO.js`
   - Salve e teste

2. **Navegador**:
   - Abra: `index.html`
   - Teste: `teste-api.html`

**Nunca misture os códigos!** ⚠️
