// === CONFIGURAÇÃO ===
const API_CONFIG = {
    // URL do Google Apps Script Web App - VERSÃO ATUALIZADA
    BASE_URL: 'https://script.google.com/macros/s/AKfycbw-jMfWF5F7I_1kRUddL7ou7Y6JtJeDs271CV2sT1mOwcLEUESy3oOkGDMl7eA4b6kiBw/exec',
    
    // Cache buster para forçar atualização
    CACHE_BUSTER: Date.now(),
    
    // Configurações de timeout e retry
    TIMEOUT: 30000,
    MAX_RETRIES: 3,
    
    // Debug mode
    DEBUG: true
};

// === VARIÁVEIS GLOBAIS ===
let currentPage = 'dashboard';
let solicitacoes = [];
let isLoading = false;
let debugMode = false;

// === FUNÇÕES DE INICIALIZAÇÃO ===
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Aplicação iniciando...');
    
    // Verificar se estamos em modo debug
    debugMode = window.location.href.includes('debug=true');
    if (debugMode) {
        const debugInfo = document.getElementById('debug-info');
        if (debugInfo) debugInfo.classList.add('show');
    }
    
    // Configurar cache buster na URL da API
    if (API_CONFIG.BASE_URL.includes('localhost') || API_CONFIG.BASE_URL.includes('COLE_AQUI')) {
        console.warn('⚠️ URL da API não configurada. Configure API_CONFIG.BASE_URL');
        showToast('Configure a URL da API no código', 'warning');
    }
    
    // Inicializar aplicação
    try {
        hideLoading();
        showFormulario(); // Começar com Nova Solicitação
        setupForm();
        console.log('✅ Aplicação inicializada');
        updateDebugInfo('App iniciada');
    } catch (e) {
        hideLoading();
        const formulario = document.getElementById('formulario');
        if (formulario) formulario.classList.remove('d-none');
        showToast('Erro ao inicializar a aplicação', 'error');
        console.error('Erro na inicialização:', e);
    }
});

// === FUNÇÕES DE NAVEGAÇÃO ===
function showDashboard() {
    console.log('📊 Abrindo Dashboard...');
    console.log('📊 Página atual antes da troca:', currentPage);
    
    // Forçar mudança de página com método múltiplo
    console.log('🔄 Tentando switchPage para dashboard...');
    switchPage('dashboard');
    
    // Verificar se switchPage funcionou
    setTimeout(() => {
        const dashboardElement = document.getElementById('dashboard');
        console.log('📊 Após switchPage - Classes do dashboard:', dashboardElement?.className);
        
        // Se switchPage não funcionou, forçar manualmente
        if (dashboardElement && dashboardElement.classList.contains('d-none')) {
            console.log('⚠️ switchPage falhou, forçando navegação manual para dashboard...');
            
            // Esconder todas as páginas
            const allPages = document.querySelectorAll('.page');
            allPages.forEach(page => {
                page.classList.add('d-none');
                page.style.display = 'none';
            });
            
            // Mostrar dashboard
            dashboardElement.classList.remove('d-none');
            dashboardElement.style.display = 'block';
            dashboardElement.style.visibility = 'visible';
            
            // Ativar botão
            const buttons = document.querySelectorAll('.nav-button');
            buttons.forEach(btn => btn.classList.remove('active'));
            if (buttons[2]) buttons[2].classList.add('active');
            
            // Atualizar currentPage
            currentPage = 'dashboard';
            
            console.log('✅ Navegação manual forçada para o dashboard');
        }
    }, 100);
    
    // Carregar dados do dashboard
    setTimeout(() => {
        console.log('📊 Carregando dados do dashboard...');
        if (typeof loadDashboardData === 'function') {
            loadDashboardData();
        } else {
            console.error('❌ Função loadDashboardData não encontrada');
            showToast('Erro ao carregar dashboard', 'error');
        }
    }, 200);
}

