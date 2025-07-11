// =============================================
// CÓDIGO GOOGLE APPS SCRIPT - VERSÃO CORS + PRAZO FIX
// =============================================
// VERSÃO ESPECÍFICA PARA RESOLVER CORS E CAMPO PRAZO

// === CONFIGURAÇÕES ===
var SAGACY_CONFIG = {
  SPREADSHEET_ID: '12TDtLrXg4NM6H4kc6_x8gjsQCdKl76fkuqFCRc4-QRo',
  SHEET_NAME: 'propostasacompanhamento',
  EMAIL_NOTIFICATIONS: true,
  NOTIFICATION_EMAIL: 'thiago@sagacy.com.br',
  SENDER_EMAIL: 'agenty@sagacy.com.br',
  DEBUG: true
};

// === FUNÇÃO PRINCIPAL PARA CORS ===
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
  // Criar resposta base com headers CORS
  var resposta;
  
  try {
    // Processar requisição
    var resultado = processarRequisicao(e);
    
    // Criar resposta com dados
    resposta = ContentService
      .createTextOutput(JSON.stringify(resultado))
      .setMimeType(ContentService.MimeType.JSON);
    
  } catch (error) {
    console.error('Erro CORS:', error);
    
    // Criar resposta de erro
    var erro = {
      sucesso: false,
      erro: error.toString(),
      timestamp: new Date().toISOString()
    };
    
    resposta = ContentService
      .createTextOutput(JSON.stringify(erro))
      .setMimeType(ContentService.MimeType.JSON);
  }
  
  // Adicionar headers CORS manualmente via hack
  return criarRespostaCors(resposta);
}

function criarRespostaCors(resposta) {
  // Hack para adicionar headers CORS no Google Apps Script
  var output = resposta.getContent();
  
  // Adicionar callback JSONP se necessário
  var callback = 'corsCallback';
  var outputFinal = callback + '(' + output + ');';
  
  return ContentService
    .createTextOutput(outputFinal)
    .setMimeType(ContentService.MimeType.JAVASCRIPT);
}

function processarRequisicao(e) {
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
}

// === FUNÇÃO DE LISTAR - ATUALIZADA PARA INCLUIR PRAZO ===
function listarSolicitacoes() {
  try {
    console.log('📊 Listando solicitações...');
    
    var planilha = SpreadsheetApp.openById(SAGACY_CONFIG.SPREADSHEET_ID);
    var aba = planilha.getSheetByName(SAGACY_CONFIG.SHEET_NAME);
    
    if (!aba) {
      console.log('⚠️ Aba não encontrada, criando nova...');
      aba = planilha.insertSheet(SAGACY_CONFIG.SHEET_NAME);
      
      // Criar cabeçalho COM PRAZO
      var cabecalho = ['Data', 'Cliente', 'Serviço', 'Solicitante', 'Descrição', 'Prazo', 'Status', 'Observações', 'Data Atualização'];
      aba.getRange(1, 1, 1, cabecalho.length).setValues([cabecalho]);
      
      console.log('✅ Aba criada com cabeçalho incluindo campo prazo');
      return criarResposta(true, 'Planilha inicializada com sucesso', []);
    }
    
    // Verificar se coluna prazo existe, se não adicionar
    var headers = aba.getRange(1, 1, 1, aba.getLastColumn()).getValues()[0];
    var temPrazo = false;
    
    for (var h = 0; h < headers.length; h++) {
      if (headers[h].toString().toLowerCase().includes('prazo')) {
        temPrazo = true;
        break;
      }
    }
    
    if (!temPrazo) {
      console.log('⚠️ Coluna PRAZO não encontrada, adicionando...');
      var novaColuna = headers.length + 1;
      aba.getRange(1, novaColuna).setValue('Prazo');
      console.log('✅ Coluna PRAZO adicionada na posição ' + novaColuna);
    }
    
    var dados = aba.getDataRange().getValues();
    var solicitacoes = [];
    
    console.log('📊 Total de linhas encontradas:', dados.length);
    console.log('📋 Cabeçalhos:', dados[0].join(', '));
    
    // Processar dados (pular cabeçalho)
    for (var i = 1; i < dados.length; i++) {
      var linha = dados[i];
      if (linha[0] && linha[0] !== '') {
        var solicitacao = {
          id: i,
          data: linha[0],
          cliente: linha[1] || '',
          servico: linha[2] || '',
          solicitante: linha[3] || '',
          descricao: linha[4] || '',
          status: linha[6] || 'Pendente',
          observacoes: linha[7] || '',
          data_atualizacao: linha[8] || linha[0]
        };
        
        // Adicionar campo prazo se existir (posição 5)
        if (linha.length > 5) {
          solicitacao.prazo = linha[5] || '';
        }
        
        solicitacoes.push(solicitacao);
      }
    }
    
    console.log('✅ Processadas', solicitacoes.length, 'solicitações válidas');
    return criarResposta(true, 'Dados carregados com sucesso', solicitacoes);
    
  } catch (error) {
    console.error('❌ Erro ao listar solicitações:', error);
    return criarResposta(false, 'Erro ao carregar dados: ' + error.message);
  }
}

