/**
 * 🔧 CORREÇÃO BACKEND - GARANTIR ESTRUTURA CORRETA
 * Script para garantir que a planilha tenha todos os campos necessários
 */

// === FUNÇÃO PARA VERIFICAR E CORRIGIR ESTRUTURA ===
function verificarEstruturaPlanilha() {
  try {
    console.log('🔍 Verificando estrutura da planilha...');
    
    var sheet = abrirPlanilha();
    var ultimaLinha = sheet.getLastRow();
    
    // Cabeçalhos esperados
    var cabecalhosEsperados = ['id', 'cliente', 'servico', 'solicitante', 'descricao', 'prazo', 'observacoes', 'status', 'data'];
    
    if (ultimaLinha === 0) {
      // Planilha vazia, criar cabeçalhos
      console.log('📋 Planilha vazia, criando cabeçalhos...');
      sheet.appendRow(cabecalhosEsperados);
      console.log('✅ Cabeçalhos criados: ' + cabecalhosEsperados.join(', '));
      return {
        success: true,
        message: 'Cabeçalhos criados com sucesso',
        headers: cabecalhosEsperados
      };
    }
    
    // Verificar cabeçalhos existentes
    var cabecalhosExistentes = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
    console.log('📋 Cabeçalhos existentes: ' + cabecalhosExistentes.join(', '));
    
    // Verificar se todos os cabeçalhos esperados estão presentes
    var faltando = [];
    for (var i = 0; i < cabecalhosEsperados.length; i++) {
      var encontrado = false;
      for (var j = 0; j < cabecalhosExistentes.length; j++) {
        if (cabecalhosExistentes[j].toString().toLowerCase() === cabecalhosEsperados[i]) {
          encontrado = true;
          break;
        }
      }
      if (!encontrado) {
        faltando.push(cabecalhosEsperados[i]);
      }
    }
    
    if (faltando.length > 0) {
      console.log('⚠️ Cabeçalhos faltando: ' + faltando.join(', '));
      
      // Adicionar cabeçalhos faltando
      var ultimaColuna = sheet.getLastColumn();
      for (var k = 0; k < faltando.length; k++) {
        sheet.getRange(1, ultimaColuna + k + 1).setValue(faltando[k]);
      }
      
      console.log('✅ Cabeçalhos adicionados: ' + faltando.join(', '));
      
      return {
        success: true,
        message: 'Cabeçalhos corrigidos',
        added: faltando,
        headers: sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0]
      };
    }
    
    console.log('✅ Estrutura da planilha está correta');
    return {
      success: true,
      message: 'Estrutura correta',
      headers: cabecalhosExistentes
    };
    
  } catch (error) {
    console.error('❌ Erro ao verificar estrutura:', error);
    return {
      success: false,
      message: 'Erro: ' + error.message
    };
  }
}

// === FUNÇÃO PARA LISTAR DADOS E DEBUG ===
function debugDadosPlanilha() {
  try {
    console.log('🔍 Debug completo da planilha...');
    
    var sheet = abrirPlanilha();
    var dados = sheet.getDataRange().getValues();
    
    if (dados.length === 0) {
      return {
        success: true,
        message: 'Planilha vazia',
        dados: []
      };
    }
    
    console.log('📊 Total de linhas: ' + dados.length);
    console.log('📋 Cabeçalhos: ' + dados[0].join(' | '));
    
    var resultado = {
      success: true,
      totalLinhas: dados.length,
      cabecalhos: dados[0],
      amostraDados: []
    };
    
    // Mostrar últimas 3 linhas como amostra
    var inicioAmostra = Math.max(1, dados.length - 3);
    for (var i = inicioAmostra; i < dados.length; i++) {
      var linha = {};
      for (var j = 0; j < dados[0].length; j++) {
        linha[dados[0][j]] = dados[i][j];
      }
      resultado.amostraDados.push(linha);
    }
    
    console.log('📋 Amostra dos dados:');
    console.log(JSON.stringify(resultado.amostraDados, null, 2));
    
    return resultado;
    
  } catch (error) {
    console.error('❌ Erro no debug:', error);
    return {
      success: false,
      message: 'Erro: ' + error.message
    };
  }
}

// === ATUALIZAÇÃO DA FUNÇÃO CRIAR SOLICITAÇÃO ===
function criarSolicitacaoCorrigida(dados) {
  try {
    console.log('➕ Criando solicitação (versão corrigida):', dados);
    
    // Primeiro verificar estrutura
    var estrutura = verificarEstruturaPlanilha();
    if (!estrutura.success) {
      throw new Error('Erro na estrutura: ' + estrutura.message);
    }
    
    // Validar dados obrigatórios
    if (!dados.cliente || !dados.servico || !dados.solicitante) {
      throw new Error('Campos obrigatórios não preenchidos');
    }
    
    var sheet = abrirPlanilha();
    var headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
    
    console.log('📋 Headers da planilha: ' + headers.join(', '));
    console.log('📊 Dados recebidos: ' + JSON.stringify(dados, null, 2));
    
    // Preparar dados para inserção
    var novaLinha = [];
    
    for (var i = 0; i < headers.length; i++) {
      var header = headers[i].toString().toLowerCase();
      var valor = dados[header] || '';
      
      // Log específico para prazo
      if (header === 'prazo') {
        console.log('⏰ Campo prazo - Header: ' + header + ', Valor recebido: ' + dados[header] + ', Valor final: ' + valor);
      }
      
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
      console.log('📝 Coluna ' + (i+1) + ' (' + header + '): ' + valor);
    }
    
    // Inserir dados
    console.log('📝 Inserindo linha: ' + novaLinha.join(' | '));
    sheet.appendRow(novaLinha);
    
    console.log('✅ Solicitação criada com sucesso');
    
    // Verificar se foi inserido corretamente
    var ultimaLinhaInserida = sheet.getLastRow();
    var dadosInseridos = sheet.getRange(ultimaLinhaInserida, 1, 1, headers.length).getValues()[0];
    console.log('🔍 Dados inseridos verificação: ' + dadosInseridos.join(' | '));
    
    return {
      success: true,
      message: 'Solicitação criada com sucesso',
      data: {
        id: dados.id || 'SOL_' + Date.now(),
        ...dados
      },
      debug: {
        headers: headers,
        dadosEnviados: novaLinha,
        dadosInseridos: dadosInseridos
      }
    };
    
  } catch (error) {
    console.error('❌ Erro ao criar:', error);
    throw new Error('Erro ao criar solicitação: ' + error.message);
  }
}

// === SUBSTITUIR FUNÇÃO ORIGINAL ===
function criarSolicitacao(dados) {
  return criarSolicitacaoCorrigida(dados);
}
