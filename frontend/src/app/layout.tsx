import type { Metadata } from 'next';
import './globals.css';
import { ChakraProviders } from '@/components/ui/ChakraProviders';
import { Navbar } from '@/components/layout/Navbar';

export const metadata: Metadata = {
  title: 'PernambucoCrafts - Marketplace de Artesanato',
  description: 'Valorizando a identidade cultural e a economia criativa de Pernambuco',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body style={{ backgroundColor: '#FAFAFA', minHeight: '100vh', margin: 0 }}>
        <ChakraProviders>
          <Navbar />
          <main>{children}</main>
        </ChakraProviders>
      </body>
    </html>
  );
}