// === FUNÇÃO DE CRIAR - ATUALIZADA PARA INCLUIR PRAZO ===
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
    
    // Verificar se coluna prazo existe, se não adicionar
    var headers = aba.getRange(1, 1, 1, aba.getLastColumn()).getValues()[0];
    var temPrazo = false;
    
    for (var h = 0; h < headers.length; h++) {
      if (headers[h].toString().toLowerCase().includes('prazo')) {
        temPrazo = true;
        break;
      }
    }
    
    if (!temPrazo) {
      console.log('⚠️ Coluna PRAZO não encontrada, adicionando...');
      var novaColuna = headers.length + 1;
      aba.getRange(1, novaColuna).setValue('Prazo');
      console.log('✅ Coluna PRAZO adicionada na posição ' + novaColuna);
    }
    
    // Criar nova linha
    var dataAtual = new Date().toLocaleDateString('pt-BR');
    var horaAtual = new Date().toLocaleTimeString('pt-BR');
    
    // Log específico para campo prazo
    console.log('⏰ CAMPO PRAZO recebido:', dados.prazo);
    
    var novaLinha = [
      dataAtual,                                    // Data
      dados.cliente.trim(),                         // Cliente
      dados.servico.trim(),                         // Serviço
      dados.solicitante.trim(),                     // Solicitante
      dados.descricao.trim(),                       // Descrição
      dados.prazo || '',                            // PRAZO (NOVO CAMPO)
      'Pendente',                                   // Status
      dados.observacoes ? dados.observacoes.trim() : '', // Observações
      dataAtual + ' ' + horaAtual                   // Data Atualização
    ];
    
    console.log('📝 Linha a ser inserida:', novaLinha.join(' | '));
    
    aba.appendRow(novaLinha);
    console.log('✅ Solicitação salva na planilha');
    
    // Preparar dados para resposta - INCLUINDO PRAZO
    var solicitacaoSalva = {
      data: dataAtual,
      cliente: dados.cliente.trim(),
      servico: dados.servico.trim(),
      solicitante: dados.solicitante.trim(),
      descricao: dados.descricao.trim(),
      prazo: dados.prazo || '',                     // INCLUIR PRAZO NA RESPOSTA
      status: 'Pendente',
      observacoes: dados.observacoes ? dados.observacoes.trim() : '',
      data_atualizacao: dataAtual + ' ' + horaAtual
    };
    
    console.log('✅ Solicitação salva COM PRAZO:', solicitacaoSalva.prazo);
    
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
    
    var linha = parseInt(dados.id) + 1;
    
    if (linha > aba.getLastRow()) {
      return criarResposta(false, 'Solicitação não encontrada');
    }
    
    // Atualizar status (coluna 7) e observações (coluna 8)
    aba.getRange(linha, 7).setValue(dados.status);
    aba.getRange(linha, 8).setValue(dados.observacoes || '');
    aba.getRange(linha, 9).setValue(new Date().toLocaleDateString('pt-BR') + ' ' + new Date().toLocaleTimeString('pt-BR'));
    
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

