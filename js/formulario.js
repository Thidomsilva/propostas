// === FUNÇÕES DO FORMULÁRIO ===

function setupForm() {
    const form = document.getElementById('form-solicitacao');
    if (!form) return; // Form ainda não carregado
    
    // IMPORTANTE: Remover listeners antigos para evitar duplicação
    const newForm = form.cloneNode(true);
    form.parentNode.replaceChild(newForm, form);
    
    // Reconfigurar referência
    const cleanForm = document.getElementById('form-solicitacao');
    
    cleanForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        // PROTEÇÃO MÚLTIPLA CONTRA DUPLO ENVIO
        if (isLoading) {
            console.log('⚠️ Já está enviando, ignorando nova tentativa');
            return;
        }
        
        // Verificar se já há um envio muito recente
        const agora = Date.now();
        if (window.ultimoEnvio && (agora - window.ultimoEnvio) < 3000) { // 3 segundos
            console.log('⚠️ Envio muito recente, aguarde 3 segundos');
            showToast('⚠️ Aguarde alguns segundos antes de enviar novamente', 'warning');
            return;
        }
        
        // Marcar último envio
        window.ultimoEnvio = agora;
        
        // Desabilitar o botão submit para prevenir duplo envio
        const submitButton = cleanForm.querySelector('button[type="submit"]');
        const originalText = submitButton?.textContent || 'Enviar';
        if (submitButton) {
            submitButton.disabled = true;
            submitButton.textContent = 'Enviando...';
        }
        
        try {
            console.log('📝 Enviando formulário...');
            showLoading();
            
            // Coletar dados do formulário
            const formData = new FormData(cleanForm);
            
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
                cleanForm.reset();
                
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
                
                // Verificar se é erro de duplicação
                const mensagem = response?.message || response?.mensagem || 'Erro ao criar solicitação';
                if (mensagem.includes('duplicada') || mensagem.includes('idêntica')) {
                    console.log('⚠️ Aviso de duplicação detectado');
                    
                    // Mesmo com aviso de duplicação, tratar como sucesso se chegou até aqui
                    // (porque o backend já criou a solicitação e enviou o email)
                    showToast('✅ Solicitação processada! Verificando no painel...', 'success');
                    cleanForm.reset();
                    
                    // Esconder campo "outro" após reset
                    const campoOutro = document.getElementById('campo-outro-solicitante');
                    if (campoOutro) {
                        campoOutro.style.display = 'none';
                    }
                    
                    // Navegar para o painel
                    setTimeout(() => {
                        if (typeof showPainel === 'function') {
                            showPainel();
                        }
                    }, 2000);
                } else {
                    throw new Error(mensagem);
                }
            }
        } catch (error) {
            console.error('❌ Erro ao enviar formulário:', error);
            
            // Verificar se é erro de duplicação no catch também
            const mensagem = error.message || 'Erro ao criar solicitação';
            if (mensagem.includes('duplicada') || mensagem.includes('idêntica')) {
                console.log('⚠️ Erro de duplicação no catch, tratando como sucesso');
                
                // Tratar como sucesso (email foi enviado, dados foram salvos)
                showToast('✅ Solicitação processada! Redirecionando...', 'success');
                cleanForm.reset();
                
                // Esconder campo "outro" após reset
                const campoOutro = document.getElementById('campo-outro-solicitante');
                if (campoOutro) {
                    campoOutro.style.display = 'none';
                }
                
                // Navegar para o painel
                setTimeout(() => {
                    if (typeof showPainel === 'function') {
                        showPainel();
                    }
                }, 2000);
            } else {
                showToast('❌ ' + mensagem, 'error');
            }
        } finally {
            hideLoading();
            
            // Reabilitar o botão submit sempre
            if (submitButton) {
                submitButton.disabled = false;
                submitButton.textContent = originalText;
            }
            
            // Limpar bloqueio de tempo após 5 segundos
            setTimeout(() => {
                if (window.ultimoEnvio && (Date.now() - window.ultimoEnvio) >= 5000) {
                    window.ultimoEnvio = null;
                }
            }, 5000);
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

// Função para verificar se a solicitação foi realmente criada (usado em casos de "duplicação")
async function verificarUltimaSolicitacao(dados) {
    try {
        console.log('🔍 Verificando se solicitação foi realmente criada...');
        
        const response = await fetch(`${API_CONFIG.BASE_URL}?action=listar&_=${Date.now()}`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        });
        
        const resultado = await response.json();
        
        if (resultado.sucesso && resultado.dados && resultado.dados.length > 0) {
            // Verificar se a última solicitação corresponde aos dados enviados
            const ultima = resultado.dados[resultado.dados.length - 1];
            
            if (ultima.cliente === dados.cliente && 
                ultima.servico === dados.servico && 
                ultima.solicitante === dados.solicitante &&
                ultima.descricao === dados.descricao) {
                
                console.log('✅ Solicitação foi criada com sucesso (confirmado)');
                return true;
            }
        }
        
        return false;
    } catch (error) {
        console.error('❌ Erro ao verificar última solicitação:', error);
        return false;
    }
}
