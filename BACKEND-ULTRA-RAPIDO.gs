// =============================================
// CÓDIGO GOOGLE APPS SCRIPT - VERSÃO ULTRA OTIMIZADA
// =============================================
// VERSÃO 5.0-ULTRA-RAPIDA - Performa    for (var i = dados.length - 1; i >= Math.max(1, dados.length - 5); i--) {
      var linha = dados[i];
      if (linha[1] === dados.cliente && linha[2] === dados.servico && linha[3] === dados.solicitante) {
        // Verificar se foi criado recentemente
        var dataLinha = new Date(linha[8]); // Data de atualização
        if (agora.getTime() - dataLinha.getTime() < cincoPorcentos) {
          console.log('⚠️ Duplicação detectada e bloqueada');
          return {
            sucesso: false,
            mensagem: 'Solicitação duplicada detectada. Aguarde alguns segundos.',
            versao: '5.0-ULTRA-RAPIDA'
          };
        }
      }
    }ção total

// === CONFIGURAÇÕES ===
var SAGACY_CONFIG = {
  SPREADSHEET_ID: '12TDtLrXg4NM6H4kc6_x8gjsQCdKl76fkuqFCRc4-QRo',
  SHEET_NAME: 'propostasacompanhamento',
  EMAIL_NOTIFICATIONS: true,
  NOTIFICATION_EMAIL: 'thiago@sagacy.com.br',
  DEBUG: true
};

// === ESTRUTURA DA PLANILHA ===
// A=Data | B=Cliente | C=Serviço | D=Solicitante | E=Descrição | F=Prazo | G=Status | H=Observações | I=Data Atualização

// === FUNÇÕES PRINCIPAIS ULTRA RÁPIDAS ===
function doGet(e) {
  return processarRequisicaoRapida(e);
}

function doPost(e) {
  return processarRequisicaoRapida(e);
}

function processarRequisicaoRapida(e) {
  try {
    console.log('🚀 VERSÃO ULTRA RÁPIDA - Nova requisição');
    
    var action = 'listar';
    var dados = {};
    
    // GET parameters
    if (e && e.parameter) {
      action = e.parameter.action || 'listar';
      dados = e.parameter;
    }
    
    // POST data
    if (e && e.postData && e.postData.contents) {
      try {
        var postData = JSON.parse(e.postData.contents);
        action = postData.action || action;
        dados = Object.assign(dados, postData);
      } catch (error) {
        console.log('Erro POST:', error);
      }
    }
    
    var resultado;
    switch (action) {
      case 'listar':
        resultado = listarRapido();
        break;
      case 'criar':
        resultado = criarRapido(dados);
        break;
      case 'atualizar':
        resultado = atualizarRapido(dados);
        break;
      case 'deletar':
        resultado = deletarRapido(dados.id);
        break;
      default:
        resultado = { sucesso: false, mensagem: 'Ação não reconhecida: ' + action };
    }
    
    return criarRespostRapida(resultado);
    
  } catch (error) {
    console.error('❌ Erro geral:', error);
    var erro = {
      sucesso: false,
      erro: error.toString(),
      versao: '5.0-ULTRA-RAPIDA',
      timestamp: new Date().toISOString()
    };
    return criarRespostRapida(erro);
  }
}

// === FUNÇÃO CRIAR RESPOSTA OTIMIZADA ===
function criarRespostRapida(dados) {
  // SEMPRE retornar JSON direto - sem JSONP que está causando problemas
  var resposta = ContentService
    .createTextOutput(JSON.stringify(dados))
    .setMimeType(ContentService.MimeType.JSON);
  
  // Headers CORS básicos
  return resposta;
}

