export type TipoProduto = 'unico' | 'lote';

export interface DimensoesProduto {
  altura: number; // em cm
  largura: number; // em cm
  profundidade: number; // em cm
  peso: number; // em kg
}

export interface Produto {
  id: string;
  sku: string;
  titulo: string;
  descricao: string;
  materiaPrima: string;
  tecnica: string;
  regiaoProducao: string;
  categoria: string;
  preco: number;
  tipo: TipoProduto;
  quantidadeEstoque: number;
  idArtesao: string;
  nomeArtesao: string;
  dimensoes: DimensoesProduto;
  guiaCuidados: string;
  galeriaImagens: string[];
  prazoProducao: number; // em dias úteis
  ativo: boolean;
  dataCriacao?: string;
}

export type CriarProdutoDTO = Omit<Produto, 'id' | 'dataCriacao'>;
export type AtualizarProdutoDTO = Partial<Omit<Produto, 'id' | 'idArtesao'>>;