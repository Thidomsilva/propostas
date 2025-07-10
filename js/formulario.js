// === FUNÇÕES DO FORMULÁRIO ===

function setupForm() {
    const form = document.getElementById('form-solicitacao');
    if (!form) return; // Form ainda não carregado
    
    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        if (isLoading) return;
        
        try {
            console.log('📝 Enviando formulário...');
            showLoading();
            
            // Coletar dados do formulário
            const formData = new FormData(form);
            
            // Tratar o campo solicitante especial
            let solicitante = formData.get('solicitante');
            if (solicitante === 'Outros (especificar)') {
                const outroSolicitante = formData.get('outro-solicitante');
                if (!outroSolicitante || outroSolicitante.trim() === '') {
                    throw new Error('Por favor, especifique o nome do solicitante');
                }
                solicitante = outroSolicitante.trim();
            }
            
            const dados = {
                id: 'SOL_' + Date.now(),
                cliente: formData.get('cliente'),
                servico: formData.get('servico'),
                solicitante: solicitante,
                descricao: formData.get('descricao'),
                prazo: formData.get('prazo'),
                observacoes: formData.get('observacoes'),
                status: 'Pendente',
                data: new Date().toISOString()
            };
            
            console.log('📊 Dados a enviar:', dados);
            
            // Validar dados
            if (!dados.cliente || !dados.servico || !dados.solicitante || !dados.descricao) {
                throw new Error('Preencha todos os campos obrigatórios');
            }
            
            // Enviar para API
            const response = await apiCall('criar', dados);
            
            console.log('📡 Resposta completa da API:', JSON.stringify(response, null, 2));
            
            // Verificar tanto success quanto sucesso para compatibilidade
            const isSuccess = response?.success || response?.sucesso || false;
            
            console.log('🔍 Verificação de sucesso:', {
                'response.success': response?.success,
                'response.sucesso': response?.sucesso,
                'isSuccess': isSuccess
            });
            
            if (response && isSuccess) {
                console.log('✅ Solicitação criada com sucesso');
                showToast('✅ Solicitação enviada! Um e-mail foi enviado para thiago@sagacy.com.br', 'success');
                form.reset();
                
                // Esconder campo "outro" após reset
                const campoOutro = document.getElementById('campo-outro-solicitante');
                if (campoOutro) {
                    campoOutro.style.display = 'none';
                }
                
                // Navegar para o painel
                console.log('🔄 Iniciando navegação para o painel em 2 segundos...');
                setTimeout(() => {
                    console.log('📋 Executando showPainel()...');
                    
                    // Forçar navegação direta
                    if (typeof showPainel === 'function') {
                        showPainel();
                    } else {
                        console.error('❌ Função showPainel não encontrada, tentando navegação manual...');
                        // Navegação manual de fallback
                        const painelPage = document.getElementById('painel');
                        const formularioPage = document.getElementById('formulario');
                        
                        if (painelPage && formularioPage) {
                            // Esconder formulário
                            formularioPage.classList.add('d-none');
                            formularioPage.style.display = 'none';
                            
                            // Mostrar painel
                            painelPage.classList.remove('d-none');
                            painelPage.style.display = 'block';
                            
                            // Ativar botão do painel
                            const buttons = document.querySelectorAll('.nav-button');
                            buttons.forEach(btn => btn.classList.remove('active'));
                            if (buttons[1]) buttons[1].classList.add('active');
                            
                            // Carregar dados do painel
                            if (typeof loadSolicitacoes === 'function') {
                                loadSolicitacoes();
                            }
                            
                            console.log('✅ Navegação manual para painel executada');
                        } else {
                            console.error('❌ Elementos de página não encontrados');
                        }
                    }
                }, 2000); // Aumentar tempo para ler a mensagem
            } else {
                console.error('❌ Resposta indica falha:', response);
                throw new Error(response?.message || response?.mensagem || 'Erro ao criar solicitação');
            }
        } catch (error) {
            console.error('❌ Erro ao enviar formulário:', error);
            showToast(error.message || 'Erro ao criar solicitação', 'error');
        } finally {
            hideLoading();
        }
    });
}

// Função para mostrar/esconder campo "outro solicitante"
function toggleOutroSolicitante() {
    const select = document.getElementById('solicitante');
    const campoOutro = document.getElementById('campo-outro-solicitante');
    const inputOutro = document.getElementById('outro-solicitante');
    
    if (!select || !campoOutro || !inputOutro) return;
    
    if (select.value === 'Outros (especificar)') {
        campoOutro.style.display = 'block';
        inputOutro.required = true;
        inputOutro.focus();
    } else {
        campoOutro.style.display = 'none';
        inputOutro.required = false;
        inputOutro.value = '';
    }
}
