'use client';

import React from 'react';
import Link from 'next/link';
import { Box, Flex, Text, Badge } from '@chakra-ui/react';

export function Navbar() {
  return (
    <header style={{ position: 'sticky', top: 0, zIndex: 50, backgroundColor: '#ffffff', borderBottom: '1px solid #E2E8F0' }}>
      <Flex maxW="7xl" mx="auto" px={{ base: 4, lg: 8 }} h="16" align="center" justify="space-between">
        <Flex align="center" gap={3}>
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Flex w={8} h={8} borderRadius="lg" bg="brand.yellow" color="brand.dark" align="center" justify="center" fontWeight="black" fontSize="md">
              ✦
            </Flex>
            <Text fontWeight="extrabold" fontSize="sm" color="gray.900" letterSpacing="tight">
              PernambucoCrafts
            </Text>
          </Link>
          <Text color="gray.300">|</Text>
          <Badge bg="gray.100" color="gray.700" fontSize="2xs" px={2} py={0.5} borderRadius="md">
            Painel do Artesão
          </Badge>
        </Flex>

        <Flex align="center" gap={4}>
          <Link href="/" style={{ fontSize: '12px', fontWeight: 600, color: '#4A5568' }}>
            Vitrine
          </Link>
          <Flex align="center" gap={2}>
            <Flex w={7} h={7} borderRadius="full" bg="brand.dark" color="white" align="center" justify="center" fontSize="xs" fontWeight="bold">
              M
            </Flex>
            <Text fontSize="xs" fontWeight="semibold" color="gray.800">
              Mestre Artesão
            </Text>
          </Flex>
        </Flex>
      </Flex>
    </header>
  );
}