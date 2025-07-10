# 🚀 GUIA COMPLETO - NOVO PROJETO PLATAFORMA PROPOSTAS

## 📋 RESUMO EXECUTIVO
Este guia permite criar um **PROJETO LIMPO** da Plataforma de Propostas Comerciais Sagacy em uma nova pasta, evitando problemas de lentidão e conflitos.

---

## 🎯 O QUE VOCÊ TEM PRONTO
✅ **Frontend HTML completo** (1854 linhas) - 100% funcional  
✅ **Correção do erro JSON implementada**  
✅ **Interface moderna com branding Sagacy**  
✅ **Gravação de voz no formulário**  
✅ **Sistema robusto de API (5 métodos)**  
✅ **Dashboard, Formulário e Painel completos**  

---

## 🗂️ ESTRUTURA DO NOVO PROJETO

```
nova-plataforma-propostas/
│
├── index.html              ← Arquivo principal (copiar de INDEX_FINAL_VERSAO_PRODUCAO.html)
├── backend.gs              ← Código Google Apps Script (criar)
├── README.md               ← Documentação
├── config/
│   └── api-config.md       ← Instruções de configuração
└── docs/
    ├── funcionalidades.md  ← Lista de recursos
    └── deploy.md           ← Guia de publicação
```

---

## 🔥 PASSO A PASSO - CRIAÇÃO RÁPIDA

### **PASSO 1: Criar Nova Pasta**
```bash
# No Windows Explorer ou PowerShell:
mkdir c:\projetos\nova-plataforma-propostas
cd c:\projetos\nova-plataforma-propostas
```

### **PASSO 2: Copiar Arquivo Principal**
1. Copie o arquivo: `c:\workspaces\plataforma-propostas-comerciais\apps-script-web-app\INDEX_FINAL_VERSAO_PRODUCAO.html`
2. Cole na nova pasta como: `index.html`

### **PASSO 3: Configurar API (ÚNICA COISA FALTANDO)**
No arquivo `index.html`, linha ~676:
```javascript
// ANTES:
BASE_URL: 'https://script.google.com/macros/s/SEU_SCRIPT_ID_AQUI/exec',

// DEPOIS (substituir pelo seu ID):
BASE_URL: 'https://script.google.com/macros/s/SEU_ID_REAL_AQUI/exec',
```

---

## 📱 BACKEND GOOGLE APPS SCRIPT

### **Código Completo do Backend:**
```javascript
function doGet(e) {
  const action = e.parameter.action;
  
  switch(action) {
    case 'listar':
      return listarSolicitacoes();
    case 'criar':
      return criarSolicitacao(e);
    case 'atualizar':
      return atualizarStatus(e);
    case 'teste':
      return testeAPI();
    default:
      return retornarErro('Ação não encontrada');
  }
}

function doPost(e) {
  return doGet(e);
}

function listarSolicitacoes() {
  try {
    const sheet = SpreadsheetApp.openById('SEU_SPREADSHEET_ID').getActiveSheet();
    const dados = sheet.getDataRange().getValues();
    
    if (dados.length <= 1) {
      return retornarSucesso([]);
    }
    
    const solicitacoes = dados.slice(1).map(row => ({
      id: row[0],
      cliente: row[1],
      servico: row[2],
      solicitante: row[3],
      descricao: row[4],
      prazo: row[5],
      observacoes: row[6],
      status: row[7] || 'Pendente',
      data: row[8]
    }));
    
    return retornarSucesso(solicitacoes);
  } catch (error) {
    return retornarErro('Erro ao listar: ' + error.toString());
  }
}

function criarSolicitacao(e) {
  try {
    const dados = JSON.parse(e.parameter.data || e.postData?.contents || '{}');
    const sheet = SpreadsheetApp.openById('SEU_SPREADSHEET_ID').getActiveSheet();
    
    // Adicionar cabeçalhos se for a primeira linha
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(['ID', 'Cliente', 'Serviço', 'Solicitante', 'Descrição', 'Prazo', 'Observações', 'Status', 'Data']);
    }
    
    sheet.appendRow([
      dados.id,
      dados.cliente,
      dados.servico,
      dados.solicitante,
      dados.descricao,
      dados.prazo,
      dados.observacoes,
      dados.status || 'Pendente',
      dados.data
    ]);
    
    return retornarSucesso({ id: dados.id, message: 'Solicitação criada com sucesso' });
  } catch (error) {
    return retornarErro('Erro ao criar: ' + error.toString());
  }
}

function atualizarStatus(e) {
  try {
    const dados = JSON.parse(e.parameter.data || '{}');
    const sheet = SpreadsheetApp.openById('SEU_SPREADSHEET_ID').getActiveSheet();
    const valores = sheet.getDataRange().getValues();
    
    for (let i = 1; i < valores.length; i++) {
      if (valores[i][0] === dados.id) {
        sheet.getRange(i + 1, 8).setValue(dados.status);
        return retornarSucesso({ message: 'Status atualizado' });
      }
    }
    
    return retornarErro('Solicitação não encontrada');
  } catch (error) {
    return retornarErro('Erro ao atualizar: ' + error.toString());
  }
}

function testeAPI() {
  return retornarSucesso({ message: 'API funcionando!', timestamp: new Date().toISOString() });
}

function retornarSucesso(data) {
  return ContentService
    .createTextOutput(JSON.stringify({ success: true, data: data }))
    .setMimeType(ContentService.MimeType.JSON);
}

function retornarErro(message) {
  return ContentService
    .createTextOutput(JSON.stringify({ success: false, message: message }))
    .setMimeType(ContentService.MimeType.JSON);
}
```

