# 🗺️ Snipe PA

Projeto monolítico desenvolvido para atender uma demanda real da empresa:
permitir a localização de máquinas e seus locais físicos, com histórico de movimentações e análises de uso..

---

## 🚀 Funcionalidades
- 📌 Cadastro de máquinas e locais através de formulário integrado. 
- 🗺️ Mapa físico para visualizar os pontos de atendimento (PA). 
- 📚 Histórico atrelado ao local (e não à máquina). 
- 📊 Analytics:
Quantidade total de máquinas cadastradas.
Média de trocas realizadas.
Número de trocas efetuadas nos últimos 30 dias.

---

## 🛠 Tecnologias
- **Frontend:** HTML, CSS, JavaScript, Tailwind CSS e Chart.js
- **Backend:** Node.js, Express  
- **Banco de dados:** PostgreSQL, Prisma ORM  
- **Deploy:** Render  

---

## 🔗 Endpoints da API
🔑Autenticação
- `GET /login` → Página de login.
- `POST /login` → Faz login (username, password).   
- `GET /logout` → Encerra a sessão.
- 
📌 Relacionamentos / Patrimônios
- `GET /api/relacao/:id` → Retorna detalhes de uma relação pelo ID. 
- `GET /api/relacao` → Retorna todas as relações (máquinas e locais).  
- `POST /create` → Cadastra uma nova máquina junto ao local.  
- `POST /update` → Edita o patrimonio de uma máquina em um local já existente. 
- `POST /delete` → Remove uma máquina/local.

📊 Outras rotas
- `GET /` → Lista de todos os patrimônios cadastrados e seus respectivos locais.
- `GET /layout` → Página de layout físico (mapa).
- `GET /analytics` → Página com métricas (quantidade de máquinas, trocas em 30 dias, média de troca). 
- `GET /historico/:id` → Página de histórico de um local (as trocas estão atreladas ao local, não à máquina).

---

## 🏗 Estrutura do Projeto
Este é um projeto monolítico, com frontend e backend no mesmo repositório, rodando juntos.

---

## 🌐 Acesse o Site
[Snipe PA](https://mapa-site-novo.onrender.com/)

## ⚠️ Observação
Este projeto está hospedado em uma plataforma gratuita (Render Free Tier).  
Por isso, o servidor pode **resetar automaticamente** após algum tempo de inatividade, o que pode causar demora na primeira requisição ou reinício temporário da aplicação.  
Isso é um comportamento normal da plataforma e não indica erro no projeto.

## ⚠️ Outro ponto importante:
- ao ser redirecionado para: `https://snipe.schulze.com.br/hardware` não será possível concluir a navegação, pois este sistema funciona apenas dentro da rede interna da empresa.
A versão publicada serve exclusivamente para conhecimento do projeto e como portfólio.
  


