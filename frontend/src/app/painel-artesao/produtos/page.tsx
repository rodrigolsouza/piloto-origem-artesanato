'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Box,
  Flex,
  Text,
  Grid,
  Badge,
  Image,
  Input,
  Textarea,
  FormControl,
  FormLabel,
  FormErrorMessage,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  useDisclosure,
  useToast,
  Spinner,
} from '@chakra-ui/react';
import { Edit3, Plus, ExternalLink, Package, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { produtosService } from '@/services/produtos.service';
import { Produto } from '@/types/produto';

export default function GerenciarCatalogoPage() {
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [salvando, setSalvando] = useState(false);

  // Estado do item em edição (PI4-129)
  const [produtoEditando, setProdutoEditando] = useState<Produto | null>(null);
  const [precoEdit, setPrecoEdit] = useState('');
  const [descricaoEdit, setDescricaoEdit] = useState('');
  const [erroPreco, setErroPreco] = useState<string | null>(null);

  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  useEffect(() => {
    let ativo = true;

    async function carregarDados() {
      try {
        const dados = await produtosService.listar();
        if (ativo) {
          setProdutos(dados);
        }
      } catch (error) {
        if (ativo) {
          toast({
            title: 'Erro ao carregar catálogo',
            description: 'Verifique se a fake API está em execução.',
            status: 'error',
            duration: 3000,
          });
        }
      } finally {
        if (ativo) {
          setCarregando(false);
        }
      }
    }

    carregarDados();

    return () => {
      ativo = false;
    };
  }, [toast]);

  // Abrir modal de edição preenchendo os campos
  const handleAbrirEdicao = (prod: Produto) => {
    setProdutoEditando(prod);
    setPrecoEdit(prod.preco.toString());
    setDescricaoEdit(prod.descricao || '');
    setErroPreco(null);
    onOpen();
  };

  // Validação em tempo real (PI4-130)
  const validarPreco = (valor: string): boolean => {
    const valorTratado = valor.replace(',', '.').trim();
    const num = parseFloat(valorTratado);

    if (!valorTratado || isNaN(num)) {
      setErroPreco('Informe um valor numérico válido.');
      return false;
    }
    if (num <= 0) {
      setErroPreco('O preço deve ser estritamente maior que zero (R$ > 0,00).');
      return false;
    }

    setErroPreco(null);
    return true;
  };

  const handleSalvarEdicao = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validarPreco(precoEdit) || !produtoEditando) {
      return;
    }

    try {
      setSalvando(true);
      const novoPreco = parseFloat(precoEdit.replace(',', '.'));

      // Chamada PATCH conforme Contrato da API (PI4-129)
      const produtoAtualizado = await produtosService.atualizar(produtoEditando.id, {
        preco: novoPreco,
        descricao: descricaoEdit.trim(),
      });

      // Atualiza o estado da lista em tempo real
      setProdutos((lista) =>
        lista.map((item) => (item.id === produtoAtualizado.id ? { ...item, ...produtoAtualizado } : item))
      );

      toast({
        title: 'Produto atualizado com sucesso!',
        description: `O preço de ${produtoAtualizado.titulo} foi alterado para R$ ${novoPreco.toFixed(2).replace('.', ',')}.`,
        status: 'success',
        duration: 3500,
        isClosable: true,
      });

      onClose();
    } catch (error) {
      toast({
        title: 'Erro ao salvar alterações',
        description: 'Não foi possível atualizar o produto na API.',
        status: 'error',
        duration: 3500,
        isClosable: true,
      });
    } finally {
      setSalvando(false);
    }
  };

  return (
    <Box maxW="7xl" mx="auto" px={{ base: 4, lg: 8 }} py={8}>
      {/* Cabeçalho do Catálogo */}
      <Flex direction={{ base: 'column', md: 'row' }} justify="space-between" align={{ md: 'center' }} gap={4} mb={8}>
        <Box>
          <Flex align="center" gap={2} mb={1}>
            <Text fontSize="2xl" fontWeight="black" color="gray.900">
              Gerenciar Catálogo
            </Text>
            <Badge bg="brand.yellow" color="brand.dark" fontSize="2xs" px={2} py={0.5} borderRadius="md">
              HU-21
            </Badge>
          </Flex>
          <Text fontSize="xs" color="gray.500">
            Painel de manutenção de preços, descrições e estoque das peças artesanais cadastradas.
          </Text>
        </Box>

        <Flex gap={2}>
          <Link href="/painel-artesao/produtos/novo-unico">
            <Button variantStyle="primary" size="sm" leftIcon={<Plus size={14} />}>
              Peça Única
            </Button>
          </Link>
          <Link href="/painel-artesao/produtos/novo-lote">
            <Button variantStyle="accent" size="sm" leftIcon={<Plus size={14} />}>
              Nova Peça / Lote
            </Button>
          </Link>
        </Flex>
      </Flex>

      {/* Listagem de Obras / Listing Management */}
      {carregando ? (
        <Flex justify="center" align="center" py={20}>
          <Spinner size="xl" color="brand.clay" />
        </Flex>
      ) : produtos.length === 0 ? (
        <Box bg="white" p={10} borderRadius="2xl" borderWidth="1px" borderColor="gray.200" textAlign="center">
          <Package size={40} className="mx-auto mb-3 text-gray-400" />
          <Text fontWeight="bold" color="gray.700" mb={1}>Nenhum produto cadastrado no catálogo.</Text>
          <Text fontSize="xs" color="gray.500" mb={4}>Cadastre sua primeira peça única ou lote para começar a gerenciar.</Text>
        </Box>
      ) : (
        <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' }} gap={6}>
          {produtos.map((prod) => (
            <Box
              key={prod.id}
              bg="white"
              borderWidth="1px"
              borderColor="gray.200"
              borderRadius="2xl"
              overflow="hidden"
              boxShadow="sm"
              display="flex"
              flexDirection="column"
              transition="all 0.2s"
              _hover={{ boxShadow: 'md' }}
            >
              {/* Imagem com Proporção Fixa e Badges */}
              <Box position="relative" w="full" pt="60%" bg="gray.100" overflow="hidden">
                <Image
                  src={prod.galeriaImagens?.[0] || 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=800&q=80'}
                  alt={prod.titulo}
                  position="absolute"
                  top={0}
                  left={0}
                  w="full"
                  h="full"
                  objectFit="cover"
                />
                <Badge
                  position="absolute"
                  top={3}
                  left={3}
                  bg="whiteAlpha.900"
                  color="gray.800"
                  fontSize="3xs"
                  fontWeight="bold"
                  borderRadius="md"
                  px={2}
                  py={0.5}
                >
                  {prod.tipo === 'unico' ? 'Peça Única' : 'Lote'}
                </Badge>
                <Badge
                  position="absolute"
                  top={3}
                  right={3}
                  colorScheme={prod.ativo !== false ? 'green' : 'gray'}
                  fontSize="3xs"
                  borderRadius="md"
                >
                  {prod.ativo !== false ? 'Ativo' : 'Pausado'}
                </Badge>
              </Box>

              {/* Informações da Peça */}
              <Box p={5} flex="1" display="flex" flexDirection="column">
                <Text fontSize="3xs" color="gray.400" fontWeight="bold" textTransform="uppercase" mb={1}>
                  SKU: {prod.sku || prod.id}
                </Text>
                <Text fontSize="sm" fontWeight="bold" color="gray.900" noOfLines={1} mb={1}>
                  {prod.titulo}
                </Text>
                <Text fontSize="2xs" color="gray.600" noOfLines={2} mb={4} lineHeight="short">
                  {prod.descricao || 'Sem descrição cadastrada.'}
                </Text>

                <Flex justify="space-between" align="baseline" pt={3} borderTopWidth="1px" borderColor="gray.100" mt="auto">
                  <Box>
                    <Text fontSize="3xs" color="gray.400" fontWeight="bold">PREÇO ATUAL</Text>
                    <Text fontSize="md" fontWeight="black" color="gray.900">
                      R$ {prod.preco ? prod.preco.toFixed(2).replace('.', ',') : '0,00'}
                    </Text>
                  </Box>
                  <Text fontSize="2xs" color="gray.500">
                    Estoque: <strong>{prod.quantidadeEstoque} un.</strong>
                  </Text>
                </Flex>

                {/* Ações Rápidas (PI4-128 & PI4-129) */}
                <Flex gap={2} mt={4}>
                  <Button
                    variantStyle="accent"
                    size="sm"
                    w="full"
                    leftIcon={<Edit3 size={13} />}
                    onClick={() => handleAbrirEdicao(prod)}
                  >
                    Editar
                  </Button>
                  <Link href={`/produtos/${prod.id}`} target="_blank">
                    <Box
                      as="button"
                      p={2.5}
                      borderRadius="lg"
                      borderWidth="1px"
                      borderColor="gray.200"
                      _hover={{ bg: 'gray.50' }}
                      title="Ver na vitrine pública"
                    >
                      <ExternalLink size={14} className="text-gray-600" />
                    </Box>
                  </Link>
                </Flex>
              </Box>
            </Box>
          ))}
        </Grid>
      )}

      {/* Modal de Manutenção e Edição Rápida (PI4-129 & PI4-130) */}
      <Modal isOpen={isOpen} onClose={onClose} size="lg" isCentered>
        <ModalOverlay bg="blackAlpha.600" backdropFilter="blur(3px)" />
        <ModalContent as="form" onSubmit={handleSalvarEdicao} borderRadius="2xl" p={2}>
          <ModalHeader fontSize="sm" fontWeight="bold" pb={2}>
            Editar Produto — {produtoEditando?.titulo}
          </ModalHeader>
          <ModalCloseButton />

          <ModalBody>
            <Flex direction="column" gap={4}>
              <Flex p={3} bg="amber.50" borderRadius="lg" gap={2} align="center" fontSize="2xs" color="amber.900">
                <AlertCircle size={15} className="shrink-0 text-amber-700" />
                <Text>
                  Alterações de preço e descrição entram em vigor imediatamente na vitrine pública via atualização parcial (PATCH).
                </Text>
              </Flex>

              {/* Campo Preço com Validação Estrita (PI4-130) */}
              <FormControl isRequired isInvalid={!!erroPreco}>
                <FormLabel fontSize="2xs" fontWeight="bold" color="gray.700" mb={1}>
                  PREÇO (R$) *
                </FormLabel>
                <Input
                  size="md"
                  fontSize="sm"
                  fontWeight="bold"
                  placeholder="Ex: 140.00"
                  value={precoEdit}
                  onChange={(e) => {
                    setPrecoEdit(e.target.value);
                    validarPreco(e.target.value);
                  }}
                  borderRadius="lg"
                />
                <FormErrorMessage fontSize="2xs" fontWeight="medium">
                  {erroPreco}
                </FormErrorMessage>
              </FormControl>

              {/* Campo Descrição Cultural (PI4-129) */}
              <FormControl>
                <FormLabel fontSize="2xs" fontWeight="bold" color="gray.700" mb={1}>
                  HISTÓRIA & DESCRIÇÃO CULTURAL
                </FormLabel>
                <Textarea
                  size="sm"
                  rows={4}
                  value={descricaoEdit}
                  onChange={(e) => setDescricaoEdit(e.target.value)}
                  placeholder="Descreva a história e técnicas da peça..."
                  borderRadius="lg"
                />
              </FormControl>
            </Flex>
          </ModalBody>

          <ModalFooter gap={2} pt={4}>
            <Button variantStyle="secondary" size="sm" onClick={onClose} isDisabled={salvando}>
              Cancelar
            </Button>
            <Button
              variantStyle="accent"
              size="sm"
              type="submit"
              isLoading={salvando}
              isDisabled={!!erroPreco}
            >
              Salvar Alterações
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
}