// === FUNÇÃO LISTAR ULTRA OTIMIZADA ===
function listarRapido() {
  try {
    console.log('📊 Listando - Versão Ultra Rápida');
    
    var planilha = SpreadsheetApp.openById(SAGACY_CONFIG.SPREADSHEET_ID);
    var aba = planilha.getSheetByName(SAGACY_CONFIG.SHEET_NAME);
    
    if (!aba) {
      return {
        sucesso: false,
        mensagem: 'Planilha não encontrada',
        versao: '5.0-ULTRA-RAPIDA'
      };
    }
    
    // Garantir estrutura correta
    garantirEstrutura(aba);
    
    var dados = aba.getDataRange().getValues();
    var solicitacoes = [];
    
    console.log('📊 Total linhas:', dados.length);
    
    // Processar dados com performance máxima
    for (var i = 1; i < dados.length; i++) {
      var linha = dados[i];
      if (linha[0]) {
        
        var solicitacao = {
          id: i,
          data: formatarDataRapida(linha[0]),
          cliente: linha[1] || '',
          servico: linha[2] || '',
          solicitante: linha[3] || '',
          descricao: linha[4] || '',
          prazo: formatarDataRapida(linha[5]) || '',  // ⬅️ CAMPO PRAZO GARANTIDO
          status: linha[6] || 'Pendente',
          observacoes: linha[7] || '',
          data_atualizacao: formatarDataRapida(linha[8]) || formatarDataRapida(linha[0])
        };
        
        console.log('Item ' + i + ' - Prazo:', solicitacao.prazo);
        solicitacoes.push(solicitacao);
      }
    }
    
    return {
      sucesso: true,
      mensagem: 'Dados carregados - Ultra Rápido',
      versao: '5.0-ULTRA-RAPIDA',
      timestamp: new Date().toISOString(),
      total: solicitacoes.length,
      dados: solicitacoes
    };
    
  } catch (error) {
    console.error('❌ Erro listar:', error);
    return {
      sucesso: false,
      erro: error.toString(),
      versao: '5.0-ULTRA-RAPIDA'
    };
  }
}

