// =============================================
// CÓDIGO FINAL CORRIGIDO - GOOGLE APPS SCRIPT
// =============================================
// VERSÃO COM CORS CORRIGIDO

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

function doOptions(e) {
  return handleCorsRequest(e);
}

function handleCorsRequest(e) {
  try {
    // Tratar requisição OPTIONS (preflight)
    if (e && e.parameter && e.parameter.method === 'OPTIONS') {
      return createCorsResponse('');
    }
    
    var response = handleRequest(e);
    
    // Adicionar headers CORS ao response
    return ContentService
      .createTextOutput(response.getContent())
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    console.error('Erro CORS:', error);
    return ContentService
      .createTextOutput(JSON.stringify({
        sucesso: false,
        erro: error.toString(),
        timestamp: new Date().toISOString()
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function createCorsResponse(content) {
  return ContentService
    .createTextOutput(content)
    .setMimeType(ContentService.MimeType.JSON);
}

function handleRequest(e) {
  try {
    console.log('=== NOVA REQUISIÇÃO ===');
    console.log('Timestamp:', new Date().toISOString());
    
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
        dados = Object.assign(dados, postData);
        console.log('Dados POST:', JSON.stringify(postData));
      } catch (error) {
        console.log('Erro ao processar POST:', error);
      }
    }
    
    console.log('Ação solicitada:', action);
    
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
    return criarResposta(false, 'Erro no servidor: ' + error.message + ' | Stack: ' + error.stack);
  }
}

// === FUNÇÃO DE LISTAR ===
function listarSolicitacoes() {
  try {
    console.log('📊 Listando solicitações...');
    
    var planilha = SpreadsheetApp.openById(SAGACY_CONFIG.SPREADSHEET_ID);
    var aba = planilha.getSheetByName(SAGACY_CONFIG.SHEET_NAME);
    
    if (!aba) {
      console.log('⚠️ Aba não encontrada, criando nova...');
      aba = planilha.insertSheet(SAGACY_CONFIG.SHEET_NAME);
      
      // Criar cabeçalho
      var cabecalho = ['Data', 'Cliente', 'Serviço', 'Solicitante', 'Descrição', 'Status', 'Observações', 'Data Atualização'];
      aba.getRange(1, 1, 1, cabecalho.length).setValues([cabecalho]);
      
      console.log('✅ Aba criada com cabeçalho');
      return criarResposta(true, 'Planilha inicializada com sucesso', []);
    }
    
    var dados = aba.getDataRange().getValues();
    var solicitacoes = [];
    
    console.log('📊 Total de linhas encontradas:', dados.length);
    
    // Processar dados (pular cabeçalho)
    for (var i = 1; i < dados.length; i++) {
      var linha = dados[i];
      if (linha[0] && linha[0] !== '') { // Verificar se a linha tem dados
        solicitacoes.push({
          id: i,
          data: linha[0],
          cliente: linha[1] || '',
          servico: linha[2] || '',
          solicitante: linha[3] || '',
          descricao: linha[4] || '',
          status: linha[5] || 'Pendente',
          observacoes: linha[6] || '',
          data_atualizacao: linha[7] || linha[0]
        });
      }
    }
    
    console.log('✅ Processadas', solicitacoes.length, 'solicitações válidas');
    return criarResposta(true, 'Dados carregados com sucesso', solicitacoes);
    
  } catch (error) {
    console.error('❌ Erro ao listar solicitações:', error);
    return criarResposta(false, 'Erro ao carregar dados: ' + error.message);
  }
}

// === FUNÇÃO DE CRIAR ===
function criarSolicitacao(dados) {
  try {
    console.log('📝 Criando solicitação...');
    console.log('Dados recebidos:', JSON.stringify(dados));
    
    // Validar dados obrigatórios
    var camposObrigatorios = ['cliente', 'servico', 'solicitante', 'descricao'];
    var camposFaltando = [];
    
    camposObrigatorios.forEach(function(campo) {
      if (!dados[campo] || dados[campo].trim() === '') {
        camposFaltando.push(campo);
      }
    });
    
    if (camposFaltando.length > 0) {
      return criarResposta(false, 'Campos obrigatórios faltando: ' + camposFaltando.join(', '));
    }
    
    var planilha = SpreadsheetApp.openById(SAGACY_CONFIG.SPREADSHEET_ID);
    var aba = planilha.getSheetByName(SAGACY_CONFIG.SHEET_NAME);
    
    if (!aba) {
      return criarResposta(false, 'Planilha não encontrada. Execute a inicialização primeiro.');
    }
    
    // Criar nova linha
    var dataAtual = new Date().toLocaleDateString('pt-BR');
    var horaAtual = new Date().toLocaleTimeString('pt-BR');
    
    var novaLinha = [
      dataAtual,
      dados.cliente.trim(),
      dados.servico.trim(),
      dados.solicitante.trim(),
      dados.descricao.trim(),
      'Pendente',
      dados.observacoes ? dados.observacoes.trim() : '',
      dataAtual + ' ' + horaAtual
    ];
    
    aba.appendRow(novaLinha);
    console.log('✅ Solicitação salva na planilha');
    
    // Preparar dados para resposta
    var solicitacaoSalva = {
      data: dataAtual,
      cliente: dados.cliente.trim(),
      servico: dados.servico.trim(),
      solicitante: dados.solicitante.trim(),
      descricao: dados.descricao.trim(),
      status: 'Pendente',
      observacoes: dados.observacoes ? dados.observacoes.trim() : '',
      data_atualizacao: dataAtual + ' ' + horaAtual
    };
    
    // Tentar enviar e-mail
    var emailResult = { sucesso: false, motivo: 'Email desabilitado' };
    
    if (SAGACY_CONFIG.EMAIL_NOTIFICATIONS) {
      try {
        console.log('📧 Tentando enviar e-mail...');
        emailResult = enviarNotificacao('Nova solicitação criada', solicitacaoSalva);
        console.log('📧 Resultado do e-mail:', JSON.stringify(emailResult));
      } catch (emailError) {
        console.error('❌ Erro no envio do e-mail:', emailError);
        emailResult = { 
          sucesso: false, 
          erro: emailError.toString(),
          timestamp: new Date().toISOString()
        };
      }
    }
    
    console.log('✅ Solicitação criada com sucesso');
    
    return criarResposta(true, 'Solicitação criada com sucesso', {
      solicitacao: solicitacaoSalva,
      email: emailResult
    });
    
  } catch (error) {
    console.error('❌ Erro ao criar solicitação:', error);
    return criarResposta(false, 'Erro ao criar solicitação: ' + error.message);
  }
}

// === FUNÇÃO DE ATUALIZAR ===
function atualizarSolicitacao(dados) {
  try {
    console.log('📝 Atualizando solicitação:', JSON.stringify(dados));
    
    if (!dados.id || !dados.status) {
      return criarResposta(false, 'ID e status são obrigatórios para atualização');
    }
    
    var planilha = SpreadsheetApp.openById(SAGACY_CONFIG.SPREADSHEET_ID);
    var aba = planilha.getSheetByName(SAGACY_CONFIG.SHEET_NAME);
    
    if (!aba) {
      return criarResposta(false, 'Planilha não encontrada');
    }
    
    var linha = parseInt(dados.id) + 1; // +1 porque o índice começa em 0, mas as linhas em 1
    
    // Verificar se a linha existe
    if (linha > aba.getLastRow()) {
      return criarResposta(false, 'Solicitação não encontrada');
    }
    
    // Atualizar campos
    aba.getRange(linha, 6).setValue(dados.status); // Status
    aba.getRange(linha, 7).setValue(dados.observacoes || ''); // Observações
    aba.getRange(linha, 8).setValue(new Date().toLocaleDateString('pt-BR') + ' ' + new Date().toLocaleTimeString('pt-BR')); // Data de atualização
    
    console.log('✅ Solicitação atualizada');
    
    return criarResposta(true, 'Solicitação atualizada com sucesso');
    
  } catch (error) {
    console.error('❌ Erro ao atualizar solicitação:', error);
    return criarResposta(false, 'Erro ao atualizar: ' + error.message);
  }
}

// === FUNÇÃO DE DELETAR ===
function deletarSolicitacao(id) {
  try {
    console.log('🗑️ Deletando solicitação:', id);
    
    if (!id) {
      return criarResposta(false, 'ID é obrigatório para exclusão');
    }
    
    var planilha = SpreadsheetApp.openById(SAGACY_CONFIG.SPREADSHEET_ID);
    var aba = planilha.getSheetByName(SAGACY_CONFIG.SHEET_NAME);
    
    if (!aba) {
      return criarResposta(false, 'Planilha não encontrada');
    }
    
    var linha = parseInt(id) + 1;
    
    // Verificar se a linha existe
    if (linha > aba.getLastRow()) {
      return criarResposta(false, 'Solicitação não encontrada');
    }
    
    aba.deleteRow(linha);
    console.log('✅ Solicitação deletada');
    
    return criarResposta(true, 'Solicitação removida com sucesso');
    
  } catch (error) {
    console.error('❌ Erro ao deletar solicitação:', error);
    return criarResposta(false, 'Erro ao deletar: ' + error.message);
  }
}

// === FUNÇÃO DE E-MAIL ===
function enviarNotificacao(assunto, dados) {
  try {
    console.log('📧 Preparando notificação por e-mail...');
    console.log('Destinatário:', SAGACY_CONFIG.NOTIFICATION_EMAIL);
    console.log('Assunto:', assunto);
    
    if (!SAGACY_CONFIG.EMAIL_NOTIFICATIONS) {
      console.log('⚠️ Notificações por e-mail desabilitadas');
      return { sucesso: false, motivo: 'Notificações desabilitadas' };
    }
    
    // Validar e-mail de destino
    if (!SAGACY_CONFIG.NOTIFICATION_EMAIL || !SAGACY_CONFIG.NOTIFICATION_EMAIL.includes('@')) {
      console.error('❌ E-mail de destino inválido:', SAGACY_CONFIG.NOTIFICATION_EMAIL);
      return { sucesso: false, motivo: 'E-mail de destino inválido' };
    }
    
    // Preparar corpo do e-mail
    var corpo = '📧 Nova solicitação recebida:\n\n';
    corpo += '🏢 Cliente: ' + dados.cliente + '\n';
    corpo += '🛠️ Serviço: ' + dados.servico + '\n';
    corpo += '👤 Solicitante: ' + dados.solicitante + '\n';
    corpo += '📝 Descrição: ' + dados.descricao + '\n';
    corpo += '📅 Data: ' + new Date().toLocaleDateString('pt-BR') + ' às ' + new Date().toLocaleTimeString('pt-BR') + '\n';
    corpo += '🔄 Status: ' + (dados.status || 'Pendente') + '\n';
    
    if (dados.observacoes) {
      corpo += '📋 Observações: ' + dados.observacoes + '\n';
    }
    
    corpo += '\n🔗 Acesse a plataforma para mais detalhes.';
    corpo += '\n\n---\n📱 Sistema Sagacy de Propostas';
    corpo += '\n⏰ Enviado em: ' + new Date().toLocaleString('pt-BR');
    
    var assuntoCompleto = '[Sagacy] ' + assunto;
    
    console.log('📧 Enviando e-mail...');
    
    // Tentar enviar com GmailApp
    try {
      GmailApp.sendEmail(
        SAGACY_CONFIG.NOTIFICATION_EMAIL,
        assuntoCompleto,
        corpo
      );
      
      console.log('✅ E-mail enviado com sucesso via GmailApp!');
      
      return {
        sucesso: true,
        metodo: 'GmailApp',
        destinatario: SAGACY_CONFIG.NOTIFICATION_EMAIL,
        assunto: assuntoCompleto,
        timestamp: new Date().toISOString()
      };
      
    } catch (gmailError) {
      console.error('❌ Erro com GmailApp:', gmailError);
      
      // Tentar com MailApp como fallback
      try {
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
        console.error('❌ Erro com MailApp:', mailError);
        throw new Error('Falha em ambos os métodos de envio: ' + gmailError.toString() + ' | ' + mailError.toString());
      }
    }
    
  } catch (error) {
    console.error('❌ Erro crítico no envio de e-mail:', error);
    return {
      sucesso: false,
      erro: error.toString(),
      timestamp: new Date().toISOString()
    };
  }
}

// === FUNÇÃO DE TESTE DE E-MAIL ===
function testarEnvioEmail() {
  try {
    console.log('🧪 Iniciando teste de e-mail...');
    
    var dadosTeste = {
      cliente: 'Cliente Teste',
      servico: 'Teste de Sistema',
      solicitante: 'Sistema Automatizado',
      descricao: 'Este é um teste do sistema de e-mail do Sagacy. Enviado em: ' + new Date().toLocaleString('pt-BR'),
      status: 'Teste'
    };
    
    console.log('Dados do teste:', JSON.stringify(dadosTeste));
    
    var resultado = enviarNotificacao('Teste de E-mail', dadosTeste);
    
    console.log('Resultado do teste:', JSON.stringify(resultado));
    
    return criarResposta(true, 'Teste de e-mail executado', {
      dados: dadosTeste,
      resultado: resultado
    });
    
  } catch (error) {
    console.error('❌ Erro no teste de e-mail:', error);
    return criarResposta(false, 'Erro no teste: ' + error.message);
  }
}

// === FUNÇÃO AUXILIAR ===
function criarResposta(sucesso, mensagem, dados) {
  var resposta = {
    sucesso: sucesso,
    mensagem: mensagem,
    timestamp: new Date().toISOString(),
    versao: '2.0'
  };
  
  if (dados) {
    resposta.dados = dados;
  }
  
  // Log da resposta
  console.log('📤 Resposta:', JSON.stringify(resposta));
  
  return ContentService
    .createTextOutput(JSON.stringify(resposta))
    .setMimeType(ContentService.MimeType.JSON);
}

// === FUNÇÃO DE INICIALIZAÇÃO ===
function inicializarSistema() {
  try {
    console.log('🚀 Inicializando sistema Sagacy...');
    
    var planilha = SpreadsheetApp.openById(SAGACY_CONFIG.SPREADSHEET_ID);
    var aba = planilha.getSheetByName(SAGACY_CONFIG.SHEET_NAME);
    
    if (!aba) {
      console.log('📋 Criando nova planilha...');
      aba = planilha.insertSheet(SAGACY_CONFIG.SHEET_NAME);
      
      var cabecalho = ['Data', 'Cliente', 'Serviço', 'Solicitante', 'Descrição', 'Status', 'Observações', 'Data Atualização'];
      aba.getRange(1, 1, 1, cabecalho.length).setValues([cabecalho]);
      
      console.log('✅ Planilha criada com cabeçalho');
    } else {
      console.log('✅ Planilha existente encontrada');
    }
    
    // Teste de e-mail
    if (SAGACY_CONFIG.EMAIL_NOTIFICATIONS) {
      console.log('📧 Testando sistema de e-mail...');
      var emailTeste = testarEnvioEmail();
      console.log('📧 Resultado do teste:', emailTeste.getContent());
    }
    
    console.log('🎉 Sistema inicializado com sucesso!');
    return 'Sistema Sagacy inicializado com sucesso em ' + new Date().toLocaleString('pt-BR');
    
  } catch (error) {
    console.error('❌ Erro na inicialização:', error);
    return 'Erro na inicialização: ' + error.message;
  }
}

// === FUNÇÃO DE TESTE COMPLETO ===
function testarSistemaCompleto() {
  try {
    console.log('🧪 Iniciando teste completo do sistema...');
    
    // Teste 1: Inicialização
    console.log('1. Testando inicialização...');
    inicializarSistema();
    
    // Teste 2: Listagem
    console.log('2. Testando listagem...');
    var listagemTeste = listarSolicitacoes();
    console.log('Resultado listagem:', listagemTeste.getContent());
    
    // Teste 3: Criação
    console.log('3. Testando criação...');
    var dadosTeste = {
      cliente: 'Cliente Teste Completo',
      servico: 'Teste de Sistema',
      solicitante: 'Sistema Automatizado',
      descricao: 'Teste completo do sistema Sagacy - ' + new Date().toLocaleString('pt-BR')
    };
    
    var criacaoTeste = criarSolicitacao(dadosTeste);
    console.log('Resultado criação:', criacaoTeste.getContent());
    
    // Teste 4: E-mail
    console.log('4. Testando e-mail...');
    var emailTeste = testarEnvioEmail();
    console.log('Resultado e-mail:', emailTeste.getContent());
    
    console.log('🎉 Teste completo finalizado!');
    return 'Teste completo executado com sucesso';
    
  } catch (error) {
    console.error('❌ Erro no teste completo:', error);
    return 'Erro no teste: ' + error.message;
  }
}
