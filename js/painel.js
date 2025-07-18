// === FUNÇÕES DO PAINEL DE ACOMPANHAMENTO ===

// Carregar solicitações
async function loadSolicitacoes() {
    try {
        console.log('📋 Carregando solicitações...');
        showLoading();
        
        const response = await apiCall('listar');
        
        // Aceitar tanto response.data quanto response.dados para compatibilidade
        const dados = response?.data || response?.dados || [];
        
        // Aceitar tanto success quanto sucesso para compatibilidade
        const isSuccess = response?.success || response?.sucesso || false;
        
        if (response && isSuccess && Array.isArray(dados)) {
            solicitacoes = dados;
            
            // Debug específico para prazos
            console.log('🔍 DEBUG PRAZOS:');
            dados.forEach((item, index) => {
                console.log(`  Item ${index + 1} (ID: ${item.id}):`, {
                    prazo: item.prazo,
                    tipo: typeof item.prazo,
                    status: item.status,
                    data: item.data
                });
            });
            
            renderSolicitacoes();
            console.log('✅ Solicitações carregadas:', solicitacoes.length);
            showToast(`${solicitacoes.length} solicitações carregadas`, 'success');
        } else {
            console.log('⚠️ Resposta recebida:', JSON.stringify(response, null, 2));
            console.log('⚠️ Dados extraídos:', JSON.stringify(dados, null, 2));
            console.log('⚠️ Success flag:', isSuccess);
            throw new Error('Dados inválidos recebidos');
        }
    } catch (error) {
        console.error('❌ Erro ao carregar solicitações:', error);
        solicitacoes = [];
        renderSolicitacoes();
    } finally {
        hideLoading();
    }
}

