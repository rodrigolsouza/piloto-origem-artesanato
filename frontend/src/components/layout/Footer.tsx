'use client';

import React from 'react';
import Link from 'next/link';
import { Box, Flex, Text, Grid } from '@chakra-ui/react';

export function Footer() {
  return (
    <Box as="footer" bg="white" borderTopWidth="1px" borderColor="gray.200" mt={16} py={10}>
      <Box maxW="7xl" mx="auto" px={{ base: 4, lg: 8 }}>
        <Grid templateColumns={{ base: '1fr', md: '2fr 1fr 1fr' }} gap={8} mb={8}>
          <Box>
            <Flex align="center" gap={2} mb={3}>
              <Flex w={6} h={6} borderRadius="md" bg="brand.yellow" color="brand.dark" align="center" justify="center" fontWeight="black" fontSize="xs">
                ✦
              </Flex>
              <Text fontWeight="extrabold" fontSize="sm" color="gray.900" letterSpacing="tight">
                PernambucoCrafts
              </Text>
            </Flex>
            <Text fontSize="xs" color="gray.500" maxW="sm" lineHeight="tall">
              Plataforma dedicada à valorização cultural e comercialização sustentável do artesanato autêntico pernambucano.
            </Text>
          </Box>

          <Box>
            <Text fontSize="xs" fontWeight="bold" color="gray.800" textTransform="uppercase" mb={3}>
              Marketplace
            </Text>
            <Flex direction="column" gap={2} fontSize="xs" color="gray.600">
              <Link href="/">Vitrine Cultural</Link>
              <Link href="/artesoes">Mestres Artesãos</Link>
              <Link href="/painel-artesao/pedidos">Painel de Pedidos</Link>
            </Flex>
          </Box>

          <Box>
            <Text fontSize="xs" fontWeight="bold" color="gray.800" textTransform="uppercase" mb={3}>
              Suporte
            </Text>
            <Flex direction="column" gap={2} fontSize="xs" color="gray.600">
              <Link href="#">Diretrizes da Comunidade</Link>
              <Link href="#">Autenticidade e Selos</Link>
              <Link href="#">Termos de Uso</Link>
            </Flex>
          </Box>
        </Grid>

        <Box pt={6} borderTopWidth="1px" borderColor="gray.100" textAlign="center">
          <Text fontSize="2xs" color="gray.400">
            © {new Date().getFullYear()} PernambucoCrafts. Todos os direitos reservados.
          </Text>
        </Box>
      </Box>
    </Box>
  );
}