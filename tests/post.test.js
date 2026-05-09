const PostService = require('../src/services/PostService');
const Post = require('../src/models/Post');

// Mock do modelo Post para não precisar de banco de dados real no teste unitário
jest.mock('../src/models/Post');

describe('PostService', () => {
  it('Deve criar uma postagem com sucesso', async () => {
    const postData = {
      titulo: 'Post de Teste',
      conteudo: 'Conteúdo de teste',
      autor: 'Ana Vitória'
    };

    Post.create.mockResolvedValue({ id: 1, ...postData });

    const result = await PostService.create(postData);

    expect(result.titulo).toBe(postData.titulo);
    expect(Post.create).toHaveBeenCalledWith(postData);
  });

  it('Deve retornar todas as postagens', async () => {
    Post.findAll.mockResolvedValue([{ id: 1, titulo: 'Post 1' }]);
    
    const result = await PostService.findAll();
    
    expect(result.length).toBeGreaterThan(0);
    expect(Array.isArray(result)).toBe(true);
  });
});