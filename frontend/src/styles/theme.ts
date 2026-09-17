import { extendTheme, type ThemeConfig } from '@chakra-ui/react';

const config: ThemeConfig = {
  initialColorMode: 'light',
  useSystemColorMode: false,
};

export const theme = extendTheme({
  config,
  colors: {
    brand: {
      yellow: '#D4E900', // Destaque dos botões de ação do protótipo
      yellowHover: '#c2d600',
      dark: '#121212',   // Botões escuros e textos principais
      clay: '#C25E2E',   // Terracota / Barro regional
      bg: '#FAFAFA',
      border: '#E5E7EB',
    },
  },
  fonts: {
    heading: `'Inter', -apple-system, BlinkMacSystemFont, sans-serif`,
    body: `'Inter', -apple-system, BlinkMacSystemFont, sans-serif`,
  },
});