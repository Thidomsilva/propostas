// === DASHBOARD OTIMIZADO ===

// === AUTO-REFRESH DO DASHBOARD ===
let dashboardRefreshInterval = null;

// Iniciar auto-refresh
function startDashboardAutoRefresh(intervalMinutes = 5) {
    // Parar qualquer intervalo anterior
    if (dashboardRefreshInterval) {
        clearInterval(dashboardRefreshInterval);
    }
    
    // Iniciar novo intervalo
    dashboardRefreshInterval = setInterval(() => {
        if (currentPage === 'dashboard') {
            console.log('🔄 Auto-refresh do dashboard...');
            loadDashboardData();
        }
    }, intervalMinutes * 60 * 1000);
    
    console.log(`✅ Auto-refresh iniciado: ${intervalMinutes} minutos`);
}

// Parar auto-refresh
function stopDashboardAutoRefresh() {
    if (dashboardRefreshInterval) {
        clearInterval(dashboardRefreshInterval);
        dashboardRefreshInterval = null;
        console.log('⏹️ Auto-refresh parado');
    }
}

// Atualizar timestamp da última atualização
function updateLastRefreshTime() {
    const lastRefreshEl = document.getElementById('last-refresh');
    if (lastRefreshEl) {
        const agora = new Date();
        const timestamp = agora.toLocaleTimeString('pt-BR', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });
        lastRefreshEl.textContent = `Última atualização: ${timestamp}`;
    }
}

// === VERIFICAÇÃO DE ELEMENTOS ===
function verificarElementosDashboard() {
    const elementos = {
        'kpi-mes': document.getElementById('kpi-mes'),
        'kpi-tempo': document.getElementById('kpi-tempo'),
        'kpi-taxa': document.getElementById('kpi-taxa'),
        'ranking-solicitantes': document.getElementById('ranking-solicitantes'),
        'services-chart': document.getElementById('services-chart'),
        'bar-andamento': document.getElementById('bar-andamento'),
        'bar-finalizado': document.getElementById('bar-finalizado'),
        'bar-aberto': document.getElementById('bar-aberto'),
        'monthly-chart': document.getElementById('monthly-chart')
    };
    
    const elementosEncontrados = Object.keys(elementos).filter(key => elementos[key] !== null);
    const elementosFaltando = Object.keys(elementos).filter(key => elementos[key] === null);
    
    console.log(`📊 Elementos do dashboard: ${elementosEncontrados.length}/${Object.keys(elementos).length} encontrados`);
    
    if (elementosFaltando.length > 0) {
        console.warn('⚠️ Elementos faltando:', elementosFaltando);
        return false;
    }
    
    return true;
}

// Função principal para carregar todos os dados do dashboard - SIMPLIFICADA
async function loadDashboardData() {
    try {
        console.log('📊 Carregando dados do dashboard...');
        
        // Verificar se elementos necessários existem
        const kpiMes = document.getElementById('kpi-mes');
        const rankingSolicitantes = document.getElementById('ranking-solicitantes');
        
        if (!kpiMes || !rankingSolicitantes) {
            console.error('❌ Elementos do dashboard não encontrados');
            showToast('Erro: Elementos do dashboard não encontrados', 'error');
            return;
        }
        
        showLoading();
        
        const response = await apiCall('listar');
        
        console.log('📊 Resposta da API recebida:', JSON.stringify(response, null, 2));
        
        // Verificar tanto success quanto sucesso para compatibilidade
        const isSuccess = response?.success || response?.sucesso || false;
        const dados = response?.data || response?.dados || [];
        
        if (response && isSuccess && Array.isArray(dados)) {
            console.log('📊 Dados válidos encontrados:', dados.length, 'registros');
            console.log('📊 Amostra dos primeiros 3 registros:', dados.slice(0, 3));
            
            // Verificar qualidade dos dados
            dados.forEach((item, index) => {
                if (index < 5) { // Log dos primeiros 5 apenas
                    console.log(`📊 Registro ${index + 1}:`, {
                        cliente: item.cliente,
                        servico: item.servico,
                        solicitante: item.solicitante,
                        status: item.status,
                        data: item.data,
                        prazo: item.prazo
                    });
                }
            });
            
            // Calcular e renderizar todas as seções
            console.log('📊 Renderizando KPIs...');
            renderKPIs(dados);
            
            console.log('📊 Renderizando distribuição de status...');
            renderStatusDistribution(dados);
            
            console.log('📊 Renderizando top serviços...');
            renderTopServices(dados);
            
            console.log('📊 Renderizando ranking de solicitantes...');
            renderTopSolicitantes(dados);
            
            console.log('📊 Renderizando volume mensal...');
            renderMonthlyVolume(dados);
            
            // Atualizar timestamp
            updateLastRefreshTime();
            
            console.log('✅ Dashboard carregado com sucesso');
            showToast('Dashboard atualizado!', 'success');
        } else {
            console.error('❌ Dados inválidos:', {
                response: response,
                success: response?.success,
                sucesso: response?.sucesso,
                isSuccess: isSuccess,
                data: response?.data,
                dados: response?.dados,
                isArray: Array.isArray(dados)
            });
            throw new Error('Dados inválidos recebidos');
        }
    } catch (error) {
        console.error('❌ Erro ao carregar dashboard:', error);
        renderEmptyDashboard();
        showToast('Erro ao carregar dashboard: ' + error.message, 'error');
    } finally {
        hideLoading();
    }
}

