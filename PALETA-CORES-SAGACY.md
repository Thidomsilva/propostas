# 🎨 PALETA DE CORES SAGACY - OFICIAL

## 🏢 **Cores Principais da Marca Sagacy**

Baseado no site oficial www.sagacy.com.br, aqui estão as cores da identidade visual:

### 🎯 **Cores Primárias**
```css
/* Azul Principal Sagacy */
--sagacy-primary: #215269;

/* Azul Alternativo */
--sagacy-blue: #088cdc;

/* Laranja de Destaque */
--sagacy-orange: #cc5000;

/* Verde Complementar */
--sagacy-green: #52bf81;
```

### 🎨 **Cores Secundárias**
```css
/* Cinzas e Neutros */
--sagacy-gray-dark: #2a2d32;
--sagacy-gray-medium: #666666;
--sagacy-gray-light: #999999;
--sagacy-gray-lighter: #cccccc;
--sagacy-gray-bg: #eff2f7;

/* Brancos e Backgrounds */
--sagacy-white: #ffffff;
--sagacy-bg-light: #f8f9fa;
--sagacy-border: #eeeeee;
--sagacy-border-light: #dddddd;
```

### ✨ **Cores de Estado**
```css
/* Success */
--sagacy-success: #198754;
--sagacy-success-light: #d1e7dd;

/* Warning */
--sagacy-warning: #ffc107;
--sagacy-warning-light: #fff3cd;

/* Error */
--sagacy-error: #dc3545;
--sagacy-error-light: #f8d7da;

/* Info */
--sagacy-info: #0dcaf0;
--sagacy-info-light: #d1ecf1;
```

---

## 🎯 **Aplicação no Sistema**

### 📋 **Mapeamento para o Sistema Atual**

#### **Botões e Links**
- **Primário**: `#215269` (Azul Sagacy Principal)
- **Secundário**: `#088cdc` (Azul Alternativo)
- **Hover**: `#cc5000` (Laranja de Destaque)

#### **Status e Estados**
- **Pendente**: `#ffc107` (Warning)
- **Em Andamento**: `#088cdc` (Azul Alternativo)
- **Concluído**: `#198754` (Success)
- **Cancelado**: `#dc3545` (Error)

#### **Navegação e Headers**
- **Background**: `#215269` (Azul Principal)
- **Text**: `#ffffff` (Branco)
- **Active**: `#cc5000` (Laranja)

#### **Dashboard e Cards**
- **Card Headers**: `#215269`
- **Backgrounds**: `#eff2f7`
- **Borders**: `#eeeeee`
- **Text**: `#2a2d32`

---

## 📝 **Arquivo CSS Personalizado**

```css
/* === PALETA SAGACY === */
:root {
  /* Cores Principais */
  --sagacy-primary: #215269;
  --sagacy-blue: #088cdc;
  --sagacy-orange: #cc5000;
  --sagacy-green: #52bf81;
  
  /* Neutros */
  --sagacy-gray-dark: #2a2d32;
  --sagacy-gray-medium: #666666;
  --sagacy-gray-light: #999999;
  --sagacy-gray-lighter: #cccccc;
  --sagacy-bg: #eff2f7;
  
  /* Estados */
  --sagacy-success: #198754;
  --sagacy-warning: #ffc107;
  --sagacy-error: #dc3545;
  --sagacy-info: #088cdc;
  
  /* Base */
  --sagacy-white: #ffffff;
  --sagacy-border: #eeeeee;
}

/* Aplicação das Cores */
.btn-primary {
  background-color: var(--sagacy-primary);
  border-color: var(--sagacy-primary);
}

.btn-primary:hover {
  background-color: var(--sagacy-orange);
  border-color: var(--sagacy-orange);
}

.navbar {
  background-color: var(--sagacy-primary);
}

.card-header {
  background-color: var(--sagacy-primary);
  color: var(--sagacy-white);
}

.status-pendente {
  background-color: var(--sagacy-warning);
  color: var(--sagacy-gray-dark);
}

.status-em-andamento {
  background-color: var(--sagacy-blue);
  color: var(--sagacy-white);
}

.status-concluido {
  background-color: var(--sagacy-success);
  color: var(--sagacy-white);
}

.status-cancelado {
  background-color: var(--sagacy-error);
  color: var(--sagacy-white);
}
```

---

## 🚀 **Próximos Passos**

1. **Atualizar `css/style.css`** com as cores Sagacy
2. **Atualizar `css/dashboard.css`** com a paleta oficial
3. **Testar** a nova identidade visual
4. **Documentar** as mudanças aplicadas

---

**🎨 Status:** Pronto para implementação  
**📅 Data:** 11 de Julho de 2025  
**🔗 Fonte:** www.sagacy.com.br (CSS oficial)  
**🎯 Objetivo:** Alinhar sistema com identidade visual oficial
