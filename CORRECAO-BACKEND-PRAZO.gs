/**
 * 🔧 CORREÇÃO URGENTE - BACKEND GOOGLE APPS SCRIPT
 * 
 * PROBLEMA IDENTIFICADO: Campo 'prazo' não está sendo salvo na planilha
 * 
 * INSTRUÇÕES:
 * 1. Abra o Google Apps Script: script.google.com
 * 2. Encontre o projeto da Sagacy
 * 3. Substitua a função criarSolicitacao pelo código abaixo
 * 4. Salve e publique novamente
 */

// === SUBSTITUIR A FUNÇÃO criarSolicitacao PELO CÓDIGO ABAIXO ===

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
      // Criar cabeçalhos - INCLUINDO PRAZO
      headers = ['id', 'cliente', 'servico', 'solicitante', 'descricao', 'prazo', 'observacoes', 'status', 'data', 'data_atualizacao'];
      sheet.appendRow(headers);
      ultimaLinha = 1;
      console.log('📋 Cabeçalhos criados: ' + headers.join(', '));
    } else {
      // Pegar cabeçalhos existentes
      headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
      console.log('📋 Cabeçalhos existentes: ' + headers.join(', '));
      
      // VERIFICAR SE PRAZO EXISTE, SE NÃO ADICIONAR
      var temPrazo = false;
      for (var h = 0; h < headers.length; h++) {
        if (headers[h].toString().toLowerCase() === 'prazo') {
          temPrazo = true;
          break;
        }
      }
      
      if (!temPrazo) {
        console.log('⚠️ Coluna PRAZO não encontrada, adicionando...');
        var novaColuna = headers.length + 1;
        sheet.getRange(1, novaColuna).setValue('prazo');
        headers.push('prazo');
        console.log('✅ Coluna PRAZO adicionada na posição ' + novaColuna);
      }
    }
    
    // Preparar dados para inserção
    var novaLinha = [];
    var agora = new Date();
    
    for (var i = 0; i < headers.length; i++) {
      var header = headers[i].toString().toLowerCase();
      var valor = dados[header] || '';
      
      // Log para debug do campo prazo
      if (header === 'prazo') {
        console.log('⏰ CAMPO PRAZO:');
        console.log('  - Header: ' + header);
        console.log('  - Valor recebido em dados: ' + dados[header]);
        console.log('  - Valor que será salvo: ' + valor);
      }
      
      // Valores padrão
      if (header === 'id' && !valor) {
        valor = dados.id || 'SOL_' + Date.now();
      }
      if (header === 'status' && !valor) {
        valor = 'Pendente';
      }
      if (header === 'data' && !valor) {
        valor = agora.toISOString();
      }
      if (header === 'data_atualizacao') {
        valor = agora.toISOString(); // Sempre atualizar
      }
      
      novaLinha.push(valor);
    }
    
    console.log('📝 Linha a ser inserida:');
    for (var j = 0; j < headers.length; j++) {
      console.log('  ' + headers[j] + ': ' + novaLinha[j]);
    }
    
    // Inserir dados
    sheet.appendRow(novaLinha);
    
    console.log('✅ Solicitação criada com sucesso');
    
    // Verificar se foi salvo corretamente
    var ultimaLinhaInserida = sheet.getLastRow();
    var dadosVerificacao = sheet.getRange(ultimaLinhaInserida, 1, 1, headers.length).getValues()[0];
    
    console.log('🔍 Verificação - dados salvos:');
    for (var k = 0; k < headers.length; k++) {
      console.log('  ' + headers[k] + ': ' + dadosVerificacao[k]);
      if (headers[k].toLowerCase() === 'prazo') {
        console.log('⏰ PRAZO SALVO: ' + dadosVerificacao[k]);
      }
    }
    
    // Montar objeto de resposta incluindo TODOS os campos
    var solicitacaoResposta = {};
    for (var l = 0; l < headers.length; l++) {
      var campo = headers[l].toString().toLowerCase();
      solicitacaoResposta[campo] = novaLinha[l];
    }
    
    // Enviar notificação por email
    if (SAGACY_CONFIG.EMAIL_NOTIFICATIONS) {
      try {
        enviarNotificacao(dados);
      } catch (emailError) {
        console.warn('⚠️ Erro ao enviar email:', emailError.message);
      }
    }
    
    return {
      sucesso: true,
      mensagem: 'Solicitação criada com sucesso',
      timestamp: agora.toISOString(),
      versao: '4.1-PRAZO-FIX',
      dados: {
        solicitacao: solicitacaoResposta,
        debug: {
          headers: headers,
          dadosSalvos: dadosVerificacao
        }
      }
    };
    
  } catch (error) {
    console.error('❌ Erro ao criar:', error);
    throw new Error('Erro ao criar solicitação: ' + error.message);
  }
}

