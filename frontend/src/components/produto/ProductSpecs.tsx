'use client';

import React from 'react';
import { Box, Grid, Text } from '@chakra-ui/react';
import { Produto } from '@/types/produto';

interface ProductSpecsProps {
  produto: Produto;
}

export function ProductSpecs({ produto }: ProductSpecsProps) {
  const specs = [
    { label: 'Matéria-Prima', valor: produto.materiaPrima },
    { label: 'Técnica Empregada', valor: produto.tecnica },
    { label: 'Dimensões (A x L x P)', valor: `${produto.dimensoes.altura} x ${produto.dimensoes.largura} x ${produto.dimensoes.profundidade} cm` },
    { label: 'Peso Estimado', valor: `${produto.dimensoes.peso} kg` },
    { label: 'Código SKU', valor: produto.sku },
  ];

  return (
    <Box bg="white" p={6} borderRadius="2xl" borderWidth="1px" borderColor="gray.200" boxShadow="sm">
      <Text fontSize="sm" fontWeight="bold" color="gray.900" mb={4} pb={2} borderBottomWidth="1px" borderColor="gray.100">
        Especificações Técnicas
      </Text>

      <Grid templateColumns={{ base: '1fr', sm: 'repeat(2, 1fr)' }} gap={4} mb={6}>
        {specs.map((item, idx) => (
          <Box key={idx}>
            <Text fontSize="2xs" color="gray.400" textTransform="uppercase" fontWeight="bold">
              {item.label}
            </Text>
            <Text fontSize="xs" fontWeight="medium" color="gray.800" mt={0.5}>
              {item.valor || 'Não informado'}
            </Text>
          </Box>
        ))}
      </Grid>

      {produto.guiaCuidados && (
        <Box pt={4} borderTopWidth="1px" borderColor="gray.100">
          <Text fontSize="2xs" color="gray.400" textTransform="uppercase" fontWeight="bold" mb={1}>
            Instruções e Cuidados
          </Text>
          <Text fontSize="xs" color="gray.600" lineHeight="tall">
            {produto.guiaCuidados}
          </Text>
        </Box>
      )}
    </Box>
  );
}