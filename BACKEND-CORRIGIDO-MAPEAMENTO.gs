// =============================================
// CÓDIGO GOOGLE APPS SCRIPT - VERSÃO CORS + PRAZO FIX CORRIGIDO
// =============================================
// CORREÇÃO URGENTE: Mapeamento correto das colunas

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
  var resposta;
  
  try {
    var resultado = processarRequisicao(e);
    resposta = ContentService
      .createTextOutput(JSON.stringify(resultado))
      .setMimeType(ContentService.MimeType.JSON);
    
  } catch (error) {
    console.error('Erro CORS:', error);
    var erro = {
      sucesso: false,
      erro: error.toString(),
      timestamp: new Date().toISOString()
    };
    
    resposta = ContentService
      .createTextOutput(JSON.stringify(erro))
      .setMimeType(ContentService.MimeType.JSON);
  }
  
  return criarRespostaCors(resposta);
}

function criarRespostaCors(resposta) {
  var output = resposta.getContent();
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
  
  if (e && e.parameter) {
    action = e.parameter.action || 'listar';
    dados = e.parameter;
    console.log('Parâmetros GET:', JSON.stringify(dados));
  }
  
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

// === FUNÇÃO DE LISTAR - CORRIGIDA ===
function listarSolicitacoes() {
  try {
    console.log('📊 Listando solicitações...');
    
    var planilha = SpreadsheetApp.openById(SAGACY_CONFIG.SPREADSHEET_ID);
    var aba = planilha.getSheetByName(SAGACY_CONFIG.SHEET_NAME);
    
    if (!aba) {
      console.log('⚠️ Aba não encontrada, criando nova...');
      aba = planilha.insertSheet(SAGACY_CONFIG.SHEET_NAME);
      
      // ESTRUTURA CORRETA: Data | Cliente | Serviço | Solicitante | Descrição | Prazo | Status | Observações | Data Atualização
      var cabecalho = ['Data', 'Cliente', 'Serviço', 'Solicitante', 'Descrição', 'Prazo', 'Status', 'Observações', 'Data Atualização'];
      aba.getRange(1, 1, 1, cabecalho.length).setValues([cabecalho]);
      
      console.log('✅ Aba criada com estrutura correta');
      return criarResposta(true, 'Planilha inicializada com sucesso', []);
    }
    
    var dados = aba.getDataRange().getValues();
    var solicitacoes = [];
    
    console.log('📊 Total de linhas encontradas:', dados.length);
    console.log('📋 Cabeçalhos:', dados[0].join(', '));
    
    // Processar dados (pular cabeçalho)
    for (var i = 1; i < dados.length; i++) {
      var linha = dados[i];
      if (linha[0] && linha[0] !== '') {
        
        // MAPEAMENTO CORRETO DAS COLUNAS:
        // A=0: Data, B=1: Cliente, C=2: Serviço, D=3: Solicitante, E=4: Descrição, F=5: Prazo, G=6: Status, H=7: Observações, I=8: Data Atualização
        var solicitacao = {
          id: i,
          data: linha[0],                    // A: Data
          cliente: linha[1] || '',           // B: Cliente  
          servico: linha[2] || '',           // C: Serviço
          solicitante: linha[3] || '',       // D: Solicitante
          descricao: linha[4] || '',         // E: Descrição
          prazo: linha[5] || '',             // F: Prazo ⬅️ CORRETO!
          status: linha[6] || 'Pendente',    // G: Status ⬅️ CORRETO!
          observacoes: linha[7] || '',       // H: Observações
          data_atualizacao: linha[8] || linha[0] // I: Data Atualização
        };
        
        console.log('🔍 Item processado:', {
          id: solicitacao.id,
          prazo: solicitacao.prazo,
          status: solicitacao.status
        });
        
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

// === FUNÇÃO DE CRIAR - CORRIGIDA ===
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
    
    var dataAtual = new Date().toLocaleDateString('pt-BR');
    var horaAtual = new Date().toLocaleTimeString('pt-BR');
    
    console.log('⏰ CAMPO PRAZO recebido:', dados.prazo);
    
    // ESTRUTURA CORRETA: Data | Cliente | Serviço | Solicitante | Descrição | Prazo | Status | Observações | Data Atualização
    var novaLinha = [
      dataAtual,                                    // A: Data
      dados.cliente.trim(),                         // B: Cliente
      dados.servico.trim(),                         // C: Serviço  
      dados.solicitante.trim(),                     // D: Solicitante
      dados.descricao.trim(),                       // E: Descrição
      dados.prazo || '',                            // F: Prazo ⬅️ POSIÇÃO CORRETA!
      'Pendente',                                   // G: Status ⬅️ POSIÇÃO CORRETA!
      dados.observacoes ? dados.observacoes.trim() : '', // H: Observações
      dataAtual + ' ' + horaAtual                   // I: Data Atualização
    ];
    
    console.log('📝 Linha a ser inserida (CORRIGIDA):');
    console.log('A-Data:', novaLinha[0]);
    console.log('B-Cliente:', novaLinha[1]);
    console.log('C-Serviço:', novaLinha[2]);
    console.log('D-Solicitante:', novaLinha[3]);
    console.log('E-Descrição:', novaLinha[4]);
    console.log('F-Prazo:', novaLinha[5], '⬅️ DEVE SER O PRAZO');
    console.log('G-Status:', novaLinha[6], '⬅️ DEVE SER "Pendente"');
    console.log('H-Observações:', novaLinha[7]);
    console.log('I-Data Atualização:', novaLinha[8]);
    
    aba.appendRow(novaLinha);
    console.log('✅ Solicitação salva na planilha COM ESTRUTURA CORRETA');
    
    var solicitacaoSalva = {
      data: dataAtual,
      cliente: dados.cliente.trim(),
      servico: dados.servico.trim(),
      solicitante: dados.solicitante.trim(),
      descricao: dados.descricao.trim(),
      prazo: dados.prazo || '',
      status: 'Pendente',
      observacoes: dados.observacoes ? dados.observacoes.trim() : '',
      data_atualizacao: dataAtual + ' ' + horaAtual
    };
    
    console.log('✅ Solicitação salva COM PRAZO CORRETO:', solicitacaoSalva.prazo);
    
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
    
    // Atualizar status (coluna G=7) e observações (coluna H=8)
    aba.getRange(linha, 7).setValue(dados.status);  // G: Status
    aba.getRange(linha, 8).setValue(dados.observacoes || ''); // H: Observações
    aba.getRange(linha, 9).setValue(new Date().toLocaleDateString('pt-BR') + ' ' + new Date().toLocaleTimeString('pt-BR')); // I: Data Atualização
    
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

// === FUNÇÃO DE E-MAIL ===
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
      prazo: '2025-07-31',
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

// === FUNÇÃO AUXILIAR ===
function criarResposta(sucesso, mensagem, dados) {
  var resposta = {
    sucesso: sucesso,
    mensagem: mensagem,
    timestamp: new Date().toISOString(),
    versao: '4.2-MAPEAMENTO-CORRIGIDO'  // NOVA VERSÃO
  };
  
  if (dados) {
    resposta.dados = dados;
  }
  
  console.log('📤 Resposta:', JSON.stringify(resposta));
  return resposta;
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
      
      // ESTRUTURA CORRETA
      var cabecalho = ['Data', 'Cliente', 'Serviço', 'Solicitante', 'Descrição', 'Prazo', 'Status', 'Observações', 'Data Atualização'];
      aba.getRange(1, 1, 1, cabecalho.length).setValues([cabecalho]);
      
      console.log('✅ Planilha criada com estrutura correta');
    }
    
    console.log('🎉 Sistema inicializado com sucesso!');
    return 'Sistema Sagacy inicializado com sucesso em ' + new Date().toLocaleString('pt-BR');
    
  } catch (error) {
    console.error('❌ Erro na inicialização:', error);
    return 'Erro na inicialização: ' + error.message;
  }
}
