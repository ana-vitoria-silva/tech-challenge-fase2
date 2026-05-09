const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Post = sequelize.define('Post', {
  // O Sequelize cria o ID automaticamente
  titulo: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true,
    }
  },
  conteudo: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  autor: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
  timestamps: true, // Cria colunas createdAt e updatedAt automaticamente
  tableName: 'posts'
});

module.exports = Post;