// === FUNÇÕES DE API ROBUSTAS ===
// Sistema de múltiplas tentativas para máxima compatibilidade com Google Apps Script

async function apiCall(endpoint, data = null) {
    console.log('🔄 Iniciando chamada da API:', endpoint, data);
    
    // Para Google Apps Script, usar JSONP primeiro (mais confiável)
    try {
        console.log('🌐 Tentativa 1: JSONP');
        const jsonpResult = await makeJsonpRequest(endpoint, data);
        console.log('✅ JSONP funcionou:', jsonpResult);
        return jsonpResult;
    } catch (jsonpError) {
        console.log('⚠️ JSONP falhou:', jsonpError.message);
    }
    
    // Lista de métodos fetch para tentar como fallback
    const methods = [
        {
            name: 'POST_JSON',
            execute: () => makePostJsonRequest(endpoint, data)
        },
        {
            name: 'POST_FORM_DATA',
            execute: () => makePostFormDataRequest(endpoint, data)
        },
        {
            name: 'POST_URL_ENCODED',
            execute: () => makePostUrlEncodedRequest(endpoint, data)
        },
        {
            name: 'GET_PARAMS',
            execute: () => makeGetRequest(endpoint, data)
        },
        {
            name: 'SIMPLE_GET',
            execute: () => makeSimpleGetRequest(endpoint, data)
        }
    ];
    
    let lastError = null;
    
    // Tentar cada método até um funcionar
    for (const method of methods) {
        try {
            console.log(`🧪 Tentando método ${method.name}...`);
            const result = await method.execute();
            console.log(`✅ Sucesso com método ${method.name}:`, result);
            updateDebugInfo(`API OK: ${method.name}`);
            return result;
        } catch (error) {
            console.warn(`⚠️ Método ${method.name} falhou:`, error.message);
            lastError = error;
        }
    }
    
    // Se todos os métodos falharam
    console.error('❌ Todos os métodos de API falharam. Último erro:', lastError);
    updateDebugInfo(`API ERRO: ${lastError?.message}`);
    
    // Verificar se o erro foi por JSON cortado mas com sucesso
    if (lastError?.message.includes('Resposta inválida') && 
        lastError?.message.includes('"sucesso":true')) {
        console.log('🔄 Detectado sucesso em erro de JSON cortado. Retornando sucesso...');
        return {
            success: true,
            message: 'Operação realizada com sucesso',
            data: null,
            timestamp: new Date().toISOString()
        };
    }
    
    // Mensagem mais específica baseada no tipo de erro
    let errorMessage = 'Erro na comunicação com o servidor';
    if (lastError?.message.includes('Failed to fetch')) {
        errorMessage = 'Erro de conexão. Verifique sua internet e tente novamente.';
    } else if (lastError?.message.includes('CORS')) {
        errorMessage = 'Erro de configuração. Contate o administrador.';
    } else if (lastError?.message.includes('JSON')) {
        errorMessage = 'Erro de formato na resposta do servidor.';
    }
    
    showToast(errorMessage, 'error');
    throw new Error(`Erro no servidor: ${lastError?.message || 'Comunicação falhou'}`);
}

// Método 1: POST com JSON
async function makePostJsonRequest(endpoint, data) {
    const url = `${API_CONFIG.BASE_URL}?action=${endpoint}&_=${API_CONFIG.CACHE_BUSTER}`;
    const response = await fetch(url, {
        method: 'POST',
        mode: 'cors',
        headers: {
            'Content-Type': 'application/json',
        },
        body: data ? JSON.stringify(data) : null
    });
    
    return await processResponse(response, 'POST_JSON');
}

// Método 2: POST com FormData
async function makePostFormDataRequest(endpoint, data) {
    const url = `${API_CONFIG.BASE_URL}?action=${endpoint}&_=${API_CONFIG.CACHE_BUSTER}`;
    const formData = new FormData();
    
    if (data) {
        formData.append('data', JSON.stringify(data));
        for (const [key, value] of Object.entries(data)) {
            if (value !== null && value !== undefined) {
                formData.append(key, value);
            }
        }
    }
    
    const response = await fetch(url, {
        method: 'POST',
        mode: 'cors',
        body: formData
    });
    
    return await processResponse(response, 'POST_FORM_DATA');
}

