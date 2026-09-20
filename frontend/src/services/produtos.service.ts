import { Produto, CriarProdutoDTO } from '@/types/produto';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export const produtosService = {
  async listar(): Promise<Produto[]> {
    try {
      const res = await fetch(`${API_BASE_URL}/produtos`, { cache: 'no-store' });
      if (!res.ok) return [];
      return await res.json();
    } catch {
      return [];
    }
  },

  async obterPorId(id: string): Promise<Produto | null> {
    try {
      const res = await fetch(`${API_BASE_URL}/produtos/${id}`, { cache: 'no-store' });
      if (!res.ok) return null;
      return await res.json();
    } catch {
      return null;
    }
  },

  async criar(payload: CriarProdutoDTO): Promise<Produto> {
    // 1. Busca todos os produtos para calcular o próximo número sequencial
    const produtos = await this.listar();

    let proximoNumero = 1;
    produtos.forEach((prod) => {
      const match = prod.id?.match(/^prod-(\d+)$/i);
      if (match) {
        const num = parseInt(match[1], 10);
        if (num >= proximoNumero) {
          proximoNumero = num + 1;
        }
      }
    });

    const proximoId = `prod-${String(proximoNumero).padStart(3, '0')}`;

    // 2. Padroniza o SKU caso venha vazio ou informado (ex: car-bar-005 ou lot-005)
    const prefixo = payload.tipo === 'unico' ? 'car-bar' : 'lot';
    const skuFinal = payload.sku?.trim() 
      ? payload.sku.trim().toLowerCase() 
      : `${prefixo}-${String(proximoNumero).padStart(3, '0')}`;

    const objetoCompleto = {
      ...payload,
      id: proximoId,
      sku: skuFinal,
    };

    // 3. Envia o POST com o ID explícito
    const res = await fetch(`${API_BASE_URL}/produtos`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(objetoCompleto),
    });

    if (!res.ok) {
      throw new Error('Falha ao registrar produto na Fake API.');
    }

    const produtoSalvo = await res.json();

    // 4. Se o JSON Server v1 insistiu em trocar o ID por um hash interno,
    // garantimos que o retorno use o ID sequencial pretendido:
    return {
      ...produtoSalvo,
      id: objetoCompleto.id,
      sku: objetoCompleto.sku,
    };
  },

  async atualizar(id: string, payload: Partial<CriarProdutoDTO>): Promise<Produto> {
    const res = await fetch(`${API_BASE_URL}/produtos/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      throw new Error('Falha ao atualizar produto na Fake API.');
    }

    return await res.json();
  },
};