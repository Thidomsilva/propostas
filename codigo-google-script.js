// =============================================
// CONFIGURAÇÃO RÁPIDA - GOOGLE APPS SCRIPT
// =============================================
// Copie este código completo para o Google Apps Script

// === CONFIGURAÇÕES (EDITE AQUI) ===
var SAGACY_CONFIG = {
  // 🔧 EDITE ESTA LINHA: Cole aqui o ID da sua planilha do Google Sheets
  SPREADSHEET_ID: '12TDtLrXg4NM6H4kc6_x8gjsQCdKl76fkuqFCRc4-QRo',
  
  // 📋 Nome da aba na planilha (pode manter este nome)
  SHEET_NAME: 'propostasacompanhamento',
  
  // 📧 Configurações de email (EDITE AQUI)
  EMAIL_NOTIFICATIONS: true,
  NOTIFICATION_EMAIL: 'thiago@sagacy.com.br',
  SENDER_EMAIL: 'agenty@sagacy.com.br',
  
  // 🐛 Debug (manter true para ver logs)
  DEBUG: true
};

// === FUNÇÕES PRINCIPAIS ===

function doGet(e) {
  return handleRequest(e);
}

function doPost(e) {
  return handleRequest(e);
}

function doOptions(e) {
  return ContentService
    .createTextOutput('{"status":"ok"}')
    .setMimeType(ContentService.MimeType.JSON);
}

function handleRequest(e) {
  try {
    if (SAGACY_CONFIG.DEBUG) {
      console.log('📥 Requisição recebida:', JSON.stringify(e.parameter));
    }
    
    var action = e.parameter.action || 'listar';
    var params = e.parameter || {};
    
    // Parse JSON se existir
    var data = null;
    if (e.postData && e.postData.contents) {
      try {
        data = JSON.parse(e.postData.contents);
      } catch (error) {
        console.log('⚠️ Erro ao parsear JSON:', error);
      }
    }
    
    // Executar ação
    switch (action) {
      case 'listar':
        return listarSolicitacoes();
      case 'criar':
        return criarSolicitacao(data || params);
      case 'atualizar':
        return atualizarSolicitacao(data || params);
      case 'estatisticas':
        return obterEstatisticas();
      case 'teste':
        return testarAPI();
      default:
        return criarResposta(false, 'Ação não reconhecida: ' + action);
    }
    
  } catch (error) {
    console.error('❌ Erro geral:', error);
    return criarResposta(false, 'Erro no servidor: ' + error.message);
  }
}

// === FUNÇÕES DE DADOS ===

function listarSolicitacoes() {
  try {
    var sheet = obterPlanilha();
    var data = sheet.getDataRange().getValues();
    
    if (data.length <= 1) {
      return criarResposta(true, 'Nenhuma solicitação encontrada', []);
    }
    
    var headers = data[0];
    var solicitacoes = [];
    
    for (var i = 1; i < data.length; i++) {
      var obj = {};
      for (var j = 0; j < headers.length; j++) {
        obj[headers[j]] = data[i][j] || '';
      }
      solicitacoes.push(obj);
    }
    
    if (SAGACY_CONFIG.DEBUG) {
      console.log('📋 Listadas ' + solicitacoes.length + ' solicitações');
    }
    
    return criarResposta(true, solicitacoes.length + ' solicitações encontradas', solicitacoes);
    
  } catch (error) {
    console.error('❌ Erro ao listar:', error);
    return criarResposta(false, 'Erro ao listar solicitações: ' + error.message);
  }
}

