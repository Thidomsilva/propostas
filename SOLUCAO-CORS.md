# 🚨 PROBLEMA DE CORS - SOLUÇÃO DEFINITIVA

## ❌ **ERRO IDENTIFICADO**
```
Access to fetch at 'https://script.google.com/macros/s/...' from origin 'null' 
has been blocked by CORS policy: Response to preflight request doesn't pass 
access control check: No 'Access-Control-Allow-Origin' header is present on 
the requested resource.
```

## 🔧 **CAUSA DO PROBLEMA**
1. **Google Apps Script não republicado** após mudanças no código
2. **Configuração CORS** não está correta
3. **URL da API** pode estar desatualizada

## 📋 **SOLUÇÃO PASSO A PASSO**

### **PASSO 1: Verificar e Republish o Google Apps Script**

1. **Acesse:** https://script.google.com
2. **Abra** o projeto da Sagacy
3. **Substitua** TODO o código atual pelo código corrigido
4. **Salve** o projeto (Ctrl+S)
5. **Publique** novamente:
   - Clique em "Implantar" → "Nova implantação"
   - Tipo: "Aplicativo da web"
   - Executar como: "Eu"
   - Quem tem acesso: "Qualquer pessoa"
   - Clique em "Implantar"
   - **COPIE** a nova URL

### **PASSO 2: Testar Diretamente no Navegador**

Abra esta URL no navegador:
```
https://script.google.com/macros/s/AKfycbxVCWzcndMowKoIjUaFqFFJ3jPABhrLvjco8G8XupUU-wfhgLFa2v7M9K1Ith-NTy6XVg/exec?action=listar
```

**Se funcionar:** Deve mostrar JSON com dados  
**Se não funcionar:** URL está incorreta ou script não foi publicado

### **PASSO 3: Atualizar URL no Sistema**

Se você obteve uma nova URL, atualize em:
- `js/main.js`
- `js/api.js`
- `teste-sistema-completo.html`

---

## 🛠️ **CÓDIGO CORRIGIDO PARA GOOGLE APPS SCRIPT**

**IMPORTANTE:** Substitua TODO o código atual por este:

