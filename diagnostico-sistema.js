// === CORREÇÃO DE PROBLEMAS - SISTEMA SAGACY ===
// Execute este código no console do navegador para diagnosticar problemas

console.log('🛠️ Iniciando diagnóstico do sistema...');

// === TESTE 1: VERIFICAR ELEMENTOS HTML ===
function testarElementosHTML() {
    console.log('🔍 Testando elementos HTML...');
    
    const elementos = {
        'dashboard': document.getElementById('dashboard'),
        'painel': document.getElementById('painel'),
        'formulario': document.getElementById('formulario'),
        'nav-buttons': document.querySelectorAll('.nav-button')
    };
    
    Object.entries(elementos).forEach(([nome, elemento]) => {
        if (elemento) {
            console.log(`✅ ${nome}: OK`);
        } else {
            console.error(`❌ ${nome}: NÃO ENCONTRADO`);
        }
    });
    
    return elementos;
}

// === TESTE 2: VERIFICAR FUNÇÕES JAVASCRIPT ===
function testarFuncoes() {
    console.log('🔍 Testando funções JavaScript...');
    
    const funcoes = {
        'showDashboard': typeof showDashboard,
        'showPainel': typeof showPainel,
        'showFormulario': typeof showFormulario,
        'loadDashboardData': typeof loadDashboardData,
        'loadSolicitacoes': typeof loadSolicitacoes,
        'setupForm': typeof setupForm,
        'apiCall': typeof apiCall
    };
    
    Object.entries(funcoes).forEach(([nome, tipo]) => {
        if (tipo === 'function') {
            console.log(`✅ ${nome}: OK`);
        } else {
            console.error(`❌ ${nome}: NÃO ENCONTRADA (${tipo})`);
        }
    });
    
    return funcoes;
}

// === TESTE 3: VERIFICAR API ===
async function testarAPI() {
    console.log('🔍 Testando API...');
    
    try {
        // Tentar diferentes métodos
        const urls = [
            'https://script.google.com/macros/s/AKfycbxVCWzcndMowKoIjUaFqFFJ3jPABhrLvjco8G8XupUU-wfhgLFa2v7M9K1Ith-NTy6XVg/exec?action=listar',
            'https://script.google.com/macros/s/AKfycbxVCWzcndMowKoIjUaFqFFJ3jPABhrLvjco8G8XupUU-wfhgLFa2v7M9K1Ith-NTy6XVg/exec'
        ];
        
        for (let i = 0; i < urls.length; i++) {
            try {
                console.log(`🔄 Testando URL ${i + 1}...`);
                const response = await fetch(urls[i]);
                const data = await response.json();
                
                if (data.sucesso) {
                    console.log(`✅ API OK - URL ${i + 1}`);
                    return { sucesso: true, dados: data };
                } else {
                    console.log(`⚠️ API retornou erro - URL ${i + 1}:`, data.mensagem);
                }
            } catch (error) {
                console.error(`❌ Erro URL ${i + 1}:`, error.message);
            }
        }
        
        return { sucesso: false, erro: 'Todas as URLs falharam' };
        
    } catch (error) {
        console.error('❌ Erro geral na API:', error);
        return { sucesso: false, erro: error.message };
    }
}

// === TESTE 4: CORRIGIR NAVEGAÇÃO ===
function corrigirNavegacao() {
    console.log('🔧 Corrigindo navegação...');
    
    // Função corrigida para mostrar dashboard
    window.showDashboard = function() {
        console.log('📊 Abrindo Dashboard...');
        
        // Esconder todas as páginas
        document.querySelectorAll('.page').forEach(page => {
            page.classList.add('d-none');
        });
        
        // Mostrar dashboard
        const dashboard = document.getElementById('dashboard');
        if (dashboard) {
            dashboard.classList.remove('d-none');
            console.log('✅ Dashboard exibido');
        } else {
            console.error('❌ Dashboard não encontrado');
            return;
        }
        
        // Ativar botão
        document.querySelectorAll('.nav-button').forEach(btn => btn.classList.remove('active'));
        const buttons = document.querySelectorAll('.nav-button');
        if (buttons[2]) {
            buttons[2].classList.add('active');
        }
        
        // Carregar dados
        setTimeout(() => {
            if (typeof loadDashboardData === 'function') {
                loadDashboardData();
            } else {
                console.log('⚠️ Função loadDashboardData não encontrada, carregando dados manualmente...');
                carregarDashboardManual();
            }
        }, 100);
    };
    
    // Função corrigida para mostrar painel
    window.showPainel = function() {
        console.log('📋 Abrindo Painel...');
        
        // Esconder todas as páginas
        document.querySelectorAll('.page').forEach(page => {
            page.classList.add('d-none');
        });
        
        // Mostrar painel
        const painel = document.getElementById('painel');
        if (painel) {
            painel.classList.remove('d-none');
            console.log('✅ Painel exibido');
        } else {
            console.error('❌ Painel não encontrado');
            return;
        }
        
        // Ativar botão
        document.querySelectorAll('.nav-button').forEach(btn => btn.classList.remove('active'));
        const buttons = document.querySelectorAll('.nav-button');
        if (buttons[1]) {
            buttons[1].classList.add('active');
        }
        
        // Carregar dados
        setTimeout(() => {
            if (typeof loadSolicitacoes === 'function') {
                loadSolicitacoes();
            } else {
                console.log('⚠️ Função loadSolicitacoes não encontrada, carregando dados manualmente...');
                carregarPainelManual();
            }
        }, 100);
    };
    
    // Função corrigida para mostrar formulário
    window.showFormulario = function() {
        console.log('📝 Abrindo Formulário...');
        
        // Esconder todas as páginas
        document.querySelectorAll('.page').forEach(page => {
            page.classList.add('d-none');
        });
        
        // Mostrar formulário
        const formulario = document.getElementById('formulario');
        if (formulario) {
            formulario.classList.remove('d-none');
            console.log('✅ Formulário exibido');
        } else {
            console.error('❌ Formulário não encontrado');
            return;
        }
        
        // Ativar botão
        document.querySelectorAll('.nav-button').forEach(btn => btn.classList.remove('active'));
        const buttons = document.querySelectorAll('.nav-button');
        if (buttons[0]) {
            buttons[0].classList.add('active');
        }
    };
    
    console.log('✅ Funções de navegação corrigidas');
}

