# ✅ CHECKLIST - CONFIGURAÇÃO GOOGLE APPS SCRIPT

## 📋 Lista de Verificação Passo a Passo

### **Fase 1: Preparação**
- [ ] Acesso ao Google Drive funcionando
- [ ] Acesso ao Google Apps Script (script.google.com)
- [ ] Conta Google com permissões adequadas

### **Fase 2: Google Sheets**
- [ ] ✅ **Criar planilha no Google Sheets**
  - Nome sugerido: "Sagacy - Propostas Comerciais"
- [ ] ✅ **Criar aba com nome exato**: `propostasacompanhamento`
- [ ] ✅ **Copiar ID da planilha** (da URL)
  ```
  https://docs.google.com/spreadsheets/d/[COPIE_ESTE_ID]/edit
  ```

### **Fase 3: Google Apps Script**
- [ ] ✅ **Acessar**: https://script.google.com/
- [ ] ✅ **Criar novo projeto**
- [ ] ✅ **Renomear para**: "Sagacy - API Propostas"
- [ ] ✅ **Apagar código padrão**
- [ ] ✅ **Copiar código** do arquivo `codigo-google-script.js`
- [ ] ✅ **Colar no editor** do Google Apps Script
- [ ] ✅ **Salvar** (Ctrl+S)

### **Fase 4: Configuração**
- [ ] ✅ **Editar linha SPREADSHEET_ID**:
  ```javascript
  SPREADSHEET_ID: 'COLE_AQUI_O_ID_DA_SUA_PLANILHA',
  ```
- [ ] ✅ **Editar emails**:
  ```javascript
  NOTIFICATION_EMAIL: 'seu_email@empresa.com',
  SENDER_EMAIL: 'seu_email@empresa.com',
  ```

### **Fase 5: Inicialização**
- [ ] ✅ **Executar função** `inicializarPlanilha`
  - Selecionar no dropdown
  - Clicar "Executar"
- [ ] ✅ **Autorizar permissões**
  - Google Sheets ✓
  - Gmail ✓
- [ ] ✅ **Verificar se criou cabeçalho** na planilha

### **Fase 6: Publicação**
- [ ] ✅ **Clicar "Implantar"** → "Nova implantação"
- [ ] ✅ **Selecionar tipo**: "Aplicativo da Web"
- [ ] ✅ **Configurações**:
  - Executar como: "Eu"
  - Acesso: "Qualquer pessoa"
- [ ] ✅ **Copiar URL gerada**
  ```
  https://script.google.com/macros/s/AKfycbx.../exec
  ```

### **Fase 7: Frontend**
- [ ] ✅ **Editar arquivo** `js/main.js`
- [ ] ✅ **Substituir URL**:
  ```javascript
  BASE_URL: 'https://script.google.com/macros/s/SUA_URL_AQUI/exec',
  ```

### **Fase 8: Testes**
- [ ] ✅ **Teste no Apps Script**:
  - Executar função `testarAPI()`
  - Verificar logs de sucesso
- [ ] ✅ **Teste via URL**:
  ```
  https://script.google.com/macros/s/SUA_URL/exec?action=teste
  ```
- [ ] ✅ **Teste no frontend**:
  - Abrir `index.html`
  - Pressionar F12
  - Executar: `testarAPI()`

## 🚨 Problemas Comuns

### **Erro: "Script function not found"**
❌ **Problema**: Código não foi copiado corretamente
✅ **Solução**: Copiar novamente o código completo

### **Erro: "Spreadsheet not found"**
❌ **Problema**: ID da planilha incorreto
✅ **Solução**: Verificar se o ID está correto no código

### **Erro: "Authorization required"**
❌ **Problema**: Permissões não foram concedidas
✅ **Solução**: Executar `inicializarPlanilha()` e autorizar

### **Erro: "No response from API"**
❌ **Problema**: URL não configurada no frontend
✅ **Solução**: Verificar URL no arquivo `js/main.js`

## 🎯 Validação Final

### **✅ Tudo funcionando se:**
- [ ] Planilha tem cabeçalho formatado
- [ ] URL de teste retorna JSON válido
- [ ] Frontend consegue criar solicitações
- [ ] Dados aparecem na planilha
- [ ] Notificações chegam por email (se habilitado)

## 📞 Suporte

**Se precisar de ajuda:**
- 📧 Email: thiago@sagacy.com.br
- 📚 Consulte: `GUIA-GOOGLE-SCRIPT.md`
- 🔍 Verifique logs no console do navegador

---

## 🎉 Resultado Esperado

Após seguir todos os passos:

✅ **API funcionando** em produção  
✅ **Dados salvos** automaticamente no Google Sheets  
✅ **Plataforma web** conectada e operacional  
✅ **Notificações** por email (opcional)  
✅ **Sistema completo** pronto para uso  

**Tempo estimado: 15-30 minutos** ⏱️

---

**🚀 Sucesso! Sua plataforma Sagacy está online!**