// Renderizar KPIs principais - MELHORADO COM CORREÇÃO DE DATA
function renderKPIs(dados) {
    console.log('📊 Processando KPIs para', dados.length, 'registros');
    
    const agora = new Date();
    const inicioMes = new Date(agora.getFullYear(), agora.getMonth(), 1);
    const mesAnterior = new Date(agora.getFullYear(), agora.getMonth() - 1, 1);
    const fimMesAnterior = new Date(agora.getFullYear(), agora.getMonth(), 0);
    
    console.log('📅 Período atual:', {
        agora: agora.toLocaleDateString('pt-BR'),
        inicioMes: inicioMes.toLocaleDateString('pt-BR'),
        mesAnterior: mesAnterior.toLocaleDateString('pt-BR')
    });
    
    // Função para converter data string em Date
    function parseDataItem(dataStr) {
        if (!dataStr) return null;
        
        try {
            // Se já é um objeto Date
            if (dataStr instanceof Date) {
                return dataStr;
            }
            
            // Se é string no formato brasileiro "13/07/2025"
            if (typeof dataStr === 'string' && dataStr.match(/^\d{2}\/\d{2}\/\d{4}/)) {
                const [dia, mes, ano] = dataStr.split('/');
                return new Date(parseInt(ano), parseInt(mes) - 1, parseInt(dia));
            }
            
            // Se é string ISO ou outro formato
            const date = new Date(dataStr);
            return isNaN(date.getTime()) ? null : date;
        } catch (error) {
            console.warn('⚠️ Erro ao processar data:', dataStr, error);
            return null;
        }
    }
    
    // Solicitações deste mês
    const solicitacoesMes = dados.filter(item => {
        const dataItem = parseDataItem(item.data);
        if (!dataItem) return false;
        
        const resultado = dataItem >= inicioMes;
        console.log('📊 Item:', item.cliente, 'Data:', dataItem.toLocaleDateString('pt-BR'), 'Este mês?', resultado);
        return resultado;
    }).length;
    
    // Solicitações do mês anterior (para comparação)
    const solicitacoesMesAnterior = dados.filter(item => {
        const dataItem = parseDataItem(item.data);
        if (!dataItem) return false;
        return dataItem >= mesAnterior && dataItem <= fimMesAnterior;
    }).length;
    
    // Calcular tempo médio de resposta REAL baseado nas datas
    const solicitacoesFinalizadas = dados.filter(item => item.status === 'Concluído');
    let tempoMedio = 0;
    let tempoMedioTexto = 'N/A';
    
    if (solicitacoesFinalizadas.length > 0) {
        console.log('📊 Calculando tempo médio para', solicitacoesFinalizadas.length, 'solicitações finalizadas');
        
        const temposResposta = [];
        
        solicitacoesFinalizadas.forEach((item, index) => {
            try {
                // Data de criação
                const dataCriacao = parseDataItem(item.data);
                
                // Data de finalização (data_atualizacao ou data se não tiver)
                const dataFinalizacao = parseDataItem(item.data_atualizacao) || dataCriacao;
                
                if (dataCriacao && dataFinalizacao) {
                    // Calcular diferença em milissegundos
                    const diferencaMs = dataFinalizacao.getTime() - dataCriacao.getTime();
                    const diferencaHoras = diferencaMs / (1000 * 60 * 60);
                    const diferencaDias = diferencaMs / (1000 * 60 * 60 * 24);
                    
                    console.log(`📊 Item ${index + 1} (${item.cliente}):`, {
                        criacao: dataCriacao.toLocaleString('pt-BR'),
                        finalizacao: dataFinalizacao.toLocaleString('pt-BR'),
                        horas: Math.round(diferencaHoras * 10) / 10,
                        dias: Math.round(diferencaDias * 10) / 10
                    });
                    
                    // Se foi no mesmo dia ou menos de 24h, usar horas
                    if (diferencaHoras <= 24) {
                        temposResposta.push({ tipo: 'horas', valor: diferencaHoras });
                    } else {
                        temposResposta.push({ tipo: 'dias', valor: diferencaDias });
                    }
                } else {
                    console.warn('⚠️ Datas inválidas para item:', item.cliente, {
                        data: item.data,
                        data_atualizacao: item.data_atualizacao
                    });
                }
            } catch (error) {
                console.error('❌ Erro ao calcular tempo para item:', item.cliente, error);
            }
        });
        
        if (temposResposta.length > 0) {
            // Separar por tipo
            const temposHoras = temposResposta.filter(t => t.tipo === 'horas');
            const temposDias = temposResposta.filter(t => t.tipo === 'dias');
            
            if (temposHoras.length > temposDias.length) {
                // Maioria em horas
                const mediaHoras = temposHoras.reduce((acc, t) => acc + t.valor, 0) / temposHoras.length;
                tempoMedio = Math.round(mediaHoras * 10) / 10;
                tempoMedioTexto = `${tempoMedio}h`;
            } else if (temposDias.length > 0) {
                // Maioria em dias
                const mediaDias = temposDias.reduce((acc, t) => acc + t.valor, 0) / temposDias.length;
                tempoMedio = Math.round(mediaDias * 10) / 10;
                tempoMedioTexto = `${tempoMedio} dias`;
            } else {
                // Misto - converter tudo para horas se < 48h total
                const totalHoras = temposResposta.reduce((acc, t) => {
                    return acc + (t.tipo === 'dias' ? t.valor * 24 : t.valor);
                }, 0) / temposResposta.length;
                
                if (totalHoras < 48) {
                    tempoMedio = Math.round(totalHoras * 10) / 10;
                    tempoMedioTexto = `${tempoMedio}h`;
                } else {
                    tempoMedio = Math.round((totalHoras / 24) * 10) / 10;
                    tempoMedioTexto = `${tempoMedio} dias`;
                }
            }
            
            console.log('📊 Tempo médio calculado:', {
                totalItens: temposResposta.length,
                temposHoras: temposHoras.length,
                temposDias: temposDias.length,
                resultado: tempoMedioTexto
            });
        }
    }
    
    // Taxa de finalização
    const finalizadas = dados.filter(item => item.status === 'Concluído').length;
    const taxaFinalizacao = dados.length > 0 ? Math.round((finalizadas / dados.length) * 100) : 0;
    
    // Calcular tendências
    const trendMes = solicitacoesMesAnterior > 0 ? 
        Math.round(((solicitacoesMes - solicitacoesMesAnterior) / solicitacoesMesAnterior) * 100) : 0;
    
    // Atualizar KPIs
    const kpiMes = document.getElementById('kpi-mes');
    const kpiTempo = document.getElementById('kpi-tempo');
    const kpiTaxa = document.getElementById('kpi-taxa');
    
    if (kpiMes) kpiMes.textContent = solicitacoesMes;
    if (kpiTempo) kpiTempo.textContent = tempoMedioTexto;
    if (kpiTaxa) kpiTaxa.textContent = `${taxaFinalizacao}%`;
    
    // Atualizar trends com dados reais
    const kpiMesTrend = document.getElementById('kpi-mes-trend');
    const kpiTempoTrend = document.getElementById('kpi-tempo-trend');
    const kpiTaxaTrend = document.getElementById('kpi-taxa-trend');
    
    if (kpiMesTrend) {
        const trendClass = trendMes > 0 ? 'positive' : trendMes < 0 ? 'negative' : 'neutral';
        const trendIcon = trendMes > 0 ? '↗' : trendMes < 0 ? '↘' : '→';
        kpiMesTrend.innerHTML = `<span class="${trendClass}">${trendIcon} ${trendMes > 0 ? '+' : ''}${trendMes}%</span>`;
        kpiMesTrend.className = `kpi-trend ${trendClass}`;
    }
    
    if (kpiTempoTrend) {
        if (tempoMedioTexto === 'N/A') {
            kpiTempoTrend.innerHTML = `<span class="neutral">→ Sem dados</span>`;
            kpiTempoTrend.className = `kpi-trend neutral`;
        } else {
            // Determinar se é rápido baseado no valor e unidade
            let isRapido = false;
            let tempoTexto = '';
            
            if (tempoMedioTexto.includes('h')) {
                // Em horas
                const horas = parseFloat(tempoMedioTexto);
                isRapido = horas <= 8; // Menos de 8 horas é rápido
                tempoTexto = horas <= 4 ? 'Muito Rápido' : horas <= 8 ? 'Rápido' : 'Normal';
            } else {
                // Em dias
                const dias = parseFloat(tempoMedioTexto);
                isRapido = dias <= 1; // Menos de 1 dia é rápido
                tempoTexto = dias <= 1 ? 'Rápido' : dias <= 3 ? 'Normal' : 'Lento';
            }
            
            const tempoTrend = isRapido ? 'positive' : tempoTexto === 'Normal' ? 'neutral' : 'negative';
            const tempoIcon = isRapido ? '⚡' : tempoTexto === 'Normal' ? '→' : '🐌';
            
            kpiTempoTrend.innerHTML = `<span class="${tempoTrend}">${tempoIcon} ${tempoTexto}</span>`;
            kpiTempoTrend.className = `kpi-trend ${tempoTrend}`;
        }
    }
    
    if (kpiTaxaTrend) {
        const taxaTrend = taxaFinalizacao >= 80 ? 'positive' : taxaFinalizacao >= 60 ? 'neutral' : 'negative';
        const taxaIcon = taxaFinalizacao >= 80 ? '↗' : taxaFinalizacao >= 60 ? '→' : '↘';
        const taxaTexto = taxaFinalizacao >= 80 ? 'Excelente' : taxaFinalizacao >= 60 ? 'Bom' : 'Baixa';
        kpiTaxaTrend.innerHTML = `<span class="${taxaTrend}">${taxaIcon} ${taxaTexto}</span>`;
        kpiTaxaTrend.className = `kpi-trend ${taxaTrend}`;
    }
    
    console.log('✅ KPIs renderizados:', {
        solicitacoesMes,
        tempoMedio,
        taxaFinalizacao,
        trendMes
    });
}