function criarSolicitacao(dados) {
  try {
    if (!dados || !dados.cliente || !dados.servico || !dados.solicitante) {
      return criarResposta(false, 'Dados obrigatórios: cliente, servico, solicitante');
    }
    
    var sheet = obterPlanilha();
    var agora = new Date();
    var id = 'SOL_' + agora.getTime();
    
    var novaLinha = [
      id,
      agora.toISOString(),
      dados.solicitante,
      dados.cliente,
      dados.servico,
      dados.descricao || '',
      dados.prazo || '',
      dados.observacoes || '',
      dados.status || 'Pendente',
      agora.toISOString()
    ];
    
    sheet.appendRow(novaLinha);
    
    if (SAGACY_CONFIG.DEBUG) {
      console.log('✅ Solicitação criada:', id);
    }
    
    // Enviar notificação por email
    if (SAGACY_CONFIG.EMAIL_NOTIFICATIONS) {
      enviarNotificacao('Nova solicitação criada', dados);
    }
    
    return criarResposta(true, 'Solicitação criada com sucesso', { id: id });
    
  } catch (error) {
    console.error('❌ Erro ao criar:', error);
    return criarResposta(false, 'Erro ao criar solicitação: ' + error.message);
  }
}

function atualizarSolicitacao(dados) {
  try {
    if (!dados || !dados.id) {
      return criarResposta(false, 'ID da solicitação é obrigatório');
    }
    
    var sheet = obterPlanilha();
    var data = sheet.getDataRange().getValues();
    
    if (data.length <= 1) {
      return criarResposta(false, 'Nenhuma solicitação encontrada');
    }
    
    var headers = data[0];
    var idIndex = headers.indexOf('id');
    var statusIndex = headers.indexOf('status');
    var dataAtualizacaoIndex = headers.indexOf('dataAtualizacao');
    
    // Encontrar a linha
    var linhaEncontrada = -1;
    for (var i = 1; i < data.length; i++) {
      if (data[i][idIndex] === dados.id) {
        linhaEncontrada = i + 1;
        break;
      }
    }
    
    if (linhaEncontrada === -1) {
      return criarResposta(false, 'Solicitação não encontrada');
    }
    
    // Atualizar status
    if (dados.status && statusIndex !== -1) {
      sheet.getRange(linhaEncontrada, statusIndex + 1).setValue(dados.status);
    }
    
    // Atualizar data de atualização
    if (dataAtualizacaoIndex !== -1) {
      sheet.getRange(linhaEncontrada, dataAtualizacaoIndex + 1).setValue(new Date().toISOString());
    }
    
    if (SAGACY_CONFIG.DEBUG) {
      console.log('🔄 Solicitação atualizada:', dados.id);
    }
    
    return criarResposta(true, 'Solicitação atualizada com sucesso');
    
  } catch (error) {
    console.error('❌ Erro ao atualizar:', error);
    return criarResposta(false, 'Erro ao atualizar solicitação: ' + error.message);
  }
}

function obterEstatisticas() {
  try {
    var sheet = obterPlanilha();
    var data = sheet.getDataRange().getValues();
    
    if (data.length <= 1) {
      return criarResposta(true, 'Estatísticas calculadas', {
        total: 0,
        pendentes: 0,
        emAndamento: 0,
        concluidas: 0
      });
    }
    
    var headers = data[0];
    var statusIndex = headers.indexOf('status');
    
    var stats = {
      total: data.length - 1,
      pendentes: 0,
      emAndamento: 0,
      concluidas: 0
    };
    
    for (var i = 1; i < data.length; i++) {
      var status = data[i][statusIndex] || 'Pendente';
      
      if (status === 'Pendente') {
        stats.pendentes++;
      } else if (status === 'Em Andamento') {
        stats.emAndamento++;
      } else if (status === 'Concluído') {
        stats.concluidas++;
      }
    }
    
    return criarResposta(true, 'Estatísticas obtidas', stats);
    
  } catch (error) {
    console.error('❌ Erro nas estatísticas:', error);
    return criarResposta(false, 'Erro ao obter estatísticas: ' + error.message);
  }
}

function testarAPI() {
  try {
    var sheet = obterPlanilha();
    var info = {
      nome: sheet.getName(),
      linhas: sheet.getLastRow(),
      colunas: sheet.getLastColumn(),
      timestamp: new Date().toISOString()
    };
    
    return criarResposta(true, 'API funcionando corretamente', info);
    
  } catch (error) {
    console.error('❌ Erro no teste:', error);
    return criarResposta(false, 'Erro no teste: ' + error.message);
  }
}

