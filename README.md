Guia de Implantação (Deploy) do Projeto
1. Configurar Variáveis de Ambiente
Crie um arquivo .env na raiz do projeto e defina as seguintes variáveis:

- DATABASE_URL="postgresql://USUARIO:SENHA@HOST:PORTA/NOME_DO_BANCO?schema=public"
- PORT=3000
- API_URL=http://localhost:9001

1.1 - Configurar Variáveis de Ambiente Front via config.js
const CONFIG = {
  API_URL: "http://localhost:9001/",
  PORT_HISTORICO: "http://localhost:9000/" (a url padrao do site)
};

2. Instalar Dependências
Execute o comando:
- npm install

4. Sincronizar Banco de Dados
Execute os seguintes comandos na ordem:
- npx prisma migrate status
- npx prisma db pull
- npx prisma generate

5. Iniciar a Aplicação
Execute o comando:
- npm start