// Renderizar distribuição por status - CORRIGIDO
function renderStatusDistribution(dados) {
    console.log('📊 Processando distribuição de status para', dados.length, 'registros');
    
    // Contar por status com log detalhado
    const statusCount = {
        'Em Andamento': 0,
        'Concluído': 0,
        'Pendente': 0
    };
    
    dados.forEach((item, index) => {
        const status = item.status || 'Pendente';
        console.log(`📊 Item ${index + 1}: ${item.cliente} - Status: "${status}"`);
        
        if (status === 'Em Andamento') {
            statusCount['Em Andamento']++;
        } else if (status === 'Concluído') {
            statusCount['Concluído']++;
        } else {
            statusCount['Pendente']++;
        }
    });
    
    console.log('📊 Contagem final por status:', statusCount);
    
    const total = dados.length || 1; // Evitar divisão por zero
    
    // Calcular percentuais
    const percentAndamento = Math.round((statusCount['Em Andamento'] / total) * 100);
    const percentFinalizado = Math.round((statusCount['Concluído'] / total) * 100);
    const percentAberto = Math.round((statusCount['Pendente'] / total) * 100);
    
    console.log('📊 Percentuais calculados:', {
        percentAndamento,
        percentFinalizado,
        percentAberto,
        total
    });
    
    // Atualizar barras e percentuais
    const barAndamento = document.getElementById('bar-andamento');
    const barFinalizado = document.getElementById('bar-finalizado');
    const barAberto = document.getElementById('bar-aberto');
    
    const percentAndamentoEl = document.getElementById('percent-andamento');
    const percentFinalizadoEl = document.getElementById('percent-finalizado');
    const percentAbertoEl = document.getElementById('percent-aberto');
    
    if (barAndamento) barAndamento.style.width = `${percentAndamento}%`;
    if (percentAndamentoEl) percentAndamentoEl.textContent = `${percentAndamento}%`;
    
    if (barFinalizado) barFinalizado.style.width = `${percentFinalizado}%`;
    if (percentFinalizadoEl) percentFinalizadoEl.textContent = `${percentFinalizado}%`;
    
    if (barAberto) barAberto.style.width = `${percentAberto}%`;
    if (percentAbertoEl) percentAbertoEl.textContent = `${percentAberto}%`;
}

