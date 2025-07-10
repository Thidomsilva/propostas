// =============================================
// CÓDIGO MELHORADO - GOOGLE APPS SCRIPT
// =============================================
// VERSÃO COM DIAGNÓSTICO DE E-MAIL

// === CONFIGURAÇÕES ===
var SAGACY_CONFIG = {
  SPREADSHEET_ID: '12TDtLrXg4NM6H4kc6_x8gjsQCdKl76fkuqFCRc4-QRo',
  SHEET_NAME: 'propostasacompanhamento',
  EMAIL_NOTIFICATIONS: true,
  NOTIFICATION_EMAIL: 'thiago@sagacy.com.br',
  SENDER_EMAIL: 'agenty@sagacy.com.br',
  DEBUG: true
};

// === FUNÇÕES PRINCIPAIS ===
function doGet(e) {
  return handleRequest(e);
}

function doPost(e) {
  return handleRequest(e);
}

function handleRequest(e) {
  try {
    // Verificar se 'e' existe (requisição HTTP válida)
    if (!e || typeof e !== 'object') {
      return criarResposta(false, 'Parâmetros de requisição inválidos');
    }
    
    if (SAGACY_CONFIG.DEBUG) {
      console.log('Requisição recebida:', JSON.stringify(e.parameter || {}));
    }
    
    var action = (e.parameter && e.parameter.action) || 'listar';
    var params = e.parameter || {};
    
    var data = null;
    if (e.postData && e.postData.contents) {
      try {
        data = JSON.parse(e.postData.contents);
      } catch (error) {
        console.log('Erro ao parsear JSON:', error);
      }
    }
    
    switch (action) {
      case 'listar':
        return listarSolicitacoes();
      case 'criar':
        return criarSolicitacao(data || params);
      case 'atualizar':
        return atualizarSolicitacao(data || params);
      case 'deletar':
        return deletarSolicitacao(params.id);
      case 'teste_email':
        return testarEnvioEmail();
      default:
        return criarResposta(false, 'Ação não reconhecida: ' + action);
    }
  } catch (error) {
    console.error('Erro geral:', error);
    return criarResposta(false, 'Erro interno do servidor: ' + error.message);
  }
}

// === FUNÇÃO DE TESTE DE E-MAIL ===
function testarEnvioEmail() {
  try {
    console.log('=== INICIANDO TESTE DE E-MAIL ===');
    
    var dadosTeste = {
      cliente: 'Teste Email - ' + new Date().toLocaleString('pt-BR'),
      servico: 'Desenvolvimento Web',
      solicitante: 'Sistema de Teste',
      descricao: 'Este é um teste de notificação por e-mail do sistema Sagacy.'
    };
    
    console.log('Dados de teste:', JSON.stringify(dadosTeste));
    
    // Tentar enviar o e-mail
    var resultado = enviarNotificacao('Teste de E-mail', dadosTeste);
    
    console.log('=== TESTE CONCLUÍDO ===');
    
    return criarResposta(true, 'Teste de e-mail executado. Verifique os logs.', {
      teste: dadosTeste,
      resultado: resultado
    });
    
  } catch (error) {
    console.error('Erro no teste de e-mail:', error);
    return criarResposta(false, 'Erro no teste: ' + error.message);
  }
}

// === FUNÇÃO DE CRIAÇÃO DE SOLICITAÇÃO ===
function criarSolicitacao(dados) {
  try {
    console.log('Criando solicitação com dados:', JSON.stringify(dados));
    
    if (!dados || !dados.cliente || !dados.servico || !dados.solicitante || !dados.descricao) {
      return criarResposta(false, 'Dados obrigatórios em falta');
    }
    
    var planilha = SpreadsheetApp.openById(SAGACY_CONFIG.SPREADSHEET_ID);
    var aba = planilha.getSheetByName(SAGACY_CONFIG.SHEET_NAME);
    
    if (!aba) {
      return criarResposta(false, 'Aba não encontrada: ' + SAGACY_CONFIG.SHEET_NAME);
    }
    
    var novaLinha = [
      new Date().toLocaleDateString('pt-BR'),
      dados.cliente,
      dados.servico,
      dados.solicitante,
      dados.descricao,
      'Pendente',
      '',
      new Date().toLocaleDateString('pt-BR')
    ];
    
    aba.appendRow(novaLinha);
    
    // Tentar enviar e-mail
    var emailEnviado = enviarNotificacao('Nova solicitação criada', dados);
    
    console.log('Solicitação criada com sucesso');
    
    return criarResposta(true, 'Solicitação criada com sucesso', {
      dados: dados,
      emailEnviado: emailEnviado
    });
    
  } catch (error) {
    console.error('Erro ao criar solicitação:', error);
    return criarResposta(false, 'Erro ao criar solicitação: ' + error.message);
  }
}

