'use client';

import React from 'react';
import Link from 'next/link';
import { Box, Image, Text, Badge, Flex } from '@chakra-ui/react';
import { MapPin } from 'lucide-react';

export interface ProductCardProps {
  id?: string;
  titulo: string;
  preco: number | string;
  regiaoProducao: string;
  nomeArtesao: string;
  tipo: 'unico' | 'lote';
  imagemUrl?: string;
  isLink?: boolean;
}

export function ProductCard({
  id,
  titulo,
  preco,
  regiaoProducao,
  nomeArtesao,
  tipo,
  imagemUrl,
  isLink = true,
}: ProductCardProps) {
  const precoFormatado = typeof preco === 'number'
    ? `R$ ${preco.toFixed(2).replace('.', ',')}`
    : preco ? `R$ ${parseFloat(preco).toFixed(2).replace('.', ',')}` : 'R$ 0,00';

  const CardContent = (
    <Box
      bg="white"
      borderWidth="1px"
      borderColor="gray.200"
      borderRadius="2xl"
      overflow="hidden"
      boxShadow="sm"
      transition="all 0.2s"
      _hover={{ boxShadow: 'md' }}
      display="flex"
      flexDirection="column"
      h="full"
    >
      <Box position="relative" w="full" pt="100%" bg="gray.100" overflow="hidden">
        <Image
          src={imagemUrl || 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=800&q=80'}
          alt={titulo || 'Peça artesanal'}
          position="absolute"
          top={0}
          left={0}
          w="full"
          h="full"
          objectFit="cover"
        />
        <Badge
          position="absolute"
          top={3}
          left={3}
          bg="whiteAlpha.900"
          color="gray.800"
          fontSize="2xs"
          fontWeight="bold"
          borderRadius="md"
          px={2}
          py={0.5}
        >
          {tipo === 'unico' ? 'Peça Única' : 'Lote'}
        </Badge>
      </Box>

      <Flex direction="column" p={4} flex="1">
        <Flex align="center" gap={1} color="gray.400" fontSize="2xs" mb={1}>
          <MapPin size={12} color="#C25E2E" />
          <Text>{regiaoProducao || 'Pernambuco'}</Text>
        </Flex>

        <Text fontWeight="bold" fontSize="xs" color="gray.900" noOfLines={1} mb={0.5}>
          {titulo || 'Sem título'}
        </Text>

        <Text fontSize="2xs" color="gray.500" mb={3}>
          Por {nomeArtesao || 'Mestre Artesão'}
        </Text>

        <Flex mt="auto" pt={2} borderTopWidth="1px" borderColor="gray.100" align="center" justify="space-between">
          <Text fontWeight="extrabold" fontSize="sm" color="gray.900">
            {precoFormatado}
          </Text>
          <Badge colorScheme="amber" variant="subtle" fontSize="2xs" borderRadius="md">
            {tipo === 'unico' ? '1 un. disponível' : 'Em estoque'}
          </Badge>
        </Flex>
      </Flex>
    </Box>
  );

  if (isLink && id) {
    return (
      <Link href={`/produtos/${id}`} style={{ display: 'block', height: '100%' }}>
        {CardContent}
      </Link>
    );
  }

  return CardContent;
}