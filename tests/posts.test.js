const request = require('supertest');

// ── Mocks ─────────────────────────────────────────────────────
// Mocka o Sequelize e o banco antes de qualquer import do app
jest.mock('../src/config/database', () => ({
  define: jest.fn(),
  sync: jest.fn().mockResolvedValue(true),
  authenticate: jest.fn().mockResolvedValue(true),
}));

jest.mock('../src/models/Post', () => ({
  create: jest.fn(),
  findAll: jest.fn(),
  findByPk: jest.fn(),
  update: jest.fn(),
  destroy: jest.fn(),
}));

jest.mock('../src/services/PostService', () => ({
  create: jest.fn(),
  findAll: jest.fn(),
  findById: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
  search: jest.fn(),
}));

// Importa APÓS os mocks estarem definidos
const app = require('../app');
const PostService = require('../src/services/PostService');

// ── Dados de teste ────────────────────────────────────────────
const postMock = {
  id: 1,
  titulo: 'Introdução à Matemática',
  conteudo: 'Conteúdo sobre frações e decimais',
  autor: 'Professora Ana',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

beforeEach(() => {
  jest.clearAllMocks();
});

// ─────────────────────────────────────────────────────────────
// POST /api/posts — Criar Postagem
// ─────────────────────────────────────────────────────────────
describe('POST /api/posts', () => {
  it('deve criar uma postagem com dados válidos e retornar 201', async () => {
    PostService.create.mockResolvedValue(postMock);

    const res = await request(app)
      .post('/api/posts')
      .send({ titulo: 'Introdução à Matemática', conteudo: 'Frações', autor: 'Professora Ana' });

    expect(res.status).toBe(201);
    expect(res.body.titulo).toBe('Introdução à Matemática');
    expect(res.body.autor).toBe('Professora Ana');
    expect(PostService.create).toHaveBeenCalledTimes(1);
  });

  it('deve retornar 400 quando o service lançar erro de validação', async () => {
    PostService.create.mockRejectedValue(new Error('titulo cannot be empty'));

    const res = await request(app)
      .post('/api/posts')
      .send({ conteudo: 'Sem título' });

    expect(res.status).toBe(400);
    expect(res.body.error).toBeDefined();
  });
});

// ─────────────────────────────────────────────────────────────
// GET /api/posts — Listar Postagens
// ─────────────────────────────────────────────────────────────
describe('GET /api/posts', () => {
  it('deve retornar lista vazia quando não há postagens', async () => {
    PostService.findAll.mockResolvedValue([]);

    const res = await request(app).get('/api/posts');

    expect(res.status).toBe(200);
    expect(res.body).toEqual([]);
  });

  it('deve retornar todas as postagens', async () => {
    const lista = [postMock, { ...postMock, id: 2, titulo: 'Aula de Português' }];
    PostService.findAll.mockResolvedValue(lista);

    const res = await request(app).get('/api/posts');

    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(2);
    expect(res.body[0].titulo).toBe('Introdução à Matemática');
  });
});

// ─────────────────────────────────────────────────────────────
// GET /api/posts/search — Busca por Palavra-chave
// ─────────────────────────────────────────────────────────────
describe('GET /api/posts/search', () => {
  it('deve encontrar postagens pelo termo no título', async () => {
    PostService.search.mockResolvedValue([postMock]);

    const res = await request(app).get('/api/posts/search?q=Matemática');

    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(1);
    expect(res.body[0].titulo).toContain('Matemática');
    expect(PostService.search).toHaveBeenCalledWith('Matemática');
  });

  it('deve retornar lista vazia para termo sem resultados', async () => {
    PostService.search.mockResolvedValue([]);

    const res = await request(app).get('/api/posts/search?q=termoinexistente');

    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(0);
  });
});

// ─────────────────────────────────────────────────────────────
// GET /api/posts/:id — Obter Postagem por ID
// ─────────────────────────────────────────────────────────────
describe('GET /api/posts/:id', () => {
  it('deve retornar uma postagem pelo ID', async () => {
    PostService.findById.mockResolvedValue(postMock);

    const res = await request(app).get('/api/posts/1');

    expect(res.status).toBe(200);
    expect(res.body.id).toBe(1);
    expect(res.body.titulo).toBe('Introdução à Matemática');
  });

  it('deve retornar 404 para ID inexistente', async () => {
    PostService.findById.mockResolvedValue(null);

    const res = await request(app).get('/api/posts/999');

    expect(res.status).toBe(404);
    expect(res.body.error).toBe('Postagem não encontrada');
  });
});

// ─────────────────────────────────────────────────────────────
// PUT /api/posts/:id — Editar Postagem
// ─────────────────────────────────────────────────────────────
describe('PUT /api/posts/:id', () => {
  it('deve editar uma postagem existente', async () => {
    const atualizado = { ...postMock, titulo: 'Título Atualizado' };
    PostService.update.mockResolvedValue(atualizado);

    const res = await request(app)
      .put('/api/posts/1')
      .send({ titulo: 'Título Atualizado' });

    expect(res.status).toBe(200);
    expect(res.body.titulo).toBe('Título Atualizado');
  });

  it('deve retornar 404 ao editar postagem inexistente', async () => {
    PostService.update.mockResolvedValue(null);

    const res = await request(app)
      .put('/api/posts/999')
      .send({ titulo: 'Novo título' });

    expect(res.status).toBe(404);
    expect(res.body.error).toBe('Postagem não encontrada');
  });
});

// ─────────────────────────────────────────────────────────────
// DELETE /api/posts/:id — Excluir Postagem
// ─────────────────────────────────────────────────────────────
describe('DELETE /api/posts/:id', () => {
  it('deve excluir uma postagem existente e retornar 204', async () => {
    PostService.delete.mockResolvedValue(true);

    const res = await request(app).delete('/api/posts/1');

    expect(res.status).toBe(204);
    expect(PostService.delete).toHaveBeenCalledWith('1');
  });

  it('deve retornar 404 ao excluir postagem inexistente', async () => {
    PostService.delete.mockResolvedValue(false);

    const res = await request(app).delete('/api/posts/999');

    expect(res.status).toBe(404);
    expect(res.body.error).toBe('Postagem não encontrada');
  });
});
