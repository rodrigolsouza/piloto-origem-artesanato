'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Box,
  Flex,
  Text,
  Grid,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Select,
  FormErrorMessage,
  Badge,
  Image,
  useToast,
} from '@chakra-ui/react';
import { ArrowLeft, Check, ImageIcon, ShieldCheck, Truck } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { produtosService } from '@/services/produtos.service';

export default function NovoProdutoLotePage() {
  const router = useRouter();
  const toast = useToast();

  const [isLoading, setIsLoading] = useState(false);
  const [erros, setErros] = useState<Record<string, string>>({});

  const [formData, setFormData] = useState({
    sku: '',
    titulo: '',
    descricao: '',
    categoria: 'Cerâmica Tradicional',
    materiaPrima: '',
    tecnica: '',
    regiaoProducao: 'Caruaru, PE',
    nomeArtesao: 'Severino Vitalino',
    preco: '',
    quantidadeEstoque: '',
    prazoProducao: '',
    dimensoes: {
      altura: '',
      largura: '',
      profundidade: '',
      peso: '',
    },
    guiaCuidados: '',
    urlFotoPrincipal: 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=800&q=80',
    fotoAdicional1: '',
    fotoAdicional2: '',
    fotoAdicional3: '',
  });

  const validarFormulario = () => {
    const novosErros: Record<string, string> = {};

    if (!formData.titulo.trim()) novosErros.titulo = 'O título do lote é obrigatório';
    if (!formData.descricao.trim()) novosErros.descricao = 'A história e significado cultural são obrigatórios';
    if (!formData.materiaPrima.trim()) novosErros.materiaPrima = 'Informe a matéria-prima principal';
    if (!formData.tecnica.trim()) novosErros.tecnica = 'Informe a técnica utilizada';

    const precoNum = parseFloat(formData.preco.replace(',', '.'));
    if (!formData.preco || isNaN(precoNum) || precoNum <= 0) {
      novosErros.preco = 'Preço obrigatório';
    }

    const estoqueNum = parseInt(formData.quantidadeEstoque, 10);
    if (!formData.quantidadeEstoque || isNaN(estoqueNum) || estoqueNum < 1) {
      novosErros.quantidadeEstoque = 'Mínimo 1 peça';
    }

    const prazoNum = parseInt(formData.prazoProducao, 10);
    if (formData.prazoProducao === '' || isNaN(prazoNum) || prazoNum < 0) {
      novosErros.prazoProducao = 'Obrigatório';
    }

    if (!formData.dimensoes.altura) novosErros.altura = 'Obrigatório';
    if (!formData.dimensoes.largura) novosErros.largura = 'Obrigatório';
    if (!formData.dimensoes.profundidade) novosErros.profundidade = 'Obrigatório';
    if (!formData.dimensoes.peso) novosErros.peso = 'Obrigatório';

    if (!formData.urlFotoPrincipal.trim()) {
      novosErros.urlFotoPrincipal = 'Informe a URL da foto principal';
    }

    setErros(novosErros);
    return Object.keys(novosErros).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validarFormulario()) {
      toast({
        title: 'Verifique os campos obrigatórios',
        description: 'Há campos pendentes no formulário de lote.',
        status: 'error',
        duration: 3500,
        isClosable: true,
      });
      return;
    }

    try {
      setIsLoading(true);

      const listaImagens = [
        formData.urlFotoPrincipal.trim(),
        formData.fotoAdicional1.trim(),
        formData.fotoAdicional2.trim(),
        formData.fotoAdicional3.trim(),
      ].filter(Boolean);

      // Gera ID sequencial padronizado no formato prod-xxx para garantir a rota /produtos/prod-xxx
      const idGerado = `prod-${Date.now().toString().slice(-3)}`;
      const skuGerado = formData.sku.trim() || `LOT-${Date.now().toString().slice(-4)}`;

      const novoProduto = await produtosService.criar({
        id: idGerado,
        sku: skuGerado,
        titulo: formData.titulo.trim(),
        descricao: formData.descricao.trim(),
        materiaPrima: formData.materiaPrima.trim(),
        tecnica: formData.tecnica.trim(),
        regiaoProducao: formData.regiaoProducao,
        categoria: formData.categoria,
        preco: parseFloat(formData.preco.replace(',', '.')),
        tipo: 'lote',
        quantidadeEstoque: parseInt(formData.quantidadeEstoque, 10),
        prazoProducao: parseInt(formData.prazoProducao, 10),
        idArtesao: 'art-001',
        nomeArtesao: formData.nomeArtesao || 'Severino Vitalino',
        dimensoes: {
          altura: parseFloat(formData.dimensoes.altura),
          largura: parseFloat(formData.dimensoes.largura),
          profundidade: parseFloat(formData.dimensoes.profundidade),
          peso: parseFloat(formData.dimensoes.peso),
        },
        guiaCuidados: formData.guiaCuidados.trim() || 'Limpar com pano seco ou espanador.',
        galeriaImagens: listaImagens,
        ativo: true,
      });

      toast({
        title: 'Lote cadastrado com sucesso!',
        description: `${novoProduto.titulo} já está disponível na vitrine.`,
        status: 'success',
        duration: 3500,
        isClosable: true,
      });

      // Redireciona diretamente para a tela de visualização do produto criado
      router.push(`/produtos/${novoProduto.id}`);
    } catch (error) {
      toast({
        title: 'Erro de conexão',
        description: 'Não foi possível salvar na API.',
        status: 'error',
        duration: 3500,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const steps = [
    { label: 'Informações Básicas', status: 'active' },
    { label: 'Fotos da Peça', status: 'pending' },
    { label: 'História & Descrição', status: 'pending' },
    { label: 'Materiais & Dimensões', status: 'pending' },
    { label: 'Preço & Estoque (Lote)', status: 'pending' },
  ];

  return (
    <Box maxW="7xl" mx="auto" px={{ base: 4, lg: 8 }} py={6}>
      <Grid templateColumns={{ base: '1fr', lg: '220px 1fr 280px' }} gap={6} alignItems="start">
        
        {/* COLUNA 1: Stepper Lateral Idêntico ao Protótipo */}
        <Box bg="white" p={4} borderRadius="xl" borderWidth="1px" borderColor="gray.200" position="sticky" top="84px">
          <Text fontSize="xs" fontWeight="bold" color="gray.900" mb={1}>
            Cadastro Peça / Lote
          </Text>
          <Text fontSize="2xs" color="gray.400" mb={4} lineHeight="short">
            Siga as etapas para disponibilizar o lote no catálogo artesanal
          </Text>

          <Flex direction="column" gap={3}>
            {steps.map((step, idx) => (
              <Flex key={idx} align="center" gap={2.5}>
                {step.status === 'active' ? (
                  <Flex w={5} h={5} borderRadius="full" bg="brand.yellow" color="brand.dark" align="center" justify="center" fontSize="2xs" fontWeight="bold">
                    <Check size={12} strokeWidth={3} />
                  </Flex>
                ) : (
                  <Flex w={5} h={5} borderRadius="full" bg="gray.100" color="gray.500" align="center" justify="center" fontSize="2xs" fontWeight="semibold">
                    {idx + 1}
                  </Flex>
                )}
                <Text fontSize="2xs" fontWeight={step.status === 'active' ? 'bold' : 'medium'} color={step.status === 'active' ? 'gray.900' : 'gray.500'}>
                  {step.label}
                </Text>
              </Flex>
            ))}
          </Flex>
        </Box>

        {/* COLUNA 2: Formulário Central em Cards Modulares */}
        <Box as="form" onSubmit={handleSubmit} display="flex" flexDirection="column" gap={5}>
          
          {/* 1. Informações Básicas */}
          <Box bg="white" p={5} borderRadius="xl" borderWidth="1px" borderColor="gray.200">
            <Flex justify="space-between" align="center" mb={3}>
              <Text fontSize="xs" fontWeight="bold" color="gray.900">
                1. Informações Básicas
              </Text>
              <Badge bg="brand.yellow" color="brand.dark" fontSize="3xs" px={2} py={0.5} borderRadius="sm">
                LOTE
              </Badge>
            </Flex>

            <FormControl mb={3} isInvalid={!!erros.titulo}>
              <FormLabel fontSize="2xs" fontWeight="bold" color="gray.600" mb={1}>TÍTULO DO PRODUTO *</FormLabel>
              <Input
                size="sm"
                placeholder="Ex: Tigela de Cerâmica Vitrificada Tradicional"
                value={formData.titulo}
                onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
                borderRadius="md"
              />
              <FormErrorMessage fontSize="3xs">{erros.titulo}</FormErrorMessage>
            </FormControl>

            <Grid templateColumns={{ base: '1fr', md: '1fr 1fr' }} gap={3} mb={3}>
              <FormControl>
                <FormLabel fontSize="2xs" fontWeight="bold" color="gray.600" mb={1}>CATEGORIA</FormLabel>
                <Select
                  size="sm"
                  value={formData.categoria}
                  onChange={(e) => setFormData({ ...formData, categoria: e.target.value })}
                  borderRadius="md"
                >
                  <option value="Cerâmica Tradicional">Cerâmica Tradicional</option>
                  <option value="Madeira e Xilogravura">Madeira e Xilogravura</option>
                  <option value="Fibras Naturais">Fibras Naturais</option>
                  <option value="Rendas e Bordados">Rendas e Bordados</option>
                </Select>
              </FormControl>

              <FormControl>
                <FormLabel fontSize="2xs" fontWeight="bold" color="gray.600" mb={1}>POLO DE ORIGEM</FormLabel>
                <Input
                  size="sm"
                  value={formData.regiaoProducao}
                  onChange={(e) => setFormData({ ...formData, regiaoProducao: e.target.value })}
                  borderRadius="md"
                />
              </FormControl>
            </Grid>

            <FormControl>
              <FormLabel fontSize="2xs" fontWeight="bold" color="gray.600" mb={1}>NOME DO ARTESÃO</FormLabel>
              <Input
                size="sm"
                value={formData.nomeArtesao}
                onChange={(e) => setFormData({ ...formData, nomeArtesao: e.target.value })}
                borderRadius="md"
              />
            </FormControl>
          </Box>

          {/* 2. Fotos da Peça (Padrão Idêntico ao seu Modelo com Dropzone e Slots) */}
          <Box bg="white" p={5} borderRadius="xl" borderWidth="1px" borderColor="gray.200">
            <Flex justify="space-between" align="center" mb={3}>
              <Text fontSize="xs" fontWeight="bold" color="gray.900">
                2. Fotos da Peça
              </Text>
              <Text fontSize="3xs" color="gray.400">Proporção 1:1 sugerida</Text>
            </Flex>

            <FormControl mb={3} isInvalid={!!erros.urlFotoPrincipal}>
              <FormLabel fontSize="2xs" fontWeight="bold" color="gray.600" mb={1}>URL DA IMAGEM PRINCIPAL *</FormLabel>
              <Input
                size="sm"
                placeholder="https://images.unsplash.com/..."
                value={formData.urlFotoPrincipal}
                onChange={(e) => setFormData({ ...formData, urlFotoPrincipal: e.target.value })}
                borderRadius="md"
              />
              <FormErrorMessage fontSize="3xs">{erros.urlFotoPrincipal}</FormErrorMessage>
            </FormControl>

            <Grid templateColumns={{ base: '1fr', md: '1.2fr 1fr' }} gap={4} alignItems="center">
              {/* Box Principal Pontilhado */}
              <Box
                borderWidth="1.5px"
                borderStyle="dashed"
                borderColor="gray.300"
                borderRadius="xl"
                h="150px"
                display="flex"
                flexDirection="column"
                alignItems="center"
                justifyContent="center"
                bg="gray.50"
                overflow="hidden"
                position="relative"
              >
                {formData.urlFotoPrincipal ? (
                  <Image
                    src={formData.urlFotoPrincipal}
                    alt="Preview Principal"
                    w="full"
                    h="full"
                    objectFit="cover"
                  />
                ) : (
                  <>
                    <ImageIcon size={26} color="#A0AEC0" />
                    <Text fontSize="3xs" color="gray.400" mt={1}>Foto Principal / Destaque</Text>
                  </>
                )}
              </Box>

              {/* Slots de Fotos Adicionais Pontilhados */}
              <Box>
                <Text fontSize="3xs" fontWeight="bold" color="gray.500" mb={2} textTransform="uppercase">
                  Fotos Adicionais
                </Text>
                <Grid templateColumns="repeat(3, 1fr)" gap={2}>
                  {[1, 2, 3].map((num) => {
                    const campo = `fotoAdicional${num}` as keyof typeof formData;
                    const val = formData[campo] as string;
                    return (
                      <Box
                        key={num}
                        borderWidth="1px"
                        borderStyle="dashed"
                        borderColor="gray.300"
                        borderRadius="md"
                        h="55px"
                        bg="gray.50"
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                        overflow="hidden"
                      >
                        {val ? (
                          <Image src={val} alt={`Foto ${num}`} w="full" h="full" objectFit="cover" />
                        ) : (
                          <Text fontSize="3xs" color="gray.400">Foto {num + 1}</Text>
                        )}
                      </Box>
                    );
                  })}
                </Grid>
                <Input
                  mt={2}
                  size="xs"
                  placeholder="URL Foto 2 (opcional)"
                  value={formData.fotoAdicional1}
                  onChange={(e) => setFormData({ ...formData, fotoAdicional1: e.target.value })}
                  borderRadius="md"
                />
              </Box>
            </Grid>
          </Box>

          {/* 3. História & Descrição */}
          <Box bg="white" p={5} borderRadius="xl" borderWidth="1px" borderColor="gray.200">
            <Flex justify="space-between" align="center" mb={1}>
              <Text fontSize="xs" fontWeight="bold" color="gray.900">
                3. História & Descrição *
              </Text>
              <Badge colorScheme="purple" fontSize="3xs">CULTURA PERNAMBUCANA</Badge>
            </Flex>
            <Text fontSize="3xs" color="gray.400" mb={3}>Contexto cultural e tradição artesanal</Text>

            <FormControl isInvalid={!!erros.descricao}>
              <Textarea
                size="sm"
                placeholder="Descreva a história por trás desta linha e/ou artesanato cultural..."
                value={formData.descricao}
                onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
                borderRadius="md"
                rows={3}
              />
              <FormErrorMessage fontSize="3xs">{erros.descricao}</FormErrorMessage>
            </FormControl>
          </Box>

          {/* 4. Materiais & Dimensões */}
          <Box bg="white" p={5} borderRadius="xl" borderWidth="1px" borderColor="gray.200">
            <Text fontSize="xs" fontWeight="bold" color="gray.900" mb={3}>
              4. Materiais & Dimensões
            </Text>

            <Grid templateColumns={{ base: '1fr', md: '1fr 1fr' }} gap={3} mb={3}>
              <FormControl isInvalid={!!erros.materiaPrima}>
                <FormLabel fontSize="2xs" fontWeight="bold" color="gray.600" mb={1}>MATÉRIA-PRIMA *</FormLabel>
                <Input
                  size="sm"
                  placeholder="Ex: Argila e pigmento mineral"
                  value={formData.materiaPrima}
                  onChange={(e) => setFormData({ ...formData, materiaPrima: e.target.value })}
                  borderRadius="md"
                />
                <FormErrorMessage fontSize="3xs">{erros.materiaPrima}</FormErrorMessage>
              </FormControl>

              <FormControl isInvalid={!!erros.tecnica}>
                <FormLabel fontSize="2xs" fontWeight="bold" color="gray.600" mb={1}>TÉCNICA *</FormLabel>
                <Input
                  size="sm"
                  placeholder="Ex: Modelagem manual / Queima a lenha"
                  value={formData.tecnica}
                  onChange={(e) => setFormData({ ...formData, tecnica: e.target.value })}
                  borderRadius="md"
                />
                <FormErrorMessage fontSize="3xs">{erros.tecnica}</FormErrorMessage>
              </FormControl>
            </Grid>

            <Grid templateColumns="repeat(4, 1fr)" gap={2} mb={3}>
              <FormControl isInvalid={!!erros.altura}>
                <FormLabel fontSize="3xs" color="gray.600" mb={0.5}>ALTURA (cm)</FormLabel>
                <Input
                  size="xs"
                  placeholder="15"
                  value={formData.dimensoes.altura}
                  onChange={(e) => setFormData({ ...formData, dimensoes: { ...formData.dimensoes, altura: e.target.value } })}
                  borderRadius="md"
                />
              </FormControl>

              <FormControl isInvalid={!!erros.largura}>
                <FormLabel fontSize="3xs" color="gray.600" mb={0.5}>LARGURA (cm)</FormLabel>
                <Input
                  size="xs"
                  placeholder="20"
                  value={formData.dimensoes.largura}
                  onChange={(e) => setFormData({ ...formData, dimensoes: { ...formData.dimensoes, largura: e.target.value } })}
                  borderRadius="md"
                />
              </FormControl>

              <FormControl isInvalid={!!erros.profundidade}>
                <FormLabel fontSize="3xs" color="gray.600" mb={0.5}>PROF. (cm)</FormLabel>
                <Input
                  size="xs"
                  placeholder="8"
                  value={formData.dimensoes.profundidade}
                  onChange={(e) => setFormData({ ...formData, dimensoes: { ...formData.dimensoes, profundidade: e.target.value } })}
                  borderRadius="md"
                />
              </FormControl>

              <FormControl isInvalid={!!erros.peso}>
                <FormLabel fontSize="3xs" color="gray.600" mb={0.5}>PESO (kg)</FormLabel>
                <Input
                  size="xs"
                  placeholder="1.2"
                  value={formData.dimensoes.peso}
                  onChange={(e) => setFormData({ ...formData, dimensoes: { ...formData.dimensoes, peso: e.target.value } })}
                  borderRadius="md"
                />
              </FormControl>
            </Grid>

            <FormControl>
              <FormLabel fontSize="2xs" fontWeight="bold" color="gray.600" mb={1}>INSTRUÇÃO DE CUIDADOS</FormLabel>
              <Input
                size="sm"
                placeholder="Ex: Limpar com pano seco e evitar produtos abrasivos"
                value={formData.guiaCuidados}
                onChange={(e) => setFormData({ ...formData, guiaCuidados: e.target.value })}
                borderRadius="md"
              />
            </FormControl>
          </Box>

          {/* 5. Preço & Controle de Lote (PI4-92, PI4-93, PI4-94, PI4-95) */}
          <Box bg="white" p={5} borderRadius="xl" borderWidth="1px" borderColor="gray.200">
            <Text fontSize="xs" fontWeight="bold" color="gray.900" mb={3}>
              5. Preço & Controle de Lote
            </Text>

            <Grid templateColumns="repeat(3, 1fr)" gap={3}>
              <FormControl isInvalid={!!erros.preco}>
                <FormLabel fontSize="2xs" fontWeight="bold" color="gray.600" mb={1}>PREÇO (R$) *</FormLabel>
                <Input
                  size="sm"
                  placeholder="140,00"
                  value={formData.preco}
                  onChange={(e) => setFormData({ ...formData, preco: e.target.value })}
                  borderRadius="md"
                />
                <FormErrorMessage fontSize="3xs">{erros.preco}</FormErrorMessage>
              </FormControl>

              <FormControl isInvalid={!!erros.quantidadeEstoque}>
                <FormLabel fontSize="2xs" fontWeight="bold" color="gray.600" mb={1}>ESTOQUE (LOTE) *</FormLabel>
                <Input
                  size="sm"
                  type="number"
                  min="1"
                  placeholder="10"
                  value={formData.quantidadeEstoque}
                  onChange={(e) => setFormData({ ...formData, quantidadeEstoque: e.target.value })}
                  borderRadius="md"
                />
                <FormErrorMessage fontSize="3xs">{erros.quantidadeEstoque}</FormErrorMessage>
              </FormControl>

              <FormControl isInvalid={!!erros.prazoProducao}>
                <FormLabel fontSize="2xs" fontWeight="bold" color="gray.600" mb={1}>PRAZO PRODUÇÃO (DIAS) *</FormLabel>
                <Input
                  size="sm"
                  type="number"
                  min="0"
                  placeholder="5"
                  value={formData.prazoProducao}
                  onChange={(e) => setFormData({ ...formData, prazoProducao: e.target.value })}
                  borderRadius="md"
                />
                <FormErrorMessage fontSize="3xs">{erros.prazoProducao}</FormErrorMessage>
              </FormControl>
            </Grid>
          </Box>

          {/* Botão de Publicação */}
          <Flex justify="flex-end" pt={2}>
            <Button
              type="submit"
              variantStyle="primary"
              isLoading={isLoading}
              size="md"
              w={{ base: 'full', sm: 'auto' }}
              px={8}
            >
              Publicar Peça em Lote
            </Button>
          </Flex>
        </Box>

        {/* COLUNA 3: Pré-visualização Idêntica ao Protótipo */}
        <Box position="sticky" top="84px">
          <Box bg="white" p={4} borderRadius="xl" borderWidth="1px" borderColor="gray.200" boxShadow="sm">
            <Flex justify="space-between" align="center" mb={2}>
              <Text fontSize="2xs" fontWeight="bold" color="gray.500">
                PRÉ-VISUALIZAÇÃO
              </Text>
              <Badge colorScheme="purple" fontSize="3xs">EM TEMPO REAL</Badge>
            </Flex>

            {/* Imagem do Card */}
            <Box borderRadius="lg" overflow="hidden" mb={3} position="relative" pt="85%" bg="gray.100">
              <Image
                src={formData.urlFotoPrincipal || 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=800&q=80'}
                alt="Preview"
                position="absolute"
                top={0}
                left={0}
                w="full"
                h="full"
                objectFit="cover"
              />
            </Box>

            <Text fontSize="3xs" color="gray.400" mb={0.5}>
              {formData.regiaoProducao || 'Caruaru, PE'}
            </Text>

            <Text fontSize="xs" fontWeight="bold" color="gray.900" noOfLines={1} mb={0.5}>
              {formData.titulo || 'Nome da Peça'}
            </Text>

            <Text fontSize="3xs" color="gray.500" mb={2}>
              {formData.nomeArtesao || 'Mestre Artesão'}
            </Text>

            <Flex justify="space-between" align="baseline" pt={2} borderTopWidth="1px" borderColor="gray.100" mb={3}>
              <Text fontSize="sm" fontWeight="black" color="gray.900">
                R$ {formData.preco ? formData.preco : '0,00'}
              </Text>
              <Badge colorScheme="green" fontSize="3xs">
                {formData.quantidadeEstoque ? `${formData.quantidadeEstoque} UNIDADES` : 'EM LOTE'}
              </Badge>
            </Flex>

            <Flex direction="column" gap={1.5} fontSize="3xs" color="gray.500" pt={2} borderTopWidth="1px" borderColor="gray.100">
              <Flex align="center" gap={1.5}>
                <Truck size={11} color="#C25E2E" />
                <Text>
                  {formData.prazoProducao === '0' || formData.prazoProducao === '' 
                    ? 'Pronta entrega ou sob encomenda' 
                    : `Produção: ${formData.prazoProducao} dias úteis`}
                </Text>
              </Flex>
              <Flex align="center" gap={1.5}>
                <ShieldCheck size={11} color="#38A169" />
                <Text>Obra artesanal com selo de origem</Text>
              </Flex>
            </Flex>
          </Box>
        </Box>

      </Grid>
    </Box>
  );
}