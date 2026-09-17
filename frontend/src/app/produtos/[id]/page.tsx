'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { 
  ArrowLeft, 
  MapPin, 
  ShieldCheck, 
  Truck, 
  RotateCcw, 
  CheckCircle2, 
  AlertCircle, 
  Star, 
  Heart, 
  Share2 
} from 'lucide-react';
import { Produto } from '@/types/produto';
import { produtosService } from '@/services/produtos.service';

export default function DetalhesProdutoPage() {
  const params = useParams();
  const id = params?.id as string;

  const [produto, setProduto] = useState<Produto | null>(null);
  const [carregando, setCarregando] = useState(true);
  const [imagemSelecionada, setImagemSelecionada] = useState<string>('');
  const [quantidade, setQuantidade] = useState<number>(1);

  useEffect(() => {
    async function carregar() {
      if (!id) return;
      try {
        setCarregando(true);
        const data = await produtosService.obterPorId(id);
        setProduto(data);
        if (data?.galeriaImagens?.length) {
          setImagemSelecionada(data.galeriaImagens[0]);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setCarregando(false);
      }
    }
    carregar();
  }, [id]);

  if (carregando) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-amber-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // Cenário 2 (PI4-69): Produto inativo ou não encontrado
  if (!produto || !produto.ativo) {
    return (
      <main className="min-h-screen bg-neutral-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-sm border border-neutral-200 text-center">
          <div className="w-16 h-16 bg-amber-100 text-amber-700 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle size={32} />
          </div>
          <h1 className="text-xl font-bold text-neutral-900 mb-2">Peça Indisponível</h1>
          <p className="text-sm text-neutral-600 mb-6">
            Esta peça artesanal foi desativada, está esgotada ou não pertence mais à vitrine oficial.
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 bg-neutral-900 text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-neutral-800 transition-colors"
          >
            <ArrowLeft size={16} /> Voltar para o catálogo
          </Link>
        </div>
      </main>
    );
  }

  // Cenário 1 (PI4-68): Layout completo correspondente ao protótipo
  return (
    <div className="min-h-screen bg-white text-neutral-800 font-sans pb-20">
      {/* Barra de Navegação Superior / Breadcrumb */}
      <nav className="border-b border-neutral-100 py-3 px-4 md:px-12 text-xs text-neutral-500 flex justify-between items-center max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <Link href="/" className="font-semibold text-neutral-900 flex items-center gap-1.5">
            <span className="text-amber-600 font-bold">✦</span> Origem Marketplace
          </Link>
          <span>/</span>
          <span>Catálogo</span>
          <span>/</span>
          <span className="text-neutral-900 font-medium truncate max-w-xs">{produto.titulo}</span>
        </div>
        <div className="flex items-center gap-3 text-neutral-400">
          <button title="Compartilhar" className="hover:text-neutral-700">
            <Share2 size={16} />
          </button>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 md:px-12 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* COLUNA ESQUERDA: Miniaturas Verticais + Foto Principal */}
          <div className="lg:col-span-7 flex flex-col-reverse md:flex-row gap-4">
            {/* Lista de Miniaturas (thumbnails à esquerda conforme protótipo) */}
            <div className="flex md:flex-col gap-3 overflow-x-auto md:overflow-y-auto">
              {produto.galeriaImagens.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setImagemSelecionada(img)}
                  className={`relative w-16 h-16 md:w-20 md:h-20 rounded-lg overflow-hidden border-2 transition-all flex-shrink-0 ${
                    imagemSelecionada === img ? 'border-amber-600 ring-2 ring-amber-100' : 'border-neutral-200 hover:border-neutral-300'
                  }`}
                >
                  <img src={img} alt={`Miniatura ${idx + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>

            {/* Imagem Principal */}
            <div className="flex-1 relative aspect-square bg-neutral-100 rounded-2xl overflow-hidden border border-neutral-100">
              <img
                src={imagemSelecionada || produto.galeriaImagens[0]}
                alt={produto.titulo}
                className="w-full h-full object-cover object-center"
              />
              <button 
                title="Favoritar" 
                className="absolute top-4 right-4 p-2.5 bg-white/80 backdrop-blur rounded-full text-neutral-600 hover:text-red-500 shadow-sm transition-colors"
              >
                <Heart size={18} />
              </button>
            </div>
          </div>

          {/* COLUNA DIREITA: Painel de Compra & Informações Culturais */}
          <div className="lg:col-span-5 space-y-6">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-neutral-900 leading-snug mb-3">
                {produto.titulo}
              </h1>

              {/* Informações do Artesão */}
              <div className="flex items-center justify-between pb-4 border-b border-neutral-100">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-full bg-amber-100 text-amber-900 font-bold flex items-center justify-center text-xs">
                    {produto.nomeArtesao.charAt(0)}
                  </div>
                  <div>
                    <span className="text-xs text-neutral-500 block">Feito à mão por</span>
                    <strong className="text-xs font-semibold text-neutral-900 underline underline-offset-2">
                      {produto.nomeArtesao}
                    </strong>
                  </div>
                </div>
                <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-1 rounded">
                  {produto.quantidadeEstoque} em estoque
                </span>
              </div>
            </div>

            {/* Preço e Badges de Modalidade */}
            <div>
              <div className="flex items-baseline gap-3 mb-2">
                <span className="text-3xl font-extrabold text-neutral-900">
                  R$ {produto.preco.toFixed(2).replace('.', ',')}
                </span>
                <span className="text-xs font-medium text-amber-900 bg-amber-100/70 px-2.5 py-1 rounded-full uppercase tracking-wider">
                  {produto.tipo === 'unico' ? 'Peça Única' : 'Produção em Lote'}
                </span>
              </div>
              <p className="text-xs text-neutral-400">Impostos e tributos inclusos</p>
            </div>

            <p className="text-xs text-neutral-600 leading-relaxed">
              {produto.descricao}
            </p>

            {/* Avaliação e Social Proof */}
            <div className="flex items-center gap-2 text-xs text-neutral-600 pt-1">
              <div className="flex text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={14} fill="currentColor" />
                ))}
              </div>
              <span className="font-semibold text-neutral-900">5.0</span>
              <span className="text-neutral-400">(Avaliação dos colecionadores)</span>
            </div>

            {/* Seletor de Quantidade e Botões de Ação */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center gap-3">
                <div className="flex items-center border border-neutral-300 rounded-lg overflow-hidden h-11">
                  <button
                    onClick={() => setQuantidade(Math.max(1, quantidade - 1))}
                    disabled={produto.tipo === 'unico'}
                    className="px-3 text-neutral-500 hover:bg-neutral-100 disabled:opacity-30 h-full"
                  >
                    -
                  </button>
                  <span className="px-4 text-xs font-bold text-neutral-800">
                    {produto.tipo === 'unico' ? 1 : quantidade}
                  </span>
                  <button
                    onClick={() => setQuantidade(Math.min(produto.quantidadeEstoque, quantidade + 1))}
                    disabled={produto.tipo === 'unico' || quantidade >= produto.quantidadeEstoque}
                    className="px-3 text-neutral-500 hover:bg-neutral-100 disabled:opacity-30 h-full"
                  >
                    +
                  </button>
                </div>

                <button className="flex-1 bg-[#D4E900] hover:bg-[#c2d600] text-neutral-950 font-bold text-xs uppercase tracking-wider py-3.5 px-4 rounded-lg transition-colors">
                  Adicionar ao Carrinho
                </button>
                <button className="flex-1 bg-neutral-950 hover:bg-neutral-800 text-white font-bold text-xs uppercase tracking-wider py-3.5 px-4 rounded-lg transition-colors">
                  Comprar Agora
                </button>
              </div>
            </div>

            {/* Estimativa de Frete / Prazo */}
            <div className="bg-neutral-50 p-4 rounded-xl border border-neutral-200 text-xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-neutral-700 flex items-center gap-1.5">
                  <Truck size={14} /> Envio de Origem
                </span>
                <span className="text-neutral-500">
                  {produto.prazoProducao === 0 ? 'Disponível para postagem imediata' : `Tempo de preparo: ${produto.prazoProducao} dias`}
                </span>
              </div>
            </div>

            {/* Card História do Artesão (Artisan Story conforme protótipo) */}
            <div className="p-4 rounded-xl border border-neutral-200 space-y-2">
              <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider block">
                História do Artesão
              </span>
              <p className="text-xs text-neutral-600 leading-relaxed">
                Produzido tradicionalmente pelas mãos de <strong>{produto.nomeArtesao}</strong>, preservando técnicas seculares que valorizam a identidade cultural de {produto.regiaoProducao}.
              </p>
            </div>

            {/* Origem Geográfica */}
            <div className="p-4 rounded-xl border border-neutral-200 flex items-center justify-between">
              <div>
                <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider block">
                  Polo de Origem
                </span>
                <span className="text-xs font-bold text-neutral-800 flex items-center gap-1 mt-0.5">
                  <MapPin size={13} className="text-amber-600" /> {produto.regiaoProducao}
                </span>
              </div>
              <span className="text-[11px] text-neutral-500">Pernambuco, Brasil</span>
            </div>

            {/* Garantias */}
            <div className="grid grid-cols-2 gap-3 pt-2 text-[11px] text-neutral-500">
              <div className="flex items-center gap-1.5">
                <ShieldCheck size={14} className="text-emerald-600" /> Peça Autêntica e Certificada
              </div>
              <div className="flex items-center gap-1.5">
                <RotateCcw size={14} className="text-emerald-600" /> Garantia de Envio Seguro
              </div>
            </div>
          </div>
        </div>

        {/* SEÇÃO INFERIOR: Especificações Técnicas e Guia de Cuidados */}
        <section className="mt-16 pt-10 border-t border-neutral-200">
          <h2 className="text-sm font-bold text-neutral-900 uppercase tracking-wider mb-6">
            Especificações da Peça & Cuidados
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-xs">
            <div className="space-y-2">
              <span className="font-semibold text-neutral-700 block">Dimensões & Peso</span>
              <p className="text-neutral-600">Altura: {produto.dimensoes.altura} cm</p>
              <p className="text-neutral-600">Largura: {produto.dimensoes.largura} cm</p>
              <p className="text-neutral-600">Profundidade: {produto.dimensoes.profundidade} cm</p>
              <p className="text-neutral-600">Peso Líquido: {produto.dimensoes.peso} kg</p>
            </div>

            <div className="space-y-2">
              <span className="font-semibold text-neutral-700 block">Materiais & Técnica</span>
              <p className="text-neutral-600"><strong>Matéria-prima:</strong> {produto.materiaPrima}</p>
              <p className="text-neutral-600"><strong>Técnica:</strong> {produto.tecnica}</p>
              <p className="text-neutral-600"><strong>SKU:</strong> {produto.sku}</p>
            </div>

            <div className="space-y-2">
              <span className="font-semibold text-neutral-700 block">Guia de Preservação</span>
              <p className="text-neutral-600 leading-relaxed bg-amber-50/50 p-3 rounded-lg border border-amber-100">
                {produto.guiaCuidados}
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}