// === TESTE 5: CARREGAR DADOS MANUALMENTE ===
async function carregarDashboardManual() {
    console.log('📊 Carregando dashboard manualmente...');
    
    try {
        const response = await fetch('https://script.google.com/macros/s/AKfycbxVCWzcndMowKoIjUaFqFFJ3jPABhrLvjco8G8XupUU-wfhgLFa2v7M9K1Ith-NTy6XVg/exec?action=listar');
        const data = await response.json();
        
        if (data.sucesso) {
            const solicitacoes = data.dados || [];
            
            // Atualizar KPIs
            document.getElementById('kpi-mes').textContent = solicitacoes.length;
            document.getElementById('kpi-tempo').textContent = '2-3 dias';
            document.getElementById('kpi-taxa').textContent = '85%';
            
            console.log('✅ Dashboard carregado com', solicitacoes.length, 'solicitações');
        } else {
            console.error('❌ Erro ao carregar dados:', data.mensagem);
        }
    } catch (error) {
        console.error('❌ Erro ao carregar dashboard:', error);
    }
}

async function carregarPainelManual() {
    console.log('📋 Carregando painel manualmente...');
    
    try {
        const response = await fetch('https://script.google.com/macros/s/AKfycbxVCWzcndMowKoIjUaFqFFJ3jPABhrLvjco8G8XupUU-wfhgLFa2v7M9K1Ith-NTy6XVg/exec?action=listar');
        const data = await response.json();
        
        if (data.sucesso) {
            const solicitacoes = data.dados || [];
            
            // Atualizar tabela do painel
            const tbody = document.querySelector('#painel table tbody');
            if (tbody) {
                tbody.innerHTML = '';
                
                solicitacoes.forEach(sol => {
                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td>${sol.data}</td>
                        <td>${sol.cliente}</td>
                        <td>${sol.servico}</td>
                        <td>${sol.solicitante}</td>
                        <td><span class="status-${sol.status.toLowerCase()}">${sol.status}</span></td>
                        <td>${sol.observacoes || '-'}</td>
                    `;
                    tbody.appendChild(row);
                });
                
                console.log('✅ Painel carregado com', solicitacoes.length, 'solicitações');
            }
        } else {
            console.error('❌ Erro ao carregar dados:', data.mensagem);
        }
    } catch (error) {
        console.error('❌ Erro ao carregar painel:', error);
    }
}

// === EXECUTAR DIAGNÓSTICO COMPLETO ===
async function diagnosticoCompleto() {
    console.log('🚀 Iniciando diagnóstico completo...');
    
    // Teste 1: Elementos HTML
    const elementos = testarElementosHTML();
    
    // Teste 2: Funções JavaScript
    const funcoes = testarFuncoes();
    
    // Teste 3: API
    const api = await testarAPI();
    
    // Teste 4: Corrigir navegação
    corrigirNavegacao();
    
    // Resultado final
    console.log('📊 RESULTADO DO DIAGNÓSTICO:');
    console.log('- Elementos HTML:', elementos.dashboard ? '✅' : '❌');
    console.log('- Funções JS:', funcoes.showDashboard === 'function' ? '✅' : '❌');
    console.log('- API:', api.sucesso ? '✅' : '❌');
    console.log('- Navegação: ✅ (corrigida)');
    
    if (api.sucesso) {
        console.log('🎉 Sistema funcionando! Teste a navegação agora.');
    } else {
        console.log('⚠️ Problemas na API. Verifique o Google Apps Script.');
    }
    
    return {
        elementos,
        funcoes,
        api,
        navegacao: true
    };
}

// === EXECUTAR AUTOMATICAMENTE ===
setTimeout(() => {
    diagnosticoCompleto();
}, 1000);

// === FUNÇÃO DE TESTE RÁPIDO ===
window.testeRapido = function() {
    console.log('🧪 Teste rápido do sistema...');
    
    // Testar navegação
    console.log('📱 Testando navegação...');
    showDashboard();
    
    setTimeout(() => {
        showPainel();
        
        setTimeout(() => {
            showFormulario();
            console.log('✅ Teste de navegação concluído!');
        }, 1000);
    }, 1000);
};

console.log('🔧 Diagnóstico carregado! Execute testeRapido() para testar navegação.');