// Método 3: POST com URL encoded
async function makePostUrlEncodedRequest(endpoint, data) {
    const url = `${API_CONFIG.BASE_URL}?action=${endpoint}&_=${API_CONFIG.CACHE_BUSTER}`;
    const params = new URLSearchParams();
    
    if (data) {
        params.append('data', JSON.stringify(data));
        for (const [key, value] of Object.entries(data)) {
            if (value !== null && value !== undefined) {
                params.append(key, value);
            }
        }
    }
    
    const response = await fetch(url, {
        method: 'POST',
        mode: 'cors',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: params.toString()
    });
    
    return await processResponse(response, 'POST_URL_ENCODED');
}

// Método 4: GET com parâmetros na URL
async function makeGetRequest(endpoint, data) {
    const params = new URLSearchParams();
    params.append('action', endpoint);
    params.append('_', API_CONFIG.CACHE_BUSTER);
    
    if (data) {
        params.append('data', JSON.stringify(data));
        for (const [key, value] of Object.entries(data)) {
            if (value !== null && value !== undefined) {
                params.append(key, value);
            }
        }
    }
    
    const url = `${API_CONFIG.BASE_URL}?${params.toString()}`;
    const response = await fetch(url, {
        method: 'GET',
        mode: 'cors'
    });
    
    return await processResponse(response, 'GET_PARAMS');
}

// Método 5: GET super simples sem cache-buster
async function makeSimpleGetRequest(endpoint, data) {
    let url = `${API_CONFIG.BASE_URL}?action=${endpoint}`;
    
    if (data && typeof data === 'object') {
        const params = new URLSearchParams();
        for (const [key, value] of Object.entries(data)) {
            if (value !== null && value !== undefined) {
                const stringValue = typeof value === 'object' ? JSON.stringify(value) : String(value);
                params.append(key, stringValue);
            }
        }
        if (params.toString()) {
            url += '&' + params.toString();
        }
    }
    
    console.log(`🌐 SIMPLE_GET URL:`, url);
    
    const response = await fetch(url, {
        method: 'GET',
        mode: 'cors',
        cache: 'no-cache',
        headers: {
            'Accept': 'application/json,text/plain,*/*'
        }
    });
    
    return await processResponse(response, 'SIMPLE_GET');
}