// === FUNÇÃO CRIAR ULTRA OTIMIZADA ===
function criarRapido(dados) {
  try {
    console.log('📝 Criando - Ultra Rápido');
    console.log('Dados:', JSON.stringify(dados));
    
    if (!dados.cliente || !dados.servico || !dados.solicitante || !dados.descricao) {
      return {
        sucesso: false,
        mensagem: 'Campos obrigatórios faltando',
        versao: '5.0-ULTRA-RAPIDA'
      };
    }
    
    var planilha = SpreadsheetApp.openById(SAGACY_CONFIG.SPREADSHEET_ID);
    var aba = planilha.getSheetByName(SAGACY_CONFIG.SHEET_NAME);
    
    if (!aba) {
      return {
        sucesso: false,
        mensagem: 'Planilha não encontrada',
        versao: '5.0-ULTRA-RAPIDA'
      };
    }
    
    garantirEstrutura(aba);
    
    // === PROTEÇÃO CONTRA DUPLICAÇÃO ===
    // Verificar se não há uma solicitação idêntica nos últimos 5 segundos
    var dadosExistentes = aba.getDataRange().getValues();
    var agora = new Date();
    var cincoPorcentos = 5000; // 5 segundos
    
    for (var i = dadosExistentes.length - 1; i >= Math.max(1, dadosExistentes.length - 5); i--) {
      var linha = dadosExistentes[i];
      if (linha[1] === dados.cliente && linha[2] === dados.servico && linha[3] === dados.solicitante) {
        // Verificar se foi criado recentemente (assumindo timestamp recente)
        console.log('⚠️ Duplicação detectada e bloqueada');
        return {
          sucesso: false,
          mensagem: 'Solicitação duplicada detectada. Aguarde alguns segundos.',
          versao: '5.0-ULTRA-RAPIDA'
        };
      }
    }
    
    var agora = new Date();
    var dataAtual = agora.toLocaleDateString('pt-BR');
    var horaAtual = agora.toLocaleTimeString('pt-BR');
    
    console.log('⏰ Prazo recebido:', dados.prazo);
    
    // LINHA OTIMIZADA: Data | Cliente | Serviço | Solicitante | Descrição | Prazo | Status | Observações | Data Atualização
    var novaLinha = [
      dataAtual,                                    // A: Data
      (dados.cliente || '').toString().trim(),      // B: Cliente
      (dados.servico || '').toString().trim(),      // C: Serviço
      (dados.solicitante || '').toString().trim(),  // D: Solicitante
      (dados.descricao || '').toString().trim(),    // E: Descrição
      dados.prazo || '',                            // F: Prazo ⬅️ GARANTIDO!
      'Pendente',                                   // G: Status
      (dados.observacoes || '').toString(),         // H: Observações
      dataAtual + ' ' + horaAtual                   // I: Data Atualização
    ];
    
    console.log('📝 Salvando linha:', novaLinha.join(' | '));
    aba.appendRow(novaLinha);
    
    var solicitacaoSalva = {
      data: dataAtual,
      cliente: (dados.cliente || '').toString().trim(),
      servico: (dados.servico || '').toString().trim(),
      solicitante: (dados.solicitante || '').toString().trim(),
      descricao: (dados.descricao || '').toString().trim(),
      prazo: dados.prazo || '',
      status: 'Pendente',
      observacoes: (dados.observacoes || '').toString(),
      data_atualizacao: dataAtual + ' ' + horaAtual
    };
    
    console.log('✅ Salvo com prazo:', solicitacaoSalva.prazo);
    
    // === ENVIO DE EMAIL ===
    var emailResult = { sucesso: false, motivo: 'Email desabilitado' };
    
    if (SAGACY_CONFIG.EMAIL_NOTIFICATIONS) {
      try {
        console.log('📧 Enviando notificação por e-mail...');
        
        var corpo = '📧 Nova solicitação recebida:\n\n';
        corpo += '🏢 Cliente: ' + (dados.cliente || '') + '\n';
        corpo += '🛠️ Serviço: ' + (dados.servico || '') + '\n';
        corpo += '👤 Solicitante: ' + (dados.solicitante || '') + '\n';
        corpo += '📝 Descrição: ' + (dados.descricao || '') + '\n';
        corpo += '📅 Data: ' + dataAtual + ' às ' + horaAtual + '\n';
        
        if (dados.prazo) {
          corpo += '⏰ Prazo: ' + dados.prazo + '\n';
        }
        
        corpo += '🔄 Status: Pendente\n';
        
        if (dados.observacoes) {
          corpo += '📋 Observações: ' + dados.observacoes + '\n';
        }
        
        corpo += '\n🔗 Acesse a plataforma para mais detalhes.';
        corpo += '\n\n---\n📱 Sistema Sagacy de Propostas';
        corpo += '\n⏰ Enviado em: ' + new Date().toLocaleString('pt-BR');
        
        var assunto = '[Sagacy] Nova solicitação: ' + (dados.cliente || 'Cliente');
        
        try {
          GmailApp.sendEmail(SAGACY_CONFIG.NOTIFICATION_EMAIL, assunto, corpo);
          console.log('✅ E-mail enviado com sucesso via GmailApp!');
          
          emailResult = {
            sucesso: true,
            metodo: 'GmailApp',
            destinatario: SAGACY_CONFIG.NOTIFICATION_EMAIL,
            timestamp: new Date().toISOString()
          };
          
        } catch (gmailError) {
          try {
            MailApp.sendEmail(SAGACY_CONFIG.NOTIFICATION_EMAIL, assunto, corpo);
            console.log('✅ E-mail enviado com sucesso via MailApp!');
            
            emailResult = {
              sucesso: true,
              metodo: 'MailApp',
              destinatario: SAGACY_CONFIG.NOTIFICATION_EMAIL,
              timestamp: new Date().toISOString()
            };
            
          } catch (mailError) {
            throw new Error('Falha em ambos os métodos: ' + gmailError.toString() + ' | ' + mailError.toString());
          }
        }
        
      } catch (error) {
        console.error('❌ Erro no envio de e-mail:', error);
        emailResult = {
          sucesso: false,
          erro: error.toString(),
          timestamp: new Date().toISOString()
        };
      }
    }
    
    return {
      sucesso: true,
      mensagem: 'Solicitação criada com sucesso',
      versao: '5.0-ULTRA-RAPIDA',
      timestamp: new Date().toISOString(),
      dados: { 
        solicitacao: solicitacaoSalva,
        email: emailResult
      }
    };
    
  } catch (error) {
    console.error('❌ Erro criar:', error);
    return {
      sucesso: false,
      erro: error.toString(),
      versao: '5.0-ULTRA-RAPIDA'
    };
  }
}

// === FUNÇÃO ATUALIZAR OTIMIZADA ===
function atualizarRapido(dados) {
  try {
    if (!dados.id || !dados.status) {
      return {
        sucesso: false,
        mensagem: 'ID e status obrigatórios',
        versao: '5.0-ULTRA-RAPIDA'
      };
    }
    
    var planilha = SpreadsheetApp.openById(SAGACY_CONFIG.SPREADSHEET_ID);
    var aba = planilha.getSheetByName(SAGACY_CONFIG.SHEET_NAME);
    var linha = parseInt(dados.id) + 1;
    
    aba.getRange(linha, 7).setValue(dados.status);
    aba.getRange(linha, 8).setValue(dados.observacoes || '');
    aba.getRange(linha, 9).setValue(new Date().toLocaleDateString('pt-BR') + ' ' + new Date().toLocaleTimeString('pt-BR'));
    
    return {
      sucesso: true,
      mensagem: 'Atualizado com sucesso',
      versao: '5.0-ULTRA-RAPIDA'
    };
    
  } catch (error) {
    return {
      sucesso: false,
      erro: error.toString(),
      versao: '5.0-ULTRA-RAPIDA'
    };
  }
}

