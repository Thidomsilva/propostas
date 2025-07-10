// === TESTE DIRETO NO CONSOLE ===
// Cole este código no console do navegador (F12) quando estiver no index.html

console.log('🧪 Iniciando teste de navegação direto...');

// Teste 1: Verificar se os elementos existem
console.log('🔍 Verificando elementos...');
const formulario = document.getElementById('formulario');
const painel = document.getElementById('painel');
const dashboard = document.getElementById('dashboard');

console.log('📄 Formulário encontrado:', !!formulario);
console.log('📄 Painel encontrado:', !!painel);
console.log('📄 Dashboard encontrado:', !!dashboard);

// Teste 2: Verificar funções
console.log('🔍 Verificando funções...');
console.log('🔧 showFormulario:', typeof showFormulario);
console.log('🔧 showPainel:', typeof showPainel);
console.log('🔧 showDashboard:', typeof showDashboard);
console.log('🔧 switchPage:', typeof switchPage);

// Teste 3: Verificar estado atual
console.log('🔍 Estado atual das páginas...');
if (formulario) {
    const computedStyle = window.getComputedStyle(formulario);
    console.log('📝 Formulário - display:', computedStyle.display, 'classes:', formulario.className);
}
if (painel) {
    const computedStyle = window.getComputedStyle(painel);
    console.log('📋 Painel - display:', computedStyle.display, 'classes:', painel.className);
}
if (dashboard) {
    const computedStyle = window.getComputedStyle(dashboard);
    console.log('📊 Dashboard - display:', computedStyle.display, 'classes:', dashboard.className);
}

// Teste 4: Tentar navegação manual
console.log('🔄 Tentando navegação manual para painel...');
if (painel && formulario) {
    // Esconder formulário
    formulario.classList.add('d-none');
    formulario.style.display = 'none';
    
    // Mostrar painel
    painel.classList.remove('d-none');
    painel.style.display = 'block';
    
    // Ativar botão
    const buttons = document.querySelectorAll('.nav-button');
    buttons.forEach(btn => btn.classList.remove('active'));
    if (buttons[1]) {
        buttons[1].classList.add('active');
    }
    
    console.log('✅ Navegação manual executada');
    
    // Verificar resultado
    setTimeout(() => {
        const painelStyle = window.getComputedStyle(painel);
        console.log('🔍 Resultado - Painel display:', painelStyle.display);
        console.log('🔍 Resultado - Painel classes:', painel.className);
    }, 100);
} else {
    console.log('❌ Elementos não encontrados para navegação manual');
}

console.log('🎯 Teste concluído. Verifique os logs acima.');
