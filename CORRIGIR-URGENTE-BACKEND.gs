// =============================================
// SCRIPT DE CORREÇÃO URGENTE - EXECUTAR IMEDIATAMENTE
// =============================================
// Este script deve ser executado MANUALMENTE no Google Apps Script

function EXECUTAR_CORRECAO_URGENTE() {
  console.log('🚨 INICIANDO CORREÇÃO URGENTE DO SISTEMA...');
  
  try {
    var SPREADSHEET_ID = '12TDtLrXg4NM6H4kc6_x8gjsQCdKl76fkuqFCRc4-QRo';
    var SHEET_NAME = 'propostasacompanhamento';
    
    var planilha = SpreadsheetApp.openById(SPREADSHEET_ID);
    var aba = planilha.getSheetByName(SHEET_NAME);
    
    if (!aba) {
      console.log('❌ Planilha não encontrada!');
      return 'ERRO: Planilha não encontrada';
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
    
    var mensagem = '🎉 CORREÇÃO CONCLUÍDA!\n';
    mensagem += 'Corrigidas ' + correcoes + ' linhas com dados incorretos.\n';
    mensagem += 'Execute listarSolicitacoes() para verificar o resultado.';
    
    console.log(mensagem);
    return mensagem;
    
  } catch (error) {
    console.error('❌ ERRO NA CORREÇÃO:', error);
    return 'ERRO: ' + error.message;
  }
}

// FUNÇÃO PARA TESTAR APÓS CORREÇÃO
function TESTAR_APOS_CORRECAO() {
  console.log('🧪 Testando sistema após correção...');
  
  try {
    var resultado = listarSolicitacoes();
    
    if (resultado.sucesso && resultado.dados && resultado.dados.length > 0) {
      var primeiroItem = resultado.dados[0];
      
      console.log('📊 TESTE DO PRIMEIRO ITEM:');
      console.log('Prazo: "' + primeiroItem.prazo + '"');
      console.log('Status: "' + primeiroItem.status + '"');
      
      if (primeiroItem.prazo === 'Pendente') {
        return '❌ PROBLEMA AINDA EXISTE: Prazo ainda contém "Pendente"';
      } else {
        return '✅ CORREÇÃO FUNCIONOU: Prazo e Status estão corretos';
      }
    } else {
      return '⚠️ Nenhum dado encontrado para testar';
    }
    
  } catch (error) {
    return '❌ ERRO NO TESTE: ' + error.message;
  }
}

// FUNÇÃO PARA CRIAR DADOS DE TESTE LIMPOS
function CRIAR_TESTE_LIMPO() {
  console.log('🧪 Criando teste com dados limpos...');
  
  var dadosTeste = {
    cliente: 'Cliente Teste Final',
    servico: 'Teste de Sistema',
    solicitante: 'Thiago',
    descricao: 'Teste após correção do sistema',
    prazo: '15/07/2025' // DATA REAL, NÃO STATUS!
  };
  
  try {
    var resultado = criarSolicitacao(dadosTeste);
    
    if (resultado.sucesso) {
      console.log('✅ Solicitação de teste criada com sucesso');
      console.log('Prazo salvo: "' + resultado.dados.solicitacao.prazo + '"');
      return 'Teste criado com sucesso. Prazo: ' + resultado.dados.solicitacao.prazo;
    } else {
      return 'Erro ao criar teste: ' + resultado.mensagem;
    }
    
  } catch (error) {
    return 'Erro no teste: ' + error.message;
  }
}

// === INSTRUÇÕES DE USO ===
/*
PASSOS PARA EXECUTAR A CORREÇÃO:

1. Copie este código no Google Apps Script
2. Execute manualmente: EXECUTAR_CORRECAO_URGENTE()
3. Teste o resultado: TESTAR_APOS_CORRECAO()
4. Crie um teste limpo: CRIAR_TESTE_LIMPO()
5. Verifique no frontend se os prazos aparecem corretamente

IMPORTANTE: Execute as funções na ordem acima!
*/
