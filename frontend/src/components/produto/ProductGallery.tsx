'use client';

import React, { useState } from 'react';
import { Box, Image, Grid } from '@chakra-ui/react';

interface ProductGalleryProps {
  imagens: string[];
  titulo: string;
}

export function ProductGallery({ imagens, titulo }: ProductGalleryProps) {
  const fotosValidas = imagens && imagens.length > 0 
    ? imagens 
    : ['https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=800&q=80'];

  const [imagemAtiva, setImagemAtiva] = useState(fotosValidas[0]);

  return (
    <Box>
      <Box
        position="relative"
        pt="100%"
        borderRadius="2xl"
        overflow="hidden"
        bg="gray.100"
        borderWidth="1px"
        borderColor="gray.200"
        boxShadow="sm"
        mb={4}
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
          transition="all 0.3s ease"
        />
      </Box>

      {fotosValidas.length > 1 && (
        <Grid templateColumns="repeat(4, 1fr)" gap={3}>
          {fotosValidas.map((img, idx) => (
            <Box
              key={idx}
              as="button"
              type="button"
              position="relative"
              pt="100%"
              borderRadius="lg"
              overflow="hidden"
              borderWidth="2px"
              borderColor={imagemAtiva === img ? 'brand.yellow' : 'gray.200'}
              onClick={() => setImagemAtiva(img)}
              transition="all 0.2s"
              _hover={{ borderColor: 'gray.400' }}
            >
              <Image
                src={img}
                alt={`${titulo} miniatura ${idx + 1}`}
                position="absolute"
                top={0}
                left={0}
                w="full"
                h="full"
                objectFit="cover"
              />
            </Box>
          ))}
        </Grid>
      )}
    </Box>
  );
}