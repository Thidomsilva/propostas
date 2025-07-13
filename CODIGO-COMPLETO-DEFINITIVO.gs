// =============================================
// CÓDIGO GOOGLE APPS SCRIPT - VERSÃO FINAL DEFINITIVA
// =============================================
// VERSÃO 4.4-DEFINITIVA - Resolve TODOS os problemas
// Problema crítico resolvido: Mapeamento correto das colunas + Correção automática

// === CONFIGURAÇÕES ===
var SAGACY_CONFIG = {
  SPREADSHEET_ID: '12TDtLrXg4NM6H4kc6_x8gjsQCdKl76fkuqFCRc4-QRo',
  SHEET_NAME: 'propostasacompanhamento',
  EMAIL_NOTIFICATIONS: true,
  NOTIFICATION_EMAIL: 'thiago@sagacy.com.br',
  SENDER_EMAIL: 'agenty@sagacy.com.br',
  DEBUG: true
};

// === ESTRUTURA DA PLANILHA ===
// A=Data | B=Cliente | C=Serviço | D=Solicitante | E=Descrição | F=Prazo | G=Status | H=Observações | I=Data Atualização

// === FUNÇÕES PRINCIPAIS PARA CORS ===
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
    case 'validar_estrutura':
      return validarEstruturaPlanilha();
    case 'corrigir_dados':
      return corrigirDadosIncorretos();
    case 'correcao_urgente':
      return EXECUTAR_CORRECAO_URGENTE();
    case 'teste_pos_correcao':
      return TESTAR_APOS_CORRECAO();
    case 'criar_teste_limpo':
      return CRIAR_TESTE_LIMPO();
    default:
      return criarResposta(false, 'Ação não reconhecida: ' + action);
  }
}