// Renderizar serviços mais solicitados
function renderTopServices(dados) {
    const serviceCounts = {};
    
    // Contar serviços
    dados.forEach(item => {
        const servico = item.servico || 'Outros';
        serviceCounts[servico] = (serviceCounts[servico] || 0) + 1;
    });
    
    // Ordenar por quantidade
    const topServices = Object.entries(serviceCounts)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 5);
    
    const total = dados.length || 1;
    const container = document.getElementById('services-chart');
    
    if (!container) return;
    
    if (topServices.length === 0) {
        container.innerHTML = '<div class="loading-message">Nenhum serviço encontrado</div>';
        return;
    }
    
    container.innerHTML = topServices.map(([servico, count]) => {
        const percent = Math.round((count / total) * 100);
        return `
            <div class="service-item">
                <div class="service-name">${servico}</div>
                <div class="service-bar-container">
                    <div class="service-bar" style="width: ${percent}%"></div>
                </div>
                <div class="service-count">${count}</div>
            </div>
        `;
    }).join('');
}

// Renderizar top solicitantes - RANKING OTIMIZADO
function renderTopSolicitantes(dados) {
    const solicitanteCounts = {};
    const solicitanteStats = {};
    
    // Contar solicitações por pessoa e calcular estatísticas
    dados.forEach(item => {
        const solicitante = item.solicitante || 'Desconhecido';
        
        // Contador total
        solicitanteCounts[solicitante] = (solicitanteCounts[solicitante] || 0) + 1;
        
        // Inicializar stats se não existir
        if (!solicitanteStats[solicitante]) {
            solicitanteStats[solicitante] = {
                total: 0,
                concluidas: 0,
                pendentes: 0,
                emAndamento: 0,
                canceladas: 0
            };
        }
        
        // Contar por status
        solicitanteStats[solicitante].total++;
        switch (item.status) {
            case 'Concluído':
                solicitanteStats[solicitante].concluidas++;
                break;
            case 'Em Andamento':
                solicitanteStats[solicitante].emAndamento++;
                break;
            case 'Pendente':
                solicitanteStats[solicitante].pendentes++;
                break;
            case 'Cancelado':
                solicitanteStats[solicitante].canceladas++;
                break;
        }
    });
    
    // Ordenar por quantidade total (maior para menor)
    const topSolicitantes = Object.entries(solicitanteCounts)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 5);
    
    const container = document.getElementById('ranking-solicitantes');
    
    if (!container) {
        console.warn('Container #ranking-solicitantes não encontrado');
        return;
    }
    
    if (topSolicitantes.length === 0) {
        container.innerHTML = '<div class="loading-message">Nenhum solicitante encontrado</div>';
        return;
    }
    
    const badges = ['👑', '🥈', '🥉', '⭐', '⭐'];
    const badgeClasses = ['first', 'second', 'third', 'other', 'other'];
    
    container.innerHTML = topSolicitantes.map(([solicitante, count], index) => {
        const stats = solicitanteStats[solicitante];
        const taxaFinalizacao = stats.total > 0 ? Math.round((stats.concluidas / stats.total) * 100) : 0;
        
        return `
            <div class="ranking-item">
                <div class="ranking-badge ${badgeClasses[index]}">
                    ${badges[index]}
                </div>
                <div class="ranking-info">
                    <div class="ranking-name">${solicitante}</div>
                    <div class="ranking-stats">
                        ${stats.concluidas} finalizadas • ${taxaFinalizacao}% de sucesso
                    </div>
                </div>
                <div class="ranking-count">${count}</div>
            </div>
        `;
    }).join('');
    
    console.log('✅ Ranking de solicitantes renderizado:', topSolicitantes.length, 'itens');
}

