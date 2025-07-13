// =============================================
// API.JS - VERSÃO ULTRA OTIMIZADA
// =============================================
// Resolve problemas de CORS, performance e JSONP

// URL do Google Apps Script
const API_URL = 'https://script.google.com/macros/s/AKfycbxnPtPUQrhIunbYIZczAIf4DJsZr1ustcs7BZ1An6Araz6wNVbRQmlS61al7Tog7aCr1A/exec';

// === FUNÇÃO PRINCIPAL ULTRA SIMPLES ===
async function apiCall(action, data = {}) {
    console.log(`🚀 API Call Ultra Rápida: ${action}`);
    
    try {
        // Método direto POST - mais rápido e confiável
        const params = new URLSearchParams();
        params.append('action', action);
        
        if (data && Object.keys(data).length > 0) {
            for (const [key, value] of Object.entries(data)) {
                params.append(key, value);
            }
        }
        
        console.log('📤 Enviando dados:', params.toString());
        
        const response = await fetch(API_URL, {
            method: 'POST',
            body: params,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            }
        });
        
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        const text = await response.text();
        console.log('📥 Resposta recebida:', text.substring(0, 200) + '...');
        
        // Parse JSON direto - backend agora retorna JSON puro
        const result = JSON.parse(text);
        
        console.log('✅ Sucesso:', result.versao || 'versão não identificada');
        return result;
        
    } catch (error) {
        console.error('❌ Erro na API:', error);
        return {
            sucesso: false,
            erro: error.message,
            timestamp: new Date().toISOString()
        };
    }
}

// === FUNÇÕES ESPECÍFICAS ===
async function listarSolicitacoes() {
    console.log('📊 Listando solicitações - Ultra Rápido');
    return await apiCall('listar');
}

async function criarSolicitacao(dados) {
    console.log('📝 Criando solicitação - Ultra Rápido');
    console.log('Dados a enviar:', dados);
    return await apiCall('criar', dados);
}

async function atualizarSolicitacao(id, status, observacoes = '') {
    console.log('📝 Atualizando solicitação - Ultra Rápido');
    return await apiCall('atualizar', { id, status, observacoes });
}

async function deletarSolicitacao(id) {
    console.log('🗑️ Deletando solicitação - Ultra Rápido');
    return await apiCall('deletar', { id });
}

// === TESTE DA API ===
async function testarAPI() {
    console.log('🧪 Testando API Ultra Rápida...');
    
    try {
        const resultado = await listarSolicitacoes();
        
        if (resultado.sucesso) {
            console.log('✅ Teste da API: SUCESSO!');
            console.log('📊 Versão do backend:', resultado.versao);
            console.log('📊 Total de registros:', resultado.total || 0);
            return true;
        } else {
            console.log('❌ Teste da API: FALHA!');
            console.log('❌ Erro:', resultado.erro || resultado.mensagem);
            return false;
        }
    } catch (error) {
        console.error('❌ Erro no teste:', error);
        return false;
    }
}

// Expor funções globalmente
window.apiCall = apiCall;
window.listarSolicitacoes = listarSolicitacoes;
window.criarSolicitacao = criarSolicitacao;
window.atualizarSolicitacao = atualizarSolicitacao;
window.deletarSolicitacao = deletarSolicitacao;
window.testarAPI = testarAPI;

console.log('🚀 API Ultra Rápida carregada!');