// Renderizar tabela de solicitações
function renderSolicitacoes() {
    const tbody = document.getElementById('tabela-solicitacoes');
    if (!tbody) return;
    
    if (solicitacoes.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="8" class="text-center text-muted">
                    Nenhuma solicitação encontrada
                </td>
            </tr>
        `;
        return;
    }
    
    tbody.innerHTML = solicitacoes.map(item => {
        // Debug para prazo
        console.log(`🔍 Processando item ${item.id}: prazo="${item.prazo}", tipo=${typeof item.prazo}`);
        
        // Formatação melhorada para prazo
        let prazoFormatado = '-';
        if (item.prazo) {
            // Se o prazo parece ser uma data, formatar
            if (item.prazo.includes('-') || item.prazo.includes('/') || /\d{4}/.test(item.prazo)) {
                prazoFormatado = formatDate(item.prazo);
            } else {
                // Se não é uma data, mostrar como texto
                prazoFormatado = item.prazo;
            }
        }
        
        return `
        <tr data-id="${item.id}">
            <td>${item.id || '-'}</td>
            <td>${item.cliente || '-'}</td>
            <td>${item.servico || '-'}</td>
            <td>${item.solicitante || '-'}</td>
            <td>
                <span class="status-badge ${getStatusClass(item.status)}">
                    ${item.status || 'Pendente'}
                </span>
            </td>
            <td>${formatDate(item.data) || '-'}</td>
            <td style="font-weight: ${prazoFormatado !== '-' ? 'bold' : 'normal'}; color: ${prazoFormatado !== '-' ? '#2c5aa0' : '#999'};">
                ${prazoFormatado}
            </td>
            <td>
                <select class="form-control" onchange="updateStatus('${item.id}', this.value)">
                    <option value="Pendente" ${item.status === 'Pendente' ? 'selected' : ''}>Pendente</option>
                    <option value="Em Andamento" ${item.status === 'Em Andamento' ? 'selected' : ''}>Em Andamento</option>
                    <option value="Concluído" ${item.status === 'Concluído' ? 'selected' : ''}>Concluído</option>
                    <option value="Cancelado" ${item.status === 'Cancelado' ? 'selected' : ''}>Cancelado</option>
                </select>
            </td>
        </tr>
    `;
    }).join('');
}

// Atualizar apenas uma linha específica da tabela
function updateSingleRow(id, item) {
    const tbody = document.getElementById('tabela-solicitacoes');
    if (!tbody) return false;
    
    const row = tbody.querySelector(`tr[data-id="${id}"]`);
    if (!row) return false;
    
    // Formatação melhorada para prazo
    let prazoFormatado = '-';
    if (item.prazo) {
        // Se o prazo parece ser uma data, formatar
        if (item.prazo.includes('-') || item.prazo.includes('/') || /\d{4}/.test(item.prazo)) {
            prazoFormatado = formatDate(item.prazo);
        } else {
            // Se não é uma data, mostrar como texto
            prazoFormatado = item.prazo;
        }
    }
    
    row.innerHTML = `
        <td>${item.id || '-'}</td>
        <td>${item.cliente || '-'}</td>
        <td>${item.servico || '-'}</td>
        <td>${item.solicitante || '-'}</td>
        <td>
            <span class="status-badge ${getStatusClass(item.status)}">
                ${item.status || 'Pendente'}
            </span>
        </td>
        <td>${formatDate(item.data) || '-'}</td>
        <td style="font-weight: ${prazoFormatado !== '-' ? 'bold' : 'normal'}; color: ${prazoFormatado !== '-' ? '#2c5aa0' : '#999'};">
            ${prazoFormatado}
        </td>
        <td>
            <select class="form-control" onchange="updateStatus('${item.id}', this.value)">
                <option value="Pendente" ${item.status === 'Pendente' ? 'selected' : ''}>Pendente</option>
                <option value="Em Andamento" ${item.status === 'Em Andamento' ? 'selected' : ''}>Em Andamento</option>
                <option value="Concluído" ${item.status === 'Concluído' ? 'selected' : ''}>Concluído</option>
                <option value="Cancelado" ${item.status === 'Cancelado' ? 'selected' : ''}>Cancelado</option>
            </select>
        </td>
    `;
    
    return true;
}

// === FUNÇÕES DE STATUS ===
async function updateStatus(id, novoStatus) {
    try {
        console.log(`🔄 Atualizando status: ${id} -> ${novoStatus}`);
        console.log('🔍 Solicitações atuais:', solicitacoes);
        console.log('🔍 Procurando item com ID:', id, 'tipo:', typeof id);
        
        const response = await apiCall('atualizar', {
            id: id,
            status: novoStatus
        });
        
        console.log('📡 Resposta da API:', JSON.stringify(response, null, 2));
        
        // Verificar tanto success quanto sucesso para compatibilidade
        const isSuccess = response?.success || response?.sucesso || false;
        
        if (response && isSuccess) {
            console.log('✅ Status atualizado no servidor');
            showToast('Status atualizado com sucesso!', 'success');
            
            // Atualizar dados locais
            console.log('🔍 Buscando item para atualizar localmente...');
            const item = solicitacoes.find(s => {
                console.log('🔍 Comparando:', s.id, 'com', id, 'tipos:', typeof s.id, typeof id);
                return s.id == id; // Usar == para comparação mais flexível
            });
            
            if (item) {
                console.log('✅ Item encontrado, atualizando:', item);
                const statusAnterior = item.status;
                item.status = novoStatus;
                console.log(`✅ Status local atualizado de "${statusAnterior}" para "${item.status}"`);
                
                // Tentar atualizar apenas a linha específica
                const linhaAtualizada = updateSingleRow(id, item);
                if (linhaAtualizada) {
                    console.log('✅ Linha específica atualizada com sucesso');
                } else {
                    console.log('⚠️ Linha específica não encontrada, re-renderizando tabela completa');
                    renderSolicitacoes();
                }
                
                console.log('✅ Atualização visual concluída');
            } else {
                console.error('❌ Item não encontrado na lista local');
                console.log('📊 IDs disponíveis:', solicitacoes.map(s => `${s.id} (${typeof s.id})`).join(', '));
                
                // Fallback: recarregar dados do servidor
                console.log('🔄 Recarregando dados do servidor...');
                await loadSolicitacoes();
            }
            
            // Atualizar estatísticas se estivermos na dashboard
            if (currentPage === 'dashboard') {
                loadDashboardData();
            }
        } else {
            throw new Error(response?.message || response?.mensagem || 'Erro ao atualizar status');
        }
    } catch (error) {
        console.error('❌ Erro ao atualizar status:', error);
        showToast('Erro ao atualizar status', 'error');
        
        // Recarregar para reverter mudança
        loadSolicitacoes();
    }
}
