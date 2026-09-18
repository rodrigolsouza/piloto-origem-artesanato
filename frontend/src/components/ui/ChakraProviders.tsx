'use client';

import React, { useState, useEffect } from 'react';
import { ChakraProvider } from '@chakra-ui/react';
import { theme } from '@/styles/theme';

export function ChakraProviders({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Enquanto o SSR renderiza, retorna os filhos puros sem injetar nós dinâmicos
  if (!mounted) {
    return <div style={{ visibility: 'hidden' }}>{children}</div>;
  }

  return (
    <ChakraProvider theme={theme}>
      {children}
    </ChakraProvider>
  );
}