---

## ⚙️ CONFIGURAÇÃO GOOGLE APPS SCRIPT

### **1. Criar Novo Projeto:**
1. Acesse: [script.google.com](https://script.google.com)
2. Clique em "Novo projeto"
3. Cole o código backend acima
4. Salve como "Plataforma Propostas API"

### **2. Criar Planilha:**
1. Crie nova planilha Google Sheets
2. Copie o ID da URL (entre `/d/` e `/edit`)
3. Substitua `SEU_SPREADSHEET_ID` no código

### **3. Publicar como Web App:**
1. No Apps Script: **Implementar** → **Nova implementação**
2. Tipo: **Aplicativo da Web**
3. Executar como: **Eu**
4. Quem tem acesso: **Qualquer pessoa**
5. Copie a **URL da implementação**

### **4. Configurar Frontend:**
Substitua no `index.html`:
```javascript
BASE_URL: 'SUA_URL_COPIADA_AQUI'
```

---

## 🎯 FUNCIONALIDADES INCLUÍDAS

### **🏠 Dashboard**
- Estatísticas em tempo real
- Cards modernos com números
- Botões de teste e diagnóstico

### **📝 Formulário**
- Campos validados
- **Gravação de voz** (🎤 botão do microfone)
- Seleções pré-definidas
- Envio robusto com 5 métodos de API

### **📋 Painel de Acompanhamento**
- Tabela completa de solicitações
- Mudança de status em tempo real
- **Exportação para CSV**

### **🔧 Sistema de API Ultra-Robusto**
- 5 métodos diferentes de comunicação
- Correção automática do erro "No number after minus sign"
- Tratamento de caracteres Unicode
- Fallbacks inteligentes

---

## 🚀 VANTAGENS DO PROJETO LIMPO

✅ **Performance otimizada** - Sem arquivos antigos pesados  
✅ **Estrutura organizada** - Fácil de manter  
✅ **Código atualizado** - Todas as correções aplicadas  
✅ **Documentação clara** - Fácil de entender  
✅ **Fácil deploy** - Pronto para produção  

---

## 🎨 PERSONALIZAÇÃO

### **Cores e Branding:**
No CSS (linha ~10), altere:
```css
:root {
  --primary-color: #1e3d59;  /* Cor principal Sagacy */
  --accent-color: #17a2b8;   /* Cor de destaque */
}
```

### **Serviços e Solicitantes:**
No HTML (linhas ~730-760), edite as listas:
```html
<option value="Seu Novo Serviço">Seu Novo Serviço</option>
<option value="Novo Solicitante">Novo Solicitante</option>
```

---

## 📞 SUPORTE E PRÓXIMOS PASSOS

### **Depois de configurar:**
1. ✅ Teste a API (botão "🧪 Testar API")
2. ✅ Crie uma solicitação teste
3. ✅ Verifique o painel de acompanhamento
4. ✅ Teste a gravação de voz
5. ✅ Exporte dados para CSV

### **Se der erro:**
1. Use o botão "🔧 Teste JSON Fix"
2. Verifique permissões no Google Apps Script
3. Confirme se a URL da API está correta

---

## 🏆 RESULTADO FINAL

**Uma plataforma moderna, funcional e profissional para gestão de propostas comerciais com:**
- Interface Sagacy personalizada
- Tecnologia Google Apps Script (gratuita)
- Funcionamento 100% online
- Todos os bugs corrigidos
- Performance otimizada

---

*Criado em Julho 2025 - Plataforma Sagacy v2.0*
