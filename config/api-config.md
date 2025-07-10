# Configuração da API - Google Apps Script

## 🔧 Passos para Configurar a API:

### 1. Criar o Projeto no Google Apps Script
- Acesse: [script.google.com](https://script.google.com)
- Clique em "Novo projeto"
- Cole o conteúdo do arquivo `backend.gs`

### 2. Configurar Permissões
- Vá em "Serviços" e adicione:
  - Google Sheets API
  - Gmail API (se usar email)

### 3. Publicar como Web App
- Clique em "Implantar" > "Nova implantação"
- Tipo: "Aplicativo da Web"
- Executar como: "Eu"
- Quem tem acesso: "Qualquer pessoa"
- Clique em "Implantar"

### 4. Copiar a URL
- Copie a URL fornecida (algo como: `https://script.google.com/macros/s/ABC.../exec`)

### 5. Configurar no Frontend
- Abra o `index.html`
- Encontre a linha ~676: `const BASE_URL = "SUA_URL_AQUI"`
- Substitua `"SUA_URL_AQUI"` pela URL copiada

### 6. Testar
- Abra o `index.html` no navegador
- Teste criando uma solicitação

## ⚠️ Importante:
- A URL deve terminar com `/exec`
- Teste sempre após fazer mudanças
- Mantenha backup do código
