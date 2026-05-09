require('dotenv').config();
const express = require('express');
const sequelize = require('./src/config/database');
const Post = require('./src/models/Post');
const postRoutes = require('./src/routes/postRoutes');

const app = express();
app.use(express.json()); // Para aceitar JSON no corpo das requisições

app.use('/api', postRoutes);

const PORT = process.env.PORT || 3000;

// Sincronizar banco de dados e subir servidor
sequelize.sync({ force: false }) // 'force: false' evita apagar os dados toda vez que reinicia
  .then(() => {
    console.log('Banco de dados conectado com sucesso!');
    app.listen(PORT, () => {
      console.log(`Servidor rodando na porta ${PORT}`);
    });
  })
  .catch(err => {
    console.error('Erro ao conectar ao banco:', err);
  });