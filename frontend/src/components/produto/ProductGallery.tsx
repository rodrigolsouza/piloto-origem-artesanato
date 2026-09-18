'use client';

import React, { useState } from 'react';
import { Box, Flex, Image } from '@chakra-ui/react';

interface ProductGalleryProps {
  imagens?: string[];
  titulo: string;
}

export function ProductGallery({ imagens = [], titulo }: ProductGalleryProps) {
  const lista = imagens.length > 0 
    ? imagens 
    : ['https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=1000&q=80'];

  const [imagemAtiva, setImagemAtiva] = useState(lista[0]);

  return (
    <Box w="full">
      {/* Imagem Principal */}
      <Box 
        borderRadius="2xl" 
        overflow="hidden" 
        borderWidth="1px" 
        borderColor="gray.200" 
        bg="gray.50" 
        mb={3}
        position="relative"
        pt="75%"
      >
        <Image
          src={imagemAtiva}
          alt={titulo}
          position="absolute"
          top={0}
          left={0}
          w="full"
          h="full"
          objectFit="cover"
          fallbackSrc="https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=1000&q=80"
        />
      </Box>

      {/* Miniaturas com Proporção Quadrada Rígida */}
      {lista.length > 1 && (
        <Flex gap={3} overflowX="auto" pb={2}>
          {lista.map((img, idx) => {
            const isAtiva = (imagemAtiva || lista[0]) === img;
            return (
              <Box
                key={idx}
                as="button"
                type="button"
                onClick={() => setImagemAtiva(img)}
                w="72px"
                h="72px"
                minW="72px"
                borderRadius="lg"
                overflow="hidden"
                borderWidth="2px"
                borderColor={isAtiva ? '#F2C83B' : 'transparent'}
                opacity={isAtiva ? 1 : 0.6}
                _hover={{ opacity: 1 }}
                transition="all 0.2s"
                position="relative"
                bg="gray.100"
              >
                <Image
                  src={img}
                  alt={`Miniatura ${idx + 1}`}
                  w="full"
                  h="full"
                  objectFit="cover"
                />
              </Box>
            );
          })}
        </Flex>
      )}
    </Box>
  );
}