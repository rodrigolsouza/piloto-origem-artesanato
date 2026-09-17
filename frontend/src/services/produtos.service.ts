import { Produto } from '@/types/produto';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export const produtosService = {
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
};