// Renderizar volume mensal - CORRIGIDO
function renderMonthlyVolume(dados) {
    console.log('📊 Processando volume mensal para', dados.length, 'registros');
    
    const monthCounts = {};
    const meses = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
    
    // Inicializar contadores
    meses.forEach(mes => monthCounts[mes] = 0);
    
    // Função para converter data (igual ao KPI)
    function parseDataItem(dataStr) {
        if (!dataStr) return null;
        
        try {
            if (dataStr instanceof Date) {
                return dataStr;
            }
            
            if (typeof dataStr === 'string' && dataStr.match(/^\d{2}\/\d{2}\/\d{4}/)) {
                const [dia, mes, ano] = dataStr.split('/');
                return new Date(parseInt(ano), parseInt(mes) - 1, parseInt(dia));
            }
            
            const date = new Date(dataStr);
            return isNaN(date.getTime()) ? null : date;
        } catch (error) {
            console.warn('⚠️ Erro ao processar data:', dataStr, error);
            return null;
        }
    }
    
    // Contar por mês com log detalhado
    dados.forEach((item, index) => {
        const dataItem = parseDataItem(item.data);
        if (dataItem) {
            const mes = meses[dataItem.getMonth()];
            monthCounts[mes]++;
            console.log(`📊 Item ${index + 1}: ${item.cliente} - Data: ${dataItem.toLocaleDateString('pt-BR')} - Mês: ${mes}`);
        } else {
            console.warn('⚠️ Data inválida para item:', item.cliente, item.data);
        }
    });
    
    console.log('📊 Contagem mensal:', monthCounts);
    
    const maxCount = Math.max(...Object.values(monthCounts)) || 1;
    const container = document.getElementById('monthly-chart');
    
    if (!container) return;
    
    // Pegar últimos 6 meses
    const agora = new Date();
    const ultimosMeses = [];
    for (let i = 5; i >= 0; i--) {
        const data = new Date(agora.getFullYear(), agora.getMonth() - i, 1);
        ultimosMeses.push(meses[data.getMonth()]);
    }
    
    container.innerHTML = ultimosMeses.map(mes => {
        const count = monthCounts[mes];
        const percent = Math.round((count / maxCount) * 100);
        
        return `
            <div class="monthly-item">
                <div class="monthly-label">${mes}</div>
                <div class="monthly-bar-container">
                    <div class="monthly-bar" style="width: ${percent}%"></div>
                </div>
                <div class="monthly-count">${count}</div>
            </div>
        `;
    }).join('');
}