// === FUNÇÃO DE ENVIO DE E-MAIL MELHORADA ===
function enviarNotificacao(assunto, dados) {
  try {
    console.log('=== INICIANDO ENVIO DE E-MAIL ===');
    
    if (!SAGACY_CONFIG.EMAIL_NOTIFICATIONS) {
      console.log('❌ Notificações por e-mail desabilitadas');
      return { sucesso: false, motivo: 'Notificações desabilitadas' };
    }
    
    console.log('✅ Notificações habilitadas');
    console.log('📧 Destinatário:', SAGACY_CONFIG.NOTIFICATION_EMAIL);
    console.log('📤 Remetente:', SAGACY_CONFIG.SENDER_EMAIL);
    
    // Verificar se o e-mail de destino é válido
    if (!SAGACY_CONFIG.NOTIFICATION_EMAIL || !SAGACY_CONFIG.NOTIFICATION_EMAIL.includes('@')) {
      console.error('❌ E-mail de destino inválido:', SAGACY_CONFIG.NOTIFICATION_EMAIL);
      return { sucesso: false, motivo: 'E-mail de destino inválido' };
    }
    
    // Criar o corpo do e-mail
    var corpo = '📧 Nova solicitação recebida:\n\n';
    corpo += '🏢 Cliente: ' + dados.cliente + '\n';
    corpo += '🛠️ Serviço: ' + dados.servico + '\n';
    corpo += '👤 Solicitante: ' + dados.solicitante + '\n';
    corpo += '📝 Descrição: ' + dados.descricao + '\n';
    corpo += '📅 Data: ' + new Date().toLocaleDateString('pt-BR') + ' às ' + new Date().toLocaleTimeString('pt-BR') + '\n';
    corpo += '\n🔗 Acesse a plataforma para mais detalhes.';
    corpo += '\n\n---\n📱 Sistema Sagacy de Propostas';
    
    var assuntoCompleto = '[Sagacy] ' + assunto;
    
    console.log('📝 Assunto:', assuntoCompleto);
    console.log('📄 Corpo do e-mail preparado');
    
    // Tentar enviar com GmailApp primeiro
    try {
      console.log('📧 Tentando enviar com GmailApp...');
      
      GmailApp.sendEmail(
        SAGACY_CONFIG.NOTIFICATION_EMAIL,
        assuntoCompleto,
        corpo
      );
      
      console.log('✅ E-mail enviado com sucesso via GmailApp!');
      
      // Verificar se o e-mail foi enviado
      Utilities.sleep(2000); // Aguardar 2 segundos
      
      var threads = GmailApp.search('subject:"' + assuntoCompleto + '"', 0, 1);
      console.log('📊 Threads encontradas:', threads.length);
      
      return { 
        sucesso: true, 
        metodo: 'GmailApp',
        destinatario: SAGACY_CONFIG.NOTIFICATION_EMAIL,
        assunto: assuntoCompleto,
        timestamp: new Date().toISOString()
      };
      
    } catch (gmailError) {
      console.error('❌ Erro com GmailApp:', gmailError.toString());
      
      // Tentar com MailApp como fallback
      try {
        console.log('📧 Tentando enviar com MailApp...');
        
        MailApp.sendEmail(
          SAGACY_CONFIG.NOTIFICATION_EMAIL,
          assuntoCompleto,
          corpo
        );
        
        console.log('✅ E-mail enviado com sucesso via MailApp!');
        
        return { 
          sucesso: true, 
          metodo: 'MailApp',
          destinatario: SAGACY_CONFIG.NOTIFICATION_EMAIL,
          assunto: assuntoCompleto,
          timestamp: new Date().toISOString()
        };
        
      } catch (mailError) {
        console.error('❌ Erro com MailApp:', mailError.toString());
        throw new Error('Falha em ambos os métodos de envio: GmailApp e MailApp');
      }
    }
    
  } catch (error) {
    console.error('❌ ERRO CRÍTICO no envio de e-mail:', error.toString());
    console.error('📋 Tipo do erro:', error.name);
    console.error('📋 Stack trace:', error.stack);
    
    return { 
      sucesso: false, 
      erro: error.toString(),
      tipo: error.name,
      timestamp: new Date().toISOString()
    };
  }
}

