# 📦 Guia de Publicação Gratuita

Este documento explica como publicar a plataforma **Sagacy** gratuitamente utilizando **GitHub Pages**.

## 1. Criar um repositório
1. Acesse [github.com](https://github.com) e crie uma conta se ainda não tiver.
2. Crie um novo repositório (público).

## 2. Enviar os arquivos do projeto
1. No seu computador, abra o terminal na pasta do projeto.
2. Inicialize o repositório e envie os arquivos:
   ```bash
   git init
   git add .
   git commit -m "Publicação inicial"
   git branch -M main
   git remote add origin https://github.com/<seu-usuario>/<seu-repo>.git
   git push -u origin main
   ```

## 3. Ativar o GitHub Pages
1. Dentro do repositório no GitHub, abra **Settings**.
2. Na seção **Pages**, escolha a branch `main` e a pasta `/` (root).
3. Salve. Em alguns instantes a URL será disponibilizada.

A página ficará acessível em `https://<seu-usuario>.github.io/<seu-repo>/`.

## 4. Acessar o sistema
Basta abrir a URL gerada e acessar `index.html`. Todo o front-end será carregado diretamente pelo GitHub Pages.

Assim você publica a plataforma sem custos e com atualização simples sempre que fizer novos commits.