// === FUNÇÕES AUXILIARES ===

function obterPlanilha() {
  try {
    var spreadsheet = SpreadsheetApp.openById(SAGACY_CONFIG.SPREADSHEET_ID);
    var sheet = spreadsheet.getSheetByName(SAGACY_CONFIG.SHEET_NAME);
    
    if (!sheet) {
      sheet = spreadsheet.insertSheet(SAGACY_CONFIG.SHEET_NAME);
      console.log('📋 Aba criada: ' + SAGACY_CONFIG.SHEET_NAME);
    }
    
    return sheet;
  } catch (error) {
    console.error('❌ Erro ao acessar planilha:', error);
    throw new Error('Erro ao acessar planilha. Verifique o ID: ' + SAGACY_CONFIG.SPREADSHEET_ID);
  }
}

function criarResposta(sucesso, mensagem, dados) {
  var resposta = {
    success: sucesso,
    message: mensagem,
    data: dados || null,
    timestamp: new Date().toISOString()
  };
  
  if (SAGACY_CONFIG.DEBUG) {
    console.log('📤 Resposta:', JSON.stringify(resposta));
  }
  
  return ContentService
    .createTextOutput(JSON.stringify(resposta))
    .setMimeType(ContentService.MimeType.JSON);
}

function enviarNotificacao(assunto, dados) {
  try {
    if (!SAGACY_CONFIG.EMAIL_NOTIFICATIONS) return;
    
    var corpo = 'Nova solicitação recebida:\n\n';
    corpo += 'Cliente: ' + dados.cliente + '\n';
    corpo += 'Serviço: ' + dados.servico + '\n';
    corpo += 'Solicitante: ' + dados.solicitante + '\n';
    corpo += 'Descrição: ' + dados.descricao + '\n';
    corpo += '\nAcesse a plataforma para mais detalhes.';
    
    GmailApp.sendEmail(
      SAGACY_CONFIG.NOTIFICATION_EMAIL,
      '[Sagacy] ' + assunto,
      corpo,
      {
        from: SAGACY_CONFIG.SENDER_EMAIL
      }
    );
    
    console.log('📧 Notificação enviada para:', SAGACY_CONFIG.NOTIFICATION_EMAIL);
    
  } catch (error) {
    console.error('❌ Erro ao enviar email:', error);
  }
}

// === FUNÇÃO DE INICIALIZAÇÃO ===

function inicializarPlanilha() {
  try {
    console.log('🔧 Inicializando planilha...');
    
    var sheet = obterPlanilha();
    var data = sheet.getDataRange().getValues();
    
    if (data.length === 0) {
      // Criar cabeçalho
      var headers = [
        'id', 'data', 'solicitante', 'cliente', 'servico', 
        'descricao', 'prazo', 'observacoes', 'status', 'dataAtualizacao'
      ];
      
      sheet.appendRow(headers);
      
      // Formatação
      var headerRange = sheet.getRange(1, 1, 1, headers.length);
      headerRange.setFontWeight('bold');
      headerRange.setBackground('#4285f4');
      headerRange.setFontColor('#ffffff');
      
      console.log('✅ Planilha inicializada com sucesso');
    } else {
      console.log('📋 Planilha já possui dados');
    }
    
    return 'Planilha inicializada com sucesso';
    
  } catch (error) {
    console.error('❌ Erro ao inicializar:', error);
    throw error;
  }
}

// === INSTRUÇÕES DE USO ===
/*
🚀 INSTRUÇÕES DE CONFIGURAÇÃO:

1. Copie este código completo para o Google Apps Script
2. Edite as configurações em SAGACY_CONFIG:
   - SPREADSHEET_ID: ID da sua planilha do Google Sheets
   - NOTIFICATION_EMAIL: Seu email para notificações
   - SENDER_EMAIL: Email remetente
3. Execute a função "inicializarPlanilha()" uma vez
4. Implante como "Aplicativo da Web" com acesso "Qualquer pessoa"
5. Copie a URL gerada para o arquivo js/main.js

✅ Pronto! Sua API está funcionando!
*/