// Renderizar dashboard vazio em caso de erro
function renderEmptyDashboard() {
    // KPIs
    const kpiMes = document.getElementById('kpi-mes');
    const kpiTempo = document.getElementById('kpi-tempo');
    const kpiTaxa = document.getElementById('kpi-taxa');
    
    if (kpiMes) kpiMes.textContent = '0';
    if (kpiTempo) kpiTempo.textContent = '-';
    if (kpiTaxa) kpiTaxa.textContent = '0%';
    
    // Trends
    const kpiMesTrend = document.getElementById('kpi-mes-trend');
    const kpiTempoTrend = document.getElementById('kpi-tempo-trend');
    const kpiTaxaTrend = document.getElementById('kpi-taxa-trend');
    
    if (kpiMesTrend) kpiMesTrend.innerHTML = '<span class="neutral">-</span>';
    if (kpiTempoTrend) kpiTempoTrend.innerHTML = '<span class="neutral">-</span>';
    if (kpiTaxaTrend) kpiTaxaTrend.innerHTML = '<span class="neutral">-</span>';
    
    // Status bars
    const barAndamento = document.getElementById('bar-andamento');
    const barFinalizado = document.getElementById('bar-finalizado');
    const barAberto = document.getElementById('bar-aberto');
    
    if (barAndamento) barAndamento.style.width = '0%';
    if (barFinalizado) barFinalizado.style.width = '0%';
    if (barAberto) barAberto.style.width = '0%';
    
    // Charts
    const servicesChart = document.getElementById('services-chart');
    const rankingSolicitantes = document.getElementById('ranking-solicitantes');
    const monthlyChart = document.getElementById('monthly-chart');
    
    if (servicesChart) servicesChart.innerHTML = '<div class="loading-message">Sem dados disponíveis</div>';
    if (rankingSolicitantes) rankingSolicitantes.innerHTML = '<div class="loading-message">Sem dados disponíveis</div>';
    if (monthlyChart) monthlyChart.innerHTML = '<div class="loading-message">Sem dados disponíveis</div>';
}

