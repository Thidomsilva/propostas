// ====================================================================
// COMPONENT LOADER - Carrega componentes HTML externos
// ====================================================================

/**
 * Carrega um componente HTML externo e injeta no elemento especificado
 * @param {string} componentPath - Caminho para o arquivo do componente
 * @param {string} targetSelector - Seletor CSS do elemento onde inserir
 * @returns {Promise} - Promise que resolve quando o componente é carregado
 */
async function loadComponent(componentPath, targetSelector) {
    try {
        const response = await fetch(componentPath);
        if (!response.ok) {
            throw new Error(`Erro ao carregar componente: ${response.status}`);
        }
        
        const html = await response.text();
        const targetElement = document.querySelector(targetSelector);
        
        if (!targetElement) {
            throw new Error(`Elemento não encontrado: ${targetSelector}`);
        }
        
        targetElement.innerHTML = html;
        console.log(`✅ Componente carregado: ${componentPath}`);
        
        return true;
    } catch (error) {
        console.error(`❌ Erro ao carregar componente ${componentPath}:`, error);
        return false;
    }
}

/**
 * Carrega todos os componentes da aplicação
 */
async function loadAllComponents() {
    console.log('🔄 Carregando componentes...');
    
    const componentsToLoad = [
        { path: './components/header.html', target: 'header' },
        { path: './components/formulario.html', target: '#formulario' },
        { path: './components/dashboard.html', target: '#dashboard' },
        { path: './components/painel.html', target: '#painel' }
    ];
    
    const promises = componentsToLoad.map(component => 
        loadComponent(component.path, component.target)
    );
    
    try {
        const results = await Promise.all(promises);
        const successCount = results.filter(result => result).length;
        
        console.log(`✅ Componentes carregados: ${successCount}/${componentsToLoad.length}`);
        
        if (successCount === componentsToLoad.length) {
            console.log('🎉 Todos os componentes foram carregados com sucesso!');
        } else {
            console.warn('⚠️ Alguns componentes falharam ao carregar');
        }
        
        return successCount === componentsToLoad.length;
    } catch (error) {
        console.error('❌ Erro geral ao carregar componentes:', error);
        return false;
    }
}

/**
 * Recarrega um componente específico
 * @param {string} componentName - Nome do componente (header, formulario, dashboard, painel)
 */
async function reloadComponent(componentName) {
    const componentMap = {
        'header': { path: './components/header.html', target: 'header' },
        'formulario': { path: './components/formulario.html', target: '#formulario' },
        'dashboard': { path: './components/dashboard.html', target: '#dashboard' },
        'painel': { path: './components/painel.html', target: '#painel' }
    };
    
    const component = componentMap[componentName];
    if (!component) {
        console.error(`❌ Componente não encontrado: ${componentName}`);
        return false;
    }
    
    console.log(`🔄 Recarregando componente: ${componentName}`);
    return await loadComponent(component.path, component.target);
}

// Export para uso em outros arquivos
if (typeof window !== 'undefined') {
    window.componentLoader = {
        loadComponent,
        loadAllComponents,
        reloadComponent
    };
}

// Auto-inicialização quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 Inicializando carregador de componentes...');
    loadAllComponents();
});