// === FUNÇÃO DE LISTAR SOLICITAÇÕES ===
function listarSolicitacoes() {
  try {
    var planilha = SpreadsheetApp.openById(SAGACY_CONFIG.SPREADSHEET_ID);
    var aba = planilha.getSheetByName(SAGACY_CONFIG.SHEET_NAME);
    
    if (!aba) {
      return criarResposta(false, 'Aba não encontrada: ' + SAGACY_CONFIG.SHEET_NAME);
    }
    
    var dados = aba.getDataRange().getValues();
    var solicitacoes = [];
    
    for (var i = 1; i < dados.length; i++) {
      var linha = dados[i];
      solicitacoes.push({
        id: i,
        data: linha[0],
        cliente: linha[1],
        servico: linha[2],
        solicitante: linha[3],
        descricao: linha[4],
        status: linha[5],
        observacoes: linha[6],
        data_atualizacao: linha[7]
      });
    }
    
    return criarResposta(true, 'Dados carregados com sucesso', solicitacoes);
    
  } catch (error) {
    console.error('Erro ao listar solicitações:', error);
    return criarResposta(false, 'Erro ao carregar dados: ' + error.message);
  }
}

// === FUNÇÃO DE ATUALIZAR SOLICITAÇÃO ===
function atualizarSolicitacao(dados) {
  try {
    if (!dados || !dados.id || !dados.status) {
      return criarResposta(false, 'ID e status são obrigatórios');
    }
    
    var planilha = SpreadsheetApp.openById(SAGACY_CONFIG.SPREADSHEET_ID);
    var aba = planilha.getSheetByName(SAGACY_CONFIG.SHEET_NAME);
    
    if (!aba) {
      return criarResposta(false, 'Aba não encontrada: ' + SAGACY_CONFIG.SHEET_NAME);
    }
    
    var linha = parseInt(dados.id) + 1;
    
    aba.getRange(linha, 6).setValue(dados.status);
    aba.getRange(linha, 7).setValue(dados.observacoes || '');
    aba.getRange(linha, 8).setValue(new Date().toLocaleDateString('pt-BR'));
    
    return criarResposta(true, 'Solicitação atualizada com sucesso');
    
  } catch (error) {
    console.error('Erro ao atualizar solicitação:', error);
    return criarResposta(false, 'Erro ao atualizar: ' + error.message);
  }
}

// === FUNÇÃO DE DELETAR SOLICITAÇÃO ===
function deletarSolicitacao(id) {
  try {
    if (!id) {
      return criarResposta(false, 'ID é obrigatório');
    }
    
    var planilha = SpreadsheetApp.openById(SAGACY_CONFIG.SPREADSHEET_ID);
    var aba = planilha.getSheetByName(SAGACY_CONFIG.SHEET_NAME);
    
    if (!aba) {
      return criarResposta(false, 'Aba não encontrada: ' + SAGACY_CONFIG.SHEET_NAME);
    }
    
    var linha = parseInt(id) + 1;
    aba.deleteRow(linha);
    
    return criarResposta(true, 'Solicitação removida com sucesso');
    
  } catch (error) {
    console.error('Erro ao deletar solicitação:', error);
    return criarResposta(false, 'Erro ao deletar: ' + error.message);
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
function inicializarPlanilha() {
  try {
    console.log('Inicializando planilha...');
    
    var planilha = SpreadsheetApp.openById(SAGACY_CONFIG.SPREADSHEET_ID);
    var aba = planilha.getSheetByName(SAGACY_CONFIG.SHEET_NAME);
    
    if (!aba) {
      console.log('Criando nova aba...');
      aba = planilha.insertSheet(SAGACY_CONFIG.SHEET_NAME);
    }
    
    var cabecalho = ['Data', 'Cliente', 'Serviço', 'Solicitante', 'Descrição', 'Status', 'Observações', 'Data Atualização'];
    
    if (aba.getLastRow() === 0) {
      aba.getRange(1, 1, 1, cabecalho.length).setValues([cabecalho]);
      console.log('Cabeçalho criado');
    }
    
    console.log('Planilha inicializada com sucesso');
    
  } catch (error) {
    console.error('Erro ao inicializar planilha:', error);
  }
}

// === FUNÇÃO DE TESTE MANUAL ===
function testarSistemaCompleto() {
  console.log('=== TESTE COMPLETO DO SISTEMA ===');
  
  // Teste 1: Inicialização
  inicializarPlanilha();
  
  // Teste 2: E-mail
  testarEnvioEmail();
  
  // Teste 3: Criação de solicitação
  var dadosTeste = {
    cliente: 'Cliente Teste - ' + new Date().toLocaleString('pt-BR'),
    servico: 'Teste de Sistema',
    solicitante: 'Sistema Automatizado',
    descricao: 'Teste completo do sistema Sagacy'
  };
  
  criarSolicitacao(dadosTeste);
  
  console.log('=== TESTE COMPLETO FINALIZADO ===');
}