// Processar resposta com tratamento ultra-robusto de JSON
async function processResponse(response, methodName) {
    console.log(`📥 ${methodName} - Status:`, response.status);
    
    if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    const text = await response.text();
    console.log(`📄 ${methodName} - Response (primeiros 300 chars):`, text.substring(0, 300));
    
    // Múltiplas camadas de limpeza
    let cleanText = text.trim();
    
    // Remover BOM e caracteres de controle
    if (cleanText.charCodeAt(0) === 0xFEFF) {
        cleanText = cleanText.substring(1);
    }
    cleanText = cleanText.replace(/^[\x00-\x1F\x7F-\x9F]+/, '');
    
    // Correção específica para caracteres Unicode problemáticos
    cleanText = cleanText.replace(/\u2013|\u2014/g, '-');
    cleanText = cleanText.replace(/\u2212/g, '-');
    cleanText = cleanText.replace(/[\u200B-\u200D\uFEFF]/g, '');
    
    // Verificar se é página de erro do Google Apps Script
    if (cleanText.includes('Script function not found') || 
        cleanText.includes('Authorization required') ||
        cleanText.includes('Google Apps Script') ||
        cleanText.includes('<html')) {
        throw new Error('Erro de autorização ou configuração no Apps Script. Verifique as permissões.');
    }
    
    // Extrair JSON se estiver dentro de HTML
    if (cleanText.startsWith('<!DOCTYPE') || cleanText.startsWith('<html')) {
        const jsonMatch = cleanText.match(/\{.*\}/s);
        if (jsonMatch) {
            cleanText = jsonMatch[0];
        }
    }
    
    // Procurar início do JSON se não começar com { ou [
    if (!cleanText.startsWith('{') && !cleanText.startsWith('[')) {
        const jsonStart = cleanText.indexOf('{');
        const arrayStart = cleanText.indexOf('[');
        
        let start = -1;
        if (jsonStart !== -1 && arrayStart !== -1) {
            start = Math.min(jsonStart, arrayStart);
        } else if (jsonStart !== -1) {
            start = jsonStart;
        } else if (arrayStart !== -1) {
            start = arrayStart;
        }
        
        if (start !== -1) {
            cleanText = cleanText.substring(start);
        }
    }
    
    cleanText = cleanText.trim();
    
    // Tentativas de parse
    try {
        const result = JSON.parse(cleanText);
        console.log(`✅ ${methodName} - Parse bem-sucedido:`, result);
        return result;
    } catch (parseError) {
        console.log(`⚠️ ${methodName} - Parse falhou:`, parseError.message);
        console.log(`🔍 Conteúdo que causou erro:`, cleanText);
        
        // Verificar se JSON foi cortado
        if (cleanText.startsWith('{') && !cleanText.endsWith('}')) {
            console.log(`🔧 JSON parece estar cortado. Tentando corrigir...`);
            
            // Tentar encontrar o final correto do JSON
            let braceCount = 0;
            let lastValidIndex = -1;
            
            for (let i = 0; i < cleanText.length; i++) {
                if (cleanText[i] === '{') braceCount++;
                if (cleanText[i] === '}') braceCount--;
                
                if (braceCount === 0 && cleanText[i] === '}') {
                    lastValidIndex = i;
                    break;
                }
            }
            
            if (lastValidIndex > 0) {
                const fixedJson = cleanText.substring(0, lastValidIndex + 1);
                console.log(`🔧 Tentando JSON corrigido: ${fixedJson}`);
                
                try {
                    const result = JSON.parse(fixedJson);
                    console.log(`✅ ${methodName} - JSON corrigido parseado com sucesso:`, result);
                    return result;
                } catch (fixError) {
                    console.log(`⚠️ JSON corrigido também falhou: ${fixError.message}`);
                }
            }
            
            // Tentar extrair dados do JSON cortado
            if (cleanText.includes('"sucesso":true')) {
                console.log(`✅ Detectado sucesso em JSON cortado`);
                
                // Extrair mensagem se possível
                let message = 'Operação realizada com sucesso';
                const msgMatch = cleanText.match(/"mensagem":"([^"]*)"/) || cleanText.match(/"message":"([^"]*)"/);
                if (msgMatch) {
                    message = msgMatch[1];
                }
                
                // Extrair dados se possível
                let data = null;
                const dataMatch = cleanText.match(/"dados":(\[.*?\])/s);
                if (dataMatch) {
                    try {
                        // Tentar corrigir o array JSON cortado
                        let dataStr = dataMatch[1];
                        
                        // Se o array não fecha, tentar fechar
                        if (!dataStr.endsWith(']')) {
                            // Contar colchetes para tentar equilibrar
                            let bracketCount = 0;
                            for (let i = 0; i < dataStr.length; i++) {
                                if (dataStr[i] === '[') bracketCount++;
                                if (dataStr[i] === ']') bracketCount--;
                            }
                            
                            if (bracketCount > 0) {
                                dataStr += ']}]'.repeat(bracketCount);
                            }
                        }
                        
                        data = JSON.parse(dataStr);
                        console.log(`✅ Dados extraídos do JSON cortado:`, data);
                    } catch (dataError) {
                        console.warn('⚠️ Erro ao extrair dados do JSON cortado:', dataError);
                    }
                }
                
                return {
                    success: true,
                    message: message,
                    data: data,
                    timestamp: new Date().toISOString(),
                    _raw: cleanText,
                    _method: methodName
                };
            }
        }
        
        // Tratamento específico para "No number after minus sign"
        if (parseError.message.includes('No number after minus sign')) {
            let fixedText = cleanText;
            fixedText = fixedText.replace(/([^0-9])-([^0-9])/g, '$1_$2');
            fixedText = fixedText.replace(/"-([^0-9"])/g, '"_$1');
            fixedText = fixedText.replace(/([^0-9])-(["}\]])/g, '$1_$2');
            fixedText = fixedText.replace(/^-([^0-9])/g, '_$1');
            
            try {
                const result = JSON.parse(fixedText);
                console.log(`✅ ${methodName} - Parse após correção bem-sucedido:`, result);
                return result;
            } catch (secondError) {
                console.log(`⚠️ ${methodName} - Correção falhou:`, secondError.message);
            }
        }
    }
    
    // Resposta de fallback se contém palavras-chave
    if (cleanText.toLowerCase().includes('success') || 
        cleanText.toLowerCase().includes('error') || 
        cleanText.toLowerCase().includes('message')) {
        
        const isSuccess = cleanText.toLowerCase().includes('success') && 
                         !cleanText.toLowerCase().includes('false');
        
        return {
            success: isSuccess,
            message: cleanText.substring(0, 200),
            data: isSuccess ? [] : null,
            _raw: cleanText,
            _method: methodName
        };
    }
    
    throw new Error(`Resposta inválida do servidor. Método: ${methodName}. Conteúdo: ${cleanText.substring(0, 100)}`);
}

// === FUNÇÃO JSONP PARA GOOGLE APPS SCRIPT ===
async function makeJsonpRequest(endpoint, data = null) {
    return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        const callbackName = 'corsCallback_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
        
        // Definir callback global
        window[callbackName] = function(response) {
            document.head.removeChild(script);
            delete window[callbackName];
            
            console.log('📦 JSONP Response:', response);
            
            // Normalizar resposta para compatibilidade
            const normalizedResponse = {
                success: response.sucesso || response.success || false,
                sucesso: response.sucesso || response.success || false,
                message: response.mensagem || response.message || '',
                mensagem: response.mensagem || response.message || '',
                data: response.dados || response.data || null,
                dados: response.dados || response.data || null,
                timestamp: response.timestamp || new Date().toISOString(),
                versao: response.versao || response.version || 'unknown',
                _original: response
            };
            
            resolve(normalizedResponse);
        };
        
        // Construir URL
        let url = `${API_CONFIG.BASE_URL}?action=${endpoint}&callback=${callbackName}`;
        
        if (data) {
            // Adicionar dados como parâmetros URL
            const params = new URLSearchParams();
            for (const [key, value] of Object.entries(data)) {
                if (value !== null && value !== undefined) {
                    params.append(key, value);
                }
            }
            if (params.toString()) {
                url += '&' + params.toString();
            }
        }
        
        console.log('🌐 JSONP URL:', url);
        
        script.src = url;
        script.onerror = () => {
            document.head.removeChild(script);
            delete window[callbackName];
            reject(new Error('Erro na requisição JSONP'));
        };
        
        document.head.appendChild(script);
        
        // Timeout de 15 segundos
        setTimeout(() => {
            if (window[callbackName]) {
                document.head.removeChild(script);
                delete window[callbackName];
                reject(new Error('Timeout na requisição JSONP'));
            }
        }, 15000);
    });
}

// === FUNÇÕES DE TESTE DA API ===
async function testarAPI() {
    console.log('🧪 Iniciando teste da API...');
    showToast('Testando conexão com a API...', 'info');
    
    try {
        const response = await apiCall('listar');
        
        // Verificar tanto success quanto sucesso para compatibilidade
        const isSuccess = response?.success || response?.sucesso || false;
        const dados = response?.data || response?.dados || [];
        
        if (response && isSuccess) {
            console.log('✅ API respondendo corretamente');
            showToast('✅ API funcionando corretamente!', 'success');
            updateDebugInfo('API OK - Teste completo');
            console.log('📊 Dados recebidos:', dados);
        } else {
            throw new Error('Resposta inválida da API');
        }
    } catch (error) {
        console.error('❌ Teste da API falhou:', error);
        showToast(`❌ Erro na API: ${error.message}`, 'error');
        updateDebugInfo('API ERRO');
    }
}
