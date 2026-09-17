#!/bin/bash

echo "🚀 Iniciando a estruturação do Projeto Origem (Frontend - Entrega 1)..."

# 1. Dependências visuais e utilitárias
echo "📦 Instalando lucide-react, clsx e tailwind-merge..."
npm install lucide-react clsx tailwind-merge

# 2. Rotas do App Router (conforme o documento do Notion)
echo "📁 Criando rotas em src/app/..."
mkdir -p src/app/login
mkdir -p src/app/cadastro
mkdir -p src/app/produtos/\[id\]
mkdir -p src/app/artesoes/\[id\]
mkdir -p src/app/carrinho
mkdir -p src/app/pedidos/\[id\]
mkdir -p src/app/painel-artesao/produtos
mkdir -p src/app/painel-artesao/estoque
mkdir -p src/app/painel-artesao/pedidos
mkdir -p src/app/admin/indicadores
mkdir -p src/app/admin/produtos
mkdir -p src/app/admin/artesoes
mkdir -p src/app/admin/pedidos

# 3. Componentes estruturados por domínio
echo "📁 Criando pastas em src/components/..."
mkdir -p src/components/ui
mkdir -p src/components/layout
mkdir -p src/components/produto
mkdir -p src/components/artesao
mkdir -p src/components/carrinho
mkdir -p src/components/pedido
mkdir -p src/components/forms
mkdir -p src/components/feedback

# 4. Camadas de arquitetura (Clean Architecture / Separação de Responsabilidade)
echo "📁 Criando camadas em src/..."
mkdir -p src/services/api
mkdir -p src/store
mkdir -p src/hooks
mkdir -p src/types
mkdir -p src/utils
mkdir -p src/constants
mkdir -p src/mocks

# 5. Arquivos-base para a História de Usuário de PRODUTO
echo "📄 Criando arquivos-base do módulo de Produto..."
touch src/types/produto.ts
touch src/services/produtos.service.ts
touch src/mocks/produtos.mock.ts
touch src/components/produto/ProductCard.tsx
touch src/components/produto/ProductList.tsx
touch src/components/produto/ProductFilters.tsx
touch src/components/produto/ProductDetails.tsx
touch src/components/feedback/LoadingState.tsx
touch src/components/feedback/EmptyState.tsx
touch src/components/feedback/ErrorState.tsx

echo "✅ Sucesso! Estrutura recomendada criada e pronta para o desenvolvimento."