// === INICIALIZAÇÃO OTIMIZADA ===
// Garante que todos os componentes sejam carregados antes da aplicação iniciar

let appInitialized = false;

async function initializeApp() {
    if (appInitialized) return;
    
    console.log('🚀 Inicializando aplicação Sagacy...');
    
    try {
        // 1. Aguardar DOM
        await waitForDOM();
        
        // 2. Carregar componentes
        await loadRequiredComponents();
        
        // 3. Inicializar aplicação
        await setupApplication();
        
        appInitialized = true;
        console.log('✅ Aplicação inicializada com sucesso!');
        
    } catch (error) {
        console.error('❌ Erro na inicialização:', error);
        showFallbackInterface();
    }
}

function waitForDOM() {
    return new Promise((resolve) => {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', resolve);
        } else {
            resolve();
        }
    });
}

async function loadRequiredComponents() {
    console.log('📦 Carregando componentes essenciais...');
    
    const components = [
        { path: './components/dashboard.html', target: '#dashboard', name: 'Dashboard' },
        { path: './components/formulario.html', target: '#formulario', name: 'Formulário' },
        { path: './components/painel.html', target: '#painel', name: 'Painel' }
    ];
    
    for (const component of components) {
        try {
            const response = await fetch(component.path);
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}`);
            }
            
            const html = await response.text();
            const target = document.querySelector(component.target);
            
            if (target) {
                target.innerHTML = html;
                console.log(`✅ ${component.name} carregado`);
            } else {
                console.warn(`⚠️ Target não encontrado: ${component.target}`);
            }
            
        } catch (error) {
            console.error(`❌ Erro ao carregar ${component.name}:`, error);
            
            // Fallback para componentes essenciais
            if (component.name === 'Dashboard') {
                createFallbackDashboard();
            }
        }
    }
    
    // Aguardar renderização
    await new Promise(resolve => setTimeout(resolve, 500));
}

function createFallbackDashboard() {
    console.log('🔄 Criando dashboard fallback...');
    
    const dashboard = document.getElementById('dashboard');
    if (dashboard) {
        dashboard.innerHTML = `
            <div class="card">
                <div class="card-header">
                    <h2 class="card-title">Dashboard</h2>
                    <div class="last-refresh" id="last-refresh">Sistema inicializado</div>
                </div>
                
                <div class="kpi-grid">
                    <div class="kpi-card">
                        <div class="kpi-icon">📈</div>
                        <div class="kpi-content">
                            <div class="kpi-number" id="kpi-mes">0</div>
                            <div class="kpi-label">Solicitações este Mês</div>
                            <div class="kpi-trend" id="kpi-mes-trend">-</div>
                        </div>
                    </div>
                    
                    <div class="kpi-card">
                        <div class="kpi-icon">⏱️</div>
                        <div class="kpi-content">
                            <div class="kpi-number" id="kpi-tempo">-</div>
                            <div class="kpi-label">Tempo Médio</div>
                            <div class="kpi-trend" id="kpi-tempo-trend">-</div>
                        </div>
                    </div>
                    
                    <div class="kpi-card">
                        <div class="kpi-icon">✅</div>
                        <div class="kpi-content">
                            <div class="kpi-number" id="kpi-taxa">0%</div>
                            <div class="kpi-label">Taxa de Finalização</div>
                            <div class="kpi-trend" id="kpi-taxa-trend">-</div>
                        </div>
                    </div>
                </div>
                
                <div class="performance-grid">
                    <div class="performance-card">
                        <h3>🏆 Ranking de Solicitantes</h3>
                        <div class="ranking-list" id="ranking-solicitantes">
                            <div class="loading-message">Carregando ranking...</div>
                        </div>
                    </div>
                    
                    <div class="performance-card">
                        <h3>📊 Serviços Mais Solicitados</h3>
                        <div class="services-chart" id="services-chart">
                            <div class="loading-message">Carregando dados...</div>
                        </div>
                    </div>
                </div>
                
                <div class="performance-grid">
                    <div class="performance-card">
                        <h3>Distribuição por Status</h3>
                        <div class="status-chart">
                            <div class="status-item">
                                <div class="status-label">Em Andamento</div>
                                <div class="status-bar-container">
                                    <div class="status-bar status-andamento" id="bar-andamento"></div>
                                </div>
                                <div class="status-percent" id="percent-andamento">0%</div>
                            </div>
                            <div class="status-item">
                                <div class="status-label">Finalizado</div>
                                <div class="status-bar-container">
                                    <div class="status-bar status-finalizado" id="bar-finalizado"></div>
                                </div>
                                <div class="status-percent" id="percent-finalizado">0%</div>
                            </div>
                            <div class="status-item">
                                <div class="status-label">Aberto</div>
                                <div class="status-bar-container">
                                    <div class="status-bar status-aberto" id="bar-aberto"></div>
                                </div>
                                <div class="status-percent" id="percent-aberto">0%</div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="performance-card">
                        <h3>Volume Mensal</h3>
                        <div class="monthly-chart" id="monthly-chart">
                            <div class="loading-message">Carregando dados mensais...</div>
                        </div>
                    </div>
                </div>
                
                <div class="dashboard-controls">
                    <button class="btn btn-primary" onclick="loadDashboardData()">
                        🔄 Atualizar Dashboard
                    </button>
                    <button class="btn btn-secondary" onclick="exportarRelatorio()">
                        📊 Exportar Relatório
                    </button>
                </div>
            </div>
        `;
        
        console.log('✅ Dashboard fallback criado');
    }
}

async function setupApplication() {
    console.log('⚙️ Configurando aplicação...');
    
    // Configurar modo debug
    const debugMode = window.location.href.includes('debug=true');
    if (debugMode) {
        const debugInfo = document.getElementById('debug-info');
        if (debugInfo) debugInfo.classList.add('show');
    }
    
    // Configurar formulário
    if (typeof setupForm === 'function') {
        setupForm();
    }
    
    // Inicializar na página de formulário
    hideLoading();
    showFormulario();
    
    // Configurar auto-refresh para dashboard
    if (typeof startDashboardAutoRefresh === 'function') {
        console.log('🔄 Configurando auto-refresh do dashboard...');
    }
}

function showFallbackInterface() {
    console.log('🔄 Mostrando interface de fallback...');
    
    hideLoading();
    const formulario = document.getElementById('formulario');
    if (formulario) {
        formulario.classList.remove('d-none');
    }
    
    showToast('Sistema inicializado com funcionalidades básicas', 'warning');
}

// Auto-inicialização
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeApp);
} else {
    initializeApp();
}

// Exportar para uso global
window.sagacyApp = {
    initializeApp,
    loadRequiredComponents,
    createFallbackDashboard
};