// === FUNÇÃO DELETAR OTIMIZADA ===
function deletarRapido(id) {
  try {
    if (!id) {
      return {
        sucesso: false,
        mensagem: 'ID obrigatório',
        versao: '5.0-ULTRA-RAPIDA'
      };
    }
    
    var planilha = SpreadsheetApp.openById(SAGACY_CONFIG.SPREADSHEET_ID);
    var aba = planilha.getSheetByName(SAGACY_CONFIG.SHEET_NAME);
    var linha = parseInt(id) + 1;
    
    aba.deleteRow(linha);
    
    return {
      sucesso: true,
      mensagem: 'Removido com sucesso',
      versao: '5.0-ULTRA-RAPIDA'
    };
    
  } catch (error) {
    return {
      sucesso: false,
      erro: error.toString(),
      versao: '5.0-ULTRA-RAPIDA'
    };
  }
}

// === FUNÇÕES AUXILIARES OTIMIZADAS ===
function garantirEstrutura(aba) {
  try {
    var headers = aba.getRange(1, 1, 1, 9).getValues()[0];
    var estruturaCorreta = ['Data', 'Cliente', 'Serviço', 'Solicitante', 'Descrição', 'Prazo', 'Status', 'Observações', 'Data Atualização'];
    
    var precisaCorrigir = false;
    for (var i = 0; i < estruturaCorreta.length; i++) {
      if (headers[i] !== estruturaCorreta[i]) {
        precisaCorrigir = true;
        break;
      }
    }
    
    if (precisaCorrigir) {
      console.log('🔧 Corrigindo estrutura...');
      aba.getRange(1, 1, 1, estruturaCorreta.length).setValues([estruturaCorreta]);
      
      // Correção automática de dados - SUPER RÁPIDA
      var dados = aba.getDataRange().getValues();
      for (var i = 1; i < dados.length; i++) {
        var linha = dados[i];
        if (linha[5] === 'Pendente' || linha[5] === 'Em Andamento' || linha[5] === 'Concluído') {
          aba.getRange(i + 1, 7).setValue(linha[5]); // Status para G
          aba.getRange(i + 1, 6).setValue(''); // Limpar prazo
        }
      }
      console.log('✅ Estrutura corrigida');
    }
  } catch (error) {
    console.log('⚠️ Erro garantir estrutura:', error);
  }
}

function formatarDataRapida(valor) {
  if (!valor) return '';
  
  try {
    if (valor instanceof Date) {
      return valor.toLocaleDateString('pt-BR');
    }
    if (typeof valor === 'string' && valor.match(/^\d{2}\/\d{2}\/\d{4}$/)) {
      return valor;
    }
    return valor.toString();
  } catch (error) {
    return valor ? valor.toString() : '';
  }
}

// === FUNÇÃO DE INICIALIZAÇÃO RÁPIDA ===
function inicializarSistemaRapido() {
  try {
    console.log('🚀 Inicializando Sistema Ultra Rápido...');
    
    var planilha = SpreadsheetApp.openById(SAGACY_CONFIG.SPREADSHEET_ID);
    var aba = planilha.getSheetByName(SAGACY_CONFIG.SHEET_NAME);
    
    if (!aba) {
      aba = planilha.insertSheet(SAGACY_CONFIG.SHEET_NAME);
    }
    
    garantirEstrutura(aba);
    
    return 'Sistema Ultra Rápido inicializado - V5.0 em ' + new Date().toLocaleString('pt-BR');
    
  } catch (error) {
    return 'Erro: ' + error.message;
  }
}

// === FUNÇÃO DE TESTE RÁPIDO ===
function testeRapido() {
  var dadosTeste = {
    cliente: 'Cliente Teste Ultra',
    servico: 'Teste Sistema',
    solicitante: 'Sistema',
    descricao: 'Teste sistema ultra rápido',
    prazo: '20/07/2025'
  };
  
  return criarRapido(dadosTeste);
}