function showFormulario() {
    console.log('📝 Abrindo Formulário...');
    console.log('📝 Página atual antes da troca:', currentPage);
    
    // Forçar mudança de página com método múltiplo
    console.log('🔄 Tentando switchPage para formulário...');
    switchPage('formulario');
    
    // Verificar se switchPage funcionou
    setTimeout(() => {
        const formularioElement = document.getElementById('formulario');
        console.log('📝 Após switchPage - Classes do formulário:', formularioElement?.className);
        
        // Se switchPage não funcionou, forçar manualmente
        if (formularioElement && formularioElement.classList.contains('d-none')) {
            console.log('⚠️ switchPage falhou, forçando navegação manual para formulário...');
            
            // Esconder todas as páginas
            const allPages = document.querySelectorAll('.page');
            allPages.forEach(page => {
                page.classList.add('d-none');
                page.style.display = 'none';
            });
            
            // Mostrar formulário
            formularioElement.classList.remove('d-none');
            formularioElement.style.display = 'block';
            formularioElement.style.visibility = 'visible';
            
            // Ativar botão
            const buttons = document.querySelectorAll('.nav-button');
            buttons.forEach(btn => btn.classList.remove('active'));
            if (buttons[0]) buttons[0].classList.add('active');
            
            // Atualizar currentPage
            currentPage = 'formulario';
            
            console.log('✅ Navegação manual forçada para o formulário');
        }
    }, 100);
    
    // Configurar formulário
    setTimeout(() => {
        console.log('📝 Configurando formulário...');
        if (typeof setupForm === 'function') {
            setupForm();
        } else {
            console.error('❌ Função setupForm não encontrada');
        }
    }, 200);
}

function showPainel() {
    console.log('📋 Abrindo Painel...');
    console.log('📋 Página atual antes da troca:', currentPage);
    
    // Forçar mudança de página com método múltiplo
    console.log('🔄 Tentando switchPage...');
    switchPage('painel');
    
    // Verificar se switchPage funcionou
    setTimeout(() => {
        const painelElement = document.getElementById('painel');
        console.log('📋 Após switchPage - Classes do painel:', painelElement?.className);
        
        // Se switchPage não funcionou, forçar manualmente
        if (painelElement && painelElement.classList.contains('d-none')) {
            console.log('⚠️ switchPage falhou, forçando navegação manual...');
            
            // Esconder todas as páginas
            const allPages = document.querySelectorAll('.page');
            allPages.forEach(page => {
                page.classList.add('d-none');
                page.style.display = 'none';
            });
            
            // Mostrar painel
            painelElement.classList.remove('d-none');
            painelElement.style.display = 'block';
            painelElement.style.visibility = 'visible';
            
            // Ativar botão
            const buttons = document.querySelectorAll('.nav-button');
            buttons.forEach(btn => btn.classList.remove('active'));
            if (buttons[1]) buttons[1].classList.add('active');
            
            // Atualizar currentPage
            currentPage = 'painel';
            
            console.log('✅ Navegação manual forçada para o painel');
        }
    }, 100);
    
    // Verificar se a página mudou
    setTimeout(() => {
        const painelElement = document.getElementById('painel');
        console.log('📋 Elemento painel encontrado:', !!painelElement);
        console.log('📋 Classes do painel:', painelElement?.className);
        console.log('📋 Style display do painel:', painelElement?.style.display);
        console.log('📋 Página atual após troca:', currentPage);
    }, 200);
    
    // Carregar dados do painel
    setTimeout(() => {
        console.log('📋 Carregando dados do painel...');
        if (typeof loadSolicitacoes === 'function') {
            loadSolicitacoes();
        } else {
            console.error('❌ Função loadSolicitacoes não encontrada');
            showToast('Erro ao carregar painel', 'error');
        }
    }, 300);
}

