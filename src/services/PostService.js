const Post = require('../models/Post');
const { Op } = require('sequelize');

class PostService {
  async create(data) {
    return await Post.create(data);
  }

  async findAll() {
    return await Post.findAll({ order: [['createdAt', 'DESC']] });
  }

  async findById(id) {
    return await Post.findByPk(id);
  }

  async update(id, data) {
    const post = await Post.findByPk(id);
    if (!post) return null;
    return await post.update(data);
  }

  async delete(id) {
    const post = await Post.findByPk(id);
    if (!post) return false;
    await post.destroy();
    return true;
  }

  // Lógica de busca por palavra-chave (Requisito do Desafio)
  async search(query) {
    return await Post.findAll({
      where: {
        [Op.or]: [
          { titulo: { [Op.iLike]: `%${query}%` } },
          { conteudo: { [Op.iLike]: `%${query}%` } }
        ]
      }
    });
  }
}

module.exports = new PostService();