```javascript
// =============================================
// CÓDIGO FINAL CORRIGIDO - GOOGLE APPS SCRIPT
// =============================================

// === CONFIGURAÇÕES ===
var SAGACY_CONFIG = {
  SPREADSHEET_ID: '12TDtLrXg4NM6H4kc6_x8gjsQCdKl76fkuqFCRc4-QRo',
  SHEET_NAME: 'propostasacompanhamento',
  EMAIL_NOTIFICATIONS: true,
  NOTIFICATION_EMAIL: 'thiago@sagacy.com.br',
  SENDER_EMAIL: 'agenty@sagacy.com.br',
  DEBUG: true
};

// === FUNÇÃO PRINCIPAL ===
function doGet(e) {
  return handleCorsRequest(e);
}

function doPost(e) {
  return handleCorsRequest(e);
}

function handleCorsRequest(e) {
  try {
    // Configurar CORS
    var response = handleRequest(e);
    
    // Adicionar headers CORS
    return ContentService
      .createTextOutput(response.getContent())
      .setMimeType(ContentService.MimeType.JSON)
      .setHeader('Access-Control-Allow-Origin', '*')
      .setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
      .setHeader('Access-Control-Allow-Headers', 'Content-Type');
      
  } catch (error) {
    console.error('Erro CORS:', error);
    return ContentService
      .createTextOutput(JSON.stringify({
        sucesso: false,
        erro: error.toString(),
        timestamp: new Date().toISOString()
      }))
      .setMimeType(ContentService.MimeType.JSON)
      .setHeader('Access-Control-Allow-Origin', '*');
  }
}

function handleRequest(e) {
  try {
    console.log('=== NOVA REQUISIÇÃO ===');
    
    var action = 'listar';
    var dados = {};
    
    // Processar parâmetros GET
    if (e && e.parameter) {
      action = e.parameter.action || 'listar';
      dados = e.parameter;
      console.log('Parâmetros GET:', JSON.stringify(dados));
    }
    
    // Processar dados POST
    if (e && e.postData && e.postData.contents) {
      try {
        var postData = JSON.parse(e.postData.contents);
        action = postData.action || action;
        dados = postData;
        console.log('Dados POST:', JSON.stringify(dados));
      } catch (error) {
        console.log('Erro ao processar POST:', error);
      }
    }
    
    console.log('Ação:', action);
    
    // Executar ação
    switch (action) {
      case 'listar':
        return listarSolicitacoes();
      case 'criar':
        return criarSolicitacao(dados);
      case 'atualizar':
        return atualizarSolicitacao(dados);
      case 'deletar':
        return deletarSolicitacao(dados.id);
      case 'teste_email':
        return testarEnvioEmail();
      default:
        return criarResposta(false, 'Ação não reconhecida: ' + action);
    }
    
  } catch (error) {
    console.error('Erro na requisição:', error);
    return criarResposta(false, 'Erro no servidor: ' + error.message);
  }
}

// === FUNÇÃO DE LISTAR ===
function listarSolicitacoes() {
  try {
    console.log('📊 Listando solicitações...');
    
    var planilha = SpreadsheetApp.openById(SAGACY_CONFIG.SPREADSHEET_ID);
    var aba = planilha.getSheetByName(SAGACY_CONFIG.SHEET_NAME);
    
    if (!aba) {
      console.log('⚠️ Aba não encontrada, criando...');
      aba = planilha.insertSheet(SAGACY_CONFIG.SHEET_NAME);
      
      // Criar cabeçalho
      var cabecalho = ['Data', 'Cliente', 'Serviço', 'Solicitante', 'Descrição', 'Status', 'Observações', 'Data Atualização'];
      aba.getRange(1, 1, 1, cabecalho.length).setValues([cabecalho]);
      
      console.log('✅ Aba criada com cabeçalho');
      return criarResposta(true, 'Planilha inicializada', []);
    }
    
    var dados = aba.getDataRange().getValues();
    var solicitacoes = [];
    
    // Processar dados (pular cabeçalho)
    for (var i = 1; i < dados.length; i++) {
      var linha = dados[i];
      if (linha[0]) { // Verificar se a linha tem dados
        solicitacoes.push({
          id: i,
          data: linha[0],
          cliente: linha[1],
          servico: linha[2],
          solicitante: linha[3],
          descricao: linha[4],
          status: linha[5] || 'Pendente',
          observacoes: linha[6] || '',
          data_atualizacao: linha[7] || linha[0]
        });
      }
    }
    
    console.log('✅ Encontradas', solicitacoes.length, 'solicitações');
    return criarResposta(true, 'Dados carregados', solicitacoes);
    
  } catch (error) {
    console.error('❌ Erro ao listar:', error);
    return criarResposta(false, 'Erro ao carregar dados: ' + error.message);
  }
}

// === FUNÇÃO DE CRIAR ===
function criarSolicitacao(dados) {
  try {
    console.log('📝 Criando solicitação:', JSON.stringify(dados));
    
    // Validar dados
    if (!dados.cliente || !dados.servico || !dados.solicitante || !dados.descricao) {
      return criarResposta(false, 'Campos obrigatórios: cliente, servico, solicitante, descricao');
    }
    
    var planilha = SpreadsheetApp.openById(SAGACY_CONFIG.SPREADSHEET_ID);
    var aba = planilha.getSheetByName(SAGACY_CONFIG.SHEET_NAME);
    
    if (!aba) {
      return criarResposta(false, 'Planilha não encontrada');
    }
    
    // Criar nova linha
    var dataAtual = new Date().toLocaleDateString('pt-BR');
    var novaLinha = [
      dataAtual,
      dados.cliente,
      dados.servico,
      dados.solicitante,
      dados.descricao,
      'Pendente',
      '',
      dataAtual
    ];
    
    aba.appendRow(novaLinha);
    console.log('✅ Solicitação salva na planilha');
    
    // Enviar e-mail
    var emailResult = { sucesso: false, motivo: 'Email desabilitado' };
    
    if (SAGACY_CONFIG.EMAIL_NOTIFICATIONS) {
      try {
        console.log('📧 Enviando e-mail...');
        emailResult = enviarNotificacao('Nova solicitação criada', dados);
        console.log('📧 Resultado do e-mail:', JSON.stringify(emailResult));
      } catch (emailError) {
        console.error('❌ Erro no e-mail:', emailError);
        emailResult = { sucesso: false, erro: emailError.toString() };
      }
    }
    
    return criarResposta(true, 'Solicitação criada com sucesso', {
      dados: dados,
      email: emailResult
    });
    
  } catch (error) {
    console.error('❌ Erro ao criar:', error);
    return criarResposta(false, 'Erro ao criar solicitação: ' + error.message);
  }
}

// === FUNÇÃO DE E-MAIL ===
function enviarNotificacao(assunto, dados) {
  try {
    console.log('📧 Preparando e-mail...');
    
    var corpo = '📧 Nova solicitação recebida:\n\n';
    corpo += '🏢 Cliente: ' + dados.cliente + '\n';
    corpo += '🛠️ Serviço: ' + dados.servico + '\n';
    corpo += '👤 Solicitante: ' + dados.solicitante + '\n';
    corpo += '📝 Descrição: ' + dados.descricao + '\n';
    corpo += '📅 Data: ' + new Date().toLocaleString('pt-BR') + '\n';
    corpo += '\n🔗 Acesse a plataforma para mais detalhes.';
    
    var assuntoCompleto = '[Sagacy] ' + assunto;
    
    console.log('📧 Enviando para:', SAGACY_CONFIG.NOTIFICATION_EMAIL);
    console.log('📧 Assunto:', assuntoCompleto);
    
    // Tentar enviar
    GmailApp.sendEmail(
      SAGACY_CONFIG.NOTIFICATION_EMAIL,
      assuntoCompleto,
      corpo
    );
    
    console.log('✅ E-mail enviado com sucesso!');
    
    return {
      sucesso: true,
      destinatario: SAGACY_CONFIG.NOTIFICATION_EMAIL,
      assunto: assuntoCompleto,
      timestamp: new Date().toISOString()
    };
    
  } catch (error) {
    console.error('❌ Erro no e-mail:', error);
    return {
      sucesso: false,
      erro: error.toString(),
      timestamp: new Date().toISOString()
    };
  }
}

// === FUNÇÃO DE TESTE ===
function testarEnvioEmail() {
  try {
    console.log('🧪 Testando e-mail...');
    
    var dadosTeste = {
      cliente: 'Cliente Teste',
      servico: 'Teste de E-mail',
      solicitante: 'Sistema',
      descricao: 'Teste do sistema de e-mail - ' + new Date().toLocaleString('pt-BR')
    };
    
    var resultado = enviarNotificacao('Teste de E-mail', dadosTeste);
    
    return criarResposta(true, 'Teste executado', {
      dados: dadosTeste,
      resultado: resultado
    });
    
  } catch (error) {
    console.error('❌ Erro no teste:', error);
    return criarResposta(false, 'Erro no teste: ' + error.message);
  }
}

// === FUNÇÃO AUXILIAR ===
function criarResposta(sucesso, mensagem, dados) {
  var resposta = {
    sucesso: sucesso,
    mensagem: mensagem,
    timestamp: new Date().toISOString()
  };
  
  if (dados) {
    resposta.dados = dados;
  }
  
  return ContentService
    .createTextOutput(JSON.stringify(resposta))
    .setMimeType(ContentService.MimeType.JSON);
}

// === FUNÇÃO DE INICIALIZAÇÃO ===
function inicializar() {
  try {
    console.log('🚀 Inicializando sistema...');
    
    var planilha = SpreadsheetApp.openById(SAGACY_CONFIG.SPREADSHEET_ID);
    var aba = planilha.getSheetByName(SAGACY_CONFIG.SHEET_NAME);
    
    if (!aba) {
      aba = planilha.insertSheet(SAGACY_CONFIG.SHEET_NAME);
      var cabecalho = ['Data', 'Cliente', 'Serviço', 'Solicitante', 'Descrição', 'Status', 'Observações', 'Data Atualização'];
      aba.getRange(1, 1, 1, cabecalho.length).setValues([cabecalho]);
      console.log('✅ Planilha criada');
    }
    
    console.log('✅ Sistema inicializado');
    return 'Sistema inicializado com sucesso';
    
  } catch (error) {
    console.error('❌ Erro na inicialização:', error);
    return 'Erro: ' + error.message;
  }
}
```

---

## 🧪 **TESTE RÁPIDO**

Após republicar, teste esta URL diretamente no navegador:
```
https://script.google.com/macros/s/SUA_NOVA_URL/exec?action=listar
```

**Deve retornar:**
```json
{
  "sucesso": true,
  "mensagem": "Dados carregados",
  "dados": [...],
  "timestamp": "..."
}
```

---

## 🎯 **CHECKLIST**

- [ ] Substituir código no Google Apps Script
- [ ] Salvar o projeto (Ctrl+S)
- [ ] Republicar como Web App
- [ ] Copiar nova URL (se houver)
- [ ] Testar URL diretamente no navegador
- [ ] Atualizar URL no sistema (se necessário)
- [ ] Testar formulário novamente

---

**🚨 IMPORTANTE:** O problema principal é que o script não foi republicado após as mudanças. Siga EXATAMENTE os passos acima para resolver.
