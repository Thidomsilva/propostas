# 🎯 GUIA DE EXECUÇÃO - Google Apps Script

## ❌ **Erro que você teve:**
```
TypeError: Cannot read properties of undefined (reading 'parameter')
```

## 🔍 **Causa do erro:**
Você tentou executar a função `handleRequest` diretamente, mas ela é apenas para requisições HTTP do navegador.

## ✅ **Funções CORRETAS para executar manualmente:**

### 1. **Para inicializar a planilha:**
```javascript
inicializarPlanilha()
```

### 2. **Para testar a API:**
```javascript
testarAPIManual()
```

## 🚀 **Passos corretos:**

### 1. **Copiar o código corrigido**
- Copie TODO o código do arquivo `CODIGO-FINAL-GOOGLE-SCRIPT.js`
- Cole no Google Apps Script substituindo tudo

### 2. **Executar funções corretas**
- **Execute**: `inicializarPlanilha()`
- **Execute**: `testarAPIManual()`

### 3. **Implantar como Web App**
- **Implante** → **Nova implantação**
- **Tipo**: Aplicativo da Web
- **Acesso**: Qualquer pessoa

### 4. **Testar no navegador**
- Use a URL gerada no `teste-api.html`
- Teste no `index.html`

## ⚠️ **NUNCA execute estas funções manualmente:**
- ❌ `handleRequest()` - Só para HTTP
- ❌ `doGet()` - Só para HTTP
- ❌ `doPost()` - Só para HTTP

## ✅ **SEMPRE execute estas funções:**
- ✅ `inicializarPlanilha()` - Para setup inicial
- ✅ `testarAPIManual()` - Para testar conexão

---

**Agora copie o código corrigido e execute `inicializarPlanilha()`!** 🎉
