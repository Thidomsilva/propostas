// === TESTE DA API ===
// Teste para verificar se a API está funcionando

async function testarAPI() {
    console.log('🧪 Testando API...');
    
    try {
        // Teste 1: Listar solicitações
        const response = await fetch('https://script.google.com/macros/s/AKfycbxVCWzcndMowKoIjUaFqFFJ3jPABhrLvjco8G8XupUU-wfhgLFa2v7M9K1Ith-NTy6XVg/exec?action=listar');
        const data = await response.json();
        
        console.log('✅ Resposta da API:', data);
        
        if (data.sucesso) {
            console.log('✅ API funcionando!');
            return true;
        } else {
            console.error('❌ API retornou erro:', data.mensagem);
            return false;
        }
        
    } catch (error) {
        console.error('❌ Erro ao testar API:', error);
        return false;
    }
}

// Executar teste
testarAPI();