// === FUNÇÃO DE E-MAIL - ATUALIZADA PARA INCLUIR PRAZO ===
function enviarNotificacao(assunto, dados) {
  try {
    console.log('📧 Preparando notificação por e-mail...');
    
    if (!SAGACY_CONFIG.EMAIL_NOTIFICATIONS) {
      return { sucesso: false, motivo: 'Notificações desabilitadas' };
    }
    
    if (!SAGACY_CONFIG.NOTIFICATION_EMAIL || !SAGACY_CONFIG.NOTIFICATION_EMAIL.includes('@')) {
      return { sucesso: false, motivo: 'E-mail de destino inválido' };
    }
    
    var corpo = '📧 Nova solicitação recebida:\n\n';
    corpo += '🏢 Cliente: ' + dados.cliente + '\n';
    corpo += '🛠️ Serviço: ' + dados.servico + '\n';
    corpo += '👤 Solicitante: ' + dados.solicitante + '\n';
    corpo += '📝 Descrição: ' + dados.descricao + '\n';
    corpo += '📅 Data: ' + new Date().toLocaleDateString('pt-BR') + ' às ' + new Date().toLocaleTimeString('pt-BR') + '\n';
    
    // INCLUIR PRAZO NO E-MAIL
    if (dados.prazo) {
      corpo += '⏰ Prazo: ' + dados.prazo + '\n';
    }
    
    corpo += '🔄 Status: ' + (dados.status || 'Pendente') + '\n';
    
    if (dados.observacoes) {
      corpo += '📋 Observações: ' + dados.observacoes + '\n';
    }
    
    corpo += '\n🔗 Acesse a plataforma para mais detalhes.';
    corpo += '\n\n---\n📱 Sistema Sagacy de Propostas';
    corpo += '\n⏰ Enviado em: ' + new Date().toLocaleString('pt-BR');
    
    var assuntoCompleto = '[Sagacy] ' + assunto;
    
    try {
      GmailApp.sendEmail(SAGACY_CONFIG.NOTIFICATION_EMAIL, assuntoCompleto, corpo);
      console.log('✅ E-mail enviado com sucesso via GmailApp!');
      
      return {
        sucesso: true,
        metodo: 'GmailApp',
        destinatario: SAGACY_CONFIG.NOTIFICATION_EMAIL,
        assunto: assuntoCompleto,
        timestamp: new Date().toISOString()
      };
      
    } catch (gmailError) {
      try {
        MailApp.sendEmail(SAGACY_CONFIG.NOTIFICATION_EMAIL, assuntoCompleto, corpo);
        console.log('✅ E-mail enviado com sucesso via MailApp!');
        
        return {
          sucesso: true,
          metodo: 'MailApp',
          destinatario: SAGACY_CONFIG.NOTIFICATION_EMAIL,
          assunto: assuntoCompleto,
          timestamp: new Date().toISOString()
        };
        
      } catch (mailError) {
        throw new Error('Falha em ambos os métodos: ' + gmailError.toString() + ' | ' + mailError.toString());
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
      prazo: '2025-07-31',  // INCLUIR PRAZO NO TESTE
      status: 'Teste'
    };
    
    var resultado = enviarNotificacao('Teste de E-mail', dadosTeste);
    
    return criarResposta(true, 'Teste de e-mail executado', {
      dados: dadosTeste,
      resultado: resultado
    });
    
  } catch (error) {
    console.error('❌ Erro no teste de e-mail:', error);
    return criarResposta(false, 'Erro no teste: ' + error.message);
  }
}

// === FUNÇÃO AUXILIAR - ATUALIZADA PARA NOVA VERSÃO ===
function criarResposta(sucesso, mensagem, dados) {
  var resposta = {
    sucesso: sucesso,
    mensagem: mensagem,
    timestamp: new Date().toISOString(),
    versao: '4.1-PRAZO-FIX'  // NOVA VERSÃO
  };
  
  if (dados) {
    resposta.dados = dados;
  }
  
  console.log('📤 Resposta:', JSON.stringify(resposta));
  return resposta;
}

// === FUNÇÃO DE INICIALIZAÇÃO - ATUALIZADA PARA INCLUIR PRAZO ===
function inicializarSistema() {
  try {
    console.log('🚀 Inicializando sistema Sagacy...');
    
    var planilha = SpreadsheetApp.openById(SAGACY_CONFIG.SPREADSHEET_ID);
    var aba = planilha.getSheetByName(SAGACY_CONFIG.SHEET_NAME);
    
    if (!aba) {
      console.log('📋 Criando nova planilha...');
      aba = planilha.insertSheet(SAGACY_CONFIG.SHEET_NAME);
      
      // CABEÇALHO COM PRAZO
      var cabecalho = ['Data', 'Cliente', 'Serviço', 'Solicitante', 'Descrição', 'Prazo', 'Status', 'Observações', 'Data Atualização'];
      aba.getRange(1, 1, 1, cabecalho.length).setValues([cabecalho]);
      
      console.log('✅ Planilha criada com cabeçalho incluindo campo prazo');
    } else {
      console.log('✅ Planilha existente encontrada');
      
      // Verificar se coluna prazo existe
      var headers = aba.getRange(1, 1, 1, aba.getLastColumn()).getValues()[0];
      var temPrazo = false;
      
      for (var h = 0; h < headers.length; h++) {
        if (headers[h].toString().toLowerCase().includes('prazo')) {
          temPrazo = true;
          break;
        }
      }
      
      if (!temPrazo) {
        console.log('⚠️ Adicionando coluna PRAZO à planilha existente...');
        var novaColuna = headers.length + 1;
        aba.getRange(1, novaColuna).setValue('Prazo');
        console.log('✅ Coluna PRAZO adicionada');
      }
    }
    
    console.log('🎉 Sistema inicializado com sucesso!');
    return 'Sistema Sagacy inicializado com sucesso em ' + new Date().toLocaleString('pt-BR');
    
  } catch (error) {
    console.error('❌ Erro na inicialização:', error);
    return 'Erro na inicialização: ' + error.message;
  }
}
