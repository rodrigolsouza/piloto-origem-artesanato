import { CriarProdutoDTO, Produto } from '@/types/produto';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export const produtosService = {
  // Busca produto individual pelo ID (GET /products/:id)
  async obterPorId(id: string): Promise<Produto | null> {
    try {
      const response = await fetch(`${API_URL}/products/${id}`, {
        cache: 'no-store',
      });

      if (!response.ok) {
        if (response.status === 404) return null;
        throw new Error('Falha ao carregar os dados do produto.');
      }

      const produto: Produto = await response.json();
      return produto;
    } catch (error) {
      console.error(`Erro ao buscar produto ${id}:`, error);
      throw error;
    }
  },

  // Cadastra um novo produto no catálogo (POST /products)
  async criar(payload: CriarProdutoDTO): Promise<Produto> {
    try {
      const response = await fetch(`${API_URL}/products`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...payload,
          // Garante a geração de metadados se o servidor mock não os gerar
          dataCriacao: new Date().toISOString(),
        }),
      });

      if (!response.ok) {
        throw new Error('Falha ao cadastrar produto na API.');
      }

      const novoProduto: Produto = await response.json();
      return novoProduto;
    } catch (error) {
      console.error('Erro ao enviar novo produto para o servidor:', error);
      throw error;
    }
  },
};