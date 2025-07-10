# 🚀 GUIA DE CONFIGURAÇÃO - GOOGLE APPS SCRIPT

## 📋 Passo a Passo para Configurar o Backend

### 1. **Criar o Google Apps Script**

1. Acesse: https://script.google.com/
2. Clique em **"+ Novo projeto"**
3. Renomeie para: **"Sagacy - Propostas Comerciais"**

### 2. **Configurar o Código**

1. **Apagar o código padrão** (`function myFunction()`)
2. **Copiar e colar** todo o conteúdo do arquivo `backend.gs` no editor
3. **Salvar** o projeto (Ctrl+S)

### 3. **Configurar o Google Sheets**

1. **Criar uma nova planilha** no Google Sheets
2. **Nomear a planilha**: "Sagacy - Propostas Comerciais"
3. **Criar a primeira aba**: "propostasacompanhamento"
4. **Copiar o ID da planilha** (da URL):
   ```
   https://docs.google.com/spreadsheets/d/[ESTE_É_O_ID]/edit
   ```

### 4. **Configurar as Variáveis**

No arquivo `backend.gs`, encontre a seção `SAGACY_CONFIG` e configure:

```javascript
var SAGACY_CONFIG = {
  SPREADSHEET_ID: 'COLE_AQUI_O_ID_DA_SUA_PLANILHA',
  SHEET_NAME: 'propostasacompanhamento',
  EMAIL_NOTIFICATIONS: true,
  NOTIFICATION_EMAIL: 'seu_email@empresa.com',
  SENDER_EMAIL: 'seu_email@empresa.com',
  DEBUG: true
};
```

### 5. **Configurar Permissões**

1. **Executar a função** `inicializarPlanilha()` no editor:
   - Selecione a função no dropdown
   - Clique em **"Executar"**
   - **Autorize** as permissões quando solicitado

2. **Autorizar acessos**:
   - Google Sheets (para salvar dados)
   - Gmail (para enviar notificações)

### 6. **Publicar como Web App**

1. Clique em **"Implantar"** → **"Nova implantação"**
2. **Tipo**: Selecione "Aplicativo da Web"
3. **Configurações**:
   - **Descrição**: "API Sagacy Propostas v1.0"
   - **Executar como**: "Eu (seu_email@gmail.com)"
   - **Quem tem acesso**: "Qualquer pessoa"
4. Clique em **"Implantar"**
5. **Copie a URL** gerada (algo como):
   ```
   https://script.google.com/macros/s/AKfycbx.../exec
   ```

### 7. **Configurar o Frontend**

No arquivo `js/main.js`, substitua a URL:

```javascript
const API_CONFIG = {
    BASE_URL: 'https://script.google.com/macros/s/SUA_URL_AQUI/exec',
    // ... resto das configurações
};
```

## 🧪 Testando a Configuração

### 1. **Teste Manual no Apps Script**

Execute essas funções no editor:

```javascript
// 1. Inicializar planilha
inicializarPlanilha();

// 2. Testar API
testarAPI();

// 3. Testar listagem
processarAcao('listar', {});
```

### 2. **Teste via URL**

Acesse no navegador:
```
https://script.google.com/macros/s/SUA_URL/exec?action=teste
```

Resposta esperada:
```json
{
  "success": true,
  "message": "API funcionando corretamente",
  "data": {...}
}
```

### 3. **Teste no Frontend**

1. Abra `index.html` no navegador
2. Pressione **F12** para abrir o console
3. Execute: `testarAPI()`
4. Verifique se aparecem mensagens de sucesso

## 📊 Estrutura da Planilha

Após a configuração, sua planilha terá essas colunas:

| Coluna | Tipo | Descrição |
|--------|------|-----------|
| id | Texto | ID único da solicitação |
| data | Data | Data de criação |
| solicitante | Texto | Nome do solicitante |
| cliente | Texto | Nome do cliente |
| servico | Texto | Tipo de serviço |
| descricao | Texto | Descrição detalhada |
| prazo | Data | Prazo da solicitação |
| observacoes | Texto | Observações extras |
| status | Texto | Status atual |
| dataAtualizacao | Data | Última atualização |

## 🔧 Troubleshooting

### **Erro: "Script function not found"**
- Verifique se copiou todo o código corretamente
- Certifique-se de que salvou o projeto

### **Erro: "Authorization required"**
- Execute `inicializarPlanilha()` no editor
- Autorize todas as permissões solicitadas

### **Erro: "No response from API"**
- Verifique se a URL está correta no `main.js`
- Teste a URL diretamente no navegador

### **Erro: "Spreadsheet not found"**
- Verifique se o ID da planilha está correto
- Certifique-se de que a planilha existe e está acessível

### **Dados não salvam**
- Verifique se a aba tem o nome correto
- Execute `inicializarPlanilha()` novamente

## 🎯 Próximos Passos

Após configurar:

1. **Testar** todas as funcionalidades
2. **Personalizar** os campos conforme necessário
3. **Configurar** notificações por email
4. **Fazer backup** das configurações

## 📞 Contato

Para dúvidas ou suporte:
- Email: thiago@sagacy.com.br
- Consulte o arquivo `README-MODULARIZADO.md`

---

**✅ Configuração concluída com sucesso!**
A plataforma Sagacy está pronta para uso! 🚀