function switchPage(pageId) {
    console.log(`📱 Navegando para: ${pageId}`);
    console.log(`📱 Página atual antes da troca: ${currentPage}`);
    
    // Parar auto-refresh do dashboard se estiver ativo
    if (typeof stopDashboardAutoRefresh === 'function') {
        stopDashboardAutoRefresh();
    }
    
    // Esconder todas as páginas
    const pages = document.querySelectorAll('.page');
    console.log(`🔍 Encontradas ${pages.length} páginas`);
    
    pages.forEach(page => {
        page.classList.add('d-none');
        page.style.display = 'none'; // Forçar esconder
        console.log(`🔒 Escondido: ${page.id} - Classes: ${page.className}`);
    });
    
    // Remover classe active de todos os botões
    const buttons = document.querySelectorAll('.nav-button');
    buttons.forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Mostrar página atual
    const targetPage = document.getElementById(pageId);
    if (targetPage) {
        targetPage.classList.remove('d-none');
        targetPage.style.display = 'block'; // Forçar mostrar
        console.log(`✅ Página ${pageId} exibida - Classes: ${targetPage.className} - Display: ${targetPage.style.display}`);
        
        // Verificar se realmente está visível
        setTimeout(() => {
            const computedStyle = window.getComputedStyle(targetPage);
            console.log(`🔍 Verificação final ${pageId}: display=${computedStyle.display}, visibility=${computedStyle.visibility}`);
        }, 100);
    } else {
        console.error(`❌ Página ${pageId} não encontrada`);
        showToast(`Página ${pageId} não encontrada`, 'error');
        return;
    }
    
    // Ativar botão correspondente baseado no pageId
    let buttonIndex = -1;
    switch(pageId) {
        case 'formulario':
            buttonIndex = 0;
            break;
        case 'painel':
            buttonIndex = 1;
            break;
        case 'dashboard':
            buttonIndex = 2;
            break;
    }
    
    if (buttonIndex >= 0 && buttons[buttonIndex]) {
        buttons[buttonIndex].classList.add('active');
        console.log(`✅ Botão ${pageId} (índice ${buttonIndex}) ativado`);
    }
    
    // Atualizar página atual
    currentPage = pageId;
    updateDebugInfo(`Página atual: ${pageId}`);
    
    // Scroll para o topo
    window.scrollTo(0, 0);
    
    // Iniciar auto-refresh do dashboard se necessário
    if (pageId === 'dashboard' && typeof startDashboardAutoRefresh === 'function') {
        startDashboardAutoRefresh(5); // 5 minutos
    }
}

// === FUNÇÕES UTILITÁRIAS ===
function getStatusClass(status) {
    const classes = {
        'Pendente': 'status-pendente',
        'Em Andamento': 'status-em-andamento',
        'Concluído': 'status-concluido',
        'Cancelado': 'status-cancelado'
    };
    return classes[status] || 'status-pendente';
}

function formatDate(dateString) {
    if (!dateString) return '-';
    
    try {
        const date = new Date(dateString);
        return date.toLocaleDateString('pt-BR');
    } catch (error) {
        return '-';
    }
}

function showLoading() {
    isLoading = true;
    document.getElementById('loading').style.display = 'flex';
}

function hideLoading() {
    isLoading = false;
    document.getElementById('loading').style.display = 'none';
}

function updateDebugInfo(message) {
    if (debugMode) {
        document.getElementById('debug-last-action').textContent = message;
    }
}

// === SISTEMA DE TOAST ===
function showToast(message, type = 'info') {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;
    
    container.appendChild(toast);
    
    // Remover após 4 segundos
    setTimeout(() => {
        toast.remove();
    }, 4000);
}

// === EXPORTAÇÃO DE DADOS ===
function exportarDados() {
    try {
        if (solicitacoes.length === 0) {
            showToast('Nenhum dado para exportar', 'warning');
            return;
        }
        
        // Criar CSV
        const headers = ['ID', 'Solicitante', 'Cliente', 'Projeto', 'Status', 'Data', 'Descrição'];
        const csvContent = [
            headers.join(','),
            ...solicitacoes.map(item => [
                item.id,
                `"${item.solicitante}"`,
                `"${item.cliente}"`,
                `"${item.servico}"`,
                `"${item.status}"`,
                formatDate(item.data),
                `"${item.descricao?.replace(/"/g, '""') || ''}"`
            ].join(','))
        ].join('\n');
        
        // Download
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `propostas-${new Date().toISOString().split('T')[0]}.csv`;
        link.click();
        
        showToast('Dados exportados com sucesso!', 'success');
    } catch (error) {
        console.error('❌ Erro ao exportar:', error);
        showToast('Erro ao exportar dados', 'error');
    }
}

// === FUNÇÕES DO FORMULÁRIO ===
function toggleOutroSolicitante() {
    const solicitante = document.getElementById('solicitante').value;
    const campoOutro = document.getElementById('campo-outro-solicitante');
    
    if (solicitante === 'Outros (especificar)') {
        campoOutro.style.display = 'block';
        document.getElementById('outro-solicitante').required = true;
    } else {
        campoOutro.style.display = 'none';
        document.getElementById('outro-solicitante').required = false;
        document.getElementById('outro-solicitante').value = '';
    }
}

function limparFormulario() {
    document.getElementById('form-solicitacao').reset();
    document.getElementById('campo-outro-solicitante').style.display = 'none';
    document.getElementById('outro-solicitante').required = false;
    showToast('Formulário limpo', 'info');
}
