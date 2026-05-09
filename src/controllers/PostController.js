const PostService = require('../services/PostService');

class PostController {
  async store(req, res) {
    try {
      const post = await PostService.create(req.body);
      return res.status(201).json(post);
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }

  async index(req, res) {
    const posts = await PostService.findAll();
    return res.json(posts);
  }

  async show(req, res) {
    const post = await PostService.findById(req.params.id);
    if (!post) return res.status(404).json({ error: 'Postagem não encontrada' });
    return res.json(post);
  }

  async update(req, res) {
    const post = await PostService.update(req.params.id, req.body);
    if (!post) return res.status(404).json({ error: 'Postagem não encontrada' });
    return res.json(post);
  }

  async delete(req, res) {
    const deleted = await PostService.delete(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Postagem não encontrada' });
    return res.status(204).send();
  }

  async search(req, res) {
    const { q } = req.query;
    const posts = await PostService.search(q);
    return res.json(posts);
  }
}

module.exports = new PostController();