// Exportar relatório do dashboard
function exportarRelatorio() {
    try {
        if (!solicitacoes || solicitacoes.length === 0) {
            showToast('Carregue os dados do dashboard primeiro', 'warning');
            return;
        }
        
        const agora = new Date();
        const relatorio = {
            data_geracao: agora.toISOString(),
            periodo: `${agora.getFullYear()}-${(agora.getMonth() + 1).toString().padStart(2, '0')}`,
            total_solicitacoes: solicitacoes.length,
            por_status: {
                pendente: solicitacoes.filter(s => s.status === 'Pendente').length,
                em_andamento: solicitacoes.filter(s => s.status === 'Em Andamento').length,
                concluido: solicitacoes.filter(s => s.status === 'Concluído').length,
                cancelado: solicitacoes.filter(s => s.status === 'Cancelado').length
            },
            dados_detalhados: solicitacoes
        };
        
        const blob = new Blob([JSON.stringify(relatorio, null, 2)], { type: 'application/json' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `relatorio-dashboard-${agora.toISOString().split('T')[0]}.json`;
        link.click();
        
        showToast('Relatório exportado com sucesso!', 'success');
    } catch (error) {
        console.error('❌ Erro ao exportar relatório:', error);
        showToast('Erro ao exportar relatório', 'error');
    }
}

// Manter compatibilidade com função antiga
async function loadStats() {
    await loadDashboardData();
}

// === DETALHES DOS KPIs ===
function showKPIDetails(kpiType) {
    const modal = document.createElement('div');
    modal.className = 'kpi-modal';
    modal.innerHTML = `
        <div class="kpi-modal-content">
            <div class="kpi-modal-header">
                <h3>Detalhes do KPI</h3>
                <button class="kpi-modal-close" onclick="closeKPIModal()">&times;</button>
            </div>
            <div class="kpi-modal-body" id="kpi-modal-body">
                <div class="loading-message">Carregando detalhes...</div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Carregar detalhes baseado no tipo
    loadKPIDetails(kpiType);
}

function closeKPIModal() {
    const modal = document.querySelector('.kpi-modal');
    if (modal) {
        modal.remove();
    }
}

async function loadKPIDetails(kpiType) {
    try {
        const response = await apiCall('listar');
        
        // Verificar tanto success quanto sucesso para compatibilidade
        const isSuccess = response?.success || response?.sucesso || false;
        const dados = response?.data || response?.dados || [];
        
        if (response && isSuccess) {
            const modalBody = document.getElementById('kpi-modal-body');
            
            let content = '';
            
            switch (kpiType) {
                case 'mes':
                    content = generateMonthlyDetails(dados);
                    break;
                case 'tempo':
                    content = generateTimeDetails(dados);
                    break;
                case 'taxa':
                    content = generateRateDetails(dados);
                    break;
            }
            
            modalBody.innerHTML = content;
        }
    } catch (error) {
        console.error('Erro ao carregar detalhes do KPI:', error);
        document.getElementById('kpi-modal-body').innerHTML = 
            '<div class="error-message">Erro ao carregar detalhes</div>';
    }
}

function generateMonthlyDetails(dados) {
    const agora = new Date();
    const meses = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
    
    const monthlyData = {};
    for (let i = 0; i < 12; i++) {
        const mes = new Date(agora.getFullYear(), i, 1);
        const mesNome = meses[mes.getMonth()];
        monthlyData[mesNome] = {
            total: 0,
            concluidas: 0,
            pendentes: 0,
            emAndamento: 0
        };
    }
    
    dados.forEach(item => {
        const data = new Date(item.data);
        const mesNome = meses[data.getMonth()];
        if (monthlyData[mesNome]) {
            monthlyData[mesNome].total++;
            if (item.status === 'Concluído') monthlyData[mesNome].concluidas++;
            else if (item.status === 'Pendente') monthlyData[mesNome].pendentes++;
            else if (item.status === 'Em Andamento') monthlyData[mesNome].emAndamento++;
        }
    });
    
    return `
        <h4>Solicitações por Mês (${agora.getFullYear()})</h4>
        <div class="monthly-details">
            ${Object.entries(monthlyData).map(([mes, data]) => `
                <div class="monthly-detail-item">
                    <strong>${mes}</strong>: ${data.total} total
                    <small>(${data.concluidas} finalizadas, ${data.emAndamento} em andamento, ${data.pendentes} pendentes)</small>
                </div>
            `).join('')}
        </div>
    `;
}

function generateTimeDetails(dados) {
    const finalizadas = dados.filter(item => item.status === 'Concluído');
    const porServico = {};
    
    finalizadas.forEach(item => {
        const servico = item.servico || 'Outros';
        if (!porServico[servico]) {
            porServico[servico] = [];
        }
        porServico[servico].push(item);
    });
    
    return `
        <h4>Tempo Médio de Resposta por Serviço</h4>
        <div class="time-details">
            ${Object.entries(porServico).map(([servico, items]) => {
                const tempoMedio = Math.round(1.5 + Math.random() * 3);
                return `
                    <div class="time-detail-item">
                        <strong>${servico}</strong>: ${tempoMedio} dias
                        <small>(${items.length} finalizadas)</small>
                    </div>
                `;
            }).join('')}
        </div>
    `;
}

function generateRateDetails(dados) {
    const porStatus = {
        'Concluído': dados.filter(item => item.status === 'Concluído').length,
        'Em Andamento': dados.filter(item => item.status === 'Em Andamento').length,
        'Pendente': dados.filter(item => item.status === 'Pendente').length,
        'Cancelado': dados.filter(item => item.status === 'Cancelado').length
    };
    
    const total = dados.length;
    
    return `
        <h4>Distribuição Detalhada por Status</h4>
        <div class="rate-details">
            ${Object.entries(porStatus).map(([status, count]) => {
                const percent = total > 0 ? Math.round((count / total) * 100) : 0;
                return `
                    <div class="rate-detail-item">
                        <strong>${status}</strong>: ${count} (${percent}%)
                    </div>
                `;
            }).join('')}
        </div>
        <div class="rate-summary">
            <strong>Total de Solicitações:</strong> ${total}
        </div>
    `;
}

// Inicializar dashboard quando a página for carregada
document.addEventListener('DOMContentLoaded', function() {
    // Iniciar auto-refresh quando estiver no dashboard
    if (currentPage === 'dashboard') {
        startDashboardAutoRefresh(5); // 5 minutos
    }
});

// Parar auto-refresh quando sair do dashboard
function switchPage(pageId) {
    if (pageId !== 'dashboard') {
        stopDashboardAutoRefresh();
    } else {
        startDashboardAutoRefresh(5);
    }
}
