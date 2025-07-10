/**
 * ⭐ PLATAFORMA PROPOSTAS COMERCIAIS - SAGACY - VERSÃO PRODUÇÃO ⭐
 * Backend Google Apps Script - Máxima Compatibilidade
 */

// Configurações principais
var SAGACY_CONFIG = {
  SPREADSHEET_ID: '12TDtLrXg4NM6H4kc6_x8gjsQCdKl76fkuqFCRc4-QRo',
  SHEET_NAME: 'propostasacompanhamento',
  EMAIL_NOTIFICATIONS: true,
  NOTIFICATION_EMAIL: 'thiago@sagacy.com.br',
  SENDER_EMAIL: 'agenty@sagacy.com.br',
  DEBUG: true
};

// === FUNÇÕES PRINCIPAIS ===

// Serve a página principal e processa requisições GET
function doGet(e) {
  try {
    console.log('🔄 doGet executado:', e.parameter);
    
    var action = e.parameter.action;
    
    if (action) {
      // Se for uma requisição com action via GET, processar
      console.log('📡 Processando GET com action:', action);
      return processarAcao(action, e.parameter);
    }
    
    // Caso contrário, servir a página HTML (se existir)
    try {
      return HtmlService.createTemplateFromFile('index')
        .evaluate()
        .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL)
        .addMetaTag('viewport', 'width=device-width, initial-scale=1');
    } catch (htmlError) {
      // Se não tem arquivo HTML, retornar resposta JSON
      console.log('⚠️ Arquivo HTML não encontrado, retornando resposta de API');
      return criarRespostaJSON({
        success: true,
        message: 'API Sagacy funcionando - Configure o HTML',
        data: [],
        timestamp: new Date().toISOString()
      });
    }
  } catch (error) {
    console.error('❌ Erro no doGet:', error);
    return criarRespostaJSON({
      success: false,
      message: 'Erro no servidor: ' + error.message,
      error: error.toString()
    });
  }
}

// Processa requisições POST
function doPost(e) {
  try {
    console.log('📥 doPost executado');
    console.log('📋 Parameters:', e.parameter);
    console.log('📄 PostData:', e.postData);
    
    var action = e.parameter.action;
    var data = {};
    
    // === MÉTODO 1: Tentar ler dados do postData como JSON ===
    if (e.postData && e.postData.contents) {
      try {
        console.log('🧪 Tentando parsear postData como JSON...');
        data = JSON.parse(e.postData.contents);
        console.log('✅ PostData JSON parseado:', data);
      } catch (jsonError) {
        console.log('⚠️ PostData não é JSON válido:', jsonError.message);
      }
    }
    
    // === MÉTODO 2: Usar parâmetros se JSON falhou ===
    if (Object.keys(data).length === 0 && e.parameter) {
      console.log('🧪 Usando parâmetros como fallback...');
      
      // Tentar ler campo 'data' como JSON
      if (e.parameter.data) {
        try {
          data = JSON.parse(e.parameter.data);
          console.log('✅ Parâmetro data parseado como JSON:', data);
        } catch (paramError) {
          console.log('⚠️ Parâmetro data não é JSON:', paramError.message);
          // Usar os parâmetros diretamente
          data = e.parameter;
        }
      } else {
        // Usar todos os parâmetros
        data = e.parameter;
      }
    }
    
    // === MÉTODO 3: Se ainda não tem dados, usar parâmetros diretamente ===
    if (Object.keys(data).length === 0) {
      console.log('🧪 Usando todos os parâmetros...');
      data = e.parameter || {};
    }
    
    console.log('📊 Dados finais para processamento:', data);
    console.log('🎯 Action:', action);
    
    if (!action) {
      throw new Error('Parâmetro action é obrigatório');
    }
    
    return processarAcao(action, data);
    
  } catch (error) {
    console.error('❌ Erro no doPost:', error);
    return criarRespostaJSON({
      success: false,
      message: 'Erro no servidor: ' + error.message,
      error: error.toString()
    });
  }
}

// === PROCESSAMENTO DE AÇÕES ===

function processarAcao(action, data) {
  try {
    console.log('🔄 Processando ação:', action);
    console.log('📊 Com dados:', data);
    
    var resultado;
    
    switch (action) {
      case 'listar':
        resultado = listarSolicitacoes();
        break;
        
      case 'criar':
        resultado = criarSolicitacao(data);
        break;
        
      case 'atualizar':
        resultado = atualizarStatus(data.id, data.status);
        break;
        
      case 'test':
      case 'teste':
        resultado = testeAPI();
        break;
        
      default:
        throw new Error('Ação não reconhecida: ' + action);
    }
    
    console.log('✅ Resultado da ação:', resultado);
    return criarRespostaJSON(resultado);
    
  } catch (error) {
    console.error('❌ Erro ao processar ação:', error);
    return criarRespostaJSON({
      success: false,
      message: 'Erro ao processar ação: ' + error.message,
      action: action,
      error: error.toString()
    });
  }
}