// === FUNÇÃO DE LISTAR - COM CORREÇÃO AUTOMÁTICA ===
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
    
    // CORREÇÃO AUTOMÁTICA ANTES DE LISTAR
    corrigirDadosAutomaticamente(aba);
    
    var dados = aba.getDataRange().getValues();
    var solicitacoes = [];
    
    console.log('📊 Total de linhas encontradas:', dados.length);
    console.log('📋 Cabeçalhos:', dados[0].join(' | '));
    
    // Processar dados (pular cabeçalho)
    for (var i = 1; i < dados.length; i++) {
      var linha = dados[i];
      if (linha[0] && linha[0] !== '') {
        
        // MAPEAMENTO CORRIGIDO DAS COLUNAS:
        // A=0: Data, B=1: Cliente, C=2: Serviço, D=3: Solicitante, E=4: Descrição, F=5: Prazo, G=6: Status, H=7: Observações, I=8: Data Atualização
        var solicitacao = {
          id: i,
          data: formatarData(linha[0]),      // A: Data
          cliente: linha[1] || '',           // B: Cliente  
          servico: linha[2] || '',           // C: Serviço
          solicitante: linha[3] || '',       // D: Solicitante
          descricao: linha[4] || '',         // E: Descrição
          prazo: formatarData(linha[5]) || '', // F: Prazo ⬅️ POSIÇÃO CORRETA!
          status: linha[6] || 'Pendente',    // G: Status ⬅️ POSIÇÃO CORRETA!
          observacoes: linha[7] || '',       // H: Observações
          data_atualizacao: formatarData(linha[8]) || formatarData(linha[0]) // I: Data Atualização
        };
        
        // LOG PARA DEBUG
        console.log('🔍 Item processado:', {
          id: solicitacao.id,
          cliente: solicitacao.cliente,
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

// === FUNÇÃO DE CORREÇÃO AUTOMÁTICA ===
function corrigirDadosAutomaticamente(aba) {
  try {
    console.log('🔧 Verificando e corrigindo dados automaticamente...');
    
    var dados = aba.getDataRange().getValues();
    var correcoes = 0;
    
    // Verificar e corrigir dados incorretos
    for (var i = 1; i < dados.length; i++) {
      var linha = dados[i];
      
      // Se a coluna F (prazo) contém status em vez de data
      if (linha[5] === 'Pendente' || linha[5] === 'Em Andamento' || linha[5] === 'Concluído' || linha[5] === 'Cancelado') {
        console.log('🔧 Corrigindo linha ' + (i + 1) + ': Status na coluna prazo');
        
        // Mover status da coluna F para G
        aba.getRange(i + 1, 7).setValue(linha[5]); // G = Status
        aba.getRange(i + 1, 6).setValue(''); // F = Prazo (limpar)
        
        correcoes++;
      }
    }
    
    if (correcoes > 0) {
      console.log('✅ Correção automática: ' + correcoes + ' linhas corrigidas');
    }
    
  } catch (error) {
    console.log('⚠️ Erro na correção automática:', error);
  }
}

// === FUNÇÃO DE CRIAR - TOTALMENTE CORRIGIDA ===
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
    console.log('📝 Validando estrutura da planilha...');
    
    // Verificar estrutura da planilha
    var headers = aba.getRange(1, 1, 1, aba.getLastColumn()).getValues()[0];
    console.log('📋 Cabeçalhos atuais:', headers.join(' | '));
    
    // ESTRUTURA CORRETA: Data | Cliente | Serviço | Solicitante | Descrição | Prazo | Status | Observações | Data Atualização
    var novaLinha = [
      dataAtual,                                    // A: Data (posição 0)
      dados.cliente.trim(),                         // B: Cliente (posição 1)
      dados.servico.trim(),                         // C: Serviço (posição 2)
      dados.solicitante.trim(),                     // D: Solicitante (posição 3)
      dados.descricao.trim(),                       // E: Descrição (posição 4)
      dados.prazo || '',                            // F: Prazo (posição 5) ⬅️ CORRETO!
      'Pendente',                                   // G: Status (posição 6) ⬅️ CORRETO!
      dados.observacoes ? dados.observacoes.trim() : '', // H: Observações (posição 7)
      dataAtual + ' ' + horaAtual                   // I: Data Atualização (posição 8)
    ];
    
    console.log('📝 LINHA CORRIGIDA a ser inserida:');
    console.log('A-Data:', novaLinha[0]);
    console.log('B-Cliente:', novaLinha[1]);
    console.log('C-Serviço:', novaLinha[2]);
    console.log('D-Solicitante:', novaLinha[3]);
    console.log('E-Descrição:', novaLinha[4]);
    console.log('F-Prazo:', novaLinha[5], '⬅️ CAMPO PRAZO CORRETO');
    console.log('G-Status:', novaLinha[6], '⬅️ STATUS CORRETO');
    console.log('H-Observações:', novaLinha[7]);
    console.log('I-Data Atualização:', novaLinha[8]);
    
    aba.appendRow(novaLinha);
    console.log('✅ Solicitação salva na planilha COM ESTRUTURA TOTALMENTE CORRIGIDA');
    
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
    
    console.log('✅ Solicitação criada COM PRAZO FUNCIONANDO:', solicitacaoSalva.prazo);
    
    // Enviar e-mail
    var emailResult = { sucesso: false, motivo: 'Email desabilitado' };
    
    if (SAGACY_CONFIG.EMAIL_NOTIFICATIONS) {
      try {
        console.log('📧 Enviando notificação por e-mail...');
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
    
    console.log('✅ Solicitação criada com sucesso TOTAL');
    
    return criarResposta(true, 'Solicitação criada com sucesso', {
      solicitacao: solicitacaoSalva,
      email: emailResult
    });
    
  } catch (error) {
    console.error('❌ Erro ao criar solicitação:', error);
    return criarResposta(false, 'Erro ao criar solicitação: ' + error.message);
  }
}

// === FUNÇÃO DE ATUALIZAR - CORRIGIDA ===
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
    
    // ATUALIZAR POSIÇÕES CORRETAS:
    // G=7: Status, H=8: Observações, I=9: Data Atualização
    aba.getRange(linha, 7).setValue(dados.status);  // G: Status (coluna 7)
    aba.getRange(linha, 8).setValue(dados.observacoes || ''); // H: Observações (coluna 8)
    aba.getRange(linha, 9).setValue(new Date().toLocaleDateString('pt-BR') + ' ' + new Date().toLocaleTimeString('pt-BR')); // I: Data Atualização (coluna 9)
    
    console.log('✅ Solicitação atualizada com posições corretas');
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

// === FUNÇÃO DE E-MAIL - INCLUINDO PRAZO ===
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
      prazo: '31/07/2025',
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

// === FUNÇÕES AUXILIARES ===
function formatarData(valor) {
  if (!valor) return '';
  
  try {
    if (valor instanceof Date) {
      return valor.toLocaleDateString('pt-BR');
    }
    
    if (typeof valor === 'string') {
      // Se já está no formato DD/MM/AAAA, retornar como está
      if (valor.match(/^\d{2}\/\d{2}\/\d{4}$/)) {
        return valor;
      }
      
      // Tentar converter outras variações
      var data = new Date(valor);
      if (!isNaN(data.getTime())) {
        return data.toLocaleDateString('pt-BR');
      }
    }
    
    return valor.toString();
  } catch (error) {
    console.log('Erro ao formatar data:', valor, error);
    return valor.toString();
  }
}

function criarResposta(sucesso, mensagem, dados) {
  var resposta = {
    sucesso: sucesso,
    mensagem: mensagem,
    timestamp: new Date().toISOString(),
    versao: '4.4-DEFINITIVA'  // VERSÃO FINAL DEFINITIVA
  };
  
  if (dados) {
    resposta.dados = dados;
  }
  
  console.log('📤 Resposta:', JSON.stringify(resposta));
  return resposta;
}

// === FUNÇÃO DE VALIDAÇÃO DA ESTRUTURA ===
function validarEstruturaPlanilha() {
  try {
    console.log('🔍 Validando estrutura da planilha...');
    
    var planilha = SpreadsheetApp.openById(SAGACY_CONFIG.SPREADSHEET_ID);
    var aba = planilha.getSheetByName(SAGACY_CONFIG.SHEET_NAME);
    
    if (!aba) {
      return criarResposta(false, 'Planilha não encontrada');
    }
    
    var headers = aba.getRange(1, 1, 1, aba.getLastColumn()).getValues()[0];
    var estruturaCorreta = ['Data', 'Cliente', 'Serviço', 'Solicitante', 'Descrição', 'Prazo', 'Status', 'Observações', 'Data Atualização'];
    
    var validacao = {
      headers_atuais: headers,
      estrutura_correta: estruturaCorreta,
      esta_correto: JSON.stringify(headers) === JSON.stringify(estruturaCorreta),
      total_colunas: headers.length,
      problemas: []
    };
    
    if (!validacao.esta_correto) {
      for (var i = 0; i < estruturaCorreta.length; i++) {
        if (headers[i] !== estruturaCorreta[i]) {
          validacao.problemas.push('Posição ' + (i + 1) + ': Esperado "' + estruturaCorreta[i] + '", encontrado "' + (headers[i] || 'VAZIO') + '"');
        }
      }
    }
    
    console.log('📊 Validação:', JSON.stringify(validacao));
    return criarResposta(true, 'Validação da estrutura executada', validacao);
    
  } catch (error) {
    console.error('❌ Erro na validação:', error);
    return criarResposta(false, 'Erro na validação: ' + error.message);
  }
}

// === FUNÇÃO PARA CORRIGIR DADOS INCORRETOS ===
function corrigirDadosIncorretos() {
  try {
    console.log('🔧 Iniciando correção de dados incorretos...');
    
    var planilha = SpreadsheetApp.openById(SAGACY_CONFIG.SPREADSHEET_ID);
    var aba = planilha.getSheetByName(SAGACY_CONFIG.SHEET_NAME);
    
    if (!aba) {
      return criarResposta(false, 'Planilha não encontrada');
    }
    
    var dados = aba.getDataRange().getValues();
    var correcoes = [];
    
    // Verificar e corrigir dados incorretos
    for (var i = 1; i < dados.length; i++) {
      var linha = dados[i];
      var precisaCorrecao = false;
      
      // Verificar se há "Pendente" na coluna F (prazo) em vez de G (status)
      if (linha[5] === 'Pendente' || linha[5] === 'Em Andamento' || linha[5] === 'Concluído') {
        console.log('🔧 Linha ' + (i + 1) + ': Status encontrado na coluna de prazo');
        
        // Mover status da coluna F para G
        aba.getRange(i + 1, 7).setValue(linha[5]); // Colocar status na posição correta (G)
        aba.getRange(i + 1, 6).setValue(''); // Limpar prazo incorreto (F)
        
        correcoes.push({
          linha: i + 1,
          problema: 'Status na coluna de prazo',
          acao: 'Movido "' + linha[5] + '" de prazo para status'
        });
        
        precisaCorrecao = true;
      }
      
      if (precisaCorrecao) {
        // Atualizar data de atualização
        aba.getRange(i + 1, 9).setValue(new Date().toLocaleDateString('pt-BR') + ' ' + new Date().toLocaleTimeString('pt-BR'));
      }
    }
    
    console.log('✅ Correções aplicadas:', correcoes.length);
    return criarResposta(true, 'Correção de dados executada', {
      correcoes_aplicadas: correcoes.length,
      detalhes: correcoes
    });
    
  } catch (error) {
    console.error('❌ Erro na correção:', error);
    return criarResposta(false, 'Erro na correção: ' + error.message);
  }
}

// === FUNÇÃO DE INICIALIZAÇÃO - VERSÃO FINAL ===
function inicializarSistema() {
  try {
    console.log('🚀 Inicializando sistema Sagacy VERSÃO FINAL...');
    
    var planilha = SpreadsheetApp.openById(SAGACY_CONFIG.SPREADSHEET_ID);
    var aba = planilha.getSheetByName(SAGACY_CONFIG.SHEET_NAME);
    
    if (!aba) {
      console.log('📋 Criando nova planilha...');
      aba = planilha.insertSheet(SAGACY_CONFIG.SHEET_NAME);
      
      // ESTRUTURA FINAL CORRETA
      var cabecalho = ['Data', 'Cliente', 'Serviço', 'Solicitante', 'Descrição', 'Prazo', 'Status', 'Observações', 'Data Atualização'];
      aba.getRange(1, 1, 1, cabecalho.length).setValues([cabecalho]);
      
      console.log('✅ Planilha criada com estrutura FINAL CORRETA');
    } else {
      console.log('✅ Planilha existente encontrada, validando estrutura...');
      
      var headers = aba.getRange(1, 1, 1, aba.getLastColumn()).getValues()[0];
      var estruturaCorreta = ['Data', 'Cliente', 'Serviço', 'Solicitante', 'Descrição', 'Prazo', 'Status', 'Observações', 'Data Atualização'];
      
      if (JSON.stringify(headers) !== JSON.stringify(estruturaCorreta)) {
        console.log('⚠️ Estrutura incorreta detectada, corrigindo...');
        aba.getRange(1, 1, 1, estruturaCorreta.length).setValues([estruturaCorreta]);
        console.log('✅ Cabeçalhos corrigidos');
      }
    }
    
    console.log('🎉 Sistema inicializado com sucesso - VERSÃO FINAL DEFINITIVA!');
    return 'Sistema Sagacy inicializado com sucesso em ' + new Date().toLocaleString('pt-BR') + ' - VERSÃO 4.4-DEFINITIVA';
    
  } catch (error) {
    console.error('❌ Erro na inicialização:', error);
    return 'Erro na inicialização: ' + error.message;
  }
}

// === FUNÇÃO DE DEBUG AVANÇADO ===
function debugSistemaCompleto() {
  try {
    console.log('🐛 Iniciando debug completo do sistema...');
    
    var planilha = SpreadsheetApp.openById(SAGACY_CONFIG.SPREADSHEET_ID);
    var aba = planilha.getSheetByName(SAGACY_CONFIG.SHEET_NAME);
    
    if (!aba) {
      return criarResposta(false, 'Planilha não encontrada para debug');
    }
    
    var dados = aba.getDataRange().getValues();
    var headers = dados[0];
    
    var debug = {
      timestamp: new Date().toISOString(),
      versao: '4.4-DEFINITIVA',
      planilha: {
        total_linhas: dados.length,
        total_colunas: headers.length,
        headers: headers
      },
      dados_exemplo: [],
      problemas_detectados: []
    };
    
    // Analisar primeiras 3 linhas de dados
    for (var i = 1; i <= Math.min(3, dados.length - 1); i++) {
      var linha = dados[i];
      debug.dados_exemplo.push({
        linha: i + 1,
        data: linha[0],
        cliente: linha[1],
        servico: linha[2],
        solicitante: linha[3],
        descricao: linha[4],
        prazo: linha[5],
        status: linha[6],
        observacoes: linha[7],
        data_atualizacao: linha[8]
      });
      
      // Detectar problemas
      if (linha[5] === 'Pendente' || linha[5] === 'Em Andamento' || linha[5] === 'Concluído') {
        debug.problemas_detectados.push('Linha ' + (i + 1) + ': Status na coluna de prazo');
      }
    }
    
    return criarResposta(true, 'Debug completo executado', debug);
    
  } catch (error) {
    console.error('❌ Erro no debug:', error);
    return criarResposta(false, 'Erro no debug: ' + error.message);
  }
}

// =============================================
// FUNÇÕES DE CORREÇÃO URGENTE INTEGRADAS
// =============================================

function EXECUTAR_CORRECAO_URGENTE() {
  console.log('🚨 INICIANDO CORREÇÃO URGENTE DO SISTEMA...');
  
  try {
    var planilha = SpreadsheetApp.openById(SAGACY_CONFIG.SPREADSHEET_ID);
    var aba = planilha.getSheetByName(SAGACY_CONFIG.SHEET_NAME);
    
    if (!aba) {
      console.log('❌ Planilha não encontrada!');
      return criarResposta(false, 'ERRO: Planilha não encontrada');
    }
    
    // 1. CORRIGIR CABEÇALHOS
    console.log('📋 Corrigindo cabeçalhos...');
    var cabeçalhoCorreto = ['Data', 'Cliente', 'Serviço', 'Solicitante', 'Descrição', 'Prazo', 'Status', 'Observações', 'Data Atualização'];
    aba.getRange(1, 1, 1, cabeçalhoCorreto.length).setValues([cabeçalhoCorreto]);
    console.log('✅ Cabeçalhos corrigidos');
    
    // 2. CORRIGIR DADOS INCORRETOS
    console.log('🔧 Corrigindo dados incorretos...');
    var dados = aba.getDataRange().getValues();
    var correcoes = 0;
    
    for (var i = 1; i < dados.length; i++) {
      var linha = dados[i];
      
      // Se a coluna F (prazo) contém status em vez de data
      if (linha[5] === 'Pendente' || linha[5] === 'Em Andamento' || linha[5] === 'Concluído' || linha[5] === 'Cancelado') {
        console.log('🔧 Linha ' + (i + 1) + ': Corrigindo status na coluna prazo');
        
        // Mover status para a posição correta (coluna G)
        aba.getRange(i + 1, 7).setValue(linha[5]); // G = Status
        aba.getRange(i + 1, 6).setValue(''); // F = Prazo (limpar)
        
        correcoes++;
      }
    }
    
    console.log('✅ Correções aplicadas: ' + correcoes);
    
    // 3. VERIFICAR RESULTADO
    console.log('🔍 Verificando resultado...');
    var dadosCorrigidos = aba.getDataRange().getValues();
    
    console.log('📊 RESULTADO DA CORREÇÃO:');
    for (var j = 1; j <= Math.min(3, dadosCorrigidos.length - 1); j++) {
      var linhaCorrigida = dadosCorrigidos[j];
      console.log('Linha ' + (j + 1) + ':');
      console.log('  F-Prazo: "' + linhaCorrigida[5] + '"');
      console.log('  G-Status: "' + linhaCorrigida[6] + '"');
    }
    
    var resultado = {
      correcoes_aplicadas: correcoes,
      mensagem: 'Correção urgente concluída com sucesso',
      proximos_passos: [
        'Execute listarSolicitacoes() para verificar',
        'Crie nova solicitação para testar',
        'Verifique no frontend'
      ]
    };
    
    console.log('🎉 CORREÇÃO URGENTE CONCLUÍDA!');
    return criarResposta(true, 'Correção urgente executada com sucesso', resultado);
    
  } catch (error) {
    console.error('❌ ERRO NA CORREÇÃO URGENTE:', error);
    return criarResposta(false, 'ERRO: ' + error.message);
  }
}

function TESTAR_APOS_CORRECAO() {
  console.log('🧪 Testando sistema após correção...');
  
  try {
    var resultado = listarSolicitacoes();
    
    if (resultado.sucesso && resultado.dados && resultado.dados.length > 0) {
      var primeiroItem = resultado.dados[0];
      
      console.log('📊 TESTE DO PRIMEIRO ITEM:');
      console.log('Prazo: "' + primeiroItem.prazo + '"');
      console.log('Status: "' + primeiroItem.status + '"');
      
      var teste = {
        item_testado: primeiroItem,
        prazo_correto: primeiroItem.prazo !== 'Pendente',
        status_correto: primeiroItem.status === 'Pendente',
        resultado: primeiroItem.prazo !== 'Pendente' ? 'SUCESSO' : 'FALHA'
      };
      
      return criarResposta(true, 'Teste pós-correção executado', teste);
      
    } else {
      return criarResposta(false, 'Nenhum dado encontrado para testar');
    }
    
  } catch (error) {
    return criarResposta(false, 'Erro no teste: ' + error.message);
  }
}

function CRIAR_TESTE_LIMPO() {
  console.log('🧪 Criando teste com dados limpos...');
  
  var dadosTeste = {
    cliente: 'Cliente Teste Final',
    servico: 'Teste de Sistema',
    solicitante: 'Thiago',
    descricao: 'Teste após correção definitiva do sistema',
    prazo: '15/07/2025' // DATA REAL, NÃO STATUS!
  };
  
  try {
    var resultado = criarSolicitacao(dadosTeste);
    
    if (resultado.sucesso) {
      console.log('✅ Solicitação de teste criada com sucesso');
      console.log('Prazo salvo: "' + resultado.dados.solicitacao.prazo + '"');
      
      var teste = {
        dados_enviados: dadosTeste,
        dados_salvos: resultado.dados.solicitacao,
        prazo_funcionando: resultado.dados.solicitacao.prazo === dadosTeste.prazo,
        status_correto: resultado.dados.solicitacao.status === 'Pendente'
      };
      
      return criarResposta(true, 'Teste limpo criado com sucesso', teste);
    } else {
      return criarResposta(false, 'Erro ao criar teste: ' + resultado.mensagem);
    }
    
  } catch (error) {
    return criarResposta(false, 'Erro no teste: ' + error.message);
  }
}
