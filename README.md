Guia de Implantação (Deploy) do Projeto
1. Configurar Variáveis de Ambiente
Crie um arquivo .env na raiz do projeto e defina as seguintes variáveis:

- DATABASE_URL="postgresql://USUARIO:SENHA@HOST:PORTA/NOME_DO_BANCO?schema=public"
- PORT=3000

2. Instalar Dependências
Execute o comando:
- npm install

3. Sincronizar Banco de Dados
Execute os seguintes comandos no path:  mapa-site-novo/server/data/prisma, na ordem:
- npx prisma migrate status
- npx prisma db pull
- npx prisma generate

4. Iniciar a Aplicação
Execute o comando:
- npm start
