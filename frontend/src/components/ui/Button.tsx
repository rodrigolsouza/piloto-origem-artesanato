'use client';

import React from 'react';
import { Button as ChakraButton, ButtonProps as ChakraButtonProps } from '@chakra-ui/react';

export interface CustomButtonProps extends ChakraButtonProps {
  variantStyle?: 'accent' | 'primary' | 'secondary' | 'danger';
}

export function Button({
  children,
  variantStyle = 'accent',
  isLoading,
  ...props
}: CustomButtonProps) {
  const styleVariants = {
    accent: {
      bg: 'brand.yellow',
      color: 'brand.dark',
      _hover: { bg: 'brand.yellowHover' },
    },
    primary: {
      bg: 'brand.dark',
      color: 'white',
      _hover: { bg: 'blackAlpha.800' },
    },
    secondary: {
      bg: 'gray.100',
      color: 'gray.800',
      _hover: { bg: 'gray.200' },
    },
    danger: {
      bg: 'red.500',
      color: 'white',
      _hover: { bg: 'red.600' },
    },
  };

  return (
    <ChakraButton
      {...styleVariants[variantStyle]}
      fontSize="xs"
      fontWeight="bold"
      textTransform="uppercase"
      letterSpacing="wider"
      py={6}
      px={6}
      borderRadius="lg"
      isLoading={isLoading}
      {...props}
    >
      {children}
    </ChakraButton>
  );
}