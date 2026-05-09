# Tech Challenge Fase 2 - Blog Educacional

Este repositório contém uma API simples de blog usando Node.js, Express e Sequelize + Postgres.

Resumo rápido:
- App: Node.js + Express
- DB: PostgreSQL (rodando via Docker Compose ou localmente)

Como rodar

Opção A — Usando Docker Compose (recomendado)
1. Subir containers (inicia o Postgres e a aplicação dentro da mesma rede):

   docker compose up -d --build

2. Ver logs do app:

   docker compose logs -f app

3. Parar e remover containers:

   docker compose down

Observações:
- A app estará disponível em http://localhost:3000 por padrão.
- O serviço `app` usa o arquivo `.env` que está no repositório. Se quiser rodar a aplicação fora do container, ajuste `DB_HOST` no `.env` para `localhost`.

Opção B — Rodar a aplicação localmente (sem Docker)
1. Instale dependências:

   npm install

2. Configure variáveis em `.env` (exemplo já presente no repositório). Se estiver usando o Postgres do Docker Compose, defina `DB_HOST=db` e rode a app dentro do Compose (Opção A). Para rodar localmente com um Postgres no host, use `DB_HOST=localhost`.

3. Iniciar em modo desenvolvimento (com hot-reload via nodemon):

   npm run dev

4. Iniciar em produção:

   npm start

Testes

Executar a suíte de testes unitários (Jest):

   npm test

Notas

- O Sequelize está configurado para sincronizar modelos automaticamente (`sequelize.sync`) — atenção ao uso de `force: true` (não usado aqui) porque ele apaga os dados.
- Se você tiver problemas de resolução do host `db` ao rodar a aplicação localmente, prefira rodar com Docker Compose (Opção A) ou ajuste `DB_HOST` para `localhost`.

Se precisar, posso adicionar um `.env.example` com as variáveis necessárias.
