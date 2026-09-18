import type { Metadata } from 'next';
import './globals.css';
import { ChakraProviders } from '@/components/ui/ChakraProviders';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';

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
    <html lang="pt-BR" suppressHydrationWarning>
      <body suppressHydrationWarning style={{ backgroundColor: '#FAFAFA', minHeight: '100vh', margin: 0, display: 'flex', flexDirection: 'column' }}>
        <ChakraProviders>
          <Navbar />
          <main style={{ flex: 1 }}>{children}</main>
          <Footer />
        </ChakraProviders>
      </body>
    </html>
  );
}