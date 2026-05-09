const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(
  process.env.DB_NAME || 'blog_educacional',
  process.env.DB_USER || 'admin',
  process.env.DB_PASSWORD || 'password123',
  {
    host: process.env.DB_HOST || 'localhost',
    dialect: 'postgres',
    logging: false, // Para não poluir o terminal com SQL puro
  }
);

module.exports = sequelize;