// === FUNÇÕES DE DADOS ===

function listarSolicitacoes() {
  try {
    console.log('📋 Listando solicitações...');
    
    var sheet = abrirPlanilha();
    var dados = sheet.getDataRange().getValues();
    
    if (dados.length <= 1) {
      console.log('📊 Nenhum dado encontrado');
      return {
        success: true,
        message: 'Nenhuma solicitação encontrada',
        data: []
      };
    }
    
    // Primeira linha são os cabeçalhos
    var headers = dados[0];
    var solicitacoes = [];
    
    // Processar dados
    for (var i = 1; i < dados.length; i++) {
      var linha = dados[i];
      var solicitacao = {};
      
      for (var j = 0; j < headers.length; j++) {
        var header = headers[j].toString().toLowerCase();
        var valor = linha[j];
        
        // Converter datas para string
        if (valor instanceof Date) {
          valor = valor.toISOString();
        }
        
        solicitacao[header] = valor;
      }
      
      // Garantir que tem ID
      if (!solicitacao.id && solicitacao.cliente) {
        solicitacao.id = 'SOL_' + i;
      }
      
      solicitacoes.push(solicitacao);
    }
    
    console.log('✅ Solicitações carregadas:', solicitacoes.length);
    
    return {
      success: true,
      message: `${solicitacoes.length} solicitações encontradas`,
      data: solicitacoes
    };
    
  } catch (error) {
    console.error('❌ Erro ao listar:', error);
    throw new Error('Erro ao carregar dados: ' + error.message);
  }
}

function criarSolicitacao(dados) {
  try {
    console.log('➕ Criando solicitação:', dados);
    
    // Validar dados obrigatórios
    if (!dados.cliente || !dados.servico || !dados.solicitante) {
      throw new Error('Campos obrigatórios não preenchidos');
    }
    
    var sheet = abrirPlanilha();
    
    // Verificar se é a primeira linha de dados
    var ultimaLinha = sheet.getLastRow();
    var headers;
    
    if (ultimaLinha === 0) {
      // Criar cabeçalhos
      headers = ['id', 'cliente', 'servico', 'solicitante', 'descricao', 'prazo', 'observacoes', 'status', 'data'];
      sheet.appendRow(headers);
      ultimaLinha = 1;
    } else {
      // Pegar cabeçalhos existentes
      headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
    }
    
    // Preparar dados para inserção
    var novaLinha = [];
    
    for (var i = 0; i < headers.length; i++) {
      var header = headers[i].toString().toLowerCase();
      var valor = dados[header] || '';
      
      // Valores padrão
      if (header === 'id' && !valor) {
        valor = dados.id || 'SOL_' + Date.now();
      }
      if (header === 'status' && !valor) {
        valor = 'Pendente';
      }
      if (header === 'data' && !valor) {
        valor = new Date().toISOString();
      }
      
      novaLinha.push(valor);
    }
    
    // Inserir dados
    sheet.appendRow(novaLinha);
    
    console.log('✅ Solicitação criada com sucesso');
    
    // Enviar notificação por email
    if (SAGACY_CONFIG.EMAIL_NOTIFICATIONS) {
      try {
        enviarNotificacao(dados);
      } catch (emailError) {
        console.warn('⚠️ Erro ao enviar email:', emailError.message);
      }
    }
    
    return {
      success: true,
      message: 'Solicitação criada com sucesso',
      data: {
        id: dados.id || 'SOL_' + Date.now(),
        ...dados
      }
    };
    
  } catch (error) {
    console.error('❌ Erro ao criar:', error);
    throw new Error('Erro ao criar solicitação: ' + error.message);
  }
}

function atualizarStatus(id, novoStatus) {
  try {
    console.log('🔄 Atualizando status:', id, '->', novoStatus);
    
    if (!id || !novoStatus) {
      throw new Error('ID e novo status são obrigatórios');
    }
    
    var sheet = abrirPlanilha();
    var dados = sheet.getDataRange().getValues();
    
    if (dados.length <= 1) {
      throw new Error('Nenhuma solicitação encontrada');
    }
    
    var headers = dados[0];
    var statusCol = -1;
    var idCol = -1;
    
    // Encontrar colunas de ID e Status
    for (var i = 0; i < headers.length; i++) {
      var header = headers[i].toString().toLowerCase();
      if (header === 'id') idCol = i;
      if (header === 'status') statusCol = i;
    }
    
    if (idCol === -1 || statusCol === -1) {
      throw new Error('Colunas ID ou Status não encontradas');
    }
    
    // Procurar e atualizar a linha
    for (var linha = 1; linha < dados.length; linha++) {
      if (dados[linha][idCol] === id) {
        // Atualizar status
        sheet.getRange(linha + 1, statusCol + 1).setValue(novoStatus);
        
        console.log('✅ Status atualizado na linha:', linha + 1);
        
        return {
          success: true,
          message: 'Status atualizado com sucesso',
          data: {
            id: id,
            status: novoStatus
          }
        };
      }
    }
    
    throw new Error('Solicitação não encontrada: ' + id);
    
  } catch (error) {
    console.error('❌ Erro ao atualizar:', error);
    throw new Error('Erro ao atualizar status: ' + error.message);
  }
}

