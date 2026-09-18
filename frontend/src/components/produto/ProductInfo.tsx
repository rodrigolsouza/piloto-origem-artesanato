'use client';

import React, { useState } from 'react';
import { Box, Flex, Text, Badge } from '@chakra-ui/react';
import { MapPin, ShoppingBag, ShieldCheck, Truck } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Produto } from '@/types/produto';

interface ProductInfoProps {
  produto: Produto;
}

export function ProductInfo({ produto }: ProductInfoProps) {
  const [quantidade, setQuantidade] = useState(1);
  const isUnico = produto.tipo === 'unico';

  return (
    <Box>
      <Flex align="center" gap={2} mb={2}>
        <Badge bg="gray.100" color="gray.700" fontSize="2xs" px={2} py={0.5} borderRadius="md">
          {produto.categoria}
        </Badge>
        <Flex align="center" gap={1} color="gray.500" fontSize="2xs">
          <MapPin size={12} color="#C25E2E" />
          <Text>{produto.regiaoProducao}</Text>
        </Flex>
      </Flex>

      <Text fontSize={{ base: 'xl', md: '2xl' }} fontWeight="extrabold" color="gray.900" mb={1} lineHeight="shorter">
        {produto.titulo}
      </Text>
      <Text fontSize="xs" color="gray.500" mb={4}>
        Criado por <strong>{produto.nomeArtesao}</strong>
      </Text>

      <Box p={4} bg="gray.50" borderRadius="xl" borderWidth="1px" borderColor="gray.100" mb={6}>
        <Text fontSize="2xs" color="gray.400" textTransform="uppercase" fontWeight="bold">Preço à vista</Text>
        <Text fontSize="2xl" fontWeight="black" color="gray.900">
          R$ {produto.preco.toFixed(2).replace('.', ',')}
        </Text>
        <Text fontSize="2xs" color="gray.500" mt={1}>
          {isUnico ? '✦ Obra autoral exclusiva (Apenas 1 unidade existente)' : `Em estoque: ${produto.quantidadeEstoque} peças`}
        </Text>
      </Box>

      {!isUnico && (
        <Flex align="center" gap={3} mb={6}>
          <Text fontSize="xs" fontWeight="semibold" color="gray.700">Quantidade:</Text>
          <Flex align="center" borderWidth="1px" borderColor="gray.200" borderRadius="lg" bg="white">
            <Box
              as="button"
              px={3}
              py={1.5}
              onClick={() => setQuantidade((q) => Math.max(1, q - 1))}
              disabled={quantidade <= 1}
              _disabled={{ opacity: 0.3, cursor: 'not-allowed' }}
              fontWeight="bold"
            >
              -
            </Box>
            <Text px={3} py={1.5} fontSize="xs" fontWeight="bold">
              {quantidade}
            </Text>
            <Box
              as="button"
              px={3}
              py={1.5}
              onClick={() => setQuantidade((q) => Math.min(produto.quantidadeEstoque, q + 1))}
              disabled={quantidade >= produto.quantidadeEstoque}
              _disabled={{ opacity: 0.3, cursor: 'not-allowed' }}
              fontWeight="bold"
            >
              +
            </Box>
          </Flex>
        </Flex>
      )}

      <Flex direction="column" gap={3} mb={6}>
        <Button variantStyle="accent" w="full" leftIcon={<ShoppingBag size={16} />}>
          Adicionar ao Carrinho
        </Button>
      </Flex>

      <Flex direction="column" gap={2} pt={4} borderTopWidth="1px" borderColor="gray.100" fontSize="2xs" color="gray.500">
        <Flex align="center" gap={2}>
          <Truck size={14} color="#C25E2E" />
          <Text>
            {produto.prazoProducao === 0 
              ? 'Pronta entrega: enviado em até 24h úteis' 
              : `Prazo de produção e postagem: ${produto.prazoProducao} dias úteis`}
          </Text>
        </Flex>
        <Flex align="center" gap={2}>
          <ShieldCheck size={14} color="#38A169" />
          <Text>Garantia de autenticidade artesanal de Pernambuco</Text>
        </Flex>
      </Flex>
    </Box>
  );
}