// === TAMBÉM ATUALIZAR A FUNÇÃO listarSolicitacoes PARA GARANTIR QUE RETORNA PRAZO ===

function listarSolicitacoes() {
  try {
    console.log('📋 Listando solicitações...');
    
    var sheet = abrirPlanilha();
    var dados = sheet.getDataRange().getValues();
    
    if (dados.length <= 1) {
      console.log('📊 Nenhum dado encontrado');
      return {
        sucesso: true,
        mensagem: 'Nenhuma solicitação encontrada',
        timestamp: new Date().toISOString(),
        versao: '4.1-PRAZO-FIX',
        dados: []
      };
    }
    
    // Primeira linha são os cabeçalhos
    var headers = dados[0];
    var solicitacoes = [];
    
    console.log('📋 Headers da planilha: ' + headers.join(', '));
    
    // Verificar se prazo está nos headers
    var indicePrazo = -1;
    for (var h = 0; h < headers.length; h++) {
      if (headers[h].toString().toLowerCase() === 'prazo') {
        indicePrazo = h;
        break;
      }
    }
    
    if (indicePrazo === -1) {
      console.warn('⚠️ Coluna PRAZO não encontrada nos headers!');
    } else {
      console.log('✅ Coluna PRAZO encontrada no índice: ' + indicePrazo);
    }
    
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
        
        // Log específico para campo prazo
        if (header === 'prazo') {
          console.log('⏰ Linha ' + i + ' - Prazo: ' + valor);
        }
        
        solicitacao[header] = valor;
      }
      
      // Garantir que tem ID
      if (!solicitacao.id && solicitacao.cliente) {
        solicitacao.id = i; // Usar número da linha como ID
      }
      
      solicitacoes.push(solicitacao);
    }
    
    console.log('✅ Solicitações carregadas:', solicitacoes.length);
    
    return {
      sucesso: true,
      mensagem: `${solicitacoes.length} solicitações encontradas`,
      timestamp: new Date().toISOString(),
      versao: '4.1-PRAZO-FIX',
      dados: solicitacoes
    };
    
  } catch (error) {
    console.error('❌ Erro ao listar:', error);
    return {
      sucesso: false,
      mensagem: 'Erro ao listar solicitações: ' + error.message,
      timestamp: new Date().toISOString(),
      versao: '4.1-PRAZO-FIX',
      dados: []
    };
  }
}

/**
 * 📋 RESUMO DAS CORREÇÕES:
 * 
 * 1. ✅ Verificar se coluna 'prazo' existe nos headers
 * 2. ✅ Adicionar coluna 'prazo' se não existir
 * 3. ✅ Salvar valor do campo prazo corretamente
 * 4. ✅ Retornar campo prazo na resposta
 * 5. ✅ Logs detalhados para debug
 * 6. ✅ Verificação após salvar
 * 7. ✅ Listagem incluindo campo prazo
 * 
 * IMPORTANTE: Após aplicar esta correção, execute novo teste!
 */