function testeAPI() {
  try {
    console.log('🧪 Executando teste da API...');
    
    var sheet = abrirPlanilha();
    var totalLinhas = sheet.getLastRow();
    
    return {
      success: true,
      message: 'API funcionando corretamente',
      data: {
        timestamp: new Date().toISOString(),
        spreadsheet_id: SAGACY_CONFIG.SPREADSHEET_ID,
        sheet_name: SAGACY_CONFIG.SHEET_NAME,
        total_rows: totalLinhas,
        status: 'OK'
      }
    };
    
  } catch (error) {
    console.error('❌ Erro no teste:', error);
    throw new Error('Erro no teste da API: ' + error.message);
  }
}

// === FUNÇÕES AUXILIARES ===

function abrirPlanilha() {
  try {
    var spreadsheet = SpreadsheetApp.openById(SAGACY_CONFIG.SPREADSHEET_ID);
    var sheet = spreadsheet.getSheetByName(SAGACY_CONFIG.SHEET_NAME);
    
    if (!sheet) {
      throw new Error('Aba não encontrada: ' + SAGACY_CONFIG.SHEET_NAME);
    }
    
    return sheet;
  } catch (error) {
    console.error('❌ Erro ao abrir planilha:', error);
    throw new Error('Erro ao acessar planilha: ' + error.message);
  }
}

function criarRespostaJSON(data) {
  try {
    // Garante que data nunca é undefined
    if (typeof data === 'undefined') {
      data = { success: false, message: 'Resposta vazia do servidor' };
    }
    var jsonResponse = '';
    try {
      jsonResponse = JSON.stringify(data);
    } catch (stringifyError) {
      jsonResponse = JSON.stringify({ success: false, message: 'Erro ao serializar resposta', error: stringifyError.toString() });
    }
    // Log seguro
    if (jsonResponse && typeof jsonResponse === 'string') {
      console.log('📤 Enviando resposta:', jsonResponse.substring(0, 200));
    } else {
      console.log('📤 Enviando resposta: [resposta não serializável]');
    }
    return ContentService
      .createTextOutput(jsonResponse)
      .setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    console.error('❌ Erro ao criar resposta JSON:', error);
    return ContentService
      .createTextOutput(JSON.stringify({
        success: false,
        message: 'Erro interno do servidor',
        error: error.toString()
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function enviarNotificacao(dados) {
  try {
    if (!SAGACY_CONFIG.EMAIL_NOTIFICATIONS || !SAGACY_CONFIG.NOTIFICATION_EMAIL) {
      return;
    }
    
    var assunto = `Nova Solicitação: ${dados.cliente} - ${dados.servico}`;
    var corpo = `
    Nova solicitação de proposta comercial recebida:
    
    📋 Detalhes:
    • Cliente: ${dados.cliente}
    • Serviço: ${dados.servico}
    • Solicitante: ${dados.solicitante}
    • Prazo: ${dados.prazo}
    
    📝 Descrição:
    ${dados.descricao}
    
    💡 Observações:
    ${dados.observacoes || 'Nenhuma observação adicional'}
    
    📅 Data: ${new Date().toLocaleString('pt-BR')}
    
    ---
    Plataforma Sagacy - Gestão de Propostas
    `;
    
    GmailApp.sendEmail(
      SAGACY_CONFIG.NOTIFICATION_EMAIL,
      assunto,
      corpo,
      {
        from: SAGACY_CONFIG.SENDER_EMAIL
      }
    );
    
    console.log('📧 Email de notificação enviado');
  } catch (error) {
    console.error('❌ Erro ao enviar email:', error);
    // Não propagar o erro de email
  }
}

// === FUNÇÕES DE SUPORTE CORS ===

function doOptions(e) {
  return ContentService
    .createTextOutput('')
    .setHeaders({
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Max-Age': '86400'
    });
}

// === LOG DE INICIALIZAÇÃO ===
console.log('🎯 Backend Sagacy - Versão Produção Inicializada');
console.log('📊 Planilha ID:', SAGACY_CONFIG.SPREADSHEET_ID);
console.log('📋 Aba:', SAGACY_CONFIG.SHEET_NAME);
console.log('📧 Notificações:', SAGACY_CONFIG.EMAIL_NOTIFICATIONS);
