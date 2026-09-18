import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Box, Grid, Text } from '@chakra-ui/react';
import { ArrowLeft } from 'lucide-react';
import { produtosService } from '@/services/produtos.service';
import { ProductGallery } from '@/components/produto/ProductGallery';
import { ProductInfo } from '@/components/produto/ProductInfo';
import { ProductSpecs } from '@/components/produto/ProductSpecs';

interface ProdutoPageProps {
  params: Promise<{ id: string }>;
}

export default async function ProdutoDetalhePage({ params }: ProdutoPageProps) {
  const { id } = await params;
  const produto = await produtosService.obterPorId(id);

  if (!produto) {
    notFound();
  }

  return (
    <Box maxW="7xl" mx="auto" px={{ base: 4, lg: 8 }} py={8}>
      <Box mb={6}>
        <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '12px', fontWeight: 600, color: '#718096' }}>
          <ArrowLeft size={14} /> Voltar para a vitrine
        </Link>
      </Box>

      <Grid templateColumns={{ base: '1fr', lg: 'repeat(12, 1fr)' }} gap={10} mb={10} alignItems="start">
        <Box gridColumn={{ lg: 'span 7' }}>
          <ProductGallery imagens={produto.galeriaImagens} titulo={produto.titulo} />
        </Box>

        <Box gridColumn={{ lg: 'span 5' }} bg="white" p={6} borderRadius="2xl" borderWidth="1px" borderColor="gray.200" boxShadow="sm">
          <ProductInfo produto={produto} />
        </Box>
      </Grid>

      <Grid templateColumns={{ base: '1fr', lg: 'repeat(12, 1fr)' }} gap={8}>
        <Box gridColumn={{ lg: 'span 7' }} bg="white" p={6} borderRadius="2xl" borderWidth="1px" borderColor="gray.200" boxShadow="sm">
          <Text fontSize="sm" fontWeight="bold" color="gray.900" mb={3} pb={2} borderBottomWidth="1px" borderColor="gray.100">
            História & Significado Cultural
          </Text>
          <Text fontSize="xs" color="gray.700" lineHeight="tall">
            {produto.descricao}
          </Text>
        </Box>

        <Box gridColumn={{ lg: 'span 5' }}>
          <ProductSpecs produto={produto} />
        </Box>
      </Grid>
    </Box>
  );
}